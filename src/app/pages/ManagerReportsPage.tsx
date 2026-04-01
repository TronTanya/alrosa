import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BarChart3, Download, FileText, Search, TrendingUp, Users } from "lucide-react";
import { downloadCsv, openPrintableDocument } from "../lib/hrTableExport";
import { brandIcon } from "../lib/brandIcons";
import {
  MANAGER_TEAM_MEMBERS,
  MANAGER_TEAM_SIZE,
  managerTeamInActiveLearning,
} from "../data/managerTeamCatalog";
import {
  currentQuarterLabel,
  currentYearLabel,
  formatDateRu,
  getManagerReportExport,
  monthYearRu,
  stampYyyymmdd,
} from "../data/managerReportsExport";

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

const HEADERS = ["Отчёт", "Раздел", "Период", "Формат", "Обновлён", "Размер"] as const;
const TABLE_HEADERS = [...HEADERS, "Действие"] as const;

function rowToCsv(r: ReportRow): string[] {
  return [r.title, r.category, r.period, r.format, r.updatedAt, r.sizeLabel];
}

function estimateSizeKb(seed: number): string {
  const kb = 18 + MANAGER_TEAM_SIZE * 11 + (seed % 40);
  return `${kb} КБ`;
}

function yearStartToMonthRu(now: Date): string {
  const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];
  return `Январь–${months[now.getMonth()]} ${now.getFullYear()}`;
}

function buildCatalog(now: Date): ReportRow[] {
  const today = formatDateRu(now);
  const q = currentQuarterLabel(now);
  const y = currentYearLabel(now);
  const my = monthYearRu(now);

  return [
    {
      id: "1",
      title: "Сводка по обучению команды (квартал)",
      category: "Сводка",
      period: q,
      format: "XLSX / PDF",
      updatedAt: today,
      sizeLabel: estimateSizeKb(12),
    },
    {
      id: "2",
      title: "Статусы заявок на обучение (подразделение)",
      category: "Обучение",
      period: my,
      format: "CSV",
      updatedAt: today,
      sizeLabel: estimateSizeKb(38),
    },
    {
      id: "3",
      title: "Прогресс по корпоративным программам",
      category: "Обучение",
      period: y,
      format: "PDF",
      updatedAt: today,
      sizeLabel: estimateSizeKb(52),
    },
    {
      id: "4",
      title: "Матрица компетенций — срез по команде",
      category: "Команда",
      period: `Актуально на ${today}`,
      format: "XLSX",
      updatedAt: today,
      sizeLabel: estimateSizeKb(24),
    },
    {
      id: "5",
      title: "ИПР: цели и дедлайны (прямые подчинённые)",
      category: "Команда",
      period: q,
      format: "PDF",
      updatedAt: today,
      sizeLabel: estimateSizeKb(41),
    },
    {
      id: "6",
      title: "Часы обучения и бюджет (направление)",
      category: "Сводка",
      period: yearStartToMonthRu(now),
      format: "XLSX",
      updatedAt: today,
      sizeLabel: estimateSizeKb(67),
    },
  ];
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

  const catalog = buildCatalog(new Date());

  const teamStats = useMemo(() => {
    const members = MANAGER_TEAM_MEMBERS;
    const avg =
      members.length === 0 ? 0 : Math.round(members.reduce((s, m) => s + m.progress, 0) / members.length);
    const atRisk = members.filter((m) => m.courseStatus === "риск").length;
    const inLearning = managerTeamInActiveLearning();
    const totalCerts = members.reduce((s, m) => s + m.certs, 0);
    const depts = new Set(members.map((m) => m.dept)).size;
    const critical = members.filter((m) => m.recUrgency === "critical").length;
    return { avg, atRisk, inLearning, totalCerts, depts, critical };
  }, []);

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
  }, [q, category, catalog]);

  const exportListCsv = () => {
    downloadCsv(`manager-reports-list-${stampYyyymmdd()}`, [...HEADERS], rows.map(rowToCsv));
  };

  const exportListPdf = () => {
    openPrintableDocument({
      title: "Отчёты руководителя",
      subtitle: `Список выгрузок · команда ${MANAGER_TEAM_SIZE} чел. · ${formatDateRu(new Date())}`,
      headers: [...HEADERS],
      rows: rows.map(rowToCsv),
    });
  };

  const exportDetailCsv = (reportId: string) => {
    const exp = getManagerReportExport(reportId);
    if (!exp) return;
    downloadCsv(`${exp.filenameBase}-${stampYyyymmdd()}`, exp.headers, exp.rows);
  };

  const exportDetailPdf = (reportId: string) => {
    const exp = getManagerReportExport(reportId);
    if (!exp) return;
    openPrintableDocument({
      title: exp.title,
      subtitle: exp.subtitle,
      headers: exp.headers,
      rows: exp.rows,
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
                  fontWeight: 600,
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
              Выгрузки по команде из тех же данных, что главная, курсы и достижения. Кнопки в строке формируют таблицу по
              сотрудникам; сверху — экспорт списка отчётов.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        {[
          {
            icon: Users,
            label: "Средний прогресс",
            value: `${teamStats.avg}%`,
            sub: `${MANAGER_TEAM_SIZE} сотрудников`,
          },
          {
            icon: BarChart3,
            label: "В активном обучении",
            value: String(teamStats.inLearning),
            sub: "в работе или риск по сроку",
          },
          {
            icon: TrendingUp,
            label: "Риск по курсам",
            value: String(teamStats.atRisk),
            sub: teamStats.critical > 0 ? `критичных рекомендаций ИИ: ${teamStats.critical}` : "без критичных ИИ-триггеров",
          },
          {
            icon: FileText,
            label: "Подразделений в срезе",
            value: String(teamStats.depts),
            sub: `сертификатов всего: ${teamStats.totalCerts}`,
          },
        ].map((k, i) => {
          const KIcon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              style={{
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(0,0,0,0.08)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(129,208,245,0.08))",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <KIcon size={18} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
                <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(0,0,0,0.75)" }}>{k.label}</span>
              </div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#000000" }}>{k.value}</div>
              <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", marginTop: "4px" }}>{k.sub}</div>
            </motion.div>
          );
        })}
      </div>

      <div
        style={{
          borderRadius: "14px",
          border: "1px solid rgba(129,208,245,0.25)",
          padding: "14px 16px",
          marginBottom: "16px",
          background: "rgba(129,208,245,0.06)",
          fontSize: "12px",
          lineHeight: 1.55,
          color: "rgba(0,0,0,0.75)",
        }}
      >
        <strong style={{ color: "#000000" }}>Краткий разбор:</strong> средний прогресс команды{" "}
        <strong>{teamStats.avg}%</strong>
        {teamStats.atRisk > 0
          ? `; ${teamStats.atRisk} сотрудник(а) с отметкой «риск» по текущему курсу — проверьте дедлайны в выгрузке «Статусы заявок» и «Сводка по обучению».`
          : " — отметок «риск» по курсам нет."}{" "}
        Актуальная дата среза: {formatDateRu(new Date())}.
      </div>

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
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                color: "#000000",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", marginLeft: "auto", flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={rows.length === 0}
            onClick={exportListCsv}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.12)",
              background: "#ffffff",
              fontSize: "12px",
              fontWeight: 500,
              cursor: rows.length === 0 ? "not-allowed" : "pointer",
              opacity: rows.length === 0 ? 0.45 : 1,
              fontFamily: "inherit",
            }}
          >
            <Download size={14} strokeWidth={brandIcon.sw} />
            Список CSV
          </button>
          <button
            type="button"
            disabled={rows.length === 0}
            onClick={exportListPdf}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(227,0,11,0.25)",
              background: "linear-gradient(135deg, rgba(227,0,11,0.08), rgba(129,208,245,0.12))",
              fontSize: "12px",
              fontWeight: 500,
              cursor: rows.length === 0 ? "not-allowed" : "pointer",
              opacity: rows.length === 0 ? 0.45 : 1,
              fontFamily: "inherit",
            }}
          >
            <Download size={14} strokeWidth={brandIcon.sw} />
            Список PDF
          </button>
        </div>
      </div>

      <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)", margin: "0 0 12px" }}>
        Показано {rows.length} из {catalog.length}
        {rows.length < catalog.length ? " (поиск или фильтр)" : ""}.
      </p>

      <div
        style={{
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "960px" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.03)", textAlign: "left" }}>
                {TABLE_HEADERS.map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontWeight: 500, color: "rgba(0,0,0,0.65)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "24px 14px", color: "rgba(0,0,0,0.45)", textAlign: "center" }}>
                    Ничего не найдено — измените фильтр или запрос.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => {
                  const chip = chipStyle(r.category);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 12) }}
                      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "12px 14px", fontWeight: 500, color: "#000000", maxWidth: "280px" }}>{r.title}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: 500,
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
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => exportDetailCsv(r.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid rgba(0,0,0,0.12)",
                              background: "#fafafa",
                              fontSize: "11px",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            <Download size={12} strokeWidth={brandIcon.sw} />
                            Данные CSV
                          </button>
                          <button
                            type="button"
                            onClick={() => exportDetailPdf(r.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid rgba(227,0,11,0.25)",
                              background: "rgba(227,0,11,0.06)",
                              fontSize: "11px",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              color: "#b91c1c",
                            }}
                          >
                            <Download size={12} strokeWidth={brandIcon.sw} />
                            Данные PDF
                          </button>
                        </div>
                      </td>
                    </motion.tr>
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
