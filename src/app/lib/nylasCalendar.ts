import { ROUTE_PATHS } from "../routePaths";

/** localStorage: grant после Nylas Hosted OAuth */
export const NYLAS_GRANT_STORAGE_KEY = "nylas_grant_id";

/** Канонический callback без лишних слэшей — должен совпадать с URI в Nylas Dashboard. */
export function getNylasOAuthRedirectUri(): string {
  if (typeof window === "undefined") return "";
  return new URL(ROUTE_PATHS.employeeCalendar, window.location.origin).href;
}

/** Пусто = тот же origin (Vite proxy /nylas → localhost:8000). Иначе полный URL бэкенда, например http://localhost:8000 */
function apiBase(): string {
  const b = import.meta.env.VITE_NYLAS_API_BASE;
  return typeof b === "string" ? b.replace(/\/$/, "") : "";
}

async function parseError(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { detail?: string | unknown };
    if (typeof j.detail === "string") return j.detail;
    if (Array.isArray(j.detail)) return JSON.stringify(j.detail);
  } catch {
    /* ignore */
  }
  return await res.text().catch(() => res.statusText);
}

export async function fetchNylasAuthUrl(redirectUri: string): Promise<string> {
  const base = apiBase();
  const q = new URLSearchParams({ redirect_uri: redirectUri });
  const url = `${base}/nylas/auth/url?${q}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { url: string };
  if (!data.url) throw new Error("Пустой ответ: url");
  return data.url;
}

export async function exchangeNylasCode(code: string, redirectUri: string): Promise<{ grant_id: string; email?: string | null }> {
  const base = apiBase();
  const res = await fetch(`${base}/nylas/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirect_uri: redirectUri }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as { grant_id: string; email?: string | null };
}

export function readStoredNylasGrant(): string | null {
  try {
    return localStorage.getItem(NYLAS_GRANT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearStoredNylasGrant(): void {
  try {
    localStorage.removeItem(NYLAS_GRANT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Событие для общей сетки календаря (как Graph) */
export type ParsedNylasEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  hint?: string;
};

function unixToDate(secOrMs: number): Date {
  if (secOrMs > 1e12) return new Date(secOrMs);
  return new Date(secOrMs * 1000);
}

/** Разбор объекта события Nylas v3 (timespan / datespan / прочие поля). */
export function parseNylasEventRow(raw: Record<string, unknown>): ParsedNylasEvent | null {
  const id = String(raw.id ?? "");
  const title = String(raw.title ?? raw.description ?? "Событие").trim() || "Событие";
  const when = raw.when as Record<string, unknown> | undefined;
  let start: Date | null = null;
  let end: Date | null = null;

  if (when && typeof when === "object") {
    const o = (when.object as string) || "";
    if (o === "timespan" || when.start_time != null) {
      const st = when.start_time;
      const et = when.end_time;
      if (typeof st === "number") start = unixToDate(st);
      if (typeof et === "number") end = unixToDate(et);
    }
    if (o === "datespan" && typeof when.start_date === "string") {
      start = new Date(`${when.start_date}T00:00:00`);
      const ed = typeof when.end_date === "string" ? when.end_date : when.start_date;
      end = new Date(`${ed}T23:59:59`);
    }
  }

  if (!start) {
    const busy = raw.busy as Record<string, unknown> | undefined;
    if (busy && typeof busy.start_time === "number") {
      start = unixToDate(busy.start_time as number);
      if (typeof busy.end_time === "number") end = unixToDate(busy.end_time as number);
    }
  }

  if (!start) return null;
  if (!end) end = new Date(start.getTime() + 60 * 60 * 1000);
  if (!id) return { id: `nylas-${start.getTime()}-${title.slice(0, 8)}`, start, end, title, hint: "Nylas" };
  return { id: `nylas-${id}`, start, end, title, hint: "Nylas" };
}

/** Список событий за интервал (ISO в query). */
export async function fetchNylasEventsRange(grantId: string, rangeStart: Date, rangeEnd: Date): Promise<ParsedNylasEvent[]> {
  const base = apiBase();
  const q = new URLSearchParams({
    grant_id: grantId,
    start: rangeStart.toISOString(),
    end: rangeEnd.toISOString(),
  });
  const res = await fetch(`${base}/nylas/events?${q}`);
  if (!res.ok) throw new Error(await parseError(res));
  const json = (await res.json()) as { data?: unknown[] };
  const rows = Array.isArray(json.data) ? json.data : [];
  const out: ParsedNylasEvent[] = [];
  for (const item of rows) {
    if (!item || typeof item !== "object") continue;
    const p = parseNylasEventRow(item as Record<string, unknown>);
    if (p) out.push(p);
  }
  return out;
}
