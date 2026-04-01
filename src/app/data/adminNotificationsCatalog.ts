export type AdminNotificationChannel = "email" | "push" | "in_app";

export type AdminNotificationRuleStatus = "active" | "paused" | "off";

export interface AdminNotificationRuleRow {
  id: string;
  name: string;
  channel: AdminNotificationChannel;
  audience: string;
  status: AdminNotificationRuleStatus;
  schedule: string;
  detail: string;
}

export const adminNotificationRulesSeed: AdminNotificationRuleRow[] = [
  {
    id: "n-1",
    name: "Напоминание о дедлайне заявки на обучение",
    channel: "email",
    audience: "Сотрудник + руководитель",
    status: "active",
    schedule: "За 3 дня до дедлайна",
    detail: "Шаблон: «Заявка №… требует действий».",
  },
  {
    id: "n-2",
    name: "Сертификат готов к выдаче",
    channel: "in_app",
    audience: "Сотрудник",
    status: "active",
    schedule: "Сразу после выпуска",
    detail: "Центр уведомлений ЛК + бейдж «Сертификаты».",
  },
  {
    id: "n-3",
    name: "Сбой интеграции (критический)",
    channel: "push",
    audience: "Администраторы ЕСО",
    status: "paused",
    schedule: "При ошибке > 5 мин",
    detail: "Мобильное приложение корпоративной сети.",
  },
  {
    id: "n-4",
    name: "Еженедельная сводка L&D",
    channel: "email",
    audience: "Кураторы обучения",
    status: "active",
    schedule: "Пн 09:00 MSK",
    detail: "Заявки, просрочки, топ-курсы недели.",
  },
  {
    id: "n-5",
    name: "Массовая рассылка (техработы)",
    channel: "in_app",
    audience: "Все пользователи ЕСО",
    status: "off",
    schedule: "Вручную",
    detail: "Используется только при плановых окнах.",
  },
  {
    id: "n-6",
    name: "Истечение лицензии GigaChat",
    channel: "email",
    audience: "ИБ + админы",
    status: "paused",
    schedule: "За 30 / 7 дней",
    detail: "Копия в журнал аудита.",
  },
];

export const ADMIN_NOTIFICATION_RULES_TOTAL = adminNotificationRulesSeed.length;
