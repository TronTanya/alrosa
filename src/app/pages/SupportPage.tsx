import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Mail, Phone, MessageCircle, ChevronDown, Clock, BookOpen } from "lucide-react";

const faq = [
  {
    q: "Как сбросить прогресс по курсу?",
    a: "Обратитесь в L&D через заявку в разделе «Заявки на обучение» или напишите на eso-support@company.ru — укажите название курса и причину сброса.",
  },
  {
    q: "ИИ-наставник не отвечает или выдаёт ошибку",
    a: "Проверьте сеть и обновите страницу. Если проблема сохраняется, создайте обращение в поддержку ЕСО с скриншотом и временем сбоя.",
  },
  {
    q: "Где посмотреть статусы заявок?",
    a: "Раздел «Заявки на обучение»: таблица со всеми заявками и текущими статусами согласования.",
  },
  {
    q: "Как связаться с HR по обучению?",
    a: "Корпоративная почта hr-learning@company.ru или внутренний канал #l-and-d в корпоративном мессенджере.",
  },
];

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(129,208,245,.06)",
              border: "1px solid rgba(129,208,245,.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <HelpCircle size={24} style={{ color: "#000000" }} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "21px",
                fontWeight: "800",
                color: "#fff",
                letterSpacing: "-0.4px",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Поддержка
            </h1>
            <p style={{ fontSize: "13px", color: "#000000", margin: "8px 0 0", lineHeight: 1.55, maxWidth: "720px" }}>
              Единая служба поддержки портала обучения и ИИ-Куратора (ЕСО). Мы поможем с доступами, курсами и техническими
              сбоями.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        {(
          [
            {
              icon: Mail,
              title: "Почта ЕСО",
              value: "eso-support@company.ru",
              href: "mailto:eso-support@company.ru",
              sub: "Ответ в течение 1 рабочего дня",
            },
            {
              icon: Phone,
              title: "Горячая линия",
              value: "+7 (800) 000-00-00",
              href: "tel:+78000000000",
              sub: "Пн–Пт, 9:00–18:00 (МСК)",
            },
            {
              icon: MessageCircle,
              title: "Чат в мессенджере",
              value: "Канал #eso-help",
              href: null as string | null,
              sub: "Быстрые вопросы по порталу",
            },
          ] as const
        ).map((c, i) => {
          const CIcon = c.icon;
          const cardStyle = {
            padding: "18px",
            borderRadius: "16px",
            background: "rgba(129,208,245,.04)",
            border: "1px solid rgba(129,208,245,.08)",
            textDecoration: "none" as const,
            color: "inherit" as const,
            display: "block" as const,
          };
          const inner = (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <CIcon size={18} style={{ color: "#000000" }} />
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#000000" }}>{c.title}</span>
              </div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff", marginBottom: "6px" }}>{c.value}</div>
              <div style={{ fontSize: "11px", color: "#000000" }}>{c.sub}</div>
            </>
          );
          return (
            <motion.div key={c.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
              {c.href ? (
                <a href={c.href} style={cardStyle}>
                  {inner}
                </a>
              ) : (
                <div style={cardStyle}>{inner}</div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div
        style={{
          padding: "14px 18px",
          borderRadius: "14px",
          background: "rgba(0,82,204,.1)",
          border: "1px solid rgba(0,196,160,.2)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <Clock size={20} style={{ color: "#000000", flexShrink: 0 }} />
        <div style={{ fontSize: "13px", color: "#000000", lineHeight: 1.5 }}>
          <span style={{ color: "#fff", fontWeight: "700" }}>Режим работы службы:</span> понедельник–пятница, 9:00–18:00 по
          Москве. Вне графика заявки обрабатываются по почте в порядке очереди.
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <BookOpen size={18} style={{ color: "#000000" }} />
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#fff", margin: 0, letterSpacing: "0.02em" }}>
          Частые вопросы
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {faq.map((item, idx) => {
          const open = openFaq === idx;
          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 * idx }}
              style={{
                borderRadius: "14px",
                border: "1px solid rgba(129,208,245,.08)",
                background: "rgba(129,208,245,.03)",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(open ? null : idx)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "14px 16px",
                  border: "none",
                  background: open ? "rgba(0,196,160,.08)" : "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#fff", lineHeight: 1.4 }}>{item.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    color: "#000000",
                    flexShrink: 0,
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        margin: 0,
                        padding: "0 16px 16px",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        color: "#000000",
                      }}
                    >
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
