import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Sparkles, ChevronRight, TrendingDown, CheckSquare } from "lucide-react";
import {
  fetchHrOrgInsights,
  mergeInsightCards,
  type OrgInsightCard,
  type OrgInsightCardType,
  type OrgInsightsPayload,
} from "../../lib/yandexOrgInsights";

/* ─── Rec cards ─── */
const HR_FALLBACK_CARDS: OrgInsightCard[] = [
  {
    card_type: "urgent",
    title: "15 заявок на внешние курсы ждут вашего решения",
    body: "Общая сумма: 1,2 млн ₽. 6 заявок просрочены более 3 дней. ИИ одобрил 9 автоматически, 6 требуют ручного согласования.",
    cta: "Обработать заявки",
    count_badge: "15",
  },
  {
    card_type: "predictive",
    meta: "Прогноз на квартал",
    title: "12 сотрудников потеряют «Цифровую эффективность» через 3 мес.",
    body: "Алиса прогнозирует снижение с 74% до 55%. Затронуты: Продажи (5 чел.), Юридический (4 чел.), Финансы (3 чел.).",
    cta: "Просмотреть прогноз",
  },
  {
    card_type: "recommendation",
    title: "Рекомендуемый микс курсов для всей компании",
    body: "ИИ составил оптимальный учебный план: 3 внутренних + 2 внешних курса. Ожидаемая окупаемость: +28% к производительности. Бюджет: 340 тыс. ₽.",
    cta: "Просмотреть план",
  },
];

function hrCardAccent(t: OrgInsightCardType): string {
  if (t === "predictive") return "#81d0f5";
  if (t === "recommendation") return "#000000";
  return "#e3000b";
}

function hrUrgencyLabel(t: OrgInsightCardType): string {
  if (t === "predictive") return "Предиктив";
  if (t === "recommendation") return "Рекомендация";
  return "Срочно";
}

function HrInsightIcon({ t }: { t: OrgInsightCardType }) {
  if (t === "predictive") return <TrendingDown size={15} style={{ color: "#000000" }} />;
  if (t === "recommendation") return <BookOpen size={15} style={{ color: "#000000" }} />;
  return <CheckSquare size={15} style={{ color: "#e3000b" }} />;
}

function HrInsightCard({ card }: { card: OrgInsightCard }) {
  const [hov, setHov] = useState(false);
  const accent = hrCardAccent(card.card_type);
  const urgencyColor = accent;
  const idleBorder = accent === "#000000" ? "rgba(0,0,0,0.12)" : `${accent}40`;
  const hovBorder = accent === "#000000" ? "rgba(0,0,0,0.22)" : `${accent}66`;
  const iconBg = accent === "#000000" ? "rgba(0,0,0,0.06)" : `${accent}1A`;
  const iconBd = accent === "#000000" ? "rgba(0,0,0,0.14)" : `${accent}3A`;
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
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "9px",
            background: iconBg,
            border: `1px solid ${iconBd}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <HrInsightIcon t={card.card_type} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "500",
                padding: "2px 7px",
                borderRadius: "20px",
                background: `${urgencyColor}14`,
                color: "#000000",
                border: `1px solid ${urgencyColor}40`,
              }}
            >
              {hrUrgencyLabel(card.card_type)}
            </span>
            {card.count_badge ? (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  padding: "2px 7px",
                  borderRadius: "20px",
                  background: "rgba(227,0,11,0.1)",
                  color: "#000000",
                  border: "1px solid rgba(227,0,11,0.28)",
                }}
              >
                {card.count_badge} заявок
              </span>
            ) : null}
            {card.meta ? (
              <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>{card.meta}</span>
            ) : null}
          </div>
          <div style={{ fontSize: "12.5px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{card.title}</div>
        </div>
      </div>
      <p style={{ fontSize: "11.5px", color: "#000000", lineHeight: 1.6, margin: "0 0 10px" }}>{card.body}</p>
      <button
        type="button"
        style={{
          width: "100%",
          padding: "7px",
          borderRadius: "9px",
          background: accent === "#000000" ? "rgba(0,0,0,0.05)" : `${accent}18`,
          border: accent === "#000000" ? "1px solid rgba(0,0,0,0.18)" : `1px solid ${accent}45`,
          color: "#000000",
          fontSize: "11.5px",
          fontWeight: "500",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          transition: "background .15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            accent === "#000000" ? "rgba(0,0,0,0.09)" : `${accent}28`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            accent === "#000000" ? "rgba(0,0,0,0.05)" : `${accent}18`;
        }}
      >
        {card.cta} <ChevronRight size={12} />
      </button>
    </div>
  );
}

export type HrYandexInsightsStatus =
  | { state: "loading" }
  | { state: "live" }
  | { state: "demo"; reason?: string };

/* ─── Main ─── */
export function HRAIPanel({ onYandexStatusChange }: { onYandexStatusChange?: (s: HrYandexInsightsStatus) => void }) {
  const abortRef = useRef<AbortController | null>(null);
  const statusCbRef = useRef(onYandexStatusChange);
  statusCbRef.current = onYandexStatusChange;
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<OrgInsightsPayload | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    statusCbRef.current?.({ state: "loading" });
    fetchHrOrgInsights(ac.signal)
      .then((out) => {
        if (ac.signal.aborted) return;
        if (out.ok) {
          setInsights(out.data);
          statusCbRef.current?.({ state: "live" });
        } else {
          setInsights(null);
          statusCbRef.current?.({ state: "demo", reason: out.error });
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, []);

  const cards = mergeInsightCards(insights?.cards ?? [], HR_FALLBACK_CARDS);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px 0", flexWrap: "wrap" }}>
          <Sparkles size={12} style={{ color: "#e3000b" }} />
          <span style={{ fontSize: "11px", fontWeight: "500", color: "#000000", letterSpacing: "0.5px" }}>
            ИИ-РЕКОМЕНДАЦИИ И АВТОМАТИЗАЦИЯ
          </span>
          {loading ? (
            <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>Алиса обновляет вывод…</span>
          ) : null}
        </div>
        {cards.map((c, i) => (
          <HrInsightCard key={`${c.title}-${i}`} card={c} />
        ))}
      </div>
    </>
  );
}
