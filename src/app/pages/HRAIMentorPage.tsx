import React from "react";
import { motion } from "motion/react";
import { BrainCircuit, Sparkles } from "lucide-react";
import { HRAIPanel } from "../components/hr/HRAIPanel";

export function HRAIMentorPage() {
  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "22px", flexWrap: "wrap" }}>
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
                <BrainCircuit size={22} style={{ color: "#000000" }} />
                <h1
                  className="type-display"
                  style={{
                    fontSize: "21px",
                    fontWeight: "var(--br-font-bold)",
                    color: "#000000",
                    letterSpacing: "-0.4px",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  ИИ-Наставник
                </h1>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg,rgba(227,0,11,.12),rgba(129,208,245,.1))",
                    border: "1px solid rgba(129,208,245,0.35)",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#000000",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#81d0f5",
                      boxShadow: "0 0 6px rgba(129,208,245,.55)",
                    }}
                  />
                  Live · 312 сотрудников
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
                Корпоративный ИИ анализирует обучение, заявки и риски по компании. Чат, рекомендации и прогнозы — в одном
                месте для L&amp;D.
              </p>
            </div>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <HRAIPanel />
          </div>
          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Sparkles size={16} style={{ color: "#e3000b" }} />
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#000000" }}>Возможности</span>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                fontSize: "12.5px",
                color: "#000000",
                lineHeight: 1.65,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>Глобальный чат по данным ЕСО: заявки, бюджет, отделы.</li>
              <li>Предиктивные сигналы по компетенциям и своевременные напоминания.</li>
              <li>Подбор курсов и сценарии ROI для программ развития.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
