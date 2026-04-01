import React, { useCallback, useEffect, useState } from "react";
import { Info, Download, Filter } from "lucide-react";
import { brandIcon } from "../../lib/brandIcons";

type HeatmapViewFilter = "all" | "risk" | "strong";

function cellOpacity(val: number, filter: HeatmapViewFilter): number {
  if (filter === "all") return 1;
  if (filter === "risk") return val < 60 ? 1 : 0.22;
  if (filter === "strong") return val >= 80 ? 1 : 0.22;
  return 1;
}

function downloadHeatmapCsv(
  employeesList: string[],
  comps: string[],
  data: number[][],
): void {
  const header = ["Сотрудник", ...comps.map((c) => c.replace(/\n/g, " ").trim()), "Среднее по строке"];
  const lines = employeesList.map((emp, ri) => {
    const row = data[ri];
    const avg = Math.round(row.reduce((a, b) => a + b, 0) / row.length);
    return [emp, ...row.map(String), String(avg)].join(";");
  });
  const bom = "\uFEFF";
  const csv = `${bom}${header.join(";")}\r\n${lines.join("\r\n")}\r\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `heatmap-komanda-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

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
  "Данные и\nаналитика",
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
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState<HeatmapViewFilter>("all");
  const [infoOpen, setInfoOpen] = useState(false);

  const onExport = useCallback(() => {
    downloadHeatmapCsv(employees, competencies, rawData);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFilterPanelOpen(false);
        setInfoOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
            <h3 style={{ fontSize: "15px", fontWeight: "500", color: "#000000", margin: 0 }}>
              Heatmap компетенций команды
            </h3>
            <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,0.15)", border: "1px solid rgba(129,208,245,0.4)", fontSize: "10px", fontWeight: "500", color: "#000000" }}>
              8 × 8
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)", margin: 0 }}>
            Уровень владения компетенциями по каждому сотруднику
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", position: "relative" }}>
          <button
            type="button"
            title="Фильтр отображения"
            aria-label="Фильтр отображения"
            aria-expanded={filterPanelOpen}
            onClick={() => setFilterPanelOpen((o) => !o)}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: filterPanelOpen || viewFilter !== "all" ? "rgba(129,208,245,0.14)" : "rgba(0,0,0,0.03)",
              border: filterPanelOpen || viewFilter !== "all" ? "1px solid rgba(129,208,245,0.45)" : "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: brandIcon.stroke,
            }}
          >
            <Filter size={14} />
          </button>
          <button
            type="button"
            title="Скачать таблицу (CSV)"
            aria-label="Скачать таблицу в формате CSV"
            onClick={onExport}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: brandIcon.stroke,
            }}
          >
            <Download size={14} />
          </button>
          <button
            type="button"
            title="Справка по heatmap"
            aria-label="Справка по матрице компетенций"
            aria-pressed={infoOpen}
            onClick={() => setInfoOpen((o) => !o)}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: infoOpen ? "rgba(129,208,245,0.12)" : "rgba(0,0,0,0.03)",
              border: infoOpen ? "1px solid rgba(129,208,245,0.55)" : "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: brandIcon.stroke,
              boxShadow: infoOpen ? "0 0 0 1px rgba(129,208,245,0.25)" : "none",
            }}
          >
            <Info size={14} />
          </button>

          {filterPanelOpen && (
            <div
              className="glass-card"
              role="dialog"
              aria-label="Настройки фильтра"
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                zIndex: 50,
                minWidth: "240px",
                padding: "14px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                border: "1px solid rgba(129,208,245,0.35)",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(0,0,0,0.55)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Подсветка ячеек
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(
                  [
                    ["all", "Все уровни"],
                    ["risk", "Зоны риска (< 60)"],
                    ["strong", "Сильные стороны (≥ 80)"],
                  ] as const
                ).map(([val, lab]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setViewFilter(val);
                      setFilterPanelOpen(false);
                    }}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: viewFilter === val ? "1px solid rgba(227,0,11,0.35)" : "1px solid rgba(0,0,0,0.08)",
                      background: viewFilter === val ? "rgba(227,0,11,0.06)" : "rgba(0,0,0,0.02)",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "#000000",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {lab}
                  </button>
                ))}
              </div>
            </div>
          )}

          {infoOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="heatmap-info-title"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 2000,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={() => setInfoOpen(false)}
            >
              <div
                className="glass-card"
                style={{ maxWidth: "420px", width: "100%", padding: "20px 22px", border: "1px solid rgba(129,208,245,0.4)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 id="heatmap-info-title" style={{ margin: "0 0 10px", fontSize: "15px", fontWeight: 600, color: "#000000" }}>
                  Матрица компетенций
                </h4>
                <p style={{ margin: "0 0 12px", fontSize: "13px", lineHeight: 1.55, color: "rgba(0,0,0,0.75)" }}>
                  Каждая ячейка — оценка сотрудника по направлению (0–100). Цвета соответствуют уровню: высокий, хороший, средний, низкий. Строка «Среднее» внизу — по компетенции по всей команде.
                </p>
                <p style={{ margin: "0 0 16px", fontSize: "12px", lineHeight: 1.5, color: "rgba(0,0,0,0.55)" }}>
                  <strong>Фильтр</strong> подсвечивает только выбранный тип ячеек. <strong>Скачать</strong> выгружает таблицу в CSV для Excel.
                </p>
                <button
                  type="button"
                  onClick={() => setInfoOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg,#e3000b,#81d0f5)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Понятно
                </button>
              </div>
            </div>
          )}
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
                  <div style={{ fontSize: "10px", fontWeight: "500", color: "rgba(0,0,0,0.5)", lineHeight: 1.3, whiteSpace: "pre-line" }}>
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
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: ri % 2 === 0 ? "linear-gradient(135deg,#e3000b,#81d0f5)" : "linear-gradient(135deg,#81d0f5,#e3000b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "500", color: "#ffffff", flexShrink: 0 }}>
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
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "42px", borderRadius: "10px", background: c.bg, border: `1px solid ${c.text}28`, cursor: "pointer", transition: "all .18s ease, opacity .2s ease", transform: isHov ? "scale(1.06)" : "scale(1)", boxShadow: isHov ? `0 0 12px ${c.glow}` : "none", position: "relative", filter: isHov ? "brightness(0.97)" : "none", opacity: cellOpacity(val, viewFilter) }}
                          onMouseEnter={e => {
                            setHoveredCell(key);
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8, emp, comp: competencies[ci].replace("\n", " "), val });
                          }}
                          onMouseLeave={() => { setHoveredCell(null); setTooltip(null); }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: "600", color: c.text, lineHeight: 1 }}>{val}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        height: "42px",
                        borderRadius: "10px",
                        background: avgColor.bg,
                        border: `1px solid ${avgColor.text}35`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 0 8px ${avgColor.glow}`,
                        opacity: cellOpacity(avg, viewFilter),
                        transition: "opacity .2s ease",
                      }}
                    >
                      <span style={{ fontSize: "12px", fontWeight: "600", color: avgColor.text }}>{avg}</span>
                    </div>
                  </td>
                </tr>
              );
            })}

            <tr>
              <td style={{ paddingTop: "8px" }}>
                <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)", fontWeight: "500", paddingLeft: "34px" }}>Среднее</span>
              </td>
              {competencies.map((_, ci) => {
                const avg = Math.round(rawData.reduce((s, r) => s + r[ci], 0) / rawData.length);
                const c = cellColor(avg);
                return (
                  <td key={ci} style={{ textAlign: "center", paddingTop: "8px" }}>
                    <div
                      style={{
                        height: "32px",
                        borderRadius: "8px",
                        background: c.bg,
                        border: `1px solid ${c.text}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: cellOpacity(avg, viewFilter),
                        transition: "opacity .2s ease",
                      }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: "500", color: c.text }}>{avg}</span>
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
            <div style={{ fontSize: "12px", fontWeight: "500", color: "#000000", marginBottom: "4px" }}>{tooltip.emp}</div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)", marginBottom: "6px" }}>{tooltip.comp}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px", fontWeight: "900", color: cellColor(tooltip.val).text }}>{tooltip.val}</span>
              <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: cellColor(tooltip.val).bg, color: cellColor(tooltip.val).text, fontWeight: "500" }}>{cellLabel(tooltip.val)}</span>
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
