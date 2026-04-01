import type { AppLocale } from "./localeStorage";

/** Плоский словарь: ключ → ru / en */
export const STRINGS: Record<string, { ru: string; en: string }> = {
  "nav.section": { ru: "Навигация", en: "Navigation" },
  "nav.system": { ru: "Система", en: "System" },
  "nav.home": { ru: "Главная", en: "Home" },
  "nav.courses": { ru: "Мои курсы", en: "My courses" },
  "nav.mentor": { ru: "ИИ-Наставник", en: "AI Mentor" },
  "nav.analytics": { ru: "Аналитика", en: "Analytics" },
  "nav.calendar": { ru: "Календарь", en: "Calendar" },
  "nav.idp": { ru: "Заявки на обучение", en: "Training requests" },
  "nav.certificates": { ru: "Сертификаты", en: "Certificates" },
  "nav.team": { ru: "Команда", en: "Team" },
  "nav.support": { ru: "Поддержка", en: "Support" },
  "nav.settings": { ru: "Настройки", en: "Settings" },
  "sidebar.progress": { ru: "Прогресс обучения", en: "Learning progress" },
  "sidebar.perMonth": { ru: "мес.", en: "mo." },
  "sidebar.coursesDone": { ru: "курсов завершено", en: "courses completed" },
  "sidebar.of": { ru: "из", en: "of" },
  "sidebar.analyticsLink": { ru: "Подробнее в аналитике →", en: "More in analytics →" },

  "settings.title": { ru: "Настройки", en: "Settings" },
  "settings.subtitle": {
    ru: "Уведомления, язык и параметры приватности портала обучения.",
    en: "Notifications, language, and privacy for the learning portal.",
  },
  "settings.notify": { ru: "УВЕДОМЛЕНИЯ", en: "NOTIFICATIONS" },
  "settings.n1": { ru: "Напоминания о курсах и дедлайнах", en: "Reminders for courses and deadlines" },
  "settings.n1sub": { ru: "В колокольчике в шапке портала", en: "In the portal header bell" },
  "settings.n2": { ru: "События плана развития и согласований", en: "IDP and approval events" },
  "settings.n2sub": { ru: "Когда меняется статус заявки", en: "When a request status changes" },
  "settings.n3": { ru: "Дублировать на корпоративную почту", en: "Mirror to corporate email" },
  "settings.n3sub": { ru: "Сводка раз в неделю", en: "Weekly summary" },
  "settings.lang": { ru: "ЯЗЫК", en: "LANGUAGE" },
  "settings.langRu": { ru: "Русский", en: "Russian" },
  "settings.langEn": { ru: "English", en: "English" },
  "settings.ai": { ru: "ИИ И ДАННЫЕ", en: "AI & DATA" },
  "settings.aiTitle": {
    ru: "Сохранять историю чата с ИИ-наставником",
    en: "Save chat history with AI mentor",
  },
  "settings.aiSub": {
    ru: "Нужно для персональных подсказок. Можно отключить — история не будет использоваться.",
    en: "Used for personalized hints. You can disable — history won’t be used.",
  },
  "settings.logout": { ru: "Выйти из портала", en: "Sign out" },
  "settings.logoutHint": {
    ru: "Выход завершит сессию на этом устройстве. Корпоративный SSO может потребовать повторный вход.",
    en: "This will end the session on this device. Corporate SSO may require signing in again.",
  },
};

export function translate(key: string, locale: AppLocale): string {
  const row = STRINGS[key];
  if (!row) return key;
  return locale === "en" ? row.en : row.ru;
}
