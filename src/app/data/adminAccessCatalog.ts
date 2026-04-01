export type AdminAccessLevel = "read" | "write" | "admin";

export type AdminAccessPolicyState = "active" | "restricted" | "revoked";

export interface AdminAccessPolicyRow {
  id: string;
  policyName: string;
  resource: string;
  audience: string;
  level: AdminAccessLevel;
  state: AdminAccessPolicyState;
  updatedAt: string;
}

export const adminAccessPoliciesSeed: AdminAccessPolicyRow[] = [
  {
    id: "pol-admin",
    policyName: "Админ-панель ЕСО",
    resource: "/admin/*",
    audience: "Роль «Системный администратор»",
    level: "admin",
    state: "active",
    updatedAt: "28.03.2026",
  },
  {
    id: "pol-hr-ld",
    policyName: "HR / L&D (кадры / обучение и развитие) — полный доступ",
    resource: "/hr/* · заявки · отчёты",
    audience: "Роль «Куратор обучения»",
    level: "write",
    state: "active",
    updatedAt: "22.03.2026",
  },
  {
    id: "pol-courses",
    policyName: "Каталог и записи на курсы",
    resource: "Курсы · ИДП · сертификаты",
    audience: "Все сотрудники ИТ-подразделений",
    level: "read",
    state: "restricted",
    updatedAt: "29.03.2026",
  },
  {
    id: "pol-api",
    policyName: "Публичные API-ключи интеграций",
    resource: "API Gateway · webhooks",
    audience: "Сервисные учётные записи",
    level: "write",
    state: "restricted",
    updatedAt: "30.03.2026",
  },
  {
    id: "pol-audit",
    policyName: "Журнал аудита (экспорт)",
    resource: "Логи безопасности · SIEM",
    audience: "ИБ · только чтение",
    level: "read",
    state: "revoked",
    updatedAt: "15.02.2026",
  },
];

export const ADMIN_ACCESS_POLICIES_TOTAL = adminAccessPoliciesSeed.length;
