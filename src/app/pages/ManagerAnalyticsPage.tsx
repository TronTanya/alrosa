import React from "react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";

const deptProgress = [
  { dept: "Backend", прогресс: 78 },
  { dept: "Frontend", прогресс: 84 },
  { dept: "DevOps", прогресс: 71 },
  { dept: "QA", прогресс: 69 },
  { dept: "Product", прогресс: 88 },
  { dept: "Design", прогресс: 62 },
];

const teamTrend = [
  { m: "Окт", команда: 68 },
  { m: "Ноя", команда: 71 },
  { m: "Дек", команда: 73 },
  { m: "Янв", команда: 74 },
  { m: "Фев", команда: 75 },
  { m: "Мар", команда: 76 },
];

const focusMix = [
  { name: "Тех. навыки", value: 44, color: "#e3000b" },
  { name: "Soft Skills", value: 22, color: "#81d0f5" },
  { name: "Лидерство", value: 18, color: "#000000" },
  { name: "Безопасность", value: 16, color: "#0284c7" },
];

const TooltipBox = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(129,208,245,0.4)",
        borderRadius: "12px",
        padding: "10px 14px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(227,0,11,0.06)",
      }}
    >
      <div style={{ fontSize: "11px", fontWeight: "700", color: "#000000", marginBottom: "6px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: "11px", color: "#000000" }}>
          {p.name}: <span style={{ color: p.color ?? "#e3000b", fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="analytics-section-title">
      <span className="analytics-section-title__bar" aria-hidden />
      <div>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#000000", margin: 0, fontFamily: "var(--font-sans)" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#000000", marginTop: "2px", fontFamily: "var(--font-sans)" }}>{subtitle}</div>
      </div>
    </div>
  );
}

export function ManagerAnalyticsPage() {
  return (
    <div className="analytics-page-alrosa" style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 4px" }}>
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
            <h1
              style={{
                fontSize: "21px",
                fontWeight: "800",
                color: "#000000",
                letterSpacing: "-0.4px",
                margin: 0,
                lineHeight: 1.2,
                fontFamily: "var(--font-sans)",
              }}
            >
              Аналитика
            </h1>
            <p style={{ fontSize: "13px", color: "#000000", margin: "8px 0 0", maxWidth: "720px", lineHeight: 1.55, fontFamily: "var(--font-sans)" }}>
              Сводка по команде (15 сотрудников): средний прогресс, динамика и распределение фокуса обучения по направлениям.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {[
          { icon: Users, color: brandIcon.stroke, label: "Средний прогресс команды", value: "76%", sub: "по компетенциям", trend: "+4% за месяц" },
          { icon: TrendingUp, color: brandIcon.accentRed, label: "Выполнение ИПР", value: "84%", sub: "в графике", trend: "+11% за квартал" },
          { icon: BarChart3, color: brandIcon.accentCyan, label: "Часы обучения / мес.", value: "312", sub: "на команду", trend: "норма выдержана" },
        ].map((k, i) => {
          const KIcon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="glass-card-bright"
              style={{
                padding: "16px 18px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.08), 0 0 20px rgba(129,208,245,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(227,0,11,0.14), rgba(129,208,245,0.22))",
                    border: "1px solid rgba(129,208,245,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <KIcon size={18} color={k.color} strokeWidth={brandIcon.sw} />
                </div>
                <span style={{ fontSize: "12px", color: "#000000", fontWeight: "600", fontFamily: "var(--font-sans)" }}>{k.label}</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: "#000000", letterSpacing: "-0.5px", fontFamily: "var(--font-sans)" }}>{k.value}</div>
              <div style={{ fontSize: "11px", color: "#000000", marginTop: "4px", fontFamily: "var(--font-sans)" }}>{k.sub}</div>
              <div style={{ fontSize: "11px", color: "#000000", marginTop: "8px", fontWeight: "600", fontFamily: "var(--font-sans)" }}>{k.trend}</div>
            </motion.div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "16px",
          alignItems: "stretch",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ padding: "20px", minHeight: "280px" }}
        >
          <SectionTitle title="Прогресс по подразделениям" subtitle="Средний % по команде, текущий месяц" />
          <div style={{ width: "100%", height: "220px", marginTop: "16px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptProgress} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
                <XAxis dataKey="dept" tick={{ fill: "#000000", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#000000", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<TooltipBox />} />
                <Bar dataKey="прогресс" name="%" fill="url(#mgrBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <defs>
                  <linearGradient id="mgrBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e3000b" />
                    <stop offset="100%" stopColor="#81d0f5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="glass-card"
          style={{ padding: "20px", minHeight: "280px" }}
        >
          <SectionTitle title="Фокус обучения команды" subtitle="Распределение часов за квартал" />
          <div style={{ width: "100%", height: "220px", marginTop: "16px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={focusMix}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {focusMix.map((e) => (
                    <Cell key={e.name} fill={e.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<TooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "4px" }}>
            {focusMix.map((s) => (
              <span key={s.name} style={{ fontSize: "12px", color: "#000000", fontWeight: 600, fontFamily: "var(--font-sans)" }}>
                <span style={{ color: s.color, fontWeight: 700 }} aria-hidden>
                  ●
                </span>{" "}
                {s.name} <span style={{ color: "#000000" }}>{s.value}%</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass-card"
        style={{ padding: "20px", marginTop: "4px" }}
      >
        <SectionTitle title="Динамика среднего прогресса команды" subtitle="Последние 6 месяцев, %" />
        <div style={{ width: "100%", height: "260px", marginTop: "16px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={teamTrend} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="mgrAreaG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e3000b" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#81d0f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="m" tick={{ fill: "#000000", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#000000", fontSize: 12 }} axisLine={false} tickLine={false} domain={[60, 90]} />
              <Tooltip content={<TooltipBox />} />
              <Area type="monotone" dataKey="команда" name="Команда" stroke="#e3000b" fill="url(#mgrAreaG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
