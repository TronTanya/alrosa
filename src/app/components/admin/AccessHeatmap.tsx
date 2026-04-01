import React, { useState } from "react";
import { Download, Filter, Lock, Unlock, Eye } from "lucide-react";

const roles = [
  "Администратор",
  "L&D Директор",
  "HR-менеджер",
  "Руководитель",
  "Сотрудник",
  "Куратор курса",
  "Аналитик",
];

const modules = [
  "Пользов.",
  "Курсы",
  "Планы",
  "Аналитика",
  "Финансы",
  "Настройки",
  "ИИ-модуль",
  "Интеграции",
];

// Access level: 0=none, 1=read, 2=write, 3=admin
const accessMatrix: number[][] = [
  [3, 3, 3, 3, 3, 3, 3, 3], // Admin
  [1, 3, 3, 3, 2, 0, 2, 1], // L&D Dir
  [1, 2, 2, 2, 1, 0, 1, 0], // HR Manager
  [1, 1, 2, 2, 0, 0, 1, 0], // Manager
  [0, 1, 1, 0, 0, 0, 1, 0], // Employee
  [0, 2, 1, 1, 0, 0, 1, 0], // Curator
  [1, 1, 1, 3, 1, 0, 2, 0], // Analyst
];

const levelCfg = [
  { label: "Нет", color: "rgba(0,0,0,0.03)", text: "rgba(0,0,0,0.25)", icon: "—", border: "rgba(0,0,0,0.08)" },
  { label: "Чтение", color: "rgba(129,208,245,0.35)", text: "#000000", icon: "👁", border: "rgba(129,208,245,0.5)" },
  { label: "Запись", color: "rgba(227,0,11,0.12)", text: "#e3000b", icon: "✏️", border: "rgba(227,0,11,0.28)" },
  { label: "Полный", color: "rgba(227,0,11,0.22)", text: "#000000", icon: "⚡", border: "rgba(227,0,11,0.38)" },
];

const levelLabels = ["—", "R", "R/W", "ADM"];
const levelColors = ["rgba(0,0,0,0.06)", "#81d0f5", "#e3000b", "#c40009"];

interface TooltipState { x: number; y: number; role: string; mod: string; level: number }

export function AccessHeatmap() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string | null>(null);

  return (
    <div className="glass-card" style={{ padding: "24px", minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#000000", margin: 0 }}>Heatmap доступа</h3>
            <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,0.14)", border: "1px solid rgba(129,208,245,0.35)", fontSize: "10px", fontWeight: "600", color: "#000000" }}>7 × 8</div>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", margin: 0 }}>Матрица прав доступа по ролям и системным модулям</p>
        </div>
        <div style={{ display: "flex", gap: "7px" }}>
          {[Filter, Download].map((Icon, i) => (
            <button
              key={i}
              type="button"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(129,208,245,0.06)",
                border: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#000000",
              }}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        {levelCfg.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: l.color, border: `1px solid ${l.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "8px", fontWeight: "800", color: l.text }}>{levelLabels[i]}</span>
            </div>
            <span style={{ fontSize: "10.5px", color: "rgba(0,0,0,0.55)" }}>{l.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "10.5px", color: "rgba(0,0,0,0.4)" }}>Клик — редактировать</div>
      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "4px" }}>
          <thead>
            <tr>
              <th style={{ width: "130px", minWidth: "130px" }} />
              {modules.map((m, ci) => (
                <th key={ci} style={{ textAlign: "center", paddingBottom: "6px" }}>
                  <div style={{ fontSize: "10px", fontWeight: "600", color: "rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>{m}</div>
                </th>
              ))}
              <th style={{ width: "46px", textAlign: "center", paddingBottom: "6px" }}>
                <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>Прав</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, ri) => {
              const row = accessMatrix[ri];
              const adminCount = row.filter(v => v === 3).length;
              const rwCount    = row.filter(v => v === 2).length;
              const rCount     = row.filter(v => v === 1).length;
              const isHovRole  = filterRole === role;
              return (
                <tr key={ri} onMouseEnter={() => setFilterRole(role)} onMouseLeave={() => setFilterRole(null)}>
                  <td style={{ paddingRight: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "4px 6px", borderRadius: "8px", background: isHovRole ? "rgba(129,208,245,0.1)" : "transparent", transition: "background .15s" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ri === 0 ? "#e3000b" : ri <= 2 ? "#81d0f5" : "#000000", flexShrink: 0, boxShadow: ri === 0 ? "0 0 6px rgba(227,0,11,0.45)" : "none" }} />
                      <span style={{ fontSize: "11.5px", color: isHovRole ? "#000000" : "rgba(0,0,0,0.75)", fontWeight: isHovRole ? "600" : "500", whiteSpace: "nowrap", transition: "color .15s" }}>{role}</span>
                    </div>
                  </td>
                  {row.map((val, ci) => {
                    const cfg = levelCfg[val];
                    const key = `${ri}-${ci}`;
                    const isHov = hoveredCell === key;
                    return (
                      <td key={ci} style={{ textAlign: "center" }}>
                        <div
                          style={{ height: "36px", borderRadius: "9px", background: isHov ? cfg.color.replace(/[\d.]+\)$/, m => `${Math.min(parseFloat(m) * 1.8, 1)})`) : cfg.color, border: `1px solid ${isHov ? cfg.border.replace(/[\d.]+\)$/, ".55)") : cfg.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s ease", transform: isHov ? "scale(1.1)" : "scale(1)", boxShadow: isHov && val > 0 ? `0 0 12px ${levelCfg[val].text}44` : "none" }}
                          onMouseEnter={e => {
                            setHoveredCell(key);
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8, role, mod: modules[ci], level: val });
                          }}
                          onMouseLeave={() => { setHoveredCell(null); setTooltip(null); }}
                        >
                          {val === 0
                            ? <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.15)" }}>—</span>
                            : val === 1
                            ? <Eye size={12} style={{ color: cfg.text }} />
                            : val === 2
                            ? <Unlock size={12} style={{ color: cfg.text }} />
                            : <Lock size={12} style={{ color: cfg.text }} />
                          }
                        </div>
                      </td>
                    );
                  })}
                  {/* Rights summary */}
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "center" }}>
                      {adminCount > 0 && <div style={{ width: "30px", fontSize: "9px", fontWeight: "700", color: "#e3000b", background: "rgba(227,0,11,0.12)", borderRadius: "4px", padding: "1px 3px" }}>ADM:{adminCount}</div>}
                      {rwCount  > 0 && <div style={{ width: "30px", fontSize: "9px", fontWeight: "700", color: "#81d0f5", background: "rgba(129,208,245,0.15)", borderRadius: "4px", padding: "1px 3px" }}>R/W:{rwCount}</div>}
                      {rCount   > 0 && <div style={{ width: "30px", fontSize: "9px", fontWeight: "700", color: "#000000", background: "rgba(0,0,0,0.06)", borderRadius: "4px", padding: "1px 3px" }}>R:{rCount}</div>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Module-level totals */}
      <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: "8px", overflowX: "auto" }}>
        {modules.map((m, ci) => {
          const col = accessMatrix.map(r => r[ci]);
          const maxLevel = Math.max(...col);
          const cfg = levelCfg[maxLevel];
          return (
            <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
              <div style={{ width: "36px", height: "24px", borderRadius: "6px", background: cfg.color, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "9px", fontWeight: "800", color: cfg.text }}>{levelLabels[maxLevel]}</span>
              </div>
              <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.45)", textAlign: "center", whiteSpace: "nowrap" }}>{m}</span>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position: "fixed", left: tooltip.x, top: tooltip.y, transform: "translate(-50%,-100%)", zIndex: 1000, pointerEvents: "none" }}>
          <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "10px 14px", minWidth: "170px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#000000", marginBottom: "2px" }}>{tooltip.role}</div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)", marginBottom: "7px" }}>{tooltip.mod}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ padding: "3px 10px", borderRadius: "20px", background: levelCfg[tooltip.level].color, border: `1px solid ${levelCfg[tooltip.level].border}`, fontSize: "11.5px", fontWeight: "700", color: levelCfg[tooltip.level].text }}>{levelCfg[tooltip.level].label}</div>
              {tooltip.level > 0 && <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)" }}>Изменить →</span>}
            </div>
          </div>
          <div style={{ width: "8px", height: "8px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)", margin: "-4px auto 0", borderRadius: "1px" }} />
        </div>
      )}
    </div>
  );
}
