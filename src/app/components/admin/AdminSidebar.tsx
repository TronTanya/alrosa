import React from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Shield,
  Users,
  Server,
  BookOpen,
  GitBranch,
  Bell,
  Lock,
  FileBarChart,
  ChevronRight,
  Cpu,
  HelpCircle,
  Settings,
  Activity,
  Database,
} from "lucide-react";
import { brandIcon } from "../../lib/brandIcons";

function notifySoon(label: string) {
  const el = document.createElement("div");
  el.textContent = `Раздел «${label}» скоро будет доступен.`;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "80px",
    right: "24px",
    zIndex: "9999",
    background: "rgba(0,0,0,0.97)",
    border: "1px solid rgba(129,208,245,0.35)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "13px",
    fontFamily: "var(--font-sans)",
    fontWeight: "600",
    maxWidth: "340px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2400);
}

type NavDef = {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  to?: string;
  end?: boolean;
  badge?: string | null;
};

const navItems: NavDef[] = [
  { icon: LayoutDashboard, label: "Главная", to: "/admin", end: true },
  { icon: Shield, label: "Администрирование", to: "/admin/administration", badge: "!" },
  { icon: Users, label: "Пользователи", to: "/admin/users", badge: "312" },
  { icon: BookOpen, label: "Управление курсами", to: "/admin/courses", badge: "87" },
  { icon: GitBranch, label: "Интеграции", to: "/admin/integrations", badge: "2" },
  { icon: Activity, label: "Мониторинг системы", to: "/admin/monitoring", badge: null },
  { icon: Database, label: "База данных", to: "/admin/database", badge: null },
  { icon: Lock, label: "Права доступа", to: "/admin/access", badge: "4" },
  { icon: Bell, label: "Уведомления", to: "/admin/notifications", badge: "3" },
  { icon: FileBarChart, label: "Системные отчёты", to: "/admin/system-reports", badge: null },
  { icon: Server, label: "Серверы", to: "/admin/servers", badge: null },
  { icon: Cpu, label: "ИИ-Модули", to: "/admin/ai-modules", badge: null },
];

const bottomItems: NavDef[] = [
  { icon: HelpCircle, label: "Документация", to: "/admin/documentation" },
  { icon: Settings, label: "Конфигурация", to: "/admin/configuration" },
];

function AdminNavRow({
  icon: Icon,
  label,
  badge,
  isActive,
}: {
  icon: NavDef["icon"];
  label: string;
  badge?: string | null;
  isActive: boolean;
}) {
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
            fontWeight: "700",
            color: "#000000",
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
            boxShadow: "0 0 6px rgba(227,0,11,0.55)",
          }}
        />
      )}
      {isActive && <ChevronRight size={12} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />}
    </>
  );
}

function AdminNavItem({ item }: { item: NavDef }) {
  if (item.to) {
    return (
      <NavLink
        to={item.to}
        end={item.end}
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        style={{ textDecoration: "none" }}
      >
        {({ isActive }) => <AdminNavRow {...item} isActive={isActive} />}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      className="nav-item"
      onClick={() => notifySoon(item.label)}
      style={{
        width: "100%",
        border: "none",
        background: "transparent",
        font: "inherit",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <AdminNavRow {...item} isActive={false} />
    </button>
  );
}

export function AdminSidebar() {
  return (
    <div className="sidebar admin-sidebar custom-scroll">
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
        Управление
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => (
          <AdminNavItem key={item.label} item={item} />
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
          background: "linear-gradient(135deg, rgba(227,0,11,0.12), rgba(129,208,245,0.08))",
          border: "1px solid rgba(129,208,245,0.22)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#000000",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Здоровье системы</span>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#81d0f5",
              boxShadow: "0 0 6px rgba(129,208,245,0.9)",
              display: "inline-block",
            }}
          />
        </div>
        {[
          { label: "API Gateway", val: 98, color: "#e3000b" },
          { label: "База данных", val: 94, color: "#81d0f5" },
          { label: "GigaChat AI", val: 100, color: "#e3000b" },
        ].map((s) => (
          <div key={s.label} style={{ marginBottom: "7px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.55)" }}>{s.label}</span>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#000000" }}>{s.val}%</span>
            </div>
            <div style={{ height: "3px", borderRadius: "3px", background: "rgba(129,208,245,0.12)" }}>
              <div
                style={{
                  width: `${s.val}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${s.color}, rgba(129,208,245,0.9))`,
                  borderRadius: "3px",
                  boxShadow: `0 0 5px ${s.color}66`,
                }}
              />
            </div>
          </div>
        ))}
        <div style={{ marginTop: "6px", fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>
          Нагрузка CPU: 12% · RAM: 38%
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
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
          <AdminNavItem key={item.label} item={item} />
        ))}
      </div>
      <div style={{ padding: "12px 14px 4px", fontSize: "10px", color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px" }}>
        ЕСО v4.2.1 · Admin Panel · Алроса ИТ · 2026
      </div>
    </div>
  );
}
