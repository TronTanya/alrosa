import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Lock, Search } from "lucide-react";
import {
  ADMIN_ACCESS_POLICIES_TOTAL,
  adminAccessPoliciesSeed,
  type AdminAccessLevel,
  type AdminAccessPolicyRow,
  type AdminAccessPolicyState,
} from "../data/adminAccessCatalog";
import { brandIcon } from "../lib/brandIcons";

const STATE_OPTIONS: { val: AdminAccessPolicyState; label: string }[] = [
  { val: "active", label: "Активна" },
  { val: "restricted", label: "Ограничена" },
  { val: "revoked", label: "Отозвана" },
];

const stateFilters: { val: AdminAccessPolicyState | "all"; label: string }[] = [
  { val: "all", label: "Все статусы" },
  ...STATE_OPTIONS,
];

const LEVEL_OPTIONS: { val: AdminAccessLevel; label: string }[] = [
  { val: "read", label: "Чтение" },
  { val: "write", label: "Изменение" },
  { val: "admin", label: "Полный" },
];

function stateSelectStyle(s: AdminAccessPolicyState): { bg: string; border: string; color: string } {
  if (s === "active") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.35)", color: "#000000" };
  if (s === "restricted") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)", color: "#e3000b" };
  return { bg: "rgba(0,0,0,0.06)", border: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.55)" };
}

function levelSelectStyle(l: AdminAccessLevel): { bg: string; border: string; color: string } {
  if (l === "admin") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)", color: "#e3000b" };
  if (l === "write") return { bg: "rgba(129,208,245,0.1)", border: "rgba(129,208,245,0.32)", color: "#000000" };
  return { bg: "rgba(129,208,245,0.06)", border: "rgba(129,208,245,0.22)", color: "#000000" };
}

export function AdminAccessPage() {
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState<AdminAccessPolicyState | "all">("all");
  const [rows, setRows] = useState<AdminAccessPolicyRow[]>(() => adminAccessPoliciesSeed.map((r) => ({ ...r })));

  const setPolicyState = (id: string, next: AdminAccessPolicyState) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, state: next } : r)));
  };

  const setPolicyLevel = (id: string, next: AdminAccessLevel) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, level: next } : r)));
  };

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !qq ||
        r.policyName.toLowerCase().includes(qq) ||
        r.resource.toLowerCase().includes(qq) ||
        r.audience.toLowerCase().includes(qq);
      const matchS = stateFilter === "all" || r.state === stateFilter;
      return matchQ && matchS;
    });
  }, [q, stateFilter, rows]);

  const reviewCount = rows.filter((r) => r.state === "restricted" || r.state === "revoked").length;

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
                <Lock size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  Права доступа
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
                  {ADMIN_ACCESS_POLICIES_TOTAL} политик
                </span>
                {reviewCount > 0 && (
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
                    на проверке: {reviewCount}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Политики ЕСО по ресурсам и ролям. Демо — статус и уровень меняются только в браузере.
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
                placeholder="Поиск по политике, ресурсу, аудитории…"
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
              {stateFilters.map((f) => {
                const active = stateFilter === f.val;
                return (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setStateFilter(f.val)}
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
            Показано {filtered.length} из {rows.length} в выборке · всего политик: {ADMIN_ACCESS_POLICIES_TOTAL}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1040px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Политика", "Ресурс", "Аудитория", "Уровень", "Статус", "Обновлено"].map((h) => (
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
                  const st = stateSelectStyle(r.state);
                  const lv = levelSelectStyle(r.level);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 14) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 14px", maxWidth: "220px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{r.policyName}</span>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", lineHeight: 1.45 }}>{r.resource}</td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "rgba(0,0,0,0.85)", lineHeight: 1.45 }}>{r.audience}</td>
                      <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
                        <select
                          id={`access-level-${r.id}`}
                          aria-label={`Уровень доступа: ${r.policyName}`}
                          value={r.level}
                          onChange={(e) => setPolicyLevel(r.id, e.target.value as AdminAccessLevel)}
                          style={{
                            width: "100%",
                            maxWidth: "140px",
                            padding: "8px 10px",
                            borderRadius: "10px",
                            border: `1px solid ${lv.border}`,
                            background: lv.bg,
                            color: lv.color,
                            fontSize: "12px",
                            fontWeight: "500",
                            fontFamily: "var(--font-sans)",
                            cursor: "pointer",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        >
                          {LEVEL_OPTIONS.map((opt) => (
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
                        <select
                          id={`access-state-${r.id}`}
                          aria-label={`Статус политики: ${r.policyName}`}
                          value={r.state}
                          onChange={(e) => setPolicyState(r.id, e.target.value as AdminAccessPolicyState)}
                          style={{
                            width: "100%",
                            maxWidth: "156px",
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
                          {STATE_OPTIONS.map((opt) => (
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.updatedAt}</td>
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
