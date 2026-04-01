import React from "react";
import { Link } from "react-router";
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
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, Clock, Users } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { ROUTE_PATHS } from "../routePaths";
import {
  LEARNING_SNAPSHOT,
  PORTAL_EMPLOYEE,
  hoursVsTeamPercentDiff,
  planProgressByMonth,
  skillsMixEmployee,
  skillsMixTeamAverage,
  teamAvgPlanProgressPercent,
  teamAvgStreakDays,
  teamAvgWeeklyHours,
  teamPeerLearningStats,
  weeklyHoursYouVsTeam,
} from "../data/employeePortalAnalytics";

const TooltipBox = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string }>;
  label?: string;
}) => {
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
      <div style={{ fontSize: "11px", fontWeight: "500", color: "#000000", marginBottom: "6px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: "11px", color: "#000000" }}>
          {p.name}: <span style={{ color: p.color ?? "#e3000b", fontWeight: 500 }}>{p.value}</span>
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
        <div style={{ fontSize: "14px", fontWeight: 500, color: "#000000", margin: 0, fontFamily: "var(--font-sans)" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#000000", marginTop: "2px", fontFamily: "var(--font-sans)" }}>{subtitle}</div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const hoursDiff = hoursVsTeamPercentDiff();
  const hoursTrend =
    hoursDiff === 0
      ? `Среднее по команде: ${teamAvgWeeklyHours} ч / нед.`
      : `${hoursDiff > 0 ? "Выше" : "Ниже"} среднего команды (${teamAvgWeeklyHours} ч) на ${Math.abs(hoursDiff)}%`;

  const kpi = [
    {
      icon: Clock,
      color: brandIcon.stroke,
      label: "Часы за 7 дней",
      value: String(LEARNING_SNAPSHOT.weeklyLearningHoursTotal),
      sub: "ч обучения",
      trend: hoursTrend,
    },
    {
      icon: TrendingUp,
      color: brandIcon.accentRed,
      label: "Серия",
      value: String(LEARNING_SNAPSHOT.learningStreakDays),
      sub: "дней подряд",
      trend: `Среднее по команде: ${teamAvgStreakDays} дн.`,
    },
    {
      icon: BarChart3,
      color: brandIcon.accentCyan,
      label: "Завершено",
      value: String(LEARNING_SNAPSHOT.coursesCompleted),
      sub: "курсов",
      trend: `${LEARNING_SNAPSHOT.coursesInProgress} в работе · план ${LEARNING_SNAPSHOT.planProgressPercent}% (среднее команды ${teamAvgPlanProgressPercent}%)`,
    },
  ];

  const planData = [...planProgressByMonth];

  return (
    <div className="analytics-page-alrosa">
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
                fontWeight: "600",
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
              {PORTAL_EMPLOYEE.name} · {PORTAL_EMPLOYEE.role}. Показатели актуальны на {PORTAL_EMPLOYEE.metricsAsOf}. Сравнение с{" "}
              {teamPeerLearningStats.length} коллегами подразделения {PORTAL_EMPLOYEE.unit} (тот же состав, что в разделе{" "}
              <Link to={ROUTE_PATHS.employeeTeam} style={{ color: "#0284c7", fontWeight: 500 }}>
                Команда
              </Link>
              ).
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
        {kpi.map((k, i) => {
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
                <span style={{ fontSize: "12px", color: "#000000", fontWeight: "500", fontFamily: "var(--font-sans)" }}>{k.label}</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "500", color: "#000000", letterSpacing: "-0.5px", fontFamily: "var(--font-sans)" }}>{k.value}</div>
              <div style={{ fontSize: "11px", color: "#000000", marginTop: "4px", fontFamily: "var(--font-sans)" }}>{k.sub}</div>
              <div style={{ fontSize: "11px", color: "#000000", marginTop: "8px", fontWeight: "500", fontFamily: "var(--font-sans)", lineHeight: 1.35 }}>
                {k.trend}
              </div>
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
          style={{
            padding: "20px",
            minHeight: "300px",
          }}
        >
          <SectionTitle title="Часы обучения по дням" subtitle="Вы и среднее по команде «Платформа», текущая неделя" />
          <div style={{ width: "100%", height: "240px", marginTop: "16px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHoursYouVsTeam()} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#000000", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#000000", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<TooltipBox />} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-sans)" }} />
                <Bar dataKey="вы" name="Вы" fill="url(#barGradYou)" radius={[6, 6, 0, 0]} maxBarSize={22} />
                <Bar dataKey="команда" name="Среднее команды" fill="url(#barGradTeam)" radius={[6, 6, 0, 0]} maxBarSize={22} />
                <defs>
                  <linearGradient id="barGradYou" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e3000b" />
                    <stop offset="100%" stopColor="#c40009" />
                  </linearGradient>
                  <linearGradient id="barGradTeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#81d0f5" />
                    <stop offset="100%" stopColor="#5ab8e0" />
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
          style={{
            padding: "20px",
            minHeight: "300px",
          }}
        >
          <SectionTitle title="Фокус по навыкам" subtitle="Ваше распределение времени за квартал и среднее по команде" />
          <div style={{ width: "100%", height: "200px", marginTop: "16px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[...skillsMixEmployee]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={2}
                >
                  {skillsMixEmployee.map((e) => (
                    <Cell key={e.name} fill={e.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<TooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "4px" }}>
            {skillsMixEmployee.map((s) => {
              const team = skillsMixTeamAverage.find((t) => t.name === s.name);
              return (
                <span key={s.name} style={{ fontSize: "11px", color: "#000000", fontWeight: 500, fontFamily: "var(--font-sans)" }}>
                  <span style={{ color: s.color, fontWeight: 500 }} aria-hidden>
                    ●
                  </span>{" "}
                  {s.name}: <span style={{ color: "#000000" }}>{s.value}%</span>
                  {team ? (
                    <span style={{ color: "#000000", fontWeight: 500 }}> · команда ~{team.value}%</span>
                  ) : null}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass-card"
        style={{
          padding: "20px",
          marginTop: "4px",
        }}
      >
        <SectionTitle title="Прогресс по плану развития" subtitle="Последние 6 месяцев, % · вы и среднее по команде" />
        <div style={{ width: "100%", height: "260px", marginTop: "16px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={planData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gYou" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e3000b" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#81d0f5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gTeam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#81d0f5" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#81d0f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="m" tick={{ fill: "#000000", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#000000", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<TooltipBox />} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-sans)" }} />
              <Area type="monotone" dataKey="я" name="Вы" stroke="#e3000b" fill="url(#gYou)" strokeWidth={2} />
              <Area type="monotone" dataKey="команда" name="Среднее команды" stroke="#0284c7" fill="url(#gTeam)" strokeWidth={2} strokeDasharray="6 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="glass-card"
        style={{ padding: "20px", marginTop: "16px" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(227,0,11,0.12), rgba(129,208,245,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 500, color: "#000000", fontFamily: "var(--font-sans)" }}>Команда «Платформа»</div>
              <div style={{ fontSize: "12px", color: "#000000", marginTop: "2px", fontFamily: "var(--font-sans)" }}>
                План развития и часы за неделю по коллегам (тот же список, что в карточках)
              </div>
            </div>
          </div>
          <Link
            to={ROUTE_PATHS.employeeTeam}
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#0284c7",
              textDecoration: "none",
              fontFamily: "var(--font-sans)",
            }}
          >
            Открыть карточки команды →
          </Link>
        </div>
        <div style={{ overflowX: "auto", marginTop: "14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "var(--font-sans)" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg, #fafafa 0%, #f5f5f7 100%)", textAlign: "left" }}>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "#000000" }}>Сотрудник</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "#000000" }}>Роль</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "#000000" }}>План, %</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "#000000" }}>Ч / нед.</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "#000000" }}>Серия, дн.</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "linear-gradient(90deg, rgba(227,0,11,.06) 0%, rgba(129,208,245,.1) 100%)" }}>
                <td style={{ padding: "12px 14px", fontWeight: 500, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  {PORTAL_EMPLOYEE.name} <span style={{ fontSize: "10px", color: "#e3000b" }}>вы</span>
                </td>
                <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>{PORTAL_EMPLOYEE.role}</td>
                <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)", fontWeight: 500 }}>{LEARNING_SNAPSHOT.planProgressPercent}%</td>
                <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)", fontWeight: 500 }}>{LEARNING_SNAPSHOT.weeklyLearningHoursTotal}</td>
                <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)", fontWeight: 500 }}>{LEARNING_SNAPSHOT.learningStreakDays}</td>
              </tr>
              {teamPeerLearningStats.map((p) => (
                <tr key={p.email} style={{ background: "#ffffff" }}>
                  <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>{p.name}</td>
                  <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)", color: "#000000" }}>{p.role}</td>
                  <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>{p.planProgressPercent}%</td>
                  <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>{p.weeklyHoursApprox}</td>
                  <td style={{ padding: "12px 14px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>{p.streakDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
