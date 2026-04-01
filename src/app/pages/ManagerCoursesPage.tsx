import React, { useMemo } from "react";
import { motion } from "motion/react";
import { BookOpen, Clock, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { MANAGER_TEAM_MEMBERS, MANAGER_TEAM_SIZE, managerTeamInActiveLearning } from "../data/managerTeamCatalog";

type Row = {
  employee: string;
  dept: string;
  course: string;
  status: "в работе" | "запланирован" | "завершён" | "риск";
  deadline: string;
  progress: number;
};

const teamPrograms = [
  { title: "Корпоративный модуль «Безопасность 2026»", enrolled: 8, done: 8, deadline: "30 апр 2026" },
  { title: "Путь Middle → Senior (направление «Разработка»)", enrolled: 8, done: 3, deadline: "31 дек 2026" },
];

function statusStyle(s: Row["status"]) {
  if (s === "завершён") return { bg: "rgba(129,208,245,0.14)", border: "rgba(129,208,245,0.4)", color: "#0369a1" };
  if (s === "риск") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.25)", color: brandIcon.accentRed };
  if (s === "запланирован") return { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.65)" };
  return { bg: "rgba(227,0,11,0.06)", border: "rgba(129,208,245,0.35)", color: "#000000" };
}

export function ManagerCoursesPage() {
  const rows: Row[] = useMemo(
    () =>
      MANAGER_TEAM_MEMBERS.map((m) => ({
        employee: m.shortName,
        dept: m.dept,
        course: m.activeCourse,
        status: m.courseStatus,
        deadline: m.courseDeadline,
        progress: m.courseProgress,
      })),
    [],
  );

  const inLearning = managerTeamInActiveLearning();
  const deadlineRisk = useMemo(
    () => MANAGER_TEAM_MEMBERS.filter((m) => m.courseStatus === "риск").length,
    [],
  );

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
              <BookOpen size={22} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
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
                Курсы и обучение
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
              Обучение вашей команды: активные курсы, сроки и риски по сотрудникам. Корпоративные программы и охват.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          { icon: Users, label: "В обучении сейчас", value: String(inLearning), sub: `из ${MANAGER_TEAM_SIZE} в команде` },
          { icon: Clock, label: "В зоне риска по срокам", value: String(deadlineRisk), sub: "требуют внимания" },
          { icon: CheckCircle2, label: "Завершено в Q1", value: "23", sub: "курсов / модулей" },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
            className="glass-card-bright"
            style={{ padding: "16px 18px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, rgba(227,0,11,0.12), rgba(129,208,245,0.18))",
                  border: "1px solid rgba(129,208,245,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <k.icon size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
              </div>
              <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", fontWeight: 500 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 600, color: "#000000", letterSpacing: "-0.5px" }}>{k.value}</div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)", marginTop: "4px" }}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass-card"
        style={{ padding: "20px", marginBottom: "16px" }}
      >
        <div style={{ fontSize: "14px", fontWeight: 500, color: "#000000", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={16} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
          Команда: курсы в работе
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: "640px" }}>
            <thead>
              <tr>
                {["Сотрудник", "Отдел", "Курс", "Статус", "Срок", "Прогресс"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0 12px 10px",
                      fontSize: "10px",
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.45)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const st = statusStyle(r.status);
                return (
                  <tr key={`${r.employee}-${r.course}`}>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "13px", fontWeight: 500, color: "#000000" }}>
                      {r.employee}
                    </td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "12px", color: "rgba(0,0,0,0.65)" }}>{r.dept}</td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "12px", color: "#000000" }}>{r.course}</td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 500,
                          background: st.bg,
                          border: `1px solid ${st.border}`,
                          color: st.color,
                        }}
                      >
                        {r.status === "риск" && <AlertCircle size={12} />}
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "12px", color: "rgba(0,0,0,0.55)" }}>{r.deadline}</td>
                    <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "5px", borderRadius: "5px", background: "rgba(0,0,0,0.08)", maxWidth: "100px" }}>
                          <div
                            style={{
                              width: `${r.progress}%`,
                              height: "100%",
                              borderRadius: "5px",
                              background: "linear-gradient(90deg, #e3000b, #81d0f5)",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 500, color: "#000000", minWidth: "32px" }}>{r.progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card-md" style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "#000000", marginBottom: "12px" }}>Корпоративные программы</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {teamPrograms.map((p) => (
            <div
              key={p.title}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(129,208,245,0.35)",
                background: "rgba(129,208,245,0.06)",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#000000" }}>{p.title}</div>
                <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", marginTop: "4px" }}>Дедлайн программы: {p.deadline}</div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 500, color: "#000000", whiteSpace: "nowrap" }}>
                {p.done}/{p.enrolled} завершили
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
