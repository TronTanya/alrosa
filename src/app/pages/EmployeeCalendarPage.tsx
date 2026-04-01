import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  addDays,
  addHours,
  isAfter,
  startOfDay,
} from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight, BookOpen, Video } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { computeFreeLearningSlots } from "../lib/calendarFreeSlots";
import {
  exchangeNylasCode,
  fetchNylasEventsRange,
  getNylasOAuthRedirectUri,
  NYLAS_GRANT_STORAGE_KEY,
  readStoredNylasGrant,
} from "../lib/nylasCalendar";

type CalEvent = {
  id: string;
  start: Date;
  end?: Date;
  title: string;
  hint?: string;
};

const weekdayShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function eventsForDay(day: Date, events: CalEvent[]): CalEvent[] {
  return events.filter((e) => isSameDay(startOfDay(e.start), startOfDay(day)));
}

export function EmployeeCalendarPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [nylasGrantId, setNylasGrantId] = useState<string | null>(() => readStoredNylasGrant());
  const [nylasBusy, setNylasBusy] = useState(false);
  const [_nylasError, setNylasError] = useState<string | null>(null);
  const [nylasEvents, setNylasEvents] = useState<CalEvent[]>([]);
  const [_nylasEventsLoading, setNylasEventsLoading] = useState(false);

  const oauthCode = searchParams.get("code");
  const oauthState = searchParams.get("state");
  /** Ответ Azure AD после MSAL (не путать с OAuth-кодом Nylas на том же пути календаря). */
  const oauthSessionState = searchParams.get("session_state");
  const oauthErr = searchParams.get("error");
  const oauthErrDesc = searchParams.get("error_description");

  const demoEvents = useMemo((): CalEvent[] => {
    const d0 = startOfDay(new Date());
    return [
      {
        id: "demo-1",
        start: addDays(d0, 2),
        end: addHours(addDays(d0, 2), 1),
        title: "Созвон с ИИ-наставником",
        hint: "Teams",
      },
      {
        id: "demo-2",
        start: addDays(d0, 9),
        end: addHours(addDays(d0, 9), 1),
        title: "Дедлайн модуля «Корпоративная безопасность»",
        hint: "ЛМС",
      },
    ];
  }, []);

  useEffect(() => {
    if (!oauthErr) return;
    setNylasError(oauthErrDesc || oauthErr);
    const next = new URLSearchParams(searchParams);
    next.delete("error");
    next.delete("error_description");
    next.delete("state");
    setSearchParams(next, { replace: true });
  }, [oauthErr, oauthErrDesc, searchParams, setSearchParams]);

  useEffect(() => {
    if (!oauthCode || oauthSessionState) return;
    if (oauthState === "yandex_calendar") return; /* код Яндекс OAuth игнорируем — блок отключён */
    let cancelled = false;
    (async () => {
      setNylasBusy(true);
      setNylasError(null);
      try {
        const redirectUri = getNylasOAuthRedirectUri();
        const { grant_id } = await exchangeNylasCode(oauthCode, redirectUri);
        if (cancelled) return;
        localStorage.setItem(NYLAS_GRANT_STORAGE_KEY, grant_id);
        setNylasGrantId(grant_id);
      } catch (e) {
        if (!cancelled) setNylasError(e instanceof Error ? e.message : "Ошибка обмена Nylas");
      } finally {
        if (!cancelled) {
          setNylasBusy(false);
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              next.delete("code");
              next.delete("state");
              return next;
            },
            { replace: true },
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [oauthCode, oauthSessionState, oauthState, setSearchParams]);

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    if (!nylasGrantId) {
      setNylasEvents([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setNylasEventsLoading(true);
      setNylasError(null);
      try {
        const rangeStart = startOfDay(startOfMonth(viewMonth));
        const rangeEnd = endOfMonth(addMonths(viewMonth, 3));
        const ev = await fetchNylasEventsRange(nylasGrantId, rangeStart, rangeEnd);
        if (cancelled) return;
        setNylasEvents(
          ev.map((e) => ({
            id: e.id,
            start: e.start,
            end: e.end,
            title: e.title,
            hint: e.hint,
          })),
        );
      } catch (e) {
        if (!cancelled) {
          setNylasError(e instanceof Error ? e.message : "Nylas: не удалось загрузить события");
          setNylasEvents([]);
        }
      } finally {
        if (!cancelled) setNylasEventsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nylasGrantId, viewMonth]);

  const mergedCalendarEvents = useMemo(() => {
    const connected = !!nylasGrantId || nylasEvents.length > 0;

    if (!connected) {
      return demoEvents;
    }

    const byKey = new Map<string, CalEvent>();
    for (const ev of nylasEvents) byKey.set(ev.id, ev);
    for (const ev of demoEvents) {
      if (!byKey.has(ev.id)) byKey.set(ev.id, ev);
    }
    return Array.from(byKey.values()).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [nylasEvents, demoEvents, nylasGrantId]);

  const outlookBusyIntervals = useMemo(
    () =>
      nylasEvents.map((e) => ({
        start: e.start,
        end: e.end ?? addHours(e.start, 1),
      })),
    [nylasEvents],
  );

  const freeLearningSlots = useMemo(() => {
    if (!nylasGrantId) return [];
    const from = startOfDay(new Date());
    const to = addDays(from, 21);
    return computeFreeLearningSlots(outlookBusyIntervals, from, to, { slotMinutes: 120, maxSlots: 12 });
  }, [nylasGrantId, outlookBusyIntervals]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [viewMonth]);

  const [selected, setSelected] = useState<Date | null>(() => startOfDay(new Date()));

  const upcoming = useMemo(() => {
    const now = startOfDay(new Date());
    return [...mergedCalendarEvents]
      .filter((e) => isAfter(e.start, now) || isSameDay(e.start, now))
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 8);
  }, [mergedCalendarEvents]);

  const title = format(viewMonth, "LLLL yyyy", { locale: ru });

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div
              style={{
                width: "4px",
                height: "22px",
                borderRadius: "4px",
                background: "linear-gradient(180deg,#81d0f5,#81d0f5)",
              }}
            />
            <h1 style={{ fontSize: "21px", fontWeight: "600", color: "#000000", margin: 0, letterSpacing: "-0.4px" }}>
              Календарь
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "720px" }}>
            Сетка и список объединяют демо-план обучения в ЛМС и встречи из календаря при подключении через Nylas (если настроено).
          </p>
        </div>
      </motion.div>

      {nylasGrantId ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            marginBottom: "18px",
            padding: "16px 18px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(129,208,245,.12), rgba(227,0,11,0.04))",
            border: "1px solid rgba(129,208,245,.22)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
            <BookOpen size={20} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} style={{ marginTop: "2px" }} />
            <div style={{ flex: "1 1 240px", minWidth: 0 }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#000000", marginBottom: "6px" }}>
                Занятость календаря и окна для обучения
              </div>
              <p style={{ fontSize: "12px", color: "#000000", margin: 0, lineHeight: 1.55 }}>
                По загруженным встречам строится занятость; ниже — свободные 2‑часовые окна в будни (9:00–18:00) на
                три недели вперёд. Их можно использовать как ориентир при выборе времени на курс и заявке руководителю.
              </p>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "#000000", marginBottom: "10px" }}>
            Встреч в календаре (период): <strong>{nylasEvents.length}</strong>
          </div>
          {freeLearningSlots.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {freeLearningSlots.map((slot, i) => {
                    const hint = `Свободное окно: ${format(slot.start, "d MMMM yyyy", { locale: ru })}, ${format(slot.start, "HH:mm")}–${format(slot.end, "HH:mm")} — подобрать курс и отправить заявку.`;
                    return (
                      <div
                        key={`${slot.start.toISOString()}-${i}`}
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "12px",
                          background: "rgba(255,255,255,.7)",
                          border: "1px solid rgba(129,208,245,.2)",
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: "500", color: "#000000" }}>
                          {format(slot.start, "EEE d MMM", { locale: ru })} · {format(slot.start, "HH:mm")}–{format(slot.end, "HH:mm")}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate("/courses", { state: { slotHint: hint } })}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(135deg, #e3000b, #ff6b6b)",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Записаться на курс
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: "12px", color: "#000000" }}>
                  Свободных 2‑часовых окон в заданных рамках не найдено — календарь плотный или встречи не подгрузились. Обновите события в подключённом
                  календаре.
                </div>
              )}
        </motion.div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "16px",
          alignItems: "start",
          marginBottom: "20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          style={{
            padding: "18px",
            borderRadius: "16px",
            background: "rgba(129,208,245,.04)",
            border: "1px solid rgba(129,208,245,.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <button
              type="button"
              aria-label="Предыдущий месяц"
              onClick={() => {
                setSelected(null);
                setViewMonth((m) => addMonths(m, -1));
              }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid rgba(129,208,245,.1)",
                background: "rgba(129,208,245,.05)",
                color: "#000000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            </button>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#000000", textTransform: "capitalize" }}>{title}</div>
            <button
              type="button"
              aria-label="Следующий месяц"
              onClick={() => {
                setSelected(null);
                setViewMonth((m) => addMonths(m, 1));
              }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid rgba(129,208,245,.1)",
                background: "rgba(129,208,245,.05)",
                color: "#000000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronRight size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
              marginBottom: "8px",
            }}
          >
            {weekdayShort.map((d) => (
              <div
                key={d}
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: "#000000",
                  textAlign: "center",
                  padding: "4px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {days.map((day) => {
              const inMonth = isSameMonth(day, viewMonth);
              const dayEvents = eventsForDay(day, mergedCalendarEvents);
              const hasEvent = dayEvents.length > 0;
              const isSel = selected && isSameDay(day, selected);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelected(day)}
                  style={{
                    aspectRatio: "1",
                    minHeight: "36px",
                    borderRadius: "10px",
                    border: isSel ? "1px solid rgba(129,208,245,.6)" : "1px solid transparent",
                    background: isSel
                      ? "linear-gradient(135deg, rgba(129,208,245,.35), rgba(129,208,245,.2))"
                      : hasEvent
                        ? "rgba(129,208,245,.12)"
                        : inMonth
                          ? "rgba(129,208,245,.04)"
                          : "transparent",
                    color: inMonth ? "#000000" : "#000000",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: isSel ? "800" : "600",
                    fontFamily: "inherit",
                    position: "relative",
                  }}
                >
                  {format(day, "d")}
                  {hasEvent && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#81d0f5",
                        boxShadow: "0 0 6px rgba(129,208,245,.8)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            padding: "18px",
            borderRadius: "16px",
            background: "rgba(129,208,245,.03)",
            border: "1px solid rgba(129,208,245,.08)",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: "500", color: "#000000", marginBottom: "4px" }}>Ближайшие события</div>
          <div style={{ fontSize: "11px", color: "#000000", marginBottom: "14px" }}>
            {nylasGrantId
              ? "Демо ЛМС и встречи из календаря через Nylas."
              : "Показаны демо-даты. Подключите календарь через Nylas (если настроено в приложении)."}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {upcoming.map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "rgba(129,208,245,.08)",
                  border: "1px solid rgba(129,208,245,.06)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <Video size={16} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} style={{ marginTop: "2px", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "500", color: "#000000", lineHeight: 1.35 }}>{ev.title}</div>
                  <div style={{ fontSize: "12px", color: "#000000", marginTop: "4px" }}>
                    {format(ev.start, "d MMMM yyyy", { locale: ru })} · {format(ev.start, "HH:mm")}—
                    {format(ev.end ?? addHours(ev.start, 1), "HH:mm")}
                    {ev.hint ? ` · ${ev.hint}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(129,208,245,.06)" }}>
              <div style={{ fontSize: "12px", fontWeight: "500", color: "#000000", marginBottom: "8px" }}>
                {format(selected, "d MMMM yyyy", { locale: ru })}
              </div>
              {eventsForDay(selected, mergedCalendarEvents).length === 0 ? (
                <div style={{ fontSize: "12px", color: "#000000" }}>
                  Нет событий на этот день. При подключённом Nylas события подтянутся из календаря.
                </div>
              ) : (
                eventsForDay(selected, mergedCalendarEvents).map((ev) => (
                  <div key={ev.id} style={{ fontSize: "13px", color: "#000000", marginBottom: "6px" }}>
                    {format(ev.start, "HH:mm")}—{format(ev.end ?? addHours(ev.start, 1), "HH:mm")} · {ev.title}
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
