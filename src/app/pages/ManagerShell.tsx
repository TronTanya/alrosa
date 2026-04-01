import React from "react";
import { Outlet } from "react-router";
import { Topbar } from "../components/Topbar";
import { ManagerSidebar } from "../components/manager/ManagerSidebar";
import { MobileNavProvider, useMobileNav } from "../contexts/MobileNavContext";

function ManagerShellBody() {
  const { open, setOpen } = useMobileNav();

  return (
    <div
      className="page-bg"
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
      <Topbar />

      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Закрыть меню"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="employee-main-row" style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        <ManagerSidebar />
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
          <div className="employee-tab-ornament">
            <div className="employee-tab-ornament__inner">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function ManagerShell() {
  return (
    <MobileNavProvider>
      <ManagerShellBody />
    </MobileNavProvider>
  );
}
