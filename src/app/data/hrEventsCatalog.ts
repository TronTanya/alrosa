/** Корпоративные мероприятия L&D (демо для HR) */

export type HrEventKind = "Вебинар" | "Тренинг" | "Конференция" | "Митап";

export type HrEventStatus = "Регистрация" | "Идёт" | "Завершено";

export interface HrEventRow {
  id: string;
  title: string;
  kind: HrEventKind;
  date: string;
  time: string;
  format: string;
  venue: string;
  status: HrEventStatus;
  registered: number;
  capacity: number;
}

export const hrEventsCatalog: HrEventRow[] = [
  {
    id: "1",
    title: "ЕСО 2026: новые траектории и ИИ-наставник",
    kind: "Вебинар",
    date: "02.04.2026",
    time: "11:00",
    format: "Онлайн",
    venue: "Teams",
    status: "Регистрация",
    registered: 186,
    capacity: 300,
  },
  {
    id: "2",
    title: "Лидерство в ИТ: практикум для тимлидов",
    kind: "Тренинг",
    date: "08.04.2026",
    time: "10:00–17:00",
    format: "Офис",
    venue: "Москва, Хаб Алроса ИТ",
    status: "Регистрация",
    registered: 42,
    capacity: 48,
  },
  {
    id: "3",
    title: "Кибербезопасность: разбор кейсов",
    kind: "Митап",
    date: "15.04.2026",
    time: "16:00",
    format: "Гибрид",
    venue: "Онлайн + СПб",
    status: "Регистрация",
    registered: 95,
    capacity: 120,
  },
  {
    id: "4",
    title: "Корпоративный университет: итоги Q1",
    kind: "Конференция",
    date: "22.04.2026",
    time: "09:30",
    format: "Офис",
    venue: "Москва",
    status: "Регистрация",
    registered: 210,
    capacity: 250,
  },
  {
    id: "5",
    title: "Внутренний день девопс",
    kind: "Конференция",
    date: "18.03.2026",
    time: "10:00",
    format: "Онлайн",
    venue: "ЕСО",
    status: "Завершено",
    registered: 278,
    capacity: 300,
  },
  {
    id: "6",
    title: "Гибкие навыки: обратная связь 360°",
    kind: "Тренинг",
    date: "25.03.2026",
    time: "11:00–14:00",
    format: "Онлайн",
    venue: "Zoom",
    status: "Завершено",
    registered: 156,
    capacity: 180,
  },
  {
    id: "7",
    title: "Введение в данные и ML для бизнеса",
    kind: "Вебинар",
    date: "30.03.2026",
    time: "12:00",
    format: "Онлайн",
    venue: "Teams",
    status: "Завершено",
    registered: 412,
    capacity: 500,
  },
  {
    id: "8",
    title: "Онбординг новых сотрудников: весна",
    kind: "Тренинг",
    date: "27.03.2026",
    time: "09:00–13:00",
    format: "Офис",
    venue: "Мирный, учебный класс",
    status: "Завершено",
    registered: 38,
    capacity: 40,
  },
];

export const HR_EVENTS_TOTAL = hrEventsCatalog.length;

/** Предстоящие (для бейджа в навигации) — не «Завершено» */
export const HR_EVENTS_UPCOMING = hrEventsCatalog.filter((e) => e.status !== "Завершено").length;
