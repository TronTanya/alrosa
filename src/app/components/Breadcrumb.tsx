import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Home, ChevronRight } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}

const ROUTE_MAP: Record<string, BreadcrumbItem[]> = {
  "/": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Главная" },
  ],
  "/cabinet": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Личный кабинет" },
    { label: "ИИ-Куратор" },
  ],
  "/courses": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Мои курсы" },
    { label: "ИИ-подбор" },
  ],
  "/analytics": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Аналитика" },
  ],
  "/employee/calendar": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Календарь" },
  ],
  "/idp": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Заявки на обучение" },
  ],
  "/certificates": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Сертификаты" },
  ],
  "/my-team": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Команда" },
  ],
  "/manager": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Руководитель" },
    { label: "ИИ-Наставник команды" },
  ],
  "/manager/analytics": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Руководитель", path: "/manager" },
    { label: "Аналитика" },
  ],
  "/manager/mentor": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Руководитель", path: "/manager" },
    { label: "ИИ-Наставник" },
  ],
  "/manager/courses": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Руководитель", path: "/manager" },
    { label: "Курсы и обучение" },
  ],
  "/manager/competencies": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Руководитель", path: "/manager" },
    { label: "Компетенции" },
  ],
  "/team": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Руководитель" },
    { label: "ИИ-Наставник команды" },
  ],
  "/support": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Поддержка" },
  ],
  "/settings": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Настройки" },
  ],
  "/hr": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Главная" },
  ],
  "/hr/dashboard": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Дашборд и аналитика" },
  ],
  "/hr/employees": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Сотрудники" },
  ],
  "/hr/trajectory": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Траектория развития" },
  ],
  "/hr/mentor": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "ИИ-Наставник" },
  ],
  "/hr/catalog": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Каталог курсов" },
  ],
  "/hr/applications": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Заявки на обучение" },
  ],
  "/hr/competencies": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Компетенции" },
  ],
  "/hr/events": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Мероприятия" },
  ],
  "/hr/reports": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Отчёты" },
  ],
  "/hr/certificates": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Сертификаты" },
  ],
  "/hr/support": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Поддержка" },
  ],
  "/hr/settings": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "HR / L&D", path: "/hr" },
    { label: "Настройки" },
  ],
  "/admin": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Главная" },
  ],
  "/admin/administration": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Администрирование" },
  ],
  "/admin/users": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Пользователи" },
  ],
  "/admin/courses": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Управление курсами" },
  ],
  "/admin/integrations": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Интеграции" },
  ],
  "/admin/monitoring": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Мониторинг системы" },
  ],
  "/admin/database": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "База данных" },
  ],
  "/admin/access": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Права доступа" },
  ],
  "/admin/notifications": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Уведомления" },
  ],
  "/admin/system-reports": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Системные отчёты" },
  ],
  "/admin/servers": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Серверы" },
  ],
  "/admin/ai-modules": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "ИИ-модули" },
  ],
  "/admin/documentation": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Документация" },
  ],
  "/admin/configuration": [
    { label: "Алроса ИТ", path: "/", icon: Home },
    { label: "Админ-панель", path: "/admin" },
    { label: "Конфигурация" },
  ],
};

const ACCENT_MAP: Record<string, string> = {
  "/": "#81d0f5",
  "/cabinet": "#81d0f5",
  "/courses": "#81d0f5",
  "/analytics": "#81d0f5",
  "/employee/calendar": "#81d0f5",
  "/idp": "#81d0f5",
  "/certificates": "#81d0f5",
  "/my-team": "#81d0f5",
  "/manager": "#81d0f5",
  "/manager/analytics": "#81d0f5",
  "/manager/mentor": "#81d0f5",
  "/manager/courses": "#81d0f5",
  "/manager/competencies": "#81d0f5",
  "/team": "#81d0f5",
  "/support": "#81d0f5",
  "/settings": "#81d0f5",
  "/hr": "#e3000b",
  "/hr/dashboard": "#e3000b",
  "/hr/employees": "#e3000b",
  "/hr/trajectory": "#e3000b",
  "/hr/mentor": "#e3000b",
  "/hr/catalog": "#e3000b",
  "/hr/applications": "#e3000b",
  "/hr/competencies": "#e3000b",
  "/hr/events": "#e3000b",
  "/hr/reports": "#e3000b",
  "/hr/certificates": "#e3000b",
  "/hr/support": "#e3000b",
  "/hr/settings": "#e3000b",
  "/admin": "#81d0f5",
  "/admin/administration": "#e3000b",
  "/admin/users": "#81d0f5",
  "/admin/courses": "#81d0f5",
  "/admin/integrations": "#81d0f5",
  "/admin/monitoring": "#81d0f5",
  "/admin/database": "#81d0f5",
  "/admin/access": "#81d0f5",
  "/admin/notifications": "#81d0f5",
  "/admin/system-reports": "#81d0f5",
  "/admin/servers": "#81d0f5",
  "/admin/ai-modules": "#81d0f5",
  "/admin/documentation": "#81d0f5",
  "/admin/configuration": "#81d0f5",
};

type BreadcrumbProps = { tone?: "light" | "dark" };

export function Breadcrumb({ tone = "light" }: BreadcrumbProps) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const items = ROUTE_MAP[location.pathname] ?? ROUTE_MAP["/"];
  const accent = ACCENT_MAP[location.pathname] ?? "#000000";
  const isDark = tone === "dark";
  const textLast = isDark ? "rgba(255,255,255,0.95)" : "#000000";
  const textMuted = isDark ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,.52)";
  const textHover = isDark ? "#81d0f5" : accent;
  const bgLast = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,.04)";
  const sepColor = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)";
  const iconMuted = isDark ? "rgba(255,255,255,0.45)" : brandIcon.muted;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{ display: "flex", alignItems: "center", gap: "2px" }}
    >
      {items.map((item, idx) => {
        const isLast      = idx === items.length - 1;
        const isClickable = !!item.path && !isLast;
        const isHov       = hoveredPath === item.path && isClickable;

        return (
          <React.Fragment key={idx}>
            {/* Separator */}
            {idx > 0 && (
              <ChevronRight
                size={11}
                color={sepColor}
                strokeWidth={brandIcon.swSm}
                style={{ flexShrink: 0, margin: "0 1px" }}
              />
            )}

            {/* Breadcrumb item */}
            <button
              onClick={() => isClickable && navigate(item.path!)}
              onMouseEnter={() => isClickable && setHoveredPath(item.path!)}
              onMouseLeave={() => setHoveredPath(null)}
              disabled={!isClickable}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 7px",
                borderRadius: "7px",
                border: "none",
                background: isHov
                  ? `${accent}18`
                  : isLast
                  ? bgLast
                  : "transparent",
                color: isLast
                  ? textLast
                  : isHov
                  ? textHover
                  : textMuted,
                fontSize: "12px",
                fontWeight: isLast ? "700" : "500",
                cursor: isClickable ? "pointer" : "default",
                fontFamily: "var(--font-sans)",
                transition: "all .18s ease",
                whiteSpace: "nowrap",
                outline: "none",
                letterSpacing: isLast ? "-0.1px" : "0",
              }}
            >
              {item.icon && idx === 0 && (
                <item.icon
                  size={11}
                  color={isHov ? accent : iconMuted}
                  strokeWidth={brandIcon.swSm}
                  style={{ transition: "color .18s" }}
                />
              )}
              {item.label}
            </button>
          </React.Fragment>
        );
      })}

      {/* Live pulse dot at the end */}
      <div
        style={{
          marginLeft: "4px",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: accent,
          boxShadow: `0 0 5px ${accent}CC`,
          animation: "dot-pulse 1.6s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
    </nav>
  );
}
