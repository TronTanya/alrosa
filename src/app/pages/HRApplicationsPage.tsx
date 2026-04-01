import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Briefcase, Search } from "lucide-react";
import {
  DEMO_PORTAL_EMPLOYEE,
  formatRuDateShort,
  readStoredTrainingApplications,
  TRAINING_APPLICATIONS_UPDATED,
} from "../lib/trainingApplicationsStorage";

type AppStatus = "На согласовании" | "Одобрено" | "В работе" | "Завершено" | "Отклонено";

interface HrApplicationRow {
  id: string;
  employeeName: string;
  department: string;
  title: string;
  typeLabel: string;
  date: string;
  status: AppStatus;
  highlight?: boolean;
}

const statusStyle: Record<AppStatus, { bg: string; color: string; border: string }> = {
  "На согласовании": { bg: "rgba(227,0,11,.1)", color: "#e3000b", border: "rgba(227,0,11,.28)" },
  Одобрено: { bg: "rgba(129,208,245,.16)", color: "#000000", border: "rgba(129,208,245,.4)" },
  "В работе": { bg: "rgba(129,208,245,.1)", color: "#000000", border: "rgba(129,208,245,.28)" },
  Завершено: { bg: "rgba(0,0,0,.06)", color: "#000000", border: "rgba(0,0,0,.12)" },
  Отклонено: { bg: "rgba(227,0,11,.08)", color: "#e3000b", border: "rgba(227,0,11,.35)" },
};

/** Демо-очередь L&D: заявки по сотрудникам (вне localStorage) */
const HR_QUEUE_DEMO: HrApplicationRow[] = [
  { id: "d1", employeeName: "Елена Волкова", department: "Platform", title: "Курс «Продвинутый Kubernetes»", typeLabel: "Внешнее обучение", date: "28.03.2026", status: "На согласовании" },
  { id: "d2", employeeName: "Михаил Петров", department: "Разработка ПО", title: "Сертификация AWS Solutions Architect", typeLabel: "Сертификация", date: "12.02.2026", status: "Одобрено" },
  { id: "d3", employeeName: "Ольга Сидорова", department: "QA", title: "Тренинг по презентациям для ИТ", typeLabel: "Soft Skills", date: "05.01.2026", status: "Завершено" },
  { id: "d4", employeeName: "Игорь Никифоров", department: "DevOps / Infra", title: "Observability: продвинутый уровень", typeLabel: "Онлайн-курс", date: "26.03.2026", status: "На согласовании" },
  { id: "d5", employeeName: "Анна Кузнецова", department: "Продакт", title: "Design Thinking для продуктов", typeLabel: "Внешнее обучение", date: "22.03.2026", status: "В работе" },
  { id: "d6", employeeName: "Дмитрий Орлов", department: "Продажи & CRM", title: "CRM-аналитика и отчёты", typeLabel: "Внутреннее обучение", date: "20.03.2026", status: "На согласовании" },
  { id: "d7", employeeName: "Светлана Морозова", department: "HR & People", title: "Коучинг и фасилитация", typeLabel: "Конференция", date: "18.03.2026", status: "Одобрено" },
  { id: "d8", employeeName: "Павел Семёнов", department: "Финансы", title: "Excel / BI для финансовых моделей", typeLabel: "Онлайн-курс", date: "15.03.2026", status: "В работе" },
  { id: "d9", employeeName: "Кристина Лебедева", department: "Юридический", title: "Персональные данные и ИБ", typeLabel: "Внешнее обучение", date: "14.03.2026", status: "На согласовании" },
  { id: "d10", employeeName: "Артём Васильев", department: "Дизайн & UX", title: "Figma Advanced + дизайн-системы", typeLabel: "Онлайн-курс", date: "12.03.2026", status: "Одобрено" },
  { id: "d11", employeeName: "Наталья Егорова", department: "Аналитика данных", title: "SQL и витрины данных", typeLabel: "Внешнее обучение", date: "10.03.2026", status: "Отклонено" },
  { id: "d12", employeeName: "Сергей Козлов", department: "Инфобез", title: "GRC и аудит ИТ", typeLabel: "Сертификация", date: "08.03.2026", status: "В работе" },
  { id: "d13", employeeName: "Виктория Степанова", department: "Разработка ПО", title: "Менторство разработчиков", typeLabel: "Внутреннее обучение", date: "06.03.2026", status: "На согласовании" },
  { id: "d14", employeeName: "Роман Алексеев", department: "Data Engineering", title: "Apache Spark для аналитики", typeLabel: "Онлайн-курс", date: "04.03.2026", status: "Завершено" },
  { id: "d15", employeeName: "Марина Николаева", department: "QA", title: "Автотесты API (REST)", typeLabel: "Внешнее обучение", date: "01.03.2026", status: "На согласовании" },
];

const statusFilters: { val: AppStatus | "all"; label: string }[] = [
  { val: "all", label: "Все" },
  { val: "На согласовании", label: "На согласовании" },
  { val: "Одобрено", label: "Одобрено" },
  { val: "В работе", label: "В работе" },
  { val: "Завершено", label: "Завершено" },
  { val: "Отклонено", label: "Отклонено" },
];

export function HRApplicationsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AppStatus | "all">("all");
  const [storedTick, setStoredTick] = useState(0);

  useEffect(() => {
    const bump = () => setStoredTick((t) => t + 1);
    window.addEventListener(TRAINING_APPLICATIONS_UPDATED, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(TRAINING_APPLICATIONS_UPDATED, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const allRows = useMemo(() => {
    const storedRows: HrApplicationRow[] = readStoredTrainingApplications().map((s) => ({
      id: `stored-${s.id}`,
      employeeName: DEMO_PORTAL_EMPLOYEE.employee,
      department: DEMO_PORTAL_EMPLOYEE.dept,
      title: s.title,
      typeLabel: s.typeLabel,
      date: formatRuDateShort(s.submittedAt),
      status: "На согласовании" as AppStatus,
      highlight: true,
    }));
    return [...storedRows, ...HR_QUEUE_DEMO];
  }, [storedTick]);

  const pendingCount = useMemo(
    () => allRows.filter((a) => a.status === "На согласовании").length,
    [allRows],
  );

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return allRows.filter((r) => {
      const matchQ =
        !qq ||
        r.employeeName.toLowerCase().includes(qq) ||
        r.department.toLowerCase().includes(qq) ||
        r.title.toLowerCase().includes(qq) ||
        r.typeLabel.toLowerCase().includes(qq);
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    });
  }, [allRows, q, status]);

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
                <Briefcase size={22} style={{ color: "#000000" }} />
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
                  Заявки на обучение
                </h1>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "rgba(129,208,245,0.14)",
                    border: "1px solid rgba(129,208,245,0.35)",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#000000",
                  }}
                >
                  {pendingCount} на согласовании
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Очередь L&amp;D: заявки сотрудников по внешним и внутренним программам. Новые заявки из портала отмечены как NEW.
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
                placeholder="Поиск по сотруднику, отделу, заявке…"
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
            Показано {rows.length} из {allRows.length}
            {rows.length < allRows.length ? " (фильтр или поиск)" : ""}.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Сотрудник", "Подразделение", "Заявка", "Тип", "Дата", "Статус"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "10px",
                        fontWeight: "700",
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
                {rows.map((a, i) => {
                  const st = statusStyle[a.status];
                  return (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 18) }}
                      style={{
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        background: a.highlight
                          ? "linear-gradient(90deg, rgba(227,0,11,.04) 0%, rgba(129,208,245,.06) 100%)"
                          : undefined,
                        borderLeft: a.highlight ? "3px solid #e3000b" : "3px solid transparent",
                      }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#000000" }}>{a.employeeName}</span>
                          {a.highlight ? (
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: "800",
                                letterSpacing: "0.06em",
                                color: "#ffffff",
                                background: "#e3000b",
                                padding: "3px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              NEW
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{a.department}</td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: "600", color: "#000000", maxWidth: "280px" }}>
                        {a.title}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{a.typeLabel}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{a.date}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            background: st.bg,
                            color: st.color,
                            border: `1px solid ${st.border}`,
                          }}
                        >
                          {a.status}
                        </span>
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
