import { createBrowserRouter, redirect } from "react-router";
/**
 * ЛК — EmployeeShell (+ /my-team «Команда» для сотрудника).
 * Руководитель — ManagerShell: /manager, /manager/analytics, /manager/mentor, /manager/courses, /manager/competencies; /team → редирект на /manager.
 */
import { RequireAuth } from "./RequireAuth";
import { Root } from "./Root";
import { EmployeeShell } from "./EmployeeShell";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { EmployeePage } from "./pages/EmployeePage";
import { CoursesPage } from "./pages/CoursesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { EmployeeCalendarPage } from "./pages/EmployeeCalendarPage";
import { IdpApplicationsPage } from "./pages/IdpApplicationsPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { ManagerShell } from "./pages/ManagerShell";
import { TeamDashboardPage } from "./pages/TeamPage";
import { ManagerAnalyticsPage } from "./pages/ManagerAnalyticsPage";
import { ManagerAIMentorPage } from "./pages/ManagerAIMentorPage";
import { ManagerCoursesPage } from "./pages/ManagerCoursesPage";
import { ManagerCompetenciesPage } from "./pages/ManagerCompetenciesPage";
import { EmployeeTeamPage } from "./pages/EmployeeTeamPage";
import { RedirectTeamToManager } from "./components/routing/RedirectTeamToManager";
import { SupportPage } from "./pages/SupportPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HRShell } from "./pages/HRShell";
import { HRHomePage } from "./pages/HRHomePage";
import { HRDashboardPage } from "./pages/HRDashboardPage";
import { HREmployeesPage } from "./pages/HREmployeesPage";
import { HRDevelopmentTrajectoryPage } from "./pages/HRDevelopmentTrajectoryPage";
import { HRAIMentorPage } from "./pages/HRAIMentorPage";
import { HRCoursesCatalogPage } from "./pages/HRCoursesCatalogPage";
import { HRApplicationsPage } from "./pages/HRApplicationsPage";
import { HRCompetenciesPage } from "./pages/HRCompetenciesPage";
import { HREventsPage } from "./pages/HREventsPage";
import { HRReportsPage } from "./pages/HRReportsPage";
import { HRCertificatesPage } from "./pages/HRCertificatesPage";
import { HRSupportPage } from "./pages/HRSupportPage";
import { HRSettingsPage } from "./pages/HRSettingsPage";
import { AdminShell } from "./pages/AdminShell";
import { AdminDashboardHome } from "./pages/AdminDashboardHome";
import { AdminAdministrationPage } from "./pages/AdminAdministrationPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminCoursesPage } from "./pages/AdminCoursesPage";
import { AdminIntegrationsPage } from "./pages/AdminIntegrationsPage";
import { AdminMonitoringPage } from "./pages/AdminMonitoringPage";
import { AdminDatabasePage } from "./pages/AdminDatabasePage";
import { AdminAccessPage } from "./pages/AdminAccessPage";
import { AdminNotificationsPage } from "./pages/AdminNotificationsPage";
import { AdminSystemReportsPage } from "./pages/AdminSystemReportsPage";
import { AdminServersPage } from "./pages/AdminServersPage";
import { AdminAiModulesPage } from "./pages/AdminAiModulesPage";
import { AdminDocumentationPage } from "./pages/AdminDocumentationPage";
import { AdminConfigurationPage } from "./pages/AdminConfigurationPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ROUTE_PATHS } from "./routePaths";

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  {
    path: "/",
    Component: RequireAuth,
    children: [
      {
        Component: Root,
        children: [
          /* Явные маршруты ролей — до pathless EmployeeShell, иначе матчинг может уйти в пустой Outlet */
          {
            path: "manager",
            Component: ManagerShell,
            children: [
              { index: true, Component: TeamDashboardPage },
              { path: "analytics", Component: ManagerAnalyticsPage },
              { path: "mentor", Component: ManagerAIMentorPage },
              { path: "courses", Component: ManagerCoursesPage },
              { path: "competencies", Component: ManagerCompetenciesPage },
            ],
          },
          { path: "team", Component: RedirectTeamToManager },
          {
            path: "hr",
            Component: HRShell,
            children: [
              { index: true, Component: HRHomePage },
              { path: "dashboard", Component: HRDashboardPage },
              { path: "employees", Component: HREmployeesPage },
              { path: "trajectory", Component: HRDevelopmentTrajectoryPage },
              { path: "mentor", Component: HRAIMentorPage },
              { path: "catalog", Component: HRCoursesCatalogPage },
              { path: "applications", Component: HRApplicationsPage },
              { path: "competencies", Component: HRCompetenciesPage },
              { path: "events", Component: HREventsPage },
              { path: "reports", Component: HRReportsPage },
              { path: "certificates", Component: HRCertificatesPage },
              { path: "support", Component: HRSupportPage },
              { path: "settings", Component: HRSettingsPage },
            ],
          },
          {
            path: "admin",
            Component: AdminShell,
            children: [
              { index: true, Component: AdminDashboardHome },
              { path: "administration", Component: AdminAdministrationPage },
              { path: "users", Component: AdminUsersPage },
              { path: "courses", Component: AdminCoursesPage },
              { path: "integrations", Component: AdminIntegrationsPage },
              { path: "monitoring", Component: AdminMonitoringPage },
              { path: "database", Component: AdminDatabasePage },
              { path: "access", Component: AdminAccessPage },
              { path: "notifications", Component: AdminNotificationsPage },
              { path: "system-reports", Component: AdminSystemReportsPage },
              { path: "servers", Component: AdminServersPage },
              { path: "ai-modules", Component: AdminAiModulesPage },
              { path: "documentation", Component: AdminDocumentationPage },
              { path: "configuration", Component: AdminConfigurationPage },
            ],
          },
          {
            Component: EmployeeShell,
            children: [
              { index: true, Component: HomePage },
              { path: "cabinet", Component: EmployeePage },
              { path: "courses", Component: CoursesPage },
              { path: "analytics", Component: AnalyticsPage },
              { path: "calendar", loader: () => redirect(ROUTE_PATHS.employeeCalendar) },
              { path: "employee/calendar", Component: EmployeeCalendarPage },
              { path: "idp", Component: IdpApplicationsPage },
              { path: "certificates", Component: CertificatesPage },
              { path: "my-team", Component: EmployeeTeamPage },
              { path: "support", Component: SupportPage },
              { path: "settings", Component: SettingsPage },
            ],
          },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);
