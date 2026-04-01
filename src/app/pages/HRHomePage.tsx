import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  GraduationCap,
  BookUser,
  BrainCircuit,
  Calendar,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { AlrosaLogo, BrandLine } from "../components/AlrosaBrand";
import { brandIcon } from "../lib/brandIcons";

export function HRHomePage() {
  const navigate = useNavigate();

  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <div className="landing-alrosa" style={{ margin: "-8px -4px 0", borderRadius: "0" }}>
          <div className="landing-alrosa__network" aria-hidden />
          <div className="landing-alrosa__inner">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AlrosaLogo />
              <BrandLine wide />
              <div className="landing-hero__row" style={{ marginTop: 18 }}>
                <div className="landing-hero__titles">
                  <h1 className="landing-h1">Кадры и обучение</h1>
                  <p className="landing-lead">
                    Анна Смирнова · директор по обучению и развитию ·{" "}
                    <span className="landing-hero__accent">
                      корпоративный университет и мониторинг обучения в одном окне
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>

            <BrandLine medium />

            <div className="landing-metrics">
              {[
                {
                  label: "Заявки на согласовании",
                  value: "15",
                  sub: "6 требуют решения сегодня",
                  icon: ClipboardList,
                  iconColor: brandIcon.accentRed,
                },
                {
                  label: "Сотрудники в обучении",
                  value: "248",
                  sub: "из 312 активных профилей",
                  icon: Users,
                  iconColor: brandIcon.accentCyan,
                },
                {
                  label: "Завершение курсов",
                  value: "92%",
                  sub: "по компании за квартал",
                  icon: LayoutDashboard,
                  iconColor: brandIcon.stroke,
                },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className="landing-metric-card"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div className="landing-metric-card__icon">
                        <Icon size={18} color={c.iconColor} strokeWidth={brandIcon.sw} />
                      </div>
                      <span className="landing-metric-card__label">{c.label}</span>
                    </div>
                    <div className="landing-metric-card__value">{c.value}</div>
                    <div className="landing-metric-card__sub">{c.sub}</div>
                  </motion.div>
                );
              })}
            </div>

            <BrandLine variant="cyan" />

            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate("/hr/dashboard")}
              className="landing-cta"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="landing-cta__icon-box">
                  <BarChart3 size={24} color={brandIcon.accentCyan} strokeWidth={brandIcon.sw} />
                </div>
                <div>
                  <div className="landing-cta__title">Дашборд и аналитика</div>
                  <div className="landing-cta__desc">
                    Графики, тепловая карта по отделам, ИИ-наставник и таблица заявок — полный рабочий стол кадровой
                    службы по обучению.
                  </div>
                </div>
              </div>
              <ArrowRight size={22} color={brandIcon.accentCyan} strokeWidth={brandIcon.sw} style={{ flexShrink: 0 }} />
            </motion.button>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
                marginTop: 20,
              }}
            >
              {[
                { label: "Команда руководителя", desc: "Обзор по подразделениям", to: "/manager", Icon: Users },
                { label: "Сотрудники", desc: "Реестр и статусы обучения", to: "/hr/employees", Icon: BookUser },
                { label: "Траектория развития", desc: "ИПР и этапы роста", to: "/hr/trajectory", Icon: UserCog },
                { label: "ИИ-Наставник", desc: "Чат и рекомендации по обучению и развитию", to: "/hr/mentor", Icon: BrainCircuit },
                { label: "Каталог курсов", desc: "Внешние и внутренние программы", to: "/hr/catalog", Icon: BookOpen },
                {
                  label: "Назначение курсов",
                  desc: "Свой курс и выбор сотрудников из реестра",
                  to: "/hr/assign-courses",
                  Icon: GraduationCap,
                },
                { label: "Заявки на обучение", desc: "Очередь заявок по обучению и статусы", to: "/hr/applications", Icon: ClipboardList },
                { label: "Компетенции", desc: "Матрица и приоритеты развития", to: "/hr/competencies", Icon: TrendingUp },
                { label: "Мероприятия", desc: "Календарь мероприятий по обучению и регистрация", to: "/hr/events", Icon: Calendar },
                { label: "Отчёты", desc: "Выгрузки PDF и электронных таблиц", to: "/hr/reports", Icon: FileText },
                { label: "Сертификаты", desc: "Реестр по сотрудникам", to: "/hr/certificates", Icon: Award },
                { label: "Поддержка", desc: "Контакты службы обучения и ЕСО", to: "/hr/support", Icon: HelpCircle },
                { label: "Настройки", desc: "Уведомления и ЕСО", to: "/hr/settings", Icon: Settings },
              ].map((item, i) => {
                const QuickIcon = item.Icon;
                return (
                <motion.button
                  key={item.label}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  onClick={() => navigate(item.to)}
                  className="glass-card-bright"
                  style={{
                    padding: "16px 18px",
                    textAlign: "left",
                    cursor: "pointer",
                    border: "1px solid rgba(129,208,245,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <QuickIcon size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#000000" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#000000", lineHeight: 1.45 }}>{item.desc}</span>
                </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
