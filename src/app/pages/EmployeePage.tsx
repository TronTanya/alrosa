import React from "react";
import { LeftPanel } from "../components/LeftPanel";
import { IPDTimeline } from "../components/IPDTimeline";

/** Рабочий стол сотрудника (маршрут `/cabinet`) */
export function EmployeePage() {
  return (
    <>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", flexWrap: "wrap" }}>
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
              fontWeight: "600",
              color: "#000000",
              letterSpacing: "-0.4px",
              lineHeight: 1,
              margin: 0,
              fontFamily: "var(--font-sans)",
            }}
          >
            Личный кабинет
          </h1>
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
          Александр Иванов · инженер-программист (Middle) · цели развития 2026
        </p>
      </div>

      <div className="cabinet-grid cabinet-grid--mentor-fab">
        <LeftPanel />
      </div>

      <IPDTimeline />
    </>
  );
}
