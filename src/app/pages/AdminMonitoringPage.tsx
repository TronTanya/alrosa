import React from "react";
import { motion } from "motion/react";
import { Activity } from "lucide-react";
import { AdminKPICards } from "../components/admin/AdminKPICards";
import { SystemOverviewChart } from "../components/admin/SystemOverviewChart";
import { AccessHeatmap } from "../components/admin/AccessHeatmap";
import { SystemActionsLog } from "../components/admin/SystemActionsLog";
import { brandIcon } from "../lib/brandIcons";

export function AdminMonitoringPage() {
  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div
              style={{
                width: "4px",
                height: "24px",
                borderRadius: "4px",
                background: "linear-gradient(180deg,#e3000b,#81d0f5)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                <Activity size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                <h1
                  className="type-display"
                  style={{
                    fontSize: "21px",
                    fontWeight: "800",
                    color: "#000000",
                    letterSpacing: "-0.4px",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Мониторинг системы
                </h1>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "rgba(129,208,245,0.14)",
                    border: "1px solid rgba(129,208,245,0.35)",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#000000",
                  }}
                >
                  ЕСО v4.2.1
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 11px",
                    borderRadius: "20px",
                    background: "rgba(129,208,245,0.1)",
                    border: "1px solid rgba(129,208,245,0.25)",
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
                      boxShadow: "0 0 6px rgba(129,208,245,0.55)",
                    }}
                  />
                  Live
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "820px" }}>
                Нагрузка, сессии, доступность модулей и журнал событий. Демо-данные для обзора состояния платформы.
              </p>
            </div>
          </div>
        </motion.div>

        <div style={{ marginBottom: "20px" }}>
          <AdminKPICards />
        </div>

        <div className="dashboard-split">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>
            <SystemOverviewChart />
            <AccessHeatmap />
          </div>
          <div
            className="glass-card"
            style={{
              padding: "18px",
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#000000", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Ресурсы хоста
            </div>
            {[
              { label: "CPU (кластер API)", val: 12, suffix: "%", color: "#e3000b" },
              { label: "RAM", val: 38, suffix: "%", color: "#81d0f5" },
              { label: "Диск (данные ЕСО)", val: 54, suffix: "%", color: "#81d0f5" },
            ].map((row) => (
              <div key={row.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#000000" }}>{row.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#000000" }}>
                    {row.val}
                    {row.suffix}
                  </span>
                </div>
                <div style={{ height: "6px", borderRadius: "6px", background: "rgba(129,208,245,0.12)" }}>
                  <div
                    style={{
                      width: `${row.val}%`,
                      height: "100%",
                      borderRadius: "6px",
                      background: `linear-gradient(90deg, ${row.color}, rgba(129,208,245,0.85))`,
                      boxShadow: `0 0 6px ${row.color}55`,
                    }}
                  />
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: "4px",
                paddingTop: "12px",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                fontSize: "11px",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 1.45,
              }}
            >
              Срез обновляется каждые 30 с. Пороги оповещений настраиваются в конфигурации кластера.
            </div>
          </div>
        </div>

        <div style={{ marginTop: "8px" }}>
          <SystemActionsLog />
        </div>
      </div>
    </div>
  );
}
