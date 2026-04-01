import React from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from "recharts";

/* ─── Circular Progress ─── */
function CircularProgress({
  value,
  label,
  color,
  size = 78,
}: {
  value: number;
  label: string;
  color: string;
  size?: number;
}) {
  const strokeW = 5;
  const radius = (size - strokeW * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={strokeW}
          />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${color}99)`, transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "800", color: "#000000", lineHeight: 1, fontFamily: "var(--font-sans)" }}>
            {value}
          </span>
          <span style={{ fontSize: "8px", color: "#000000", lineHeight: 1 }}>%</span>
        </div>
      </div>
      <span
        style={{
          fontSize: "11px",
          color: "#000000",
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: "70px",
          fontFamily: "var(--font-sans)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Competency Card ─── */
const skills = [
  { label: "Технические навыки", value: 78, color: "#81d0f5" },
  { label: "Soft Skills", value: 83, color: "#e3000b" },
  { label: "Лидерство", value: 65, color: "#000000" },
  { label: "Аналитика данных", value: 71, color: "#81d0f5" },
];

const skillTags = [
  { tag: "Python", level: "Senior" },
  { tag: "ML/AI", level: "Middle" },
  { tag: "Backend", level: "Senior" },
  { tag: "DevOps", level: "Junior" },
  { tag: "SQL", level: "Senior" },
  { tag: "Архитектура", level: "Middle" },
];

function CompetencyCard() {
  return (
    <div className="glass-card" style={{ padding: "22px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#000000", fontFamily: "var(--font-sans)" }}>
            Текущий уровень компетенций
          </div>
          <div style={{ fontSize: "11px", color: "#000000", marginTop: "2px", fontFamily: "var(--font-sans)" }}>
            Обновлено 28.03.2026
          </div>
        </div>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(227,0,11,0.08), rgba(129,208,245,0.14))",
            border: "1px solid rgba(129,208,245,0.35)",
            fontSize: "11px",
            fontWeight: "600",
            color: "#000000",
            fontFamily: "var(--font-sans)",
          }}
        >
          Middle+
        </div>
      </div>

      {/* Circular progress bars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        {skills.map((s) => (
          <CircularProgress key={s.label} value={s.value} label={s.label} color={s.color} />
        ))}
      </div>

      {/* Skill tags */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "14px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#000000",
            marginBottom: "10px",
            letterSpacing: "0.5px",
            fontFamily: "var(--font-sans)",
          }}
        >
          ТЕХНОЛОГИЧЕСКИЙ СТЕК
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {skillTags.map((s) => (
            <div
              key={s.tag}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "20px",
                background: "#fafafa",
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: "11px",
                color: "#000000",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span>{s.tag}</span>
              <span
                style={{
                  fontSize: "9px",
                  padding: "1px 5px",
                  borderRadius: "8px",
                  background:
                    s.level === "Senior"
                      ? "rgba(129,208,245,0.25)"
                      : s.level === "Middle"
                      ? "rgba(227,0,11,0.1)"
                      : "rgba(0,0,0,0.06)",
                  color: s.level === "Senior" ? "#000000" : s.level === "Middle" ? "#e3000b" : "#000000",
                  fontWeight: "600",
                }}
              >
                {s.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Radar Chart ─── */
const radarData = [
  { subject: "ML/AI", value: 72, target: 90 },
  { subject: "Backend", value: 85, target: 90 },
  { subject: "DevOps", value: 60, target: 90 },
  { subject: "Frontend", value: 78, target: 90 },
  { subject: "Data Eng", value: 65, target: 90 },
  { subject: "Безопасность", value: 55, target: 90 },
];

const CustomTick = ({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(0,0,0,0.55)"
        fontSize={10}
        fontFamily="var(--font-sans)"
        fontWeight={500}
      >
        {payload?.value}
      </text>
    </g>
  );
};

function RadarChartCard() {
  return (
    <div className="glass-card" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", fontFamily: "var(--font-sans)" }}>
            Карта навыков (Radar)
          </div>
          <div style={{ fontSize: "11px", color: "#000000", marginTop: "2px", fontFamily: "var(--font-sans)" }}>
            По 6 ключевым доменам
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#e3000b" }} />
            <span style={{ fontSize: "10px", color: "#000000", fontFamily: "var(--font-sans)" }}>Сейчас</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#81d0f5" }} />
            <span style={{ fontSize: "10px", color: "#000000", fontFamily: "var(--font-sans)" }}>Цель</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
          <defs>
            <linearGradient id="radar-fill-current" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e3000b" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#81d0f5" stopOpacity={0.22} />
            </linearGradient>
            <linearGradient id="radar-fill-target" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#81d0f5" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#81d0f5" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <PolarGrid
            stroke="rgba(0,0,0,0.08)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={CustomTick as React.ComponentType<unknown>}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          {/* Target area (shown behind) */}
          <Radar
            name="Цель"
            dataKey="target"
            stroke="rgba(129,208,245,0.45)"
            fill="url(#radar-fill-target)"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          {/* Current */}
          <Radar
            name="Сейчас"
            dataKey="value"
            stroke="#e3000b"
            fill="url(#radar-fill-current)"
            strokeWidth={2}
            dot={{ r: 3, fill: "#81d0f5", stroke: "#e3000b" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Main Left Panel ─── */
export function LeftPanel() {
  return (
    <div
      className="cabinet-left-column"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        minWidth: 0,
      }}
    >
      <CompetencyCard />
      <RadarChartCard />
    </div>
  );
}