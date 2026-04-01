import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Mail, Search, UserPlus, Users } from "lucide-react";
import {
  ADMIN_USERS_TOTAL,
  adminUsersCatalog,
  type AdminUserRow,
  type AdminUserStatus,
} from "../data/adminUsersCatalog";
import { brandIcon } from "../lib/brandIcons";

const STATUS_OPTIONS: AdminUserStatus[] = ["Активен", "Приглашён", "Заблокирован"];

const statusFilters: { val: AdminUserStatus | "all"; label: string }[] = [
  { val: "all", label: "Все статусы" },
  { val: "Активен", label: "Активен" },
  { val: "Приглашён", label: "Приглашён" },
  { val: "Заблокирован", label: "Заблокирован" },
];

function statusChipStyle(s: AdminUserStatus): { bg: string; border: string; color: string } {
  if (s === "Активен") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.35)", color: "#000000" };
  if (s === "Приглашён") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)", color: "#e3000b" };
  return { bg: "rgba(0,0,0,0.06)", border: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.55)" };
}

function initials(name: string): string {
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AdminUserStatus | "all">("all");
  const [users, setUsers] = useState<AdminUserRow[]>(() => adminUsersCatalog.map((u) => ({ ...u })));

  const setUserStatus = (id: string, next: AdminUserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: next } : u)));
  };

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return users.filter((r) => {
      const matchQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.email.toLowerCase().includes(qq) ||
        r.role.toLowerCase().includes(qq) ||
        r.department.toLowerCase().includes(qq);
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    });
  }, [q, status, users]);

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
                <Users size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  Пользователи
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
                  {ADMIN_USERS_TOTAL} в системе
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Реестр учётных записей ЕСО: статус можно менять в таблице (Активен, Приглашён, Заблокирован). Демо — данные только в браузере.
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
                placeholder="Поиск по ФИО, email, роли, подразделению…"
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
            <button
              type="button"
              onClick={() => {
                const el = document.createElement("div");
                el.textContent = "Демо: форма приглашения пользователя откроется в следующей версии.";
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
                });
                document.body.appendChild(el);
                setTimeout(() => {
                  el.style.opacity = "0";
                  setTimeout(() => el.remove(), 300);
                }, 2600);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(227,0,11,0.28)",
                background: "rgba(227,0,11,0.06)",
                color: "#e3000b",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <UserPlus size={14} strokeWidth={brandIcon.sw} />
              Добавить
            </button>
          </div>
          <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.75 }}>
            Показано {rows.length} из {users.length} в выборке · всего в ЕСО: {ADMIN_USERS_TOTAL}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "880px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Пользователь", "Email", "Роль", "Подразделение", "Статус", "Последний вход"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "10px",
                        fontWeight: "700",
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
                {rows.map((r, i) => {
                  const st = statusChipStyle(r.status);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 14) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, rgba(227,0,11,0.35), rgba(129,208,245,0.35))",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: "800",
                              color: "#000000",
                              flexShrink: 0,
                            }}
                          >
                            {initials(r.name)}
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#000000", lineHeight: 1.35 }}>{r.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#000000" }}>
                          <Mail size={13} color={brandIcon.muted} strokeWidth={brandIcon.swSm} />
                          {r.email}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{r.role}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{r.department}</td>
                      <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                        <select
                          id={`user-status-${r.id}`}
                          aria-label={`Статус пользователя ${r.name}`}
                          value={r.status}
                          onChange={(e) => setUserStatus(r.id, e.target.value as AdminUserStatus)}
                          style={{
                            width: "100%",
                            maxWidth: "168px",
                            padding: "8px 10px",
                            borderRadius: "10px",
                            border: `1px solid ${st.border}`,
                            background: st.bg,
                            color: st.color,
                            fontSize: "12px",
                            fontWeight: "600",
                            fontFamily: "var(--font-sans)",
                            cursor: "pointer",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.lastLogin}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: "13px", color: "#000000" }}>
              Ничего не найдено. Измените запрос или фильтр.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
