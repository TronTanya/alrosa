export interface AdminDocArticle {
  id: string;
  title: string;
  tag: string;
  description: string;
  updated: string;
}

export const adminDocumentationArticles: AdminDocArticle[] = [
  {
    id: "doc-arch",
    title: "Архитектура ЕСО и границы сервисов",
    tag: "Архитектура",
    description: "Схема модулей ЛК, HR, админ-панели, API Gateway и очередей фоновых заданий.",
    updated: "март 2026",
  },
  {
    id: "doc-api",
    title: "Справочник REST API (v4)",
    tag: "API",
    description: "Аутентификация, версии, коды ошибок, лимиты и примеры запросов для интеграций.",
    updated: "март 2026",
  },
  {
    id: "doc-rbac",
    title: "Роли и матрица доступа",
    tag: "Безопасность",
    description: "Сопоставление ролей ЕСО с группами AD, политики экспорта и аудита.",
    updated: "февраль 2026",
  },
  {
    id: "doc-ai",
    title: "ИИ-модули и политика данных",
    tag: "ИИ",
    description: "GigaChat, хранение промптов, обезличивание, запрет на обучение на данных заказчика.",
    updated: "март 2026",
  },
  {
    id: "doc-backup",
    title: "Резервное копирование и восстановление",
    tag: "Эксплуатация",
    description: "Расписание бэкапов БД, хранение, RPO/RTO, контакты дежурных.",
    updated: "январь 2026",
  },
  {
    id: "doc-release",
    title: "Журнал релизов Admin Panel",
    tag: "Релизы",
    description: "Список версий v4.x, известные ограничения и план миграций.",
    updated: "март 2026",
  },
  {
    id: "doc-sla",
    title: "SLA и мониторинг для администраторов",
    tag: "Надёжность",
    description: "Пороги оповещений, интеграция с SIEM, эскалация инцидентов.",
    updated: "февраль 2026",
  },
  {
    id: "doc-onboarding",
    title: "Онбординг нового администратора",
    tag: "Процессы",
    description: "Чек-лист доступов, учебные стенды, контакты команды сопровождения Алроса ИТ.",
    updated: "март 2026",
  },
];

export const ADMIN_DOCUMENTATION_ARTICLES_TOTAL = adminDocumentationArticles.length;
