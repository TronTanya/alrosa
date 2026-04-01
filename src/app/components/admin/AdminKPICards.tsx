import React from "react";
import { useNavigate } from "react-router";
import { Users, BookOpen, Plug, Zap, Cpu } from "lucide-react";
import { ADMIN_USERS_TOTAL, ADMIN_COURSES_ACTIVE, ADMIN_INTEGRATIONS_OK } from "../../data/adminDashboardConstants";
import type { BrandLucideIcon } from "../../lib/brandIcons";

interface KPI {
  icon: BrandLucideIcon;
  label: string;
  value: string;
  sub: string;
  trend: string;
  trendGood: boolean;
  accent: string;
  glow: string;
  extra?: React.ReactNode;
  /** Переход по клику на карточку */
  to: string;
}

function MiniRing({ val, max, color }: { val: number; max: number; color: string }) {
  const pct = val / max;
  const size = 54, sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={sw} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ - pct * circ} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color}AA)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "10.5px", fontWeight: "600", color: "#000000" }}>{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}

function SparkBars({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "40px", flexShrink: 0 }}>
      {data.map((v, i) => (
        <div key={i} style={{ width: "7px", borderRadius: "3px 3px 0 0", background: `${color}${i === data.length - 1 ? "EE" : "55"}`, height: `${(v / max) * 100}%`, boxShadow: i === data.length - 1 ? `0 0 6px ${color}AA` : "none", transition: "height .3s" }} />
      ))}
    </div>
  );
}

function IntegrationBadges() {
  const items = [
    { label: "Outlook", ok: true },
    { label: "Яндекс Алиса", ok: true },
    { label: "1C HR", ok: true },
    { label: "Miro",  ok: true },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
      {items.map(({ label, ok }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "20px", background: ok ? "rgba(0,196,160,.14)" : "rgba(255,71,87,.14)", border: `1px solid ${ok ? "rgba(0,196,160,.28)" : "rgba(255,71,87,.28)"}`, fontSize: "9.5px", fontWeight: "500", color: ok ? "#00C4A0" : "#FF6B7A" }}>
          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: ok ? "#00C4A0" : "#FF6B7A", display: "inline-block" }} />
          {label}
        </div>
      ))}
    </div>
  );
}

function CPUGauge({ val }: { val: number }) {
  const size = 54, sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  const color = val < 30 ? "#81d0f5" : val < 70 ? "#e3000b" : "#c40009";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={sw} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ - (val / 100) * circ} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color}AA)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "10.5px", fontWeight: "600", color: "#000000" }}>{val}%</span>
      </div>
    </div>
  );
}

const userSpark = Array.from({ length: 7 }, (_, i) => {
  const t = i / 6;
  const base = Math.round(ADMIN_USERS_TOTAL * (0.78 + 0.22 * t));
  return i === 6 ? ADMIN_USERS_TOTAL : base;
});

const kpis: KPI[] = [
  {
    icon: Users,
    label: "Всего пользователей",
    value: String(ADMIN_USERS_TOTAL),
    sub: "303 активных · 9 новых",
    trend: "↑ +9 за неделю",
    trendGood: true,
    accent: "#e3000b",
    glow: "rgba(227,0,11,0.2)",
    extra: <SparkBars data={userSpark} color="#e3000b" />,
    to: "/admin/users",
  },
  {
    icon: BookOpen,
    label: "Активных курсов",
    value: String(ADMIN_COURSES_ACTIVE),
    sub: "12 в разработке",
    trend: "↑ +6 этот месяц",
    trendGood: true,
    accent: "#81d0f5",
    glow: "rgba(129,208,245,0.28)",
    extra: <MiniRing val={ADMIN_COURSES_ACTIVE} max={99} color="#81d0f5" />,
    to: "/admin/courses",
  },
  {
    icon: Plug,
    label: "Статус интеграций",
    value: "100%",
    sub: `${ADMIN_INTEGRATIONS_OK} / ${ADMIN_INTEGRATIONS_OK} активных`,
    trend: "→ Всё работает штатно",
    trendGood: true,
    accent: "#000000",
    glow: "rgba(0,0,0,0.12)",
    extra: <IntegrationBadges />,
    to: "/admin/integrations",
  },
  {
    icon: Zap,
    label: "Автоматизировано заявок",
    value: "94%",
    sub: "без участия сотрудника",
    trend: "↑ +7% vs прошлого квартала",
    trendGood: true,
    accent: "#e3000b",
    glow: "rgba(227,0,11,0.22)",
    extra: <MiniRing val={94} max={100} color="#e3000b" />,
    to: "/admin/notifications",
  },
  {
    icon: Cpu,
    label: "Системная нагрузка",
    value: "12%",
    sub: "CPU · RAM 38% · Disk 44%",
    trend: "→ Оптимальный режим",
    trendGood: true,
    accent: "#81d0f5",
    glow: "rgba(129,208,245,0.22)",
    extra: <CPUGauge val={12} />,
    to: "/admin/monitoring",
  },
];

export function AdminKPICards() {
  const navigate = useNavigate();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "14px" }}>
      {kpis.map((k) => (
        <div
          key={k.label}
          role="button"
          tabIndex={0}
          className="glass-card"
          style={{ padding: "18px 16px", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform .2s,box-shadow .2s" }}
          onClick={() => navigate(k.to)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(k.to);
            }
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px rgba(0,0,0,0.1), 0 0 20px ${k.glow}`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
        >
          <div style={{ position: "absolute", top: "-18px", right: "-18px", width: "80px", height: "80px", borderRadius: "50%", background: `radial-gradient(circle,${k.glow} 0%,transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "11px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `${k.accent}1E`, border: `1px solid ${k.accent}38`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <k.icon size={14} style={{ color: k.accent }} />
            </div>
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)", lineHeight: 1.3, fontWeight: "500" }}>{k.label}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "26px", fontWeight: "400", color: "#000000", letterSpacing: "-0.8px", lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: "10.5px", color: "rgba(0,0,0,0.45)", marginTop: "3px" }}>{k.sub}</div>
            </div>
            {k.extra}
          </div>

          <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(0,0,0,0.08)", fontSize: "10.5px", color: k.trendGood ? "#0d9488" : "#e3000b", fontWeight: "500" }}>
            {k.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
