import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Download, FileBarChart, Search } from "lucide-react";
import {
  ADMIN_SYSTEM_REPORTS_TOTAL,
  adminSystemReportsSeed,
  type AdminReportFormat,
  type AdminReportJobStatus,
  type AdminSystemReportRow,
} from "../data/adminSystemReportsCatalog";
import { brandIcon } from "../lib/brandIcons";

const STATUS_OPTIONS: { val: AdminReportJobStatus; label: string }[] = [
  { val: "ready", label: "Готов" },
  { val: "running", label: "Выполняется" },
  { val: "failed", label: "Ошибка" },
  { val: "scheduled", label: "Запланирован" },
];

const statusFilters: { val: AdminReportJobStatus | "all"; label: string }[] = [
  { val: "all", label: "Все статусы" },
  ...STATUS_OPTIONS,
];

const FORMAT_OPTIONS: { val: AdminReportFormat | "all"; label: string }[] = [
  { val: "all", label: "Все форматы" },
  { val: "pdf", label: "PDF" },
  { val: "xlsx", label: "Таблица (XLSX)" },
  { val: "csv", label: "CSV" },
];

function formatLabel(f: AdminReportFormat): string {
  if (f === "pdf") return "PDF";
  if (f === "xlsx") return "Таблица (XLSX)";
  return "CSV";
}

function formatChipStyle(f: AdminReportFormat): { bg: string; border: string } {
  if (f === "pdf") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)" };
  if (f === "xlsx") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.32)" };
  return { bg: "rgba(0,0,0,0.05)", border: "rgba(0,0,0,0.1)" };
}

function statusSelectStyle(s: AdminReportJobStatus): { bg: string; border: string; color: string } {
  if (s === "ready") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.35)", color: "#000000" };
  if (s === "running") return { bg: "rgba(129,208,245,0.08)", border: "rgba(129,208,245,0.28)", color: "#000000" };
  if (s === "failed") return { bg: "rgba(227,0,11,0.1)", border: "rgba(227,0,11,0.28)", color: "#e3000b" };
  return { bg: "rgba(0,0,0,0.06)", border: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.55)" };
}

export function AdminSystemReportsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AdminReportJobStatus | "all">("all");
  const [format, setFormat] = useState<AdminReportFormat | "all">("all");
  const [rows, setRows] = useState<AdminSystemReportRow[]>(() => adminSystemReportsSeed.map((r) => ({ ...r })));

  const setReportStatus = (id: string, next: AdminReportJobStatus) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  };

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.category.toLowerCase().includes(qq) ||
        r.schedule.toLowerCase().includes(qq) ||
        r.detail.toLowerCase().includes(qq);
      const matchS = status === "all" || r.status === status;
      const matchF = format === "all" || r.format === format;
      return matchQ && matchS && matchF;
    });
  }, [q, status, format, rows]);

  const failedCount = rows.filter((r) => r.status === "failed").length;

  const demoDownload = (title: string) => {
    const el = document.createElement("div");
    el.textContent = `Демо: выгрузка «${title}» будет доступна после подключения бэкенда.`;
    Object.assign(el.style, {
      position: "fixed",
      bottom: "80px",
      right: "24px",
      zIndex: "9999",
      background: "rgba(0,0,0,0.97)",
      border: "1px solid rgba(129,208,245,0.35)",
      color: "#ffffff",
      borderRadius: "12px",
      padding: "12px 18px",
      fontSize: "13px",
      fontFamily: "var(--font-sans)",
      fontWeight: "500",
      maxWidth: "360px",
    });
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    }, 2600);
  };

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
                <FileBarChart size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  Системные отчёты
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
                  {ADMIN_SYSTEM_REPORTS_TOTAL} заданий
                </span>
                {failedCount > 0 && (
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
                    с ошибками: {failedCount}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Регламентные и разовые отчёты платформы ЕСО. Демо — статус и кнопка выгрузки без реального файла.
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
                placeholder="Поиск по отчёту, категории, расписанию…"
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
              {FORMAT_OPTIONS.map((f) => {
                const active = format === f.val;
                return (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setFormat(f.val)}
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
            Показано {filtered.length} из {rows.length} в выборке · всего заданий: {ADMIN_SYSTEM_REPORTS_TOTAL}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1080px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Отчёт", "Категория", "Формат", "Расписание", "Статус", "Последний запуск", "Размер", ""].map((h) => (
                    <th
                      key={h || "dl"}
                      style={{
                        textAlign: h ? "left" : "right",
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
                  const fc = formatChipStyle(r.format);
                  const canDemoDownload = r.status === "ready" && r.sizeMb != null;
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 14) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 14px", maxWidth: "260px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{r.name}</span>
                        <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)", marginTop: "4px", lineHeight: 1.4 }}>{r.detail}</div>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.category}</td>
                      <td style={{ padding: "14px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "500",
                            background: fc.bg,
                            border: `1px solid ${fc.border}`,
                            color: "#000000",
                          }}
                        >
                          {formatLabel(r.format)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", lineHeight: 1.4 }}>{r.schedule}</td>
                      <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
                        <select
                          id={`report-status-${r.id}`}
                          aria-label={`Статус отчёта: ${r.name}`}
                          value={r.status}
                          onChange={(e) => setReportStatus(r.id, e.target.value as AdminReportJobStatus)}
                          style={{
                            width: "100%",
                            maxWidth: "168px",
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
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.lastRun}</td>
                      <td style={{ padding: "14px 14px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>
                        {r.sizeMb != null ? `${r.sizeMb} МБ` : "—"}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", verticalAlign: "middle" }}>
                        <button
                          type="button"
                          disabled={!canDemoDownload}
                          onClick={() => demoDownload(r.name)}
                          aria-label={`Скачать отчёт: ${r.name}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            border: `1px solid ${canDemoDownload ? "rgba(129,208,245,0.35)" : "rgba(0,0,0,0.08)"}`,
                            background: canDemoDownload ? "rgba(129,208,245,0.08)" : "rgba(0,0,0,0.04)",
                            color: canDemoDownload ? brandIcon.stroke : "rgba(0,0,0,0.25)",
                            cursor: canDemoDownload ? "pointer" : "not-allowed",
                          }}
                        >
                          <Download size={16} strokeWidth={brandIcon.sw} />
                        </button>
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
