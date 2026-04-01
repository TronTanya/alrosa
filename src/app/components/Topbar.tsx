import {
  Bell,
  ChevronDown,
  Settings,
  BookOpen,
  FileText,
  Calendar,
  User,
  LogOut,
  HelpCircle,
  Menu,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Breadcrumb } from "./Breadcrumb";
import { EmployeeGlobalSearch } from "./EmployeeGlobalSearch";
import { AlrosaLogo } from "./AlrosaBrand";
import { logout } from "../auth/session";
import { useMobileNav } from "../contexts/MobileNavContext";
import { brandIcon } from "../lib/brandIcons";
import { ROUTE_PATHS } from "../routePaths";

const MANAGER_PROFILE = {
  name: "Максим Лебедев",
  title: "Руководитель направления Разработка",
  initials: "МЛ",
} as const;

const EMPLOYEE_PROFILE = {
  name: "Александр Иванов",
  title: "Middle Software Engineer",
  initials: "АИ",
} as const;

type NotifItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: "course" | "idp" | "calendar";
};

const initialNotifications: NotifItem[] = [
  {
    id: "1",
    title: "Новый модуль в курсе",
    body: "Доступен блок «Kubernetes: продвинутый уровень».",
    time: "12 мин назад",
    read: false,
    icon: "course",
  },
  {
    id: "2",
    title: "Заявка на обучение",
    body: "Статус заявки «Продвинутый Kubernetes» изменён на согласование.",
    time: "1 ч назад",
    read: false,
    icon: "idp",
  },
  {
    id: "3",
    title: "Напоминание",
    body: "Завтра в 10:00 — созвон с ИИ-наставником.",
    time: "3 ч назад",
    read: false,
    icon: "calendar",
  },
];

function NotifIcon({ kind }: { kind: NotifItem["icon"] }) {
  const common = { size: 14 as const, color: brandIcon.stroke, strokeWidth: brandIcon.sw } as const;
  if (kind === "course") return <BookOpen {...common} />;
  if (kind === "idp") return <FileText {...common} color={brandIcon.accentRed} />;
  return <Calendar {...common} color={brandIcon.accentCyan} />;
}

export function Topbar() {
  const { toggle: toggleMobileNav } = useMobileNav();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>(initialNotifications);
  const notifWrapRef = useRef<HTMLDivElement>(null);
  const profileWrapRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const settingsActive = location.pathname === "/settings";
  const isManagerDashboard =
    location.pathname === ROUTE_PATHS.manager ||
    location.pathname === ROUTE_PATHS.teamLegacy ||
    location.pathname.startsWith(`${ROUTE_PATHS.manager}/`);
  const profile = isManagerDashboard ? MANAGER_PROFILE : EMPLOYEE_PROFILE;

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (notifWrapRef.current && !notifWrapRef.current.contains(t)) setNotifOpen(false);
      if (profileWrapRef.current && !profileWrapRef.current.contains(t)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-btn"
          aria-label="Открыть меню навигации"
          onClick={toggleMobileNav}
        >
          <Menu size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
        </button>
        <div className="topbar-logo-cluster">
          <AlrosaLogo className="alrosa-logo-wrap--topbar" />
          <div className="topbar-brand-sublabel">Единая среда обучения</div>
        </div>

        <div className="topbar-divider" />

        <div className="topbar-breadcrumb-wrap">
          <Breadcrumb />
        </div>
      </div>

      <div className="topbar-search-wrap">
        <EmployeeGlobalSearch />
      </div>

      <div className="topbar-trailing" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Notification bell + dropdown */}
        <div ref={notifWrapRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Уведомления"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            onClick={() => {
              setProfileOpen(false);
              setNotifOpen((o) => !o);
            }}
            style={{
              position: "relative",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: notifOpen ? "rgba(129,208,245,0.18)" : "rgba(0,0,0,0.04)",
              border: notifOpen
                ? "2px solid rgba(129,208,245,0.45)"
                : "2px solid rgba(0,0,0,0.1)",
              boxShadow: notifOpen
                ? "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.08)"
                : "inset 0 1px 0 rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: notifOpen ? "#000000" : "#000000",
            }}
            onMouseEnter={(e) => {
              if (!notifOpen) {
                e.currentTarget.style.background = "rgba(0,0,0,0.06)";
                e.currentTarget.style.color = "#000000";
              }
            }}
            onMouseLeave={(e) => {
              if (!notifOpen) {
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                e.currentTarget.style.color = "#000000";
              }
            }}
          >
            <Bell size={17} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            {unreadCount > 0 && (
              <div
                className="notif-badge"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.45)",
                  minWidth: "17px",
                  height: "17px",
                  fontSize: "10px",
                  top: "-3px",
                  right: "-3px",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </button>

          {notifOpen && (
            <div
              role="menu"
              aria-label="Список уведомлений"
                style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: "min(360px, calc(100vw - 32px))",
                maxHeight: "420px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
                zIndex: 500,
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "800", color: "#000000" }}>Уведомления</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={markAllRead}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#e3000b",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Прочитать все
                  </button>
                )}
              </div>
              <div className="custom-scroll" style={{ overflowY: "auto", flex: 1 }}>
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      markRead(n.id);
                      if (n.icon === "idp") navigate("/idp");
                      else if (n.icon === "course") navigate("/courses");
                      else navigate(ROUTE_PATHS.employeeCalendar);
                      setNotifOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 16px",
                      border: "none",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      background: n.read ? "transparent" : "rgba(129,208,245,0.1)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "9px",
                        background: "rgba(227,0,11,0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <NotifIcon kind={n.icon} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", lineHeight: 1.35 }}>{n.title}</div>
                      <div style={{ fontSize: "12px", color: "#000000", marginTop: "4px", lineHeight: 1.45 }}>
                        {n.body}
                      </div>
                      <div style={{ fontSize: "10px", color: "#000000", marginTop: "6px" }}>{n.time}</div>
                    </div>
                    {!n.read && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#81d0f5",
                          flexShrink: 0,
                          marginTop: "6px",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          type="button"
          aria-label="Настройки"
          aria-current={settingsActive ? "page" : undefined}
          onClick={() => navigate("/settings")}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: settingsActive ? "rgba(129,208,245,0.22)" : "rgba(0,0,0,0.04)",
            border: settingsActive
              ? "1px solid rgba(129,208,245,0.5)"
              : "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: settingsActive ? "#000000" : "#000000",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!settingsActive) {
              e.currentTarget.style.background = "rgba(0,0,0,0.06)";
              e.currentTarget.style.color = "#000000";
            }
          }}
          onMouseLeave={(e) => {
            if (!settingsActive) {
              e.currentTarget.style.background = "rgba(0,0,0,0.04)";
              e.currentTarget.style.color = "#000000";
            }
          }}
        >
          <Settings size={15} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "28px", background: "rgba(0,0,0,0.1)" }} />

        {/* User profile + menu */}
        <div ref={profileWrapRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Меню профиля"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            onClick={() => {
              setNotifOpen(false);
              setProfileOpen((o) => !o);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              padding: "6px 10px 6px 6px",
              borderRadius: "12px",
              transition: "background 0.2s, box-shadow 0.2s",
              border: profileOpen ? "1px solid rgba(0,0,0,0.1)" : "1px solid transparent",
              background: profileOpen ? "rgba(0,0,0,0.04)" : "transparent",
              boxShadow: profileOpen ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
              fontFamily: "inherit",
              color: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!profileOpen) (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.04)";
            }}
            onMouseLeave={(e) => {
              if (!profileOpen) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e3000b, rgba(227,0,11,0.78))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#ffffff",
                  boxShadow: "0 0 12px rgba(227,0,11,0.35)",
                }}
              >
                {profile.initials}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: "#81d0f5",
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 6px rgba(129,208,245,0.65)",
                }}
              />
            </div>
            <div className="topbar-profile-text" style={{ textAlign: "left" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#000000", lineHeight: 1.2 }}>
                {profile.name}
              </div>
              <div style={{ fontSize: "11px", color: "#000000", lineHeight: 1.2 }}>
                {profile.title}
              </div>
            </div>
            <ChevronDown
              size={14}
              color={brandIcon.muted}
              strokeWidth={brandIcon.swSm}
              style={{
                marginLeft: "2px",
                transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              aria-label="Действия профиля"
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                minWidth: "240px",
                borderRadius: "14px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
                zIndex: 500,
                overflow: "hidden",
                backdropFilter: "blur(20px)",
              }}
            >
              {(
                [
                  { icon: User, label: "Мой профиль", path: "/" },
                  { icon: Settings, label: "Настройки", path: "/settings" },
                  { icon: HelpCircle, label: "Поддержка", path: "/support" },
                ] as const
              ).map(({ icon: ItemIcon, label, path }) => (
                <button
                  key={path}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate(path);
                    setProfileOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    border: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#000000",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <ItemIcon size={16} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} style={{ flexShrink: 0 }} />
                  {label}
                </button>
              ))}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                  navigate("/login", { replace: true });
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#e3000b",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(227,0,11,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <LogOut size={16} color={brandIcon.accentRed} strokeWidth={brandIcon.swSm} style={{ flexShrink: 0 }} />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}