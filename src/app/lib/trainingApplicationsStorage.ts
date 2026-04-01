import { estimateCourseEconomics } from "./courseEconomics";

const STORAGE_KEY = "alrosa_demo_training_applications_v1";

export const TRAINING_APPLICATIONS_UPDATED = "alrosa-training-applications-updated";

/** Макс. id в статическом демо-наборе HR — новые строки получают id выше */
const STATIC_HR_MAX_ID = 10;

export type HrCourseType = "внешний" | "внутренний" | "онлайн" | "конференция";

export type StoredTrainingApplication = {
  id: string;
  hrRowId: number;
  title: string;
  provider: string;
  url?: string;
  submittedAt: string;
  typeLabel: string;
  hrType: HrCourseType;
  /** Строка в таблице заявок целиком (если задана — вместо «Курс «title»») */
  listTitle?: string;
  /** Оценка дедлайна согласования/старта (ISO), бюджета и ROI — по каталогу провайдера/URL */
  deadlineIso?: string;
  budgetRub?: number;
  roiPercent?: number;
};

export const DEMO_PORTAL_EMPLOYEE = { employee: "Александр Иванов", dept: "Бэкенд" } as const;

function dispatchUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TRAINING_APPLICATIONS_UPDATED));
  }
}

function inferTypes(
  provider: string,
  mentorType?: "internal" | "external",
): { typeLabel: string; hrType: HrCourseType } {
  if (mentorType === "internal") return { typeLabel: "Внутреннее обучение", hrType: "внутренний" };
  if (mentorType === "external") return { typeLabel: "Внешнее обучение", hrType: "внешний" };
  const p = provider.toLowerCase();
  if (/корпоратив|алроса|внутрен|университет\s*ит/i.test(p)) {
    return { typeLabel: "Внутреннее обучение", hrType: "внутренний" };
  }
  if (/stepik|нетология|practicum|skillbox|geekbrains|hexlet|udemy|coursera|pluralsight/i.test(p)) {
    return { typeLabel: "Онлайн-курс", hrType: "онлайн" };
  }
  return { typeLabel: "Внешнее обучение", hrType: "внешний" };
}

export function readStoredTrainingApplications(): StoredTrainingApplication[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    let maxHr = STATIC_HR_MAX_ID;
    let changed = false;
    const out: StoredTrainingApplication[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const o = item as Partial<StoredTrainingApplication>;
      if (typeof o.title !== "string" || !o.title.trim()) continue;
      let hrRowId = typeof o.hrRowId === "number" ? o.hrRowId : null;
      if (hrRowId == null) {
        maxHr += 1;
        hrRowId = maxHr;
        changed = true;
      } else {
        maxHr = Math.max(maxHr, hrRowId);
      }
      const inferred = inferTypes(String(o.provider ?? ""), undefined);
      const typeLabel = typeof o.typeLabel === "string" ? o.typeLabel : inferred.typeLabel;
      const hrType: HrCourseType =
        o.hrType === "внешний" || o.hrType === "внутренний" || o.hrType === "онлайн" || o.hrType === "конференция"
          ? o.hrType
          : inferred.hrType;
      const listTitle = typeof o.listTitle === "string" && o.listTitle.trim() ? o.listTitle.trim() : undefined;
      const submittedAt = typeof o.submittedAt === "string" ? o.submittedAt : new Date().toISOString();
      const base: StoredTrainingApplication = {
        id: typeof o.id === "string" ? o.id : `legacy-${hrRowId}`,
        hrRowId,
        title: o.title.trim(),
        provider: typeof o.provider === "string" ? o.provider.trim() : "",
        url: typeof o.url === "string" ? o.url : undefined,
        submittedAt,
        typeLabel,
        hrType,
        ...(listTitle ? { listTitle } : {}),
      };
      const hasFullEcon =
        typeof o.deadlineIso === "string" &&
        typeof o.budgetRub === "number" &&
        Number.isFinite(o.budgetRub) &&
        typeof o.roiPercent === "number" &&
        Number.isFinite(o.roiPercent);
      const econ = hasFullEcon
        ? {
            deadlineIso: o.deadlineIso as string,
            budgetRub: o.budgetRub as number,
            roiPercent: o.roiPercent as number,
          }
        : estimateCourseEconomics(base.url, base.provider, base.title, submittedAt);
      out.push({ ...base, ...econ });
    }
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    return out;
  } catch {
    return [];
  }
}

export function submitTrainingApplication(input: {
  title: string;
  provider: string;
  url?: string;
  mentorType?: "internal" | "external";
  /** Подпись типа в таблице (например «ИПР / план развития») */
  typeLabelOverride?: string;
  /** Заголовок строки в списке заявок (полная формулировка) */
  listTitle?: string;
}): StoredTrainingApplication {
  const list = readStoredTrainingApplications();
  const maxHr = Math.max(STATIC_HR_MAX_ID, 0, ...list.map((x) => x.hrRowId));
  const hrRowId = maxHr + 1;
  const inferred = inferTypes(input.provider, input.mentorType);
  const typeLabel = input.typeLabelOverride?.trim() || inferred.typeLabel;
  const hrType = inferred.hrType;
  const listTitle = input.listTitle?.trim();
  const submittedAt = new Date().toISOString();
  const econ = estimateCourseEconomics(input.url, input.provider, input.title, submittedAt);
  const row: StoredTrainingApplication = {
    id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    hrRowId,
    title: input.title.trim(),
    provider: input.provider.trim(),
    url: input.url,
    submittedAt,
    typeLabel,
    hrType,
    ...econ,
    ...(listTitle ? { listTitle } : {}),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([row, ...list]));
  dispatchUpdated();
  return row;
}

export function formatRuDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Короткий дедлайн для таблицы HR (как в макете: «30 апр») */
export function formatHrDeadlineShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}
