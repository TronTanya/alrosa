import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { FileText, CheckCircle2 } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { useLocation } from "react-router";
import {
  formatRuDateShort,
  readStoredTrainingApplications,
  TRAINING_APPLICATIONS_UPDATED,
} from "../lib/trainingApplicationsStorage";

type AppStatus = "На согласовании" | "Одобрено" | "В работе" | "Завершено" | "Отклонено";

const applications: {
  id: string;
  title: string;
  type: string;
  date: string;
  status: AppStatus;
  highlight?: boolean;
}[] = [
  {
    id: "1",
    title: "Курс «Продвинутый Kubernetes»",
    type: "Внешнее обучение",
    date: "28.03.2026",
    status: "На согласовании",
  },
  {
    id: "2",
    title: "Сертификация AWS Solutions Architect",
    type: "Сертификация",
    date: "12.02.2026",
    status: "Одобрено",
  },
  {
    id: "3",
    title: "Тренинг по презентациям для ИТ",
    type: "Soft Skills",
    date: "05.01.2026",
    status: "Завершено",
  },
];

const statusStyle: Record<AppStatus, { bg: string; color: string; border: string }> = {
  "На согласовании": { bg: "rgba(227,0,11,.1)", color: "#e3000b", border: "rgba(227,0,11,.28)" },
  Одобрено: { bg: "rgba(129,208,245,.16)", color: "#000000", border: "rgba(129,208,245,.4)" },
  "В работе": { bg: "rgba(129,208,245,.1)", color: "#000000", border: "rgba(129,208,245,.28)" },
  Завершено: { bg: "rgba(0,0,0,.88)", color: "#ffffff", border: "rgba(0,0,0,.2)" },
  Отклонено: { bg: "rgba(227,0,11,.08)", color: "#e3000b", border: "rgba(227,0,11,.35)" },
};

type IdpLocationState = {
  pendingCourseApproval?: { title: string; provider: string; url: string };
};

export function IdpApplicationsPage() {
  const location = useLocation();
  const pendingApproval = (location.state as IdpLocationState | null)?.pendingCourseApproval;
  const [storedTick, setStoredTick] = useState(0);

  useEffect(() => {
    const bump = () => setStoredTick((t) => t + 1);
    window.addEventListener(TRAINING_APPLICATIONS_UPDATED, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(TRAINING_APPLICATIONS_UPDATED, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const mergedApplications = useMemo(() => {
    const storedRows = readStoredTrainingApplications().map((s) => ({
      id: `stored-${s.id}`,
      title: `Курс «${s.title}»`,
      type: s.typeLabel,
      date: formatRuDateShort(s.submittedAt),
      status: "На согласовании" as AppStatus,
      highlight: true as const,
    }));
    return [...storedRows, ...applications];
  }, [storedTick]);

  const pendingApprovalCount = mergedApplications.filter((a) => a.status === "На согласовании").length;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              width: "4px",
              height: "26px",
              borderRadius: "4px",
              background: "linear-gradient(180deg,#e3000b,#81d0f5)",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#000000",
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.2,
                fontFamily: "var(--font-sans)",
              }}
            >
              Заявки на обучение
            </h1>
            <p style={{ fontSize: "13px", color: "#000000", margin: "8px 0 0", lineHeight: 1.55, maxWidth: "720px", fontFamily: "var(--font-sans)" }}>
              Статусы обновляются после согласования с руководителем и L&amp;D.
            </p>
          </div>
        </div>
      </motion.div>

      {pendingApproval ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: "16px",
            padding: "14px 18px",
            borderRadius: "14px",
            border: "1px solid rgba(129,208,245,.35)",
            background: "linear-gradient(135deg, rgba(129,208,245,.12), rgba(227,0,11,.06))",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <CheckCircle2
            size={20}
            color={brandIcon.accentRed}
            strokeWidth={brandIcon.swLg}
            style={{ flexShrink: 0, marginTop: "1px" }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", marginBottom: "4px" }}>
              Курс отправлен на согласование
            </div>
            <div style={{ fontSize: "12px", color: "#000000", lineHeight: 1.5 }}>
              «{pendingApproval.title}» ({pendingApproval.provider}) — заявка добавлена в список ниже и в очередь HR (в этом
              демо данные хранятся в браузере).
            </div>
          </div>
        </motion.div>
      ) : null}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <div style={{ overflowX: "auto", borderRadius: "16px", padding: "1px" }}>
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.08)",
              overflow: "hidden",
              background: "#ffffff",
              minWidth: "520px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(129,208,245,0.12)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.9fr 0.7fr 0.9fr",
                gap: "12px",
                padding: "14px 18px",
                fontSize: "11px",
                fontWeight: "700",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-sans)",
                background: "linear-gradient(180deg, #fafafa 0%, #f5f5f7 100%)",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <span style={{ opacity: 0.75 }}>Заявка</span>
              <span style={{ opacity: 0.75 }}>Тип</span>
              <span style={{ opacity: 0.75 }}>Дата</span>
              <span style={{ opacity: 0.75 }}>Статус</span>
            </div>
            {mergedApplications.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.9fr 0.7fr 0.9fr",
                  gap: "12px",
                  padding: "15px 18px",
                  alignItems: "center",
                  borderBottom: i < mergedApplications.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  background: a.highlight
                    ? "linear-gradient(90deg, rgba(227,0,11,.04) 0%, rgba(129,208,245,.08) 100%)"
                    : i % 2 === 1
                      ? "rgba(0,0,0,0.02)"
                      : "#ffffff",
                  borderLeft: a.highlight ? "3px solid #e3000b" : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flexWrap: "wrap" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: a.highlight ? "rgba(227,0,11,.1)" : "rgba(129,208,245,.14)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={17} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#000000", fontFamily: "var(--font-sans)", lineHeight: 1.35 }}>
                    {a.title}
                  </span>
                  {a.highlight && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "800",
                        letterSpacing: "0.06em",
                        color: "#ffffff",
                        background: "#e3000b",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        flexShrink: 0,
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      NEW
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#000000", fontFamily: "var(--font-sans)" }}>{a.type}</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#000000", fontFamily: "var(--font-sans)", fontVariantNumeric: "tabular-nums" }}>{a.date}</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: statusStyle[a.status].bg,
                    color: statusStyle[a.status].color,
                    border: `1px solid ${statusStyle[a.status].border}`,
                    justifySelf: "start",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {a.status}
                </span>
              </motion.div>
            ))}
          </div>
          </div>
          <p style={{ fontSize: "12px", color: "#000000", marginTop: "14px", lineHeight: 1.55, fontFamily: "var(--font-sans)", maxWidth: "640px" }}>
            {pendingApprovalCount > 0
              ? `Напоминание: ${pendingApprovalCount} ${pendingApprovalCount === 1 ? "заявка ожидает" : "заявок ожидают"} согласования — отмечены в списке (NEW).`
              : "Все заявки в работе или завершены."}
          </p>
        </motion.div>
    </>
  );
}
