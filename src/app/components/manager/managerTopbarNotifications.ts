/** Демо-уведомления для шапки руководителя */

import { ROUTE_PATHS } from "../../routePaths";

export type ManagerNotifIcon = "team" | "doc" | "calendar";

export type ManagerTopbarNotifItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: ManagerNotifIcon;
  to: string;
};

export const MANAGER_TOPBAR_NOTIFICATIONS_INITIAL: ManagerTopbarNotifItem[] = [
  {
    id: "1",
    title: "Заявка на обучение согласована",
    body: "Сотрудник может начать курс «System Design».",
    time: "18 мин назад",
    read: false,
    icon: "doc",
    to: "/courses",
  },
  {
    id: "2",
    title: "1:1 с подчинённым",
    body: "Напоминание: завтра 11:00 — Максим Лебедев.",
    time: "1 ч назад",
    read: false,
    icon: "calendar",
    to: ROUTE_PATHS.managerCalendar,
  },
  {
    id: "3",
    title: "Команда: обновление ИПР",
    body: "Трое сотрудников заполнили цели на квартал.",
    time: "3 ч назад",
    read: false,
    icon: "team",
    to: "/manager",
  },
  {
    id: "4",
    title: "Дедлайн аттестации",
    body: "До 5 апреля — промежуточная оценка по команде.",
    time: "Вчера",
    read: false,
    icon: "doc",
    to: "/manager",
  },
  {
    id: "5",
    title: "Отчёт по навыкам",
    body: "Доступна сводка по вашему направлению.",
    time: "Вчера",
    read: false,
    icon: "doc",
    to: ROUTE_PATHS.managerReports,
  },
];
