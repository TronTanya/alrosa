import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Download, FileText, Search } from "lucide-react";
import { downloadCsv, openPrintableDocument } from "../lib/hrTableExport";
import { brandIcon } from "../lib/brandIcons";

type ReportCategory = "Обучение" | "Команда" | "Сводка";

type ReportRow = {
  id: string;
  title: string;
  category: ReportCategory;
  period: string;
  format: string;
  updatedAt: string;
  sizeLabel: string;
};

const catalog: ReportRow[] = [
  {
    id: "1",
    title: "Сводка по обучению команды (квартал)",
    category: "Сводка",
    period: "Q1 2026",
    format: "XLSX / PDF",
    updatedAt: "28.03.2026",
    sizeLabel: "124 КБ",
  },
  {
    id: "2",
    title: "Статусы заявок на обучение (подразделение)",
    category: "Обучение",
    period: "Март 2026",
    format: "CSV",
    updatedAt: "29.03.2026",
    sizeLabel: "38 КБ",
  },
  {
    id: "3",
    title: "Прогресс по корпоративным программам",
    category: "Обучение",
    period: "2026 год",
    format: "PDF",
    updatedAt: "25.03.2026",
    sizeLabel: "512 КБ",
  },
  {
    id: "4",
    title: "Матрица компетенций — срез по команде",
    category: "Команда",
    period: "Актуально на 30.03",
    format: "XLSX",
    updatedAt: "30.03.2026",
    sizeLabel: "89 КБ",
  },
  {
    id: "5",
    title: "ИПР: цели и дедлайны (прямые подчинённые)",
    category: "Команда",
    period: "Q2 2026",
    format: "PDF",
    updatedAt: "27.03.2026",
    sizeLabel: "210 КБ",
  },
  {
    id: "6",
    title: "Часы обучения и бюджет (направление)",
    category: "Сводка",
    period: "Январь–март 2026",
    format: "XLSX",
    updatedAt: "29.03.2026",
    sizeLabel: "67 КБ",
  },
];

const HEADERS = ["Отчёт", "Раздел", "Период", "Формат", "Обновлён", "Размер"] as const;

function rowToCsv(r: ReportRow): string[] {
  return [r.title, r.category, r.period, r.format, r.updatedAt, r.sizeLabel];
}

const filters: { val: ReportCategory | "all"; label: string }[] = [
  { val: "all", label: "Все разделы" },
  { val: "Сводка", label: "Сводка" },
  { val: "Обучение", label: "Обучение" },
  { val: "Команда", label: "Команда" },
];

function chipStyle(c: ReportCategory): { bg: string; border: string } {
  if (c === "Команда") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.32)" };
  if (c === "Сводка") return { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)" };
  return { bg: "rgba(227,0,11,0.06)", border: "rgba(227,0,11,0.2)" };
}

export function ManagerReportsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<ReportCategory | "all">("all");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return catalog.filter((r) => {
      const matchQ =
        !qq ||
        r.title.toLowerCase().includes(qq) ||
        r.period.toLowerCase().includes(qq) ||
        r.category.toLowerCase().includes(qq);
      const matchC = category === "all" || r.category === category;
      return matchQ && matchC;
    });
  }, [q, category]);

  const exportCsv = () => {
    downloadCsv(`manager-reports-${Date.now()}`, [...HEADERS], rows.map(rowToCsv));
  };

  const exportPdf = () => {
    openPrintableDocument({
      title: "Отчёты руководителя",
      subtitle: "Список доступных выгрузок по команде",
      headers: [...HEADERS],
      rows: rows.map(rowToCsv),
    });
  };

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
              <FileText size={22} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
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
                Отчёты
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
              Выгрузки и сводки по вашей команде: обучение, ИПР и компетенции. Данные демонстрационные — интеграцию с ЕСО и L&D можно
              настроить на бэкенде.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.08)",
            background: "#fafafa",
            flex: "1 1 220px",
            minWidth: 0,
          }}
        >
          <Search size={16} color={brandIcon.muted} strokeWidth={brandIcon.sw} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по названию или периоду…"
            aria-label="Поиск отчётов"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "13px",
              flex: 1,
              minWidth: 0,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {filters.map((f) => (
            <button
              key={f.val}
              type="button"
              onClick={() => setCategory(f.val)}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                border: category === f.val ? "1px solid rgba(129,208,245,0.55)" : "1px solid rgba(0,0,0,0.1)",
                background: category === f.val ? "rgba(129,208,245,0.18)" : "#ffffff",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                color: "#000000",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          <button
            type="button"
            onClick={exportCsv}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.12)",
              background: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Download size={14} strokeWidth={brandIcon.sw} />
            CSV
          </button>
          <button
            type="button"
            onClick={exportPdf}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(227,0,11,0.25)",
              background: "linear-gradient(135deg, rgba(227,0,11,0.08), rgba(129,208,245,0.12))",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Download size={14} strokeWidth={brandIcon.sw} />
            Печать / PDF
          </button>
        </div>
      </div>

      <div
        style={{
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.03)", textAlign: "left" }}>
                {HEADERS.map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: "rgba(0,0,0,0.65)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "24px 14px", color: "rgba(0,0,0,0.45)", textAlign: "center" }}>
                    Ничего не найдено — измените фильтр или запрос.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const chip = chipStyle(r.category);
                  return (
                    <tr key={r.id} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#000000", maxWidth: "280px" }}>{r.title}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: chip.bg,
                            border: `1px solid ${chip.border}`,
                            color: "#000000",
                          }}
                        >
                          {r.category}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "rgba(0,0,0,0.75)", whiteSpace: "nowrap" }}>{r.period}</td>
                      <td style={{ padding: "12px 14px", color: "rgba(0,0,0,0.65)" }}>{r.format}</td>
                      <td style={{ padding: "12px 14px", color: "rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>{r.updatedAt}</td>
                      <td style={{ padding: "12px 14px", color: "rgba(0,0,0,0.55)" }}>{r.sizeLabel}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
