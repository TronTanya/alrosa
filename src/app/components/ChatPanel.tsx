import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import {
  Send,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle,
  Sparkles,
  FileText,
  BookOpen,
  Cpu,
  Users,
  TrendingUp,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { fetchIdpMentorPlan, type IdpMentorCourseJson } from "../lib/deepseekIdpMentor";
import { coursePageHref } from "../lib/courseUrls";
import { submitTrainingApplication } from "../lib/trainingApplicationsStorage";
import { brandIcon } from "../lib/brandIcons";

/* ─── Types ─── */
interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  time: string;
}

/* ─── AI Avatar (mini) ─── */
function AIAvatarMini() {
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #e3000b, #81d0f5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 0 16px rgba(227,0,11,0.22), 0 0 24px rgba(129,208,245,0.35)",
        border: "1.5px solid rgba(255,255,255,0.85)",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="5" y="3" width="10" height="9" rx="3.5" fill="white" opacity="0.95" />
        <circle cx="8" cy="7" r="1.2" fill="#000000" />
        <circle cx="12" cy="7" r="1.2" fill="#000000" />
        <path d="M8 10 Q10 12 12 10" stroke="#000000" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <rect x="6" y="13" width="8" height="6" rx="2.5" fill="white" opacity="0.85" />
      </svg>
    </div>
  );
}

/* ─── Course Card ─── */
function CourseCard({
  title,
  type,
  duration,
  roi,
  provider,
  slots,
  date,
  rating,
  participants,
  icon: Icon,
  gradient,
  delay,
  courseUrl,
}: {
  title: string;
  type: "internal" | "external";
  duration: string;
  roi: string;
  provider: string;
  slots: number;
  date: string;
  rating: number;
  participants: number;
  icon: React.ComponentType<{ size?: number }>;
  gradient: string;
  delay: number;
  /** Ссылка на курс или поиск */
  courseUrl: string;
}) {
  const navigate = useNavigate();
  const href = coursePageHref(courseUrl, title, provider);

  const onApprove = () => {
    submitTrainingApplication({ title, provider, url: href, mentorType: type });
    navigate("/idp", {
      state: {
        pendingCourseApproval: {
          title,
          provider,
          url: href,
        },
      },
    });
  };

  return (
    <div
      className="course-card fade-up"
      style={{ animationDelay: `${delay}ms`, cursor: "default" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          {/* Type badge */}
          <div
            style={{
              padding: "3px 9px",
              borderRadius: "20px",
              fontSize: "10px",
              fontWeight: "700",
              background: type === "internal" ? "rgba(129,208,245,0.2)" : "rgba(227,0,11,0.2)",
              border: `1px solid ${type === "internal" ? "rgba(129,208,245,0.35)" : "rgba(227,0,11,0.35)"}`,
              color: type === "internal" ? "#000000" : "#e3000b",
              letterSpacing: "0.3px",
            }}
          >
            {type === "internal" ? "Внутренний" : "Внешний"}
          </div>
          {/* ROI badge */}
          <div
            style={{
              padding: "3px 9px",
              borderRadius: "20px",
              fontSize: "10px",
              fontWeight: "700",
              background: "rgba(129,208,245,0.15)",
              border: "1px solid rgba(129,208,245,0.3)",
              color: "#000000",
            }}
          >
            ROI {roi}
          </div>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "13.5px",
          fontWeight: "700",
          color: "#000000",
          lineHeight: 1.35,
          marginBottom: "6px",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "11px", color: "#000000", marginBottom: "12px" }}>
        {provider}
      </div>

      {/* Meta info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#000000" }}>
          <Clock size={11} color={brandIcon.muted} strokeWidth={brandIcon.swSm} />
          <span>{duration}</span>
          <span style={{ color: "#000000" }}>·</span>
          <Users size={11} color={brandIcon.muted} strokeWidth={brandIcon.swSm} />
          <span>{participants} участников</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#000000" }}>
          <Calendar size={11} color={brandIcon.accentRed} strokeWidth={brandIcon.swSm} />
          <span style={{ color: "#000000", fontWeight: "600" }}>
            {slots} слота Outlook · {date}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "14px" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{ fontSize: "11px", color: i < Math.floor(rating) ? "#e3000b" : "#000000" }}
          >
            ★
          </span>
        ))}
        <span style={{ fontSize: "11px", color: "#000000", marginLeft: "4px" }}>{rating}</span>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(129,208,245,0.06)", marginBottom: "12px" }} />

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          onClick={onApprove}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #e3000b, #c40009)",
            border: "1px solid rgba(0,0,0,0.08)",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            boxShadow: "0 4px 14px rgba(227,0,11,0.28)",
            transition: "all 0.2s ease",
            fontFamily: "var(--font-sans)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(227,0,11,0.38)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(227,0,11,0.28)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <FileText size={12} color="#ffffff" strokeWidth={brandIcon.swSm} />
          На согласование
        </button>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть страницу курса"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(129,208,245,0.05)",
            border: "1px solid rgba(129,208,245,0.09)",
            color: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            flexShrink: 0,
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          <ExternalLink size={13} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
        </a>
      </div>
    </div>
  );
}

const MENTOR_GRADIENTS = [
  "linear-gradient(135deg, rgba(129,208,245,0.45), rgba(129,208,245,0.22))",
  "linear-gradient(135deg, rgba(227,0,11,0.35), rgba(129,208,245,0.2))",
  "linear-gradient(135deg, rgba(227,0,11,0.35), rgba(227,0,11,0.18))",
];

function mapIdpJsonToCourseCard(c: IdpMentorCourseJson, index: number) {
  const Icon = c.icon === "book" ? BookOpen : c.icon === "trending" ? TrendingUp : Cpu;
  const courseUrl = coursePageHref(c.url, c.title, c.provider);
  return {
    title: c.title,
    type: c.type,
    duration: c.duration,
    roi: c.roi,
    provider: c.provider,
    slots: c.slots,
    date: c.date,
    rating: c.rating,
    participants: c.participants,
    icon: Icon,
    gradient: MENTOR_GRADIENTS[index % MENTOR_GRADIENTS.length],
    delay: 200 + index * 150,
    courseUrl,
  };
}

const staticMentorCourses = [
  {
    title: "Машинное обучение: продвинутый уровень",
    type: "internal" as const,
    duration: "40 часов",
    roi: "+18%",
    provider: "Coursera · DeepLearning.AI",
    slots: 3,
    date: "15 апр 2026",
    rating: 4.8,
    participants: 24,
    icon: Cpu,
    gradient: MENTOR_GRADIENTS[0],
    delay: 200,
    courseUrl: "https://www.coursera.org/learn/machine-learning",
  },
  {
    title: "Архитектура микросервисов и DDD",
    type: "internal" as const,
    duration: "24 часа",
    roi: "+22%",
    provider: "Яндекс Практикум",
    slots: 2,
    date: "22 апр 2026",
    rating: 4.9,
    participants: 18,
    icon: BookOpen,
    gradient: MENTOR_GRADIENTS[1],
    delay: 350,
    courseUrl: "https://practicum.yandex.ru/backend-developer/",
  },
  {
    title: "AWS Solutions Architect Professional",
    type: "external" as const,
    duration: "80 часов",
    roi: "+31%",
    provider: "Coursera · AWS",
    slots: 5,
    date: "1 мая 2026",
    rating: 4.7,
    participants: 156,
    icon: TrendingUp,
    gradient: MENTOR_GRADIENTS[2],
    delay: 500,
    courseUrl: "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect",
  },
];

const DEFAULT_IDP_STATS = {
  competency_growth: "+34%",
  timeline: "6 мес.",
  ipr_fit: "96%",
};

function recommendationsLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} рекомендаций`;
  if (mod10 === 1) return `${n} рекомендация`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} рекомендации`;
  return `${n} рекомендаций`;
}

function isIdpUserRequest(msg: string): boolean {
  const m = msg.toLowerCase();
  return (
    m.includes("план развит") ||
    m.includes("построить план") ||
    (m.includes("план") && m.includes("6") && m.includes("месяц"))
  );
}

/* ─── AI Analysis Header ─── */
function AnalysisResult({
  stats = DEFAULT_IDP_STATS,
  courseCount = 3,
  fromDeepSeek = false,
}: {
  stats?: typeof DEFAULT_IDP_STATS;
  courseCount?: number;
  fromDeepSeek?: boolean;
}) {
  const statRows = [
    { label: "Рост компетенций", value: stats.competency_growth, icon: "📈" },
    { label: "Срок выполнения", value: stats.timeline, icon: "⏱" },
    { label: "Совместимость с целями", value: stats.ipr_fit, icon: "✓" },
  ];
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, rgba(227,0,11,0.06), rgba(129,208,245,0.12))",
        border: "1px solid rgba(129,208,245,0.28)",
        marginBottom: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "7px",
            background: "linear-gradient(135deg, #e3000b, #81d0f5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={12} color="#ffffff" strokeWidth={brandIcon.swSm} />
        </div>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#000000" }}>
          Результаты анализа · план на 6 месяцев
        </span>
        {fromDeepSeek ? (
          <span
            style={{
              marginLeft: "4px",
              padding: "2px 8px",
              borderRadius: "20px",
              fontSize: "9px",
              fontWeight: "700",
              background: "rgba(129,208,245,0.25)",
              border: "1px solid rgba(129,208,245,0.35)",
              color: "#000000",
            }}
          >
            DeepSeek
          </span>
        ) : null}
        <div
          style={{
            marginLeft: "auto",
            padding: "3px 9px",
            borderRadius: "20px",
            background: "rgba(129,208,245,0.15)",
            border: "1px solid rgba(129,208,245,0.25)",
            fontSize: "10px",
            fontWeight: "600",
            color: "#000000",
          }}
        >
          {recommendationsLabel(courseCount)}
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {statRows.map((stat) => (
          <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px" }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#000000", lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "10px", color: "#000000", lineHeight: 1.3 }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Chat Panel ─── */
const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Привет, Александр! 👋 Я проанализировал ваши 12 курсов, обратную связь от руководителя (Сергей Михайлов) и цели развития на 2026 год. Ваш текущий уровень — Middle+, цель к декабрю — Senior Engineer.\n\nГотов построить персональный план развития?",
    time: "14:32",
  },
];

export function ChatPanel() {
  const [mentorOpen, setMentorOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [displayCourses, setDisplayCourses] = useState(staticMentorCourses);
  const [idpStats, setIdpStats] = useState(DEFAULT_IDP_STATS);
  const [idpFromDeepSeek, setIdpFromDeepSeek] = useState(false);
  const idpAbortRef = useRef<AbortController | null>(null);
  /** Прокрутка только внутри области сообщений — не вызывать scrollIntoView (иначе прокручивается весь main). */
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);

  /** После обновления DOM scrollHeight может быть ещё старым — два rAF + layout effect */
  useLayoutEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const run = () => {
      el.scrollTop = el.scrollHeight;
    };
    run();
    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
  }, [messages, isTyping]);

  /** Подборка курсов в панели наставника — прокрутить тело панели */
  useLayoutEffect(() => {
    if (!showResults || !mentorOpen) return;
    const el = panelBodyRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      });
    });
  }, [showResults, displayCourses.length, mentorOpen]);

  useEffect(() => {
    if (!mentorOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(t);
  }, [mentorOpen]);

  useEffect(() => {
    if (!mentorOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMentorOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mentorOpen]);

  useEffect(() => {
    return () => idpAbortRef.current?.abort();
  }, []);

  const addAIResponse = (content: string, showCourses = false) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content,
          time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      if (showCourses) setShowResults(true);
    }, 1800);
  };

  const runDeepSeekIdp = useCallback((msg: string) => {
    idpAbortRef.current?.abort();
    const ac = new AbortController();
    idpAbortRef.current = ac;
    setIsTyping(true);

    fetchIdpMentorPlan(msg, ac.signal)
      .then((out) => {
        if (ac.signal.aborted) return;
        setIsTyping(false);
        const time = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });

        if (out.ok) {
          setIdpStats(out.data.stats);
          setDisplayCourses(out.data.courses.map((c, i) => mapIdpJsonToCourseCard(c, i)));
          setIdpFromDeepSeek(true);
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              role: "ai",
              content: out.data.intro,
              time,
            },
          ]);
          setShowResults(true);
        } else {
          setIdpStats(DEFAULT_IDP_STATS);
          setDisplayCourses(staticMentorCourses);
          setIdpFromDeepSeek(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              role: "ai",
              content: `DeepSeek сейчас недоступен (${out.error}). Ниже — демо-подбор курсов; проверьте ключ в .env и перезапустите npm run dev.`,
              time,
            },
          ]);
          setShowResults(true);
        }
      })
      .catch(() => {
        if (ac.signal.aborted) return;
        setIsTyping(false);
        const time = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
        setDisplayCourses(staticMentorCourses);
        setIdpFromDeepSeek(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: "Ошибка сети при обращении к ИИ. Показан демо-план.",
            time,
          },
        ]);
        setShowResults(true);
      });
  }, [showResults]);

  const handleSend = (text?: string) => {
    const msg = (text ?? inputValue).trim();
    if (!msg) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: msg,
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputValue("");

    if (isIdpUserRequest(msg)) {
      runDeepSeekIdp(msg);
      return;
    }
    if (msg.toLowerCase().includes("курс") || msg.toLowerCase().includes("обучен")) {
      setDisplayCourses(staticMentorCourses);
      setIdpStats(DEFAULT_IDP_STATS);
      setIdpFromDeepSeek(false);
      addAIResponse(
        "Вот подборка курсов на основе анализа вашего профиля и матрицы компетенций. Приоритет — ML/AI и облачные технологии для достижения Senior-уровня.",
        true
      );
    } else if (msg.toLowerCase().includes("outlook") || msg.toLowerCase().includes("календарь")) {
      addAIResponse(
        "Я проверил ваш Outlook-календарь. Доступные слоты: 15, 22 апреля и 1 мая. Все три курса можно пройти без конфликтов с вашими встречами. Записать автоматически? ✅"
      );
    } else if (msg.toLowerCase().includes("заявк")) {
      addAIResponse(
        "Заявка на обучение сгенерирована и отправлена на согласование руководителю (Сергей Михайлов). Ожидаемый срок ответа: 2 рабочих дня. Статус можно отслеживать в разделе «Заявки на обучение». 📋"
      );
    } else {
      addAIResponse(
        "Понял вас! Обрабатываю запрос на основе вашего профиля компетенций и данных платформы. Хотите, чтобы я подобрал конкретные курсы или проверил доступность в календаре?"
      );
    }
  };

  const handleChip = (chip: string) => {
    setActiveChip(chip);
    handleSend(chip);
    setTimeout(() => setActiveChip(null), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const panelContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {/* Chat container */}
      <div
        className="glass-card cabinet-chat-shell"
        style={{ display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}
      >
        {/* Chat Header */}
        <div
          className="cabinet-chat-header-ornament"
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, rgba(227,0,11,0.04), rgba(255,255,255,0.96))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <AIAvatarMini />
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#81d0f5",
                  border: "2px solid #000000",
                  boxShadow: "0 0 8px rgba(129,208,245,0.8)",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Ваш Цифровой Наставник
              </div>
              <div style={{ fontSize: "12px", color: "#000000", marginTop: "1px", fontFamily: "var(--font-sans)" }}>
                Персональный ИИ-помощник · Адаптирован под ваш профиль
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {["История", "Настройки"].map((label) => (
              <button
                key={label}
                type="button"
                style={{
                  padding: "6px 12px",
                  borderRadius: "9px",
                  background: "rgba(129,208,245,0.05)",
                  border: "1px solid rgba(129,208,245,0.08)",
                  color: "#000000",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontWeight: "500",
                }}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setMentorOpen(false)}
              aria-label="Закрыть панель наставника"
              style={{
                marginLeft: "4px",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "rgba(0,0,0,0.04)",
                color: "#000000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={18} strokeWidth={brandIcon.sw} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={messagesScrollRef}
          className="custom-scroll chat-messages-scroll"
          style={{
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            /* Явная высота + minHeight:0 — иначе во flex колесо мыши не прокручивает overflow (min-height:auto) */
            height: "min(340px, 42vh)",
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            flexShrink: 1,
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          {/* Context pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
            {[
              { label: "12 курсов изучено", color: "#000000" },
              { label: "Feedback от руководителя", color: "#000000" },
              { label: "Цели 2026 загружены", color: "#000000" },
              { label: "Outlook подключён", color: "#e3000b" },
            ].map((pill) => (
              <div
                key={pill.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  background: `${pill.color}18`,
                  border: `1px solid ${pill.color}35`,
                  fontSize: "11px",
                  color: `${pill.color}`,
                  fontWeight: "500",
                }}
              >
                <CheckCircle size={9} color={pill.color} strokeWidth={brandIcon.swSm} />
                {pill.label}
              </div>
            ))}
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
              }}
            >
              {msg.role === "ai" ? (
                <AIAvatarMini />
              ) : (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #e3000b, #81d0f5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  АИ
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "85%" }}>
                <div className={msg.role === "ai" ? "msg-ai" : "msg-user"}>
                  {msg.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#000000",
                    textAlign: msg.role === "user" ? "right" : "left",
                    paddingLeft: msg.role === "ai" ? "2px" : 0,
                    paddingRight: msg.role === "user" ? "2px" : 0,
                  }}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <AIAvatarMini />
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "0 16px 16px 16px",
                  background: "rgba(129,208,245,0.12)",
                  border: "1px solid rgba(129,208,245,0.2)",
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Action chips */}
        <div
          style={{
            padding: "12px 22px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            background: "rgba(129,208,245,0.04)",
          }}
        >
          {[
            { label: "Построить план на 6 месяцев", primary: true, icon: "🗺" },
            { label: "Подобрать курсы", primary: false, icon: "📚" },
            { label: "Проверить Outlook", primary: false, icon: "📅" },
            { label: "Сгенерировать заявку", primary: false, icon: "📋" },
          ].map(({ label, primary, icon }) => (
            <button
              key={label}
              className={`action-chip ${primary ? "primary" : ""}`}
              style={{
                opacity: activeChip === label ? 0.7 : 1,
                transform: activeChip === label ? "scale(0.97)" : "scale(1)",
              }}
              onClick={() => handleChip(label)}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            gap: "10px",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              flex: 1,
              position: "relative",
              borderRadius: "14px",
              background: "rgba(129,208,245,0.05)",
              border: "1px solid rgba(129,208,245,0.09)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(129,208,245,0.45)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(129,208,245,0.12)";
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(129,208,245,0.09)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Спросите что-нибудь или выберите действие выше..."
              rows={1}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                color: "#000000",
                fontSize: "13.5px",
                fontFamily: "var(--font-sans)",
                padding: "12px 16px",
                lineHeight: 1.5,
              }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "13px",
              background: inputValue.trim()
                ? "linear-gradient(135deg, #e3000b, #81d0f5)"
                : "rgba(129,208,245,0.08)",
              border: "none",
              color: inputValue.trim() ? "#ffffff" : "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: inputValue.trim() ? "pointer" : "default",
              transition: "all 0.2s ease",
              boxShadow: inputValue.trim() ? "0 4px 16px rgba(227,0,11,0.25), 0 4px 20px rgba(129,208,245,0.35)" : "none",
              flexShrink: 0,
            }}
          >
            <Send size={16} color="#ffffff" strokeWidth={brandIcon.sw} />
          </button>
        </div>
      </div>

      {/* Course Recommendations */}
      {showResults && (
        <div className="fade-up">
          <AnalysisResult
            stats={idpStats}
            courseCount={displayCourses.length}
            fromDeepSeek={idpFromDeepSeek}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "14px",
            }}
          >
            {displayCourses.map((course, idx) => (
              <CourseCard key={`${course.title}-${idx}`} {...course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {!mentorOpen ? (
        <button
          type="button"
          className="mentor-fab"
          onClick={() => setMentorOpen(true)}
          aria-label="Открыть цифрового наставника — задать вопрос"
          title="Цифровой наставник"
        >
          ?
        </button>
      ) : null}

      {mentorOpen ? (
        <>
          <div
            className="mentor-chat-backdrop"
            aria-hidden
            onClick={() => setMentorOpen(false)}
          />
          <div
            className="mentor-chat-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mentor-chat-title"
          >
            <div ref={panelBodyRef} className="mentor-chat-panel__scroll custom-scroll">
              <div id="mentor-chat-title" className="sr-only">
                Цифровой наставник
              </div>
              {panelContent}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}