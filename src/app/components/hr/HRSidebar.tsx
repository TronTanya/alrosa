import React, { useMemo } from "react";
import { Link, NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  BrainCircuit,
  BookOpen,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  Settings,
  HelpCircle,
  ChevronRight,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { useMobileNav } from "../../contexts/MobileNavContext";
import { useHrDataRevision } from "../../hooks/useHrDataRevision";
import { brandIcon, type BrandLucideIcon } from "../../lib/brandIcons";
import { getHrDashboardMetrics } from "../../lib/hrDashboardMetrics";
import { HR_GLOSS, L_D_GLOSS } from "../../lib/hrLdLabels";

type NavEntry =
  | { kind: "navlink"; icon: LucideIcon; label: string; badge: string | null; to: string; end?: boolean }
  | { kind: "link"; icon: LucideIcon; label: string; badge: string | null; to: string };

const navItems: NavEntry[] = [
  { kind: "navlink", icon: LayoutDashboard, label: "Главная", badge: null, to: "/hr", end: true },
  { kind: "navlink", icon: BarChart3, label: `${HR_GLOSS} & Аналитика`, badge: "!", to: "/hr/dashboard", end: true },
  { kind: "navlink", icon: Users, label: "Сотрудники", badge: "312", to: "/hr/employees", end: true },
  { kind: "navlink", icon: UserCog, label: "Траектории развития", badge: "24", to: "/hr/trajectory", end: true },
  { kind: "navlink", icon: BrainCircuit, label: "ИИ-Наставник", badge: null, to: "/hr/mentor", end: true },
  { kind: "navlink", icon: BookOpen, label: "Каталог курсов", badge: null, to: "/hr/catalog", end: true },
  { kind: "navlink", icon: GraduationCap, label: "Назначение курсов", badge: null, to: "/hr/assign-courses", end: true },
  { kind: "navlink", icon: Briefcase, label: "Заявки", badge: "15", to: "/hr/applications", end: true },
  { kind: "navlink", icon: TrendingUp, label: "Компетенции", badge: null, to: "/hr/competencies", end: true },
  { kind: "navlink", icon: Calendar, label: "Мероприятия", badge: "4", to: "/hr/events", end: true },
  { kind: "navlink", icon: FileText, label: "Отчёты", badge: null, to: "/hr/reports", end: true },
  { kind: "navlink", icon: Award, label: "Сертификаты", badge: null, to: "/hr/certificates", end: true },
];

const bottomItems = [
  { icon: HelpCircle, label: "Поддержка", to: "/hr/support" },
  { icon: Settings, label: "Настройки", to: "/hr/settings" },
] as const;

function rowInner(
  isActive: boolean,
  Icon: BrandLucideIcon,
  label: string,
  badge: string | null,
) {
  return (
    <>
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "9px",
          background: isActive
            ? "linear-gradient(135deg, rgba(227,0,11,0.45), rgba(129,208,245,0.2))"
            : "rgba(129,208,245,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: isActive ? "0 0 14px rgba(227,0,11,0.25)" : "none",
          transition: "all 0.2s",
        }}
      >
        <Icon size={15} color={isActive ? brandIcon.stroke : brandIcon.muted} strokeWidth={brandIcon.sw} />
      </div>
      <span style={{ flex: 1, fontSize: "13.5px" }}>{label}</span>
      {badge && badge !== "!" && (
        <div
          style={{
            minWidth: "18px",
            height: "18px",
            borderRadius: "9px",
            background: isActive ? "linear-gradient(135deg, #e3000b, #81d0f5)" : "rgba(129,208,245,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: "500",
            color: isActive ? "#000000" : "#000000",
            padding: "0 5px",
          }}
        >
          {badge}
        </div>
      )}
      {badge === "!" && (
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#e3000b",
            boxShadow: "0 0 6px rgba(227,0,11,0.5)",
          }}
        />
      )}
      {isActive && <ChevronRight size={12} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />}
    </>
  );
}

function NavRow({
  entry,
  onNavigate,
}: {
  entry: NavEntry;
  onNavigate?: () => void;
}) {
  const { icon: Icon, label, badge, to, kind } = entry;
  if (kind === "navlink") {
    return (
      <NavLink
        to={to}
        end={entry.end}
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        style={{ textDecoration: "none" }}
        onClick={() => onNavigate?.()}
      >
        {({ isActive }) => rowInner(isActive, Icon, label, badge)}
      </NavLink>
    );
  }
  return (
    <Link
      to={to}
      className="nav-item"
      style={{ textDecoration: "none" }}
      onClick={() => onNavigate?.()}
    >
      {rowInner(false, Icon, label, badge)}
    </Link>
  );
}

function BottomNavItem({
  icon: Icon,
  label,
  to,
  onNavigate,
}: {
  icon: LucideIcon;
  label: string;
  to: string;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      style={{ textDecoration: "none" }}
      onClick={() => onNavigate?.()}
    >
      {({ isActive }) => rowInner(isActive, Icon, label, null)}
    </NavLink>
  );
}

function formatMln(value: number, fraction = 1): string {
  return value.toLocaleString("ru-RU", { minimumFractionDigits: fraction, maximumFractionDigits: fraction });
}

export function HRSidebar() {
  const { open, setOpen } = useMobileNav();
  const close = () => setOpen(false);
  const dataRev = useHrDataRevision();
  const m = useMemo(() => {
    void dataRev;
    return getHrDashboardMetrics();
  }, [dataRev]);
  const planM = m.budgetPlanRub / 1_000_000;
  const spentM = m.budgetSpentRub / 1_000_000;
  const remainM = Math.max(0, (m.budgetPlanRub - m.budgetSpentRub) / 1_000_000);
  const usedPct = Math.min(100, Math.max(0, Math.round((m.budgetSpentRub / m.budgetPlanRub) * 100)));

  return (
    <div className={`sidebar employee-sidebar custom-scroll${open ? " sidebar--open" : ""}`}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: "500",
          letterSpacing: "1.2px",
          color: "#000000",
          textTransform: "uppercase",
          padding: "0 14px 10px",
        }}
      >
        Навигация {HR_GLOSS}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => (
          <NavRow key={item.label} entry={item} onNavigate={close} />
        ))}
      </div>

      <div
        style={{
          height: "1px",
          background: "rgba(129,208,245,0.06)",
          margin: "16px 4px",
        }}
      />

      <div
        style={{
          margin: "0 4px 16px",
          padding: "14px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(227,0,11,0.14), rgba(129,208,245,0.08))",
          border: "1px solid rgba(129,208,245,0.2)",
        }}
      >
        <div style={{ fontSize: "11px", color: "#000000", marginBottom: "6px" }}>Бюджет {L_D_GLOSS} 2026</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
          <span style={{ fontSize: "22px", fontWeight: "600", color: "#000000" }}>{formatMln(spentM)}</span>
          <span style={{ fontSize: "11px", color: "#000000", fontWeight: "500" }}>
            / {formatMln(planM)} млн ₽
          </span>
        </div>
        <div
          style={{
            height: "4px",
            borderRadius: "4px",
            background: "rgba(129,208,245,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${usedPct}%`,
              height: "100%",
              background: "linear-gradient(90deg, #e3000b, #81d0f5)",
              borderRadius: "4px",
              boxShadow: "0 0 8px rgba(129,208,245,0.35)",
            }}
          />
        </div>
        <div style={{ fontSize: "10px", color: "#000000", marginTop: "6px" }}>
          Использовано {usedPct}% · {formatMln(remainM)} млн остаток
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "500",
            letterSpacing: "1.2px",
            color: "#000000",
            textTransform: "uppercase",
            padding: "0 14px 10px",
          }}
        >
          Система
        </div>
        {bottomItems.map((item) => (
          <BottomNavItem key={item.label} icon={item.icon} label={item.label} to={item.to} onNavigate={close} />
        ))}
      </div>

      <div
        style={{
          padding: "12px 14px 4px",
          fontSize: "10px",
          color: "#000000",
          letterSpacing: "0.5px",
        }}
      >
        ЕСО v4.2.1 · {HR_GLOSS} · 2026
      </div>
    </div>
  );
}
