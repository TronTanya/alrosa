import React from "react";
import { NavLink } from "react-router";
import { useMobileNav } from "../contexts/MobileNavContext";
import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  BarChart3,
  Users,
  Calendar,
  FileText,
  Award,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { ROUTE_PATHS } from "../routePaths";

const navItems = [
  { icon: LayoutDashboard, label: "Главная", badge: null, to: "/" },
  { icon: BookOpen, label: "Мои курсы", badge: "12", to: "/courses" },
  { icon: BrainCircuit, label: "ИИ-Наставник", badge: null, to: "/cabinet" },
  { icon: BarChart3, label: "Аналитика", badge: null, to: "/analytics" },
  { icon: Calendar, label: "Календарь", badge: "2", to: ROUTE_PATHS.employeeCalendar },
  { icon: FileText, label: "Заявки на обучение", badge: "1", to: "/idp" },
  { icon: Award, label: "Сертификаты", badge: null, to: "/certificates" },
  { icon: Users, label: "Команда", badge: null, to: "/my-team" },
] as const;

const bottomItems = [
  { icon: HelpCircle, label: "Поддержка", to: "/support" },
  { icon: Settings, label: "Настройки", to: "/settings" },
] as const;

function NavItem({
  icon: Icon,
  label,
  badge,
  active,
  to,
  onNavigate,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  badge?: string | null;
  active?: boolean;
  to?: string;
  onNavigate?: () => void;
}) {
  const inner = (isActive: boolean) => (
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
        <Icon
          size={15}
          color={isActive ? brandIcon.stroke : brandIcon.muted}
          strokeWidth={brandIcon.sw}
        />
      </div>
      <span style={{ flex: 1, fontSize: "13.5px" }}>{label}</span>
      {badge && (
        <div
          style={{
            minWidth: "18px",
            height: "18px",
            borderRadius: "9px",
            background: isActive
              ? "linear-gradient(135deg, #e3000b, #81d0f5)"
              : "rgba(129,208,245,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: "700",
            color: isActive ? "#000000" : "#000000",
            padding: "0 5px",
          }}
        >
          {badge}
        </div>
      )}
      {isActive && <ChevronRight size={12} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />}
    </>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        style={{ textDecoration: "none" }}
        onClick={() => onNavigate?.()}
      >
        {({ isActive }) => inner(isActive)}
      </NavLink>
    );
  }

  return <div className={`nav-item ${active ? "active" : ""}`}>{inner(!!active)}</div>;
}

export function Sidebar() {
  const { open, setOpen } = useMobileNav();
  const close = () => setOpen(false);

  return (
    <div className={`sidebar employee-sidebar custom-scroll${open ? " sidebar--open" : ""}`}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: "600",
          letterSpacing: "1.2px",
          color: "#000000",
          textTransform: "uppercase",
          padding: "0 14px 10px",
        }}
      >
        Навигация
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} onNavigate={close} />
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
        <div style={{ fontSize: "11px", color: "#000000", marginBottom: "6px" }}>
          Прогресс обучения
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "22px", fontWeight: "800", color: "#000000" }}>42%</span>
          <span style={{ fontSize: "11px", color: "#000000", fontWeight: "600" }}>↑ +8% / мес.</span>
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
              width: "42%",
              height: "100%",
              background: "linear-gradient(90deg, #e3000b, #81d0f5)",
              borderRadius: "4px",
              boxShadow: "0 0 8px rgba(129,208,245,0.35)",
            }}
          />
        </div>
        <div style={{ fontSize: "10px", color: "#000000", marginTop: "6px" }}>
          5 из 12 курсов завершено
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "600",
            letterSpacing: "1.2px",
            color: "#000000",
            textTransform: "uppercase",
            padding: "0 14px 10px",
          }}
        >
          Система
        </div>
        {bottomItems.map((item) => (
          <NavItem key={item.label} {...item} onNavigate={close} />
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
        ЕСО v4.2.1 · 2026
      </div>
    </div>
  );
}
