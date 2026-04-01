import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, BrainCircuit, Calendar, TrendingUp } from "lucide-react";
import { AlrosaLogo, BrandLine } from "../components/AlrosaBrand";
import { brandIcon } from "../lib/brandIcons";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="landing-alrosa">
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
              <h1 className="landing-h1">Главная</h1>
              <p className="landing-lead">
                Александр Иванов · Middle Software Engineer ·{" "}
                <span className="landing-hero__accent">краткий обзор по обучению и плану развития</span>
              </p>
            </div>
          </div>
        </motion.div>

        <BrandLine medium />

        <div className="landing-metrics">
          {[
            { label: "Курсы в работе", value: "7", sub: "из 12 в плане", icon: BookOpen, iconColor: brandIcon.stroke },
            { label: "План развития 2026", value: "42%", sub: "+8% за месяц", icon: TrendingUp, iconColor: brandIcon.accentRed },
            { label: "События недели", value: "3", sub: "в календаре", icon: Calendar, iconColor: brandIcon.accentCyan },
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
          onClick={() => navigate("/cabinet")}
          className="landing-cta"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="landing-cta__icon-box">
              <BrainCircuit size={24} color={brandIcon.accentCyan} strokeWidth={brandIcon.sw} />
            </div>
            <div>
              <div className="landing-cta__title">ИИ-Куратор · рабочий стол</div>
              <div className="landing-cta__desc">
                Чат с наставником, рекомендации и таймлайн обучения — перейти в полный режим.
              </div>
            </div>
          </div>
          <ArrowRight size={22} color={brandIcon.accentCyan} strokeWidth={brandIcon.sw} style={{ flexShrink: 0 }} />
        </motion.button>
      </div>
    </div>
  );
}
