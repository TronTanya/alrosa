import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, ExternalLink, Search } from "lucide-react";
import {
  ADMIN_COURSES_TOTAL,
  seedAdminCourses,
  type AdminCourseRow,
  type AdminCourseVisibility,
} from "../data/adminCoursesCatalog";
import type { HrCourseFormat } from "../data/hrCourseCatalog";
import { brandIcon } from "../lib/brandIcons";

const VISIBILITY_OPTIONS: { val: AdminCourseVisibility; label: string }[] = [
  { val: "published", label: "Опубликован" },
  { val: "draft", label: "Черновик" },
  { val: "hidden", label: "Скрыт" },
];

const visibilityFilters: { val: AdminCourseVisibility | "all"; label: string }[] = [
  { val: "all", label: "Все статусы" },
  ...VISIBILITY_OPTIONS,
];

const formatFilters: { val: HrCourseFormat | "all"; label: string }[] = [
  { val: "all", label: "Все форматы" },
  { val: "external", label: "Внешние" },
  { val: "internal", label: "Внутренние" },
];

function formatLabel(f: HrCourseFormat): string {
  return f === "internal" ? "Внутренний" : "Внешний";
}

function formatChipStyle(f: HrCourseFormat): { bg: string; border: string } {
  if (f === "internal") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)" };
  return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.32)" };
}

function visibilitySelectStyle(v: AdminCourseVisibility): { bg: string; border: string; color: string } {
  if (v === "published") return { bg: "rgba(129,208,245,0.12)", border: "rgba(129,208,245,0.35)", color: "#000000" };
  if (v === "draft") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)", color: "#e3000b" };
  return { bg: "rgba(0,0,0,0.06)", border: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.55)" };
}

export function AdminCoursesPage() {
  const [q, setQ] = useState("");
  const [format, setFormat] = useState<HrCourseFormat | "all">("all");
  const [visibility, setVisibility] = useState<AdminCourseVisibility | "all">("all");
  const [courses, setCourses] = useState<AdminCourseRow[]>(() => seedAdminCourses());

  const setCourseVisibility = (id: string, next: AdminCourseVisibility) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, visibility: next } : c)));
  };

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return courses.filter((r) => {
      const matchQ =
        !qq ||
        r.title.toLowerCase().includes(qq) ||
        r.provider.toLowerCase().includes(qq) ||
        r.tags.some((t) => t.toLowerCase().includes(qq)) ||
        r.reason.toLowerCase().includes(qq);
      const matchF = format === "all" || r.format === format;
      const matchV = visibility === "all" || r.visibility === visibility;
      return matchQ && matchF && matchV;
    });
  }, [q, format, visibility, courses]);

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
                <BookOpen size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
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
                  Управление курсами
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
                  {ADMIN_COURSES_TOTAL} в каталоге
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Реестр программ ЕСО: видимость в каталоге (опубликован, черновик, скрыт). Демо — изменения только в браузере.
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
                placeholder="Поиск по названию, провайдеру, тегам…"
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
              {formatFilters.map((f) => {
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
              {visibilityFilters.map((f) => {
                const active = visibility === f.val;
                return (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setVisibility(f.val)}
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
            Показано {rows.length} из {courses.length} в выборке · всего в каталоге: {ADMIN_COURSES_TOTAL}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "960px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Программа", "Провайдер", "Формат", "Длительность", "Видимость", "Записей", ""].map((h) => (
                    <th
                      key={h || "link"}
                      style={{
                        textAlign: h ? "left" : "right",
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
                  const fc = formatChipStyle(r.format);
                  const vs = visibilitySelectStyle(r.visibility);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 14) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 16px", maxWidth: "320px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{r.title}</span>
                        <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", marginTop: "4px", lineHeight: 1.4 }}>
                          {r.tags.slice(0, 3).join(" · ")}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.provider}</td>
                      <td style={{ padding: "14px 16px" }}>
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
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.duration}</td>
                      <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                        <select
                          id={`course-visibility-${r.id}`}
                          aria-label={`Видимость курса ${r.title}`}
                          value={r.visibility}
                          onChange={(e) => setCourseVisibility(r.id, e.target.value as AdminCourseVisibility)}
                          style={{
                            width: "100%",
                            maxWidth: "160px",
                            padding: "8px 10px",
                            borderRadius: "10px",
                            border: `1px solid ${vs.border}`,
                            background: vs.bg,
                            color: vs.color,
                            fontSize: "12px",
                            fontWeight: "500",
                            fontFamily: "var(--font-sans)",
                            cursor: "pointer",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        >
                          {VISIBILITY_OPTIONS.map((opt) => (
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", fontWeight: "500", color: "#000000", whiteSpace: "nowrap" }}>
                        {r.enrollments}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", verticalAlign: "middle" }}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Открыть страницу курса: ${r.title}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            border: "1px solid rgba(129,208,245,0.28)",
                            background: "rgba(129,208,245,0.06)",
                            color: brandIcon.stroke,
                          }}
                        >
                          <ExternalLink size={16} strokeWidth={brandIcon.sw} />
                        </a>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: "13px", color: "#000000" }}>
              Ничего не найдено. Измените запрос или фильтры.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
