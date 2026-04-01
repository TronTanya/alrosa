import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Mail, MessageCircle, Phone, ChevronDown, BookOpen } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";

const faqHr = [
  {
    q: "Как выгрузить отчёт по обучению за период?",
    a: "Раздел «Отчёты»: выберите шаблон и период, нажмите «Скачать». Для нестандартных срезов напишите на hr-analytics@company.ru.",
  },
  {
    q: "Нужен массовый импорт сотрудников в программу",
    a: "Создайте заявку на hr-learning@company.ru с приложением списка (ФИО, подразделение, e-mail) и ID программы в ЕСО.",
  },
  {
    q: "Ошибка в дашборде HR или не обновляются KPI",
    a: "Опишите ситуацию в канале #l-and-d-tech или на eso-support@company.ru с указанием времени и скриншота.",
  },
  {
    q: "Доступ к разделу для нового куратора L&D",
    a: "Заявка через Service Desk (роль «Куратор ЕСО / HR») или согласование с владельцем домена Алроса ИТ.",
  },
];

const contacts = [
  {
    icon: Mail,
    title: "L&D и аналитика",
    value: "hr-learning@company.ru",
    href: "mailto:hr-learning@company.ru",
    sub: "Программы, отчёты, бюджет",
  },
  {
    icon: Mail,
    title: "Техподдержка ЕСО",
    value: "eso-support@company.ru",
    href: "mailto:eso-support@company.ru",
    sub: "Сбои портала, доступы, ИИ",
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
    title: "Каналы",
    value: "#l-and-d · #eso-help",
    href: null as string | null,
    sub: "Корпоративный мессенджер",
  },
] as const;

export function HRSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "22px", flexWrap: "wrap" }}>
            <div
              style={{
                width: "4px",
                height: "24px",
                borderRadius: "4px",
                background: "linear-gradient(180deg,#e3000b,#81d0f5)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                <HelpCircle size={22} style={{ color: "#000000" }} />
                <h1
                  className="type-display"
                  style={{
                    fontSize: "21px",
                    fontWeight: "var(--br-font-bold)",
                    color: "#000000",
                    letterSpacing: "-0.4px",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Поддержка
                </h1>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Контакты службы поддержки ЕСО и L&amp;D для кураторов: отчёты, доступы, инциденты и согласования.
              </p>
            </div>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
            gap: "12px",
            marginBottom: "22px",
          }}
        >
          {contacts.map((c, i) => {
            const CIcon = c.icon;
            const inner = (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(129,208,245,0.12)",
                      border: "1px solid rgba(129,208,245,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CIcon size={17} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#000000" }}>{c.title}</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", marginBottom: "4px", wordBreak: "break-word" }}>
                  {c.value}
                </div>
                <div style={{ fontSize: "11px", color: "#000000", opacity: 0.75 }}>{c.sub}</div>
              </>
            );
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                {c.href ? (
                  <a
                    href={c.href}
                    className="glass-card"
                    style={{
                      padding: "16px",
                      textDecoration: "none",
                      display: "block",
                      color: "inherit",
                      border: "1px solid rgba(129,208,245,0.2)",
                    }}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="glass-card" style={{ padding: "16px", border: "1px solid rgba(129,208,245,0.2)" }}>
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="glass-card" style={{ padding: "18px 20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <BookOpen size={16} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#000000" }}>База знаний HR</span>
          </div>
          <p style={{ fontSize: "12px", color: "#000000", margin: 0, lineHeight: 1.55, opacity: 0.9 }}>
            Инструкции по отчётам, ролям и интеграциям — во внутреннем Confluence (раздел «ЕСО · HR / L&D»). При отсутствии
            доступа обратитесь в Service Desk.
          </p>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#000000", marginBottom: "10px", letterSpacing: "0.04em" }}>
            Частые вопросы (HR)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {faqHr.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="glass-card"
                  style={{
                    overflow: "hidden",
                    border: "1px solid rgba(129,208,245,0.2)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      background: open ? "rgba(129,208,245,0.08)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#000000" }}>{item.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        color: "#000000",
                        flexShrink: 0,
                        transform: open ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
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
                            fontSize: "12px",
                            color: "#000000",
                            lineHeight: 1.6,
                            margin: 0,
                            padding: "0 16px 14px",
                            opacity: 0.9,
                          }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.7 }}>
          Поддержка для сотрудников (личный кабинет):{" "}
          <Link to="/support" style={{ color: "#000000", fontWeight: 700, textDecoration: "underline" }}>
            Перейти в раздел «Поддержка»
          </Link>
        </p>
      </div>
    </div>
  );
}
