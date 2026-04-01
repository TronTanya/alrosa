import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
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
import { showAdminToast } from "../lib/adminToast";
import { ESO_VERSION } from "../data/adminDashboardConstants";
import { demoSslDaysLeft, formatMskLine, maintenanceWindowLine } from "../lib/adminMskDates";

type Task = {
  id: string;
  title: string;
  detail: string;
  done: boolean;
  urgent?: boolean;
  /** Куда ведёт кнопка «Открыть раздел» */
  openTo: string;
  openLabel: string;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Продлить SSL api.eso.company.ru",
    detail: "",
    done: false,
    urgent: true,
    openTo: "/admin/notifications",
    openLabel: "Уведомления",
  },
  {
    id: "2",
    title: "Пересмотр политики паролей (90 дней)",
    detail: "14 учётных записей вне политики · рассылка напоминаний запланирована",
    done: false,
    openTo: "/admin/access",
    openLabel: "Права доступа",
  },
  {
    id: "3",
    title: `Ночное обновление каталога курсов v${ESO_VERSION}`,
    detail: "",
    done: true,
    openTo: "/admin/courses",
    openLabel: "Курсы",
  },
];

export function AdminAdministrationPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const pending = tasks.filter((t) => !t.done).length;

  const taskDetail = (t: Task): string => {
    if (t.id === "1") {
      const d = demoSslDaysLeft(now);
      const dw = d === 1 ? "день" : d >= 2 && d <= 4 ? "дня" : "дней";
      return `Истекает через ${d} ${dw} · Let's Encrypt / корпоративный УЦ`;
    }
    if (t.id === "3") {
      return `Окно ${maintenanceWindowLine(now)} · откат подготовлен`;
    }
    return t.detail;
  };

  const infraCards = useMemo(
    () =>
      [
        {
          title: "Окно обслуживания",
          text: `Ближайшее: ${maintenanceWindowLine(now)} · каталог курсов и индекс поиска · ЕСО v${ESO_VERSION}`,
          icon: CalendarClock,
          action: "Расписание",
          to: "/admin/configuration",
        },
        {
          title: "Окружения",
          text: `Production v${ESO_VERSION} · Staging v${ESO_VERSION}-rc · DR-сайт синхронизирован`,
          icon: Server,
          action: "Сравнить",
          to: "/admin/servers",
        },
        {
          title: "Доступ и секреты",
          text: "Vault: 12 активных секретов · ротация API-ключей Яндекс Алиса по расписанию",
          icon: KeyRound,
          action: "Матрица доступа",
          to: "/admin/access",
        },
        {
          title: "Перезапуск сервисов",
          text: "Без простоя: поочередный рестарт воркеров уведомлений и очереди заявок",
          icon: RefreshCw,
          action: "Консоль",
          to: "/admin/monitoring",
        },
      ] as const,
    [now],
  );

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
                    fontWeight: "600",
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
                      fontWeight: "500",
                      color: "#e3000b",
                    }}
                  >
                    {pending} задач
                  </span>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
                Контроль инфраструктуры ЕСО, политик безопасности и окон обслуживания. Кнопки открывают разделы
                админ-панели; актуальное время — {formatMskLine(now)}.
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
          {infraCards.map((c, i) => (
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
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#000000" }}>{c.title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.45 }}>{c.text}</p>
              <button
                type="button"
                onClick={() => {
                  navigate(c.to);
                  showAdminToast(`Раздел «${c.title}»: переход к ${c.action}.`);
                }}
                style={{
                  marginTop: "4px",
                  alignSelf: "flex-start",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(227,0,11,0.28)",
                  background: "rgba(227,0,11,0.06)",
                  color: "#e3000b",
                  fontSize: "11px",
                  fontWeight: "500",
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
            <h2 style={{ fontSize: "15px", fontWeight: "600", margin: 0, color: "#000000" }}>Контрольный список</h2>
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
                        fontWeight: "500",
                        color: "#000000",
                        textDecoration: t.done ? "line-through" : "none",
                        opacity: t.done ? 0.65 : 1,
                      }}
                    >
                      {t.title}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", margin: "4px 0 0", lineHeight: 1.4 }}>{taskDetail(t)}</p>
                  <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(t.openTo);
                        showAdminToast(`Открыто: ${t.openLabel}`);
                      }}
                      style={{
                        padding: "5px 11px",
                        borderRadius: "8px",
                        border: "1px solid rgba(129,208,245,0.45)",
                        background: "rgba(129,208,245,0.1)",
                        color: "#000000",
                        fontSize: "11px",
                        fontWeight: "500",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {t.openLabel} →
                    </button>
                  </div>
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
          <div style={{ marginBottom: "10px" }}>
            Критические задачи продублируйте в уведомлениях и на главной дашборда. ЕСО v{ESO_VERSION} · Алроса ИТ · Admin.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            {[
              { label: "Главная", to: "/admin" },
              { label: "Уведомления", to: "/admin/notifications" },
              { label: "База данных", to: "/admin/database" },
              { label: "Документация", to: "/admin/documentation" },
            ].map((l) => (
              <button
                key={l.to}
                type="button"
                onClick={() => {
                  navigate(l.to);
                  showAdminToast(`Раздел: ${l.label}`);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "#ffffff",
                  color: "#000000",
                  fontSize: "11px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
