import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { logout } from "../auth/session";
import { Settings, Bell, Globe, Shield, LogOut, ChevronDown } from "lucide-react";

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

export function SettingsPage() {
  const navigate = useNavigate();
  const [notifyCourses, setNotifyCourses] = useState(true);
  const [notifyIpr, setNotifyIpr] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [aiHistory, setAiHistory] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("Русский");

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ marginBottom: "20px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(129,208,245,.06)",
              border: "1px solid rgba(129,208,245,.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Settings size={22} strokeWidth={1.75} style={{ color: "#d1d5db" }} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "21px",
                fontWeight: "800",
                color: "#000000",
                letterSpacing: "-0.3px",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Настройки
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(156,163,175,.75)", margin: "6px 0 0", lineHeight: 1.5 }}>
              Уведомления, язык и параметры приватности портала обучения.
            </p>
          </div>
        </div>
        <div style={{ height: "1px", background: "rgba(129,208,245,.08)", marginTop: "20px" }} />
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ marginBottom: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Bell size={16} style={{ color: "#000000" }} />
          <h2 style={{ fontSize: "13px", fontWeight: "800", color: "#000000", margin: 0, letterSpacing: "0.06em" }}>
            УВЕДОМЛЕНИЯ
          </h2>
        </div>
        <div
          style={{
            borderRadius: "16px",
            border: "1px solid rgba(129,208,245,.08)",
            background: "rgba(129,208,245,.03)",
            overflow: "hidden",
          }}
        >
          {[
            {
              id: "n1",
              label: "Напоминания о курсах и дедлайнах",
              sub: "В колокольчике в шапке портала",
              value: notifyCourses,
              set: setNotifyCourses,
            },
            {
              id: "n2",
              label: "События плана развития и согласований",
              sub: "Когда меняется статус заявки",
              value: notifyIpr,
              set: setNotifyIpr,
            },
            {
              id: "n3",
              label: "Дублировать на корпоративную почту",
              sub: "Сводка раз в неделю",
              value: notifyEmail,
              set: setNotifyEmail,
            },
          ].map((row, i, arr) => (
            <label
              key={row.id}
              htmlFor={row.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                padding: "16px 18px",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(129,208,245,.06)" : "none",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#000000" }}>{row.label}</div>
                <div style={{ fontSize: "12px", color: "#000000", marginTop: "4px" }}>{row.sub}</div>
              </div>
              <Toggle id={row.id} on={row.value} onChange={row.set} />
            </label>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Globe size={16} style={{ color: "#000000" }} />
          <h2 style={{ fontSize: "13px", fontWeight: "800", color: "#000000", margin: 0, letterSpacing: "0.06em" }}>
            ЯЗЫК
          </h2>
        </div>
        <div style={{ position: "relative", maxWidth: "320px" }}>
          <button
            type="button"
            onClick={() => setLangOpen((o) => !o)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(129,208,245,.1)",
              background: "rgba(129,208,245,.04)",
              color: "#000000",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {lang}
            <ChevronDown
              size={18}
              style={{
                color: "#000000",
                transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
          {langOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                borderRadius: "12px",
                border: "1px solid rgba(129,208,245,.1)",
                background: "rgba(10,12,28,.98)",
                boxShadow: "0 16px 48px rgba(0,0,0,.5)",
                zIndex: 10,
                overflow: "hidden",
              }}
            >
              {["Русский", "English"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLang(l);
                    setLangOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    background: l === lang ? "rgba(0,196,160,.12)" : "transparent",
                    color: "#000000",
                    fontSize: "13px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        style={{ marginBottom: "28px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Shield size={16} style={{ color: "#000000" }} />
          <h2 style={{ fontSize: "13px", fontWeight: "800", color: "#000000", margin: 0, letterSpacing: "0.06em" }}>
            ИИ И ДАННЫЕ
          </h2>
        </div>
        <div
          style={{
            borderRadius: "16px",
            border: "1px solid rgba(129,208,245,.08)",
            background: "rgba(129,208,245,.03)",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#000000" }}>Сохранять историю чата с ИИ-наставником</div>
            <div style={{ fontSize: "12px", color: "#000000", marginTop: "4px" }}>
              Нужно для персональных подсказок. Можно отключить — история не будет использоваться.
            </div>
          </div>
          <Toggle id="ai-hist" on={aiHistory} onChange={setAiHistory} />
        </div>
      </motion.section>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 18px",
            borderRadius: "12px",
            border: "1px solid rgba(255,100,100,.35)",
            background: "rgba(255,80,80,.08)",
            color: "#ff8a8a",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <LogOut size={18} />
          Выйти из портала
        </button>
        <p style={{ fontSize: "11px", color: "#000000", marginTop: "12px", maxWidth: "420px", lineHeight: 1.5 }}>
          Выход завершит сессию на этом устройстве. Корпоративный SSO может потребовать повторный вход.
        </p>
      </motion.div>
    </>
  );
}
