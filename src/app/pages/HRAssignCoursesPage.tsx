import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, Search, Trash2, UserCheck, Users } from "lucide-react";
import { hrEmployeesDirectory } from "../data/hrEmployeesDirectory";
import { brandIcon } from "../lib/brandIcons";
import {
  addHrCuratedCourse,
  HR_CURATED_COURSES_UPDATED,
  readHrCuratedCourses,
  removeHrCuratedCourse,
  type HrCuratedCourse,
  type HrCuratedCourseFormat,
} from "../lib/hrCuratedCoursesStorage";

const FORMAT_OPTIONS: { val: HrCuratedCourseFormat; label: string }[] = [
  { val: "внутренний", label: "Внутренний" },
  { val: "внешний", label: "Внешний" },
  { val: "онлайн", label: "Онлайн" },
  { val: "смешанный", label: "Смешанный" },
];

function formatRuDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

function employeeLabel(id: string): string {
  const e = hrEmployeesDirectory.find((x) => x.id === id);
  return e ? `${e.name} · ${e.department}` : id;
}

export function HRAssignCoursesPage() {
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [format, setFormat] = useState<HrCuratedCourseFormat>("внутренний");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [empQ, setEmpQ] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<HrCuratedCourse[]>(() => readHrCuratedCourses());
  const [toast, setToast] = useState<string | null>(null);

  const sync = useCallback(() => setSaved(readHrCuratedCourses()), []);

  useEffect(() => {
    sync();
    window.addEventListener(HR_CURATED_COURSES_UPDATED, sync);
    return () => window.removeEventListener(HR_CURATED_COURSES_UPDATED, sync);
  }, [sync]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredEmployees = useMemo(() => {
    const qq = empQ.trim().toLowerCase();
    return hrEmployeesDirectory.filter((e) => {
      if (!qq) return true;
      return (
        e.name.toLowerCase().includes(qq) ||
        e.department.toLowerCase().includes(qq) ||
        e.role.toLowerCase().includes(qq) ||
        e.email.toLowerCase().includes(qq) ||
        e.id.includes(qq)
      );
    });
  }, [empQ]);

  const visibleEmployees = useMemo(() => filteredEmployees.slice(0, 100), [filteredEmployees]);

  const toggleEmp = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const e of visibleEmployees) next.add(e.id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setToast("Укажите название курса");
      return;
    }
    if (!provider.trim()) {
      setToast("Укажите провайдера или площадку");
      return;
    }
    if (selectedIds.size === 0) {
      setToast("Выберите хотя бы одного сотрудника");
      return;
    }
    addHrCuratedCourse({
      title,
      provider,
      format,
      description,
      url,
      employeeIds: [...selectedIds],
    });
    setTitle("");
    setProvider("");
    setFormat("внутренний");
    setDescription("");
    setUrl("");
    clearSelection();
    setToast("Курс добавлен и назначен выбранным сотрудникам");
  };

  const onRemove = (id: string) => {
    if (!window.confirm("Удалить этот курс и все назначения?")) return;
    removeHrCuratedCourse(id);
    setToast("Запись удалена");
  };

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
                <GraduationCap size={22} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                <h1
                  className="type-display"
                  style={{
                    fontSize: "21px",
                    fontWeight: 600,
                    color: "#000000",
                    letterSpacing: "-0.4px",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Назначение курсов
                </h1>
              </div>
              <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "760px" }}>
                Сформируйте курс (название, формат, провайдер) и отметьте сотрудников из реестра, которым он назначается.
                Данные сохраняются в браузере (демо).
              </p>
            </div>
          </div>
        </motion.div>

        {toast && (
          <div
            role="status"
            style={{
              marginBottom: "14px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(129,208,245,0.14)",
              border: "1px solid rgba(129,208,245,0.35)",
              fontSize: "13px",
              color: "#000000",
            }}
          >
            {toast}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "16px",
            alignItems: "start",
            marginBottom: "20px",
          }}
        >
          <form className="glass-card" onSubmit={submit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#000000", marginBottom: "4px" }}>Новый курс</div>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.55)" }}>Название</span>
              <input
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                placeholder="Например: «Продвинутый TypeScript»"
                required
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.25)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.55)" }}>Провайдер / площадка</span>
              <input
                value={provider}
                onChange={(ev) => setProvider(ev.target.value)}
                placeholder="Корпоративный университет, Stepik, партнёр…"
                required
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.25)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.55)" }}>Формат</span>
              <select
                value={format}
                onChange={(ev) => setFormat(ev.target.value as HrCuratedCourseFormat)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.25)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                  cursor: "pointer",
                }}
              >
                {FORMAT_OPTIONS.map((o) => (
                  <option key={o.val} value={o.val}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.55)" }}>Описание (необязательно)</span>
              <textarea
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
                placeholder="Цели, длительность, формат занятий…"
                rows={3}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.25)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                  resize: "vertical",
                  minHeight: "72px",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.55)" }}>Ссылка (необязательно)</span>
              <input
                value={url}
                onChange={(ev) => setUrl(ev.target.value)}
                placeholder="https://…"
                type="url"
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.25)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                }}
              />
            </label>
            <button
              type="submit"
              style={{
                marginTop: "6px",
                padding: "11px 16px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #e3000b, #81d0f5)",
                color: "#000000",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Сохранить и назначить ({selectedIds.size} сотр.)
            </button>
          </form>

          <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "320px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#000000" }}>Сотрудники</span>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    background: "rgba(227,0,11,0.1)",
                    border: "1px solid rgba(227,0,11,0.22)",
                    color: "#e3000b",
                    fontWeight: 500,
                  }}
                >
                  выбрано: {selectedIds.size}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={selectFiltered}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(129,208,245,0.35)",
                    background: "transparent",
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    color: "#000000",
                  }}
                >
                  + все в списке ({visibleEmployees.length})
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "transparent",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    color: "rgba(0,0,0,0.55)",
                  }}
                >
                  Сбросить
                </button>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#000000",
                  opacity: 0.4,
                  pointerEvents: "none",
                }}
              />
              <input
                value={empQ}
                onChange={(ev) => setEmpQ(ev.target.value)}
                placeholder="Поиск по имени, отделу, роли…"
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.25)",
                  background: "rgba(129,208,245,0.06)",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                  color: "#000000",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)", margin: 0 }}>
              Показано до 100 строк по фильтру. В реестре {hrEmployeesDirectory.length} сотрудников.
            </p>
            <div className="custom-scroll" style={{ flex: 1, maxHeight: "min(52vh, 420px)", overflowY: "auto", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)" }}>
              {visibleEmployees.map((e) => {
                const on = selectedIds.has(e.id);
                return (
                  <label
                    key={e.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "8px 10px",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      background: on ? "rgba(129,208,245,0.12)" : "transparent",
                    }}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggleEmp(e.id)} style={{ marginTop: "3px" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: "#000000" }}>{e.name}</div>
                      <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.5)", lineHeight: 1.4 }}>
                        {e.department} · {e.role}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <UserCheck size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#000000" }}>Назначенные курсы</span>
            <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>({saved.length})</span>
          </div>
          {saved.length === 0 ? (
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.55)", margin: 0 }}>Пока нет записей — создайте первый курс выше.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                    {["Курс", "Формат", "Провайдер", "Сотрудников", "Создан", ""].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "10px 8px",
                          fontSize: "10px",
                          fontWeight: 500,
                          color: "rgba(0,0,0,0.5)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {saved.map((row) => (
                    <tr key={row.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "#000000" }}>{row.title}</div>
                        {row.description && (
                          <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.55)", marginTop: "4px", maxWidth: "280px" }}>
                            {row.description}
                          </div>
                        )}
                        {row.url && (
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "11px", color: "#e3000b", marginTop: "4px", display: "inline-block" }}
                          >
                            Ссылка
                          </a>
                        )}
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: "12px", color: "#000000", whiteSpace: "nowrap" }}>{row.format}</td>
                      <td style={{ padding: "12px 8px", fontSize: "12px", color: "#000000" }}>{row.provider}</td>
                      <td style={{ padding: "12px 8px", fontSize: "12px", color: "#000000", verticalAlign: "top" }}>
                        <div>{row.employeeIds.length}</div>
                        <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.5)", marginTop: "6px", lineHeight: 1.45, maxWidth: "240px" }}>
                          {row.employeeIds.slice(0, 4).map((id) => (
                            <div key={id}>{employeeLabel(id)}</div>
                          ))}
                          {row.employeeIds.length > 4 && <div>… ещё {row.employeeIds.length - 4}</div>}
                        </div>
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: "12px", color: "rgba(0,0,0,0.65)", whiteSpace: "nowrap" }}>
                        {formatRuDate(row.createdAt)}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <button
                          type="button"
                          aria-label="Удалить"
                          onClick={() => onRemove(row.id)}
                          style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid rgba(227,0,11,0.25)",
                            background: "rgba(227,0,11,0.06)",
                            cursor: "pointer",
                            color: "#e3000b",
                            display: "inline-flex",
                          }}
                        >
                          <Trash2 size={16} strokeWidth={brandIcon.sw} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
