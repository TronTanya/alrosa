import React from "react";
import { motion } from "motion/react";
import { TrendingUp, Target, Users, AlertTriangle } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";

type SkillRow = {
  skill: string;
  teamAvg: number;
  target: number;
  gap: "низкий" | "средний" | "высокий";
  trend: string;
};

const skillRows: SkillRow[] = [
  { skill: "Системный дизайн", teamAvg: 72, target: 80, gap: "средний", trend: "+4 за квартал" },
  { skill: "TypeScript / фронтенд", teamAvg: 81, target: 85, gap: "низкий", trend: "+2" },
  { skill: "Kubernetes / DevOps", teamAvg: 58, target: 75, gap: "высокий", trend: "+6" },
  { skill: "Аналитика данных", teamAvg: 64, target: 70, gap: "средний", trend: "+3" },
  { skill: "Коммуникация / лидерство", teamAvg: 76, target: 78, gap: "низкий", trend: "+1" },
];

function gapStyle(g: SkillRow["gap"]) {
  if (g === "высокий") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.25)", color: brandIcon.accentRed };
  if (g === "средний") return { bg: "rgba(129,208,245,0.1)", border: "rgba(129,208,245,0.4)", color: "#0369a1" };
  return { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.65)" };
}

export function ManagerCompetenciesPage() {
  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 4px" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              width: "4px",
              height: "26px",
              borderRadius: "6px",
              background: "linear-gradient(180deg, #e3000b, #81d0f5)",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
              <TrendingUp size={22} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
              <h1
                style={{
                  fontSize: "clamp(20px, 2vw, 1.4rem)",
                  fontWeight: 800,
                  color: "#000000",
                  margin: 0,
                  lineHeight: 1.15,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Компетенции
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
              Сводка по навыкам команды относительно целевого профиля: средний уровень, разрывы и динамика. Демо-данные для планирования ИПР и обучения.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          { icon: Users, label: "Оценено в матрице", value: "15", sub: "сотрудников команды" },
          { icon: Target, label: "Разрыв к цели", value: "3", sub: "навыка с высоким gap" },
          { icon: TrendingUp, label: "Рост за квартал", value: "+5%", sub: "средний прирост по команде" },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
            className="glass-card-bright"
            style={{ padding: "16px 18px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, rgba(227,0,11,0.12), rgba(129,208,245,0.18))",
                  border: "1px solid rgba(129,208,245,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <k.icon size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
              </div>
              <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", fontWeight: 600 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#000000", letterSpacing: "-0.5px" }}>{k.value}</div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)", marginTop: "4px" }}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass-card"
        style={{ padding: "20px", marginBottom: "16px" }}
      >
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000000", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Target size={16} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
          Ключевые компетенции команды
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: "640px" }}>
            <thead>
              <tr>
                {["Навык", "Средний уровень", "Цель", "Разрыв", "Динамика"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0 12px 10px",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.45)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skillRows.map((r, idx) => {
                const st = gapStyle(r.gap);
                return (
                  <tr key={idx}>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "13px", fontWeight: 600, color: "#000000" }}>
                      {r.skill}
                    </td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "13px", fontWeight: 700, color: "#000000" }}>{r.teamAvg}%</td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "12px", color: "rgba(0,0,0,0.55)" }}>{r.target}%</td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: st.bg,
                          border: `1px solid ${st.border}`,
                          color: st.color,
                        }}
                      >
                        {r.gap === "высокий" && <AlertTriangle size={12} />}
                        {r.gap}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "12px", color: "rgba(0,0,0,0.55)" }}>{r.trend}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card-md" style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000000", marginBottom: "10px" }}>Приоритеты развития (демо)</div>
        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "rgba(0,0,0,0.7)", lineHeight: 1.6 }}>
          <li>Усилить DevOps / K8s: закрыть разрыв до целевого уровня — групповой модуль + менторство.</li>
          <li>Системный дизайн: парные ревью архитектуры и внутренние разборы кейсов.</li>
          <li>Зафиксировать прогресс в ИПР и связать с каталогом обучения в разделе «Курсы и обучение».</li>
        </ul>
      </motion.div>
    </div>
  );
}
