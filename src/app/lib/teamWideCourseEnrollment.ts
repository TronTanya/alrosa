/**
 * Запись команды на курс с экрана руководителя (ИИ-рекомендации): одна запись в localStorage —
 * в ЛК сотрудника курс появляется у всех (демо: один браузер / один план).
 */

const STORAGE_KEY = "alrosa_team_wide_courses_v1";

export const TEAM_WIDE_COURSES_UPDATED = "alrosa-team-wide-courses-updated";

/** Идентификатор курса «Agile & Data-Driven Decisions» из карточки «Записать команду» */
export const TEAM_AGILE_COURSE_ID = "team-agile-data-driven-decisions";

/** Курс по навыку «Цифровая эффективность» — карточка «Назначить обучение» */
export const TEAM_DIGITAL_EFFECTIVENESS_COURSE_ID = "team-digital-effectiveness";

export type TeamWidePlanCourse = {
  id: string;
  title: string;
  progress: number;
  status: "active" | "pending";
  provider: string;
  url?: string;
  enrolledAt: string;
};

const TEAM_WIDE_COURSE_ROWS: Record<string, Omit<TeamWidePlanCourse, "enrolledAt">> = {
  [TEAM_AGILE_COURSE_ID]: {
    id: TEAM_AGILE_COURSE_ID,
    title: "Agile & Data-Driven Decisions",
    progress: 0,
    status: "pending",
    provider: "Корпоративное обучение",
    url: undefined,
  },
  [TEAM_DIGITAL_EFFECTIVENESS_COURSE_ID]: {
    id: TEAM_DIGITAL_EFFECTIVENESS_COURSE_ID,
    title: "Цифровая эффективность",
    progress: 0,
    status: "pending",
    provider: "Корпоративное обучение",
    url: undefined,
  },
};

function dispatchUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TEAM_WIDE_COURSES_UPDATED));
  }
}

export function readTeamWidePlanCourses(): TeamWidePlanCourse[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: TeamWidePlanCourse[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const o = item as Partial<TeamWidePlanCourse>;
      const id = o.id;
      const template = id && TEAM_WIDE_COURSE_ROWS[id];
      if (!template || !id) continue;
      if (typeof o.title !== "string" || !o.title.trim()) continue;
      out.push({
        id,
        title: o.title,
        progress: typeof o.progress === "number" ? o.progress : 0,
        status: o.status === "active" ? "active" : "pending",
        provider: typeof o.provider === "string" ? o.provider : template.provider,
        url: typeof o.url === "string" ? o.url : undefined,
        enrolledAt: typeof o.enrolledAt === "string" ? o.enrolledAt : new Date().toISOString(),
      });
    }
    return out;
  } catch {
    return [];
  }
}

export function isTeamWideCourseEnrolled(courseId: string): boolean {
  return readTeamWidePlanCourses().some((c) => c.id === courseId);
}

/** Возвращает true, если запись добавлена (false — уже была). */
export function enrollTeamWideCourse(courseId: string): boolean {
  if (typeof localStorage === "undefined") return false;
  const template = TEAM_WIDE_COURSE_ROWS[courseId];
  if (!template) return false;
  const cur = readTeamWidePlanCourses();
  if (cur.some((c) => c.id === courseId)) return false;
  const row: TeamWidePlanCourse = {
    ...template,
    enrolledAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...cur, row]));
  dispatchUpdated();
  return true;
}
