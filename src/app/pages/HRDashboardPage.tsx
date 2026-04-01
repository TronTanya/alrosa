import React, { useMemo } from "react";
import { HRKPICards } from "../components/hr/HRKPICards";
import { LearningAnalyticsChart } from "../components/hr/LearningAnalyticsChart";
import { DepartmentHeatmap } from "../components/hr/DepartmentHeatmap";
import { HRAIPanel } from "../components/hr/HRAIPanel";
import { HR_LD_SECTION_LABEL } from "../lib/hrLdLabels";
import { ApplicationsTable } from "../components/hr/ApplicationsTable";
import { getHrDashboardMetrics } from "../lib/hrDashboardMetrics";
import { useHrDataRevision } from "../hooks/useHrDataRevision";

export function HRDashboardPage() {
  const dataRev = useHrDataRevision();
  const headerLine = useMemo(() => {
    void dataRev;
    const m = getHrDashboardMetrics();
    const d = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    return `Корпоративный университет · ${m.totalEmployees} сотрудников · заявок в очереди: ${m.pendingApplications} · ${d}`;
  }, [dataRev]);

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
              className="type-display"
              style={{
                fontSize: "21px",
                fontWeight: "var(--br-font-bold)",
                color: "#000000",
                letterSpacing: "-0.4px",
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              Дашборд {HR_LD_SECTION_LABEL} ·{" "}
              <span className="type-heading-accent" style={{ fontSize: "1.02em" }}>
                ИИ-Наставник Развития
              </span>
            </h1>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 11px",
                borderRadius: "20px",
                background: "linear-gradient(135deg,rgba(227,0,11,.2),rgba(129,208,245,.12))",
                border: "1px solid rgba(129,208,245,.28)",
                fontSize: "11px",
                fontWeight: "500",
                color: "#000000",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#81d0f5",
                  boxShadow: "0 0 6px rgba(129,208,245,.55)",
                  display: "inline-block",
                }}
              />
              ИИ Активен
            </div>
          </div>
          <p style={{ fontSize: "13px", color: "#000000", margin: 0, marginLeft: "14px" }}>{headerLine}</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <HRKPICards />
        </div>

        <div className="dashboard-split">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>
            <LearningAnalyticsChart />
            <DepartmentHeatmap />
          </div>
          <HRAIPanel />
        </div>

        <ApplicationsTable />
      </div>
    </div>
  );
}
