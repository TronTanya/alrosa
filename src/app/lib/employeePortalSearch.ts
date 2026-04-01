import { aiPicks, assignedCourses } from "../pages/CoursesPage";
import { teamMembersForSearch } from "../data/teamSearchMembers";

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
  "Kubernetes",
  "Микросервисы",
  "System Design",
  "Коммуникации",
  "Agile",
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
        path: "/courses",
      });
    }
  }
  for (const c of assignedCourses) {
    if (matchesQuery(q, c.title)) {
      courses.push({
        id: `course-asg-${c.title}`,
        kind: "course",
        title: c.title,
        subtitle: "Назначенный курс",
        path: "/courses",
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
        path: "/idp",
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
        path: "/my-team",
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
      path: "/courses",
    });
  }
  for (const c of assignedCourses) {
    courses.push({
      id: `course-asg-${c.title}`,
      kind: "course",
      title: c.title,
      subtitle: "Назначенный курс",
      path: "/courses",
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
      path: "/idp",
    }));

  const colleagues: PortalSearchHit[] = teamMembersForSearch.map((m) => ({
    id: `col-${m.email}`,
    kind: "colleague" as const,
    title: m.name,
    subtitle: m.role,
    path: "/my-team",
  }));

  return [...courses, ...skills, ...colleagues];
}
