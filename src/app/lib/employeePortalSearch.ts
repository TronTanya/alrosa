import { aiPicks, assignedCourses } from "../pages/CoursesPage";
import { teamMembersForSearch } from "../data/teamSearchMembers";
import { ROUTE_PATHS } from "../routePaths";
import { readTeamWidePlanCourses } from "./teamWideCourseEnrollment";

/** Плановые курсы + записанные руководителем на всю команду (localStorage). */
function assignedCoursesIncludingTeam(): { title: string }[] {
  const seen = new Set(assignedCourses.map((c) => c.title));
  const out: { title: string }[] = assignedCourses.map((c) => ({ title: c.title }));
  for (const c of readTeamWidePlanCourses()) {
    if (!seen.has(c.title)) {
      seen.add(c.title);
      out.push({ title: c.title });
    }
  }
  return out;
}

export type PortalSearchKind = "course" | "skill" | "colleague";

export type PortalSearchHit = {
  id: string;
  kind: PortalSearchKind;
  title: string;
  subtitle: string;
  path: string;
};

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function matchesQuery(q: string, ...fields: (string | undefined)[]): boolean {
  const n = normalize(q);
  if (!n) return false;
  return fields.some((f) => f && normalize(f).includes(n));
}

const extraSkillLabels = [
  "Лидерство",
  "Английский",
  "Безопасность",
  "Кубернетес",
  "Микросервисы",
  "Проектирование систем",
  "Коммуникации",
  "Гибкие методологии",
  "SQL",
  "Тестирование",
];

export function filterEmployeePortalSearch(query: string): {
  courses: PortalSearchHit[];
  skills: PortalSearchHit[];
  colleagues: PortalSearchHit[];
} {
  const q = query.trim();
  if (!q) {
    return { courses: [], skills: [], colleagues: [] };
  }

  const courses: PortalSearchHit[] = [];
  for (const p of aiPicks) {
    if (matchesQuery(q, p.title, p.provider, ...p.tags)) {
      courses.push({
        id: `course-ai-${p.id}`,
        kind: "course",
        title: p.title,
        subtitle: p.provider,
        path: ROUTE_PATHS.employeeCourses,
      });
    }
  }
  for (const c of assignedCoursesIncludingTeam()) {
    if (matchesQuery(q, c.title)) {
      courses.push({
        id: `course-asg-${c.title}`,
        kind: "course",
        title: c.title,
        subtitle: "Назначенный курс",
        path: ROUTE_PATHS.employeeCourses,
      });
    }
  }

  const skillLabels = new Set<string>();
  for (const p of aiPicks) {
    for (const t of p.tags) skillLabels.add(t);
  }
  for (const s of extraSkillLabels) skillLabels.add(s);

  const skills: PortalSearchHit[] = [];
  for (const label of skillLabels) {
    if (matchesQuery(q, label)) {
      skills.push({
        id: `skill-${label}`,
        kind: "skill",
        title: label,
        subtitle: "Заявки на обучение",
        path: ROUTE_PATHS.employeeIdp,
      });
    }
  }
  skills.sort((a, b) => a.title.localeCompare(b.title, "ru"));

  const colleagues: PortalSearchHit[] = [];
  for (const m of teamMembersForSearch) {
    if (matchesQuery(q, m.name, m.role, m.email)) {
      colleagues.push({
        id: `col-${m.email}`,
        kind: "colleague",
        title: m.name,
        subtitle: m.role,
        path: ROUTE_PATHS.employeeTeam,
      });
    }
  }

  return { courses, skills, colleagues };
}

/** Полный каталог для ИИ-подбора (без фильтра по запросу). */
export function getFullEmployeeSearchCatalog(): PortalSearchHit[] {
  const courses: PortalSearchHit[] = [];
  for (const p of aiPicks) {
    courses.push({
      id: `course-ai-${p.id}`,
      kind: "course",
      title: p.title,
      subtitle: p.provider,
      path: ROUTE_PATHS.employeeCourses,
    });
  }
  for (const c of assignedCoursesIncludingTeam()) {
    courses.push({
      id: `course-asg-${c.title}`,
      kind: "course",
      title: c.title,
      subtitle: "Назначенный курс",
      path: ROUTE_PATHS.employeeCourses,
    });
  }

  const skillLabels = new Set<string>();
  for (const p of aiPicks) {
    for (const t of p.tags) skillLabels.add(t);
  }
  for (const s of extraSkillLabels) skillLabels.add(s);

  const skills: PortalSearchHit[] = [...skillLabels]
    .sort((a, b) => a.localeCompare(b, "ru"))
    .map((label) => ({
      id: `skill-${label}`,
      kind: "skill" as const,
      title: label,
      subtitle: "Заявки на обучение",
      path: ROUTE_PATHS.employeeIdp,
    }));

  const colleagues: PortalSearchHit[] = teamMembersForSearch.map((m) => ({
    id: `col-${m.email}`,
    kind: "colleague" as const,
    title: m.name,
    subtitle: m.role,
    path: ROUTE_PATHS.employeeTeam,
  }));

  return [...courses, ...skills, ...colleagues];
}
