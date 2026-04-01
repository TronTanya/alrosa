import React, { useEffect, useRef, useState } from "react";
import { Bell, Search, ChevronDown, Settings, Menu, Users, FileText, Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Breadcrumb } from "../Breadcrumb";
import { AlrosaLogo } from "../AlrosaBrand";
import { useMobileNav } from "../../contexts/MobileNavContext";
import { brandIcon } from "../../lib/brandIcons";
import {
  hydrateNotificationReads,
  loadNotificationReads,
  setAllRead,
  setOneRead,
  SITE_NOTIF_READS_MANAGER,
  SITE_NOTIFICATIONS_CHANGED,
} from "../../lib/siteNotificationsStorage";
import {
  MANAGER_TOPBAR_NOTIFICATIONS_INITIAL,
  type ManagerNotifIcon,
} from "./managerTopbarNotifications";

function buildManagerNotifications() {
  const reads = loadNotificationReads(SITE_NOTIF_READS_MANAGER);
  return hydrateNotificationReads(MANAGER_TOPBAR_NOTIFICATIONS_INITIAL, reads);
}

function ManagerNotifGlyph({ kind }: { kind: ManagerNotifIcon }) {
  const c = { size: 14 as const, strokeWidth: 1.75 };
  if (kind === "team") return <Users {...c} color={brandIcon.accentCyan} />;
  if (kind === "doc") return <FileText {...c} color={brandIcon.accentRed} />;
  return <Calendar {...c} color="rgba(255,255,255,0.85)" />;
}

export function ManagerTopbar() {
  const [searchVal, setSearchVal] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => buildManagerNotifications());
  const notifWrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const settingsActive = location.pathname === "/settings";
  const { toggle: toggleMobileNav } = useMobileNav();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (notifWrapRef.current && !notifWrapRef.current.contains(t)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  useEffect(() => {
    const sync = () => setNotifications(buildManagerNotifications());
    sync();
    window.addEventListener(SITE_NOTIFICATIONS_CHANGED, sync);
    return () => window.removeEventListener(SITE_NOTIFICATIONS_CHANGED, sync);
  }, []);

  const markRead = (id: string) => {
    setOneRead(SITE_NOTIF_READS_MANAGER, id, true);
    setNotifications(buildManagerNotifications());
  };

  const markAllRead = () => {
    setAllRead(
      SITE_NOTIF_READS_MANAGER,
      MANAGER_TOPBAR_NOTIFICATIONS_INITIAL.map((n) => n.id),
    );
    setNotifications(buildManagerNotifications());
  };

  return (
    <div className="topbar manager-topbar" style={{ gap: "14px" }}>
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-btn"
          aria-label="Открыть меню навигации"
          onClick={toggleMobileNav}
        >
          <Menu size={18} color="rgba(255,255,255,0.9)" strokeWidth={1.75} />
        </button>
        <div className="topbar-logo-cluster">
          <AlrosaLogo className="alrosa-logo-wrap--topbar" />
          <div className="topbar-brand-sublabel">Единая среда обучения</div>
        </div>
        <div className="topbar-divider" />
        <div className="topbar-breadcrumb-wrap">
          <Breadcrumb tone="dark" />
        </div>
      </div>

      <div className="topbar-search-wrap" style={{ flex: "0 1 320px", maxWidth: "400px", minWidth: 0 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: "12px",
              color: "rgba(255,255,255,0.42)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <input
            className="search-input"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Поиск сотрудников, курсов, навыков..."
            style={{ width: "100%", borderRadius: "12px", paddingLeft: "38px", paddingRight: "52px", minHeight: "40px" }}
          />
          <div
            style={{
              position: "absolute",
              right: "10px",
              fontSize: "10px",
              color: "rgba(255,255,255,0.4)",
              background: "rgba(0,82,204,0.2)",
              border: "1px solid rgba(129,208,245,0.15)",
              borderRadius: "6px",
              padding: "3px 6px",
              fontWeight: 500,
            }}
          >
            ⌘K
          </div>
        </div>
      </div>

      <div className="topbar-trailing" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div ref={notifWrapRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Уведомления"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            onClick={() => setNotifOpen((o) => !o)}
            style={{
              position: "relative",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: notifOpen ? "rgba(129,208,245,0.18)" : "rgba(255,255,255,0.06)",
              border: notifOpen ? "1px solid rgba(129,208,245,0.35)" : "1px solid rgba(129,208,245,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.88)",
              transition: "all 0.2s",
            }}
          >
            <Bell size={17} color="rgba(255,255,255,0.9)" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <div
                className="notif-badge"
                style={{
                  boxShadow: "0 2px 8px rgba(0,82,204,0.5)",
                  minWidth: "18px",
                  height: "18px",
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
                boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
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
                      <ManagerNotifGlyph kind={n.icon} />
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
          aria-label="Настройки"
          aria-current={settingsActive ? "page" : undefined}
          onClick={() => navigate("/settings")}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: settingsActive ? "rgba(129,208,245,0.2)" : "rgba(255,255,255,0.06)",
            border: settingsActive ? "1px solid rgba(129,208,245,0.4)" : "1px solid rgba(129,208,245,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.88)",
          }}
        >
          <Settings size={16} color="rgba(255,255,255,0.9)" strokeWidth={1.75} />
        </button>

        <div style={{ width: "1px", height: "26px", background: "rgba(129,208,245,0.12)", margin: "0 4px" }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "14px",
            border: "1px solid transparent",
            transition: "background 0.2s",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0052CC, #00C4A0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "600",
                color: "#ffffff",
                boxShadow: "0 0 20px rgba(0,82,204,0.45), 0 0 40px rgba(0,196,160,0.15)",
              }}
            >
              МЛ
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#00C4A0",
                border: "2px solid #0a0e18",
                boxShadow: "0 0 8px rgba(0,196,160,0.8)",
              }}
            />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "13px", fontWeight: "500", color: "rgba(255,255,255,0.95)", lineHeight: 1.25 }}>
              Максим Лебедев
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.48)", lineHeight: 1.25, maxWidth: "200px" }}>
              Руководитель направления Разработка
            </div>
          </div>
          <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.45)" }} />
        </div>
      </div>
    </div>
  );
}
