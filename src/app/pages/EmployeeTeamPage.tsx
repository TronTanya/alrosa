import React from "react";
import { motion } from "motion/react";
import { Users, Mail, Briefcase } from "lucide-react";
import { teamMembersForSearch } from "../data/teamSearchMembers";

/**
 * Сотрудник: список коллег по команде (лёгкая страница в ЛК).
 * Дашборд руководителя — отдельный маршрут /manager (TeamPage).
 */
export function EmployeeTeamPage() {
  const members = teamMembersForSearch;
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <Users size={22} style={{ color: "#000000" }} />
              <h1
                style={{
                  fontSize: "21px",
                  fontWeight: "800",
                  color: "#000000",
                  letterSpacing: "-0.4px",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Команда
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
              Ваша кросс-функциональная команда в «Алроса ИТ»: роли, контакты и состав подразделения Platform.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
          gap: "14px",
        }}
      >
        {members.map((m, i) => (
          <motion.article
            key={m.email}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.04 }}
            style={{
              padding: "18px",
              borderRadius: "16px",
              background: "rgba(129,208,245,.04)",
              border: "1px solid rgba(129,208,245,.08)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: m.grad,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#000000",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                }}
              >
                {m.initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#000000", margin: 0, lineHeight: 1.3 }}>{m.name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <Briefcase size={12} style={{ color: "#000000", flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "#000000" }}>{m.role}</span>
                </div>
              </div>
            </div>
            <a
              href={`mailto:${m.email}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "#000000",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              <Mail size={14} />
              {m.email}
            </a>
          </motion.article>
        ))}
      </div>
    </>
  );
}
