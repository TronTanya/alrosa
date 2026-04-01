import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Download, FileText, Search } from "lucide-react";
import {
  HR_REPORTS_TOTAL,
  getLiveHrReportRows,
  type HrReportCategory,
  type HrReportRow,
} from "../data/hrReportsCatalog";
import { buildReportDetailCsv } from "../lib/hrReportsData";
import { buildHrReportDetailHtml, buildHrReportsIndexHtml } from "../lib/hrReportsPdfHtml";
import { openPrintableReport } from "../lib/pdfExport";
import { downloadCsv } from "../lib/hrTableExport";
import { brandIcon } from "../lib/brandIcons";
import { L_D_GLOSS } from "../lib/hrLdLabels";

const REPORT_EXPORT_HEADERS = ["Отчёт", "Раздел", "Период", "Формат", "Обновлён", "Размер"] as const;

function reportRowToStrings(r: HrReportRow): string[] {
  return [r.title, r.category, r.period, r.format, r.updatedAt, r.sizeLabel];
}

function stampYyyymmdd(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function exportReportsExcel(filename: string, list: HrReportRow[]): void {
  downloadCsv(filename, [...REPORT_EXPORT_HEADERS], list.map(reportRowToStrings));
}

function exportReportsPdf(title: string, subtitle: string | undefined, list: HrReportRow[]): void {
  openPrintableReport(title, buildHrReportsIndexHtml(list, subtitle ?? ""));
}

const categoryFilters: { val: HrReportCategory | "all"; label: string }[] = [
  { val: "all", label: "Все разделы" },
  { val: "Обучение", label: "Обучение" },
  { val: "Бюджет", label: "Бюджет" },
  { val: "Компетенции", label: "Компетенции" },
  { val: "Сводка", label: "Сводка" },
];

function categoryChipStyle(c: HrReportCategory): { bg: string; border: string } {
  if (c === "Бюджет") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)" };
  if (c === "Компетенции") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.32)" };
  if (c === "Сводка") return { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)" };
  return { bg: "rgba(129,208,245,0.08)", border: "rgba(129,208,245,0.22)" };
}

export function HRReportsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<HrReportCategory | "all">("all");

  const catalogLive = getLiveHrReportRows();

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return catalogLive.filter((r) => {
      const matchQ =
        !qq ||
        r.title.toLowerCase().includes(qq) ||
        r.period.toLowerCase().includes(qq) ||
        r.category.toLowerCase().includes(qq);
      const matchC = category === "all" || r.category === category;
      return matchQ && matchC;
    });
  }, [q, category, catalogLive]);

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
                <FileText size={22} style={{ color: "#000000" }} />
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
                  Отчёты
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
                  {HR_REPORTS_TOTAL} шаблонов
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                PDF и CSV по каждому отчёту строятся из актуального справочника сотрудников, заявок (localStorage) и
                мероприятий L&amp;D. В диалоге печати выберите «Сохранить как PDF».
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
                placeholder="Поиск по названию, периоду, разделу…"
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", flex: "1 1 auto" }}>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                disabled={rows.length === 0}
                onClick={() => exportReportsExcel(`eso-reports-${stampYyyymmdd()}.csv`, rows)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "#e8e8e8",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: rows.length === 0 ? "not-allowed" : "pointer",
                  opacity: rows.length === 0 ? 0.45 : 1,
                  fontFamily: "var(--font-sans)",
                }}
              >
                <Download size={14} color="#000000" strokeWidth={brandIcon.sw} />
                Таблица
              </button>
              <button
                type="button"
                disabled={rows.length === 0}
                onClick={() =>
                  exportReportsPdf(
                    `Отчёты ${L_D_GLOSS}`,
                    `Выгрузка: ${rows.length} поз. · фильтр: ${category === "all" ? "все разделы" : category}`,
                    rows,
                  )
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(227,0,11,0.28)",
                  background: "rgba(227,0,11,0.06)",
                  color: "#e3000b",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: rows.length === 0 ? "not-allowed" : "pointer",
                  opacity: rows.length === 0 ? 0.45 : 1,
                  fontFamily: "var(--font-sans)",
                }}
              >
                <Download size={14} color="#e3000b" strokeWidth={brandIcon.sw} />
                В PDF
              </button>
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.75 }}>
            Показано {rows.length} из {HR_REPORTS_TOTAL}
            {rows.length < HR_REPORTS_TOTAL ? " (фильтр или поиск)" : ""}.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Отчёт", "Раздел", "Период", "Формат", "Обновлён", "Размер", "Действие"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
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
                {rows.map((r, i) => {
                  const chip = categoryChipStyle(r.category);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 16) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 16px", maxWidth: "320px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{r.title}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 9px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "500",
                            color: "#000000",
                            background: chip.bg,
                            border: `1px solid ${chip.border}`,
                          }}
                        >
                          {r.category}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.period}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", fontWeight: "500", color: "#000000" }}>{r.format}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.updatedAt}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{r.sizeLabel}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => {
                              const { headers, rows: dataRows } = buildReportDetailCsv(r.id);
                              downloadCsv(`report-${r.id}-${stampYyyymmdd()}.csv`, headers, dataRows);
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 14px",
                              borderRadius: "999px",
                              border: "1px solid rgba(0,0,0,0.12)",
                              background: "#e8e8e8",
                              color: "#000000",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontFamily: "var(--font-sans)",
                            }}
                          >
                            <Download size={14} color="#000000" strokeWidth={brandIcon.sw} />
                            Таблица
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openPrintableReport(`Отчёт: ${r.title}`, buildHrReportDetailHtml(r.id))
                            }
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 14px",
                              borderRadius: "999px",
                              border: "1px solid rgba(227,0,11,0.28)",
                              background: "rgba(227,0,11,0.06)",
                              color: "#e3000b",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontFamily: "var(--font-sans)",
                            }}
                          >
                            <Download size={14} color="#e3000b" strokeWidth={brandIcon.sw} />
                            В PDF
                          </button>
                        </div>
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
