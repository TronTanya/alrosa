/**
 * Единая демо-аналитика обучения сотрудника и бенчмарк команды (Platform).
 * Согласована с главной, сайдбаром и страницей «Команда» (teamMembersForSearch).
 */

import { teamMembersForSearch } from "./teamSearchMembers";

export const PORTAL_EMPLOYEE = {
  name: "Александр Иванов",
  role: "Инженер-программист (Middle)",
  unit: "Платформа",
  /** Дата актуализации показателей (как в кабинете) */
  metricsAsOf: "28.03.2026",
} as const;

/** Снимок обучения текущего пользователя — те же цифры, что на главной и в сайдбаре */
export const LEARNING_SNAPSHOT = {
  coursesInPlan: 12,
  coursesCompleted: 5,
  coursesInProgress: 7,
  planProgressPercent: 42,
  planDeltaMonthPercent: 8,
  learningStreakDays: 18,
  calendarEventsThisWeek: 3,
  /** Сумма часов за текущие 7 дней (ниже по дням) */
  weeklyLearningHoursTotal: 14.6,
} as const;

/** Часы обучения по дням — «Вы» */
export const weeklyHoursEmployee = [
  { day: "Пн", часы: 2.1 },
  { day: "Вт", часы: 3.4 },
  { day: "Ср", часы: 1.8 },
  { day: "Чт", часы: 4.2 },
  { day: "Пт", часы: 2.6 },
  { day: "Сб", часы: 0.5 },
  { day: "Вс", часы: 0 },
] as const;

/**
 * Средние часы в день по 5 коллегам из teamMembersForSearch (демо, согласовано с ролями).
 * Используется для сравнения на графике «Вы / команда».
 */
export const weeklyHoursTeamAverage = [
  { day: "Пн", часы: 1.6 },
  { day: "Вт", часы: 2.5 },
  { day: "Ср", часы: 2.0 },
  { day: "Чт", часы: 2.9 },
  { day: "Пт", часы: 2.2 },
  { day: "Сб", часы: 0.4 },
  { day: "Вс", часы: 0 },
] as const;

export function weeklyHoursYouVsTeam(): { day: string; вы: number; команда: number }[] {
  return weeklyHoursEmployee.map((row, i) => ({
    day: row.day,
    вы: row.часы,
    команда: weeklyHoursTeamAverage[i]?.часы ?? 0,
  }));
}

/** Прогресс плана развития, % (последнее значение = LEARNING_SNAPSHOT.planProgressPercent) */
export const planProgressByMonth = [
  { m: "Окт", я: 35, команда: 40 },
  { m: "Ноя", я: 38, команда: 41 },
  { m: "Дек", я: 40, команда: 43 },
  { m: "Янв", я: 44, команда: 45 },
  { m: "Фев", я: 46, команда: 47 },
  { m: "Мар", я: 42, команда: 46 },
] as const;

/** Фокус по навыкам — вы (согласовано с акцентом Middle SE / backend в кабинете) */
export const skillsMixEmployee = [
  { name: "Бэкенд", value: 32, color: "#e3000b" },
  { name: "Фронтенд", value: 24, color: "#81d0f5" },
  { name: "Девопс", value: 18, color: "#000000" },
  { name: "Гибкие навыки", value: 16, color: "#b91c1c" },
  { name: "Безопасность", value: 10, color: "#0284c7" },
] as const;

/** Среднее распределение по команде (для подписи и сравнения) */
export const skillsMixTeamAverage = [
  { name: "Бэкенд", value: 28 },
  { name: "Фронтенд", value: 22 },
  { name: "Девопс", value: 22 },
  { name: "Гибкие навыки", value: 18 },
  { name: "Безопасность", value: 10 },
] as const;

export type PeerLearningRow = (typeof teamMembersForSearch)[number] & {
  planProgressPercent: number;
  weeklyHoursApprox: number;
  streakDays: number;
};

/** Коллеги с демо-показателями — для таблицы «команда» на аналитике */
export const teamPeerLearningStats: PeerLearningRow[] = teamMembersForSearch.map((m, i) => ({
  ...m,
  planProgressPercent: [52, 48, 44, 51, 47][i] ?? 48,
  weeklyHoursApprox: [11.2, 13.8, 10.1, 12.5, 9.9][i] ?? 11,
  streakDays: [14, 21, 9, 16, 11][i] ?? 14,
}));

function mean(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Средний % плана по коллегам (без вас) */
export const teamAvgPlanProgressPercent = Math.round(mean(teamPeerLearningStats.map((p) => p.planProgressPercent)));

/** Средние часы за неделю по коллегам */
export const teamAvgWeeklyHours = Math.round(mean(teamPeerLearningStats.map((p) => p.weeklyHoursApprox)) * 10) / 10;

/** Средняя серия (дней) по коллегам */
export const teamAvgStreakDays = Math.round(mean(teamPeerLearningStats.map((p) => p.streakDays)));

/** На сколько % ваши часы выше/ниже среднего по команде */
export function hoursVsTeamPercentDiff(): number {
  const t = teamAvgWeeklyHours;
  if (t <= 0) return 0;
  return Math.round(((LEARNING_SNAPSHOT.weeklyLearningHoursTotal - t) / t) * 100);
}
