import { loadHrNotificationPrefs } from "../../lib/hrNotificationPreferences";
import { L_D_GLOSS } from "../../lib/hrLdLabels";
import { countHrPendingApplications } from "../../lib/hrPendingApplicationsCount";
import {
  isHrPendingNotifUnread,
  loadNotificationReads,
  SITE_NOTIF_READS_HR,
} from "../../lib/siteNotificationsStorage";

/** Уведомления для шапки HR (L&D): текст и счётчик заявок — из данных демо (localStorage). */

export type HrTopbarNotifIcon = "course" | "doc" | "calendar";

export type HrTopbarNotifItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: HrTopbarNotifIcon;
  to: string;
};

/** Смесь прочитанных и непрочитанных: в колокольчике — только то, что ещё требует внимания */
export const HR_TOPBAR_NOTIFICATIONS_INITIAL: HrTopbarNotifItem[] = [
  {
    id: "1",
    title: "Отчёт «Охват обучения» обновлён",
    body: "Доступна новая версия за Q1 2026.",
    time: "5 мин назад",
    read: false,
    icon: "doc",
    to: "/hr/reports",
  },
  {
    id: "2",
    title: "Заявки на обучение: 12 на согласовании",
    body: "Требуется решение по заявкам с истекающим сроком.",
    time: "22 мин назад",
    read: false,
    icon: "doc",
    to: "/hr/applications",
  },
  {
    id: "3",
    title: "Новый модуль в каталоге",
    body: "Добавлен курс «Матрица компетенций: практикум».",
    time: "1 ч назад",
    read: false,
    icon: "course",
    to: "/hr/catalog",
  },
  {
    id: "4",
    title: "Напоминание: отчёт для руководства",
    body: "Срок подготовки сводки — до пятницы 17:00.",
    time: "2 ч назад",
    read: false,
    icon: "calendar",
    to: "/hr/reports",
  },
  {
    id: "5",
    title: "Сертификаты: 7 истекают в апреле",
    body: "Отправьте напоминания сотрудникам.",
    time: "3 ч назад",
    read: true,
    icon: "doc",
    to: "/hr/certificates",
  },
  {
    id: "6",
    title: "Мероприятие «Q1 review»",
    body: `Изменено время начала (календарь ${L_D_GLOSS}).`,
    time: "5 ч назад",
    read: true,
    icon: "calendar",
    to: "/hr/events",
  },
  {
    id: "7",
    title: "ИИ-наставник: новые сценарии",
    body: "Обновлены подсказки для траекторий развития.",
    time: "Вчера",
    read: true,
    icon: "course",
    to: "/hr/mentor",
  },
  {
    id: "8",
    title: `Бюджет ${L_D_GLOSS}: порог 85%`,
    body: "Запланируйте перенос части мероприятий на Q2.",
    time: "Вчера",
    read: true,
    icon: "doc",
    to: "/hr/dashboard",
  },
];

export function buildHrTopbarNotificationList(): HrTopbarNotifItem[] {
  const prefs = loadHrNotificationPrefs();
  const pending = countHrPendingApplications();
  const reads = loadNotificationReads(SITE_NOTIF_READS_HR);
  const mapped = HR_TOPBAR_NOTIFICATIONS_INITIAL.map((item) => {
    if (item.id === "2") {
      const read = !isHrPendingNotifUnread(pending);
      return {
        ...item,
        title:
          pending === 0
            ? "Заявки на обучение: нет на согласовании"
            : `Заявки на обучение: ${pending} на согласовании`,
        body:
          pending === 0
            ? "Все текущие заявки обработаны или не ожидают решения."
            : "Требуется решение по заявкам с истекающим сроком.",
        read,
      };
    }
    return {
      ...item,
      read: reads[item.id] !== undefined ? reads[item.id] : item.read,
    };
  });

  return mapped.filter((item) => {
    if (!prefs.newApplications && item.id === "2") return false;
    if (!prefs.overdueApprovals && (item.id === "4" || item.id === "5")) return false;
    return true;
  });
}
