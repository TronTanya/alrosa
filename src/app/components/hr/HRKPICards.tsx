import React, { useMemo } from "react";
import { Users, CheckCircle, Wallet, Zap, Clock } from "lucide-react";
import type { BrandLucideIcon } from "../../lib/brandIcons";
import { HR_GLOSS } from "../../lib/hrLdLabels";
import { getHrDashboardMetrics } from "../../lib/hrDashboardMetrics";
import { useHrDataRevision } from "../../hooks/useHrDataRevision";

interface KPI {
  icon: BrandLucideIcon;
  label: string;
  value: string;
  sub: string;
  trend: string;
  trendGood: boolean;
  accent: string;
  glow: string;
  ring?: { val: number; max: number };
  sparkline?: number[];
}

function MiniRing({ val, max, color }: { val: number; max: number; color: string }) {
  const pct = val / max;
  const size = 56,
    sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2,
    cy = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={sw} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={circ}
          strokeDashoffset={circ - pct * circ}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}99)` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 400, color: "#111111" }}>{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80,
    h = 36,
    pad = 4;
  const min = Math.min(...data),
    max = Math.max(...data);
  const norm = (v: number) => h - pad - ((v - min) / (max - min + 0.01)) * (h - pad * 2);
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => `${pad + i * step},${norm(v)}`).join(" ");
  const area =
    `M${pad},${h} ` + data.map((v, i) => `L${pad + i * step},${norm(v)}`).join(" ") + ` L${pad + (data.length - 1) * step},${h} Z`;
  return (
    <svg width={w} height={h} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color.replace("#", "")})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}99)` }}
      />
      <circle cx={pad + (data.length - 1) * step} cy={norm(data[data.length - 1])} r={3} fill={color} />
    </svg>
  );
}

export function HRKPICards() {
  const dataRev = useHrDataRevision();
  const kpis = useMemo((): KPI[] => {
    void dataRev;
    const m = getHrDashboardMetrics();
    const planRing = m.avgPlanPct != null ? Math.min(100, Math.max(0, m.avgPlanPct)) : 0;
    const spentM = m.budgetSpentRub / 1_000_000;
    const planM = m.budgetPlanRub / 1_000_000;
    const sparkBudget = [2.1, 2.8, 3.2, 3.6, 4.0, spentM].map((x) => Math.min(planM, Math.max(2, x)));
    const sparkTime = [68, 82, 95, 104, 117, m.hrHoursSaved].map((x) => Math.min(220, x));

    return [
      {
        icon: Users,
        label: "Сотрудников в обучении",
        value: String(m.inLearning),
        sub: `из ${m.totalEmployees} активных`,
        trend: `В плане: ${m.inPlan} · не в плане: ${m.notInPlan}`,
        trendGood: true,
        accent: "#e3000b",
        glow: "rgba(227,0,11,0.26)",
        ring: { val: m.inLearning, max: m.totalEmployees },
      },
      {
        icon: CheckCircle,
        label: "Средний % выполнения плана",
        value: m.avgPlanPctDisplay,
        sub: "по сотрудникам с метрикой",
        trend: "Агрегат справочника HR",
        trendGood: true,
        accent: "#81d0f5",
        glow: "rgba(129,208,245,0.32)",
        ring: { val: planRing || 52, max: 100 },
      },
      {
        icon: Wallet,
        label: "Бюджет израсходовано",
        value: m.budgetSpentLabel,
        sub: `из ${planM.toFixed(1)} млн ₽ плана`,
        trend: `→ ~${m.budgetRemainPct}% остаток`,
        trendGood: m.budgetRemainPct >= 10,
        accent: "#81d0f5",
        glow: "rgba(129,208,245,0.24)",
        sparkline: sparkBudget,
      },
      {
        icon: Zap,
        label: "Автообработано заявок",
        value: `${m.autoProcessPct}%`,
        sub: `без участия ${HR_GLOSS}`,
        trend: `Заявок в очереди: ${m.pendingApplications}`,
        trendGood: m.pendingApplications < 8,
        accent: "#000000",
        glow: "rgba(0,0,0,0.12)",
        ring: { val: m.autoProcessPct, max: 100 },
      },
      {
        icon: Clock,
        label: `Экономия времени ${HR_GLOSS}`,
        value: `${m.hrHoursSaved} ч`,
        sub: "в месяц (оценка)",
        trend: "По активности обучения и очереди",
        trendGood: true,
        accent: "#e3000b",
        glow: "rgba(227,0,11,0.22)",
        sparkline: sparkTime,
      },
    ];
  }, [dataRev]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "14px" }}>
      {kpis.map((k) => (
        <div
          key={k.label}
          className="glass-card"
          style={{
            padding: "18px 16px",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "transform .2s,box-shadow .2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 36px rgba(0,0,0,.1),0 0 16px ${k.glow}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-16px",
              right: "-16px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: `radial-gradient(circle,${k.glow} 0%,transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: `${k.accent}1E`,
                border: `1px solid ${k.accent}38`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <k.icon size={14} style={{ color: k.accent }} />
            </div>
            <span style={{ fontSize: "11px", color: "#000000", lineHeight: 1.3, fontWeight: "500" }}>{k.label}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <div>
              <div style={{ fontSize: "26px", fontWeight: 400, color: "#000000", letterSpacing: "-0.8px", lineHeight: 1 }}>
                {k.value}
              </div>
              <div style={{ fontSize: "10.5px", color: "#000000", marginTop: "3px" }}>{k.sub}</div>
            </div>
            {k.ring && <MiniRing val={k.ring.val} max={k.ring.max} color={k.accent} />}
            {k.sparkline && <MiniSparkline data={k.sparkline} color={k.accent} />}
          </div>

          <div
            style={{
              marginTop: "12px",
              paddingTop: "10px",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              fontSize: "10.5px",
              color: k.trendGood ? "#000000" : "#e3000b",
              fontWeight: "500",
            }}
          >
            {k.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
