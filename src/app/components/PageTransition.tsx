import React, { ReactNode } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router";

/* Direction-aware variants based on route order */
const ROUTE_ORDER: Record<string, number> = {
  "/": 0,
  "/cabinet": 1,
  "/courses": 2,
  "/analytics": 3,
  "/employee/calendar": 4,
  "/idp": 5,
  "/certificates": 6,
  "/my-team": 7,
  "/manager": 8,
  "/manager/analytics": 8,
  "/manager/mentor": 8,
  "/manager/courses": 8,
  "/manager/competencies": 8,
  "/team": 8,
  "/support": 9,
  "/settings": 10,
  "/hr": 11,
  "/hr/dashboard": 11,
  "/hr/employees": 11,
  "/hr/trajectory": 11,
  "/hr/mentor": 11,
  "/hr/catalog": 11,
  "/hr/applications": 11,
  "/hr/competencies": 11,
  "/hr/events": 11,
  "/hr/reports": 11,
  "/hr/certificates": 11,
  "/hr/support": 11,
  "/hr/settings": 11,
  "/admin": 12,
  "/admin/administration": 12,
  "/admin/users": 12,
  "/admin/courses": 12,
  "/admin/integrations": 12,
  "/admin/monitoring": 12,
  "/admin/database": 12,
  "/admin/access": 12,
  "/admin/notifications": 12,
  "/admin/system-reports": 12,
  "/admin/servers": 12,
  "/admin/ai-modules": 12,
  "/admin/documentation": 12,
  "/admin/configuration": 12,
};

/* Accent glow per route */
const ROUTE_GLOW: Record<string, string> = {
  "/": "rgba(227,0,11,.06)",
  "/cabinet": "rgba(129,208,245,.12)",
  "/courses": "rgba(129,208,245,.1)",
  "/analytics": "rgba(129,208,245,.08)",
  "/employee/calendar": "rgba(129,208,245,.08)",
  "/idp": "rgba(129,208,245,.08)",
  "/certificates": "rgba(129,208,245,.06)",
  "/my-team": "rgba(129,208,245,.06)",
  "/manager": "rgba(129,208,245,.1)",
  "/manager/analytics": "rgba(129,208,245,.1)",
  "/manager/mentor": "rgba(129,208,245,.1)",
  "/manager/courses": "rgba(129,208,245,.1)",
  "/manager/competencies": "rgba(129,208,245,.1)",
  "/team": "rgba(129,208,245,.1)",
  "/support": "rgba(0,0,0,.04)",
  "/settings": "rgba(0,0,0,.04)",
  "/hr": "rgba(227,0,11,.08)",
  "/hr/dashboard": "rgba(227,0,11,.08)",
  "/hr/employees": "rgba(227,0,11,.08)",
  "/hr/trajectory": "rgba(227,0,11,.08)",
  "/hr/mentor": "rgba(227,0,11,.08)",
  "/hr/catalog": "rgba(227,0,11,.08)",
  "/hr/applications": "rgba(227,0,11,.08)",
  "/hr/competencies": "rgba(227,0,11,.08)",
  "/hr/events": "rgba(227,0,11,.08)",
  "/hr/reports": "rgba(227,0,11,.08)",
  "/hr/certificates": "rgba(227,0,11,.08)",
  "/hr/support": "rgba(227,0,11,.08)",
  "/hr/settings": "rgba(227,0,11,.08)",
  "/admin": "rgba(129,208,245,.1)",
  "/admin/administration": "rgba(129,208,245,.1)",
  "/admin/users": "rgba(129,208,245,.1)",
  "/admin/courses": "rgba(129,208,245,.1)",
  "/admin/integrations": "rgba(129,208,245,.1)",
  "/admin/monitoring": "rgba(129,208,245,.1)",
  "/admin/database": "rgba(129,208,245,.1)",
  "/admin/access": "rgba(129,208,245,.1)",
  "/admin/notifications": "rgba(129,208,245,.1)",
  "/admin/system-reports": "rgba(129,208,245,.1)",
  "/admin/servers": "rgba(129,208,245,.1)",
  "/admin/ai-modules": "rgba(129,208,245,.1)",
  "/admin/documentation": "rgba(129,208,245,.1)",
  "/admin/configuration": "rgba(129,208,245,.1)",
};

interface PageTransitionProps {
  children: ReactNode;
  routeKey: string;
  prevRoute?: string;
}

export function PageTransition({ children, routeKey, prevRoute }: PageTransitionProps) {
  const currIdx = ROUTE_ORDER[routeKey]  ?? 0;
  const prevIdx = ROUTE_ORDER[prevRoute ?? ""] ?? currIdx;
  const dir     = currIdx >= prevIdx ? 1 : -1;

  const variants = {
    initial: {
      opacity: 0,
      x: dir * 8,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.28,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      x: dir * -6,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  };

  return (
    <motion.div
      key={routeKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: "absolute",
        inset: 0,
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: `inset 0 0 80px ${ROUTE_GLOW[routeKey] ?? "transparent"}`,
      }}
    >
      {children}
    </motion.div>
  );
}
