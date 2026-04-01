import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, BookOpen, TrendingDown, ChevronRight, Sparkles } from "lucide-react";
import { brandIcon } from "../../lib/brandIcons";
import { ROUTE_PATHS } from "../../routePaths";
import {
  enrollTeamWideCourse,
  isTeamWideCourseEnrolled,
  TEAM_AGILE_COURSE_ID,
  TEAM_WIDE_COURSES_UPDATED,
} from "../../lib/teamWideCourseEnrollment";
import {
  fetchManagerOrgInsights,
  mergeInsightCards,
  type OrgInsightCard,
  type OrgInsightCardType,
} from "../../lib/yandexOrgInsights";

const MANAGER_FALLBACK_CARDS: OrgInsightCard[] = [
  {
    card_type: "urgent",
    title: "3 сотрудника теряют навык «Цифровая эффективность»",
    body: "Анна Волкова (38), Сергей Морозов (72→55), Ольга Попова (62) — показатели снизились за 30 дней. Необходимо вмешательство.",
    cta: "Назначить обучение",
    meta: "Обнаружено сегодня, 08:14",
  },
  {
    card_type: "recommendation",
    title: "Курс для всей команды: «Agile & Data-Driven Decisions»",
    body: "Средний уровень по методологиям Agile/Scrum в команде — 67%. Курс повысит синхронизацию и ускорит спринты. Окупаемость: +18% к продуктивности.",
    cta: "Записать команду",
    meta: "16 часов · 15 апреля 2026",
  },
  {
    card_type: "predictive",
    title: "Риск выгорания у 4 сотрудников через 2 месяца",
    body: "Алиса (предиктивный анализ): Козлов, Лебедев, Морозов, Попова — признаки перегрузки. Рекомендую 1:1 встречи и перераспределение задач.",
    cta: "Просмотреть анализ",
    meta: "Прогноз на май–июнь 2026",
  },
];

function managerAccent(t: OrgInsightCardType): { accent: string; glow: string } {
  if (t === "predictive") return { accent: "#d97706", glow: "rgba(217,119,6,0.2)" };
  if (t === "recommendation") return { accent: brandIcon.accentCyan, glow: "rgba(129,208,245,0.35)" };
  return { accent: brandIcon.accentRed, glow: "rgba(227,0,11,0.2)" };
}

function ManagerInsightIcon({ t }: { t: OrgInsightCardType }) {
  if (t === "predictive") return <TrendingDown size={16} style={{ color: "#d97706" }} />;
  if (t === "recommendation") return <BookOpen size={16} style={{ color: brandIcon.accentCyan }} />;
  return <AlertTriangle size={16} style={{ color: brandIcon.accentRed }} />;
}

function managerUrgencyLabel(t: OrgInsightCardType): string {
  if (t === "predictive") return "Предиктив";
  if (t === "recommendation") return "Рекомендация";
  return "Срочно";
}

/** Кнопка записи команды на Agile — только если карточка явно про эту программу (как в демо). */
function shouldOfferTeamAgileEnroll(card: OrgInsightCard): boolean {
  if (card.card_type !== "recommendation") return false;
  const s = `${card.title} ${card.body} ${card.cta}`.toLowerCase();
  return /agile|агил|data-driven|команд/i.test(s);
}

/** Куда вести по CTA, если это не запись на командный Agile-курс */
function navigationPathForCard(card: OrgInsightCard): string {
  if (card.card_type === "predictive") return ROUTE_PATHS.managerAnalytics;
  const text = `${card.cta} ${card.title} ${card.body}`.toLowerCase();
  if (/отчёт|report|достижен|сертификат/i.test(text)) return ROUTE_PATHS.managerReports;
  if (/компетенц|навык|матриц/i.test(text)) return ROUTE_PATHS.managerCompetencies;
  return ROUTE_PATHS.managerCourses;
}

function ManagerInsightCard({
  card,
  teamCourseEnrolled,
  onEnrollTeam,
}: {
  card: OrgInsightCard;
  teamCourseEnrolled: boolean;
  onEnrollTeam?: () => void;
}) {
  const navigate = useNavigate();
  const { accent, glow } = managerAccent(card.card_type);
  const isTeamCta = Boolean(onEnrollTeam) && shouldOfferTeamAgileEnroll(card);
  const done = isTeamCta && teamCourseEnrolled;

  const handleCta = () => {
    if (done) return;
    if (isTeamCta && onEnrollTeam) {
      onEnrollTeam();
      return;
    }
    navigate(navigationPathForCard(card));
  };

  return (
    <div
      className="glass-card-md"
      style={{
        padding: "18px",
        cursor: "pointer",
        transition: "all .2s ease",
        border: `1px solid ${accent}28`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(0,0,0,.08), 0 0 16px ${glow}`;
        (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}45`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}28`;
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: `${accent}18`,
            border: `1px solid ${accent}32`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ManagerInsightIcon t={card.card_type} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "500",
                padding: "2px 8px",
                borderRadius: "20px",
                background: `${accent}14`,
                color: accent,
                border: `1px solid ${accent}28`,
              }}
            >
              {managerUrgencyLabel(card.card_type)}
            </span>
            {card.meta ? <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>{card.meta}</span> : null}
          </div>
          <div style={{ fontSize: "13px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{card.title}</div>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.55)", lineHeight: 1.6, margin: "0 0 12px" }}>{card.body}</p>

      <button
        type="button"
        disabled={done}
        onClick={(e) => {
          e.stopPropagation();
          handleCta();
        }}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "10px",
          background: done ? "rgba(0,0,0,0.06)" : `${accent}12`,
          border: `1px solid ${done ? "rgba(0,0,0,0.1)" : `${accent}30`}`,
          color: done ? "rgba(0,0,0,0.45)" : accent,
          fontSize: "12px",
          fontWeight: "500",
          cursor: done ? "default" : "pointer",
          fontFamily: "var(--font-sans)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          transition: "all .18s",
        }}
        onMouseEnter={(e) => {
          if (done) return;
          (e.currentTarget as HTMLButtonElement).style.background = `${accent}22`;
        }}
        onMouseLeave={(e) => {
          if (done) return;
          (e.currentTarget as HTMLButtonElement).style.background = `${accent}12`;
        }}
      >
        {done ? "Команда записана" : card.cta}
        {!done ? <ChevronRight size={13} /> : null}
      </button>
    </div>
  );
}

export function AIRecommendations() {
  const abortRef = useRef<AbortController | null>(null);
  const [teamAgileEnrolled, setTeamAgileEnrolled] = useState(() => isTeamWideCourseEnrolled(TEAM_AGILE_COURSE_ID));
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<OrgInsightCard[]>(MANAGER_FALLBACK_CARDS);

  useEffect(() => {
    const sync = () => setTeamAgileEnrolled(isTeamWideCourseEnrolled(TEAM_AGILE_COURSE_ID));
    window.addEventListener(TEAM_WIDE_COURSES_UPDATED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(TEAM_WIDE_COURSES_UPDATED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    fetchManagerOrgInsights(ac.signal)
      .then((out) => {
        if (ac.signal.aborted) return;
        if (out.ok) setCards(mergeInsightCards(out.data.cards, MANAGER_FALLBACK_CARDS));
        else setCards(MANAGER_FALLBACK_CARDS);
      })
      .catch(() => {
        if (!ac.signal.aborted) setCards(MANAGER_FALLBACK_CARDS);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, []);

  const enrollAgileTeam = () => {
    if (enrollTeamWideCourse(TEAM_AGILE_COURSE_ID)) setTeamAgileEnrolled(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
        <Sparkles size={13} style={{ color: brandIcon.accentRed }} />
        <span style={{ fontSize: "12px", fontWeight: "500", color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px" }}>
          ИИ-РЕКОМЕНДАЦИИ
        </span>
        {loading ? (
          <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)" }}>Алиса · данные команды…</span>
        ) : null}
      </div>
      {cards.map((c, i) => (
        <ManagerInsightCard
          key={`${c.title}-${i}`}
          card={c}
          teamCourseEnrolled={teamAgileEnrolled}
          onEnrollTeam={enrollAgileTeam}
        />
      ))}
    </div>
  );
}
