import React, { useEffect, useState } from "react";
import { Check, X, Download, ChevronDown, Search, Filter, ArrowUpDown, ChevronUp, ExternalLink } from "lucide-react";
import {
  DEMO_PORTAL_EMPLOYEE,
  formatHrDeadlineShort,
  readStoredTrainingApplications,
  TRAINING_APPLICATIONS_UPDATED,
} from "../../lib/trainingApplicationsStorage";
import { buildTrainingApplicationsPdfHtml, openPrintableReport } from "../../lib/pdfExport";

type Status = "pending" | "approved" | "rejected" | "in-progress" | "completed";
type CourseType = "внешний" | "внутренний" | "онлайн" | "конференция";

interface Application {
  id: number;
  employee: string;
  dept: string;
  course: string;
  type: CourseType;
  status: Status;
  deadline: string;
  budget: string;
  roi: string;
  roiNum: number;
}

const staticApps: Application[] = [
  { id: 1, employee: "Дмитрий Козлов", dept: "DevOps", course: "Kubernetes Advanced + CKA Cert.", type: "внешний", status: "pending", deadline: "15 апр", budget: "85 000 ₽", roi: "+34%", roiNum: 34 },
  { id: 2, employee: "Мария Соколова", dept: "Frontend", course: "React Architecture Masterclass", type: "онлайн", status: "approved", deadline: "1 апр", budget: "24 000 ₽", roi: "+28%", roiNum: 28 },
  { id: 3, employee: "Анна Волкова", dept: "Analytics", course: "Python для Data Analysts", type: "внутренний", status: "in-progress", deadline: "30 апр", budget: "0 ₽", roi: "+22%", roiNum: 22 },
  { id: 4, employee: "Сергей Морозов", dept: "QA", course: "Playwright & Test Automation", type: "онлайн", status: "pending", deadline: "20 апр", budget: "18 000 ₽", roi: "+19%", roiNum: 19 },
  { id: 5, employee: "Павел Лебедев", dept: "Backend", course: "Go Advanced + Microservices", type: "онлайн", status: "pending", deadline: "10 апр", budget: "32 000 ₽", roi: "+31%", roiNum: 31 },
  { id: 6, employee: "Ольга Попова", dept: "Design", course: "Figma AI Features 2026", type: "внешний", status: "rejected", deadline: "5 апр", budget: "45 000 ₽", roi: "+15%", roiNum: 15 },
  { id: 7, employee: "Елена Новикова", dept: "Product", course: "OKR & Strategy Leadership", type: "конференция", status: "approved", deadline: "22 апр", budget: "120 000 ₽", roi: "+38%", roiNum: 38 },
  { id: 8, employee: "Александр Иванов", dept: "Backend", course: "ML for Engineers", type: "онлайн", status: "in-progress", deadline: "15 мая", budget: "14 000 ₽", roi: "+26%", roiNum: 26 },
  { id: 9, employee: "Виктор Смирнов", dept: "DevOps", course: "AWS Solutions Architect", type: "внешний", status: "pending", deadline: "30 апр", budget: "98 000 ₽", roi: "+42%", roiNum: 42 },
  { id: 10, employee: "Ирина Кузнецова", dept: "HR", course: "HR Analytics & People Data", type: "онлайн", status: "completed", deadline: "28 мар", budget: "22 000 ₽", roi: "+18%", roiNum: 18 },
];

const statusCfg: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  pending:     { label: "Ожидает",   color: "#e3000b", bg: "rgba(227,0,11,.14)",  border: "rgba(227,0,11,.32)"  },
  approved:    { label: "Одобрено",  color: "#000000", bg: "rgba(129,208,245,.14)",   border: "rgba(129,208,245,.3)"   },
  rejected:    { label: "Отклонено", color: "#e3000b", bg: "rgba(227,0,11,.1)",   border: "rgba(227,0,11,.45)"   },
  "in-progress":{ label: "В процессе",color: "#000000", bg: "rgba(129,208,245,.1)",border: "rgba(129,208,245,.22)" },
  completed:   { label: "Завершено", color: "#000000", bg: "rgba(129,208,245,.18)", border: "rgba(129,208,245,.35)" },
};

const typeCfg: Record<CourseType, { color: string; bg: string }> = {
  "внешний":    { color: "#e3000b", bg: "rgba(227,0,11,.12)" },
  "внутренний": { color: "#000000", bg: "rgba(129,208,245,.12)"  },
  "онлайн":     { color: "#000000", bg: "rgba(129,208,245,.08)"},
  "конференция":{ color: "#e3000b", bg: "rgba(227,0,11,.08)" },
};

const gradients = [
  "linear-gradient(135deg,#e3000b,#81d0f5)",
  "linear-gradient(135deg,#81d0f5,#e3000b)",
  "linear-gradient(135deg,#e3000b,#81d0f5)",
  "linear-gradient(135deg,#81d0f5,#e3000b)",
  "linear-gradient(135deg,#e3000b,#81d0f5)",
  "linear-gradient(135deg,#81d0f5,#e3000b)",
  "linear-gradient(135deg,#e3000b,#81d0f5)",
  "linear-gradient(135deg,#81d0f5,#e3000b)",
  "linear-gradient(135deg,#e3000b,#81d0f5)",
  "linear-gradient(135deg,#81d0f5,#e3000b)",
];

const statusFilters: Array<{ val: Status | "all"; label: string }> = [
  { val: "all", label: "Все" },
  { val: "pending", label: "Ожидает" },
  { val: "approved", label: "Одобрено" },
  { val: "in-progress", label: "В процессе" },
  { val: "rejected", label: "Отклонено" },
  { val: "completed", label: "Завершено" },
];

type SortKey = "employee" | "status" | "deadline" | "roiNum";

function buildAppsWithStored(): Application[] {
  const stored = readStoredTrainingApplications().map(
    (s): Application => ({
      id: s.hrRowId,
      employee: DEMO_PORTAL_EMPLOYEE.employee,
      dept: DEMO_PORTAL_EMPLOYEE.dept,
      course: s.title,
      type: s.hrType,
      status: "pending",
      deadline: formatHrDeadlineShort(s.submittedAt),
      budget: "уточняется",
      roi: "+24%",
      roiNum: 24,
    }),
  );
  return [...stored, ...staticApps];
}

export function ApplicationsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("roiNum");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [localStatus, setLocalStatus] = useState<Record<number, Status>>({});
  const [apps, setApps] = useState<Application[]>(() => buildAppsWithStored());

  useEffect(() => {
    const sync = () => setApps(buildAppsWithStored());
    window.addEventListener(TRAINING_APPLICATIONS_UPDATED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(TRAINING_APPLICATIONS_UPDATED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  };

  const approve = (id: number) => setLocalStatus(s => ({ ...s, [id]: "approved" }));
  const reject  = (id: number) => setLocalStatus(s => ({ ...s, [id]: "rejected" }));

  const filtered = apps
    .map(a => ({ ...a, status: localStatus[a.id] ?? a.status }))
    .filter(a =>
      (statusFilter === "all" || a.status === statusFilter) &&
      (a.employee.toLowerCase().includes(search.toLowerCase()) || a.course.toLowerCase().includes(search.toLowerCase()) || a.dept.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortDir === "desc" ? <ChevronDown size={11} style={{ color: "#000000" }} /> : <ChevronUp size={11} style={{ color: "#000000" }} />
      : <ArrowUpDown size={10} style={{ color: "#000000" }} />;

  const pendingCount = apps.filter(a => (localStatus[a.id] ?? a.status) === "pending").length;

  const exportPdf = () => {
    const rows = filtered.map((a) => ({
      employee: a.employee,
      dept: a.dept,
      course: a.course,
      type: a.type,
      status: statusCfg[a.status].label,
      deadline: a.deadline,
      budget: a.budget,
      roi: a.roi,
    }));
    const filterParts = [
      statusFilter === "all" ? "Все статусы" : `Статус: ${statusFilters.find((f) => f.val === statusFilter)?.label ?? statusFilter}`,
      search.trim() ? `Поиск: «${search.trim()}»` : "Поиск не задан",
    ];
    openPrintableReport(
      "Заявки на обучение — HR",
      buildTrainingApplicationsPdfHtml(rows, filterParts.join(" · ")),
    );
  };

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#000000", margin: 0 }}>Все заявки на обучение</h3>
            {pendingCount > 0 && (
              <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(227,0,11,.15)", border: "1px solid rgba(227,0,11,.3)", fontSize: "10px", fontWeight: "700", color: "#e3000b" }}>
                {pendingCount} ожидают
              </div>
            )}
          </div>
          <p style={{ fontSize: "12px", color: "#000000", margin: 0 }}>
            Заявки на обучение · статусы согласования · Одобрение / Отклонение
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={12} style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", color: "#000000", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." style={{ paddingLeft: "28px", paddingRight: "10px", paddingTop: "7px", paddingBottom: "7px", borderRadius: "9px", background: "rgba(129,208,245,.05)", border: "1px solid rgba(129,208,245,.08)", color: "#000000", fontSize: "12px", fontFamily: "var(--font-sans)", outline: "none", width: "160px" }} />
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "9px", background: "rgba(129,208,245,.05)", border: "1px solid rgba(129,208,245,.08)", color: "#000000", fontSize: "11.5px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            <Filter size={12} /> Фильтры <ChevronDown size={11} />
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "9px", background: "rgba(129,208,245,.12)", border: "1px solid rgba(129,208,245,.25)", color: "#000000", fontSize: "11.5px", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: "600" }}>
            <Download size={12} /> Экспорт Excel
          </button>
          <button
            type="button"
            onClick={exportPdf}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "9px", background: "rgba(129,208,245,.12)", border: "1px solid rgba(129,208,245,.25)", color: "#000000", fontSize: "11.5px", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: "600" }}
          >
            <ExternalLink size={12} /> PDF
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px", overflowX: "auto", paddingBottom: "2px" }}>
        {statusFilters.map(f => {
          const isActive = statusFilter === f.val;
          const cfg = f.val !== "all" ? statusCfg[f.val as Status] : null;
          return (
            <button key={f.val} onClick={() => setStatusFilter(f.val as Status | "all")}
              style={{ padding: "5px 13px", borderRadius: "20px", background: isActive ? (cfg ? cfg.bg : "rgba(129,208,245,.1)") : "transparent", border: `1px solid ${isActive ? (cfg ? cfg.border : "rgba(129,208,245,.18)") : "rgba(129,208,245,.06)"}`, color: isActive ? (cfg ? cfg.color : "#000000") : "#000000", fontSize: "11.5px", fontWeight: isActive ? "700" : "500", cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", transition: "all .15s" }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              {[
                { label: "Сотрудник", key: "employee" as SortKey, w: "180px" },
                { label: "Курс / Программа", key: null, w: "auto" },
                { label: "Тип", key: null, w: "100px" },
                { label: "Статус", key: "status" as SortKey, w: "120px" },
                { label: "Дедлайн", key: "deadline" as SortKey, w: "90px" },
                { label: "Бюджет", key: null, w: "100px" },
                { label: "ROI", key: "roiNum" as SortKey, w: "80px" },
                { label: "Действия", key: null, w: "200px" },
              ].map(({ label, key, w }, i) => (
                <th key={i} onClick={key ? () => toggleSort(key) : undefined}
                  style={{ textAlign: "left", padding: "0 12px 10px", fontSize: "10px", fontWeight: "600", color: "#000000", letterSpacing: ".7px", textTransform: "uppercase", cursor: key ? "pointer" : "default", whiteSpace: "nowrap", width: w }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {label}{key && <SortIcon col={key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((app, idx) => {
              const stCfg = statusCfg[app.status];
              const tyC = typeCfg[app.type];
              const isHov = hoveredRow === app.id;
              const isPending = app.status === "pending";
              return (
                <tr key={app.id} onMouseEnter={() => setHoveredRow(app.id)} onMouseLeave={() => setHoveredRow(null)}>
                  {[...Array(8)].map((_, ci) => (
                    <td key={ci} style={{ padding: "10px 12px", background: isHov ? "rgba(129,208,245,.035)" : "transparent", borderTop: "1px solid rgba(129,208,245,.04)", transition: "background .15s", ...(ci === 0 ? { borderRadius: "12px 0 0 12px" } : {}), ...(ci === 7 ? { borderRadius: "0 12px 12px 0" } : {}) }}>
                      {ci === 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: gradients[idx % gradients.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#000000", flexShrink: 0, boxShadow: isHov ? "0 0 10px rgba(227,0,11,.3)" : "none" }}>
                            {app.employee.split(" ").map(w => w[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <div style={{ fontSize: "12.5px", fontWeight: "600", color: isHov ? "#000000" : "#000000", whiteSpace: "nowrap" }}>{app.employee}</div>
                            <div style={{ fontSize: "10px", color: "#000000" }}>{app.dept}</div>
                          </div>
                        </div>
                      )}
                      {ci === 1 && (
                        <div style={{ fontSize: "12px", color: "#000000", lineHeight: 1.35 }}>{app.course}</div>
                      )}
                      {ci === 2 && (
                        <div style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: "20px", background: tyC.bg, fontSize: "10.5px", fontWeight: "600", color: tyC.color, whiteSpace: "nowrap" }}>{app.type}</div>
                      )}
                      {ci === 3 && (
                        <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 9px", borderRadius: "20px", background: stCfg.bg, border: `1px solid ${stCfg.border}`, fontSize: "10.5px", fontWeight: "700", color: stCfg.color, whiteSpace: "nowrap" }}>{stCfg.label}</div>
                      )}
                      {ci === 4 && (
                        <span style={{ fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{app.deadline}</span>
                      )}
                      {ci === 5 && (
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#000000" }}>{app.budget}</span>
                      )}
                      {ci === 6 && (
                        <div style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: "20px", background: app.roiNum >= 30 ? "rgba(129,208,245,.14)" : app.roiNum >= 20 ? "rgba(129,208,245,.14)" : "rgba(227,0,11,.14)", fontSize: "11px", fontWeight: "800", color: app.roiNum >= 30 ? "#000000" : app.roiNum >= 20 ? "#000000" : "#e3000b" }}>{app.roi}</div>
                      )}
                      {ci === 7 && (
                        <div style={{ display: "flex", gap: "5px" }}>
                          {isPending ? (
                            <>
                              <button onClick={() => approve(app.id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 11px", borderRadius: "8px", background: "rgba(129,208,245,.16)", border: "1px solid rgba(129,208,245,.3)", color: "#000000", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .15s", whiteSpace: "nowrap" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(129,208,245,.28)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(129,208,245,.16)"; }}>
                                <Check size={11} /> Одобрить
                              </button>
                              <button onClick={() => reject(app.id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 11px", borderRadius: "8px", background: "rgba(227,0,11,.12)", border: "1px solid rgba(227,0,11,.28)", color: "#e3000b", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .15s", whiteSpace: "nowrap" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(227,0,11,.22)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(227,0,11,.12)"; }}>
                                <X size={11} /> Отклонить
                              </button>
                            </>
                          ) : (
                            <button style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "8px", background: isHov ? "rgba(129,208,245,.07)" : "rgba(129,208,245,.04)", border: "1px solid rgba(129,208,245,.07)", color: "#000000", fontSize: "11px", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .15s", whiteSpace: "nowrap" }}>
                              <Download size={11} /> Экспорт
                            </button>
                          )}
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

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(129,208,245,.05)" }}>
        <div style={{ fontSize: "11.5px", color: "#000000" }}>
          Показано {filtered.length} из {apps.length} заявок · Общий бюджет: 458 000 ₽
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {["Ожидает", "Одобрено", "В процессе", "Отклонено"].map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,.04)", border: "1px solid rgba(129,208,245,.06)", fontSize: "10px", color: "#000000" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: [statusCfg.pending.color, statusCfg.approved.color, statusCfg["in-progress"].color, statusCfg.rejected.color][i] }} />
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
