import React from "react";
import { AdminKPICards } from "../components/admin/AdminKPICards";
import { SystemOverviewChart } from "../components/admin/SystemOverviewChart";
import { AccessHeatmap } from "../components/admin/AccessHeatmap";
import { AdminAIPanel } from "../components/admin/AdminAIPanel";
import { SystemActionsLog } from "../components/admin/SystemActionsLog";

export function AdminDashboardHome() {
  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <div style={{ marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
            <div
              style={{
                width: "4px",
                height: "22px",
                borderRadius: "4px",
                background: "linear-gradient(180deg,#e3000b,#81d0f5)",
                flexShrink: 0,
              }}
            />
            <h1
              style={{
                fontSize: "21px",
                fontWeight: "800",
                color: "#000000",
                letterSpacing: "-0.4px",
                lineHeight: 1,
                margin: 0,
              }}
            >
              Дашборд Администратора · Управление системой
            </h1>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 11px",
                borderRadius: "20px",
                background: "linear-gradient(135deg,rgba(227,0,11,.2),rgba(129,208,245,.12))",
                border: "1px solid rgba(227,0,11,.32)",
                fontSize: "11px",
                fontWeight: "600",
                color: "#e3000b",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#e3000b",
                  boxShadow: "0 0 6px rgba(227,0,11,.55)",
                  display: "inline-block",
                }}
              />
              Системный доступ
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 11px",
                borderRadius: "20px",
                background: "rgba(129,208,245,.1)",
                border: "1px solid rgba(129,208,245,.25)",
                fontSize: "11px",
                fontWeight: "600",
                color: "#000000",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#81d0f5",
                  boxShadow: "0 0 6px rgba(129,208,245,.5)",
                  display: "inline-block",
                }}
              />
              Все системы в норме
            </div>
          </div>
          <p style={{ fontSize: "13px", color: "#000000", margin: 0, marginLeft: "14px" }}>
            ЕСО v4.2.1 · 312 пользователей · 87 курсов · Uptime 99.9% · 30 марта 2026 · 10:42 MSK
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <AdminKPICards />
        </div>

        <div className="dashboard-split">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>
            <SystemOverviewChart />
            <AccessHeatmap />
          </div>
          <AdminAIPanel />
        </div>

        <SystemActionsLog />

        <div
          style={{
            marginTop: "28px",
            padding: "14px 18px",
            borderRadius: "14px",
            background: "rgba(129,208,245,.04)",
            border: "1px solid rgba(129,208,245,.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {[
              { label: "Следующее резервное копирование", value: "02:00 · Сегодня ночью", color: "#000000" },
              { label: "Последнее обновление системы", value: "25.03.2026 · v4.2.0", color: "#000000" },
              { label: "Лицензия GigaChat", value: "Активна до 31.12.2026", color: "#e3000b" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ fontSize: "11px", color: "#000000" }}>{label}:</span>
                <span style={{ fontSize: "11.5px", fontWeight: "600", color }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "10.5px", color: "#000000" }}>
            Алроса ИТ · Единая среда обучения · Admin Panel v4.2.1
          </div>
        </div>
      </div>
    </div>
  );
}
