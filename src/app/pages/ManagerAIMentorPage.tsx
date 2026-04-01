import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { motion } from "motion/react";
import { BrainCircuit, Sparkles, Zap, MessageSquare, Users, AlertTriangle } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { MANAGER_TEAM_MEMBERS, MANAGER_TEAM_SIZE } from "../data/managerTeamCatalog";
import { fetchManagerMentorChatReply } from "../lib/yandexOrgInsights";
import { getYandexLlmTransport } from "../lib/yandexLlmClientInfo";

const QUICK_PROMPTS = [
  "Кто в риске по ИПР?",
  "Сводка по отделам",
  "Рекомендации на неделю",
];

export function ManagerAIMentorPage() {
  const llmTransport = getYandexLlmTransport();
  const chatAbortRef = useRef<AbortController | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const employeeFromUrl = searchParams.get("employee")?.trim() ?? "";

  const contextualMember = useMemo(
    () => MANAGER_TEAM_MEMBERS.find((m) => m.fullName === employeeFromUrl),
    [employeeFromUrl],
  );

  const welcomeText = useMemo(() => {
    const base = `Привет, Максим! Я анализирую команду из ${MANAGER_TEAM_SIZE} человек. Могу подсказать риски по ИПР, компетенциям и нагрузке. О чём поговорим?`;
    if (!contextualMember) return base;
    return `${base}\n\nОткрыт контекст: ${contextualMember.fullName} (${contextualMember.dept}) — последний курс: «${contextualMember.lastCourse}», прогресс обучения ${contextualMember.progress}%. Спросите об этом сотруднике или снимите контекст кнопкой ниже.`;
  }, [contextualMember]);

  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [typing, setTyping] = useState(false);

  useLayoutEffect(() => {
    setMsgs([{ role: "ai", text: welcomeText }]);
  }, [welcomeText]);

  useEffect(() => {
    return () => {
      chatAbortRef.current?.abort();
    };
  }, []);

  const clearEmployeeContext = () => {
    setSearchParams({});
  };

  const send = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    chatAbortRef.current?.abort();
    chatAbortRef.current = new AbortController();
    const { signal } = chatAbortRef.current;
    const nextThread = [...msgs, { role: "user" as const, text: t }];
    setMsgs(nextThread);
    setInput("");
    setTyping(true);
    const contextualNote = contextualMember
      ? `${contextualMember.fullName} (${contextualMember.dept}) — последний курс: «${contextualMember.lastCourse}», прогресс ${contextualMember.progress}%`
      : undefined;
    try {
      const out = await fetchManagerMentorChatReply(nextThread, { signal, contextualNote });
      if (signal.aborted) return;
      if (out.ok) {
        setMsgs((prev) => [...prev, { role: "ai", text: out.content.trim() }]);
      } else {
        setMsgs((prev) => [
          ...prev,
          {
            role: "ai",
            text: `Не удалось получить ответ от Яндекс GPT: ${out.reason}\n\nПроверьте ключ Yandex Cloud: в корне проекта в .env задайте YANDEX_CLOUD_API_KEY (или для теста VITE_YANDEX_CLOUD_API_KEY) и перезапустите npm run dev.`,
          },
        ]);
      }
    } catch (e) {
      if (signal.aborted) return;
      const msg = e instanceof Error ? e.message : String(e);
      setMsgs((prev) => [...prev, { role: "ai", text: `Ошибка запроса: ${msg}` }]);
    } finally {
      if (!signal.aborted) setTyping(false);
    }
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
                  fontWeight: 600,
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
                  fontWeight: 500,
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
                Live · команда {MANAGER_TEAM_SIZE} чел.
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "rgba(255,204,0,0.18)",
                  border: "1px solid rgba(255,200,0,0.45)",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#000000",
                }}
                title="Yandex Foundation Models"
              >
                ЯндексGPT
                {llmTransport === "browser_api_key" ? " · ключ в браузере" : ""}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.55, maxWidth: "640px" }}>
              Ответы формирует модель Yandex Foundation Models по данным команды из портала. Нужен{" "}
              <code style={{ fontSize: "11px" }}>YANDEX_CLOUD_API_KEY</code> в <code style={{ fontSize: "11px" }}>.env</code> (прокси{" "}
              <code style={{ fontSize: "11px" }}>/yandex-llm-api</code> в режиме разработки). Диалог в контексте руководителя (Максим Лебедев).
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
              fontWeight: 500,
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
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#000000" }}>Чат с наставником команды</div>
            <div style={{ fontSize: "11px", color: brandIcon.accentCyan, fontWeight: 500 }}>● готов к диалогу</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "rgba(0,0,0,0.45)" }}>
            <Users size={14} /> {MANAGER_TEAM_SIZE}
          </div>
        </div>

        {contextualMember && (
          <div
            style={{
              padding: "10px 18px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
              background: "rgba(129,208,245,0.08)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#000000" }}>
              <strong>Контекст:</strong> {contextualMember.fullName} · {contextualMember.dept}
            </span>
            <button
              type="button"
              onClick={clearEmployeeContext}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                fontSize: "11px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Снять контекст
            </button>
          </div>
        )}

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
                  fontWeight: 500,
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
                <span style={{ fontSize: "10px", fontWeight: 500, color: "#fff" }}>AI</span>
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
              <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.55)" }}>{c.label}</span>
            </div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#000000" }}>{c.val}</div>
            <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)", marginTop: "2px" }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
