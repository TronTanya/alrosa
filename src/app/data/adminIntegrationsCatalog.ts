export type AdminIntegrationStatus = "connected" | "error" | "disabled";

export interface AdminIntegrationRow {
  id: string;
  name: string;
  category: string;
  endpoint: string;
  status: AdminIntegrationStatus;
  lastCheck: string;
  detail: string;
}

export const adminIntegrationsSeed: AdminIntegrationRow[] = [
  {
    id: "int-sso",
    name: "Единый вход (SAML 2.0)",
    category: "Идентификация",
    endpoint: "sso.alrosa.ru / ЕСО",
    status: "connected",
    lastCheck: "2 мин назад",
    detail: "Синхронизация групп AD → роли ЕСО.",
  },
  {
    id: "int-lms",
    name: "Внешние LMS (xAPI)",
    category: "Обучение",
    endpoint: "api.lms.partner…",
    status: "error",
    lastCheck: "18 мин назад",
    detail: "Истёк сертификат TLS на стороне провайдера.",
  },
  {
    id: "int-giga",
    name: "GigaChat Enterprise",
    category: "ИИ",
    endpoint: "gigachat.sber…",
    status: "connected",
    lastCheck: "1 мин назад",
    detail: "ИИ-Куратор, чат HR, подсказки в заявках.",
  },
  {
    id: "int-hr",
    name: "Кадровая система (REST)",
    category: "HR",
    endpoint: "hrgw.internal…",
    status: "connected",
    lastCheck: "5 мин назад",
    detail: "Сотрудники, подразделения, должности.",
  },
  {
    id: "int-mail",
    name: "Корпоративная почта (Graph)",
    category: "Уведомления",
    endpoint: "graph.microsoft…",
    status: "disabled",
    lastCheck: "—",
    detail: "Рассылки и напоминания по обучению (выключено в песочнице).",
  },
  {
    id: "int-storage",
    name: "Объектное хранилище (S3-совместимое)",
    category: "Файлы",
    endpoint: "s3.alrosa-it…",
    status: "connected",
    lastCheck: "3 мин назад",
    detail: "Сертификаты, вложения заявок, отчёты.",
  },
];

export const ADMIN_INTEGRATIONS_TOTAL = adminIntegrationsSeed.length;
