import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, TrendingUp } from "lucide-react";
import {
  HR_COMPETENCIES_TOTAL,
  hrCompetenciesMatrix,
  type HrCompetencyCategory,
  type HrCompetencyTrend,
} from "../data/hrCompetenciesMatrix";

const categoryFilters: { val: HrCompetencyCategory | "all"; label: string }[] = [
  { val: "all", label: "Все" },
  { val: "Технические", label: "Технические" },
  { val: "Soft skills", label: "Soft skills" },
  { val: "Лидерство", label: "Лидерство" },
  { val: "Безопасность", label: "Безопасность" },
  { val: "Data & AI", label: "Data & AI" },
];

function priorityStyle(p: "Высокий" | "Средний" | "Низкий"): { bg: string; border: string } {
  if (p === "Высокий") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)" };
  if (p === "Средний") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.32)" };
  return { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)" };
}

function trendColor(t: HrCompetencyTrend): string {
  if (t === "↑") return "#0d9488";
  if (t === "↓") return "#e3000b";
  return "#000000";
}

export function HRCompetenciesPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<HrCompetencyCategory | "all">("all");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return hrCompetenciesMatrix.filter((r) => {
      const matchQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.category.toLowerCase().includes(qq) ||
        r.avgLevel.toLowerCase().includes(qq);
      const matchC = category === "all" || r.category === category;
      return matchQ && matchC;
    });
  }, [q, category]);

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
                <TrendingUp size={22} style={{ color: "#000000" }} />
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
                  Компетенции
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
                  {HR_COMPETENCIES_TOTAL} направлений в матрице
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Корпоративная матрица: охват сотрудников, средний уровень развития, динамика и приоритеты L&amp;D по направлениям.
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
                placeholder="Поиск по компетенции или категории…"
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
              {categoryFilters.map((f) => {
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
          </div>
          <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.75 }}>
            Показано {rows.length} из {HR_COMPETENCIES_TOTAL}
            {rows.length < HR_COMPETENCIES_TOTAL ? " (фильтр или поиск)" : ""}.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "920px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Компетенция", "Категория", "Охват", "Средний уровень", "Тренд", "Приоритет L&D"].map((h) => (
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
                  const pr = priorityStyle(r.priority);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 16) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 16px", maxWidth: "320px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#000000", lineHeight: 1.35 }}>{r.name}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{r.category}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", fontWeight: "700", color: "#000000" }}>{r.coveragePct}%</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{r.avgLevel}</td>
                      <td style={{ padding: "14px 16px", fontSize: "16px", fontWeight: "800", color: trendColor(r.trend) }}>{r.trend}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 9px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#000000",
                            background: pr.bg,
                            border: `1px solid ${pr.border}`,
                          }}
                        >
                          {r.priority}
                        </span>
                      </td>
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
