import React from "react";
import { Link, NavLink } from "react-router";
import {
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  BookOpen,
  FileText,
  Award,
  Settings,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useMobileNav } from "../../contexts/MobileNavContext";
import { brandIcon } from "../../lib/brandIcons";
import { ROUTE_PATHS } from "../../routePaths";
import { MANAGER_TEAM_SIZE, managerTeamInActiveLearning } from "../../data/managerTeamCatalog";

type NavEntry =
  | { kind: "navlink"; icon: LucideIcon; label: string; badge: string | null; to: string; end?: boolean }
  | { kind: "link"; icon: LucideIcon; label: string; badge: string | null; to: string };

const navItems: NavEntry[] = [
  { kind: "navlink", icon: LayoutDashboard, label: "Главная", badge: String(MANAGER_TEAM_SIZE), to: ROUTE_PATHS.manager, end: true },
  { kind: "navlink", icon: BarChart3, label: "Аналитика", badge: null, to: ROUTE_PATHS.managerAnalytics, end: true },
  { kind: "navlink", icon: BrainCircuit, label: "ИИ-Наставник", badge: null, to: ROUTE_PATHS.managerMentor, end: true },
  { kind: "navlink", icon: BookOpen, label: "Курсы и обучение", badge: String(managerTeamInActiveLearning()), to: ROUTE_PATHS.managerCourses, end: true },
  { kind: "navlink", icon: TrendingUp, label: "Компетенции", badge: null, to: ROUTE_PATHS.managerCompetencies, end: true },
  { kind: "navlink", icon: FileText, label: "Отчёты", badge: null, to: ROUTE_PATHS.managerReports, end: true },
  { kind: "navlink", icon: Award, label: "Достижения", badge: null, to: ROUTE_PATHS.managerAchievements, end: true },
];

const bottomItems = [
  { icon: HelpCircle, label: "Поддержка", to: "/support" },
  { icon: Settings, label: "Настройки", to: "/settings" },
] as const;

function rowInner(
  isActive: boolean,
  Icon: LucideIcon,
  label: string,
  badge: string | null,
) {
  return (
    <>
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "10px",
          background: isActive
            ? "linear-gradient(135deg, rgba(227,0,11,0.12), rgba(129,208,245,0.18))"
            : "rgba(0,0,0,0.04)",
          border: isActive ? "1px solid rgba(129,208,245,0.45)" : "1px solid transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: isActive ? "0 2px 12px rgba(227,0,11,0.12)" : "none",
          transition: "all 0.2s",
        }}
      >
        <Icon size={15} color={isActive ? brandIcon.stroke : brandIcon.muted} strokeWidth={brandIcon.sw} />
      </div>
      <span style={{ flex: 1, fontSize: "13.5px", color: "#000000" }}>{label}</span>
      {badge && (
        <div
          style={{
            minWidth: "18px",
            height: "18px",
            borderRadius: "9px",
            background: isActive ? "linear-gradient(135deg, #e3000b, #81d0f5)" : "rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: "500",
            color: isActive ? "#ffffff" : "rgba(0,0,0,0.55)",
            padding: "0 5px",
          }}
        >
          {badge}
        </div>
      )}
      {isActive && <ChevronRight size={12} color={brandIcon.accentRed} strokeWidth={brandIcon.swSm} />}
    </>
  );
}

function NavRow({ entry, onNavigate }: { entry: NavEntry; onNavigate?: () => void }) {
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
    <Link to={to} className="nav-item" style={{ textDecoration: "none" }} onClick={() => onNavigate?.()}>
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

export function ManagerSidebar() {
  const { open, setOpen } = useMobileNav();
  const close = () => setOpen(false);

  return (
    <div className={`sidebar employee-sidebar manager-sidebar custom-scroll${open ? " sidebar--open" : ""}`}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: "500",
          letterSpacing: "1.2px",
          color: "rgba(0,0,0,0.45)",
          textTransform: "uppercase",
          padding: "0 14px 10px",
        }}
      >
        Навигация руководителя
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => (
          <NavRow key={item.label} entry={item} onNavigate={close} />
        ))}
      </div>

      <div style={{ height: "1px", background: "rgba(0,0,0,0.08)", margin: "16px 4px" }} />

      <div
        style={{
          margin: "0 4px 16px",
          padding: "16px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(129,208,245,0.14))",
          border: "1px solid rgba(129,208,245,0.4)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", marginBottom: "6px" }}>Прогресс команды</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "24px", fontWeight: "600", color: "#000000", letterSpacing: "-0.5px" }}>76%</span>
          <span style={{ fontSize: "11px", color: brandIcon.accentCyan, fontWeight: "500" }}>↑ +4% / мес.</span>
        </div>
        <div style={{ height: "4px", borderRadius: "4px", background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div
            style={{
              width: "76%",
              height: "100%",
              background: "linear-gradient(90deg, #e3000b, #81d0f5)",
              borderRadius: "4px",
              boxShadow: "0 0 12px rgba(129,208,245,0.45)",
            }}
          />
        </div>
        <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)", marginTop: "8px" }}>
          {MANAGER_TEAM_SIZE} из {MANAGER_TEAM_SIZE} сотрудников активны
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "500",
            letterSpacing: "1.2px",
            color: "rgba(0,0,0,0.45)",
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
      <div style={{ padding: "12px 14px 4px", fontSize: "10px", color: "rgba(0,0,0,0.38)", letterSpacing: "0.3px" }}>
        ЕСО v4.2.1 · Руководитель · 2026
      </div>
    </div>
  );
}
