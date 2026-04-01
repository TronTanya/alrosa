/** Активные траектории развития сотрудников (демо для HR) */

export type HrTrajectoryStatus = "В работе" | "На согласовании" | "Завершена";

export interface HrTrajectoryRow {
  id: string;
  employeeName: string;
  department: string;
  role: string;
  trackTitle: string;
  status: HrTrajectoryStatus;
  progressPct: number;
  nextStep: string;
  targetQuarter: string;
}

export const HR_TRAJECTORIES_ACTIVE = 24;

const NAMES = [
  ["Елена Волкова", "Platform"],
  ["Михаил Петров", "Разработка ПО"],
  ["Ольга Сидорова", "QA"],
  ["Игорь Никифоров", "DevOps / Infra"],
  ["Анна Кузнецова", "Продакт"],
  ["Дмитрий Орлов", "Продажи & CRM"],
  ["Светлана Морозова", "HR & People"],
  ["Павел Семёнов", "Финансы"],
  ["Кристина Лебедева", "Юридический"],
  ["Артём Васильев", "Дизайн & UX"],
  ["Наталья Егорова", "Аналитика данных"],
  ["Сергей Козлов", "Инфобез"],
  ["Виктория Степанова", "Разработка ПО"],
  ["Роман Алексеев", "Platform"],
  ["Марина Николаева", "QA"],
  ["Григорий Захаров", "Data Engineering"],
  ["Полина Орлова", "Продакт"],
  ["Евгений Макаров", "Разработка ПО"],
  ["Алина Соловьёва", "Поддержка"],
  ["Константин Борисов", "Архитектура"],
  ["Юлия Фёдорова", "HR & People"],
  ["Алексей Новиков", "Инфобез"],
  ["Ирина Павлова", "Финансы"],
  ["Николай Лебедев", "DevOps / Infra"],
];

const TRACKS = [
  "Рост до Senior",
  "Переход в Tech Lead",
  "Product Owner",
  "Аналитика и BI",
  "DevOps Advanced",
  "UX Research",
  "HR BP Partner",
  "Кибербезопасность",
];

const ROLES = [
  "Middle Developer",
  "Senior Engineer",
  "Team Lead",
  "Аналитик",
  "QA Lead",
  "Account Manager",
];

const NEXT = [
  "Модуль «Лидерство» в ЕСО",
  "Защита ИПР у руководителя",
  "Внешний курс + сертификация",
  "Менторство + проект",
  "Оценка 360°",
  "Итоговое интервью с HR",
];

function statusFor(i: number): HrTrajectoryStatus {
  const m = i % 7;
  if (m === 0) return "На согласовании";
  if (m === 1) return "Завершена";
  return "В работе";
}

function progressFor(status: HrTrajectoryStatus, i: number): number {
  if (status === "Завершена") return 100;
  if (status === "На согласовании") return 15 + (i * 3) % 25;
  return 35 + (i * 11) % 55;
}

function quarterFor(i: number): string {
  const q = 1 + (i % 4);
  return `Q${q} 2026`;
}

export const hrDevelopmentTrajectories: HrTrajectoryRow[] = NAMES.map((pair, i) => {
  const [employeeName, department] = pair;
  const status = statusFor(i);
  return {
    id: String(i + 1),
    employeeName,
    department,
    role: ROLES[i % ROLES.length],
    trackTitle: TRACKS[i % TRACKS.length],
    status,
    progressPct: progressFor(status, i),
    nextStep: NEXT[i % NEXT.length],
    targetQuarter: quarterFor(i),
  };
});
