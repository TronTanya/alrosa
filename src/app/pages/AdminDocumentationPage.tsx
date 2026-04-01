import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { BookOpen, ExternalLink, HelpCircle, Search } from "lucide-react";
import {
  ADMIN_DOCUMENTATION_ARTICLES_TOTAL,
  adminDocumentationArticles,
} from "../data/adminDocumentationCatalog";
import { brandIcon } from "../lib/brandIcons";

export function AdminDocumentationPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return adminDocumentationArticles.filter(
      (a) =>
        !qq ||
        a.title.toLowerCase().includes(qq) ||
        a.tag.toLowerCase().includes(qq) ||
        a.description.toLowerCase().includes(qq),
    );
  }, [q]);

  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
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
                <HelpCircle size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                <h1
                  className="type-display"
                  style={{
                    fontSize: "21px",
                    fontWeight: "600",
                    color: "#000000",
                    letterSpacing: "-0.4px",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Документация
                </h1>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "rgba(129,208,245,0.14)",
                    border: "1px solid rgba(129,208,245,0.35)",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                >
                  {ADMIN_DOCUMENTATION_ARTICLES_TOTAL} материалов
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Сводка регламентов и технических описаний ЕСО для администраторов. Кнопка «Открыть» ведёт на страницу материала.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="glass-card" style={{ padding: "20px", marginBottom: "18px" }}>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#000000",
                opacity: 0.45,
                pointerEvents: "none",
              }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по названию, разделу, описанию…"
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                borderRadius: "12px",
                border: "1px solid rgba(129,208,245,0.25)",
                background: "rgba(129,208,245,0.06)",
                fontSize: "13px",
                fontFamily: "var(--font-sans)",
                color: "#000000",
                outline: "none",
              }}
            />
          </div>
          <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.75 }}>
            Показано {filtered.length} из {ADMIN_DOCUMENTATION_ARTICLES_TOTAL}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "14px",
          }}
        >
          {filtered.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * Math.min(i, 12) }}
              className="glass-card"
              style={{
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                minHeight: "200px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(227,0,11,0.2), rgba(129,208,245,0.2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={17} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "rgba(129,208,245,0.1)",
                    border: "1px solid rgba(129,208,245,0.25)",
                    fontSize: "10px",
                    fontWeight: "500",
                    color: "#000000",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {a.tag}
                </span>
              </div>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#000000", margin: 0, lineHeight: 1.35 }}>{a.title}</h2>
              <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.72)", margin: 0, lineHeight: 1.5, flex: 1 }}>{a.description}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)" }}>Обновлено: {a.updated}</span>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/documentation/${a.id}`)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(227,0,11,0.28)",
                    background: "rgba(227,0,11,0.06)",
                    color: "#e3000b",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Открыть
                  <ExternalLink size={14} strokeWidth={brandIcon.sw} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card" style={{ padding: "40px 20px", textAlign: "center", fontSize: "13px", color: "#000000" }}>
            Ничего не найдено. Измените запрос.
          </div>
        )}
      </div>
    </div>
  );
}
