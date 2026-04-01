import React, { useState } from "react";
import { Download, Filter } from "lucide-react";

const departments = [
  "Разработка ПО",
  "DevOps / Infra",
  "Аналитика данных",
  "Дизайн & UX",
  "Продажи & CRM",
  "HR & People",
  "Финансы",
  "Юридический",
];

const competencies = [
  "Цифровая\nэфф.",
  "Управлен.",
  "Коммуник.",
  "Техн.\nэксперт.",
  "Agile",
  "Data &\nBI",
  "Инфобез.",
];

const heatData: number[][] = [
  [88, 72, 76, 94, 85, 78, 82],
  [91, 65, 70, 88, 80, 84, 94],
  [82, 58, 72, 76, 74, 96, 78],
  [74, 68, 88, 70, 72, 62, 65],
  [55, 80, 85, 48, 60, 55, 58],
  [72, 90, 92, 60, 65, 68, 70],
  [65, 76, 80, 55, 58, 88, 72],
  [58, 84, 78, 50, 52, 60, 65],
];

/** Только палитра бренда: #81d0f5 (циан) и #e3000b (красный) для заливок; цифры — #000000 */
function cellColor(v: number) {
  if (v >= 85) return { bg: "rgba(129,208,245,0.28)", hoverBg: "rgba(129,208,245,0.42)", border: "rgba(129,208,245,0.5)", glow: "rgba(129,208,245,0.45)" };
  if (v >= 70) return { bg: "rgba(129,208,245,0.14)", hoverBg: "rgba(129,208,245,0.26)", border: "rgba(129,208,245,0.32)", glow: "rgba(129,208,245,0.28)" };
  if (v >= 55) return { bg: "rgba(227,0,11,0.09)", hoverBg: "rgba(227,0,11,0.18)", border: "rgba(227,0,11,0.22)", glow: "rgba(227,0,11,0.22)" };
  return { bg: "rgba(227,0,11,0.2)", hoverBg: "rgba(227,0,11,0.32)", border: "rgba(227,0,11,0.38)", glow: "rgba(227,0,11,0.38)" };
}

interface TooltipState { x: number; y: number; dept: string; comp: string; val: number }

export function DepartmentHeatmap() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const legend = [
    { label: "Отлично (≥85)", swatch: "#81d0f5", glow: "rgba(129,208,245,0.45)" },
    { label: "Хорошо (70–84)", swatch: "rgba(129,208,245,0.45)", glow: "rgba(129,208,245,0.3)" },
    { label: "Средне (55–69)", swatch: "rgba(227,0,11,0.25)", glow: "rgba(227,0,11,0.25)" },
    { label: "Риск (<55)", swatch: "#e3000b", glow: "rgba(227,0,11,0.35)" },
  ];

  return (
    <div className="glass-card" style={{ padding: "24px", minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#000000", margin: 0 }}>Heatmap по подразделениям</h3>
            <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,0.14)", border: "1px solid rgba(129,208,245,0.35)", fontSize: "10px", fontWeight: "600", color: "#000000" }}>
              8 × 7
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#000000", margin: 0 }}>
            Средний балл компетенций по отделам компании
          </p>
        </div>
        <div style={{ display: "flex", gap: "7px" }}>
          {[Filter, Download].map((Icon, i) => (
            <button key={i} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#000000" }}>
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "16px", flexWrap: "wrap" }}>
        {legend.map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "9px", height: "9px", borderRadius: "3px", background: l.swatch, boxShadow: `0 0 6px ${l.glow}` }} />
            <span style={{ fontSize: "10.5px", color: "#000000" }}>{l.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "10.5px", color: "#000000" }}>Обновлено: 30.03.2026</div>
      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "4px" }}>
          <thead>
            <tr>
              <th style={{ width: "130px", minWidth: "130px" }} />
              {competencies.map((c, ci) => (
                <th key={ci} style={{ textAlign: "center", paddingBottom: "6px" }}>
                  <div style={{ fontSize: "10px", fontWeight: "600", color: "#000000", lineHeight: 1.3, whiteSpace: "pre-line" }}>{c}</div>
                </th>
              ))}
              <th style={{ width: "50px", textAlign: "center", paddingBottom: "6px" }}>
                <span style={{ fontSize: "10px", color: "#000000" }}>Avg</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, ri) => {
              const row = heatData[ri];
              const avg = Math.round(row.reduce((a, b) => a + b, 0) / row.length);
              const avgC = cellColor(avg);
              return (
                <tr key={ri}>
                  <td style={{ paddingRight: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: `linear-gradient(135deg,#e3000b,#81d0f5)`, flexShrink: 0 }} />
                      <span style={{ fontSize: "11.5px", color: "#000000", fontWeight: "500", whiteSpace: "nowrap" }}>{dept}</span>
                    </div>
                  </td>
                  {row.map((val, ci) => {
                    const c = cellColor(val);
                    const key = `${ri}-${ci}`;
                    const isHov = hoveredCell === key;
                    return (
                      <td key={ci} style={{ textAlign: "center" }}>
                        <div
                          style={{ height: "38px", borderRadius: "9px", background: isHov ? c.hoverBg : c.bg, border: `1px solid ${c.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s ease", transform: isHov ? "scale(1.08)" : "scale(1)", boxShadow: isHov ? `0 0 12px ${c.glow}` : "none" }}
                          onMouseEnter={e => {
                            setHoveredCell(key);
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8, dept, comp: competencies[ci].replace("\n", " "), val });
                          }}
                          onMouseLeave={() => { setHoveredCell(null); setTooltip(null); }}
                        >
                          <span style={{ fontSize: "12px", fontWeight: "800", color: "#000000" }}>{val}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td style={{ textAlign: "center" }}>
                    <div style={{ height: "38px", borderRadius: "9px", background: avgC.bg, border: `1px solid ${avgC.border}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 7px ${avgC.glow}` }}>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#000000" }}>{avg}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {/* Column averages */}
            <tr>
              <td style={{ paddingTop: "6px" }}>
                <span style={{ fontSize: "10px", color: "#000000", fontWeight: "600", paddingLeft: "12px" }}>Среднее</span>
              </td>
              {competencies.map((_, ci) => {
                const avg = Math.round(heatData.reduce((s, r) => s + r[ci], 0) / heatData.length);
                const c = cellColor(avg);
                return (
                  <td key={ci} style={{ textAlign: "center", paddingTop: "6px" }}>
                    <div style={{ height: "30px", borderRadius: "8px", background: c.bg, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "10.5px", fontWeight: "700", color: "#000000" }}>{avg}</span>
                    </div>
                  </td>
                );
              })}
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position: "fixed", left: tooltip.x, top: tooltip.y, transform: "translate(-50%,-100%)", zIndex: 1000, pointerEvents: "none" }}>
          <div style={{ background: "rgba(255,255,255,0.98)", border: "1px solid rgba(129,208,245,0.35)", borderRadius: "12px", padding: "10px 14px", backdropFilter: "blur(20px)", minWidth: "160px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#000000", marginBottom: "3px" }}>{tooltip.dept}</div>
            <div style={{ fontSize: "11px", color: "#000000", marginBottom: "6px" }}>{tooltip.comp}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "22px", fontWeight: "900", color: "#000000" }}>{tooltip.val}</span>
              <div style={{ width: "60px", height: "4px", borderRadius: "4px", background: "rgba(129,208,245,0.25)", overflow: "hidden" }}>
                <div style={{ width: `${tooltip.val}%`, height: "100%", background: tooltip.val >= 70 ? "#81d0f5" : "#e3000b", borderRadius: "4px" }} />
              </div>
            </div>
          </div>
          <div style={{ width: "8px", height: "8px", background: "rgba(255,255,255,0.98)", border: "1px solid rgba(0,0,0,0.1)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)", margin: "-4px auto 0", borderRadius: "1px" }} />
        </div>
      )}
    </div>
  );
}
