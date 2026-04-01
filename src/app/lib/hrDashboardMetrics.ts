/**
 * Показатели дашборда HR / L&D из справочника сотрудников и заявок (localStorage).
 */

import { HR_EMPLOYEES_TOTAL, hrEmployeesDirectory } from "../data/hrEmployeesDirectory";
import { readStoredTrainingApplications } from "./trainingApplicationsStorage";
import { aggregateByDepartment } from "./hrReportsData";

export type HrDashboardMetrics = {
  totalEmployees: number;
  inLearning: number;
  inPlan: number;
  notInPlan: number;
  avgPlanPct: number | null;
  pendingApplications: number;
  /** Средний % плана по сотрудникам с метрикой — для карточки «завершение» */
  avgPlanPctDisplay: string;
  budgetSpentRub: number;
  budgetPlanRub: number;
  budgetSpentLabel: string;
  budgetRemainPct: number;
  autoProcessPct: number;
  hrHoursSaved: number;
  generatedAt: string;
};

const BUDGET_PLAN_RUB = 6_000_000;

export function getHrDashboardMetrics(): HrDashboardMetrics {
  let inLearning = 0;
  let inPlan = 0;
  let notInPlan = 0;
  let planSum = 0;
  let planN = 0;
  for (const e of hrEmployeesDirectory) {
    if (e.learningStatus === "В обучении") inLearning += 1;
    else if (e.learningStatus === "В плане") inPlan += 1;
    else notInPlan += 1;
    if (e.planPct != null) {
      planSum += e.planPct;
      planN += 1;
    }
  }
  const avgPlanPct = planN > 0 ? Math.round(planSum / planN) : null;
  const apps = typeof window !== "undefined" ? readStoredTrainingApplications().length : 0;

  const spent = Math.min(
    BUDGET_PLAN_RUB - 50_000,
    Math.round(3_400_000 + inLearning * 3_800 + (avgPlanPct ?? 48) * 9_200 + apps * 16_000),
  );
  const remainPct = Math.max(0, Math.round(((BUDGET_PLAN_RUB - spent) / BUDGET_PLAN_RUB) * 100));

  const autoProcessPct = Math.max(68, Math.min(96, 92 - apps * 3));
  const hrHoursSaved = Math.min(220, Math.max(72, Math.round(68 + inLearning * 0.42 + (avgPlanPct ?? 50) * 0.35 + (apps === 0 ? 22 : 0))));

  const generatedAt = new Date().toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    totalEmployees: HR_EMPLOYEES_TOTAL,
    inLearning,
    inPlan,
    notInPlan,
    avgPlanPct,
    pendingApplications: apps,
    avgPlanPctDisplay: avgPlanPct != null ? `${avgPlanPct}%` : "—",
    budgetSpentRub: spent,
    budgetPlanRub: BUDGET_PLAN_RUB,
    budgetSpentLabel: `${(spent / 1_000_000).toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} млн ₽`,
    budgetRemainPct: remainPct,
    autoProcessPct,
    hrHoursSaved,
    generatedAt,
  };
}

/** Серия для графика «Аналитика обучения» — масштабируется от текущих метрик */
export function buildLearningMonthlyChartData(m: HrDashboardMetrics) {
  const scale = 0.55 + (m.inLearning / HR_EMPLOYEES_TOTAL) * 1.15 + (m.avgPlanPct ?? 50) / 200;
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const now = new Date();
  const currentMonth = now.getMonth();
  return months.map((month, idx) => {
    const t = idx <= currentMonth ? 1 : 0.72;
    const wave = 28 + ((idx * 7 + (m.avgPlanPct ?? 50)) % 34);
    const завершено = Math.max(12, Math.round((wave + idx * 2) * scale * t));
    const начато = Math.max(14, Math.round((wave + 8 + idx * 3) * scale * t));
    const отменено = Math.max(1, Math.round(3 + (idx % 5) * scale * 0.35));
    const satisfaction = Math.min(94, Math.max(78, Math.round(80 + (m.avgPlanPct ?? 52) * 0.12 + (idx % 7) * 1.2)));
    return { month, завершено, начато, отменено, satisfaction };
  });
}

/** Теплокарта: топ-8 подразделений по численности, значения от среднего % плана по отделу */
export function buildDepartmentHeatmapData(): {
  departments: string[];
  competencies: string[];
  heatData: number[][];
  updatedLabel: string;
} {
  const depts = aggregateByDepartment()
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
  const departments = depts.map((d) => d.department);
  const competencies = [
    "Цифровая\nэфф.",
    "Управлен.",
    "Коммуник.",
    "Техн.\nэксперт.",
    "Agile",
    "Data &\nBI",
    "Инфобез.",
  ];
  const heatData: number[][] = depts.map((d, ri) => {
    const base = parseInt(d.avgPlanPct.replace("%", ""), 10);
    const b = Number.isFinite(base) ? base : 62;
    return competencies.map((_, ci) => {
      const v = Math.round(
        Math.min(98, Math.max(36, b + ((ri * 5 + ci * 7) % 19) - 6 + ci * 2 + (ri % 3) * 4)),
      );
      return v;
    });
  });
  const updatedLabel = new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return { departments, competencies, heatData, updatedLabel };
}
