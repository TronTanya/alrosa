import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { GitBranch, Search } from "lucide-react";
import {
  ADMIN_INTEGRATIONS_TOTAL,
  adminIntegrationsSeed,
  type AdminIntegrationRow,
  type AdminIntegrationStatus,
} from "../data/adminIntegrationsCatalog";
import { brandIcon } from "../lib/brandIcons";

const STATUS_OPTIONS: { val: AdminIntegrationStatus; label: string }[] = [
  { val: "connected", label: "Подключено" },
  { val: "error", label: "Ошибка" },
  { val: "disabled", label: "Отключено" },
];

const statusFilters: { val: AdminIntegrationStatus | "all"; label: string }[] = [
  { val: "all", label: "Все статусы" },
  ...STATUS_OPTIONS,
];

function statusSelectStyle(s: AdminIntegrationStatus): { bg: string; border: string; color: string } {
  if (s === "connected") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.35)", color: "#000000" };
  if (s === "error") return { bg: "rgba(227,0,11,0.1)", border: "rgba(227,0,11,0.28)", color: "#e3000b" };
  return { bg: "rgba(0,0,0,0.06)", border: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.55)" };
}

export function AdminIntegrationsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AdminIntegrationStatus | "all">("all");
  const [rowsState, setRowsState] = useState<AdminIntegrationRow[]>(() =>
    adminIntegrationsSeed.map((r) => ({ ...r })),
  );

  const setIntegrationStatus = (id: string, next: AdminIntegrationStatus) => {
    setRowsState((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  };

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rowsState.filter((r) => {
      const matchQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.category.toLowerCase().includes(qq) ||
        r.endpoint.toLowerCase().includes(qq) ||
        r.detail.toLowerCase().includes(qq);
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    });
  }, [q, status, rowsState]);

  const attentionCount = rowsState.filter((r) => r.status === "error").length;

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
                <GitBranch size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  Интеграции
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
                  {ADMIN_INTEGRATIONS_TOTAL} подключений
                </span>
                {attentionCount > 0 && (
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: "rgba(227,0,11,0.1)",
                      border: "1px solid rgba(227,0,11,0.25)",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#e3000b",
                    }}
                  >
                    требуют внимания: {attentionCount}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Внешние и внутренние сервисы ЕСО: статус канала и последняя проверка. Демо — смена статуса только в браузере.
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
                placeholder="Поиск по названию, категории, endpoint…"
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
          </div>
          <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.75 }}>
            Показано {filtered.length} из {rowsState.length} в выборке · всего интеграций: {ADMIN_INTEGRATIONS_TOTAL}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "920px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Интеграция", "Категория", "Endpoint", "Статус", "Проверка", "Комментарий"].map((h) => (
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
                {filtered.map((r, i) => {
                  const st = statusSelectStyle(r.status);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 14) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 16px", maxWidth: "280px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#000000", lineHeight: 1.35 }}>{r.name}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.category}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "rgba(0,0,0,0.65)", fontFamily: "ui-monospace, monospace" }}>
                        {r.endpoint}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                        <select
                          id={`integration-status-${r.id}`}
                          aria-label={`Статус интеграции ${r.name}`}
                          value={r.status}
                          onChange={(e) => setIntegrationStatus(r.id, e.target.value as AdminIntegrationStatus)}
                          style={{
                            width: "100%",
                            maxWidth: "156px",
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
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.lastCheck}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "rgba(0,0,0,0.75)", lineHeight: 1.45 }}>{r.detail}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: "13px", color: "#000000" }}>
              Ничего не найдено. Измените запрос или фильтр.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
