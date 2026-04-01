/**
 * Курсы, созданные HR (L&D), с привязкой к сотрудникам из реестра — демо в localStorage.
 */

const STORAGE_KEY = "alrosa_hr_curated_courses_v1";

export const HR_CURATED_COURSES_UPDATED = "alrosa-hr-curated-courses-updated";

export type HrCuratedCourseFormat = "внутренний" | "внешний" | "онлайн" | "смешанный";

export type HrCuratedCourse = {
  id: string;
  title: string;
  provider: string;
  format: HrCuratedCourseFormat;
  description: string;
  url: string;
  createdAt: string;
  /** id сотрудников из hrEmployeesDirectory */
  employeeIds: string[];
};

function dispatch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(HR_CURATED_COURSES_UPDATED));
  }
}

const FORMATS: HrCuratedCourseFormat[] = ["внутренний", "внешний", "онлайн", "смешанный"];

function isFormat(x: unknown): x is HrCuratedCourseFormat {
  return typeof x === "string" && FORMATS.includes(x as HrCuratedCourseFormat);
}

export function readHrCuratedCourses(): HrCuratedCourse[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: HrCuratedCourse[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const o = item as Partial<HrCuratedCourse>;
      if (typeof o.id !== "string" || typeof o.title !== "string" || !o.title.trim()) continue;
      if (typeof o.provider !== "string") continue;
      if (!isFormat(o.format)) continue;
      const description = typeof o.description === "string" ? o.description.trim() : "";
      const url = typeof o.url === "string" ? o.url.trim() : "";
      const createdAt = typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString();
      const ids = Array.isArray(o.employeeIds)
        ? o.employeeIds.filter((x): x is string => typeof x === "string")
        : [];
      out.push({
        id: o.id,
        title: o.title.trim(),
        provider: o.provider.trim(),
        format: o.format,
        description,
        url,
        createdAt,
        employeeIds: ids,
      });
    }
    return out;
  } catch {
    return [];
  }
}

function writeAll(rows: HrCuratedCourse[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    dispatch();
  } catch {
    /* quota */
  }
}

export function addHrCuratedCourse(input: {
  title: string;
  provider: string;
  format: HrCuratedCourseFormat;
  description: string;
  url: string;
  employeeIds: string[];
}): HrCuratedCourse {
  const list = readHrCuratedCourses();
  const row: HrCuratedCourse = {
    id: `hrc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: input.title.trim(),
    provider: input.provider.trim(),
    format: input.format,
    description: input.description.trim(),
    url: input.url.trim(),
    createdAt: new Date().toISOString(),
    employeeIds: [...new Set(input.employeeIds.filter(Boolean))],
  };
  writeAll([row, ...list]);
  return row;
}

export function removeHrCuratedCourse(id: string): void {
  writeAll(readHrCuratedCourses().filter((c) => c.id !== id));
}
