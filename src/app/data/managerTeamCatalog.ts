/**
 * Единая демо-команда руководителя: те же ФИО, курсы и метрики на главной, в курсах и достижениях.
 */

export type ManagerTeamUrgency = "normal" | "warning" | "critical";

export type ManagerCourseRunStatus = "в работе" | "запланирован" | "завершён" | "риск";

/** Лента «Недавние события» на `/manager/achievements` — из того же источника, что и команда. */
export type ManagerAchievementFeedKind = "курс" | "аттестация" | "навык" | "корпоративный";

export interface ManagerAchievementFeedItem {
  title: string;
  kind: ManagerAchievementFeedKind;
  who: string;
  when: string;
}

export interface ManagerTeamMember {
  id: string;
  fullName: string;
  /** Короткое имя для таблиц («А. Иванов») */
  shortName: string;
  role: string;
  dept: string;
  progress: number;
  lastCourse: string;
  lastCourseDate: string;
  aiRec: string;
  recUrgency: ManagerTeamUrgency;
  /** Текущий курс на странице «Курсы» */
  activeCourse: string;
  courseProgress: number;
  courseDeadline: string;
  courseStatus: ManagerCourseRunStatus;
  badges: number;
  certs: number;
  /** Строка для блока достижений */
  lastAchEvent: string;
  highlight?: string;
  email: string;
  grad: string;
}

export const MANAGER_TEAM_MEMBERS: ManagerTeamMember[] = [
  {
    id: "1",
    fullName: "Александр Иванов",
    shortName: "А. Иванов",
    role: "Инженер-программист (Middle)",
    dept: "Бэкенд",
    progress: 82,
    lastCourse: "Python Advanced",
    lastCourseDate: "25 мар",
    aiRec: "Добавить ML-курс",
    recUrgency: "normal",
    activeCourse: "Python Advanced",
    courseProgress: 62,
    courseDeadline: "15 апр",
    courseStatus: "в работе",
    badges: 4,
    certs: 3,
    lastAchEvent: "System Design — зачёт, 24.03.2026",
    highlight: "Топ по часам обучения",
    email: "a.ivanov@company.ru",
    grad: "linear-gradient(135deg,#e3000b,#81d0f5)",
  },
  {
    id: "2",
    fullName: "Мария Соколова",
    shortName: "М. Соколова",
    role: "Ведущий разработчик (фронтенд)",
    dept: "Фронтенд",
    progress: 91,
    lastCourse: "React Architecture",
    lastCourseDate: "28 мар",
    aiRec: "Готова к повышению",
    recUrgency: "normal",
    activeCourse: "React Architecture",
    courseProgress: 78,
    courseDeadline: "20 апр",
    courseStatus: "в работе",
    badges: 5,
    certs: 2,
    lastAchEvent: "Code Review — ур. 2, 29.03.2026",
    email: "m.sokolova@company.ru",
    grad: "linear-gradient(135deg,#81d0f5,#e3000b)",
  },
  {
    id: "3",
    fullName: "Дмитрий Козлов",
    shortName: "Д. Козлов",
    role: "Инженер по инфраструктуре (DevOps)",
    dept: "Девопс",
    progress: 76,
    lastCourse: "Kubernetes Advanced",
    lastCourseDate: "18 мар",
    aiRec: "Риск выгорания",
    recUrgency: "warning",
    activeCourse: "Kubernetes Advanced",
    courseProgress: 34,
    courseDeadline: "10 апр",
    courseStatus: "риск",
    badges: 2,
    certs: 1,
    lastAchEvent: "Kubernetes Advanced — риск по сроку",
    email: "d.kozlov@company.ru",
    grad: "linear-gradient(135deg,#e3000b,#a5d8f5)",
  },
  {
    id: "4",
    fullName: "Анна Волкова",
    shortName: "А. Волкова",
    role: "Аналитик данных (Junior)",
    dept: "Аналитика",
    progress: 38,
    lastCourse: "SQL Basics",
    lastCourseDate: "10 мар",
    aiRec: "Срочно: отстаёт на 3 курса",
    recUrgency: "critical",
    activeCourse: "SQL Basics",
    courseProgress: 22,
    courseDeadline: "5 апр",
    courseStatus: "риск",
    badges: 3,
    certs: 2,
    lastAchEvent: "SQL Basics — завершён модуль 1",
    email: "a.volkova@company.ru",
    grad: "linear-gradient(135deg,#81d0f5,#f87171)",
  },
  {
    id: "5",
    fullName: "Сергей Морозов",
    shortName: "С. Морозов",
    role: "Руководитель QA",
    dept: "Контроль качества",
    progress: 65,
    lastCourse: "Cypress Testing",
    lastCourseDate: "22 мар",
    aiRec: "Навык QA снижается",
    recUrgency: "warning",
    activeCourse: "Cypress Testing",
    courseProgress: 48,
    courseDeadline: "12 апр",
    courseStatus: "в работе",
    badges: 3,
    certs: 2,
    lastAchEvent: "Cypress Testing — в работе",
    email: "s.morozov@company.ru",
    grad: "linear-gradient(135deg,#e3000b,#60a5fa)",
  },
  {
    id: "6",
    fullName: "Елена Новикова",
    shortName: "Е. Новикова",
    role: "Менеджер продукта",
    dept: "Продукт",
    progress: 88,
    lastCourse: "Agile Leadership",
    lastCourseDate: "31 мар",
    aiRec: "Рекомендую стратегический курс",
    recUrgency: "normal",
    activeCourse: "Agile Leadership",
    courseProgress: 100,
    courseDeadline: "31 мар",
    courseStatus: "завершён",
    badges: 6,
    certs: 4,
    lastAchEvent: "Agile Leadership — завершён, 31.03.2026",
    highlight: "Больше всего бейджей",
    email: "e.novikova@company.ru",
    grad: "linear-gradient(135deg,#81d0f5,#e3000b)",
  },
  {
    id: "7",
    fullName: "Павел Лебедев",
    shortName: "П. Лебедев",
    role: "Ведущий разработчик (бэкенд)",
    dept: "Бэкенд",
    progress: 79,
    lastCourse: "Go Lang Pro",
    lastCourseDate: "15 мар",
    aiRec: "Риск выгорания",
    recUrgency: "warning",
    activeCourse: "Go Lang Pro",
    courseProgress: 0,
    courseDeadline: "1 мая",
    courseStatus: "запланирован",
    badges: 1,
    certs: 0,
    lastAchEvent: "Go Lang Pro — запланирован",
    email: "p.lebedev@company.ru",
    grad: "linear-gradient(135deg,#f87171,#81d0f5)",
  },
  {
    id: "8",
    fullName: "Ольга Попова",
    shortName: "О. Попова",
    role: "Дизайнер интерфейсов (UX)",
    dept: "Дизайн",
    progress: 55,
    lastCourse: "Figma Advanced",
    lastCourseDate: "5 мар",
    aiRec: "Нет активности 25 дней",
    recUrgency: "critical",
    activeCourse: "Figma Advanced",
    courseProgress: 18,
    courseDeadline: "8 апр",
    courseStatus: "риск",
    badges: 2,
    certs: 1,
    lastAchEvent: "Figma Advanced — нет активности",
    email: "o.popova@company.ru",
    grad: "linear-gradient(135deg,#e3000b,#81d0f5)",
  },
];

export const MANAGER_TEAM_SIZE = MANAGER_TEAM_MEMBERS.length;

/** Недавние события: даты согласованы с апрелем 2026; число сотрудников = размеру команды. */
export const MANAGER_RECENT_ACHIEVEMENT_EVENTS: ManagerAchievementFeedItem[] = [
  {
    title: "Модуль «Информационная безопасность 2026»",
    kind: "корпоративный",
    who: `${MANAGER_TEAM_SIZE} сотрудников`,
    when: "01.04.2026",
  },
  {
    title: "Курс «Agile Leadership» — завершён",
    kind: "курс",
    who: "Е. Новикова",
    when: "31.03.2026",
  },
  {
    title: "Навык «Code Review» — уровень 2",
    kind: "навык",
    who: "М. Соколова",
    when: "29.03.2026",
  },
  {
    title: "Промежуточная аттестация Q1",
    kind: "аттестация",
    who: "Команда разработки",
    when: "28.03.2026",
  },
];

/** Сколько сотрудников реально в прохождении курса (не только в плане). */
export function managerTeamInActiveLearning(): number {
  return MANAGER_TEAM_MEMBERS.filter((m) => m.courseStatus === "в работе" || m.courseStatus === "риск").length;
}
