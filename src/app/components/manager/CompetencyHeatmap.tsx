import React, { useState } from "react";
import { Info, Download, Filter } from "lucide-react";
import { brandIcon } from "../../lib/brandIcons";

const employees = [
  "Александр Иванов",
  "Мария Соколова",
  "Дмитрий Козлов",
  "Анна Волкова",
  "Сергей Морозов",
  "Елена Новикова",
  "Павел Лебедев",
  "Ольга Попова",
];

const competencies = [
  "Цифровая\nэффектив.",
  "Управлен.\nнавыки",
  "Коммуни-\nкативная",
  "Техн.\nэкспертиза",
  "Agile /\nScrum",
  "Data\nAnalytics",
  "Безопас-\nность",
  "Иннова-\nционность",
];

const rawData: number[][] = [
  [82, 70, 88, 91, 75, 68, 55, 80],
  [45, 88, 92, 72, 80, 55, 70, 65],
  [91, 76, 65, 85, 88, 92, 78, 87],
  [38, 55, 78, 60, 45, 72, 82, 58],
  [72, 62, 50, 77, 68, 60, 55, 74],
  [55, 90, 84, 48, 72, 65, 88, 70],
  [88, 45, 70, 92, 55, 82, 76, 91],
  [62, 78, 88, 65, 90, 48, 60, 55],
];

function cellColor(v: number): { bg: string; text: string; glow: string } {
  if (v >= 80) return { bg: "rgba(129,208,245,0.22)", text: brandIcon.accentCyan, glow: "rgba(129,208,245,0.35)" };
  if (v >= 60) return { bg: "rgba(227,0,11,0.1)", text: "#c41e3a", glow: "rgba(227,0,11,0.22)" };
  if (v >= 45) return { bg: "rgba(245,158,11,0.18)", text: "#d97706", glow: "rgba(245,158,11,0.28)" };
  return { bg: "rgba(227,0,11,0.16)", text: brandIcon.accentRed, glow: "rgba(227,0,11,0.3)" };
}

function cellLabel(v: number) {
  if (v >= 80) return "Высокий";
  if (v >= 60) return "Хороший";
  if (v >= 45) return "Средний";
  return "Низкий";
}

interface TooltipState { x: number; y: number; emp: string; comp: string; val: number }

export function CompetencyHeatmap() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const legend = [
    { label: "Высокий (≥80)", color: brandIcon.accentCyan },
    { label: "Хороший (60–79)", color: "#c41e3a" },
    { label: "Средний (45–59)", color: "#d97706" },
    { label: "Низкий (<45)", color: brandIcon.accentRed },
  ];

  return (
    <div className="glass-card" style={{ padding: "24px", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#000000", margin: 0 }}>
              Heatmap компетенций команды
            </h3>
            <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,0.15)", border: "1px solid rgba(129,208,245,0.4)", fontSize: "10px", fontWeight: "600", color: "#000000" }}>
              8 × 8
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)", margin: 0 }}>
            Уровень владения компетенциями по каждому сотруднику
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[Filter, Download, Info].map((Icon, i) => (
            <button key={i} type="button" style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: brandIcon.stroke }}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "18px", flexWrap: "wrap" }}>
        {legend.map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: l.color, boxShadow: `0 0 6px ${l.color}66` }} />
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)" }}>{l.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>
          Обновлено 30.03.2026 в 08:00
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "5px" }}>
          <thead>
            <tr>
              <th style={{ width: "140px", minWidth: "140px" }} />
              {competencies.map((c, ci) => (
                <th key={ci} style={{ textAlign: "center", paddingBottom: "8px" }}>
                  <div style={{ fontSize: "10px", fontWeight: "600", color: "rgba(0,0,0,0.5)", lineHeight: 1.3, whiteSpace: "pre-line" }}>
                    {c}
                  </div>
                </th>
              ))}
              <th style={{ width: "56px", paddingBottom: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)" }}>Среднее</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, ri) => {
              const row = rawData[ri];
              const avg = Math.round(row.reduce((a, b) => a + b, 0) / row.length);
              const avgColor = cellColor(avg);
              return (
                <tr key={ri}>
                  <td style={{ paddingRight: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: ri % 2 === 0 ? "linear-gradient(135deg,#e3000b,#81d0f5)" : "linear-gradient(135deg,#81d0f5,#e3000b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#ffffff", flexShrink: 0 }}>
                        {emp.split(" ").map(w => w[0]).slice(0, 2).join("")}
                      </div>
                      <span style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.85)", fontWeight: "500", whiteSpace: "nowrap" }}>
                        {emp}
                      </span>
                    </div>
                  </td>
                  {row.map((val, ci) => {
                    const c = cellColor(val);
                    const key = `${ri}-${ci}`;
                    const isHov = hoveredCell === key;
                    return (
                      <td key={ci} style={{ textAlign: "center" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "42px", borderRadius: "10px", background: c.bg, border: `1px solid ${c.text}28`, cursor: "pointer", transition: "all .18s ease", transform: isHov ? "scale(1.06)" : "scale(1)", boxShadow: isHov ? `0 0 12px ${c.glow}` : "none", position: "relative", filter: isHov ? "brightness(0.97)" : "none" }}
                          onMouseEnter={e => {
                            setHoveredCell(key);
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8, emp, comp: competencies[ci].replace("\n", " "), val });
                          }}
                          onMouseLeave={() => { setHoveredCell(null); setTooltip(null); }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: "800", color: c.text, lineHeight: 1 }}>{val}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td style={{ textAlign: "center" }}>
                    <div style={{ height: "42px", borderRadius: "10px", background: avgColor.bg, border: `1px solid ${avgColor.text}35`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 8px ${avgColor.glow}` }}>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: avgColor.text }}>{avg}</span>
                    </div>
                  </td>
                </tr>
              );
            })}

            <tr>
              <td style={{ paddingTop: "8px" }}>
                <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)", fontWeight: "600", paddingLeft: "34px" }}>Среднее</span>
              </td>
              {competencies.map((_, ci) => {
                const avg = Math.round(rawData.reduce((s, r) => s + r[ci], 0) / rawData.length);
                const c = cellColor(avg);
                return (
                  <td key={ci} style={{ textAlign: "center", paddingTop: "8px" }}>
                    <div style={{ height: "32px", borderRadius: "8px", background: c.bg, border: `1px solid ${c.text}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: c.text }}>{avg}</span>
                    </div>
                  </td>
                );
              })}
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {tooltip && (
        <div style={{ position: "fixed", left: tooltip.x, top: tooltip.y, transform: "translate(-50%,-100%)", zIndex: 1000, pointerEvents: "none" }}>
          <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "10px 14px", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", minWidth: "160px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#000000", marginBottom: "4px" }}>{tooltip.emp}</div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)", marginBottom: "6px" }}>{tooltip.comp}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px", fontWeight: "900", color: cellColor(tooltip.val).text }}>{tooltip.val}</span>
              <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: cellColor(tooltip.val).bg, color: cellColor(tooltip.val).text, fontWeight: "600" }}>{cellLabel(tooltip.val)}</span>
            </div>
            <div style={{ width: "100%", height: "3px", borderRadius: "3px", background: "rgba(0,0,0,0.06)", marginTop: "8px", overflow: "hidden" }}>
              <div style={{ width: `${tooltip.val}%`, height: "100%", background: cellColor(tooltip.val).text, borderRadius: "3px" }} />
            </div>
          </div>
          <div style={{ width: "8px", height: "8px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)", margin: "-4px auto 0", borderRadius: "1px" }} />
        </div>
      )}
    </div>
  );
}
