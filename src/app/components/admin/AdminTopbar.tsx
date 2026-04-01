import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  UserPlus,
  Database,
  RefreshCw,
  Shield,
  AlertTriangle,
  Server,
  Cpu,
  BookOpen,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Breadcrumb } from "../Breadcrumb";
import { AlrosaLogo } from "../AlrosaBrand";
import { brandIcon, type BrandLucideIcon } from "../../lib/brandIcons";
import { showAdminToast } from "../../lib/adminToast";
import {
  hydrateNotificationReads,
  loadNotificationReads,
  setAllRead,
  setOneRead,
  SITE_NOTIF_READS_ADMIN,
  SITE_NOTIFICATIONS_CHANGED,
} from "../../lib/siteNotificationsStorage";

interface AdminTopbarProps {
  /** Доп. действие при переходе к пользователям (например демо-тост) */
  onAddUser?: () => void;
}

const quickActions: {
  icon: BrandLucideIcon;
  label: string;
  variant: "neutral" | "accent";
  action: "users" | "database" | "servers" | "sync";
}[] = [
  { icon: UserPlus, label: "Пользователи", variant: "neutral", action: "users" },
  { icon: Database, label: "База данных", variant: "accent", action: "database" },
  { icon: Server, label: "Серверы", variant: "neutral", action: "servers" },
  { icon: RefreshCw, label: "Синхронизация справочников", variant: "accent", action: "sync" },
];

type AdminNotifIcon = "alert" | "shield" | "server";

type AdminNotifItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: AdminNotifIcon;
  to: string;
};

const ADMIN_TOPBAR_NOTIFICATIONS_INITIAL: AdminNotifItem[] = [
  {
    id: "1",
    title: "SSL-сертификат истекает",
    body: "Осталось 2 дня до окончания действия для api.eso.company.ru — продлите в центре сертификатов.",
    time: "12 мин назад",
    read: false,
    icon: "alert",
    to: "/admin",
  },
  {
    id: "2",
    title: "Политика паролей",
    body: "14 учётных записей не меняли пароль более 90 дней — требуется рассылка или принудительная смена.",
    time: "40 мин назад",
    read: false,
    icon: "shield",
    to: "/admin/users",
  },
  {
    id: "3",
    title: "Резервное копирование",
    body: "Ночной бэкап завершён успешно (2.4 GB).",
    time: "Сегодня, 03:12",
    read: true,
    icon: "server",
    to: "/admin",
  },
];

function buildAdminNotifications(): AdminNotifItem[] {
  const reads = loadNotificationReads(SITE_NOTIF_READS_ADMIN);
  return hydrateNotificationReads(ADMIN_TOPBAR_NOTIFICATIONS_INITIAL, reads);
}

function AdminNotifGlyph({ kind }: { kind: AdminNotifIcon }) {
  const c = { size: 14 as const, strokeWidth: brandIcon.sw };
  if (kind === "alert") return <AlertTriangle {...c} color={brandIcon.accentRed} />;
  if (kind === "shield") return <Shield {...c} color={brandIcon.stroke} />;
  return <Server {...c} color={brandIcon.accentCyan} />;
}

export function AdminTopbar({ onAddUser }: AdminTopbarProps) {
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => buildAdminNotifications());
  const notifWrapRef = useRef<HTMLDivElement>(null);
  const profileWrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const adminGearActive = location.pathname === "/admin/administration";

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (notifWrapRef.current && !notifWrapRef.current.contains(t)) setNotifOpen(false);
      if (profileWrapRef.current && !profileWrapRef.current.contains(t)) setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  useEffect(() => {
    const sync = () => setNotifications(buildAdminNotifications());
    sync();
    window.addEventListener(SITE_NOTIFICATIONS_CHANGED, sync);
    return () => window.removeEventListener(SITE_NOTIFICATIONS_CHANGED, sync);
  }, []);

  const markRead = (id: string) => {
    setOneRead(SITE_NOTIF_READS_ADMIN, id, true);
    setNotifications(buildAdminNotifications());
  };

  const markAllRead = () => {
    setAllRead(
      SITE_NOTIF_READS_ADMIN,
      ADMIN_TOPBAR_NOTIFICATIONS_INITIAL.map((n) => n.id),
    );
    setNotifications(buildAdminNotifications());
  };

  const runQuickAction = (action: (typeof quickActions)[number]["action"]) => {
    switch (action) {
      case "users":
        navigate("/admin/users");
        onAddUser?.();
        break;
      case "database":
        navigate("/admin/database");
        break;
      case "servers":
        navigate("/admin/servers");
        break;
      case "sync":
        showAdminToast(
          "Демо: в продукте здесь пойдёт синхронизация с AD; сейчас действие не выполняется.",
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="topbar" style={{ gap: "14px", zIndex: 200 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <div className="topbar-logo-cluster">
          <AlrosaLogo className="alrosa-logo-wrap--topbar" />
          <div className="topbar-brand-sublabel">Единая среда обучения</div>
        </div>
        <div style={{ width: "1px", height: "28px", background: "rgba(129,208,245,.08)", margin: "0 4px" }} />
        <Breadcrumb />
      </div>

      {/* Search */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", flex: "0 0 300px" }}>
        <Search size={13} style={{ position: "absolute", left: "11px", color: "#000000", pointerEvents: "none", zIndex: 1 }} />
        <input
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск пользователей, модулей, логов..."
          style={{ width: "100%" }}
        />
        <div style={{ position: "absolute", right: "10px", fontSize: "10px", color: "#000000", background: "rgba(129,208,245,.05)", border: "1px solid rgba(129,208,245,.07)", borderRadius: "4px", padding: "2px 5px" }}>⌘K</div>
      </div>

      {/* Quick actions — иконки в ряд: нейтраль / акцент / нейтраль / акцент */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
        {quickActions.map(({ icon: Icon, label, variant, action }) => {
          const isAccent = variant === "accent";
          const bg = isAccent ? "rgba(227,0,11,0.07)" : "rgba(0,0,0,0.04)";
          const border = isAccent ? "1px solid rgba(227,0,11,0.28)" : "1px solid rgba(0,0,0,0.12)";
          const iconColor = isAccent ? "#e3000b" : "#000000";
          const hoverBg = isAccent ? "rgba(227,0,11,0.12)" : "rgba(0,0,0,0.07)";
          return (
            <button
              key={action}
              type="button"
              onClick={() => runQuickAction(action)}
              title={label}
              aria-label={label}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: bg,
                border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background .15s, box-shadow .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = hoverBg;
                e.currentTarget.style.boxShadow = isAccent ? "0 0 0 1px rgba(227,0,11,0.15)" : "0 0 0 1px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = bg;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Icon size={18} color={iconColor} strokeWidth={brandIcon.sw} />
            </button>
          );
        })}

        <div style={{ width: "1px", height: "24px", background: "rgba(129,208,245,.07)", margin: "0 2px" }} />

        {/* Уведомления + настройки: светло-голубые квадратные кнопки, бейдж на колокольчике */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div ref={notifWrapRef} style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="Уведомления"
              aria-expanded={notifOpen}
              aria-haspopup="true"
              onClick={() => {
                setNotifOpen((o) => !o);
                setProfileMenuOpen(false);
              }}
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: notifOpen ? "rgba(129,208,245,0.22)" : "rgba(129,208,245,0.14)",
                border: notifOpen ? "1px solid rgba(129,208,245,0.45)" : "1px solid rgba(129,208,245,0.32)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#000000",
                transition: "background .15s, border-color .15s",
              }}
            >
              <Bell size={18} color="#000000" strokeWidth={2} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    minWidth: "18px",
                    height: "18px",
                    padding: "0 4px",
                    borderRadius: "50%",
                    background: "#e3000b",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #ffffff",
                    boxSizing: "border-box",
                    lineHeight: 1,
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

          {notifOpen && (
            <div
              role="menu"
              aria-label="Список уведомлений"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "min(360px, calc(100vw - 32px))",
                maxHeight: "420px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
                zIndex: 500,
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
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#000000" }}>Уведомления</span>
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
                      fontWeight: 500,
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
                      navigate(n.to);
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
                        background: "rgba(227,0,11,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <AdminNotifGlyph kind={n.icon} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#000000", lineHeight: 1.35 }}>{n.title}</div>
                      <div style={{ fontSize: "12px", color: "#000000", marginTop: "4px", lineHeight: 1.45 }}>{n.body}</div>
                      <div style={{ fontSize: "10px", color: "#000000", marginTop: "6px", opacity: 0.75 }}>{n.time}</div>
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

          <button
            type="button"
            aria-label="Администрирование"
            aria-current={adminGearActive ? "page" : undefined}
            onClick={() => navigate("/admin/administration")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: adminGearActive ? "rgba(129,208,245,0.22)" : "rgba(129,208,245,0.14)",
              border: adminGearActive ? "1px solid rgba(129,208,245,0.45)" : "1px solid rgba(129,208,245,0.32)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#000000",
              transition: "background .15s, border-color .15s",
            }}
          >
            <Settings size={18} color="#000000" strokeWidth={2} />
          </button>
        </div>

        <div style={{ width: "1px", height: "24px", background: "rgba(129,208,245,.07)", margin: "0 2px" }} />

        {/* Avatar — Dmitry Sokolov + быстрые разделы */}
        <div ref={profileWrapRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            aria-label="Меню профиля и быстрые разделы"
            onClick={() => {
              setProfileMenuOpen((o) => !o);
              setNotifOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "11px",
              border: "none",
              background: profileMenuOpen ? "rgba(129,208,245,0.12)" : "transparent",
              fontFamily: "inherit",
              transition: "background .15s",
            }}
          >
            <div style={{ position: "relative" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#e3000b,#81d0f5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "500", color: "#000000", boxShadow: "0 0 12px rgba(227,0,11,.35)" }}>ДС</div>
              <div style={{ position: "absolute", bottom: "0", right: "0", width: "9px", height: "9px", borderRadius: "50%", background: "#81d0f5", border: "2px solid #000000", boxShadow: "0 0 6px rgba(129,208,245,.5)" }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12.5px", fontWeight: "500", color: "#000000", lineHeight: 1.2 }}>Дмитрий Соколов</div>
              <div style={{ fontSize: "10.5px", color: "#000000", lineHeight: 1.2 }}>Системный администратор</div>
            </div>
            <ChevronDown
              size={13}
              style={{
                color: "#000000",
                flexShrink: 0,
                transition: "transform .2s ease",
                transform: profileMenuOpen ? "rotate(180deg)" : "none",
              }}
            />
          </button>

          {profileMenuOpen && (
            <div
              role="menu"
              aria-label="Быстрые разделы"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: "220px",
                borderRadius: "16px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
                zIndex: 500,
                overflow: "hidden",
              }}
            >
              {[
                { label: "ИИ-модули", to: "/admin/ai-modules", Icon: Cpu },
                { label: "Документация", to: "/admin/documentation", Icon: BookOpen },
                { label: "Конфигурация", to: "/admin/configuration", Icon: Settings },
              ].map(({ label, to, Icon }, i, arr) => (
                <button
                  key={to}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate(to);
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px",
                    border: "none",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#000000",
                    textAlign: "left",
                  }}
                >
                  <Icon size={16} color="#000000" strokeWidth={2} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}