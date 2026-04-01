/** Реестр отчётов L&D для HR (шаблоны + функция актуализации дат/периодов) */

import { currentMonthYearRu, currentQuarterLabel, estimateReportSizeLabel } from "../lib/hrReportsData";

export type HrReportCategory = "Обучение" | "Бюджет" | "Компетенции" | "Сводка";

export type HrReportFormat = "PDF" | "XLSX";

export interface HrReportRow {
  id: string;
  title: string;
  category: HrReportCategory;
  period: string;
  format: HrReportFormat;
  updatedAt: string;
  sizeLabel: string;
}

export const hrReportsCatalog: HrReportRow[] = [
  { id: "1", title: "Охват обучения по подразделениям", category: "Обучение", period: "Q1 2026", format: "XLSX", updatedAt: "28.03.2026", sizeLabel: "420 КБ" },
  { id: "2", title: "Завершение курсов и средний прогресс", category: "Обучение", period: "Март 2026", format: "PDF", updatedAt: "27.03.2026", sizeLabel: "1,2 МБ" },
  { id: "3", title: "Заявки на обучение: статусы и сроки", category: "Обучение", period: "Q1 2026", format: "XLSX", updatedAt: "26.03.2026", sizeLabel: "380 КБ" },
  { id: "4", title: "Исполнение бюджета L&D (обучение и развитие)", category: "Бюджет", period: "Q1 2026", format: "PDF", updatedAt: "25.03.2026", sizeLabel: "890 КБ" },
  { id: "5", title: "Окупаемость программ (внутренние / внешние)", category: "Бюджет", period: "2025–2026", format: "XLSX", updatedAt: "24.03.2026", sizeLabel: "510 КБ" },
  { id: "6", title: "Матрица компетенций: срез по компании", category: "Компетенции", period: "Март 2026", format: "PDF", updatedAt: "23.03.2026", sizeLabel: "2,1 МБ" },
  { id: "7", title: "Разрывы по цифровым навыкам", category: "Компетенции", period: "Q1 2026", format: "XLSX", updatedAt: "22.03.2026", sizeLabel: "640 КБ" },
  { id: "8", title: "Единый отчёт для руководства (one-pager)", category: "Сводка", period: "Март 2026", format: "PDF", updatedAt: "30.03.2026", sizeLabel: "760 КБ" },
  { id: "9", title: "Мероприятия: посещаемость и NPS", category: "Сводка", period: "Q1 2026", format: "XLSX", updatedAt: "21.03.2026", sizeLabel: "290 КБ" },
  { id: "10", title: "Траектории развития: статусы ИПР", category: "Обучение", period: "Март 2026", format: "PDF", updatedAt: "20.03.2026", sizeLabel: "1,0 МБ" },
];

export const HR_REPORTS_TOTAL = hrReportsCatalog.length;

/** Даты «Обновлён» и период — по текущей дате; размер — по объёму данных в справочниках. */
export function getLiveHrReportRows(): HrReportRow[] {
  const now = new Date();
  const updatedAt = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  const q = currentQuarterLabel(now);
  const my = currentMonthYearRu(now);
  const yearRange = `${now.getFullYear() - 1}–${now.getFullYear()}`;
  return hrReportsCatalog.map((r) => ({
    ...r,
    updatedAt,
    period:
      r.id === "5"
        ? yearRange
        : r.id === "8" || r.id === "2" || r.id === "6" || r.id === "10"
          ? my
          : q,
    sizeLabel: estimateReportSizeLabel(r.id),
  }));
}
