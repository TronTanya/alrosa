import React, { useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell, Sector
} from "recharts";
import { Download, Filter, BarChart2, PieChart as PieIcon } from "lucide-react";

const monthlyData = [
  { month: "Янв", завершено: 38, начато: 52, отменено: 4, satisfaction: 82 },
  { month: "Фев", завершено: 45, начато: 61, отменено: 3, satisfaction: 84 },
  { month: "Мар", завершено: 42, начато: 57, отменено: 5, satisfaction: 81 },
  { month: "Апр", завершено: 55, начато: 70, отменено: 2, satisfaction: 87 },
  { month: "Май", завершено: 61, начато: 76, отменено: 3, satisfaction: 88 },
  { month: "Июн", завершено: 58, начато: 72, отменено: 6, satisfaction: 85 },
  { month: "Июл", завершено: 48, начато: 63, отменено: 4, satisfaction: 83 },
  { month: "Авг", завершено: 52, начато: 68, отменено: 3, satisfaction: 86 },
  { month: "Сен", завершено: 67, начато: 84, отменено: 2, satisfaction: 90 },
  { month: "Окт", завершено: 72, начато: 89, отменено: 3, satisfaction: 91 },
  { month: "Ноя", завершено: 68, начато: 85, отменено: 4, satisfaction: 89 },
  { month: "Дек", завершено: 80, начато: 97, отменено: 2, satisfaction: 92 },
];

const distributionData = [
  { name: "Техн. экспертиза", value: 34 },
  { name: "Цифровая эфф.", value: 22 },
  { name: "Управленческая", value: 18 },
  { name: "Soft Skills", value: 14 },
  { name: "Безопасность", value: 8 },
  { name: "Иное", value: 4 },
];

const BRAND_PIE = ["#e3000b", "#81d0f5", "#000000"] as const;
function pieSliceColor(i: number) {
  return BRAND_PIE[i % 3];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(255,255,255,0.98)", border: "1px solid rgba(129,208,245,0.4)", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(227,0,11,0.06)", backdropFilter: "blur(20px)", minWidth: "180px" }}>
      <div style={{ fontSize: "12px", fontWeight: "700", color: "#000000", marginBottom: "8px" }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: p.color }} />
            <span style={{ fontSize: "11px", color: "#000000" }}>{p.name}</span>
          </div>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#000000" }}>{p.value}{p.name === "satisfaction" ? "%" : ""}</span>
        </div>
      ))}
    </div>
  );
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#000000" fontSize={15} fontWeight={800}>{value}%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#000000" fontSize={10}>{payload.name}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} style={{ filter: `drop-shadow(0 0 8px ${fill}88)` }} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={innerRadius - 1} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export function LearningAnalyticsChart() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState<"bar" | "area">("bar");

  return (
    <div className="glass-card" style={{ padding: "24px", minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "4px", background: "linear-gradient(180deg,#e3000b,#81d0f5)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#000000", margin: 0 }}>Аналитика обучения</h3>
            <div style={{ padding: "3px 9px", borderRadius: "20px", background: "rgba(129,208,245,0.14)", border: "1px solid rgba(129,208,245,0.35)", fontSize: "10px", fontWeight: "600", color: "#000000" }}>2026</div>
          </div>
          <p style={{ fontSize: "12px", color: "#000000", margin: 0 }}>
            Динамика курсов по месяцам · Индекс удовлетворённости · Распределение по направлениям
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {/* Tab toggle */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.04)", borderRadius: "9px", border: "1px solid rgba(0,0,0,0.08)", padding: "3px" }}>
            {([["bar", BarChart2], ["area", PieIcon]] as const).map(([t, Icon]) => (
              <button key={t} onClick={() => setTab(t as "bar" | "area")}
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "7px", background: tab === t ? "rgba(227,0,11,0.1)" : "transparent", border: "none", color: tab === t ? "#e3000b" : "#000000", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .15s" }}>
                <Icon size={12} />
              </button>
            ))}
          </div>
          {[Filter, Download].map((Icon, i) => (
            <button key={i} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#000000" }}>
              <Icon size={13} />
            </button>
          ))}
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
          <div style={{ fontSize: "11.5px", fontWeight: "600", color: "#000000", marginBottom: "10px" }}>Распределение по направлениям</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
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
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#000000" }}>{d.value}%</span>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
