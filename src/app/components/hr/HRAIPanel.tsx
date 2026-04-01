import React, { useState } from "react";
import { Brain, AlertTriangle, BookOpen, Sparkles, MessageSquare, ChevronRight, X, Zap, TrendingDown, CheckSquare } from "lucide-react";

/* ─── Chat Modal ─── */
function ChatModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Здравствуйте, Анна! Я проанализировал данные по всей компании. Обнаружено 15 заявок на внешние курсы и 12 сотрудников в зоне риска по цифровым компетенциям. С чего начнём?" }
  ]);
  const [typing, setTyping] = useState(false);

  const replies = [
    "По данным мониторинга, наибольший риск — у отдела Продаж и Юридического. Рекомендую запустить групповой курс «Цифровая трансформация». Хотите сформировать список?",
    "Для оптимизации бюджета предлагаю перераспределить 800 тыс. ₽ на внутренние программы с ROI +32%. Прикрепить детальный расчёт?",
    "Анализирую исторические данные завершения курсов... Лучший день для старта — понедельник. Оптимальная длина модуля — 25–40 мин. Нужен план?",
  ];
  let replyIdx = 0;

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { role: "user", text: input }]);
    setInput("");
    setTyping(true);
    const reply = replies[replyIdx % replies.length];
    replyIdx++;
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { role: "ai", text: reply }]);
    }, 1500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "80px 24px 24px" }} onClick={onClose}>
      <div style={{ width: "440px", background: "rgba(8,11,30,0.98)", borderRadius: "22px", border: "1px solid rgba(255,255,255,.1)", backdropFilter: "blur(24px)", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,.75)" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: "10px", background: "linear-gradient(90deg, rgba(227,0,11,.12), rgba(129,208,245,.08))" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#e3000b,#81d0f5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(227,0,11,.35)" }}>
            <Brain size={17} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>ИИ-Наставник Развития</div>
            <div style={{ fontSize: "10.5px", color: "#81d0f5", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#81d0f5", boxShadow: "0 0 6px rgba(129,208,245,.9)", display: "inline-block" }} />
              Анализирует 312 сотрудников · Live
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,.4)", cursor: "pointer" }}><X size={18} /></button>
        </div>

        {/* Messages */}
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto" }} className="custom-scroll">
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: m.role === "ai" ? "linear-gradient(135deg,#e3000b,#81d0f5)" : "#000000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>
                {m.role === "ai" ? "AI" : "АС"}
              </div>
              <div className={m.role === "ai" ? "msg-ai" : "msg-user"} style={{ maxWidth: "80%", fontSize: "12px" }}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#e3000b,#81d0f5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "9px", fontWeight: "800", color: "#fff" }}>AI</span>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: "0 12px 12px 12px", background: "rgba(129,208,245,.12)", border: "1px solid rgba(129,208,245,.28)", display: "flex", gap: "4px" }}>
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div style={{ padding: "0 16px 10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["Риски навыков", "Топ курсы", "Бюджет ROI"].map(p => (
            <button key={p} onClick={() => { setInput(p); }} style={{ padding: "4px 10px", borderRadius: "20px", background: "rgba(129,208,245,.14)", border: "1px solid rgba(129,208,245,.35)", color: "#000000", fontSize: "11px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>{p}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "10px 16px 14px", borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", gap: "8px" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Спросить об обучении в компании..." style={{ flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", borderRadius: "11px", color: "#fff", padding: "9px 12px", fontSize: "12.5px", fontFamily: "var(--font-sans)", outline: "none" }} />
          <button onClick={send} style={{ width: "38px", height: "38px", borderRadius: "11px", background: "linear-gradient(135deg,#e3000b,#81d0f5)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 16px rgba(227,0,11,.35)" }}>
            <Zap size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AI Avatar Block ─── */
function AIAvatarBlock({ onChat }: { onChat: () => void }) {
  return (
    <div className="glass-card-bright" style={{ padding: "20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(129,208,245,.2) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* AI avatar */}
      <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 12px" }}>
        <div className="ring-spin" style={{ position: "absolute", inset: "-8px", borderRadius: "50%", border: "1.5px solid transparent", borderTopColor: "rgba(227,0,11,.45)", borderRightColor: "rgba(129,208,245,.55)" }} />
        <div style={{ position: "absolute", inset: "-2px", borderRadius: "50%", border: "1px solid rgba(129,208,245,.2)" }} />
        <div className="ai-glow float-anim" style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(145deg,rgba(255,250,250,1),#ffffff)", border: "2px solid rgba(129,208,245,0.45)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 8px 28px rgba(227,0,11,0.1)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%,rgba(129,208,245,.25) 0%,transparent 60%)" }} />
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ position: "relative", zIndex: 1 }}>
            <defs>
              <linearGradient id="hr-ai-g" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e3000b" /><stop offset="100%" stopColor="#81d0f5" />
              </linearGradient>
            </defs>
            <rect x="10" y="7" width="24" height="19" rx="7" fill="url(#hr-ai-g)" opacity="0.9" />
            <circle cx="18" cy="16" r="2.5" fill="#ffffff" opacity="0.95" /><circle cx="26" cy="16" r="2.5" fill="#ffffff" opacity="0.95" />
            <circle cx="19" cy="16" r="1" fill="#e3000b" /><circle cx="27" cy="16" r="1" fill="#e3000b" />
            <path d="M17 22 Q22 26 27 22" stroke="#000000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <rect x="12" y="28" width="20" height="11" rx="4.5" fill="url(#hr-ai-g)" opacity="0.55" />
            <path d="M4 15 L10 15" stroke="rgba(227,0,11,.55)" strokeWidth="1.2" /><circle cx="3" cy="15" r="2" fill="rgba(227,0,11,.55)" />
            <path d="M34 15 L40 15" stroke="rgba(129,208,245,.65)" strokeWidth="1.2" /><circle cx="41" cy="15" r="2" fill="rgba(129,208,245,.65)" />
          </svg>
        </div>
      </div>

      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#000000", marginBottom: "4px" }}>Цифровой Наставник Развития</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "20px", background: "rgba(129,208,245,.12)", border: "1px solid rgba(129,208,245,.35)", fontSize: "10.5px", color: "#000000", fontWeight: "600", marginBottom: "12px" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#81d0f5", boxShadow: "0 0 6px rgba(129,208,245,.85)", display: "inline-block" }} />
        312 сотрудников · Live
      </div>

      <div style={{ fontSize: "11.5px", color: "#000000", lineHeight: 1.6, marginBottom: "14px" }}>
        Глобальный мониторинг обучения. Выявил 3 зоны риска, 15 заявок на обработку, рост ROI на 24%.
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "14px" }}>
        {[
          { label: "Анализов", value: "312" },
          { label: "Заявок", value: "15" },
          { label: "ROI", value: "+24%" },
        ].map(s => (
          <div key={s.label} style={{ padding: "8px 4px", borderRadius: "10px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#000000", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "9.5px", color: "#000000", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button onClick={onChat} style={{ width: "100%", padding: "10px", borderRadius: "12px", background: "linear-gradient(135deg,#e3000b,#81d0f5)", border: "none", color: "#fff", fontSize: "12.5px", fontWeight: "700", cursor: "pointer", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: "0 6px 24px rgba(227,0,11,.32)" }}>
        <MessageSquare size={13} />
        Открыть глобальный чат ИИ
      </button>
    </div>
  );
}

/* ─── Rec cards ─── */
interface Rec {
  icon: React.ComponentType<{ size?: number }>;
  accent: string;
  urgency: string;
  urgencyColor: string;
  title: string;
  body: string;
  cta: string;
  count?: string;
}

const recs: Rec[] = [
  {
    icon: CheckSquare,
    accent: "#e3000b",
    urgency: "Срочно",
    urgencyColor: "#e3000b",
    title: "15 заявок на внешние курсы ждут вашего решения",
    body: "Общая сумма: 1,2 млн ₽. 6 заявок просрочены более 3 дней. ИИ одобрил 9 автоматически, 6 требуют ручного согласования.",
    cta: "Обработать заявки",
    count: "15",
  },
  {
    icon: TrendingDown,
    accent: "#81d0f5",
    urgency: "Предиктив",
    urgencyColor: "#81d0f5",
    title: "12 сотрудников потеряют «Цифровую эффективность» через 3 мес.",
    body: "Модель прогнозирует снижение с 74% до 55%. Затронуты: Продажи (5 чел.), Юридический (4 чел.), Финансы (3 чел.).",
    cta: "Просмотреть прогноз",
  },
  {
    icon: BookOpen,
    accent: "#000000",
    urgency: "Рекомендация",
    urgencyColor: "#000000",
    title: "Рекомендуемый микс курсов для всей компании",
    body: "ИИ составил оптимальный учебный план: 3 внутренних + 2 внешних курса. Ожидаемый ROI: +28% к производительности. Бюджет: 340 тыс. ₽.",
    cta: "Просмотреть план",
  },
];

function RecCard({ rec }: { rec: Rec }) {
  const [hov, setHov] = useState(false);
  const idleBorder = rec.accent === "#000000" ? "rgba(0,0,0,0.12)" : `${rec.accent}40`;
  const hovBorder = rec.accent === "#000000" ? "rgba(0,0,0,0.22)" : `${rec.accent}66`;
  const iconBg = rec.accent === "#000000" ? "rgba(0,0,0,0.06)" : `${rec.accent}1A`;
  const iconBd = rec.accent === "#000000" ? "rgba(0,0,0,0.14)" : `${rec.accent}3A`;
  return (
    <div
      className="glass-card-md"
      style={{
        padding: "16px",
        cursor: "pointer",
        border: `1px solid ${hov ? hovBorder : idleBorder}`,
        transition: "all .2s",
        boxShadow: hov ? "0 8px 28px rgba(0,0,0,0.06)" : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "9px", marginBottom: "8px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: iconBg, border: `1px solid ${iconBd}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <rec.icon size={15} style={{ color: rec.accent === "#81d0f5" ? "#000000" : rec.accent }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "20px", background: `${rec.urgencyColor}14`, color: "#000000", border: `1px solid ${rec.urgencyColor}40` }}>{rec.urgency}</span>
            {rec.count && <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "20px", background: "rgba(227,0,11,0.1)", color: "#000000", border: "1px solid rgba(227,0,11,0.28)" }}>{rec.count} заявок</span>}
          </div>
          <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#000000", lineHeight: 1.35 }}>{rec.title}</div>
        </div>
      </div>
      <p style={{ fontSize: "11.5px", color: "#000000", lineHeight: 1.6, margin: "0 0 10px" }}>{rec.body}</p>
      <button
        type="button"
        style={{
          width: "100%",
          padding: "7px",
          borderRadius: "9px",
          background: rec.accent === "#000000" ? "rgba(0,0,0,0.05)" : `${rec.accent}18`,
          border: rec.accent === "#000000" ? "1px solid rgba(0,0,0,0.18)" : `1px solid ${rec.accent}45`,
          color: "#000000",
          fontSize: "11.5px",
          fontWeight: "700",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          transition: "background .15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = rec.accent === "#000000" ? "rgba(0,0,0,0.09)" : `${rec.accent}28`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = rec.accent === "#000000" ? "rgba(0,0,0,0.05)" : `${rec.accent}18`;
        }}
      >
        {rec.cta} <ChevronRight size={12} />
      </button>
    </div>
  );
}

/* ─── Main ─── */
export function HRAIPanel() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <AIAvatarBlock onChat={() => setChatOpen(true)} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "2px 0" }}>
          <Sparkles size={12} style={{ color: "#e3000b" }} />
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#000000", letterSpacing: "0.5px" }}>ИИ-РЕКОМЕНДАЦИИ И АВТОМАТИЗАЦИЯ</span>
        </div>
        {recs.map((r, i) => <RecCard key={i} rec={r} />)}
      </div>
      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
    </>
  );
}
