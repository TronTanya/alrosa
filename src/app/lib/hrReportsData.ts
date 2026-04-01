/**
 * Актуальные агрегаты для отчётов HR из справочника сотрудников и заявок (localStorage).
 */

import { HR_EMPLOYEES_TOTAL, hrEmployeesDirectory } from "../data/hrEmployeesDirectory";
import { hrEventsCatalog } from "../data/hrEventsCatalog";
import { readStoredTrainingApplications } from "./trainingApplicationsStorage";

export function currentQuarterLabel(d = new Date()): string {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

export function currentMonthYearRu(d = new Date()): string {
  return d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

export function formatRuDateTime(d = new Date()): string {
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

type DeptAgg = {
  total: number;
  inLearning: number;
  inPlan: number;
  notInPlan: number;
  planSum: number;
  planN: number;
};

export function aggregateByDepartment(): Array<{
  department: string;
  total: number;
  inLearning: number;
  inPlan: number;
  notInPlan: number;
  avgPlanPct: string;
}> {
  const map = new Map<string, DeptAgg>();
  for (const e of hrEmployeesDirectory) {
    const a =
      map.get(e.department) ??
      ({ total: 0, inLearning: 0, inPlan: 0, notInPlan: 0, planSum: 0, planN: 0 } satisfies DeptAgg);
    a.total += 1;
    if (e.learningStatus === "В обучении") a.inLearning += 1;
    else if (e.learningStatus === "В плане") a.inPlan += 1;
    else a.notInPlan += 1;
    if (e.planPct != null) {
      a.planSum += e.planPct;
      a.planN += 1;
    }
    map.set(e.department, a);
  }
  return [...map.entries()]
    .map(([department, v]) => ({
      department,
      total: v.total,
      inLearning: v.inLearning,
      inPlan: v.inPlan,
      notInPlan: v.notInPlan,
      avgPlanPct: v.planN > 0 ? `${Math.round(v.planSum / v.planN)}%` : "—",
    }))
    .sort((a, b) => b.total - a.total);
}

export function getOrgLearningSummary() {
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
  const apps = typeof window !== "undefined" ? readStoredTrainingApplications() : [];
  return {
    total: HR_EMPLOYEES_TOTAL,
    inLearning,
    inPlan,
    notInPlan,
    avgPlanPct,
    pendingApplications: apps.length,
    applications: apps,
  };
}

/** Порядковая оценка размера выгрузки по объёму данных */
export function estimateReportSizeLabel(id: string): string {
  const summary = getOrgLearningSummary();
  const depts = aggregateByDepartment().length;
  if (id === "1") return `~${Math.min(900, 180 + depts * 28)} КБ`;
  if (id === "2") return `~${280 + (summary.avgPlanPct ?? 0)} КБ`;
  if (id === "3") return `~${200 + summary.applications.length * 45} КБ`;
  if (id === "4" || id === "5") return "~650–950 КБ";
  if (id === "6" || id === "7") return `~${320 + depts * 20} КБ`;
  if (id === "8") return "~720 КБ";
  if (id === "9") return `~${240 + hrEventsCatalog.length * 30} КБ`;
  if (id === "10") return "~1,0 МБ";
  return "~500 КБ";
}

export type ReportCsvExport = { headers: string[]; rows: string[][] };

export function buildReportDetailCsv(reportId: string): ReportCsvExport {
  const summary = getOrgLearningSummary();
  const depts = aggregateByDepartment();

  switch (reportId) {
    case "1":
      return {
        headers: ["Подразделение", "Сотрудников", "В обучении", "В плане", "Не в плане", "Средний % плана"],
        rows: depts.map((d) => [
          d.department,
          String(d.total),
          String(d.inLearning),
          String(d.inPlan),
          String(d.notInPlan),
          d.avgPlanPct,
        ]),
      };
    case "2": {
      const withPlan = hrEmployeesDirectory.filter((e) => e.planPct != null);
      const buckets = { high: 0, mid: 0, low: 0, none: 0 };
      for (const e of hrEmployeesDirectory) {
        if (e.planPct == null) buckets.none += 1;
        else if (e.planPct >= 70) buckets.high += 1;
        else if (e.planPct >= 40) buckets.mid += 1;
        else buckets.low += 1;
      }
      return {
        headers: ["Показатель", "Значение"],
        rows: [
          ["Всего сотрудников", String(summary.total)],
          ["В обучении", String(summary.inLearning)],
          ["В плане обучения", String(summary.inPlan)],
          ["Не в плане", String(summary.notInPlan)],
          ["Средний % выполнения плана (по тем, у кого задан)", summary.avgPlanPct != null ? `${summary.avgPlanPct}%` : "—"],
          ["С планом % ≥70", String(buckets.high)],
          ["С планом 40–69%", String(buckets.mid)],
          ["С планом <40%", String(buckets.low)],
          ["Без метрики плана", String(buckets.none)],
          ["Среднее по тем, у кого есть %", withPlan.length ? String(Math.round(withPlan.reduce((s, e) => s + (e.planPct ?? 0), 0) / withPlan.length)) : "—"],
        ],
      };
    }
    case "3": {
      const apps = summary.applications;
      if (apps.length === 0) {
        return {
          headers: ["Статус"],
          rows: [["Нет заявок в локальном хранилище — добавьте заявку в разделе «Заявки на обучение»."]],
        };
      }
      return {
        headers: ["Курс / программа", "Провайдер", "Тип", "Подано", "Бюджет (₽)", "ROI %"],
        rows: apps.map((a) => [
          a.listTitle ?? a.title,
          a.provider,
          a.typeLabel,
          a.submittedAt,
          a.budgetRub != null ? String(a.budgetRub) : "—",
          a.roiPercent != null ? String(a.roiPercent) : "—",
        ]),
      };
    }
    case "4":
      return {
        headers: ["Показатель", "Значение"],
        rows: [
          ["Сотрудников в штате", String(summary.total)],
          ["В активном обучении", String(summary.inLearning)],
          ["Средний % плана", summary.avgPlanPct != null ? `${summary.avgPlanPct}%` : "—"],
          ["Заявок в очереди (localStorage)", String(summary.pendingApplications)],
          ["Примечание", "Бюджет L&D: демо-оценка 4,8 млн ₽ из 6 млн ₽ плана квартала (см. дашборд KPI)."],
        ],
      };
    case "5":
      return {
        headers: ["Сегмент", "Сотрудников", "Доля %"],
        rows: [
          ["В обучении (внешние/смешанные сценарии)", String(summary.inLearning), ((summary.inLearning / summary.total) * 100).toFixed(1)],
          ["В плане (подготовка)", String(summary.inPlan), ((summary.inPlan / summary.total) * 100).toFixed(1)],
          ["Ожидание включения в программы", String(summary.notInPlan), ((summary.notInPlan / summary.total) * 100).toFixed(1)],
        ],
      };
    case "6":
      return {
        headers: ["Подразделение", "Средний % плана", "В обучении", "Всего"],
        rows: depts.map((d) => [d.department, d.avgPlanPct, String(d.inLearning), String(d.total)]),
      };
    case "7": {
      const digital = hrEmployeesDirectory.filter(
        (e) =>
          /данн|разработ|инженер|devops|инфобез|архитект/i.test(e.role) || /данн|разработ|инфра|инфобез/i.test(e.department),
      );
      return {
        headers: ["ФИО", "Подразделение", "Роль", "% плана", "Статус обучения"],
        rows: digital.slice(0, 80).map((e) => [
          e.name,
          e.department,
          e.role,
          e.planPct != null ? String(e.planPct) : "—",
          e.learningStatus,
        ]),
      };
    }
    case "8": {
      const s = summary;
      return {
        headers: ["Показатель", "Значение"],
        rows: [
          ["Дата среза", formatRuDateTime()],
          ["Сотрудников", String(s.total)],
          ["В обучении", String(s.inLearning)],
          ["Средний % плана", s.avgPlanPct != null ? `${s.avgPlanPct}%` : "—"],
          ["Заявок на рассмотрении (LS)", String(s.pendingApplications)],
        ],
      };
    }
    case "9":
      return {
        headers: ["Мероприятие", "Тип", "Дата", "Статус", "Регистрация", "Заполнение %"],
        rows: hrEventsCatalog.map((ev) => {
          const fill = ev.capacity ? Math.round((ev.registered / ev.capacity) * 100) : 0;
          return [ev.title, ev.kind, ev.date, ev.status, `${ev.registered} / ${ev.capacity}`, `${fill}%`];
        }),
      };
    case "10":
      return {
        headers: ["Статус обучения (ИПР)", "Количество"],
        rows: [
          ["В обучении", String(summary.inLearning)],
          ["В плане", String(summary.inPlan)],
          ["Не в плане", String(summary.notInPlan)],
        ],
      };
    default:
      return { headers: ["Сообщение"], rows: [["Неизвестный тип отчёта"]] };
  }
}
