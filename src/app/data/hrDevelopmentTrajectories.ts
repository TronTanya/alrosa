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
  ["Елена Волкова", "Платформа"],
  ["Михаил Петров", "Разработка ПО"],
  ["Ольга Сидорова", "Контроль качества"],
  ["Игорь Никифоров", "Девопс / инфраструктура"],
  ["Анна Кузнецова", "Продакт"],
  ["Дмитрий Орлов", "Продажи и CRM"],
  ["Светлана Морозова", "Кадры и персонал"],
  ["Павел Семёнов", "Финансы"],
  ["Кристина Лебедева", "Юридический"],
  ["Артём Васильев", "Дизайн и UX"],
  ["Наталья Егорова", "Аналитика данных"],
  ["Сергей Козлов", "Инфобез"],
  ["Виктория Степанова", "Разработка ПО"],
  ["Роман Алексеев", "Платформа"],
  ["Марина Николаева", "Контроль качества"],
  ["Григорий Захаров", "Инженерия данных"],
  ["Полина Орлова", "Продакт"],
  ["Евгений Макаров", "Разработка ПО"],
  ["Алина Соловьёва", "Поддержка"],
  ["Константин Борисов", "Архитектура"],
  ["Юлия Фёдорова", "Кадры и персонал"],
  ["Алексей Новиков", "Инфобез"],
  ["Ирина Павлова", "Финансы"],
  ["Николай Лебедев", "Девопс / инфраструктура"],
];

const TRACKS = [
  "Рост до уровня Senior",
  "Переход в техлида",
  "Владелец продукта",
  "Аналитика и BI",
  "Продвинутый девопс",
  "UX-исследования",
  "HR-партнёр",
  "Кибербезопасность",
];

const ROLES = [
  "Разработчик (Middle)",
  "Ведущий инженер",
  "Тимлид",
  "Аналитик",
  "Руководитель QA",
  "Менеджер по работе с клиентами",
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
  return `${q} кв. 2026`;
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
