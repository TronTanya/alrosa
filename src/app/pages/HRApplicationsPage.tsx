import React from "react";
import { motion } from "motion/react";
import { Briefcase } from "lucide-react";
import { ApplicationsTable } from "../components/hr/ApplicationsTable";

/**
 * Страница HR: полная таблица заявок (как на дашборде) — заявки из портала сотрудника,
 * дедлайн/бюджет/ROI из каталога по URL, решения HR в localStorage, экспорт Excel/PDF.
 */
export function HRApplicationsPage() {
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
                <Briefcase size={22} style={{ color: "#000000" }} />
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
                  Заявки на обучение
                </h1>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Очередь L&amp;D: заявки с портала сотрудника попадают в общий список; дедлайн и бюджет подставляются по справочнику
                провайдера и ссылке на курс; одобрение и отклонение сохраняются в браузере (демо).
              </p>
            </div>
          </div>
        </motion.div>

        <ApplicationsTable />
      </div>
    </div>
  );
}
