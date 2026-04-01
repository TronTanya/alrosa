/** OAuth-токен Яндекс ID (доступ к календарю) — только в localStorage браузера */
export const YANDEX_CALENDAR_TOKEN_KEY = "alrosa_yandex_calendar_oauth";

/** Фиксированный путь callback — зарегистрируйте в кабинете OAuth: {origin}/employee/calendar */
export const YANDEX_CALENDAR_REDIRECT_PATH = "/employee/calendar";

export type YandexCalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  hint?: string;
};

/** Полный redirect_uri для authorize и token (без зависимости от текущего URL страницы). */
export function getYandexCalendarRedirectUri(): string {
  if (typeof window === "undefined") return "";
  return new URL(YANDEX_CALENDAR_REDIRECT_PATH, window.location.origin).href.replace(/\/+$/, "") || "";
}

function redirectUri(): string {
  return getYandexCalendarRedirectUri();
}

/** URL авторизации (добавьте state=yandex_calendar при редиректе). */
export function buildYandexCalendarAuthorizeUrl(): string {
  const clientId =
    typeof import.meta.env.VITE_YANDEX_OAUTH_CLIENT_ID === "string"
      ? import.meta.env.VITE_YANDEX_OAUTH_CLIENT_ID.trim()
      : "";
  if (!clientId) {
    throw new Error("Не задан VITE_YANDEX_OAUTH_CLIENT_ID (приложение на oauth.yandex.ru).");
  }
  const red = redirectUri();
  const scope = encodeURIComponent("calendar:read login:info");
  return (
    `https://oauth.yandex.ru/authorize?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(red)}` +
    `&scope=${scope}` +
    `&state=yandex_calendar`
  );
}

export function readStoredYandexToken(): string | null {
  try {
    return localStorage.getItem(YANDEX_CALENDAR_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeStoredYandexToken(token: string): void {
  localStorage.setItem(YANDEX_CALENDAR_TOKEN_KEY, token);
}

export function clearStoredYandexToken(): void {
  localStorage.removeItem(YANDEX_CALENDAR_TOKEN_KEY);
}

/** Обмен code → access_token (в dev через Vite middleware с client_secret). */
export async function exchangeYandexOAuthCode(code: string): Promise<{ access_token: string; expires_in?: number }> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri(),
  });
  const url = import.meta.env.DEV ? "/api/yandex/oauth/token" : "/api/yandex/oauth/token";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok) {
    throw new Error(data.error_description || data.error || `OAuth ${res.status}`);
  }
  if (!data.access_token) throw new Error("Нет access_token в ответе Яндекса");
  return { access_token: data.access_token, expires_in: undefined };
}

/** События за период (dev: middleware Vite; prod: нужен backend с тем же POST /api/yandex/calendar/events). */
export async function fetchYandexCalendarRange(
  accessToken: string,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<YandexCalendarEvent[]> {
  const res = await fetch("/api/yandex/calendar/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_token: accessToken,
      timeMin: rangeStart.toISOString(),
      timeMax: rangeEnd.toISOString(),
    }),
  });
  let data: {
    events?: Array<{ id: string; start: string; end: string; title: string; hint?: string }>;
    error?: string;
    detail?: unknown;
  };
  try {
    data = (await res.json()) as typeof data;
  } catch {
    throw new Error(
      !import.meta.env.DEV && (res.status === 404 || res.status === 405)
        ? `Маршрут /api/yandex/calendar/events недоступен (HTTP ${res.status}). Запустите приложение через npm run dev (middleware Vite) или поднимите backend с тем же API.`
        : `Не удалось разобрать ответ сервера (HTTP ${res.status}).`,
    );
  }
  if (!res.ok) {
    const base =
      typeof data.error === "string"
        ? `${data.error}${data.detail ? ` — ${JSON.stringify(data.detail).slice(0, 200)}` : ""}`
        : `HTTP ${res.status}`;
    if (res.status === 404 && !import.meta.env.DEV) {
      throw new Error(
        `${base}. Для Яндекс.Календаря в этой сборке нужен backend с маршрутом /api/yandex/calendar/events или запуск через npm run dev (middleware Vite).`,
      );
    }
    throw new Error(base);
  }
  const rows = data.events ?? [];
  return rows.map((e) => ({
    id: e.id,
    start: new Date(e.start),
    end: new Date(e.end),
    title: e.title,
    hint: e.hint,
  }));
}
