import React, { useMemo, useState } from "react";
import { Search, Download, RefreshCw, ChevronDown, ArrowUpDown, ChevronUp } from "lucide-react";
import { downloadTextFile, showAdminToast } from "../../lib/adminToast";

type LogStatus = "success" | "warning" | "error" | "info";
type Module = "Авторизация" | "LMS" | "AI Engine" | "Интеграции" | "База данных" | "Безопасность" | "Уведомления";

interface LogEntry {
  id: number;
  time: string;
  user: string;
  role: string;
  action: string;
  module: Module;
  status: LogStatus;
  ip: string;
}

const logs: LogEntry[] = [
  { id: 1,  time: "10:42:18", user: "Дмитрий Соколов",   role: "Админ",   action: "Обновлён список ролей — добавлена роль «Куратор»",      module: "Безопасность",  status: "success", ip: "192.168.1.10"  },
  { id: 2,  time: "10:38:54", user: "Система (Auto)",     role: "Bot",     action: "Автоматически одобрено 9 заявок на обучение (ИИ)",        module: "AI Engine",    status: "success", ip: "internal"     },
  { id: 3,  time: "10:34:21", user: "Анна Смирнова",      role: "L&D (обучение и развитие)", action: "Экспорт отчёта HR-аналитики — 312 сотрудников",          module: "LMS",          status: "success", ip: "10.0.0.45"    },
  { id: 4,  time: "10:29:07", user: "Неизвестный",        role: "—",       action: "Ошибка входа ×14 — заблокирован IP 185.220.101.50",       module: "Безопасность",  status: "error",   ip: "185.220.101.50"},
  { id: 5,  time: "10:25:44", user: "Система (Cron)",     role: "Bot",     action: "Синхронизация с Outlook Calendar — 312 событий",          module: "Интеграции",   status: "success", ip: "internal"     },
  { id: 6,  time: "10:21:33", user: "Иван Петров",        role: "Рук.",    action: "Просмотр планов развития команды — 18 сотрудников",      module: "LMS",          status: "info",    ip: "10.0.1.88"    },
  { id: 7,  time: "10:18:02", user: "Push Service",       role: "Bot",     action: "Задержка доставки уведомлений > 300мс — триггер алерта",  module: "Уведомления",   status: "warning", ip: "internal"     },
  { id: 8,  time: "10:14:57", user: "Дмитрий Соколов",   role: "Админ",   action: "Резервное копирование БД — 2.4 GB, завершено успешно",    module: "База данных",  status: "success", ip: "192.168.1.10"  },
  { id: 9,  time: "10:11:28", user: "API Яндекс Алисы",   role: "Bot",     action: "Обновление векторной базы знаний — +148 документов",      module: "AI Engine",    status: "success", ip: "internal"     },
  { id: 10, time: "10:08:14", user: "Мария Соколова",     role: "Сотр.",   action: "Завершение курса «React Architecture» — тест 94/100",     module: "LMS",          status: "success", ip: "10.0.2.112"   },
  { id: 11, time: "10:04:49", user: "Система (Auto)",     role: "Bot",     action: "Предиктивный анализ нагрузки — прогноз +180% пятница",    module: "AI Engine",    status: "info",    ip: "internal"     },
  { id: 12, time: "09:58:33", user: "Дмитрий Соколов",   role: "Админ",   action: "Добавлен пользователь: Козлов Д.А. — роль «Сотрудник»",   module: "Авторизация",  status: "success", ip: "192.168.1.10"  },
];

const statusCfg: Record<LogStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  success: { label: "Успех",       color: "#00C4A0", bg: "rgba(0,196,160,.13)",   border: "rgba(0,196,160,.28)",   dot: "#00C4A0" },
  warning: { label: "Предупрежд.", color: "#FFB547", bg: "rgba(255,181,71,.13)",  border: "rgba(255,181,71,.28)",  dot: "#FFB547" },
  error:   { label: "Ошибка",      color: "#FF4757", bg: "rgba(255,71,87,.13)",   border: "rgba(255,71,87,.28)",   dot: "#FF4757" },
  info:    { label: "Инфо",        color: "#6699FF", bg: "rgba(102,153,255,.13)", border: "rgba(102,153,255,.28)", dot: "#6699FF" },
};

const moduleCfg: Record<Module, string> = {
  "Авторизация": "#e3000b",
  "LMS":         "#81d0f5",
  "AI Engine":   "#0d9488",
  "Интеграции":  "#000000",
  "База данных": "#81d0f5",
  "Безопасность": "#e3000b",
  "Уведомления": "#e3000b",
};

const roleGradients = [
  "linear-gradient(135deg,#e3000b,#81d0f5)",
  "linear-gradient(135deg,#81d0f5,#e3000b)",
  "linear-gradient(135deg,#e3000b,rgba(227,0,11,0.7))",
  "linear-gradient(135deg,#81d0f5,rgba(129,208,245,0.85))",
  "linear-gradient(135deg,#000000,#81d0f5)",
];

type SortKey = "time" | "user" | "module" | "status";

const statusFilters: Array<{ val: LogStatus | "all"; label: string }> = [
  { val: "all",     label: "Все события" },
  { val: "success", label: "Успех" },
  { val: "warning", label: "Предупреждения" },
  { val: "error",   label: "Ошибки" },
  { val: "info",    label: "Информация" },
];

export function SystemActionsLog() {
  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState<LogStatus | "all">("all");
  const [sortKey, setSortKey]     = useState<SortKey>("time");
  const [sortDir, setSortDir]     = useState<"asc"|"desc">("desc");
  const [hovRow, setHovRow]       = useState<number|null>(null);
  const [refreshed, setRefreshed] = useState(false);

  const todayLabel = useMemo(
    () => new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" }),
    [],
  );

  const refresh = () => { setRefreshed(true); setTimeout(() => setRefreshed(false), 1200); };

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  };

  const filtered = logs
    .filter(l =>
      (statusF === "all" || l.status === statusF) &&
      (l.user.toLowerCase().includes(search.toLowerCase()) ||
       l.action.toLowerCase().includes(search.toLowerCase()) ||
       l.module.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortDir === "desc" ? <ChevronDown size={11} style={{ color: "#e3000b" }} /> : <ChevronUp size={11} style={{ color: "#e3000b" }} />
      : <ArrowUpDown size={10} style={{ color: "rgba(0,0,0,0.25)" }} />;

  const errorCount   = logs.filter(l => l.status === "error").length;
  const warningCount = logs.filter(l => l.status === "warning").length;

  const exportCsv = () => {
    const header = ["Время", "Пользователь", "Роль", "Действие", "Модуль", "Статус", "IP"].join(";");
    const rows = filtered.map((l) =>
      [l.time, l.user, l.role, `"${l.action.replace(/"/g, '""')}"`, l.module, statusCfg[l.status].label, l.ip].join(";"),
    );
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(`eso-audit-log-${stamp}.csv`, [header, ...rows].join("\r\n"), "text/csv;charset=utf-8");
    showAdminToast(`Экспорт: ${filtered.length} записей.`);
  };

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "500", color: "#000000", margin: 0 }}>Последние действия в системе</h3>
            {errorCount > 0 && (
              <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(255,71,87,.15)", border: "1px solid rgba(255,71,87,.3)", fontSize: "10px", fontWeight: "500", color: "#FF4757" }}>
                {errorCount} ошибок
              </div>
            )}
            {warningCount > 0 && (
              <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(255,181,71,.13)", border: "1px solid rgba(255,181,71,.28)", fontSize: "10px", fontWeight: "500", color: "#FFB547" }}>
                {warningCount} предупрежд.
              </div>
            )}
          </div>
          <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", margin: 0 }}>Аудит · Мониторинг в реальном времени · Сегодня {todayLabel}</p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={12} style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", color: "rgba(0,0,0,0.4)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по логам..." style={{ paddingLeft: "28px", paddingRight: "10px", paddingTop: "7px", paddingBottom: "7px", borderRadius: "9px", background: "rgba(129,208,245,0.06)", border: "1px solid rgba(0,0,0,0.1)", color: "#000000", fontSize: "12px", fontFamily: "var(--font-sans)", outline: "none", width: "160px" }} />
          </div>
          <button type="button" onClick={refresh} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "9px", background: refreshed ? "rgba(129,208,245,0.2)" : "rgba(129,208,245,0.06)", border: `1px solid ${refreshed ? "rgba(129,208,245,0.45)" : "rgba(0,0,0,0.1)"}`, color: refreshed ? "#000000" : "rgba(0,0,0,0.55)", fontSize: "11.5px", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .2s" }}>
            <RefreshCw size={12} style={{ animation: refreshed ? "spin-conic .6s linear" : "none" }} />
            {refreshed ? "Обновлено!" : "Обновить"}
          </button>
          <button
            type="button"
            onClick={exportCsv}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "9px", background: "rgba(227,0,11,0.08)", border: "1px solid rgba(227,0,11,0.25)", color: "#e3000b", fontSize: "11.5px", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: "500" }}
          >
            <Download size={12} /> Экспорт
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px", overflowX: "auto" }}>
        {statusFilters.map(f => {
          const isA = statusF === f.val;
          const cfg = f.val !== "all" ? statusCfg[f.val as LogStatus] : null;
          return (
            <button type="button" key={f.val} onClick={() => setStatusF(f.val as LogStatus | "all")}
              style={{ padding: "5px 13px", borderRadius: "20px", background: isA ? (cfg ? cfg.bg : "rgba(129,208,245,0.14)") : "transparent", border: `1px solid ${isA ? (cfg ? cfg.border : "rgba(129,208,245,0.35)") : "rgba(0,0,0,0.08)"}`, color: isA ? (cfg ? cfg.color : "#000000") : "rgba(0,0,0,0.45)", fontSize: "11.5px", fontWeight: isA ? "700" : "500", cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", transition: "all .15s" }}>
              {f.label}
              {f.val !== "all" && (
                <span style={{ marginLeft: "5px", fontSize: "10px", opacity: .7 }}>
                  {logs.filter(l => l.status === f.val).length}
                </span>
              )}
            </button>
          );
        })}

        {/* Live pulse */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px", background: "rgba(0,196,160,.08)", border: "1px solid rgba(0,196,160,.18)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C4A0", boxShadow: "0 0 6px rgba(0,196,160,.9)", animation: "dot-pulse 1.4s ease-in-out infinite" }} />
          <span style={{ fontSize: "11px", color: "#00C4A0", fontWeight: "500" }}>Live</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              {[
                { label: "Время",      key: "time" as SortKey,   w: "80px"  },
                { label: "Пользователь", key: "user" as SortKey, w: "170px" },
                { label: "Действие",   key: null,                 w: "auto"  },
                { label: "Модуль",     key: "module" as SortKey, w: "115px" },
                { label: "IP",         key: null,                 w: "130px" },
                { label: "Статус",     key: "status" as SortKey, w: "130px" },
              ].map(({ label, key, w }, i) => (
                <th key={i} onClick={key ? () => toggleSort(key) : undefined}
                  style={{ textAlign: "left", padding: "0 12px 10px", fontSize: "10px", fontWeight: "500", color: "rgba(0,0,0,0.45)", letterSpacing: ".7px", textTransform: "uppercase", cursor: key ? "pointer" : "default", width: w, whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {label}{key && <SortIcon col={key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, idx) => {
              const sc = statusCfg[log.status];
              const mc = moduleCfg[log.module];
              const isH = hovRow === log.id;
              const isErr = log.status === "error";
              return (
                <tr key={log.id} onMouseEnter={() => setHovRow(log.id)} onMouseLeave={() => setHovRow(null)}>
                  {/* Time */}
                  <td style={{ padding: "10px 12px", background: isH ? "rgba(129,208,245,0.08)" : isErr ? "rgba(227,0,11,0.06)" : "transparent", borderTop: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px 0 0 12px", transition: "background .15s" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "500", color: isErr ? "#e3000b" : "#000000", fontVariantNumeric: "tabular-nums", fontFamily: "monospace" }}>{log.time}</span>
                      <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.4)" }}>сегодня</span>
                    </div>
                  </td>
                  {/* User */}
                  <td style={{ padding: "10px 12px", background: isH ? "rgba(129,208,245,0.08)" : isErr ? "rgba(227,0,11,0.06)" : "transparent", borderTop: "1px solid rgba(0,0,0,0.06)", transition: "background .15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: log.role === "Bot" ? "linear-gradient(135deg,#e3000b,#81d0f5)" : roleGradients[idx % roleGradients.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "600", color: "#000000", flexShrink: 0 }}>
                        {log.role === "Bot" ? "🤖" : log.user.split(" ").map(w => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "500", color: isH ? "#000000" : "rgba(0,0,0,0.85)", whiteSpace: "nowrap" }}>{log.user.length > 17 ? log.user.split(" ")[0] + " " + log.user.split(" ")[1]?.[0] + "." : log.user}</div>
                        <div style={{ fontSize: "9.5px", color: "rgba(0,0,0,0.45)" }}>{log.role}</div>
                      </div>
                    </div>
                  </td>
                  {/* Action */}
                  <td style={{ padding: "10px 12px", background: isH ? "rgba(129,208,245,0.08)" : isErr ? "rgba(227,0,11,0.06)" : "transparent", borderTop: "1px solid rgba(0,0,0,0.06)", transition: "background .15s" }}>
                    <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.75)", lineHeight: 1.4 }}>{log.action}</div>
                  </td>
                  {/* Module */}
                  <td style={{ padding: "10px 12px", background: isH ? "rgba(129,208,245,0.08)" : isErr ? "rgba(227,0,11,0.06)" : "transparent", borderTop: "1px solid rgba(0,0,0,0.06)", transition: "background .15s" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", background: `${mc}18`, border: `1px solid ${mc}30` }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: mc, boxShadow: `0 0 4px ${mc}80` }} />
                      <span style={{ fontSize: "10.5px", fontWeight: "500", color: mc, whiteSpace: "nowrap" }}>{log.module}</span>
                    </div>
                  </td>
                  {/* IP */}
                  <td style={{ padding: "10px 12px", background: isH ? "rgba(129,208,245,0.08)" : isErr ? "rgba(227,0,11,0.06)" : "transparent", borderTop: "1px solid rgba(0,0,0,0.06)", transition: "background .15s" }}>
                    <span style={{ fontSize: "11px", color: log.ip === "internal" ? "rgba(0,0,0,0.4)" : isErr ? "#e3000b" : "rgba(0,0,0,0.65)", fontFamily: "monospace", background: "rgba(129,208,245,0.06)", padding: "3px 7px", borderRadius: "6px", border: `1px solid ${isErr ? "rgba(227,0,11,0.25)" : "rgba(0,0,0,0.08)"}` }}>{log.ip}</span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: "10px 12px", background: isH ? "rgba(129,208,245,0.08)" : isErr ? "rgba(227,0,11,0.06)" : "transparent", borderTop: "1px solid rgba(0,0,0,0.06)", borderRadius: "0 12px 12px 0", transition: "background .15s" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", background: sc.bg, border: `1px solid ${sc.border}` }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.dot, boxShadow: `0 0 5px ${sc.dot}99` }} />
                      <span style={{ fontSize: "10.5px", fontWeight: "500", color: sc.color, whiteSpace: "nowrap" }}>{sc.label}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.5)" }}>
          Показано {filtered.length} из {logs.length} событий · Хранение логов: 90 дней
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {Object.entries(statusCfg).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,0.06)", border: "1px solid rgba(0,0,0,0.08)", fontSize: "10px", color: "rgba(0,0,0,0.5)" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dot }} />
              {v.label}: {logs.filter(l => l.status === k).length}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
