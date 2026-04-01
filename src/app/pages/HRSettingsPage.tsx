import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { BarChart3, Bell, Settings, Sparkles } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { HR_LD_SECTION_LABEL, L_D_GLOSS, HR_GLOSS } from "../lib/hrLdLabels";
import {
  loadHrNotificationPrefs,
  saveHrNotificationPrefs,
  type HrNotificationPrefs,
} from "../lib/hrNotificationPreferences";

function Toggle({
  on,
  onChange,
  id,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      id={id}
      onClick={() => onChange(!on)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        border: "1px solid rgba(129,208,245,.35)",
        padding: "2px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "#ffffff",
        transition: "border-color 0.2s, box-shadow 0.2s",
        flexShrink: 0,
        boxShadow: on ? "0 0 0 1px rgba(227,0,11,.2) inset" : "none",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: on ? "#e3000b" : "#81d0f5",
          transform: on ? "translateX(20px)" : "translateX(0)",
          transition: "transform 0.2s ease, background 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        }}
      />
    </button>
  );
}

function Row({
  title,
  desc,
  toggle,
  last,
}: {
  title: string;
  desc: string;
  toggle: { on: boolean; onChange: (v: boolean) => void; id: string };
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "14px 0",
        borderBottom: last ? "none" : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: "500", color: "#000000", marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#000000", opacity: 0.8, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <Toggle on={toggle.on} onChange={toggle.onChange} id={toggle.id} />
    </div>
  );
}

export function HRSettingsPage() {
  const [hrNotify, setHrNotify] = useState<HrNotificationPrefs>(() => loadHrNotificationPrefs());
  const [aiHints, setAiHints] = useState(true);
  const [exportReminder, setExportReminder] = useState(true);

  const patchHrNotify = (partial: Partial<HrNotificationPrefs>) => {
    setHrNotify((prev) => {
      const next = { ...prev, ...partial };
      saveHrNotificationPrefs(next);
      return next;
    });
  };

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
                <Settings size={22} style={{ color: "#000000" }} />
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
                  Настройки
                </h1>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
                Параметры рабочего стола {HR_LD_SECTION_LABEL} в ЕСО: уведомления, подсказки ИИ и напоминания об отчётах (сохраняются локально в
                демо).
              </p>
            </div>
          </div>
        </motion.div>

        <div className="glass-card" style={{ padding: "18px 20px", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Bell size={16} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#000000", letterSpacing: "0.08em" }}>
              УВЕДОМЛЕНИЯ {HR_GLOSS}
            </span>
          </div>
          <Row
            title="Новые заявки на обучение"
            desc={`Push и письмо при появлении заявки в очереди ${L_D_GLOSS}.`}
            toggle={{
              on: hrNotify.newApplications,
              onChange: (v) => patchHrNotify({ newApplications: v }),
              id: "hr-notify-apps",
            }}
          />
          <Row
            title="Просроченные согласования"
            desc="Напоминание, если заявка без решения дольше порога (настраивается в политике)."
            toggle={{
              on: hrNotify.overdueApprovals,
              onChange: (v) => patchHrNotify({ overdueApprovals: v }),
              id: "hr-notify-overdue",
            }}
          />
          <Row
            title="Еженедельный дайджест"
            desc="Сводка по заявкам и мероприятиям на почту hr-learning."
            toggle={{
              on: hrNotify.weeklyDigest,
              onChange: (v) => patchHrNotify({ weeklyDigest: v }),
              id: "hr-digest",
            }}
            last
          />
        </div>

        <div className="glass-card" style={{ padding: "18px 20px", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <BarChart3 size={16} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#000000", letterSpacing: "0.08em" }}>ОТЧЁТЫ</span>
          </div>
          <Row
            title="Напоминание о выгрузке"
            desc="Уведомление в конце квартала о доступных шаблонах отчётов."
            toggle={{ on: exportReminder, onChange: setExportReminder, id: "hr-export" }}
            last
          />
        </div>

        <div className="glass-card" style={{ padding: "18px 20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Sparkles size={16} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#000000", letterSpacing: "0.08em" }}>ИИ-НАСТАВНИК</span>
          </div>
          <Row
            title="Контекстные подсказки в интерфейсе"
            desc="Краткие рекомендации на страницах дашборда и заявок."
            toggle={{ on: aiHints, onChange: setAiHints, id: "hr-ai-hints" }}
            last
          />
        </div>

        <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.75, lineHeight: 1.55 }}>
          Личные настройки аккаунта (язык, выход из системы):{" "}
          <Link to="/settings" style={{ color: "#000000", fontWeight: 500, textDecoration: "underline" }}>
            раздел «Настройки» ЛК
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
