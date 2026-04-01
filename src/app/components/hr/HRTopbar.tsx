import React, { useEffect, useRef, useState } from "react";
import { Bell, Search, ChevronDown, Settings, FileDown, RefreshCw, Menu, BookOpen, FileText, Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Breadcrumb } from "../Breadcrumb";
import { AlrosaLogo } from "../AlrosaBrand";
import { useMobileNav } from "../../contexts/MobileNavContext";
import { brandIcon } from "../../lib/brandIcons";
import { L_D_DIRECTOR_TITLE } from "../../lib/hrLdLabels";
import { HR_DECISIONS_UPDATED } from "../../lib/hrApplicationStatusStorage";
import {
  setHrPendingNotifAckedCount,
  setOneRead,
  setAllRead,
  SITE_NOTIF_READS_HR,
  SITE_NOTIFICATIONS_CHANGED,
} from "../../lib/siteNotificationsStorage";
import { TRAINING_APPLICATIONS_UPDATED } from "../../lib/trainingApplicationsStorage";
import { countHrPendingApplications } from "../../lib/hrPendingApplicationsCount";
import {
  HR_TOPBAR_NOTIFICATIONS_INITIAL,
  buildHrTopbarNotificationList,
  type HrTopbarNotifIcon,
} from "./hrTopbarNotifications";

interface HRTopbarProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
  onSyncOutlook: () => void;
}

function HrNotifGlyph({ kind }: { kind: HrTopbarNotifIcon }) {
  const c = { size: 14 as const, strokeWidth: brandIcon.sw };
  if (kind === "course") return <BookOpen {...c} color={brandIcon.stroke} />;
  if (kind === "doc") return <FileText {...c} color={brandIcon.accentRed} />;
  return <Calendar {...c} color={brandIcon.accentCyan} />;
}

export function HRTopbar({ onExportExcel, onExportPDF, onSyncOutlook }: HRTopbarProps) {
  const [searchVal, setSearchVal] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => buildHrTopbarNotificationList());
  const notifWrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const settingsActive = location.pathname === "/hr/settings";
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
    const sync = () => setNotifications(buildHrTopbarNotificationList());
    sync();
    window.addEventListener(TRAINING_APPLICATIONS_UPDATED, sync);
    window.addEventListener(HR_DECISIONS_UPDATED, sync);
    window.addEventListener(SITE_NOTIFICATIONS_CHANGED, sync);
    return () => {
      window.removeEventListener(TRAINING_APPLICATIONS_UPDATED, sync);
      window.removeEventListener(HR_DECISIONS_UPDATED, sync);
      window.removeEventListener(SITE_NOTIFICATIONS_CHANGED, sync);
    };
  }, []);

  const markRead = (id: string) => {
    if (id === "2") setHrPendingNotifAckedCount(countHrPendingApplications());
    else setOneRead(SITE_NOTIF_READS_HR, id, true);
    setNotifications(buildHrTopbarNotificationList());
  };

  const markAllRead = () => {
    setHrPendingNotifAckedCount(countHrPendingApplications());
    setAllRead(
      SITE_NOTIF_READS_HR,
      HR_TOPBAR_NOTIFICATIONS_INITIAL.map((n) => n.id),
    );
    setNotifications(buildHrTopbarNotificationList());
  };

  return (
    <div className="topbar" style={{ gap: "14px" }}>
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

      <div className="topbar-search-wrap" style={{ flex: "0 1 280px", maxWidth: "320px", minWidth: 0 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
        <Search size={13} style={{ position: "absolute", left: "11px", color: "#000000", pointerEvents: "none", zIndex: 1 }} />
        <input
          className="search-input search-input--employee"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Поиск сотрудников, курсов, заявок..."
          style={{ width: "100%" }}
        />
        <div style={{ position: "absolute", right: "10px", fontSize: "10px", color: "#000000", background: "rgba(129,208,245,.05)", border: "1px solid rgba(129,208,245,.07)", borderRadius: "4px", padding: "2px 5px" }}>⌘K</div>
        </div>
      </div>

      <div className="topbar-trailing" style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
        {[
          { icon: FileDown, label: "Таблица", color: "#000000", fn: onExportExcel },
          { icon: FileDown, label: "В PDF", color: "#e3000b", fn: onExportPDF },
          { icon: RefreshCw, label: "Outlook", color: "#000000", fn: onSyncOutlook },
        ].map(({ icon: Icon, label, color, fn }) => (
          <button
            key={label}
            type="button"
            onClick={fn}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 11px", borderRadius: "9px", background: `${color}12`, border: `1px solid ${color}28`, color, fontSize: "11.5px", fontWeight: "500", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${color}22`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${color}12`; }}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}

        <div style={{ width: "1px", height: "24px", background: "rgba(129,208,245,.07)", margin: "0 2px" }} />

        <div ref={notifWrapRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Уведомления"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            onClick={() => setNotifOpen((o) => !o)}
            style={{
              position: "relative",
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: notifOpen ? "rgba(129,208,245,0.14)" : "rgba(129,208,245,.05)",
              border: notifOpen ? "1px solid rgba(129,208,245,0.22)" : "1px solid rgba(129,208,245,.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#000000",
            }}
          >
            <Bell size={15} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            {unreadCount > 0 && (
              <div
                className="notif-badge"
                style={{
                  minWidth: "17px",
                  height: "17px",
                  fontSize: "10px",
                  top: "-2px",
                  right: "-2px",
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
                boxShadow: "0 24px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
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
                      <HrNotifGlyph kind={n.icon} />
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
          onClick={() => navigate("/hr/settings")}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: settingsActive ? "rgba(129,208,245,0.14)" : "rgba(129,208,245,.05)",
            border: settingsActive ? "1px solid rgba(129,208,245,0.28)" : "1px solid rgba(129,208,245,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#000000",
          }}
        >
          <Settings size={14} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
        </button>

        <div style={{ width: "1px", height: "24px", background: "rgba(129,208,245,.07)", margin: "0 2px" }} />

        {/* Avatar — Anna Smirnova */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", padding: "4px 8px", borderRadius: "11px" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#e3000b,#81d0f5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "500", color: "#000000", boxShadow: "0 0 12px rgba(227,0,11,.35)" }}>АС</div>
            <div style={{ position: "absolute", bottom: "0", right: "0", width: "9px", height: "9px", borderRadius: "50%", background: "#81d0f5", border: "2px solid #000000", boxShadow: "0 0 6px rgba(129,208,245,.5)" }} />
          </div>
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: "500", color: "#000000", lineHeight: 1.2 }}>Анна Смирнова</div>
            <div style={{ fontSize: "10.5px", color: "#000000", lineHeight: 1.2 }}>{L_D_DIRECTOR_TITLE}</div>
          </div>
          <ChevronDown size={13} style={{ color: "#000000" }} />
        </div>
      </div>
    </div>
  );
}
