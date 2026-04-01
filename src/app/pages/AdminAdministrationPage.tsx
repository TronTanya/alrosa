import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Server,
  KeyRound,
  CalendarClock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { brandIcon } from "../lib/brandIcons";

type Task = { id: string; title: string; detail: string; done: boolean; urgent?: boolean };

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Продлить SSL api.eso.company.ru",
    detail: "Истекает через 2 дня · Let's Encrypt / корпоративный УЦ",
    done: false,
    urgent: true,
  },
  {
    id: "2",
    title: "Пересмотр политики паролей (90 дней)",
    detail: "14 учётных записей вне политики · рассылка напоминаний запланирована",
    done: false,
  },
  {
    id: "3",
    title: "Ночное обновление каталога курсов v4.2.1",
    detail: "Окно 02:00–02:30 МСК · откат подготовлен",
    done: true,
  },
];

function notify(msg: string) {
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
    maxWidth: "360px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2400);
}

export function AdminAdministrationPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const pending = tasks.filter((t) => !t.done).length;

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
                <Shield size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  Администрирование
                </h1>
                {pending > 0 && (
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: "rgba(227,0,11,0.1)",
                      border: "1px solid rgba(227,0,11,0.3)",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#e3000b",
                    }}
                  >
                    {pending} задач
                  </span>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
                Контроль инфраструктуры ЕСО, политик безопасности и окон обслуживания. Демо-интерфейс — действия имитируются.
              </p>
            </div>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {[
            {
              title: "Окно обслуживания",
              text: "Следующее: сегодня 02:00–02:30 МСК · каталог курсов и индекс поиска",
              icon: CalendarClock,
              action: "Расписание",
            },
            {
              title: "Окружения",
              text: "Production v4.2.1 · Staging v4.2.1-rc · DR-сайт синхронизирован",
              icon: Server,
              action: "Сравнить",
            },
            {
              title: "Доступ и секреты",
              text: "Vault: 12 активных секретов · ротация API-ключей GigaChat по расписанию",
              icon: KeyRound,
              action: "Vault",
            },
            {
              title: "Перезапуск сервисов",
              text: "Без простоя: поочередный рестарт воркеров уведомлений и очереди заявок",
              icon: RefreshCw,
              action: "Консоль",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className="glass-card"
              style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(129,208,245,0.14)",
                    border: "1px solid rgba(129,208,245,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <c.icon size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                </div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#000000" }}>{c.title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.45 }}>{c.text}</p>
              <button
                type="button"
                onClick={() => notify(`«${c.action}»: демо — раздел в разработке.`)}
                style={{
                  marginTop: "4px",
                  alignSelf: "flex-start",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(227,0,11,0.28)",
                  background: "rgba(227,0,11,0.06)",
                  color: "#e3000b",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {c.action}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: "20px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Wrench size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            <h2 style={{ fontSize: "15px", fontWeight: "800", margin: 0, color: "#000000" }}>Контрольный список</h2>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {tasks.map((t) => (
              <li
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${t.urgent && !t.done ? "rgba(227,0,11,0.25)" : "rgba(0,0,0,0.08)"}`,
                  background: t.done ? "rgba(129,208,245,0.06)" : t.urgent ? "rgba(227,0,11,0.04)" : "rgba(255,255,255,0.6)",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(t.id)}
                  aria-pressed={t.done}
                  style={{
                    marginTop: "2px",
                    flexShrink: 0,
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    border: `2px solid ${t.done ? "#81d0f5" : "rgba(0,0,0,0.2)"}`,
                    background: t.done ? "rgba(129,208,245,0.35)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {t.done && <CheckCircle2 size={14} color="#000000" strokeWidth={2} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    {t.urgent && !t.done && <AlertTriangle size={14} color="#e3000b" />}
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#000000",
                        textDecoration: t.done ? "line-through" : "none",
                        opacity: t.done ? 0.65 : 1,
                      }}
                    >
                      {t.title}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", margin: "4px 0 0", lineHeight: 1.4 }}>{t.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            padding: "14px 18px",
            borderRadius: "14px",
            background: "rgba(129,208,245,0.04)",
            border: "1px solid rgba(129,208,245,0.12)",
            fontSize: "12px",
            color: "rgba(0,0,0,0.55)",
            lineHeight: 1.5,
          }}
        >
          Подсказка: критические задачи дублируются в колокольчике шапки и в ИИ-панели на главной дашборда. Алроса ИТ · ЕСО
          Admin.
        </div>
      </div>
    </div>
  );
}
