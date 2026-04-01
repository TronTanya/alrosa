import { aiPicks } from "../pages/CoursesPage";

export type HrCourseFormat = "external" | "internal";

export interface HrCourseCatalogRow {
  id: string;
  title: string;
  provider: string;
  url: string;
  rating: number;
  reviews: string;
  match: number;
  duration: string;
  tags: string[];
  reason: string;
  format: HrCourseFormat;
}

/** Внутренние программы ЕСО / Алроса ИТ */
const internalPrograms: Omit<HrCourseCatalogRow, "format">[] = [
  {
    id: "int-1",
    title: "Единая среда обучения: администрирование",
    provider: "Алроса ИТ · L&D",
    url: "https://www.alrosa.ru/",
    rating: 4.9,
    reviews: "внутр.",
    match: 100,
    duration: "3 модуля",
    tags: ["ЕСО", "онбординг"],
    reason: "Обязательная программа для кураторов учебных траекторий.",
  },
  {
    id: "int-2",
    title: "Кибергигиена и работа с данными",
    provider: "Алроса ИТ · ИБ",
    url: "https://www.alrosa.ru/",
    rating: 4.8,
    reviews: "внутр.",
    match: 95,
    duration: "2 недели",
    tags: ["ИБ", "комплаенс"],
    reason: "Корпоративный стандарт для всех подразделений.",
  },
  {
    id: "int-3",
    title: "Лидерство в распределённых командах",
    provider: "Алроса ИТ · HR",
    url: "https://www.alrosa.ru/",
    rating: 4.7,
    reviews: "внутр.",
    match: 92,
    duration: "4 сессии",
    tags: ["лидерство", "soft skills"],
    reason: "Рекомендовано для линейных руководителей ИТ.",
  },
];

function fromAiPicks(): HrCourseCatalogRow[] {
  return aiPicks.map((c) => ({
    ...c,
    format: "external" as const,
  }));
}

export const hrCourseCatalogRows: HrCourseCatalogRow[] = [
  ...fromAiPicks(),
  ...internalPrograms.map((c) => ({ ...c, format: "internal" as const })),
];

export const HR_COURSE_CATALOG_TOTAL = hrCourseCatalogRows.length;
