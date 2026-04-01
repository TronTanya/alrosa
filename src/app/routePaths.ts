/**
 * Публичные пути — единый источник для роутера и RoleDock.
 * Дашборд руководителя: /manager (канонический). /team редиректит на /manager.
 * Сотрудник «Команда»: /my-team (карточки коллег в ЛК).
 */
export const ROUTE_PATHS = {
  login: "/login",
  employee: "/",
  /** Сотрудник: календарь Outlook (Microsoft Graph / Nylas), callback Nylas/MSAL */
  employeeCalendar: "/employee/calendar",
  /** Сотрудник: список команды (лёгкая страница в EmployeeShell) */
  employeeTeam: "/my-team",
  /** Руководитель: дашборд */
  manager: "/manager",
  /** Руководитель: аналитика команды */
  managerAnalytics: "/manager/analytics",
  /** Руководитель: ИИ-Наставник команды */
  managerMentor: "/manager/mentor",
  /** Руководитель: курсы и обучение команды */
  managerCourses: "/manager/courses",
  /** Руководитель: компетенции команды */
  managerCompetencies: "/manager/competencies",
  /** Руководитель: календарь (отдельно от календаря сотрудника /employee/calendar) */
  managerCalendar: "/manager/calendar",
  /** Руководитель: отчёты по команде */
  managerReports: "/manager/reports",
  /** Руководитель: достижения и сертификаты команды (сводка) */
  managerAchievements: "/manager/achievements",
  /** Устаревший URL → редирект на ROUTE_PATHS.manager */
  teamLegacy: "/team",
  hr: "/hr",
  /** HR: дашборд KPI, графики, заявки */
  hrDashboard: "/hr/dashboard",
  hrEmployees: "/hr/employees",
  /** HR: индивидуальные траектории развития */
  hrTrajectory: "/hr/trajectory",
  /** HR: ИИ-Наставник (чат и рекомендации) */
  hrMentor: "/hr/mentor",
  /** HR: каталог курсов (внешние + внутренние) */
  hrCatalog: "/hr/catalog",
  /** HR: заявки на обучение (очередь L&D) */
  hrApplications: "/hr/applications",
  /** HR: матрица компетенций */
  hrCompetencies: "/hr/competencies",
  /** HR: мероприятия L&D */
  hrEvents: "/hr/events",
  /** HR: отчёты L&D */
  hrReports: "/hr/reports",
  /** HR: реестр сертификатов */
  hrCertificates: "/hr/certificates",
  /** HR: поддержка L&D / ЕСО */
  hrSupport: "/hr/support",
  /** HR: настройки рабочего стола L&D */
  hrSettings: "/hr/settings",
  admin: "/admin",
} as const;

export const ROLE_ROUTE_PATHS = [
  ROUTE_PATHS.employee,
  ROUTE_PATHS.manager,
  ROUTE_PATHS.hr,
  ROUTE_PATHS.admin,
] as const;
