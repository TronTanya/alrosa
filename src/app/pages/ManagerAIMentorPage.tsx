import React, { useState } from "react";
import { motion } from "motion/react";
import { BrainCircuit, Sparkles, Zap, MessageSquare, Users, AlertTriangle } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";

const QUICK_PROMPTS = [
  "Кто в риске по ИПР?",
  "Сводка по отделам",
  "Рекомендации на неделю",
];

export function ManagerAIMentorPage() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<{ role: "ai" | "user"; text: string }[]>([
    {
      role: "ai",
      text: "Привет, Максим! Я анализирую команду из 15 человек. Могу подсказать риски по ИПР, компетенциям и нагрузке. О чём поговорим?",
    },
  ]);
  const [typing, setTyping] = useState(false);

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMsgs((p) => [...p, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((p) => [
        ...p,
        {
          role: "ai",
          text: "По демо-данным: Анна Волкова и Ольга Попова отстают по плану; DevOps и Design — ниже среднего по часам. Могу сформировать список встреч 1:1.",
        },
      ]);
    }, 1400);
  };

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "0 4px" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              width: "4px",
              height: "26px",
              borderRadius: "6px",
              background: "linear-gradient(180deg, #e3000b, #81d0f5)",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
              <BrainCircuit size={22} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
              <h1
                style={{
                  fontSize: "clamp(20px, 2vw, 1.4rem)",
                  fontWeight: 800,
                  color: "#000000",
                  margin: 0,
                  lineHeight: 1.15,
                  fontFamily: "var(--font-sans)",
                }}
              >
                ИИ-Наставник
              </h1>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "rgba(129,208,245,0.14)",
                  border: "1px solid rgba(129,208,245,0.4)",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#000000",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: brandIcon.accentCyan,
                    boxShadow: "0 0 8px rgba(129,208,245,0.8)",
                  }}
                />
                Live · команда 15 чел.
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.55, maxWidth: "640px" }}>
              Диалог с цифровым наставником по метрикам команды, рискам и обучению — в контексте руководителя (Максим Лебедев).
            </p>
          </div>
        </div>
      </motion.div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(0,0,0,0.1)",
              background: "rgba(0,0,0,0.03)",
              fontSize: "12px",
              fontWeight: 600,
              color: "#000000",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card-bright"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(129,208,245,0.35)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "linear-gradient(135deg, rgba(227,0,11,0.04), rgba(129,208,245,0.08))",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg,#e3000b,#81d0f5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageSquare size={20} color="#ffffff" strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#000000" }}>Чат с наставником команды</div>
            <div style={{ fontSize: "11px", color: brandIcon.accentCyan, fontWeight: 600 }}>● готов к диалогу</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "rgba(0,0,0,0.45)" }}>
            <Users size={14} /> 15
          </div>
        </div>

        <div style={{ padding: "16px 18px", maxHeight: "min(420px, 50vh)", overflowY: "auto" }} className="custom-scroll">
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", flexDirection: m.role === "user" ? "row-reverse" : "row", marginBottom: "12px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: m.role === "ai" ? "linear-gradient(135deg,#e3000b,#81d0f5)" : "linear-gradient(135deg,#81d0f5,#e3000b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {m.role === "ai" ? "AI" : "МЛ"}
              </div>
              <div className={m.role === "ai" ? "msg-ai" : "msg-user"} style={{ maxWidth: "85%", fontSize: "13px" }}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#e3000b,#81d0f5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff" }}>AI</span>
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "0 12px 12px 12px",
                  background: "rgba(129,208,245,0.12)",
                  border: "1px solid rgba(129,208,245,0.35)",
                  display: "flex",
                  gap: "4px",
                }}
              >
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Спросить о команде, ИПР, рисках..."
            style={{
              flex: 1,
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "12px",
              color: "#000000",
              padding: "11px 14px",
              fontSize: "13px",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => send()}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg,#e3000b,#81d0f5)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label="Отправить"
          >
            <Zap size={18} />
          </button>
        </div>
      </motion.div>

      <div
        style={{
          marginTop: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {[
          { icon: AlertTriangle, label: "Зоны риска", val: "3", sub: "по компетенциям" },
          { icon: Sparkles, label: "Рекомендаций", val: "12", sub: "за неделю" },
          { icon: Users, label: "Проверок 1:1", val: "4", sub: "запланировано" },
        ].map((c) => (
          <div key={c.label} className="glass-card-md" style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <c.icon size={16} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(0,0,0,0.55)" }}>{c.label}</span>
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#000000" }}>{c.val}</div>
            <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)", marginTop: "2px" }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
