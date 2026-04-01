import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Award, Medal, Search, Sparkles, Trophy } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import {
  MANAGER_RECENT_ACHIEVEMENT_EVENTS,
  MANAGER_TEAM_MEMBERS,
  type ManagerAchievementFeedKind,
} from "../data/managerTeamCatalog";

type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  badges: number;
  certs: number;
  lastEvent: string;
  highlight?: string;
};

const team: TeamMemberRow[] = MANAGER_TEAM_MEMBERS.map((m) => ({
  id: m.id,
  name: m.shortName,
  role: m.dept,
  badges: m.badges,
  certs: m.certs,
  lastEvent: m.lastAchEvent,
  ...(m.highlight ? { highlight: m.highlight } : {}),
}));

function badgeKindStyle(k: ManagerAchievementFeedKind): { bg: string; border: string } {
  if (k === "аттестация") return { bg: "rgba(227,0,11,0.08)", border: "rgba(227,0,11,0.22)" };
  if (k === "навык") return { bg: "rgba(129,208,245,0.14)", border: "rgba(129,208,245,0.35)" };
  if (k === "корпоративный") return { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)" };
  return { bg: "rgba(227,0,11,0.06)", border: "rgba(129,208,245,0.28)" };
}

export function ManagerAchievementsPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return team;
    return team.filter(
      (r) =>
        r.name.toLowerCase().includes(qq) ||
        r.role.toLowerCase().includes(qq) ||
        r.lastEvent.toLowerCase().includes(qq),
    );
  }, [q]);

  const totalBadges = team.reduce((s, r) => s + r.badges, 0);
  const totalCerts = team.reduce((s, r) => s + r.certs, 0);

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 4px" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              width: "4px",
              height: "26px",
              borderRadius: "6px",
              background: "linear-gradient(180deg, #e3000b, #81d0f5)",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
              <Award size={22} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
              <h1
                style={{
                  fontSize: "clamp(20px, 2vw, 1.4rem)",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                  lineHeight: 1.15,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Достижения
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
              Сертификаты, бейджи и корпоративные модули по вашей команде. Сводка демонстрационная — персональные сертификаты сотрудника остаются в разделе «Сертификаты» в ЛК.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          { label: "Бейджей в команде", value: String(totalBadges), icon: Sparkles, sub: "все типы" },
          { label: "Сертификатов учтено", value: String(totalCerts), icon: Medal, sub: "в реестре команды" },
          { label: "Сотрудников в срезе", value: String(team.length), icon: Trophy, sub: "прямые подчинённые" },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              borderRadius: "14px",
              border: "1px solid rgba(0,0,0,0.08)",
              background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(129,208,245,0.06))",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <c.icon size={18} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
              <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {c.label}
              </span>
            </div>
            <span style={{ fontSize: "26px", fontWeight: 600, color: "#000000", lineHeight: 1.1 }}>{c.value}</span>
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)" }}>{c.sub}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.08)",
          background: "#ffffff",
          padding: "16px 18px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 500, color: "#000000", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Trophy size={16} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} />
          Недавние события
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {MANAGER_RECENT_ACHIEVEMENT_EVENTS.map((b, i) => {
            const st = badgeKindStyle(b.kind);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: `1px solid ${st.border}`,
                  background: st.bg,
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#000000", flex: "1 1 200px" }}>{b.title}</span>
                <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)" }}>{b.who}</span>
                <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)", marginLeft: "auto" }}>{b.when}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.08)",
            background: "#fafafa",
            flex: "1 1 220px",
            minWidth: 0,
          }}
        >
          <Search size={16} color={brandIcon.muted} strokeWidth={brandIcon.sw} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по сотруднику или статусу…"
            aria-label="Поиск по команде"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "13px",
              flex: 1,
              minWidth: 0,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      <div style={{ borderRadius: "14px", border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden", background: "#ffffff" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.03)", textAlign: "left" }}>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "rgba(0,0,0,0.65)" }}>Сотрудник</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "rgba(0,0,0,0.65)" }}>Роль</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "rgba(0,0,0,0.65)", whiteSpace: "nowrap" }}>Бейджи</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "rgba(0,0,0,0.65)", whiteSpace: "nowrap" }}>Сертификаты</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "rgba(0,0,0,0.65)" }}>Последнее событие</th>
                <th style={{ padding: "10px 14px", fontWeight: 500, color: "rgba(0,0,0,0.65)" }}>Заметка</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "24px 14px", color: "rgba(0,0,0,0.45)", textAlign: "center" }}>
                    Ничего не найдено.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 500, color: "#000000" }}>{r.name}</td>
                    <td style={{ padding: "12px 14px", color: "rgba(0,0,0,0.75)" }}>{r.role}</td>
                    <td style={{ padding: "12px 14px", color: "#000000", fontWeight: 500 }}>{r.badges}</td>
                    <td style={{ padding: "12px 14px", color: "rgba(0,0,0,0.75)" }}>{r.certs}</td>
                    <td style={{ padding: "12px 14px", color: "rgba(0,0,0,0.75)", maxWidth: "280px" }}>{r.lastEvent}</td>
                    <td style={{ padding: "12px 14px", color: "rgba(0,0,0,0.55)", fontSize: "11px" }}>{r.highlight ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
