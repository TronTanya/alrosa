import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { AccountInfo } from "@azure/msal-browser";
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
import { Calendar as CalIcon, ChevronLeft, ChevronRight, BookOpen, ExternalLink, Mail, Video } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { computeFreeLearningSlots } from "../lib/calendarFreeSlots";
import { fetchOutlookCalendarRange } from "../lib/graphCalendar";
import {
  isMsalAutoLoginEnabled,
  isOutlookMsalConfigured,
  OUTLOOK_MSAL_AUTO_REDIRECT_LOCK_KEY,
  OUTLOOK_MSAL_SKIP_AUTO_KEY,
  outlookLoginRedirect,
  outlookLogoutRedirect,
  outlookMsalInitialize,
  tryOutlookSilentSignIn,
} from "../lib/outlookMsal";
import {
  clearStoredNylasGrant,
  exchangeNylasCode,
  fetchNylasAuthUrl,
  fetchNylasEventsRange,
  getNylasOAuthRedirectUri,
  NYLAS_GRANT_STORAGE_KEY,
  readStoredNylasGrant,
} from "../lib/nylasCalendar";
/** Календарь Outlook в браузере (Microsoft 365 / личная учётная запись) */
export const OUTLOOK_OFFICE_CALENDAR = "https://outlook.office.com/calendar/";
export const OUTLOOK_LIVE_CALENDAR = "https://outlook.live.com/calendar/0/";

function resolveOutlookCalendarUrl(): string {
  const fromEnv = typeof import.meta.env.VITE_OUTLOOK_CALENDAR_URL === "string" ? import.meta.env.VITE_OUTLOOK_CALENDAR_URL.trim() : "";
  return fromEnv || OUTLOOK_OFFICE_CALENDAR;
}

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
  const [tab, setTab] = useState<"outlook" | "lms">("outlook");
  const outlookEmbedUrl = useMemo(() => resolveOutlookCalendarUrl(), []);
  const outlookIntegrationOn = isOutlookMsalConfigured();

  const [msAccount, setMsAccount] = useState<AccountInfo | null>(null);
  const [graphEvents, setGraphEvents] = useState<CalEvent[]>([]);
  const [graphBusy, setGraphBusy] = useState(false);
  const [graphError, setGraphError] = useState<string | null>(null);

  const [nylasGrantId, setNylasGrantId] = useState<string | null>(() => readStoredNylasGrant());
  const [nylasBusy, setNylasBusy] = useState(false);
  const [nylasError, setNylasError] = useState<string | null>(null);
  const [nylasEvents, setNylasEvents] = useState<CalEvent[]>([]);
  const [nylasEventsLoading, setNylasEventsLoading] = useState(false);
  const [nylasReloadTick, setNylasReloadTick] = useState(0);
  const oauthCode = searchParams.get("code");
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
  }, [oauthCode, oauthSessionState, setSearchParams]);

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));

  const loadGraphEvents = useCallback(async (account: AccountInfo) => {
    setGraphBusy(true);
    setGraphError(null);
    try {
      const rangeStart = startOfDay(startOfMonth(viewMonth));
      const rangeEnd = endOfMonth(addMonths(viewMonth, 3));
      const rows = await fetchOutlookCalendarRange(account, rangeStart, rangeEnd);
      setGraphEvents(rows);
    } catch (e) {
      if (e instanceof Error && e.name === "AuthRedirect") return;
      setGraphError(e instanceof Error ? e.message : "Не удалось загрузить календарь");
      setGraphEvents([]);
    } finally {
      setGraphBusy(false);
    }
  }, [viewMonth]);

  /** Авто-подключение Outlook: кэш MSAL → тихий SSO → при необходимости редирект на Microsoft (если не только Nylas). */
  useEffect(() => {
    if (!outlookIntegrationOn) return;
    if (nylasGrantId) return;
    if (nylasBusy) return;
    if (oauthCode && !oauthSessionState) return;

    let cancelled = false;
    (async () => {
      try {
        const acc = await tryOutlookSilentSignIn();
        if (!acc) {
          if (!isMsalAutoLoginEnabled()) return;
          if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(OUTLOOK_MSAL_SKIP_AUTO_KEY) === "1") return;
          if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(OUTLOOK_MSAL_AUTO_REDIRECT_LOCK_KEY) === "1") return;
          try {
            sessionStorage.setItem(OUTLOOK_MSAL_AUTO_REDIRECT_LOCK_KEY, "1");
          } catch {
            /* ignore */
          }
          await outlookLoginRedirect();
          return;
        }
        if (cancelled) return;
        const app = await outlookMsalInitialize();
        app.setActiveAccount(acc);
        setMsAccount(acc);
        await loadGraphEvents(acc);
      } catch {
        /* не ломаем страницу, если кэш MSAL недоступен */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [outlookIntegrationOn, nylasGrantId, nylasBusy, oauthCode, oauthSessionState, loadGraphEvents]);

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
  }, [nylasGrantId, viewMonth, nylasReloadTick]);

  const mergedCalendarEvents = useMemo(() => {
    if (graphEvents.length === 0 && nylasEvents.length === 0) return demoEvents;
    const byKey = new Map<string, CalEvent>();
    for (const ev of demoEvents) byKey.set(ev.id, ev);
    for (const ev of graphEvents) byKey.set(ev.id, ev);
    for (const ev of nylasEvents) byKey.set(ev.id, ev);
    return Array.from(byKey.values()).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [graphEvents, nylasEvents, demoEvents]);

  const outlookBusyIntervals = useMemo(
    () =>
      [...graphEvents, ...nylasEvents].map((e) => ({
        start: e.start,
        end: e.end ?? addHours(e.start, 1),
      })),
    [graphEvents, nylasEvents],
  );

  const freeLearningSlots = useMemo(() => {
    if (!msAccount && !nylasGrantId) return [];
    const from = startOfDay(new Date());
    const to = addDays(from, 21);
    return computeFreeLearningSlots(outlookBusyIntervals, from, to, { slotMinutes: 120, maxSlots: 12 });
  }, [msAccount, nylasGrantId, outlookBusyIntervals]);

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
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
          <div style={{ flex: "1 1 280px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div
                style={{
                  width: "4px",
                  height: "22px",
                  borderRadius: "4px",
                  background: "linear-gradient(180deg,#81d0f5,#81d0f5)",
                }}
              />
              <h1 style={{ fontSize: "21px", fontWeight: "800", color: "#000000", margin: 0, letterSpacing: "-0.4px" }}>
                Календарь
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: 1.55, maxWidth: "640px" }}>
              {tab === "outlook"
                ? nylasGrantId
                  ? "События Outlook подгружаются через Nylas и отображаются в сетке и в списке ниже. Полный Outlook — ссылки внизу страницы."
                  : outlookIntegrationOn
                    ? "Вход через Microsoft: события основного календаря отображаются в сетке и в «Плане обучения» (Microsoft Graph). Полный Outlook откройте в отдельной вкладке — кнопки ниже."
                    : "Подключите Microsoft (Graph) или Nylas ниже. Полный веб-календарь Outlook — кнопки внизу страницы."
                : msAccount || nylasGrantId
                  ? "Календарь объединяет демо-события ЛМС и загруженные из Outlook встречи."
                  : "Демо-события обучения в ЛМС. После входа в Microsoft или Nylas на вкладке «Outlook» сюда подтянутся ваши встречи."}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setTab("outlook")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "12px",
                background:
                  tab === "outlook"
                    ? "linear-gradient(135deg, rgba(129,208,245,.25), rgba(129,208,245,.12))"
                    : "rgba(129,208,245,.05)",
                border: tab === "outlook" ? "1px solid rgba(129,208,245,.35)" : "1px solid rgba(129,208,245,.1)",
                color: "#000000",
                fontSize: "12px",
                fontWeight: "700",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <Mail size={16} color={brandIcon.accentCyan} strokeWidth={brandIcon.sw} />
              Outlook
            </button>
            <button
              type="button"
              onClick={() => setTab("lms")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "12px",
                background: tab === "lms" ? "linear-gradient(135deg, rgba(129,208,245,.2), rgba(129,208,245,.1))" : "rgba(129,208,245,.05)",
                border: tab === "lms" ? "1px solid rgba(129,208,245,.35)" : "1px solid rgba(129,208,245,.1)",
                color: "#000000",
                fontSize: "12px",
                fontWeight: "700",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <CalIcon size={16} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
              План обучения
            </button>
          </div>
        </div>
      </motion.div>

      {msAccount ? (
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
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#000000", marginBottom: "6px" }}>
                Занятость Outlook и окна для обучения
              </div>
              <p style={{ fontSize: "12px", color: "#000000", margin: 0, lineHeight: 1.55 }}>
                По загруженным встречам строится занятость; ниже — свободные 2‑часовые окна в будни (9:00–18:00) на три недели вперёд. Их
                можно использовать как ориентир при выборе времени на курс и заявке руководителю.
              </p>
            </div>
          </div>
          {graphBusy && graphEvents.length === 0 ? (
            <div style={{ fontSize: "12px", color: "#000000" }}>Загрузка встреч из Outlook…</div>
          ) : (
            <>
              <div style={{ fontSize: "11px", color: "#000000", marginBottom: "10px" }}>
                Встреч в календаре (период запроса): <strong>{graphEvents.length}</strong>
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
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#000000" }}>
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
                            fontWeight: "700",
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
                  Свободных 2‑часовых окон в заданных рамках не найдено — календарь плотный или встречи не подгрузились. Обновите события на
                  вкладке «Outlook» или откройте Outlook в отдельной вкладке (кнопки ниже).
                </div>
              )}
            </>
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
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#000000", textTransform: "capitalize" }}>{title}</div>
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
                  fontWeight: "700",
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
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", marginBottom: "4px" }}>Ближайшие события</div>
          <div style={{ fontSize: "11px", color: "#000000", marginBottom: "14px" }}>
            {nylasGrantId
              ? "Демо ЛМС и встречи из Outlook через Nylas."
              : msAccount
                ? "Демо-события ЛМС и встречи из Outlook (Microsoft Graph)."
                : "Показаны демо-даты. Войдите в Microsoft или подключите Nylas на вкладке «Outlook»."}
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
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", lineHeight: 1.35 }}>{ev.title}</div>
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
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#000000", marginBottom: "8px" }}>
                {format(selected, "d MMMM yyyy", { locale: ru })}
              </div>
              {eventsForDay(selected, mergedCalendarEvents).length === 0 ? (
                <div style={{ fontSize: "12px", color: "#000000" }}>
                  Нет событий на этот день. Подключите календарь (Microsoft или Nylas) на вкладке «Outlook».
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

      {tab === "outlook" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            marginBottom: "20px",
            padding: "16px",
            borderRadius: "16px",
            background: "rgba(129,208,245,.04)",
            border: "1px solid rgba(129,208,245,.1)",
            overflow: "hidden",
          }}
        >
          {outlookIntegrationOn ? (
            <div
              style={{
                marginBottom: "14px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "rgba(129,208,245,.07)",
                border: "1px solid rgba(129,208,245,.22)",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", marginBottom: "10px" }}>
                Вход Microsoft · календарь через Graph API
              </div>
              {graphError ? (
                <div style={{ fontSize: "12px", color: "#b71c1c", marginBottom: "10px", lineHeight: 1.45 }}>{graphError}</div>
              ) : null}
              {msAccount ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#000000" }}>
                    Аккаунт: <strong>{msAccount.name ?? msAccount.username}</strong>
                  </span>
                  <button
                    type="button"
                    disabled={graphBusy}
                    onClick={() => loadGraphEvents(msAccount)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(129,208,245,.35)",
                      background: "rgba(129,208,245,.12)",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: graphBusy ? "wait" : "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {graphBusy ? "Обновление…" : "Обновить события"}
                  </button>
                  <button
                    type="button"
                    disabled={graphBusy}
                    onClick={async () => {
                      try {
                        setGraphError(null);
                        try {
                          sessionStorage.setItem(OUTLOOK_MSAL_SKIP_AUTO_KEY, "1");
                        } catch {
                          /* ignore */
                        }
                        await outlookLogoutRedirect(msAccount);
                        setMsAccount(null);
                        setGraphEvents([]);
                      } catch (e) {
                        setGraphError(e instanceof Error ? e.message : "Ошибка выхода");
                      }
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0,0,0,.12)",
                      background: "#fafafa",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <>
                <p style={{ fontSize: "11px", color: "#000000", margin: "0 0 10px", lineHeight: 1.5 }}>
                  Вход выполняется в этой же вкладке (редирект на Microsoft), всплывающие окна не используются — подходит при блокировке popup.
                </p>
                <button
                  type="button"
                  disabled={graphBusy}
                  onClick={async () => {
                    try {
                      setGraphError(null);
                      try {
                        sessionStorage.removeItem(OUTLOOK_MSAL_SKIP_AUTO_KEY);
                      } catch {
                        /* ignore */
                      }
                      await outlookLoginRedirect();
                    } catch (e) {
                      setGraphError(e instanceof Error ? e.message : "Не удалось начать вход");
                    }
                  }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(129,208,245,.4)",
                    background: "linear-gradient(135deg, rgba(129,208,245,.28), rgba(129,208,245,.12))",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: graphBusy ? "wait" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Войти с Microsoft
                </button>
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                marginBottom: "14px",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "rgba(0,0,0,.02)",
                border: "1px dashed rgba(129,208,245,.25)",
                fontSize: "12px",
                color: "#000000",
                lineHeight: 1.55,
              }}
            >
              Для загрузки встреч в интерфейс укажите <code style={{ fontSize: "11px" }}>VITE_MSAL_CLIENT_ID</code> в{" "}
              <code style={{ fontSize: "11px" }}>.env</code> (приложение Microsoft Entra ID, разрешения Calendars.Read, User.Read).
              Инструкция — в <code style={{ fontSize: "11px" }}>.env.example</code>.
            </div>
          )}
          <div
            style={{
              marginBottom: "14px",
              padding: "14px 16px",
              borderRadius: "14px",
              background: "rgba(227,0,11,.04)",
              border: "1px solid rgba(227,0,11,.15)",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#000000", marginBottom: "8px" }}>
              Nylas · Outlook (Hosted OAuth)
            </div>
            <p style={{ fontSize: "11px", color: "#000000", margin: "0 0 10px", lineHeight: 1.5 }}>
              Альтернатива прямому входу Microsoft: бэкенд с Nylas v3. Callback URI в дашборде Nylas:{" "}
              <code style={{ fontSize: "10px" }}>{getNylasOAuthRedirectUri()}</code>.
              Запуск: <code style={{ fontSize: "10px" }}>npm run backend:nylas</code> и переменные в <code style={{ fontSize: "10px" }}>backend/.env</code>.
            </p>
            {nylasError ? (
              <div style={{ fontSize: "12px", color: "#b71c1c", marginBottom: "10px", lineHeight: 1.45 }}>{nylasError}</div>
            ) : null}
            {nylasGrantId ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#000000" }}>
                    {nylasEventsLoading ? "Загрузка событий из Outlook…" : `События в календаре: ${nylasEvents.length}`}
                  </span>
                  <button
                    type="button"
                    disabled={nylasEventsLoading}
                    onClick={() => setNylasReloadTick((t) => t + 1)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(129,208,245,.35)",
                      background: "rgba(129,208,245,.1)",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: nylasEventsLoading ? "wait" : "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Обновить из Nylas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearStoredNylasGrant();
                      setNylasGrantId(null);
                      setNylasError(null);
                      setNylasEvents([]);
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0,0,0,.12)",
                      background: "#fafafa",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Отключить Nylas
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={nylasBusy}
                onClick={async () => {
                  try {
                    setNylasError(null);
                    const redirectUri = getNylasOAuthRedirectUri();
                    const url = await fetchNylasAuthUrl(redirectUri);
                    window.location.href = url;
                  } catch (e) {
                    setNylasError(e instanceof Error ? e.message : "Не удалось получить ссылку Nylas");
                  }
                }}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  border: "1px solid rgba(227,0,11,.35)",
                  background: "linear-gradient(135deg, rgba(227,0,11,.12), rgba(129,208,245,.12))",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: nylasBusy ? "wait" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {nylasBusy ? "Обмен кода…" : "Подключить Outlook через Nylas"}
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#000000", lineHeight: 1.5, maxWidth: "560px" }}>
              Полный календарь Outlook в браузере — откройте в новой вкладке кнопками ниже.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <a
                href={outlookEmbedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(129,208,245,.25), rgba(129,208,245,.12))",
                  border: "1px solid rgba(129,208,245,.3)",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "700",
                  textDecoration: "none",
                  fontFamily: "inherit",
                }}
              >
                Открыть Outlook (работа / M365)
                <ExternalLink size={14} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
              </a>
              <a
                href={OUTLOOK_LIVE_CALENDAR}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(129,208,245,.06)",
                  border: "1px solid rgba(129,208,245,.12)",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "none",
                  fontFamily: "inherit",
                }}
              >
                Outlook (личный)
                <ExternalLink size={14} color={brandIcon.muted} strokeWidth={brandIcon.swSm} style={{ opacity: 0.85 }} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
