import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Cpu, Search, Sparkles } from "lucide-react";
import {
  ADMIN_AI_MODULES_TOTAL,
  adminAiModulesSeed,
  type AdminAiModuleCategory,
  type AdminAiModuleRow,
  type AdminAiModuleStatus,
} from "../data/adminAiModulesCatalog";
import { brandIcon } from "../lib/brandIcons";

const STATUS_OPTIONS: { val: AdminAiModuleStatus; label: string }[] = [
  { val: "active", label: "Активен" },
  { val: "limited", label: "Ограничен" },
  { val: "disabled", label: "Отключён" },
];

const statusFilters: { val: AdminAiModuleStatus | "all"; label: string }[] = [
  { val: "all", label: "Все статусы" },
  ...STATUS_OPTIONS,
];

const CATEGORY_OPTIONS: { val: AdminAiModuleCategory | "all"; label: string }[] = [
  { val: "all", label: "Все типы" },
  { val: "chat", label: "Чат / LLM" },
  { val: "embeddings", label: "Эмбеддинги" },
  { val: "rag", label: "RAG" },
  { val: "recommend", label: "Рекомендации" },
  { val: "moderation", label: "Модерация" },
  { val: "other", label: "Прочее" },
];

function categoryLabel(c: AdminAiModuleCategory): string {
  const m: Record<AdminAiModuleCategory, string> = {
    chat: "Чат / LLM",
    embeddings: "Эмбеддинги",
    rag: "RAG",
    recommend: "Рекомендации",
    moderation: "Модерация",
    other: "Прочее",
  };
  return m[c];
}

function categoryChipStyle(c: AdminAiModuleCategory): { bg: string; border: string } {
  if (c === "chat") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)" };
  if (c === "embeddings" || c === "rag") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.32)" };
  if (c === "recommend") return { bg: "rgba(129,208,245,0.08)", border: "rgba(129,208,245,0.22)" };
  if (c === "moderation") return { bg: "rgba(0,0,0,0.05)", border: "rgba(0,0,0,0.12)" };
  return { bg: "rgba(129,208,245,0.06)", border: "rgba(129,208,245,0.18)" };
}

function statusSelectStyle(s: AdminAiModuleStatus): { bg: string; border: string; color: string } {
  if (s === "active") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.35)", color: "#000000" };
  if (s === "limited") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)", color: "#e3000b" };
  return { bg: "rgba(0,0,0,0.06)", border: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.55)" };
}

function quotaBarColor(pct: number): string {
  if (pct >= 80) return "#e3000b";
  if (pct >= 55) return "#81d0f5";
  return "rgba(129,208,245,0.75)";
}

export function AdminAiModulesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AdminAiModuleStatus | "all">("all");
  const [category, setCategory] = useState<AdminAiModuleCategory | "all">("all");
  const [rows, setRows] = useState<AdminAiModuleRow[]>(() => adminAiModulesSeed.map((r) => ({ ...r })));

  const setModuleStatus = (id: string, next: AdminAiModuleStatus) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  };

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.purpose.toLowerCase().includes(qq) ||
        r.modelLabel.toLowerCase().includes(qq) ||
        r.note.toLowerCase().includes(qq);
      const matchS = status === "all" || r.status === status;
      const matchC = category === "all" || r.category === category;
      return matchQ && matchS && matchC;
    });
  }, [q, status, category, rows]);

  const activeCount = rows.filter((r) => r.status === "active").length;
  const requestsSum = rows.reduce((acc, r) => acc + r.requestsToday, 0);
  const limitedOrOff = rows.filter((r) => r.status !== "active").length;

  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
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
                <Cpu size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  ИИ-модули
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
                  {ADMIN_AI_MODULES_TOTAL} сервисов
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg,rgba(227,0,11,.12),rgba(129,208,245,.1))",
                    border: "1px solid rgba(129,208,245,0.28)",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                >
                  <Sparkles size={12} color="#e3000b" strokeWidth={brandIcon.swSm} />
                  Яндекс Алиса Enterprise
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "840px" }}>
                Управление сценариями ИИ в ЕСО: чат, RAG, эмбеддинги и квоты. Демо — статусы и цифры только в браузере.
              </p>
            </div>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          {[
            { label: "В каталоге", value: String(ADMIN_AI_MODULES_TOTAL), sub: "зарегистрировано модулей" },
            { label: "Активны", value: String(activeCount), sub: "готовы к трафику" },
            {
              label: "Запросов сегодня (сумма)",
              value: requestsSum.toLocaleString("ru-RU"),
              sub: "по демо-счётчикам",
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="glass-card"
              style={{ padding: "16px 18px" }}
            >
              <div style={{ fontSize: "11px", fontWeight: "500", color: "rgba(0,0,0,0.55)", marginBottom: "6px", letterSpacing: "0.02em" }}>
                {card.label}
              </div>
              <div style={{ fontSize: "22px", fontWeight: "600", color: "#000000", letterSpacing: "-0.5px" }}>{card.value}</div>
              <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)", marginTop: "4px" }}>{card.sub}</div>
            </motion.div>
          ))}
        </div>

        {limitedOrOff > 0 && (
          <div
            style={{
              marginBottom: "14px",
              padding: "10px 14px",
              borderRadius: "12px",
              background: "rgba(227,0,11,0.06)",
              border: "1px solid rgba(227,0,11,0.18)",
              fontSize: "12px",
              color: "#000000",
            }}
          >
            <strong style={{ color: "#e3000b" }}>Внимание:</strong> {limitedOrOff}{" "}
            {limitedOrOff === 1 ? "модуль не в полном режиме" : "модуля не в полном режиме"} (ограничен или отключён).
          </div>
        )}

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
                placeholder="Поиск по модулю, модели, назначению…"
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
              {CATEGORY_OPTIONS.map((f) => {
                const active = category === f.val;
                return (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setCategory(f.val)}
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
            Показано {filtered.length} из {rows.length} в выборке · всего модулей: {ADMIN_AI_MODULES_TOTAL}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1180px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Модуль", "Тип", "Назначение", "Модель / стек", "Задержка", "Запросы / сутки", "Квота", "Статус", "Комментарий"].map((h) => (
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
                  const cc = categoryChipStyle(r.category);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 14) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 14px", maxWidth: "220px" }}>
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
                            background: cc.bg,
                            border: `1px solid ${cc.border}`,
                            color: "#000000",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {categoryLabel(r.category)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", lineHeight: 1.45, maxWidth: "240px" }}>{r.purpose}</td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "rgba(0,0,0,0.85)", lineHeight: 1.4 }}>{r.modelLabel}</td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.latencyMs} мс</td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", fontWeight: "500", color: "#000000", whiteSpace: "nowrap" }}>
                        {r.requestsToday.toLocaleString("ru-RU")}
                      </td>
                      <td style={{ padding: "12px 14px", minWidth: "100px" }}>
                        <div style={{ fontSize: "11px", fontWeight: "500", marginBottom: "4px", color: "#000000" }}>{r.quotaPct}%</div>
                        <div style={{ height: "5px", borderRadius: "5px", background: "rgba(129,208,245,0.12)" }}>
                          <div
                            style={{
                              width: `${Math.min(100, r.quotaPct)}%`,
                              height: "100%",
                              borderRadius: "5px",
                              background: quotaBarColor(r.quotaPct),
                              boxShadow: `0 0 4px ${quotaBarColor(r.quotaPct)}55`,
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
                        <select
                          id={`ai-module-status-${r.id}`}
                          aria-label={`Статус модуля ${r.name}`}
                          value={r.status}
                          onChange={(e) => setModuleStatus(r.id, e.target.value as AdminAiModuleStatus)}
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
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "rgba(0,0,0,0.72)", lineHeight: 1.45, maxWidth: "280px" }}>
                        {r.note}
                      </td>
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
