import React from "react";
import { Outlet, useNavigate } from "react-router";
import { HRTopbar } from "../components/hr/HRTopbar";
import { HRSidebar } from "../components/hr/HRSidebar";
import { buildHrDashboardSummaryPdfHtml, openPrintableReport } from "../lib/pdfExport";
import { MobileNavProvider, useMobileNav } from "../contexts/MobileNavContext";
import { ROUTE_PATHS } from "../routePaths";

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
    fontWeight: "600",
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
        onExportExcel={() => notify("📊 Экспорт в Excel начат...")}
        onExportPDF={() => openPrintableReport("HR / L&D — сводный отчёт", buildHrDashboardSummaryPdfHtml())}
        onSyncOutlook={() => {
          notify("📅 Открываем «Мой календарь»: войдите в Microsoft для загрузки встреч.");
          navigate(ROUTE_PATHS.employeeCalendar);
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
