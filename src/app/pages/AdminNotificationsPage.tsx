import React, { useMemo, useState } from "react";
import { loadAdminNotificationRules, setAdminRuleStatus as persistAdminRuleStatus } from "../lib/adminNotificationRulesStorage";
import { motion } from "motion/react";
import { Bell, Search } from "lucide-react";
import {
  ADMIN_NOTIFICATION_RULES_TOTAL,
  type AdminNotificationChannel,
  type AdminNotificationRuleRow,
  type AdminNotificationRuleStatus,
} from "../data/adminNotificationsCatalog";
import { brandIcon } from "../lib/brandIcons";

const STATUS_OPTIONS: { val: AdminNotificationRuleStatus; label: string }[] = [
  { val: "active", label: "Включено" },
  { val: "paused", label: "Пауза" },
  { val: "off", label: "Выключено" },
];

const statusFilters: { val: AdminNotificationRuleStatus | "all"; label: string }[] = [
  { val: "all", label: "Все статусы" },
  ...STATUS_OPTIONS,
];

const CHANNEL_OPTIONS: { val: AdminNotificationChannel | "all"; label: string }[] = [
  { val: "all", label: "Все каналы" },
  { val: "email", label: "Email" },
  { val: "push", label: "Push" },
  { val: "in_app", label: "В ЛК" },
];

function channelLabel(c: AdminNotificationChannel): string {
  if (c === "email") return "Email";
  if (c === "push") return "Push";
  return "В ЛК";
}

function channelChipStyle(c: AdminNotificationChannel): { bg: string; border: string } {
  if (c === "email") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.32)" };
  if (c === "push") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)" };
  return { bg: "rgba(0,0,0,0.05)", border: "rgba(0,0,0,0.1)" };
}

function statusSelectStyle(s: AdminNotificationRuleStatus): { bg: string; border: string; color: string } {
  if (s === "active") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.35)", color: "#000000" };
  if (s === "paused") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)", color: "#e3000b" };
  return { bg: "rgba(0,0,0,0.06)", border: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.55)" };
}

export function AdminNotificationsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AdminNotificationRuleStatus | "all">("all");
  const [channel, setChannel] = useState<AdminNotificationChannel | "all">("all");
  const [rows, setRows] = useState<AdminNotificationRuleRow[]>(() => loadAdminNotificationRules());

  const setRuleStatus = (id: string, next: AdminNotificationRuleStatus) => {
    persistAdminRuleStatus(id, next);
    setRows(loadAdminNotificationRules());
  };

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.audience.toLowerCase().includes(qq) ||
        r.schedule.toLowerCase().includes(qq) ||
        r.detail.toLowerCase().includes(qq);
      const matchS = status === "all" || r.status === status;
      const matchC = channel === "all" || r.channel === channel;
      return matchQ && matchS && matchC;
    });
  }, [q, status, channel, rows]);

  const pausedCount = rows.filter((r) => r.status === "paused").length;

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
                <Bell size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  Уведомления
                </h1>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "rgba(129,208,245,0.14)",
                    border: "1px solid rgba(129,208,245,0.35)",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                >
                  {ADMIN_NOTIFICATION_RULES_TOTAL} сценариев
                </span>
                {pausedCount > 0 && (
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: "rgba(227,0,11,0.1)",
                      border: "1px solid rgba(227,0,11,0.25)",
                      fontSize: "11px",
                      fontWeight: "500",
                      color: "#e3000b",
                    }}
                  >
                    на паузе: {pausedCount}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Правила рассылок и push по событиям ЕСО. Статусы сценариев сохраняются в браузере (localStorage).
              </p>
            </div>
          </div>
        </motion.div>

        <div className="glass-card" style={{ padding: "20px", marginBottom: "18px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#000000",
                  opacity: 0.45,
                  pointerEvents: "none",
                }}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Поиск по сценарию, аудитории, расписанию…"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "12px",
                  border: "1px solid rgba(129,208,245,0.25)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {CHANNEL_OPTIONS.map((f) => {
                const active = channel === f.val;
                return (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setChannel(f.val)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      border: active ? "1px solid rgba(227,0,11,0.35)" : "1px solid rgba(129,208,245,0.15)",
                      background: active ? "rgba(227,0,11,0.1)" : "transparent",
                      color: "#000000",
                      fontSize: "12px",
                      fontWeight: active ? "700" : "500",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {statusFilters.map((f) => {
                const active = status === f.val;
                return (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setStatus(f.val)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      border: active ? "1px solid rgba(227,0,11,0.35)" : "1px solid rgba(129,208,245,0.15)",
                      background: active ? "rgba(227,0,11,0.1)" : "transparent",
                      color: "#000000",
                      fontSize: "12px",
                      fontWeight: active ? "700" : "500",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.75 }}>
            Показано {filtered.length} из {rows.length} в выборке · всего сценариев: {ADMIN_NOTIFICATION_RULES_TOTAL}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Сценарий", "Канал", "Аудитория", "Расписание", "Статус", "Комментарий"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 14px",
                        fontSize: "10px",
                        fontWeight: "500",
                        color: "#000000",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const st = statusSelectStyle(r.status);
                  const ch = channelChipStyle(r.channel);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 14) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 14px", maxWidth: "280px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{r.name}</span>
                      </td>
                      <td style={{ padding: "14px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "500",
                            background: ch.bg,
                            border: `1px solid ${ch.border}`,
                            color: "#000000",
                          }}
                        >
                          {channelLabel(r.channel)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", lineHeight: 1.45 }}>{r.audience}</td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.schedule}</td>
                      <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
                        <select
                          id={`notif-status-${r.id}`}
                          aria-label={`Статус сценария: ${r.name}`}
                          value={r.status}
                          onChange={(e) => setRuleStatus(r.id, e.target.value as AdminNotificationRuleStatus)}
                          style={{
                            width: "100%",
                            maxWidth: "148px",
                            padding: "8px 10px",
                            borderRadius: "10px",
                            border: `1px solid ${st.border}`,
                            background: st.bg,
                            color: st.color,
                            fontSize: "12px",
                            fontWeight: "500",
                            fontFamily: "var(--font-sans)",
                            cursor: "pointer",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "rgba(0,0,0,0.75)", lineHeight: 1.45 }}>{r.detail}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: "13px", color: "#000000" }}>
              Ничего не найдено. Измените запрос или фильтры.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
