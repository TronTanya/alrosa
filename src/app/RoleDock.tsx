import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { User, Users, Shield, Briefcase, ChevronUp, Sparkles } from "lucide-react";
import { ROUTE_PATHS } from "./routePaths";
import { HR_LD_SECTION_LABEL, L_D_DIRECTOR_TITLE } from "./lib/hrLdLabels";
import type { BrandLucideIcon } from "./lib/brandIcons";

interface RoleItem {
  path: string;
  icon: BrandLucideIcon;
  label: string;
  sublabel: string;
  shortLabel: string;
  initials: string;
  accent: string;
  glow: string;
  gradient: string;
  avatarGrad: string;
}

const roles: RoleItem[] = [
  {
    path: ROUTE_PATHS.employee,
    icon: User,
    label: "Личный кабинет",
    sublabel: "Александр Иванов · Сотрудник",
    shortLabel: "ЛК",
    initials: "АИ",
    accent: "#81d0f5",
    glow: "rgba(129,208,245,.35)",
    gradient: "linear-gradient(135deg,#e3000b,#81d0f5)",
    avatarGrad: "linear-gradient(135deg,#e3000b,#81d0f5)",
  },
  {
    path: ROUTE_PATHS.manager,
    icon: Briefcase,
    label: "Руководитель",
    sublabel: "Максим Лебедев · Руководитель направления",
    shortLabel: "Рук.",
    initials: "МЛ",
    accent: "#81d0f5",
    glow: "rgba(129,208,245,.35)",
    gradient: "linear-gradient(135deg,#e3000b,#81d0f5)",
    avatarGrad: "linear-gradient(135deg,#e3000b,#81d0f5)",
  },
  {
    path: ROUTE_PATHS.hr,
    icon: Users,
    label: `Дашборд — ${HR_LD_SECTION_LABEL}`,
    sublabel: `Анна Смирнова · ${L_D_DIRECTOR_TITLE}`,
    shortLabel: "HR",
    initials: "АС",
    accent: "#e3000b",
    glow: "rgba(227,0,11,.35)",
    gradient: "linear-gradient(135deg,#e3000b,#81d0f5)",
    avatarGrad: "linear-gradient(135deg,#e3000b,#81d0f5)",
  },
  {
    path: ROUTE_PATHS.admin,
    icon: Shield,
    label: "Администрирование",
    sublabel: "Дмитрий Соколов · Системный администратор",
    shortLabel: "Адм.",
    initials: "ДС",
    accent: "#81d0f5",
    glow: "rgba(129,208,245,.4)",
    gradient: "linear-gradient(135deg,#81d0f5,#e3000b)",
    avatarGrad: "linear-gradient(135deg,#81d0f5,#e3000b)",
  },
];

/** ЛК сотрудника включает /my-team («Команда»). Руководитель — /manager; /team редиректит. */
function isRoleActive(rolePath: string, pathname: string): boolean {
  if (rolePath === ROUTE_PATHS.employee) {
    return [
      ROUTE_PATHS.employee,
      "/cabinet",
      "/courses",
      "/analytics",
      ROUTE_PATHS.employeeCalendar,
      "/calendar",
      "/idp",
      "/certificates",
      ROUTE_PATHS.employeeTeam,
      "/support",
      "/settings",
    ].includes(pathname);
  }
  if (rolePath === ROUTE_PATHS.manager) {
    return (
      pathname === ROUTE_PATHS.manager ||
      pathname === ROUTE_PATHS.teamLegacy ||
      pathname.startsWith(`${ROUTE_PATHS.manager}/`)
    );
  }
  return rolePath === pathname;
}

export function RoleDock() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const active =
    roles.find((r) => isRoleActive(r.path, location.pathname)) ?? roles[0];

  return (
    <>
      {/* Backdrop when expanded */}
      {expanded && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,.2)", backdropFilter: "blur(2px)" }}
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Dock container */}
      <div
        className="role-dock-shell"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        {/* Expanded role cards */}
        {expanded && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              pointerEvents: "all",
              animation: "fade-slide-up .2s ease-out both",
            }}
          >
            {roles.map((role) => {
              const isActive = isRoleActive(role.path, location.pathname);
              const isHov = hovered === role.path;
              return (
                <button
                  key={role.path}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(role.path, { replace: false });
                    setExpanded(false);
                  }}
                  onMouseEnter={() => setHovered(role.path)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 16px 10px 12px",
                    borderRadius: "16px",
                    background: isActive
                      ? `linear-gradient(135deg, rgba(${hexToRgb(role.accent)}, .14), rgba(${hexToRgb(role.accent)}, .06))`
                      : isHov
                        ? "rgba(0,0,0,.04)"
                        : "#ffffff",
                    border: `1px solid ${isActive ? `${role.accent}44` : isHov ? "rgba(0,0,0,.12)" : "rgba(0,0,0,.1)"}`,
                    backdropFilter: "blur(24px)",
                    boxShadow: isActive
                      ? `0 8px 32px rgba(0,0,0,.1), 0 0 20px ${role.glow}`
                      : isHov
                        ? "0 8px 24px rgba(0,0,0,.08)"
                        : "0 4px 16px rgba(0,0,0,.06)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "all .18s ease",
                    minWidth: "280px",
                    textAlign: "left",
                  }}
                >
                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: role.avatarGrad,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "600", color: "#000000",
                      boxShadow: isActive ? `0 0 12px ${role.glow}` : "none",
                      transition: "box-shadow .18s",
                    }}>
                      {role.initials}
                    </div>
                    {isActive && (
                      <div style={{
                        position: "absolute", bottom: 0, right: 0,
                        width: "10px", height: "10px", borderRadius: "50%",
                        background: role.accent, border: "2px solid #ffffff",
                        boxShadow: `0 0 6px ${role.glow}`,
                      }} />
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: isActive ? "700" : "600", color: isActive ? "#000000" : "#000000", lineHeight: 1.2 }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "#000000", marginTop: "1px" }}>
                      {role.sublabel}
                    </div>
                  </div>

                  {/* Icon */}
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "8px",
                    background: isActive ? `${role.accent}22` : "rgba(0,0,0,.04)",
                    border: `1px solid ${isActive ? `${role.accent}38` : "rgba(0,0,0,.1)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <role.icon size={13} style={{ color: isActive ? role.accent : "#000000" }} />
                  </div>

                  {isActive && (
                    <div style={{
                      fontSize: "10px", fontWeight: "500", padding: "2px 8px",
                      borderRadius: "20px", background: `${role.accent}22`,
                      border: `1px solid ${role.accent}38`, color: role.accent,
                      flexShrink: 0,
                    }}>
                      Текущий
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Нижняя полоса: клик по ролям — только navigate; раскрытие списка — только «Переключить роль» */}
        <div
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 16px 8px 10px",
            borderRadius: "40px",
            background: "#ffffff",
            border: `1px solid ${expanded ? `${active.accent}44` : "rgba(0,0,0,.1)"}`,
            backdropFilter: "blur(24px)",
            boxShadow: expanded
              ? `0 8px 40px rgba(0,0,0,.12), 0 0 24px ${active.glow}`
              : `0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04)`,
            transition: "all .22s ease",
            userSelect: "none",
          }}
        >
          {/* Active user avatar */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: active.avatarGrad,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px", fontWeight: "600", color: "#000000",
              boxShadow: `0 0 10px ${active.glow}`,
              transition: "box-shadow .22s",
            }}>
              {active.initials}
            </div>
            <div style={{
              position: "absolute", bottom: "-1px", right: "-1px",
              width: "8px", height: "8px", borderRadius: "50%",
              background: active.accent, border: "1.5px solid #ffffff",
              boxShadow: `0 0 5px ${active.glow}`,
            }} />
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "18px", background: "rgba(0,0,0,.1)" }} />

          {/* Role pills */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {roles.map((r) => {
              const isAct = isRoleActive(r.path, location.pathname);
              const isHov = hovered === `pill-${r.path}`;
              return (
                <button
                  key={r.path}
                  type="button"
                  aria-label={`${r.label}: ${r.sublabel}`}
                  aria-current={isAct ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(r.path, { replace: false });
                    setExpanded(false);
                  }}
                  onMouseEnter={() => setHovered(`pill-${r.path}`)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: isAct ? "4px 10px" : "4px 8px",
                    borderRadius: "20px",
                    background: isAct ? `${r.accent}1E` : isHov ? "rgba(0,0,0,.06)" : "transparent",
                    border: `1px solid ${isAct ? `${r.accent}38` : isHov ? "rgba(0,0,0,.12)" : "transparent"}`,
                    transition: "all .18s",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    margin: 0,
                    outline: "none",
                  }}
                >
                  <r.icon size={11} style={{ color: isAct ? r.accent : "#000000", flexShrink: 0 }} />
                  {isAct && (
                    <span style={{ fontSize: "11.5px", fontWeight: "500", color: r.accent, whiteSpace: "nowrap" }}>
                      {r.shortLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ width: "1px", height: "18px", background: "rgba(0,0,0,.1)" }} />

          {/* Раскрытие полного списка ролей */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded((x) => !x);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
              border: "none",
              background: "transparent",
              padding: "4px 2px",
              fontFamily: "inherit",
              borderRadius: "10px",
            }}
            aria-expanded={expanded}
            aria-label="Переключить роль"
          >
            <Sparkles size={12} style={{ color: active.accent, opacity: .85 }} />
            <span className="role-dock-label" style={{ fontSize: "11px", color: "#000000", fontWeight: "500" }}>Переключить роль</span>
            <ChevronUp
              size={13}
              style={{
                color: "#000000",
                transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform .22s ease",
              }}
            />
          </button>
        </div>
      </div>
    </>
  );
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
