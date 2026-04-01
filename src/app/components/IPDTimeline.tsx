import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Clock, BookOpen, Award, Target, Cpu, Brain, TrendingUp } from "lucide-react";
import { brandIcon, type BrandLucideIcon } from "../lib/brandIcons";
import { buildIprTimelinePdfHtml, openPrintableReport } from "../lib/pdfExport";
import { submitTrainingApplication } from "../lib/trainingApplicationsStorage";
import { ROUTE_PATHS } from "../routePaths";

interface TimelineStep {
  id: number;
  period: string;
  dates: string;
  title: string;
  description: string;
  status: "done" | "in-progress" | "planned";
  icon: BrandLucideIcon;
  color: string;
  modules: string[];
  hours: number;
}

const steps: TimelineStep[] = [
  {
    id: 1,
    period: "Апрель 2026",
    dates: "1–30 апр",
    title: "Основы ML/AI",
    description: "Введение в машинное обучение",
    status: "in-progress",
    icon: Brain,
    color: "#e3000b",
    modules: ["Продвинутый Python", "Pandas и NumPy", "Scikit-learn"],
    hours: 40,
  },
  {
    id: 2,
    period: "Май 2026",
    dates: "1–31 май",
    title: "Архитектура",
    description: "Микросервисы и DDD",
    status: "planned",
    icon: Cpu,
    color: "#81d0f5",
    modules: ["Чистая архитектура", "Событийная модель", "Проектирование API"],
    hours: 24,
  },
  {
    id: 3,
    period: "Июнь 2026",
    dates: "1–30 июн",
    title: "Облачные сервисы",
    description: "Сертификация AWS (Professional)",
    status: "planned",
    icon: TrendingUp,
    color: "#e3000b",
    modules: ["EC2 и S3", "Lambda и SQS", "CloudFormation"],
    hours: 80,
  },
  {
    id: 4,
    period: "Июль–Авг 2026",
    dates: "1 июл – 31 авг",
    title: "Лидерство",
    description: "Управление командой и проектами",
    status: "planned",
    icon: Target,
    color: "#81d0f5",
    modules: ["Навыки тимлида", "Agile/Scrum", "OKR"],
    hours: 32,
  },
  {
    id: 5,
    period: "Сентябрь 2026",
    dates: "1–30 сен",
    title: "Аттестация",
    description: "Оценка компетенций Senior",
    status: "planned",
    icon: Award,
    color: "#000000",
    modules: ["Техническое интервью", "Обратная связь 360°", "Портфолио"],
    hours: 16,
  },
];

function StepCard({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  const isDone = step.status === "done";
  const isActive = step.status === "in-progress";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        position: "relative",
      }}
    >
      {/* Connector line */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "calc(50% + 20px)",
            right: "calc(-50% + 20px)",
            height: "2px",
            background: isDone
              ? "linear-gradient(90deg, #81d0f5, rgba(129,208,245,0.35))"
              : isActive
              ? "linear-gradient(90deg, #e3000b, rgba(129,208,245,0.45))"
              : "rgba(0,0,0,0.08)",
            zIndex: 0,
          }}
        />
      )}

      {/* Step node */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", zIndex: 1 }}>
        {/* Icon circle */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: isActive
              ? `linear-gradient(135deg, ${step.color}35, ${step.color}18)`
              : isDone
              ? "linear-gradient(135deg, rgba(129,208,245,0.35), rgba(129,208,245,0.15))"
              : `${step.color}12`,
            border: `2px solid ${isActive ? step.color : isDone ? "#81d0f5" : "rgba(0,0,0,0.1)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isActive
              ? `0 0 20px ${step.color}50, 0 0 40px ${step.color}25`
              : isDone
              ? "0 0 12px rgba(129,208,245,0.45)"
              : "none",
            transition: "all 0.3s ease",
            position: "relative",
          }}
        >
          {isDone ? (
            <CheckCircle size={20} color={brandIcon.accentCyan} strokeWidth={brandIcon.sw} />
          ) : (
            <step.icon
              size={20}
              color={isActive ? step.color : brandIcon.muted}
              strokeWidth={brandIcon.sw}
            />
          )}
          {isActive && (
            <div
              style={{
                position: "absolute",
                inset: "-4px",
                borderRadius: "50%",
                border: `1.5px solid ${step.color}40`,
                animation: "pulse-glow-blue 2s ease-in-out infinite",
              }}
            />
          )}
        </div>

        {/* Card */}
        <div
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "16px",
            background: isActive
              ? `linear-gradient(135deg, ${step.color}14, rgba(129,208,245,0.08))`
              : "#fafafa",
            border: `1px solid ${
              isActive ? `${step.color}40` : isDone ? "rgba(129,208,245,0.35)" : "rgba(0,0,0,0.08)"
            }`,
            backdropFilter: "blur(12px)",
            transition: "all 0.25s ease",
          }}
        >
          {/* Period label */}
          <div
            style={{
              fontSize: "10px",
              fontWeight: "500",
              color: isActive ? step.color : "#000000",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            {step.period}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: isActive ? "#000000" : "#000000",
              marginBottom: "3px",
              lineHeight: 1.3,
            }}
          >
            {step.title}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#000000",
              marginBottom: "10px",
            }}
          >
            {step.description}
          </div>

          {/* Modules */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
            {step.modules.map((mod) => (
              <div
                key={mod}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "10.5px",
                  color: "#000000",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: isActive ? step.color : "rgba(0,0,0,0.2)",
                    flexShrink: 0,
                  }}
                />
                {mod}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "8px",
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
                color: "#000000",
              }}
            >
              <Clock size={10} color={brandIcon.muted} strokeWidth={brandIcon.swSm} />
              {step.hours}ч
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: "500",
                padding: "3px 8px",
                borderRadius: "20px",
                background:
                  step.status === "in-progress"
                    ? `${step.color}25`
                    : step.status === "done"
                    ? "rgba(129,208,245,0.2)"
                    : "rgba(0,0,0,0.06)",
                color:
                  step.status === "in-progress"
                    ? step.color
                    : step.status === "done"
                    ? "#000000"
                    : "rgba(0,0,0,0.5)",
              }}
            >
              {step.status === "in-progress"
                ? "В процессе"
                : step.status === "done"
                ? "Завершено"
                : "Запланировано"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IPDTimeline() {
  const navigate = useNavigate();
  const [submitBusy, setSubmitBusy] = useState(false);
  const totalHours = steps.reduce((s, st) => s + st.hours, 0);

  const exportPdf = () => {
    const pdfSteps = steps.map((s) => ({
      period: s.period,
      dates: s.dates,
      title: s.title,
      description: s.description,
      statusLabel:
        s.status === "in-progress" ? "В процессе" : s.status === "done" ? "Завершено" : "Запланировано",
      modules: s.modules,
      hours: s.hours,
    }));
    openPrintableReport(
      "План развития 2026",
      buildIprTimelinePdfHtml("Александр Иванов", pdfSteps, totalHours, "20% завершено"),
    );
  };

  const sendForApproval = () => {
    if (submitBusy) return;
    setSubmitBusy(true);
    try {
      const cabinetUrl =
        typeof window !== "undefined" ? `${window.location.origin}${ROUTE_PATHS.employeeCabinet}` : ROUTE_PATHS.employeeCabinet;
      const planTitle = "Индивидуальный план развития (апрель — сентябрь 2026)";
      const planProvider = "ЕСО · индивидуальный план развития";
      submitTrainingApplication({
        title: "ИПР 2026 апр–сен",
        provider: planProvider,
        url: cabinetUrl,
        mentorType: "internal",
        typeLabelOverride: "ИПР / план развития",
        listTitle: planTitle,
      });
      navigate(ROUTE_PATHS.employeeIdp, {
        state: {
          pendingCourseApproval: {
            title: planTitle,
            provider: planProvider,
            url: cabinetUrl,
          },
        },
      });
    } finally {
      setSubmitBusy(false);
    }
  };

  return (
    <div
      className="glass-card cabinet-idp-ornament"
      style={{ padding: "26px 28px", marginTop: "16px" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "28px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, rgba(227,0,11,0.15), rgba(129,208,245,0.35))",
                border: "1px solid rgba(129,208,245,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={14} color={brandIcon.accentRed} strokeWidth={brandIcon.swSm} />
            </div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#000000",
                letterSpacing: "-0.3px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Рекомендуемый план развития
            </h3>
            <div
              style={{
                padding: "3px 10px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(227,0,11,0.08), rgba(129,208,245,0.14))",
                border: "1px solid rgba(129,208,245,0.35)",
                fontSize: "11px",
                fontWeight: "500",
                color: "#000000",
                fontFamily: "var(--font-sans)",
              }}
            >
              Апрель — Сентябрь 2026
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "#000000", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>
            Персонализирован ИИ на основе анализа компетенций, целей 2026 и данных руководителя
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "20px", flexShrink: 0 }}>
          {[
            { label: "Этапов", value: String(steps.length) },
            { label: "Часов обучения", value: String(totalHours) },
            { label: "Рост дохода", value: "+23%" },
            { label: "Вероятность успеха", value: "94%" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  background: "linear-gradient(135deg, #000000, #e3000b 45%, #81d0f5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                  marginBottom: "3px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "10px", color: "#000000", whiteSpace: "nowrap", fontFamily: "var(--font-sans)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar overall */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            fontSize: "11px",
            color: "#000000",
            fontFamily: "var(--font-sans)",
          }}
        >
          <span>Общий прогресс</span>
          <span style={{ color: "#e3000b", fontWeight: "500" }}>20% завершено</span>
        </div>
        <div
          style={{
            height: "6px",
            borderRadius: "6px",
            background: "rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "20%",
              height: "100%",
              background: "linear-gradient(90deg, #e3000b, #81d0f5)",
              borderRadius: "6px",
              boxShadow: "0 0 12px rgba(129,208,245,0.45)",
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>

      {/* Timeline steps */}
      <div style={{ display: "flex", gap: "20px", position: "relative", alignItems: "flex-start" }}>
        {steps.map((step, i) => (
          <StepCard key={step.id} step={step} isLast={i === steps.length - 1} />
        ))}
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "11.5px", color: "#000000", fontFamily: "var(--font-sans)" }}>
          💡 План автоматически обновляется при изменении приоритетов или прохождении курсов
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={exportPdf}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              background: "#fafafa",
              border: "1px solid rgba(0,0,0,0.12)",
              color: "#000000",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontWeight: "500",
            }}
          >
            Экспорт PDF
          </button>
          <button
            type="button"
            onClick={sendForApproval}
            disabled={submitBusy}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              background: submitBusy ? "rgba(227,0,11,0.45)" : "linear-gradient(135deg, #e3000b, #c40009)",
              border: "1px solid rgba(0,0,0,0.12)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "500",
              cursor: submitBusy ? "wait" : "pointer",
              fontFamily: "var(--font-sans)",
              boxShadow: "0 4px 14px rgba(227,0,11,0.28)",
            }}
          >
            {submitBusy ? "Отправка…" : "Отправить на согласование"}
          </button>
        </div>
      </div>
    </div>
  );
}