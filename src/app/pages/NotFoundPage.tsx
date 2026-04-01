import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Home, LayoutDashboard, Users, Shield, ArrowLeft, Sparkles, Terminal } from "lucide-react";

/* ─── Glitch text effect ─── */
function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          fontSize: "clamp(80px, 16vw, 168px)",
          fontWeight: "900",
          letterSpacing: "-6px",
          lineHeight: 1,
          background: "linear-gradient(135deg, rgba(129,208,245,.9) 0%, rgba(129,208,245,.35) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: "none",
          display: "block",
          position: "relative",
          zIndex: 2,
        }}
      >
        {text}
      </span>

      {/* Glitch layer 1 */}
      <AnimatePresence>
        {glitch && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, times: [0, 0.2, 0.4, 0.7, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              fontSize: "clamp(80px, 16vw, 168px)",
              fontWeight: "900",
              letterSpacing: "-6px",
              lineHeight: 1,
              color: "#000000",
              clipPath: "inset(30% 0 40% 0)",
              transform: "translateX(-4px)",
              zIndex: 1,
            }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Glitch layer 2 */}
      <AnimatePresence>
        {glitch && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 0, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, times: [0, 0.2, 0.4, 0.7, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              fontSize: "clamp(80px, 16vw, 168px)",
              fontWeight: "900",
              letterSpacing: "-6px",
              lineHeight: 1,
              color: "#e3000b",
              clipPath: "inset(60% 0 10% 0)",
              transform: "translateX(4px)",
              zIndex: 1,
            }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Floating particle ─── */
function Particle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `rgba(${Math.random() > 0.5 ? "129,208,245" : "227,0,11"}, 0.35)`,
        pointerEvents: "none",
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.7, 0.2],
        scale: [1, 1.4, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ─── Nav shortcut card ─── */
const shortcuts = [
  {
    path: "/",
    icon: LayoutDashboard,
    label: "Личный кабинет",
    sub: "Александр Иванов",
    accent: "#81d0f5",
    grad: "linear-gradient(135deg,#e3000b,#81d0f5)",
    initials: "АИ",
  },
  {
    path: "/hr",
    icon: Users,
    label: "HR / L&D",
    sub: "Анна Смирнова",
    accent: "#e3000b",
    grad: "linear-gradient(135deg,#e3000b,#81d0f5)",
    initials: "АС",
  },
  {
    path: "/admin",
    icon: Shield,
    label: "Администрирование",
    sub: "Дмитрий Соколов",
    accent: "#81d0f5",
    grad: "linear-gradient(135deg,#81d0f5,#e3000b)",
    initials: "ДС",
  },
];

/* ─── Terminal log lines ─── */
const logLines = [
  { text: "GET /??  404 Not Found", color: "#e3000b" },
  { text: "Сканирование маршрутов...  [done]", color: "#000000" },
  { text: "Доступные пути: /, /hr, /hr/dashboard, /hr/employees, /hr/trajectory, /hr/mentor, /hr/catalog, /hr/applications, /hr/competencies, /hr/events, /hr/reports, /hr/certificates, /hr/support, /hr/settings, /admin", color: "#000000" },
  { text: "Рекомендую выбрать нужный раздел ↓", color: "#e3000b" },
];

export function NotFoundPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [hovCard, setHovCard] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);

  /* Animate terminal lines in */
  useEffect(() => {
    logLines.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), 400 + i * 600);
    });
  }, []);

  /* Particles */
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 3,
  }));

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        fontFamily: "var(--font-sans)",
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(227,0,11,.1) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, rgba(129,208,245,.08) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 50%, rgba(227,0,11,.06) 0%, transparent 60%),
          #000000
        `,
      }}
    >
      {/* Particles */}
      {particles.map(p => <Particle key={p.id} {...p} />)}

      {/* Grid lines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(129,208,245,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(129,208,245,.025) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,82,204,.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          textAlign: "center",
          maxWidth: "820px",
          width: "100%",
          padding: "0 28px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Alrosa badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "5px 14px",
            borderRadius: "20px",
            background: "rgba(129,208,245,.05)",
            border: "1px solid rgba(129,208,245,.1)",
            marginBottom: "24px",
          }}
        >
          <Sparkles size={12} style={{ color: "#000000" }} />
          <span style={{ fontSize: "12px", color: "#000000", fontWeight: "500" }}>
            Алроса ИТ · Единая среда обучения
          </span>
          <span style={{ fontSize: "11px", color: "#000000" }}>·</span>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#FF4757" }}>Страница не найдена</span>
        </motion.div>

        {/* 404 glitch number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: "16px" }}
        >
          <GlitchText text="404" />
        </motion.div>

        {/* Title & subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#000000", margin: "0 0 10px", letterSpacing: "-0.4px" }}>
            Маршрут не обнаружен
          </h1>
          <p style={{ fontSize: "14px", color: "#000000", margin: "0 0 24px", lineHeight: 1.7 }}>
            Путь <code style={{ background: "rgba(227,0,11,.14)", border: "1px solid rgba(227,0,11,.28)", borderRadius: "6px", padding: "2px 8px", fontSize: "13px", color: "#e3000b", fontFamily: "monospace" }}>{location.pathname}</code>
            {" "}не существует в системе. ИИ-навигатор не смог найти запрошенный раздел.
          </p>
        </motion.div>

        {/* Terminal block */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{
            margin: "0 auto 28px",
            maxWidth: "480px",
            padding: "14px 18px",
            borderRadius: "14px",
            background: "rgba(0,0,0,.5)",
            border: "1px solid rgba(129,208,245,.08)",
            backdropFilter: "blur(16px)",
            textAlign: "left",
          }}
        >
          {/* Terminal header */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid rgba(129,208,245,.05)" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              {["#FF5F57","#FFBD2E","#28C840"].map(c => (
                <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c, opacity: .7 }} />
              ))}
            </div>
            <Terminal size={11} style={{ color: "#000000", marginLeft: "4px" }} />
            <span style={{ fontSize: "11px", color: "#000000", fontFamily: "monospace" }}>eso-router — bash</span>
          </div>

          {/* Lines */}
          <div style={{ fontFamily: "monospace", fontSize: "12px", lineHeight: 1.9 }}>
            <div style={{ color: "#000000", marginBottom: "4px" }}>$ route-check {location.pathname}</div>
            {logLines.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: line.color, display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span style={{ color: "#000000" }}>›</span>
                {line.text}
              </motion.div>
            ))}
            {visibleLines < logLines.length && (
              <span style={{ color: "#000000", animation: "dot-pulse 1s infinite" }}>▌</span>
            )}
          </div>
        </motion.div>

        {/* Shortcut cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.45 }}
        >
          <div style={{ fontSize: "11px", fontWeight: "600", color: "#000000", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
            Перейти в раздел
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {shortcuts.map((s, i) => {
              const isH = hovCard === s.path;
              return (
                <motion.button
                  key={s.path}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.08, duration: 0.38 }}
                  onClick={() => navigate(s.path)}
                  onMouseEnter={() => setHovCard(s.path)}
                  onMouseLeave={() => setHovCard(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 16px 10px 12px",
                    borderRadius: "14px",
                    background: isH ? `${s.accent}14` : "rgba(129,208,245,.04)",
                    border: `1px solid ${isH ? `${s.accent}38` : "rgba(129,208,245,.08)"}`,
                    backdropFilter: "blur(16px)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "all .2s ease",
                    boxShadow: isH ? `0 8px 28px rgba(0,0,0,.4), 0 0 18px ${s.accent}22` : "none",
                    transform: isH ? "translateY(-2px)" : "none",
                  }}
                >
                  {/* Avatar */}
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: s.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#000000", flexShrink: 0, boxShadow: isH ? `0 0 12px ${s.accent}66` : "none", transition: "box-shadow .2s" }}>
                    {s.initials}
                  </div>
                  {/* Text */}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: isH ? "#000000" : "#000000", lineHeight: 1.2 }}>{s.label}</div>
                    <div style={{ fontSize: "11px", color: "#000000", marginTop: "1px" }}>{s.sub}</div>
                  </div>
                  {/* Arrow */}
                  <motion.div
                    animate={{ x: isH ? 3 : 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ marginLeft: "4px" }}
                  >
                    <ArrowLeft size={13} style={{ color: isH ? s.accent : "#000000", transform: "rotate(180deg)" }} />
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          style={{ marginTop: "28px" }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "20px",
              background: "transparent",
              border: "1px solid rgba(129,208,245,.1)",
              color: "#000000",
              fontSize: "12.5px",
              fontWeight: "500",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "all .18s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,.05)";
              (e.currentTarget as HTMLButtonElement).style.color = "#000000";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,.15)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#000000";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,.1)";
            }}
          >
            <ArrowLeft size={13} /> Назад
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
