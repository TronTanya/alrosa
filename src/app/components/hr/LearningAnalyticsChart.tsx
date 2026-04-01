import React, { useMemo, useState } from "react";
import type { TooltipProps } from "recharts";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell, Sector
} from "recharts";
import { Download, Filter, BarChart2, PieChart as PieIcon } from "lucide-react";
import { buildLearningMonthlyChartData, getHrDashboardMetrics } from "../../lib/hrDashboardMetrics";
import { useHrDataRevision } from "../../hooks/useHrDataRevision";
import { downloadCsv } from "../../lib/hrTableExport";

const distributionData = [
  { name: "Техн. экспертиза", value: 34 },
  { name: "Цифровая эфф.", value: 22 },
  { name: "Управленческая", value: 18 },
  { name: "Гибкие навыки", value: 14 },
  { name: "Безопасность", value: 8 },
  { name: "Иное", value: 4 },
];

const BRAND_PIE = ["#e3000b", "#81d0f5", "#000000"] as const;
function pieSliceColor(i: number) {
  return BRAND_PIE[i % 3];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(255,255,255,0.98)", border: "1px solid rgba(129,208,245,0.4)", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(227,0,11,0.06)", backdropFilter: "blur(20px)", minWidth: "180px" }}>
      <div style={{ fontSize: "12px", fontWeight: "500", color: "#000000", marginBottom: "8px" }}>{label}</div>
      {payload.map((p, i: number) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: p.color }} />
            <span style={{ fontSize: "11px", color: "#000000" }}>{p.name}</span>
          </div>
          <span style={{ fontSize: "12px", fontWeight: "500", color: "#000000" }}>{p.value}{p.name === "satisfaction" ? "%" : ""}</span>
        </div>
      ))}
    </div>
  );
};

type PieActiveSectorProps = {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload?: { name?: string };
  value?: number;
};

const renderActiveShape = (props: PieActiveSectorProps) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  if (
    cx == null ||
    cy == null ||
    innerRadius == null ||
    outerRadius == null ||
    startAngle == null ||
    endAngle == null ||
    fill == null
  ) {
    return <g />;
  }
  const label = payload?.name ?? "";
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#000000" fontSize={15} fontWeight={800}>{value}%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#000000" fontSize={10}>{label}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} style={{ filter: `drop-shadow(0 0 8px ${fill}88)` }} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={innerRadius - 1} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export function LearningAnalyticsChart() {
  const dataRev = useHrDataRevision();
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState<"bar" | "area">("bar");
  const [hideFutureMonths, setHideFutureMonths] = useState(false);

  const monthlyData = useMemo(() => {
    void dataRev;
    const raw = buildLearningMonthlyChartData(getHrDashboardMetrics());
    if (!hideFutureMonths) return raw;
    const cm = new Date().getMonth();
    return raw.slice(0, cm + 1);
  }, [dataRev, hideFutureMonths]);

  const yearLabel = new Date().getFullYear();

  const exportCsv = () => {
    downloadCsv(`learning-analytics-${yearLabel}.csv`, ["Месяц", "Завершено", "Начато", "Отменено", "Удовлетворённость %"], monthlyData.map((r) => [r.month, String(r.завершено), String(r.начато), String(r.отменено), String(r.satisfaction)]));
  };

  return (
    <div className="glass-card" style={{ padding: "24px", minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "500", color: "#000000", margin: 0 }}>Аналитика обучения</h3>
            <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,0.14)", border: "1px solid rgba(129,208,245,0.35)", fontSize: "10px", fontWeight: "500", color: "#000000" }}>{yearLabel}</div>
          </div>
          <p style={{ fontSize: "12px", color: "#000000", margin: 0 }}>
            Динамика масштабируется по справочнику HR (в обучении и средний % плана).{" "}
            {hideFutureMonths ? "Показаны только прошедшие месяцы года." : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {/* Tab toggle */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.04)", borderRadius: "9px", border: "1px solid rgba(0,0,0,0.08)", padding: "3px" }}>
            {([["bar", BarChart2], ["area", PieIcon]] as const).map(([t, Icon]) => (
              <button key={t} onClick={() => setTab(t as "bar" | "area")}
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "7px", background: tab === t ? "rgba(227,0,11,0.1)" : "transparent", border: "none", color: tab === t ? "#e3000b" : "#000000", fontSize: "11px", fontWeight: "500", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .15s" }}>
                <Icon size={12} />
              </button>
            ))}
          </div>
          <button
            type="button"
            title={hideFutureMonths ? "Показать все месяцы года" : "Только прошедшие месяцы"}
            onClick={() => setHideFutureMonths((v) => !v)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: hideFutureMonths ? "rgba(227,0,11,0.1)" : "rgba(0,0,0,0.04)",
              border: hideFutureMonths ? "1px solid rgba(227,0,11,0.28)" : "1px solid rgba(0,0,0,0.08)",
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
            onClick={exportCsv}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.04)",
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

      {/* Charts layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "20px" }}>
        {/* Main chart */}
        <div>
          <ResponsiveContainer width="100%" height={220}>
            {tab === "bar" ? (
              <ComposedChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e3000b" stopOpacity={0.92} />
                    <stop offset="100%" stopColor="#81d0f5" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="barStarted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#81d0f5" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#81d0f5" stopOpacity={0.18} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#000000", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#000000", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="начато" name="начато" fill="url(#barStarted)" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="завершено" name="завершено" fill="url(#barCompleted)" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Line type="monotone" dataKey="satisfaction" name="satisfaction" stroke="#e3000b" strokeWidth={2} dot={{ fill: "#e3000b", r: 3 }} activeDot={{ r: 5, fill: "#e3000b" }} />
              </ComposedChart>
            ) : (
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e3000b" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#e3000b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaStart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#81d0f5" stopOpacity={0.38} />
                    <stop offset="100%" stopColor="#81d0f5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#000000", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#000000", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="начато" name="начато" stroke="#81d0f5" strokeWidth={2} fill="url(#areaStart)" />
                <Area type="monotone" dataKey="завершено" name="завершено" stroke="#e3000b" strokeWidth={2} fill="url(#areaComp)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
          {/* Legend row */}
          <div style={{ display: "flex", gap: "16px", paddingTop: "10px", paddingLeft: "8px" }}>
            {[
              { color: "#e3000b", label: "Завершено" },
              { color: "#81d0f5", label: "Начато" },
              { color: "#e3000b", label: "Удовлетворённость" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: l.color, boxShadow: `0 0 5px ${l.color}80` }} />
                <span style={{ fontSize: "11px", color: "#000000" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart — distribution */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "11.5px", fontWeight: "500", color: "#000000", marginBottom: "10px" }}>Распределение по направлениям</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={(p: unknown) => renderActiveShape(p as PieActiveSectorProps)}
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={62}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {distributionData.map((_, index) => (
                  <Cell key={index} fill={pieSliceColor(index)} stroke="#ffffff" strokeWidth={1} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "8px" }}>
            {distributionData.slice(0, 5).map((d, i) => {
              const c = pieSliceColor(i);
              return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", borderRadius: "7px", background: activeIndex === i ? `${c}18` : "transparent", transition: "background .15s", cursor: "pointer" }} onMouseEnter={() => setActiveIndex(i)}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "2px", background: c }} />
                  <span style={{ fontSize: "10.5px", color: "#000000" }}>{d.name}</span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "500", color: "#000000" }}>{d.value}%</span>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
