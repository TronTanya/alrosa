import React from "react";
import { Users, AlertTriangle, Zap } from "lucide-react";
import { brandIcon, type BrandLucideIcon } from "../../lib/brandIcons";
import { MANAGER_TEAM_SIZE } from "../../data/managerTeamCatalog";

function CircRing({ value, color, size = 64 }: { value: number; color: string; size?: number }) {
  const sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={sw} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontSize: "13px", fontWeight: 400, color: "#000000", lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: "8px", color: "rgba(0,0,0,0.45)", lineHeight: 1 }}>%</span>
      </div>
    </div>
  );
}

interface KPI {
  icon: BrandLucideIcon;
  label: string;
  value: string;
  sub: string;
  trend: string;
  trendUp: boolean | null;
  accent: string;
  glow: string;
  type: "ring" | "badge" | "text";
  ringVal?: number;
  badgeColor?: string;
}

const kpis: KPI[] = [
  {
    icon: Users,
    label: "Средний уровень компетенций команды",
    value: "76%",
    sub: `команды из ${MANAGER_TEAM_SIZE} чел.`,
    trend: "+4% за месяц",
    trendUp: true,
    accent: brandIcon.accentRed,
    glow: "rgba(227,0,11,0.18)",
    type: "ring",
    ringVal: 76,
  },
  {
    icon: AlertTriangle,
    label: "Риск отставания по навыкам",
    value: "7",
    sub: "сотрудников требуют внимания",
    trend: "↑ +2 с прошлой недели",
    trendUp: false,
    accent: brandIcon.accentRed,
    glow: "rgba(227,0,11,0.2)",
    type: "badge",
    badgeColor: brandIcon.accentRed,
  },
  {
    icon: Zap,
    label: "Ожидаемая окупаемость обучения",
    value: "+24%",
    sub: "к производительности команды",
    trend: "↑ Прогноз на 2026",
    trendUp: true,
    accent: "#d97706",
    glow: "rgba(217,119,6,0.18)",
    type: "text",
  },
];

export function KPICards() {
  return (
    <div className="manager-kpi-grid">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="glass-card"
          style={{ padding: "22px 20px", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform .2s, box-shadow .2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px rgba(0,0,0,.08), 0 0 20px ${k.glow}`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
        >
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: `radial-gradient(circle, ${k.glow} 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: `${k.accent}18`, border: `1px solid ${k.accent}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <k.icon size={16} style={{ color: k.accent }} />
            </div>
            <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", fontWeight: 400, lineHeight: 1.3 }}>{k.label}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div>
              {k.type === "badge" ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <div style={{ fontSize: "36px", fontWeight: 400, color: k.badgeColor, lineHeight: 1, letterSpacing: "-0.5px" }}>
                    {k.value}
                  </div>
                  <div style={{ padding: "5px 12px", borderRadius: "20px", background: "rgba(227,0,11,0.1)", border: "1px solid rgba(227,0,11,0.28)", fontSize: "11px", fontWeight: 400, color: brandIcon.accentRed }}>
                    7 сотрудников
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "36px", fontWeight: 400, color: "#000000", lineHeight: 1, letterSpacing: "-0.5px" }}>
                  {k.value}
                </div>
              )}
              <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)", marginTop: "4px" }}>{k.sub}</div>
            </div>
            {k.type === "ring" && k.ringVal !== undefined && (
              <CircRing value={k.ringVal} color={k.accent} />
            )}
            {k.type === "text" && (
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: `linear-gradient(135deg,${k.accent}22,${k.accent}10)`, border: `2px solid ${k.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 12px ${k.accent}35` }}>
                <k.icon size={24} style={{ color: k.accent }} />
              </div>
            )}
          </div>

          <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: k.trendUp === false ? brandIcon.accentRed : k.trendUp ? brandIcon.accentCyan : "rgba(0,0,0,0.45)", fontWeight: 400 }}>
            {k.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
