import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Award, Search } from "lucide-react";
import {
  HR_CERTIFICATES_TOTAL,
  hrCertificatesRegistry,
  type HrCertStatus,
} from "../data/hrCertificatesRegistry";

const statusFilters: { val: HrCertStatus | "all"; label: string }[] = [
  { val: "all", label: "Все" },
  { val: "Действует", label: "Действует" },
  { val: "Истекает", label: "Истекает" },
  { val: "Архив", label: "Архив" },
];

function statusStyle(s: HrCertStatus): { bg: string; border: string } {
  if (s === "Действует") return { bg: "rgba(129,208,245,0.14)", border: "rgba(129,208,245,0.35)" };
  if (s === "Истекает") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)" };
  return { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)" };
}

export function HRCertificatesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<HrCertStatus | "all">("all");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return hrCertificatesRegistry.filter((r) => {
      const matchQ =
        !qq ||
        r.employeeName.toLowerCase().includes(qq) ||
        r.department.toLowerCase().includes(qq) ||
        r.title.toLowerCase().includes(qq) ||
        r.issuer.toLowerCase().includes(qq) ||
        r.credentialId.toLowerCase().includes(qq);
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    });
  }, [q, status]);

  return (
    <div className="employee-tab-ornament">
      <div className="employee-tab-ornament__inner">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
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
                <Award size={22} style={{ color: "#000000" }} />
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
                  Сертификаты
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
                  {HR_CERTIFICATES_TOTAL} записей в реестре
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Корпоративный учёт сертификатов и удостоверений: сотрудник, программа, эмитент, сроки и идентификатор учётной записи.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="glass-card" style={{ padding: "20px", marginBottom: "18px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
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
                placeholder="Поиск по сотруднику, сертификату, эмитенту, ID…"
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {statusFilters.map((f) => {
                const active = status === f.val;
                return (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setStatus(f.val)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      border: active ? "1px solid rgba(227,0,11,0.35)" : "1px solid rgba(129,208,245,0.15)",
                      background: active ? "rgba(227,0,11,0.1)" : "transparent",
                      color: "#000000",
                      fontSize: "12px",
                      fontWeight: active ? "700" : "500",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#000000", margin: 0, opacity: 0.75 }}>
            Показано {rows.length} из {HR_CERTIFICATES_TOTAL}
            {rows.length < HR_CERTIFICATES_TOTAL ? " (фильтр или поиск)" : ""}.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1020px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Сотрудник", "Подразделение", "Сертификат", "Эмитент", "Выдан", "Действует до", "ID", "Статус"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "10px",
                        fontWeight: "500",
                        color: "#000000",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const st = statusStyle(r.status);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * Math.min(i, 16) }}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#000000" }}>{r.employeeName}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{r.department}</td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: "500", color: "#000000", maxWidth: "260px", lineHeight: 1.35 }}>
                        {r.title}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000" }}>{r.issuer}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.issuedAt}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{r.expiresAt}</td>
                      <td style={{ padding: "14px 16px", fontSize: "11px", fontFamily: "monospace", color: "#000000" }}>{r.credentialId}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 9px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "500",
                            color: "#000000",
                            background: st.bg,
                            border: `1px solid ${st.border}`,
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: "13px", color: "#000000" }}>
              Ничего не найдено. Измените запрос или фильтр.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
