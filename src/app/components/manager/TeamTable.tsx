import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search, Filter, ArrowUpDown } from "lucide-react";
import { brandIcon } from "../../lib/brandIcons";
import { MANAGER_TEAM_MEMBERS, type ManagerTeamUrgency } from "../../data/managerTeamCatalog";

const urgencyConfig: Record<
  ManagerTeamUrgency,
  { dot: string; bg: string; text: string; label: string }
> = {
  normal: { dot: brandIcon.accentCyan, bg: "rgba(129,208,245,0.12)", text: "rgba(0,0,0,0.7)", label: "Норма" },
  warning: { dot: "#d97706", bg: "rgba(245,158,11,0.1)", text: "#b45309", label: "Внимание" },
  critical: { dot: brandIcon.accentRed, bg: "rgba(227,0,11,0.08)", text: "#b91c1c", label: "Срочно" },
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
      <span style={{ fontSize: "12px", fontWeight: "500", color, minWidth: "30px", textAlign: "right" }}>{value}%</span>
    </div>
  );
}

export function TeamTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "progress">("progress");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | ManagerTeamUrgency>("all");

  const departments = useMemo(() => {
    const s = new Set(MANAGER_TEAM_MEMBERS.map((e) => e.dept));
    return Array.from(s).sort((a, b) => a.localeCompare(b, "ru"));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MANAGER_TEAM_MEMBERS.filter((e) => {
      const matchSearch =
        !q ||
        e.fullName.toLowerCase().includes(q) ||
        e.dept.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q);
      const matchDept = deptFilter === "all" || e.dept === deptFilter;
      const matchUrg = urgencyFilter === "all" || e.recUrgency === urgencyFilter;
      return matchSearch && matchDept && matchUrg;
    }).sort((a, b) => {
      const av: string | number = sortKey === "name" ? a.fullName : a.progress;
      const bv: string | number = sortKey === "name" ? b.fullName : b.progress;
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv), "ru") : String(bv).localeCompare(String(av), "ru");
    });
  }, [search, sortKey, sortDir, deptFilter, urgencyFilter]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: typeof sortKey }) =>
    sortKey === col ? (
      sortDir === "desc" ? (
        <ChevronDown size={12} style={{ color: brandIcon.accentRed }} />
      ) : (
        <ChevronUp size={12} style={{ color: brandIcon.accentRed }} />
      )
    ) : (
      <ArrowUpDown size={11} style={{ color: "rgba(0,0,0,0.25)" }} />
    );

  const filterActive = deptFilter !== "all" || urgencyFilter !== "all";

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "500", color: "#000000", margin: 0 }}>Сотрудники команды</h3>
            <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", fontSize: "10px", fontWeight: "500", color: "rgba(0,0,0,0.55)" }}>
              {filtered.length} из {MANAGER_TEAM_MEMBERS.length}
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)", margin: 0 }}>Прогресс обучения и рекомендации ИИ по сотрудникам</p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(0,0,0,0.35)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Найти сотрудника..."
              style={{ paddingLeft: "32px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "10px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)", color: "#000000", fontSize: "12.5px", fontFamily: "var(--font-sans)", outline: "none", width: "180px" }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: filterActive ? "rgba(129,208,245,0.14)" : "rgba(0,0,0,0.03)",
                border: filterActive ? "1px solid rgba(129,208,245,0.45)" : "1px solid rgba(0,0,0,0.1)",
                color: filterActive ? "#000000" : "rgba(0,0,0,0.65)",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <Filter size={13} /> Фильтр
              {filterActive && (
                <span style={{ marginLeft: "2px", fontSize: "10px", fontWeight: 700, color: brandIcon.accentRed }}>·</span>
              )}
            </button>
            {filterOpen && (
              <div
                className="glass-card"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  zIndex: 20,
                  minWidth: "260px",
                  padding: "14px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                  border: "1px solid rgba(129,208,245,0.35)",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(0,0,0,0.55)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Отдел</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setDeptFilter("all")}
                    style={chipStyle(deptFilter === "all")}
                  >
                    Все
                  </button>
                  {departments.map((d) => (
                    <button key={d} type="button" onClick={() => setDeptFilter(d)} style={chipStyle(deptFilter === d)}>
                      {d}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(0,0,0,0.55)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Приоритет ИИ</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                  {(
                    [
                      ["all", "Все"],
                      ["normal", urgencyConfig.normal.label],
                      ["warning", urgencyConfig.warning.label],
                      ["critical", urgencyConfig.critical.label],
                    ] as const
                  ).map(([val, lab]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setUrgencyFilter(val)}
                      style={chipStyle(urgencyFilter === val)}
                    >
                      {lab}
                    </button>
                  ))}
                </div>
                {filterActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeptFilter("all");
                      setUrgencyFilter("all");
                    }}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "transparent",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "#000000",
                    }}
                  >
                    Сбросить
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
          <thead>
            <tr>
              {[
                { label: "ФИО", col: "name" as const, w: "220px" },
                { label: "Должность", col: null, w: "180px" },
                { label: "Общий прогресс", col: "progress" as const, w: "160px" },
                { label: "Последний курс", col: null, w: "160px" },
                { label: "Рекомендация ИИ", col: null, w: "auto" },
              ].map(({ label, col, w }, i) => (
                <th
                  key={i}
                  onClick={col ? () => toggleSort(col) : undefined}
                  style={{
                    textAlign: "left",
                    padding: "0 12px 12px",
                    fontSize: "10px",
                    fontWeight: "500",
                    color: "rgba(0,0,0,0.45)",
                    letterSpacing: "0.7px",
                    textTransform: "uppercase",
                    cursor: col ? "pointer" : "default",
                    whiteSpace: "nowrap",
                    width: w,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {label}
                    {col && <SortIcon col={col} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, idx) => {
              const urg = urgencyConfig[emp.recUrgency];
              const isHov = hoveredRow === emp.id;
              return (
                <tr
                  key={emp.id}
                  onMouseEnter={() => setHoveredRow(emp.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ transition: "background .15s ease" }}
                >
                  {[...Array(5)].map((_, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: "11px 12px",
                        background: isHov ? "rgba(129,208,245,0.08)" : "transparent",
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        transition: "background .15s ease",
                        ...(ci === 0 ? { borderRadius: "12px 0 0 12px" } : {}),
                        ...(ci === 4 ? { borderRadius: "0 12px 12px 0" } : {}),
                      }}
                    >
                      {ci === 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: gradients[idx % gradients.length],
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: "500",
                              color: "#fff",
                              flexShrink: 0,
                              boxShadow: isHov ? "0 0 12px rgba(129,208,245,0.45)" : "none",
                            }}
                          >
                            {emp.fullName
                              .split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "500", color: "#000000", whiteSpace: "nowrap" }}>
                            {emp.fullName}
                          </span>
                        </div>
                      )}
                      {ci === 1 && (
                        <div>
                          <div style={{ fontSize: "12.5px", color: "rgba(0,0,0,0.75)", marginBottom: "2px", lineHeight: 1.3 }}>{emp.role}</div>
                          <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)", padding: "2px 7px", borderRadius: "20px", background: "rgba(0,0,0,0.04)", display: "inline-block" }}>{emp.dept}</div>
                        </div>
                      )}
                      {ci === 2 && <ProgressBar value={emp.progress} />}
                      {ci === 3 && (
                        <div>
                          <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.75)", marginBottom: "2px" }}>{emp.lastCourse}</div>
                          <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>{emp.lastCourseDate}</div>
                        </div>
                      )}
                      {ci === 4 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "10px", background: urg.bg }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: urg.dot, flexShrink: 0, boxShadow: `0 0 6px ${urg.dot}88` }} />
                          <span style={{ fontSize: "12px", color: urg.text, fontWeight: "500" }}>{emp.aiRec}</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.45)" }}>
          Показано {filtered.length} из {MANAGER_TEAM_MEMBERS.length} сотрудников
        </div>
      </div>
    </div>
  );
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: "5px 10px",
    borderRadius: "999px",
    border: active ? "1px solid rgba(227,0,11,0.35)" : "1px solid rgba(0,0,0,0.1)",
    background: active ? "rgba(227,0,11,0.08)" : "rgba(0,0,0,0.03)",
    fontSize: "11px",
    fontWeight: active ? 600 : 500,
    color: "#000000",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  };
}
