import React, { useState } from "react";
import type { TooltipProps } from "recharts";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Filter, Wifi, CheckCircle, AlertCircle } from "lucide-react";
import { downloadTextFile, showAdminToast } from "../../lib/adminToast";

const weeklyData = [
  { day: "Пн", active: 218, sessions: 340, errors: 2, load: 14, новые: 3 },
  { day: "Вт", active: 241, sessions: 378, errors: 1, load: 18, новые: 5 },
  { day: "Ср", active: 265, sessions: 401, errors: 3, load: 22, новые: 4 },
  { day: "Чт", active: 289, sessions: 432, errors: 0, load: 20, новые: 7 },
  { day: "Пт", active: 312, sessions: 487, errors: 1, load: 25, новые: 9 },
  { day: "Сб", active: 148, sessions: 201, errors: 0, load: 8,  новые: 1 },
  { day: "Вс", active: 97,  sessions: 134, errors: 0, load: 5,  новые: 0 },
];

const modules = [
  { name: "Авторизация (SSO)",      status: "online", uptime: "99.98%", latency: "12ms",  users: 312 },
  { name: "LMS Core",                status: "online", uptime: "99.95%", latency: "28ms",  users: 248 },
  { name: "Яндекс Алиса API",        status: "online", uptime: "100%",   latency: "210ms", users: 186 },
  { name: "Интеграция с Outlook",     status: "online", uptime: "99.82%", latency: "45ms",  users: 312 },
  { name: "Аналитика и отчёты",   status: "online", uptime: "99.90%", latency: "67ms",  users: 34  },
  { name: "Уведомления (Push/Email)",status: "warn",   uptime: "98.10%", latency: "320ms", users: 298 },
];

const statusIcon = (s: string) =>
  s === "online" ? (
    <CheckCircle size={12} style={{ color: "#81d0f5" }} />
  ) : s === "warn" ? (
    <AlertCircle size={12} style={{ color: "#e3000b" }} />
  ) : (
    <AlertCircle size={12} style={{ color: "#c40009" }} />
  );

const statusColor = (s: string) => (s === "online" ? "#81d0f5" : s === "warn" ? "#e3000b" : "#c40009");

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        minWidth: "170px",
      }}
    >
      <div style={{ fontSize: "12px", fontWeight: "500", color: "#000000", marginBottom: "8px" }}>{label}</div>
      {payload.map((p, i: number) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "14px", marginBottom: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "2px", background: p.color }} />
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)" }}>{p.name}</span>
          </div>
          <span style={{ fontSize: "12px", fontWeight: "500", color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

type Range = "7д" | "14д" | "30д";

export function SystemOverviewChart() {
  const [range, setRange] = useState<Range>("7д");

  const onFilter = () => {
    showAdminToast(`Фильтр: интервал «${range}». Демо-график строится по недельным точкам; сравнение периодов — в мониторинге.`);
  };

  const onDownload = () => {
    const header = ["День", "Активных", "Сессий", "Ошибок", "Нагрузка_CPU_%", "Новых"];
    const lines = [header.join(";"), ...weeklyData.map((r) => [r.day, r.active, r.sessions, r.errors, r.load, r.новые].join(";"))];
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(`eso-system-overview-${stamp}.csv`, lines.join("\r\n"), "text/csv;charset=utf-8");
    showAdminToast("CSV выгружен в папку загрузок.");
  };

  return (
    <div className="glass-card" style={{ padding: "24px", minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "500", color: "#000000", margin: 0 }}>Обзор системы</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,0.12)", border: "1px solid rgba(129,208,245,0.35)" }}>
              <Wifi size={10} style={{ color: "#000000" }} />
              <span style={{ fontSize: "10px", fontWeight: "500", color: "#000000" }}>Live</span>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", margin: 0 }}>Активность пользователей · Сессии · Нагрузка · Модули</p>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {(["7д", "14д", "30д"] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              style={{
                padding: "5px 11px",
                borderRadius: "8px",
                background: range === r ? "rgba(227,0,11,0.12)" : "rgba(129,208,245,0.06)",
                border: `1px solid ${range === r ? "rgba(227,0,11,0.35)" : "rgba(129,208,245,0.2)"}`,
                color: range === r ? "#000000" : "rgba(0,0,0,0.5)",
                fontSize: "11.5px",
                fontWeight: "500",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                transition: "all .15s",
              }}
            >
              {r}
            </button>
          ))}
          <button
            type="button"
            title="Подсказка по фильтру"
            onClick={onFilter}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(129,208,245,0.06)",
              border: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#000000",
            }}
          >
            <Filter size={13} />
          </button>
          <button
            type="button"
            title="Скачать CSV"
            onClick={onDownload}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(129,208,245,0.06)",
              border: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#000000",
            }}
          >
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* Main chart */}
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={weeklyData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="barActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e3000b" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#e3000b" stopOpacity={0.35} />
            </linearGradient>
            <linearGradient id="barSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#81d0f5" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#81d0f5" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "rgba(0,0,0,0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(0,0,0,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="active" name="Активных" fill="url(#barActive)" radius={[4, 4, 0, 0]} maxBarSize={26} />
          <Bar dataKey="sessions" name="Сессий" fill="url(#barSessions)" radius={[4, 4, 0, 0]} maxBarSize={26} />
          <Line
            type="monotone"
            dataKey="load"
            name="Нагрузка CPU%"
            stroke="#000000"
            strokeWidth={2.5}
            dot={{ fill: "#000000", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", padding: "10px 4px 0" }}>
        {[["#e3000b", "Активных польз."], ["#81d0f5", "Сессий"], ["#000000", "Нагрузка CPU%"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: c, boxShadow: `0 0 5px ${c}80` }} />
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)" }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Module status grid */}
      <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "11.5px", fontWeight: "500", color: "rgba(0,0,0,0.55)", marginBottom: "12px", letterSpacing: ".3px" }}>СТАТУС МОДУЛЕЙ</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
          {modules.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                borderRadius: "12px",
                background: "rgba(129,208,245,0.06)",
                border: `1px solid ${statusColor(m.status)}44`,
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {statusIcon(m.status)}
                <span style={{ fontSize: "11px", fontWeight: "500", color: "#000000", lineHeight: 1.2 }}>{m.name}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.55)" }}>↑ {m.uptime}</span>
                <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>⚡ {m.latency}</span>
                <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>👤 {m.users}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
