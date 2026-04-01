import React from "react";
import { Outlet } from "react-router";
import { AdminTopbar } from "../components/admin/AdminTopbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";

function notify(msg: string, color = "#81d0f5") {
  const el = document.createElement("div");
  el.innerHTML = msg;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "80px",
    right: "24px",
    zIndex: "9999",
    background: "rgba(0,0,0,0.97)",
    border: `1px solid ${color}44`,
    color: "#ffffff",
    borderRadius: "14px",
    padding: "14px 20px",
    fontSize: "13px",
    fontFamily: "var(--font-sans)",
    fontWeight: "600",
    boxShadow: `0 8px 36px rgba(0,0,0,.65), 0 0 18px ${color}22`,
    backdropFilter: "blur(18px)",
    transition: "opacity .3s",
    maxWidth: "360px",
    lineHeight: "1.45",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

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
      <AdminTopbar
        onAddUser={() => notify("✅ Раздел «Пользователи»: откройте «Добавить» на странице.", "#81d0f5")}
      />

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
