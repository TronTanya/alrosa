/** Справочник сотрудников HR — полный реестр 312 записей (сгенерировано детерминированно для демо) */

export type HrLearningStatus = "В обучении" | "В плане" | "Не в плане";

export interface HrEmployeeRow {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
  learningStatus: HrLearningStatus;
  planPct: number | null;
}

export const HR_EMPLOYEES_TOTAL = 312;

const FIRST = [
  "Александр", "Мария", "Дмитрий", "Елена", "Сергей", "Ольга", "Андрей", "Наталья", "Игорь", "Татьяна",
  "Павел", "Анна", "Михаил", "Екатерина", "Николай", "Светлана", "Владимир", "Ирина", "Алексей", "Юлия",
  "Константин", "Виктория", "Роман", "Марина", "Артём", "Кристина", "Григорий", "Полина", "Евгений", "Алина",
];

const LAST = [
  "Иванов", "Петров", "Сидорова", "Козлов", "Смирнов", "Кузнецов", "Попов", "Васильев", "Соколов", "Михайлов",
  "Новиков", "Фёдоров", "Морозов", "Волков", "Алексеев", "Лебедев", "Семёнов", "Егоров", "Павлов", "Козлова",
  "Степанов", "Николаев", "Орлов", "Андреев", "Макаров", "Никитин", "Захаров", "Зайцев", "Соловьёв", "Борисов",
];

const DEPTS = [
  "Platform", "Разработка ПО", "QA", "DevOps / Infra", "Продакт", "Продажи & CRM", "HR & People", "Финансы",
  "Юридический", "Дизайн & UX", "Аналитика данных", "Инфобез", "Поддержка", "Архитектура", "Data Engineering",
];

const ROLES = [
  "Senior Software Engineer", "Middle QA Engineer", "DevOps Engineer", "Аналитик", "Account Manager", "HR BP",
  "Финансовый аналитик", "Юрист", "UX Designer", "Data Analyst", "Security Engineer", "Руководитель направления",
  "Team Lead", "Product Owner", "Support Engineer", "Системный аналитик", "ML Engineer", "Scrum Master",
];

function learningStatusForIndex(i: number): HrLearningStatus {
  const m = i % 10;
  if (m < 4) return "В обучении";
  if (m < 7) return "В плане";
  return "Не в плане";
}

function planPctFor(status: HrLearningStatus, i: number): number | null {
  if (status === "Не в плане") return null;
  if (status === "В обучении") return 40 + ((i * 17) % 56);
  return 10 + ((i * 13) % 41);
}

function buildEmployee(index1: number): HrEmployeeRow {
  const i = index1 - 1;
  const first = FIRST[i % FIRST.length];
  const last = LAST[Math.floor(i / FIRST.length) % LAST.length];
  const name = `${first} ${last}`;
  const department = DEPTS[i % DEPTS.length];
  const role = ROLES[(i * 7) % ROLES.length];
  const learningStatus = learningStatusForIndex(i);
  const planPct = planPctFor(learningStatus, i);
  const email = `emp${String(index1).padStart(4, "0")}@company.ru`;
  return {
    id: String(index1),
    name,
    department,
    role,
    email,
    learningStatus,
    planPct,
  };
}

export const hrEmployeesDirectory: HrEmployeeRow[] = Array.from({ length: HR_EMPLOYEES_TOTAL }, (_, k) =>
  buildEmployee(k + 1),
);
