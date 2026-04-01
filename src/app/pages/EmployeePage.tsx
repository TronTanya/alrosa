import React from "react";
import { LeftPanel } from "../components/LeftPanel";
import { ChatPanel } from "../components/ChatPanel";
import { IPDTimeline } from "../components/IPDTimeline";

/** Рабочий стол ИИ-Куратора (маршрут `/cabinet`) */
export function EmployeePage() {
  return (
    <>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
          <div
            style={{
              width: "4px",
              height: "22px",
              borderRadius: "4px",
              background: "linear-gradient(180deg, #e3000b, #81d0f5)",
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
              fontFamily: "var(--font-sans)",
            }}
          >
            Личный кабинет · ИИ-Куратор
          </h1>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 11px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(227,0,11,.08), rgba(129,208,245,.14))",
              border: "1px solid rgba(227,0,11,.2)",
              fontSize: "11px",
              fontWeight: "600",
              color: "#000000",
              fontFamily: "var(--font-sans)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e3000b, #81d0f5)",
                boxShadow: "0 0 8px rgba(227,0,11,.35)",
                display: "inline-block",
              }}
            />
            ИИ Активен
          </div>
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "#000000",
            margin: 0,
            marginLeft: "14px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Александр Иванов · Middle Software Engineer · цели развития 2026
        </p>
      </div>

      <div className="cabinet-grid cabinet-grid--mentor-fab">
        <LeftPanel />
      </div>

      <ChatPanel />

      <IPDTimeline />
    </>
  );
}
