import React from "react";
import { Outlet, useNavigate } from "react-router";
import { HRTopbar } from "../components/hr/HRTopbar";
import { HRSidebar } from "../components/hr/HRSidebar";
import { buildHrDashboardSummaryPdfHtml, openPrintableReport } from "../lib/pdfExport";
import { getHrDashboardMetrics } from "../lib/hrDashboardMetrics";
import { downloadCsv } from "../lib/hrTableExport";
import { MobileNavProvider, useMobileNav } from "../contexts/MobileNavContext";
import { ROUTE_PATHS } from "../routePaths";
import { HR_LD_SECTION_LABEL } from "../lib/hrLdLabels";

function notify(msg: string) {
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "80px",
    right: "24px",
    zIndex: "9999",
    background: "rgba(0,0,0,0.97)",
    border: "1px solid rgba(129,208,245,0.35)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "13px",
    fontFamily: "var(--font-sans)",
    fontWeight: "500",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 16px rgba(129,208,245,0.2)",
    backdropFilter: "blur(16px)",
    transition: "opacity .3s",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

function HRShellBody() {
  const navigate = useNavigate();
  const { open, setOpen } = useMobileNav();

  return (
    <div
      className="page-bg hr-dashboard-alrosa"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
    >
      <HRTopbar
        onExportExcel={() => {
          const m = getHrDashboardMetrics();
          const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          downloadCsv(`hr-ld-dashboard-${stamp}.csv`, ["Показатель", "Значение"], [
            ["Сотрудников в штате", String(m.totalEmployees)],
            ["В обучении", String(m.inLearning)],
            ["В плане обучения", String(m.inPlan)],
            ["Не в плане", String(m.notInPlan)],
            ["Средний % плана", m.avgPlanPctDisplay],
            ["Бюджет (оценка), ₽", String(m.budgetSpentRub)],
            ["План бюджета, ₽", String(m.budgetPlanRub)],
            ["Остаток бюджета, %", String(m.budgetRemainPct)],
            ["Автообработка заявок, %", String(m.autoProcessPct)],
            ["Заявок в очереди", String(m.pendingApplications)],
            ["Экономия времени HR, ч/мес", String(m.hrHoursSaved)],
            ["Срез сформирован", m.generatedAt],
          ]);
          notify("Таблица сформирована из актуального среза справочника и заявок.");
        }}
        onExportPDF={() =>
          openPrintableReport(`${HR_LD_SECTION_LABEL} — сводный отчёт`, buildHrDashboardSummaryPdfHtml())
        }
        onSyncOutlook={() => {
          navigate(ROUTE_PATHS.employeeCalendar);
          notify("Открыт календарь. Синхронизация с Outlook — в планах интеграции.");
        }}
      />

      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Закрыть меню"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="employee-main-row" style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        <HRSidebar />
        <main
          className="custom-scroll employee-main"
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function HRShell() {
  return (
    <MobileNavProvider>
      <HRShellBody />
    </MobileNavProvider>
  );
}
