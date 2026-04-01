import React, { useState } from "react";
import { motion } from "motion/react";
import { Save, Settings } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";

function toast(msg: string) {
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "80px",
    right: "24px",
    zIndex: "9999",
    background: "rgba(0,0,0,0.97)",
    border: "1px solid rgba(129,208,245,0.35)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "13px",
    fontFamily: "var(--font-sans)",
    fontWeight: "600",
    maxWidth: "380px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

type ToggleRowProps = {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

function ToggleRow({ id, label, hint, checked, onChange }: ToggleRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "14px 0",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", marginTop: "4px", lineHeight: 1.45 }}>{hint}</div>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: "48px",
          height: "28px",
          borderRadius: "14px",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
          background: checked ? "linear-gradient(135deg, #e3000b, #81d0f5)" : "rgba(0,0,0,0.12)",
          boxShadow: checked ? "0 0 10px rgba(227,0,11,0.25)" : "none",
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "3px",
            left: checked ? "23px" : "3px",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

export function AdminConfigurationPage() {
  const [maintenanceBanner, setMaintenanceBanner] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [auditVerbose, setAuditVerbose] = useState(true);
  const [sessionMin, setSessionMin] = useState(480);
  const [envProfile, setEnvProfile] = useState<"prod" | "staging">("prod");
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.internal.example/eso-events");

  const handleSave = () => {
    toast("Демо: настройки сохранены только в текущей сессии браузера.");
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
                <Settings size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  Конфигурация
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
                  ЕСО Admin
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
                Параметры среды и поведения портала. Демо — без записи на сервер.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "12px",
                border: "1px solid rgba(227,0,11,0.35)",
                background: "linear-gradient(135deg, rgba(227,0,11,0.12), rgba(129,208,245,0.1))",
                color: "#e3000b",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <Save size={16} strokeWidth={brandIcon.sw} />
              Сохранить
            </button>
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "880px" }}>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#000000", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              Платформа
            </div>
            <ToggleRow
              id="cfg-maintenance"
              label="Баннер технических работ"
              hint="Показывать полосу предупреждения всем пользователям ЕСО."
              checked={maintenanceBanner}
              onChange={setMaintenanceBanner}
            />
            <ToggleRow
              id="cfg-reg"
              label="Самообслуживание: заявки на доступ"
              hint="Разрешить подачу заявок на роли в ЛК без обращения в поддержку."
              checked={registrationOpen}
              onChange={setRegistrationOpen}
            />
            <div style={{ paddingTop: "14px" }}>
              <label htmlFor="cfg-env" style={{ fontSize: "12px", fontWeight: "700", color: "#000000", display: "block", marginBottom: "8px" }}>
                Профиль среды
              </label>
              <select
                id="cfg-env"
                value={envProfile}
                onChange={(e) => setEnvProfile(e.target.value as "prod" | "staging")}
                style={{
                  width: "100%",
                  maxWidth: "320px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.3)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                  cursor: "pointer",
                }}
              >
                <option value="prod">Продакшен (боевая)</option>
                <option value="staging">Staging (интеграционный)</option>
              </select>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#000000", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              Безопасность
            </div>
            <ToggleRow
              id="cfg-audit"
              label="Расширенный журнал аудита"
              hint="Логировать тело запросов к API (кроме секретов) — выше нагрузка на хранилище."
              checked={auditVerbose}
              onChange={setAuditVerbose}
            />
            <div style={{ paddingTop: "8px" }}>
              <label htmlFor="cfg-session" style={{ fontSize: "12px", fontWeight: "700", color: "#000000", display: "block", marginBottom: "8px" }}>
                Таймаут сессии (минуты)
              </label>
              <input
                id="cfg-session"
                type="number"
                min={60}
                max={1440}
                step={30}
                value={sessionMin}
                onChange={(e) => setSessionMin(Number(e.target.value) || 480)}
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.3)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#000000", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
              События
            </div>
            <label htmlFor="cfg-webhook" style={{ fontSize: "12px", fontWeight: "700", color: "#000000", display: "block", marginBottom: "8px" }}>
              URL webhook для системных событий
            </label>
            <input
              id="cfg-webhook"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://…"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(129,208,245,0.3)",
                background: "rgba(129,208,245,0.06)",
                fontSize: "13px",
                fontFamily: "ui-monospace, monospace",
                color: "#000000",
                marginBottom: "10px",
              }}
            />
            <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", margin: 0, lineHeight: 1.45 }}>
              Демо: значение не отправляется наружу. В бою — только HTTPS и вайтлист IP.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
