import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { KPICards } from "../components/manager/KPICards";
import { CompetencyHeatmap } from "../components/manager/CompetencyHeatmap";
import { AIRecommendations } from "../components/manager/AIRecommendations";
import { TeamTable } from "../components/manager/TeamTable";

/** Реэкспорт для обратной совместимости импортов */
export { teamMembersForSearch } from "../data/teamSearchMembers";

/** Главная страница руководителя (`/manager`) — контент внутри `ManagerShell` */
export function TeamDashboardPage() {
  return (
    <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 4px" }}>
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: "28px" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
              <div
                style={{
                  width: "4px",
                  height: "26px",
                  borderRadius: "6px",
                  background: "linear-gradient(180deg, #e3000b, #81d0f5)",
                  flexShrink: 0,
                  boxShadow: "0 0 16px rgba(129,208,245,0.45)",
                }}
              />
              <h1
                style={{
                  fontSize: "clamp(20px, 2.2vw, 1.55rem)",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-0.4px",
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                Дашборд руководителя • ИИ-Цифровой Наставник Команды
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.55)", margin: 0, marginLeft: "14px", lineHeight: 1.55, maxWidth: "720px" }}>
              Единая среда обучения · Алроса ИТ · Мониторинг компетенций, ИПР и прогнозов команды в реальном времени
            </p>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, rgba(227, 0, 11, 0.08), rgba(129, 208, 245, 0.18))",
              border: "1px solid rgba(129,208,245,0.45)",
              fontSize: "12px",
              fontWeight: 600,
              color: "#000000",
              flexShrink: 0,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Sparkles size={14} style={{ color: "#e3000b" }} />
            ИИ активен · Live
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        style={{ marginBottom: "28px" }}
      >
        <KPICards />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="manager-dash-grid"
        style={{ marginBottom: "28px" }}
      >
        <CompetencyHeatmap />
        <AIRecommendations />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}>
        <TeamTable />
      </motion.section>
    </div>
  );
}
