import React, { useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp, Search, Filter, ArrowUpDown } from "lucide-react";
import { brandIcon } from "../../lib/brandIcons";

interface Employee {
  id: number;
  name: string;
  role: string;
  progress: number;
  iprStatus: "on-track" | "at-risk" | "behind" | "completed";
  lastCourse: string;
  lastCourseDate: string;
  aiRec: string;
  recUrgency: "normal" | "warning" | "critical";
  dept: string;
}

const employees: Employee[] = [
  { id: 1, name: "Александр Иванов", role: "Middle Software Engineer", progress: 82, iprStatus: "on-track", lastCourse: "Python Advanced", lastCourseDate: "25 мар", aiRec: "Добавить ML-курс", recUrgency: "normal", dept: "Backend" },
  { id: 2, name: "Мария Соколова", role: "Senior Frontend Developer", progress: 91, iprStatus: "on-track", lastCourse: "React Architecture", lastCourseDate: "28 мар", aiRec: "Готова к повышению", recUrgency: "normal", dept: "Frontend" },
  { id: 3, name: "Дмитрий Козлов", role: "DevOps Engineer", progress: 76, iprStatus: "at-risk", lastCourse: "Kubernetes Advanced", lastCourseDate: "18 мар", aiRec: "Риск выгорания", recUrgency: "warning", dept: "DevOps" },
  { id: 4, name: "Анна Волкова", role: "Junior Data Analyst", progress: 38, iprStatus: "behind", lastCourse: "SQL Basics", lastCourseDate: "10 мар", aiRec: "Срочно: отстаёт на 3 курса", recUrgency: "critical", dept: "Analytics" },
  { id: 5, name: "Сергей Морозов", role: "QA Lead", progress: 65, iprStatus: "at-risk", lastCourse: "Cypress Testing", lastCourseDate: "22 мар", aiRec: "Навык QA снижается", recUrgency: "warning", dept: "QA" },
  { id: 6, name: "Елена Новикова", role: "Product Manager", progress: 88, iprStatus: "on-track", lastCourse: "Agile Leadership", lastCourseDate: "29 мар", aiRec: "Рекомендую стратегический курс", recUrgency: "normal", dept: "Product" },
  { id: 7, name: "Павел Лебедев", role: "Senior Backend Developer", progress: 79, iprStatus: "at-risk", lastCourse: "Go Lang Pro", lastCourseDate: "15 мар", aiRec: "Риск выгорания", recUrgency: "warning", dept: "Backend" },
  { id: 8, name: "Ольга Попова", role: "UX Designer", progress: 55, iprStatus: "behind", lastCourse: "Figma Advanced", lastCourseDate: "5 мар", aiRec: "Нет активности 25 дней", recUrgency: "critical", dept: "Design" },
];

const iprStatusConfig = {
  "on-track": { label: "В графике", color: "#0369a1", bg: "rgba(129,208,245,0.2)", border: "rgba(129,208,245,0.45)" },
  "at-risk": { label: "Под риском", color: "#b45309", bg: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.35)" },
  "behind": { label: "Отстаёт", color: brandIcon.accentRed, bg: "rgba(227,0,11,0.1)", border: "rgba(227,0,11,0.3)" },
  "completed": { label: "Завершён", color: "#0e7490", bg: "rgba(129,208,245,0.16)", border: "rgba(129,208,245,0.4)" },
};

const urgencyConfig = {
  "normal": { dot: brandIcon.accentCyan, bg: "rgba(129,208,245,0.12)", text: "rgba(0,0,0,0.7)" },
  "warning": { dot: "#d97706", bg: "rgba(245,158,11,0.1)", text: "#b45309" },
  "critical": { dot: brandIcon.accentRed, bg: "rgba(227,0,11,0.08)", text: "#b91c1c" },
};

const gradients = [
  "linear-gradient(135deg,#e3000b,#81d0f5)",
  "linear-gradient(135deg,#81d0f5,#e3000b)",
  "linear-gradient(135deg,#e3000b,#a5d8f5)",
  "linear-gradient(135deg,#81d0f5,#f87171)",
  "linear-gradient(135deg,#e3000b,#60a5fa)",
  "linear-gradient(135deg,#81d0f5,#e3000b)",
  "linear-gradient(135deg,#f87171,#81d0f5)",
  "linear-gradient(135deg,#e3000b,#81d0f5)",
];

function ProgressBar({ value }: { value: number }) {
  const color = value >= 80 ? brandIcon.accentCyan : value >= 60 ? "#0369a1" : value >= 45 ? "#d97706" : brandIcon.accentRed;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "5px", borderRadius: "5px", background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: `linear-gradient(90deg,${color}99,${color})`, borderRadius: "5px", boxShadow: `0 0 6px ${color}40` }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: "700", color, minWidth: "30px", textAlign: "right" }}>{value}%</span>
    </div>
  );
}

export function TeamTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "progress" | "iprStatus">("progress");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const filtered = employees
    .filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: typeof sortKey }) => (
    sortKey === col
      ? sortDir === "desc" ? <ChevronDown size={12} style={{ color: brandIcon.accentRed }} /> : <ChevronUp size={12} style={{ color: brandIcon.accentRed }} />
      : <ArrowUpDown size={11} style={{ color: "rgba(0,0,0,0.25)" }} />
  );

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#000000", margin: 0 }}>Сотрудники команды</h3>
            <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", fontSize: "10px", fontWeight: "600", color: "rgba(0,0,0,0.55)" }}>
              {filtered.length} из {employees.length}
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)", margin: 0 }}>
            Полный список со статусами по плану развития и рекомендациями ИИ
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(0,0,0,0.35)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти сотрудника..."
              style={{ paddingLeft: "32px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "10px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)", color: "#000000", fontSize: "12.5px", fontFamily: "var(--font-sans)", outline: "none", width: "180px" }}
            />
          </div>
          <button type="button" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "8px 14px", borderRadius: "10px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.65)", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            <Filter size={13} /> Фильтр
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
          <thead>
            <tr>
              {[
                { label: "ФИО", col: "name", w: "220px" },
                { label: "Должность", col: null, w: "180px" },
                { label: "Общий прогресс", col: "progress", w: "160px" },
                { label: "ИПР статус", col: "iprStatus", w: "130px" },
                { label: "Последний курс", col: null, w: "160px" },
                { label: "Рекомендация ИИ", col: null, w: "auto" },
                { label: "Действие", col: null, w: "170px" },
              ].map(({ label, col, w }, i) => (
                <th
                  key={i}
                  onClick={col ? () => toggleSort(col as typeof sortKey) : undefined}
                  style={{ textAlign: "left", padding: "0 12px 12px", fontSize: "10px", fontWeight: "600", color: "rgba(0,0,0,0.45)", letterSpacing: "0.7px", textTransform: "uppercase", cursor: col ? "pointer" : "default", whiteSpace: "nowrap", width: w }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {label}
                    {col && <SortIcon col={col as typeof sortKey} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, idx) => {
              const ipr = iprStatusConfig[emp.iprStatus];
              const urg = urgencyConfig[emp.recUrgency];
              const isHov = hoveredRow === emp.id;
              return (
                <tr
                  key={emp.id}
                  onMouseEnter={() => setHoveredRow(emp.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ transition: "background .15s ease" }}
                >
                  {[...Array(7)].map((_, ci) => (
                    <td
                      key={ci}
                      style={{ padding: "11px 12px", background: isHov ? "rgba(129,208,245,0.08)" : "transparent", borderTop: "1px solid rgba(0,0,0,0.06)", transition: "background .15s ease", ...(ci === 0 ? { borderRadius: "12px 0 0 12px" } : {}), ...(ci === 6 ? { borderRadius: "0 12px 12px 0" } : {}) }}
                    >
                      {ci === 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: gradients[idx % gradients.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#fff", flexShrink: 0, boxShadow: isHov ? "0 0 12px rgba(129,208,245,0.45)" : "none" }}>
                            {emp.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#000000", whiteSpace: "nowrap" }}>{emp.name.split(" ")[0] + " " + emp.name.split(" ")[1]}</span>
                        </div>
                      )}
                      {ci === 1 && (
                        <div>
                          <div style={{ fontSize: "12.5px", color: "rgba(0,0,0,0.75)", marginBottom: "2px" }}>{emp.role.split(" ").slice(0, 2).join(" ")}</div>
                          <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)", padding: "2px 7px", borderRadius: "20px", background: "rgba(0,0,0,0.04)", display: "inline-block" }}>{emp.dept}</div>
                        </div>
                      )}
                      {ci === 2 && <ProgressBar value={emp.progress} />}
                      {ci === 3 && (
                        <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: "20px", background: ipr.bg, border: `1px solid ${ipr.border}`, fontSize: "11px", fontWeight: "600", color: ipr.color, whiteSpace: "nowrap" }}>
                          {ipr.label}
                        </div>
                      )}
                      {ci === 4 && (
                        <div>
                          <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.75)", marginBottom: "2px" }}>{emp.lastCourse}</div>
                          <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>{emp.lastCourseDate}</div>
                        </div>
                      )}
                      {ci === 5 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "10px", background: urg.bg }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: urg.dot, flexShrink: 0, boxShadow: `0 0 6px ${urg.dot}88` }} />
                          <span style={{ fontSize: "12px", color: urg.text, fontWeight: "500" }}>{emp.aiRec}</span>
                        </div>
                      )}
                      {ci === 6 && (
                        <button
                          type="button"
                          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 13px", borderRadius: "10px", background: isHov ? "linear-gradient(135deg,rgba(227,0,11,0.12),rgba(129,208,245,0.2))" : "rgba(0,0,0,0.04)", border: isHov ? "1px solid rgba(129,208,245,0.45)" : "1px solid rgba(0,0,0,0.08)", color: isHov ? "#000000" : "rgba(0,0,0,0.55)", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .18s ease", whiteSpace: "nowrap", boxShadow: isHov ? "0 2px 12px rgba(0,0,0,0.06)" : "none" }}
                        >
                          <MessageSquare size={12} style={{ color: isHov ? brandIcon.accentRed : "rgba(0,0,0,0.4)" }} />
                          Открыть чат Наставника
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.45)" }}>
          Показано {filtered.length} из {employees.length} сотрудников
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["Критичные", "В риске", "В графике"].map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", fontSize: "10.5px", color: "rgba(0,0,0,0.55)", cursor: "pointer" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === 0 ? brandIcon.accentRed : i === 1 ? "#d97706" : brandIcon.accentCyan }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
