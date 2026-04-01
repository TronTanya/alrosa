import React from "react";
import { Outlet } from "react-router";
import { AdminTopbar } from "../components/admin/AdminTopbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";

export function AdminShell() {
  return (
    <div
      className="page-bg"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        color: "#000000",
      }}
    >
      <AdminTopbar />

      <div className="employee-main-row dashboard-layout-row" style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        <AdminSidebar />
        <main
          className="custom-scroll employee-main dashboard-main"
          style={{ flex: 1, minWidth: 0, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
