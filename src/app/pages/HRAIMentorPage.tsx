import React, { useState } from "react";
import { motion } from "motion/react";
import { BrainCircuit, ExternalLink, Sparkles } from "lucide-react";
import { HRAIPanel, type HrYandexInsightsStatus } from "../components/hr/HRAIPanel";
import { HR_EMPLOYEES_TOTAL } from "../data/hrEmployeesDirectory";
import { getYandexLlmTransport, yandexFoundationModelsDocsUrl } from "../lib/yandexLlmClientInfo";

export function HRAIMentorPage() {
  const [yandexInsights, setYandexInsights] = useState<HrYandexInsightsStatus>({ state: "loading" });
  const llmTransport = getYandexLlmTransport();

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
                <BrainCircuit size={22} style={{ color: "#000000" }} />
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
                  ИИ-Наставник
                </h1>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg,rgba(227,0,11,.12),rgba(129,208,245,.1))",
                    border: "1px solid rgba(129,208,245,0.35)",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "#000000",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#81d0f5",
                      boxShadow: "0 0 6px rgba(129,208,245,.55)",
                    }}
                  />
                  Live · {HR_EMPLOYEES_TOTAL} сотрудников
                </span>
                <span
                  title="Рекомендации и прогнозы формирует модель Yandex Foundation Models (ЯндексGPT) в Yandex Cloud"
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg,rgba(255,200,0,.12),rgba(129,208,245,.08))",
                    border: "1px solid rgba(255,200,0,0.35)",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                >
                  ЯндексGPT
                </span>
                {yandexInsights.state === "live" ? (
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "20px",
                      background: "rgba(46,125,50,0.1)",
                      border: "1px solid rgba(46,125,50,0.28)",
                      fontSize: "10px",
                      fontWeight: "500",
                      color: "#1b5e20",
                    }}
                  >
                    API подключён
                  </span>
                ) : null}
                {yandexInsights.state === "demo" ? (
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "20px",
                      background: "rgba(183,28,28,0.06)",
                      border: "1px solid rgba(183,28,28,0.22)",
                      fontSize: "10px",
                      fontWeight: "500",
                      color: "#b71c1c",
                    }}
                  >
                    Демо-инсайты
                  </span>
                ) : null}
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
                Корпоративный ИИ на базе{" "}
                <strong style={{ fontWeight: "var(--br-font-bold)" }}>ЯндексGPT</strong> (Yandex Cloud Foundation Models)
                анализирует обучение, заявки и риски по компании. Чат, рекомендации и прогнозы — в одном месте для
                L&amp;D.
              </p>
              {yandexInsights.state === "demo" ? (
                <p
                  style={{
                    fontSize: "11.5px",
                    color: "rgba(0,0,0,0.65)",
                    margin: "10px 0 0",
                    lineHeight: 1.5,
                    maxWidth: "720px",
                  }}
                >
                  Чтобы получать живые инсайты от Яндекса, задайте в корне проекта{" "}
                  <code style={{ fontSize: "10.5px" }}>YANDEX_CLOUD_API_KEY</code> и перезапустите{" "}
                  <code style={{ fontSize: "10.5px" }}>npm run dev</code>: прокси Vite подставляет ключ к запросам{" "}
                  <code style={{ fontSize: "10.5px" }}>/yandex-llm-api</code> и не кладёт секрет в бандл. Для быстрого
                  теста можно указать <code style={{ fontSize: "10.5px" }}>VITE_YANDEX_CLOUD_API_KEY</code> (ключ попадёт
                  в клиент).
                  {llmTransport === "browser_api_key" ? (
                    <> Сейчас включён вызов из браузера по VITE-ключу.</>
                  ) : null}
                  {yandexInsights.reason ? (
                    <>
                      {" "}
                      Ответ API: {yandexInsights.reason.slice(0, 220)}
                      {yandexInsights.reason.length > 220 ? "…" : ""}
                    </>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <HRAIPanel onYandexStatusChange={setYandexInsights} />
          </div>
          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Sparkles size={16} style={{ color: "#e3000b" }} />
              <span style={{ fontSize: "13px", fontWeight: "500", color: "#000000" }}>Возможности</span>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                fontSize: "12.5px",
                color: "#000000",
                lineHeight: 1.65,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>Глобальный чат по данным L&amp;D: заявки, бюджет, отделы (тот же API Яндекса, что и рекомендации).</li>
              <li>Предиктивные сигналы по компетенциям и своевременные напоминания.</li>
              <li>Подбор курсов и сценарии окупаемости для программ развития.</li>
            </ul>
            <div
              style={{
                marginTop: "14px",
                paddingTop: "14px",
                borderTop: "1px solid rgba(0,0,0,0.08)",
                fontSize: "11.5px",
                color: "rgba(0,0,0,0.75)",
                lineHeight: 1.55,
              }}
            >
              <strong style={{ color: "#000000" }}>Интеграция Yandex Cloud:</strong> карточки слева строит модель{" "}
              <code style={{ fontSize: "10.5px" }}>yandexgpt/latest</code> через Completion API. В dev ключ из{" "}
              <code style={{ fontSize: "10.5px" }}>.env</code> уходит на сервер Vite и не попадает в бандл; при{" "}
              <code style={{ fontSize: "10.5px" }}>VITE_YANDEX_CLOUD_API_KEY</code> запрос идёт из браузера (только для
              тестов).
              <a
                href={yandexFoundationModelsDocsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "8px",
                  color: "#000000",
                  fontWeight: "500",
                }}
              >
                Документация Foundation Models <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
