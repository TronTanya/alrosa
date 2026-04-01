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
import { ChevronLeft, ChevronRight, BookOpen, ExternalLink, Video } from "lucide-react";
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
  exchangeNylasCode,
  fetchNylasEventsRange,
  getNylasOAuthRedirectUri,
  NYLAS_GRANT_STORAGE_KEY,
  readStoredNylasGrant,
} from "../lib/nylasCalendar";
import {
  buildYandexCalendarAuthorizeUrl,
  clearStoredYandexToken,
  exchangeYandexOAuthCode,
  fetchYandexCalendarRange,
  getYandexCalendarRedirectUri,
  readStoredYandexToken,
  writeStoredYandexToken,
} from "../lib/yandexCalendar";
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
  const outlookEmbedUrl = useMemo(() => resolveOutlookCalendarUrl(), []);
  const outlookIntegrationOn = isOutlookMsalConfigured();

  const [msAccount, setMsAccount] = useState<AccountInfo | null>(null);
  const [graphEvents, setGraphEvents] = useState<CalEvent[]>([]);
  const [graphBusy, setGraphBusy] = useState(false);
  const [graphError, setGraphError] = useState<string | null>(null);

  const [nylasGrantId, setNylasGrantId] = useState<string | null>(() => readStoredNylasGrant());
  const [nylasBusy, setNylasBusy] = useState(false);
  const [_nylasError, setNylasError] = useState<string | null>(null);
  const [nylasEvents, setNylasEvents] = useState<CalEvent[]>([]);
  const [_nylasEventsLoading, setNylasEventsLoading] = useState(false);

  const [yandexToken, setYandexToken] = useState<string | null>(() => readStoredYandexToken());
  const [yandexEvents, setYandexEvents] = useState<CalEvent[]>([]);
  const [yandexBusy, setYandexBusy] = useState(false);
  const [yandexError, setYandexError] = useState<string | null>(null);
  const [yandexReloadTick, setYandexReloadTick] = useState(0);
  const yandexOAuthConfigured =
    typeof import.meta.env.VITE_YANDEX_OAUTH_CLIENT_ID === "string" ? !!import.meta.env.VITE_YANDEX_OAUTH_CLIENT_ID.trim() : false;
  const yandexCallbackDisplay = typeof window !== "undefined" ? getYandexCalendarRedirectUri() : "http://localhost:5173/employee/calendar";
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
    if (oauthState === "yandex_calendar") return;
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

  /** Обмен кода Яндекс OAuth (не путать с Nylas и MSAL). */
  useEffect(() => {
    if (oauthState !== "yandex_calendar" || !oauthCode || oauthSessionState) return;
    let cancelled = false;
    (async () => {
      setYandexBusy(true);
      setYandexError(null);
      try {
        const { access_token } = await exchangeYandexOAuthCode(oauthCode);
        if (cancelled) return;
        writeStoredYandexToken(access_token);
        setYandexToken(access_token);
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("code");
            next.delete("state");
            return next;
          },
          { replace: true },
        );
      } catch (e) {
        if (!cancelled) setYandexError(e instanceof Error ? e.message : "Ошибка обмена кода Яндекса");
      } finally {
        if (!cancelled) setYandexBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [oauthCode, oauthState, oauthSessionState, setSearchParams]);

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
  }, [nylasGrantId, viewMonth]);

  useEffect(() => {
    if (!yandexToken) {
      setYandexEvents([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setYandexBusy(true);
      setYandexError(null);
      try {
        const rangeStart = startOfDay(startOfMonth(viewMonth));
        const rangeEnd = endOfMonth(addMonths(viewMonth, 3));
        const rows = await fetchYandexCalendarRange(yandexToken, rangeStart, rangeEnd);
        if (cancelled) return;
        setYandexEvents(
          rows.map((e) => ({
            id: e.id,
            start: e.start,
            end: e.end ?? addHours(e.start, 1),
            title: e.title,
            hint: e.hint,
          })),
        );
      } catch (e) {
        if (!cancelled) {
          setYandexError(e instanceof Error ? e.message : "Яндекс.Календарь: ошибка загрузки");
          setYandexEvents([]);
        }
      } finally {
        if (!cancelled) setYandexBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [yandexToken, viewMonth, yandexReloadTick]);

  const mergedCalendarEvents = useMemo(() => {
    const connected =
      !!msAccount ||
      !!nylasGrantId ||
      !!yandexToken ||
      graphEvents.length > 0 ||
      nylasEvents.length > 0 ||
      yandexEvents.length > 0;

    if (!connected) {
      return demoEvents;
    }

    const byKey = new Map<string, CalEvent>();
    for (const ev of graphEvents) byKey.set(ev.id, ev);
    for (const ev of nylasEvents) byKey.set(ev.id, ev);
    for (const ev of yandexEvents) byKey.set(ev.id, ev);
    for (const ev of demoEvents) {
      if (!byKey.has(ev.id)) byKey.set(ev.id, ev);
    }
    return Array.from(byKey.values()).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [graphEvents, nylasEvents, yandexEvents, demoEvents, msAccount, nylasGrantId, yandexToken]);

  const outlookBusyIntervals = useMemo(
    () =>
      [...graphEvents, ...nylasEvents, ...yandexEvents].map((e) => ({
        start: e.start,
        end: e.end ?? addHours(e.start, 1),
      })),
    [graphEvents, nylasEvents, yandexEvents],
  );

  const freeLearningSlots = useMemo(() => {
    if (!msAccount && !nylasGrantId && !yandexToken) return [];
    const from = startOfDay(new Date());
    const to = addDays(from, 21);
    return computeFreeLearningSlots(outlookBusyIntervals, from, to, { slotMinutes: 120, maxSlots: 12 });
  }, [msAccount, nylasGrantId, yandexToken, outlookBusyIntervals]);

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
            Сетка и список объединяют демо-план обучения в ЛМС и встречи из подключённых календарей. Ниже — вход Microsoft (если настроен), ссылки на
            Outlook в браузере, веб-календарь и OAuth Яндекса.
          </p>
        </div>
      </motion.div>

      {msAccount || nylasGrantId || yandexToken ? (
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
                По загруженным встречам (Outlook / Яндекс) строится занятость; ниже — свободные 2‑часовые окна в будни (9:00–18:00) на
                три недели вперёд. Их можно использовать как ориентир при выборе времени на курс и заявке руководителю.
              </p>
            </div>
          </div>
          {graphBusy && graphEvents.length === 0 && msAccount ? (
            <div style={{ fontSize: "12px", color: "#000000" }}>Загрузка встреч из Outlook…</div>
          ) : (
            <>
              <div style={{ fontSize: "11px", color: "#000000", marginBottom: "10px" }}>
                Встреч в выбранных календарях (период): Graph <strong>{graphEvents.length}</strong> · Nylas{" "}
                <strong>{nylasEvents.length}</strong> · Яндекс <strong>{yandexEvents.length}</strong>
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
              ? "Демо ЛМС и встречи из Outlook через Nylas."
              : yandexToken
                ? yandexError
                  ? "Не удалось подгрузить Яндекс.Календарь — см. блок ниже. Показаны демо-события ЛМС."
                  : yandexBusy
                    ? "Загрузка событий из Яндекса…"
                    : yandexEvents.length === 0
                      ? "Демо ЛМС; в Яндекс.Календаре в выбранном периоде событий нет (или проверьте месяц)."
                      : "Демо-события ЛМС и встречи из Яндекс.Календаря."
                : msAccount
                  ? "Демо-события ЛМС и встречи из Outlook (Microsoft Graph)."
                  : "Показаны демо-даты. Подключите календарь в блоках Outlook или Яндекс ниже."}
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
                  Нет событий на этот день. Подключите Outlook или Яндекс в блоках ниже.
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
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#000000", marginBottom: "10px" }}>
                Вход Microsoft · календарь через API Microsoft Graph
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
                      fontWeight: "500",
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
                      fontWeight: "500",
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
                    fontWeight: "500",
                    cursor: graphBusy ? "wait" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Войти с Microsoft
                </button>
                </>
              )}
            </div>
          ) : null}
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
                  fontWeight: "500",
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
                  fontWeight: "500",
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

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          marginBottom: "20px",
          padding: "16px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(255,220,80,.08), rgba(129,208,245,.06))",
          border: "1px solid rgba(255,200,0,.22)",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#000000", marginBottom: "6px" }}>Веб-календарь Яндекса</div>
        <p style={{ fontSize: "12px", color: "#000000", margin: "0 0 12px", lineHeight: 1.55, maxWidth: "720px" }}>
          Полноценный интерфейс{" "}
          <a href="https://calendar.yandex.ru/" target="_blank" rel="noopener noreferrer" style={{ color: "#000000" }}>
            calendar.yandex.ru
          </a>
          . Если область ниже пустая — Яндекс может запрещать встраивание; откройте календарь кнопкой в блоке «Яндекс.Календарь» ниже.
        </p>
        <div
          style={{
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid rgba(129,208,245,.2)",
            background: "rgba(255,255,255,.85)",
            minHeight: "min(62vh, 560px)",
          }}
        >
          <iframe
            title="Яндекс.Календарь"
            src="https://calendar.yandex.ru/"
            style={{
              width: "100%",
              height: "min(62vh, 560px)",
              border: "none",
              display: "block",
            }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          />
        </div>
      </motion.div>

      <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            marginBottom: "20px",
            padding: "16px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(255,220,80,.1), rgba(129,208,245,.06))",
            border: "1px solid rgba(255,200,0,.28)",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#000000", marginBottom: "8px" }}>Яндекс.Календарь</div>
          <p style={{ fontSize: "12px", color: "#000000", margin: "0 0 12px", lineHeight: 1.55 }}>
            Вход через{" "}
            <a href="https://oauth.yandex.ru/" target="_blank" rel="noopener noreferrer" style={{ color: "#000000" }}>
              Яндекс OAuth
            </a>
            , права: <code style={{ fontSize: "11px" }}>calendar:read</code> и <code style={{ fontSize: "11px" }}>login:info</code>. В{" "}
            <code style={{ fontSize: "11px" }}>.env</code> укажите <code style={{ fontSize: "11px" }}>VITE_YANDEX_OAUTH_CLIENT_ID</code> и{" "}
            <code style={{ fontSize: "11px" }}>YANDEX_OAUTH_CLIENT_SECRET</code> (секрет только на сервере разработки). Callback URI в кабинете
            приложения (точное совпадение): <code style={{ fontSize: "10px", wordBreak: "break-all" }}>{yandexCallbackDisplay}</code>. Загрузка
            событий — CalDAV, встроена в <code style={{ fontSize: "11px" }}>npm run dev</code> (middleware Vite).
            {!import.meta.env.DEV ? (
              <>
                {" "}
                <strong>Внимание:</strong> в <code style={{ fontSize: "11px" }}>vite preview</code> и production middleware нет — нужен свой backend с теми же путями{" "}
                <code style={{ fontSize: "10px" }}>/api/yandex/…</code>.
              </>
            ) : null}
          </p>
          {yandexError ? (
            <div style={{ fontSize: "12px", color: "#b71c1c", marginBottom: "10px", lineHeight: 1.45 }}>{yandexError}</div>
          ) : null}
          {yandexBusy && !yandexToken ? (
            <div style={{ fontSize: "12px", color: "#000000", marginBottom: "10px" }}>Подключение к Яндексу…</div>
          ) : null}
          {yandexToken ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "#000000" }}>
                {yandexBusy ? "Загрузка событий…" : `События в Яндекс.Календаре: ${yandexEvents.length}`}
              </span>
              <button
                type="button"
                disabled={yandexBusy}
                onClick={() => setYandexReloadTick((t) => t + 1)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,200,0,.4)",
                  background: "rgba(255,240,160,.25)",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: yandexBusy ? "wait" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Обновить из Яндекса
              </button>
              <button
                type="button"
                onClick={() => {
                  clearStoredYandexToken();
                  setYandexToken(null);
                  setYandexEvents([]);
                  setYandexError(null);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(0,0,0,.12)",
                  background: "#fafafa",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Отключить Яндекс
              </button>
            </div>
          ) : yandexOAuthConfigured ? (
            <button
              type="button"
              disabled={yandexBusy}
              onClick={() => {
                try {
                  setYandexError(null);
                  window.location.href = buildYandexCalendarAuthorizeUrl();
                } catch (e) {
                  setYandexError(e instanceof Error ? e.message : "Не удалось открыть авторизацию");
                }
              }}
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                border: "1px solid rgba(255,200,0,.45)",
                background: "linear-gradient(135deg, rgba(255,230,120,.35), rgba(129,208,245,.15))",
                fontSize: "12px",
                fontWeight: "500",
                cursor: yandexBusy ? "wait" : "pointer",
                fontFamily: "inherit",
                marginBottom: "12px",
              }}
            >
              Войти через Яндекс
            </button>
          ) : (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                background: "rgba(0,0,0,.02)",
                border: "1px dashed rgba(129,208,245,.25)",
                fontSize: "12px",
                color: "#000000",
                lineHeight: 1.55,
                marginBottom: "12px",
              }}
            >
              Задайте <code style={{ fontSize: "11px" }}>VITE_YANDEX_OAUTH_CLIENT_ID</code> в <code style={{ fontSize: "11px" }}>.env</code> и
              перезапустите dev-сервер.
            </div>
          )}
          <a
            href="https://calendar.yandex.ru/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "12px",
              background: "rgba(129,208,245,.08)",
              border: "1px solid rgba(129,208,245,.2)",
              color: "#000000",
              fontSize: "12px",
              fontWeight: "500",
              textDecoration: "none",
              fontFamily: "inherit",
            }}
          >
            Открыть Яндекс.Календарь в браузере
            <ExternalLink size={14} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
          </a>
        </motion.div>
    </>
  );
}
