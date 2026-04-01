import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ESO_VERSION } from "../../data/adminDashboardConstants";
import {
  Brain, Bell, RefreshCw, TrendingUp, Sparkles,
  ChevronRight, X, Settings2,
  Shield,
} from "lucide-react";
import type { BrandLucideIcon } from "../../lib/brandIcons";

/* ─── AI Config Modal ─── */
function AIConfigModal({ onClose }: { onClose: () => void }) {
  const [aliceTemperature, setAliceTemperature] = useState(72);
  const [contextWindow, setContextWindow] = useState(4096);
  const [model, setModel] = useState("Alice-Pro");
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const alrosaRed = "#e3000b";
  const alrosaCyan = "#81d0f5";
  const textMuted = "rgba(0,0,0,0.52)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "520px",
          maxWidth: "calc(100vw - 32px)",
          background: "#ffffff",
          borderRadius: "22px",
          border: `1px solid rgba(129,208,245,0.45)`,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "linear-gradient(135deg, rgba(227,0,11,0.06), rgba(129,208,245,0.12))",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${alrosaRed}, ${alrosaCyan})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(227,0,11,0.22)",
            }}
          >
            <Brain size={18} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 400, color: "#000000" }}>Настройка ИИ-модели</div>
            <div style={{ fontSize: "11px", fontWeight: 400, color: textMuted }}>Яндекс Алиса · API Алисы · Яндекс Cloud</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "rgba(0,0,0,0.4)", cursor: "pointer", padding: "4px" }}
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Model selector */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 400, color: textMuted, marginBottom: "8px" }}>Модель ИИ</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {["Alice-Lite", "Alice-Pro", "Alice-Max"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: "11px",
                    background:
                      model === m
                        ? "linear-gradient(135deg, rgba(227,0,11,0.1), rgba(129,208,245,0.2))"
                        : "rgba(129,208,245,0.08)",
                    border: `1px solid ${
                      model === m ? "rgba(227,0,11,0.35)" : "rgba(129,208,245,0.28)"
                    }`,
                    color: model === m ? "#000000" : textMuted,
                    fontSize: "12px",
                    fontWeight: 400,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "all .15s",
                  }}
                >
                  {m.replace("Alice-", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 400, color: textMuted }}>Температура (creativity)</span>
              <span style={{ fontSize: "13px", fontWeight: 400, color: alrosaRed }}>{aliceTemperature}%</span>
            </div>
            <div
              style={{
                position: "relative",
                height: "6px",
                borderRadius: "6px",
                background: "rgba(129,208,245,0.22)",
                cursor: "pointer",
              }}
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                setAliceTemperature(Math.round(((e.clientX - rect.left) / rect.width) * 100));
              }}
            >
              <div
                style={{
                  width: `${aliceTemperature}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${alrosaRed}, ${alrosaCyan})`,
                  borderRadius: "6px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${aliceTemperature}%`,
                  transform: "translate(-50%, -50%)",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  border: `2px solid ${alrosaCyan}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 400, color: textMuted }}>Точный</span>
              <span style={{ fontSize: "10px", fontWeight: 400, color: textMuted }}>Творческий</span>
            </div>
          </div>

          {/* Context */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 400, color: textMuted }}>Контекстное окно</span>
              <span style={{ fontSize: "13px", fontWeight: 400, color: "#0c4a6e" }}>
                {contextWindow.toLocaleString()} tokens
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {[2048, 4096, 8192, 16384].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setContextWindow(v)}
                  style={{
                    flex: 1,
                    padding: "7px",
                    borderRadius: "9px",
                    background: contextWindow === v ? "rgba(129,208,245,0.28)" : "rgba(129,208,245,0.08)",
                    border: `1px solid ${
                      contextWindow === v ? "rgba(129,208,245,0.65)" : "rgba(129,208,245,0.25)"
                    }`,
                    color: contextWindow === v ? "#000000" : textMuted,
                    fontSize: "11px",
                    fontWeight: 400,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {v >= 1024 ? `${v / 1024}K` : v}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              { label: "Персонализация плана развития", on: true },
              { label: "Предиктивный анализ", on: true },
              { label: "Автозаявки", on: true },
              { label: "Мультиагентный режим", on: false },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "11px",
                  background: t.on ? "rgba(129,208,245,0.1)" : "rgba(0,0,0,0.03)",
                  border: `1px solid ${t.on ? "rgba(129,208,245,0.35)" : "rgba(0,0,0,0.08)"}`,
                }}
              >
                <span style={{ fontSize: "11.5px", fontWeight: 400, color: "#000000" }}>{t.label}</span>
                <div
                  style={{
                    width: "32px",
                    height: "18px",
                    borderRadius: "9px",
                    background: t.on ? `linear-gradient(135deg, ${alrosaRed}, ${alrosaCyan})` : "rgba(0,0,0,0.12)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background .2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: t.on ? "14px" : "2px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      transition: "left .2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={save}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              background: saved
                ? "linear-gradient(135deg, rgba(129,208,245,0.55), rgba(129,208,245,0.35))"
                : `linear-gradient(135deg, ${alrosaRed}, ${alrosaCyan})`,
              border: "none",
              color: saved ? "#000000" : "#000000",
              fontSize: "13px",
              fontWeight: 400,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              boxShadow: saved ? "none" : "0 6px 24px rgba(227,0,11,0.2)",
              transition: "all .3s",
            }}
          >
            {saved ? "✓ Настройки сохранены" : "Сохранить конфигурацию"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AI Admin Avatar ─── */
function AIAdminBlock({ onConfig }: { onConfig: () => void }) {
  return (
    <div className="glass-card-bright" style={{ padding: "20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(227,0,11,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Avatar */}
      <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 12px" }}>
        <div className="ring-spin" style={{ position: "absolute", inset: "-8px", borderRadius: "50%", border: "1.5px solid transparent", borderTopColor: "rgba(227,0,11,0.55)", borderRightColor: "rgba(129,208,245,0.45)" }} />
        <div className="ai-glow float-anim" style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(145deg, #ffffff, rgba(129,208,245,0.15))", border: "2px solid rgba(129,208,245,0.35)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.08)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(227,0,11,0.1) 0%, transparent 60%)" }} />
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ position: "relative", zIndex: 1 }}>
            <defs>
              <linearGradient id="admin-ai-g" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e3000b" /><stop offset="100%" stopColor="#81d0f5" />
              </linearGradient>
            </defs>
            <rect x="8" y="6" width="28" height="22" rx="8" fill="url(#admin-ai-g)" opacity="0.88" />
            <rect x="13" y="11" width="5" height="5" rx="2" fill="white" opacity="0.9" />
            <rect x="26" y="11" width="5" height="5" rx="2" fill="white" opacity="0.9" />
            <circle cx="15.5" cy="13.5" r="1.5" fill="#e3000b" />
            <circle cx="28.5" cy="13.5" r="1.5" fill="#81d0f5" />
            <path d="M15 20 Q22 24.5 29 20" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <rect x="10" y="30" width="24" height="10" rx="5" fill="url(#admin-ai-g)" opacity="0.45" />
            <path d="M2 12 L8 12" stroke="rgba(227,0,11,0.45)" strokeWidth="1.2" /><circle cx="1" cy="12" r="2" fill="rgba(227,0,11,0.45)" />
            <path d="M36 12 L42 12" stroke="rgba(129,208,245,0.65)" strokeWidth="1.2" /><circle cx="43" cy="12" r="2" fill="rgba(129,208,245,0.65)" />
            <circle cx="22" cy="36.5" r="2" fill="rgba(0,0,0,0.35)" />
            <path d="M18 36.5 L26 36.5" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
          </svg>
        </div>
      </div>

      <div style={{ fontSize: "13.5px", fontWeight: "500", color: "#000000", marginBottom: "4px" }}>ИИ-Менеджер системы</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "20px", background: "rgba(129,208,245,0.12)", border: "1px solid rgba(129,208,245,0.35)", fontSize: "10.5px", color: "#000000", fontWeight: "500", marginBottom: "12px" }}>
        <Shield size={10} /> Admin · Алиса Pro · Online
      </div>

      <div style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.55)", lineHeight: 1.6, marginBottom: "14px" }}>
        Управляю 312 аккаунтами, 87 курсами и 4 интеграциями. Выявил 3 аномалии в правах доступа.
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "14px" }}>
        {[{ label: "Пользов.", value: "312" }, { label: "Инциден.", value: "0" }, { label: "Uptime", value: "99.9%" }].map(s => (
          <div key={s.label} style={{ padding: "8px 4px", borderRadius: "10px", background: "rgba(129,208,245,0.06)", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#000000", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "9.5px", color: "rgba(0,0,0,0.45)", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button type="button" onClick={onConfig} style={{ width: "100%", padding: "10px", borderRadius: "12px", background: "linear-gradient(135deg, #e3000b, #81d0f5)", border: "none", color: "#000000", fontSize: "12.5px", fontWeight: "500", cursor: "pointer", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: "0 4px 20px rgba(227,0,11,0.25)" }}>
        <Settings2 size={13} /> Настроить ИИ-модель
      </button>
    </div>
  );
}

/* ─── Notification cards ─── */
interface RecCfg {
  icon: BrandLucideIcon;
  accent: string;
  urgency: string;
  title: string;
  body: string;
  cta: string;
  to: string;
}

const recs: RecCfg[] = [
  {
    icon: Bell,
    accent: "#e3000b",
    urgency: "Срочно",
    title: "3 системных уведомления требуют внимания",
    body: "Истекает SSL-сертификат (2 дня), задержка API push-уведомлений 320 мс, неудачная попытка входа (×14) с IP 185.x.x.x.",
    cta: "Просмотреть инциденты",
    to: "/admin/notifications",
  },
  {
    icon: RefreshCw,
    accent: "#81d0f5",
    urgency: "Обновление",
    title: `Доступно обновление базы курсов v${ESO_VERSION}`,
    body: "14 новых курсов от партнёров. Алгоритм рекомендаций на базе Яндекс Алисы обновлён. Миграция займёт ~8 мин в ночное окно.",
    cta: "Запустить обновление",
    to: "/admin/courses",
  },
  {
    icon: TrendingUp,
    accent: "#81d0f5",
    urgency: "Предиктив",
    title: "Прогноз нагрузки: пик в пятницу +180%",
    body: "Алиса прогнозирует 487 сессий в пятницу (финальные аттестации). Рекомендую авто-масштабирование контейнеров.",
    cta: "Настроить Auto-Scaling",
    to: "/admin/monitoring",
  },
];

function RecCard({ rec }: { rec: RecCfg }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  return (
    <div className="glass-card-md" style={{ padding: "14px", cursor: "pointer", border: `1px solid ${rec.accent}22`, transition: "all .2s", boxShadow: hov ? `0 8px 24px rgba(0,0,0,0.08), 0 0 14px ${rec.accent}22` : "none", borderColor: hov ? `${rec.accent}44` : `${rec.accent}22` }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ display: "flex", gap: "9px", marginBottom: "7px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: `${rec.accent}1E`, border: `1px solid ${rec.accent}32`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <rec.icon size={14} style={{ color: rec.accent }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: "500", padding: "2px 7px", borderRadius: "20px", background: `${rec.accent}18`, color: rec.accent, border: `1px solid ${rec.accent}2E` }}>{rec.urgency}</span>
          </div>
          <div style={{ fontSize: "12px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{rec.title}</div>
        </div>
      </div>
      <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)", lineHeight: 1.6, margin: "0 0 9px" }}>{rec.body}</p>
      <button
        type="button"
        onClick={() => navigate(rec.to)}
        style={{ width: "100%", padding: "7px", borderRadius: "9px", background: `${rec.accent}1E`, border: `1px solid ${rec.accent}32`, color: rec.accent, fontSize: "11px", fontWeight: "500", cursor: "pointer", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${rec.accent}30`; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${rec.accent}1E`; }}
      >
        {rec.cta} <ChevronRight size={12} />
      </button>
    </div>
  );
}

export function AdminAIPanel() {
  const [configOpen, setConfigOpen] = useState(false);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <AIAdminBlock onConfig={() => setConfigOpen(true)} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "2px 0" }}>
          <Sparkles size={12} style={{ color: "#e3000b" }} />
          <span style={{ fontSize: "11px", fontWeight: "500", color: "rgba(0,0,0,0.45)", letterSpacing: ".5px" }}>СИСТЕМНЫЕ УВЕДОМЛЕНИЯ И АНАЛИЗ</span>
        </div>
        {recs.map((r, i) => <RecCard key={i} rec={r} />)}
      </div>
      {configOpen && <AIConfigModal onClose={() => setConfigOpen(false)} />}
    </>
  );
}
