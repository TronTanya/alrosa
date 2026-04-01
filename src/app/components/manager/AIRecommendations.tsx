import React, { useState } from "react";
import { AlertTriangle, BookOpen, TrendingDown, ChevronRight, Sparkles, MessageSquare, X, Zap, Brain } from "lucide-react";
import { brandIcon } from "../../lib/brandIcons";

function AIAvatarBlock({ onChat }: { onChat: () => void }) {
  return (
    <div
      className="glass-card-bright"
      style={{ padding: "24px 22px 22px", textAlign: "center", position: "relative", overflow: "hidden", borderRadius: "20px" }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(129,208,245,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 16px", filter: "drop-shadow(0 4px 20px rgba(129,208,245,0.35))" }}>
        <div className="ring-spin" style={{ position: "absolute", inset: "-12px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(227,0,11,0.45)", borderRightColor: "rgba(129,208,245,0.55)" }} />
        <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: "1px solid rgba(129,208,245,0.25)" }} />
        <div className="ai-glow float-anim" style={{ width: "120px", height: "120px", borderRadius: "50%", background: "linear-gradient(145deg,#ffffff,#f5f9fc)", border: "2px solid rgba(129,208,245,0.45)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "inset 0 0 24px rgba(129,208,245,0.12)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 28%, rgba(227,0,11,0.08) 0%, transparent 55%)" }} />
          <svg width="56" height="56" viewBox="0 0 52 52" fill="none" style={{ position: "relative", zIndex: 1 }}>
            <defs>
              <linearGradient id="mgr-ai-g-alrosa" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e3000b" /><stop offset="100%" stopColor="#81d0f5" />
              </linearGradient>
            </defs>
            <rect x="14" y="10" width="24" height="20" rx="7" fill="url(#mgr-ai-g-alrosa)" opacity="0.9" />
            <circle cx="21" cy="19" r="2.8" fill="#000000" opacity="0.85" />
            <circle cx="31" cy="19" r="2.8" fill="#000000" opacity="0.85" />
            <circle cx="22" cy="19" r="1.1" fill="#81d0f5" />
            <circle cx="32" cy="19" r="1.1" fill="#e3000b" />
            <path d="M21 26 Q26 30 31 26" stroke="rgba(0,0,0,.55)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <rect x="16" y="32" width="20" height="13" rx="5" fill="url(#mgr-ai-g-alrosa)" opacity="0.55" />
            <path d="M6 18 L14 18" stroke="rgba(227,0,11,.45)" strokeWidth="1.2" />
            <circle cx="5" cy="18" r="2" fill="rgba(227,0,11,.5)" />
            <path d="M38 18 L46 18" stroke="rgba(129,208,245,.65)" strokeWidth="1.2" />
            <circle cx="47" cy="18" r="2" fill="rgba(129,208,245,.6)" />
          </svg>
        </div>
      </div>

      <div style={{ fontSize: "14px", fontWeight: "700", color: "#000000", marginBottom: "4px" }}>Цифровой Наставник Команды</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "20px", background: "rgba(129,208,245,0.12)", border: "1px solid rgba(129,208,245,0.35)", fontSize: "11px", color: "#000000", fontWeight: "600", marginBottom: "14px" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: brandIcon.accentCyan, boxShadow: "0 0 6px rgba(129,208,245,0.8)", display: "inline-block" }} />
        Анализирует команду • Live
      </div>

      <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", lineHeight: 1.6, marginBottom: "16px" }}>
        Мониторю 15 сотрудников в реальном времени. Выявил 3 зоны риска и 5 точек роста.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "Анализов сегодня", value: "47" },
          { label: "Рекомендаций", value: "12" },
        ].map(s => (
          <div key={s.label} style={{ padding: "10px", borderRadius: "11px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#000000", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onChat}
        style={{ width: "100%", padding: "11px", borderRadius: "13px", background: "linear-gradient(135deg, rgba(227,0,11,0.12), rgba(129,208,245,0.22))", border: "1px solid rgba(129,208,245,0.45)", color: "#000000", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
      >
        <MessageSquare size={14} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
        Поговорить с Наставником
      </button>
    </div>
  );
}

interface Rec {
  icon: React.ComponentType<{ size?: number }>;
  accent: string;
  glow: string;
  urgency: string;
  urgencyColor: string;
  title: string;
  body: string;
  cta: string;
  meta?: string;
}

const recs: Rec[] = [
  {
    icon: AlertTriangle,
    accent: brandIcon.accentRed,
    glow: "rgba(227,0,11,0.2)",
    urgency: "Срочно",
    urgencyColor: brandIcon.accentRed,
    title: "3 сотрудника теряют навык «Цифровая эффективность»",
    body: "Анна Волкова (38), Сергей Морозов (72→55), Ольга Попова (62) — показатели снизились за 30 дней. Необходимо вмешательство.",
    cta: "Назначить обучение",
    meta: "Обнаружено сегодня, 08:14",
  },
  {
    icon: BookOpen,
    accent: brandIcon.accentCyan,
    glow: "rgba(129,208,245,0.35)",
    urgency: "Рекомендация",
    urgencyColor: "#0ea5e9",
    title: "Курс для всей команды: «Agile & Data-Driven Decisions»",
    body: "Средний уровень по Agile/Scrum в команде — 67%. Курс повысит синхронизацию и ускорит спринты. ROI: +18% продуктивности.",
    cta: "Записать команду",
    meta: "16 часов · 15 апреля 2026",
  },
  {
    icon: TrendingDown,
    accent: "#d97706",
    glow: "rgba(217,119,6,0.2)",
    urgency: "Предиктив",
    urgencyColor: "#d97706",
    title: "Риск выгорания у 4 сотрудников через 2 месяца",
    body: "Предиктивная модель: Козлов, Лебедев, Морозов, Попова — признаки перегрузки. Рекомендую 1:1 встречи и перераспределение задач.",
    cta: "Просмотреть анализ",
    meta: "Прогноз на май–июнь 2026",
  },
];

function RecCard({ rec }: { rec: Rec }) {
  return (
    <div
      className="glass-card-md"
      style={{ padding: "18px", cursor: "pointer", transition: "all .2s ease", border: `1px solid ${rec.accent}28` }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(0,0,0,.08), 0 0 16px ${rec.glow}`; (e.currentTarget as HTMLDivElement).style.borderColor = `${rec.accent}45`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; (e.currentTarget as HTMLDivElement).style.borderColor = `${rec.accent}28`; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: `${rec.accent}18`, border: `1px solid ${rec.accent}32`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <rec.icon size={16} style={{ color: rec.accent }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", background: `${rec.urgencyColor}14`, color: rec.urgencyColor, border: `1px solid ${rec.urgencyColor}28` }}>
              {rec.urgency}
            </span>
            {rec.meta && <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>{rec.meta}</span>}
          </div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", lineHeight: 1.35 }}>{rec.title}</div>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", lineHeight: 1.6, margin: "0 0 12px" }}>
        {rec.body}
      </p>

      <button
        type="button"
        style={{ width: "100%", padding: "8px", borderRadius: "10px", background: `${rec.accent}12`, border: `1px solid ${rec.accent}30`, color: rec.accent, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", transition: "all .18s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${rec.accent}22`; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${rec.accent}12`; }}
      >
        {rec.cta}
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

function ChatModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Привет, Максим! Готов обсудить команду. Выявлено 3 зоны риска и 2 точки быстрого роста. С чего начнём?" }
  ]);
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { role: "user", text: input }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { role: "ai", text: "Анализирую данные команды... По результатам мониторинга рекомендую сфокусироваться на Анне Волковой: риск отставания критичен. Запланировать встречу?" }]);
    }, 1600);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "80px 24px 24px" }} onClick={onClose}>
      <div style={{ width: "420px", background: "#ffffff", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.1)", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#e3000b,#81d0f5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={16} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000" }}>Наставник Команды</div>
            <div style={{ fontSize: "11px", color: brandIcon.accentCyan }}>● Online</div>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "rgba(0,0,0,0.45)", cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "320px", overflowY: "auto" }} className="custom-scroll">
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: m.role === "ai" ? "linear-gradient(135deg,#e3000b,#81d0f5)" : "linear-gradient(135deg,#81d0f5,#e3000b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
                {m.role === "ai" ? "AI" : "МЛ"}
              </div>
              <div className={m.role === "ai" ? "msg-ai" : "msg-user"} style={{ maxWidth: "80%", fontSize: "12.5px" }}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#e3000b,#81d0f5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", color: "#fff" }}>AI</span>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: "0 12px 12px 12px", background: "rgba(129,208,245,0.12)", border: "1px solid rgba(129,208,245,0.35)", display: "flex", gap: "4px" }}>
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: "8px" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Спросить о команде..." style={{ flex: 1, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", color: "#000000", padding: "9px 12px", fontSize: "13px", fontFamily: "var(--font-sans)", outline: "none" }} />
          <button type="button" onClick={send} style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg,#e3000b,#81d0f5)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Zap size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AIRecommendations() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", minWidth: 0 }}>
        <AIAvatarBlock onChat={() => setChatOpen(true)} />
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Sparkles size={13} style={{ color: brandIcon.accentRed }} />
          <span style={{ fontSize: "12px", fontWeight: "600", color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px" }}>
            ИИ-РЕКОМЕНДАЦИИ
          </span>
        </div>
        {recs.map((r, i) => <RecCard key={i} rec={r} />)}
      </div>
      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
    </>
  );
}
