/**
 * Оценка дедлайна, бюджета и ROI по URL и провайдеру (демо-каталог, как справочник с площадок).
 * В проде можно заменить на API каталога курсов / парсер с бэкенда.
 */

export type CourseEconomicsEstimate = {
  deadlineIso: string;
  budgetRub: number;
  roiPercent: number;
};

function addDays(isoStart: string, days: number): string {
  const d = new Date(isoStart);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/**
 * Дедлайн согласования/старт обучения, бюджет (₽) и ROI — по домену ссылки и названию.
 */
export function estimateCourseEconomics(
  url: string | undefined,
  provider: string,
  title: string,
  submittedAtIso: string,
): CourseEconomicsEstimate {
  const u = (url ?? "").toLowerCase();
  const p = provider.toLowerCase();
  const t = title.toLowerCase();
  const blob = `${u} ${p} ${t}`;

  let daysToDeadline = 42;
  let budgetRub = 48_000;
  let roiPercent = 24;

  if (/план развития|ипр|индивидуальн|eso\s*·/i.test(blob)) {
    daysToDeadline = 14;
    budgetRub = 0;
    roiPercent = 36;
  } else if (/practicum\.yandex|яндекс.*практикум/i.test(blob)) {
    daysToDeadline = 56;
    budgetRub = 118_000;
    roiPercent = 29;
  } else if (/stepik\.org|stepik/i.test(blob)) {
    daysToDeadline = 28;
    budgetRub = 12_000;
    roiPercent = 21;
  } else if (/netology|нетология/i.test(blob)) {
    daysToDeadline = 45;
    budgetRub = 82_000;
    roiPercent = 27;
  } else if (/skillbox/i.test(blob)) {
    daysToDeadline = 75;
    budgetRub = 145_000;
    roiPercent = 32;
  } else if (/otus\.ru|отус/i.test(blob)) {
    daysToDeadline = 50;
    budgetRub = 95_000;
    roiPercent = 30;
  } else if (/geekbrains|hexlet|coursera|udemy/i.test(blob)) {
    daysToDeadline = 35;
    budgetRub = 38_000;
    roiPercent = 20;
  }

  return {
    deadlineIso: addDays(submittedAtIso, daysToDeadline),
    budgetRub,
    roiPercent,
  };
}

export function formatBudgetRub(n: number): string {
  if (n <= 0) return "0 ₽";
  return `${n.toLocaleString("ru-RU")} ₽`;
}
