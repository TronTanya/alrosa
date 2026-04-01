import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getAdminDocArticleById } from "../data/adminDocumentationCatalog";
import { brandIcon } from "../lib/brandIcons";

export function AdminDocumentationArticlePage() {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();

  const article = useMemo(() => (docId ? getAdminDocArticleById(docId) : undefined), [docId]);

  if (!article) {
    return (
      <div className="employee-tab-ornament">
        <div className="employee-tab-ornament__inner">
          <div className="glass-card" style={{ padding: "28px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#000000", margin: "0 0 16px" }}>Материал не найден.</p>
            <button
              type="button"
              onClick={() => navigate("/admin/documentation")}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(227,0,11,0.28)",
                background: "rgba(227,0,11,0.06)",
                color: "#e3000b",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              К списку документации
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <button
            type="button"
            onClick={() => navigate("/admin/documentation")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "18px",
              padding: "8px 4px",
              border: "none",
              background: "transparent",
              color: "#e3000b",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            <ArrowLeft size={16} strokeWidth={brandIcon.sw} />
            К списку документации
          </button>

          <div className="glass-card" style={{ padding: "24px", maxWidth: "800px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(227,0,11,0.2), rgba(129,208,245,0.2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BookOpen size={20} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "rgba(129,208,245,0.1)",
                    border: "1px solid rgba(129,208,245,0.25)",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "#000000",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginBottom: "8px",
                  }}
                >
                  {article.tag}
                </span>
                <h1
                  className="type-display"
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#000000",
                    margin: 0,
                    lineHeight: 1.25,
                  }}
                >
                  {article.title}
                </h1>
                <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)", margin: "10px 0 0" }}>
                  Обновлено: {article.updated}
                </p>
              </div>
            </div>

            <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.85)", lineHeight: 1.6, margin: "0 0 20px" }}>
              {article.description}
            </p>

            {article.body.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: "14px",
                  color: "rgba(0,0,0,0.78)",
                  lineHeight: 1.65,
                  margin: i === article.body.length - 1 ? 0 : "0 0 14px",
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
