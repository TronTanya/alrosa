import React, { useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { RoleDock } from "./RoleDock";
import { PageTransition } from "./components/PageTransition";

/* ─── Top navigation progress bar ─── */
const ROUTE_ACCENT: Record<string, string> = {
  "/": "#e3000b",
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
  "/manager/calendar": "#81d0f5",
  "/manager/reports": "#81d0f5",
  "/manager/achievements": "#81d0f5",
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

function NavProgressBar({ routeKey }: { routeKey: string }) {
  const accent = ROUTE_ACCENT[routeKey] ?? "#81d0f5";

  return (
    <AnimatePresence>
      <motion.div
        key={routeKey}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2.5px",
          zIndex: 999,
          borderRadius: "0 2px 2px 0",
          background: `linear-gradient(90deg, ${accent}CC, ${accent})`,
          boxShadow: `0 0 10px ${accent}AA, 0 0 20px ${accent}55`,
          transformOrigin: "left center",
        }}
        initial={{ width: "0%", opacity: 1 }}
        animate={{
          width: ["0%", "75%", "92%", "100%"],
          opacity: [1, 1, 1, 0],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.45, 0.75, 1],
          ease: "easeInOut",
        }}
      />
    </AnimatePresence>
  );
}

export function Root() {
  const location     = useLocation();
  const prevRouteRef = useRef<string>(location.pathname);

  const prevRoute = prevRouteRef.current;
  if (prevRoute !== location.pathname) {
    prevRouteRef.current = location.pathname;
  }

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#ffffff" }}>

      {/* ── Progress bar at the very top ── */}
      <NavProgressBar routeKey={location.pathname} />

      {/* Мягкий переход страниц — без шторки и полноэкранной вспышки (см. PageTransition) */}

      {/* ── Page content ── */}
      <AnimatePresence mode="sync" initial={false}>
        <PageTransition
          key={location.pathname}
          routeKey={location.pathname}
          prevRoute={prevRoute}
        >
          <Outlet />
        </PageTransition>
      </AnimatePresence>

      {/* ── Persistent floating role dock ── */}
      <RoleDock />
    </div>
  );
}
