import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Star,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Clock,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { fetchLiveAiCoursePicks, type LiveAiCoursePick } from "../lib/deepseekCoursePicks";
import { coursePageHref } from "../lib/courseUrls";
import {
  formatRuDateShort,
  readStoredTrainingApplications,
  submitTrainingApplication,
  TRAINING_APPLICATIONS_UPDATED,
} from "../lib/trainingApplicationsStorage";
import { AlrosaLogo, BrandLine } from "../components/AlrosaBrand";
import { brandIcon } from "../lib/brandIcons";

/** Демо-данные: подбор под Middle Software Engineer + цели развития 2026 (если API недоступен) */
export const aiPicks = [
  {
    id: "1",
    title: "System Design: масштабируемые системы",
    provider: "Coursera · University of Alberta",
    url: "https://www.coursera.org/learn/software-architecture",
    rating: 4.8,
    reviews: "12k",
    match: 96,
    duration: "8 недель",
    tags: ["архитектура", "backend"],
    reason:
      "Курс University of Alberta по архитектуре ПО и UML — совпадает с целью по проектированию распределённых систем.",
  },
  {
    id: "2",
    title: "Продвинутый TypeScript и типобезопасность",
    provider: "Stepik",
    url: "https://stepik.org/course/235437/promo",
    rating: 4.9,
    reviews: "3.4k",
    match: 93,
    duration: "6 недель",
    tags: ["frontend", "TypeScript"],
    reason:
      "Полный курс JS/TS на Stepik: теория, практика и типизация — близко к вашему стеку и отзывам сообщества.",
  },
  {
    id: "3",
    title: "Машинное обучение для инженеров ПО",
    provider: "Coursera · DeepLearning.AI / Stanford",
    url: "https://www.coursera.org/learn/machine-learning",
    rating: 4.7,
    reviews: "8k",
    match: 88,
    duration: "12 недель",
    tags: ["ML", "Python"],
    reason:
      "Специализация Andrew Ng по ML на Python: линейные модели и классификация — база для инженерных задач с данными.",
  },
  {
    id: "4",
    title: "Observability: метрики, логи, трассировки",
    provider: "Udemy · Stephen Grider",
    url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
    rating: 4.6,
    reviews: "21k",
    match: 91,
    duration: "4 недели",
    tags: ["DevOps", "SRE"],
    reason:
      "Docker и Kubernetes в одном курсе: метрики, деплой и наблюдаемость в проде — близко к задачам SRE и DevOps.",
  },
];

/** Пройденные обучения — с рабочими ссылками на платформы */
export const completedCourses = [
  {
    title: "Корпоративная безопасность 2026",
    provider: "Coursera · IBM",
    url: "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst",
    finishedAt: "2025-12-18",
  },
  {
    title: "Git и командная разработка",
    provider: "Stepik · SF Education",
    url: "https://stepik.org/course/3145/promo",
    finishedAt: "2025-10-05",
  },
];

/** Активные и запланированные курсы из плана (без завершённых — они в «Пройденные») */
export const assignedCourses = [
  {
    title: "Основы лидерства в ИТ",
    progress: 65,
    status: "active" as const,
    provider: "Coursera",
    url: "https://www.coursera.org/learn/leading-teams",
  },
  {
    title: "Английский B2 для IT",
    progress: 40,
    status: "active" as const,
    provider: "Coursera",
    url: "https://www.coursera.org/browse/language-learning/learning-english",
  },
  {
    title: "Алроса ИТ: внутренние процессы",
    progress: 0,
    status: "pending" as const,
    provider: "Алроса ИТ",
    url: undefined,
  },
];

const STATIC_LIVE_PICKS: LiveAiCoursePick[] = aiPicks.map((c) => ({
  id: c.id,
  title: c.title,
  provider: c.provider,
  url: c.url,
  rating: c.rating,
  reviews: c.reviews,
  match: c.match,
  duration: c.duration,
  tags: c.tags,
  reason: c.reason,
}));

const APPROVAL_STORAGE = "alrosa_course_approval_ids";

function loadApprovedIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(APPROVAL_STORAGE);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function saveApprovedIds(ids: Set<string>) {
  sessionStorage.setItem(APPROVAL_STORAGE, JSON.stringify([...ids]));
}

export function CoursesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const slotHint = (location.state as { slotHint?: string } | null)?.slotHint;
  const abortRef = useRef<AbortController | null>(null);
  const [rows, setRows] = useState<LiveAiCoursePick[]>(STATIC_LIVE_PICKS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fromLiveAi, setFromLiveAi] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(() => loadApprovedIds());
  const [pendingApprovals, setPendingApprovals] = useState(() => readStoredTrainingApplications());

  useEffect(() => {
    const sync = () => setPendingApprovals(readStoredTrainingApplications());
    window.addEventListener(TRAINING_APPLICATIONS_UPDATED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(TRAINING_APPLICATIONS_UPDATED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const loadPicks = useCallback((isManualRefresh: boolean) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setApiError(null);

    fetchLiveAiCoursePicks(ac.signal)
      .then((out) => {
        if (ac.signal.aborted) return;
        if (out.ok && out.data.courses.length > 0) {
          setRows(out.data.courses);
          setAiNote(out.data.note || null);
          setFromLiveAi(true);
          setApiError(null);
        } else {
          setRows(STATIC_LIVE_PICKS);
          setAiNote(null);
          setFromLiveAi(false);
          setApiError(out.ok ? null : out.error);
        }
      })
      .catch((e) => {
        if (!ac.signal.aborted) {
          setRows(STATIC_LIVE_PICKS);
          setAiNote(null);
          setFromLiveAi(false);
          setApiError(e instanceof Error ? e.message : "Неизвестная ошибка");
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      });
  }, []);

  useEffect(() => {
    loadPicks(false);
    return () => {
      abortRef.current?.abort();
    };
  }, [loadPicks]);

  const onApprove = (c: LiveAiCoursePick) => {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.add(c.id);
      saveApprovedIds(next);
      return next;
    });
    submitTrainingApplication({ title: c.title, provider: c.provider, url: c.url });
    navigate("/idp", { state: { pendingCourseApproval: { title: c.title, provider: c.provider, url: c.url } } });
  };

  return (
    <div className="courses-page courses-page--brand">
      <div className="courses-network-bg" aria-hidden />
      <div className="courses-inner">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <AlrosaLogo />
          <BrandLine wide />
          {slotHint ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="courses-panel courses-panel--accent"
              style={{
                marginBottom: "18px",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "1px solid rgba(129,208,245,.35)",
                background: "linear-gradient(135deg, rgba(129,208,245,.18), rgba(227,0,11,0.06))",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Clock size={20} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#000000", marginBottom: "6px" }}>Время из календаря</div>
                  <p style={{ fontSize: "12px", color: "#000000", margin: 0, lineHeight: 1.55 }}>{slotHint}</p>
                  <button
                    type="button"
                    onClick={() => navigate(".", { replace: true, state: {} })}
                    style={{
                      marginTop: "10px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(0,0,0,.12)",
                      background: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Скрыть подсказку
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
          <div className="courses-hero__row">
            <div className="courses-hero__titles">
              <h1 className="landing-h1">Мои курсы</h1>
              <p className="landing-lead">
                Искусственный интеллект (DeepSeek) учитывает и зарубежные, и отечественные открытые площадки (Stepik, Практикум,
                Нетология, Skillbox, вузовские программы, Coursera/edX и др.) — рейтинги, отзывы, язык программы и актуальность —
                и предлагает подборку под вашу роль и план развития. Рядом с курсом можно отправить заявку на согласование руководителю.
              </p>
            </div>
          </div>
        </motion.div>

        <BrandLine medium />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.4 }}
          className="courses-panel courses-panel--accent"
          style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
        >
          <div className="courses-icon-wrap">
            <Globe size={20} color={brandIcon.stroke} strokeWidth={brandIcon.sw} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="courses-panel__title">Как работает анализ</div>
            <p className="courses-panel__text">
              Модель обобщает сведения о курсах на российских и международных платформах (язык, формат, отзывы, длительность,
              навыки), сопоставляет с профилем и целями развития и формирует список с упором минимум на часть отечественных программ. Подбор
              обновляется при запросе и опирается на публичные знания о программах, а не на живой обход всего интернета.
              Рекомендации — ориентир: согласование — за вами и руководителем.
            </p>
          </div>
        </motion.div>

        <BrandLine variant="cyan" />

        <p className="courses-section-label">На согласовании</p>
        <div className="courses-list courses-list--pending">
          {pendingApprovals.length === 0 ? (
            <div style={{ padding: "14px 16px", fontSize: "13px", color: "#000000", lineHeight: 1.5 }}>
              Нет заявок в очереди. Отправьте курс на согласование из подборки ИИ или из наставника — он появится здесь и в
              разделе «Заявки на обучение».
            </div>
          ) : (
            pendingApprovals.map((app) => {
              const href = coursePageHref(app.url, app.title, app.provider);
              return (
                <div key={app.id} className="courses-list__row">
                  <Clock size={16} color={brandIcon.accentRed} strokeWidth={brandIcon.sw} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#000000", marginBottom: 4 }}>{app.title}</div>
                    <div style={{ fontSize: "11px", color: "#000000" }}>
                      {app.provider} · подано {formatRuDateShort(app.submittedAt)}
                    </div>
                  </div>
                  <span className="courses-status-pill">На согласовании</span>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="courses-btn courses-btn--cyan courses-btn--sm">
                    Сайт курса
                    <ExternalLink size={13} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
                  </a>
                </div>
              );
            })
          )}
        </div>

        <div className="courses-row-head">
          <p className="courses-section-label" style={{ margin: 0 }}>
            Лучшие курсы по версии ИИ
          </p>
          <button
            type="button"
            disabled={loading || refreshing}
            onClick={() => loadPicks(true)}
            className="courses-btn courses-btn--ghost courses-btn--sm"
            style={{ opacity: loading || refreshing ? 0.6 : 1, cursor: loading || refreshing ? "default" : "pointer" }}
          >
            <RefreshCw
              size={14}
              color={brandIcon.stroke}
              strokeWidth={brandIcon.swSm}
              style={{ animation: refreshing ? "spin 0.8s linear infinite" : undefined }}
            />
            Обновить подбор
          </button>
        </div>

        {fromLiveAi && aiNote ? <p className="courses-ai-note">{aiNote}</p> : null}
        {apiError ? (
          <div className="courses-api-error">
            <strong style={{ color: "#e3000b" }}>ИИ недоступен: </strong>
            {apiError}
            <div style={{ marginTop: 8, fontSize: 11, color: "#000000" }}>
              Файл <code>.env</code> в корне проекта: <code>DEEPSEEK_API_KEY=sk-...</code> (без кавычек). Затем полностью
              остановите и снова запустите <code>npm run dev</code>. Допустимо и <code>VITE_DEEPSEEK_API_KEY</code> — прокси подставит его тоже.
            </div>
          </div>
        ) : null}
        {!fromLiveAi && !loading && !apiError ? (
          <p className="courses-demo-hint">
            Показан локальный демо-подбор. Укажите ключ DeepSeek в .env и перезапустите dev — список подтянется из модели.
          </p>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              className="courses-ai-card"
            >
              <div className="courses-ai-card__rule" aria-hidden />
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span className="courses-match-pill">{c.match}% совпадение</span>
                    {c.tags.map((t) => (
                      <span key={t} className="courses-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "#000000", margin: "0 0 6px", lineHeight: 1.3 }}>{c.title}</h2>
                  <div style={{ fontSize: 12, color: "#000000", marginBottom: 10 }}>{c.provider}</div>
                  <div className="courses-ai-meta">
                    <span className="courses-ai-meta__star">
                      <Star size={14} fill="currentColor" color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
                      {c.rating} ({c.reviews} отзывов)
                    </span>
                    <span className="courses-ai-meta__muted">
                      <Clock size={14} color={brandIcon.muted} strokeWidth={brandIcon.swSm} />
                      {c.duration}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch", position: "relative", zIndex: 2 }}>
                  <a
                    href={coursePageHref(c.url, c.title, c.provider)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="courses-btn courses-btn--cyan"
                  >
                    Смотреть
                    <ExternalLink size={14} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
                  </a>
                  <button
                    type="button"
                    disabled={approvedIds.has(c.id)}
                    onClick={() => onApprove(c)}
                    className={approvedIds.has(c.id) ? "courses-btn courses-btn--ghost" : "courses-btn courses-btn--red"}
                  >
                    <FileCheck
                      size={14}
                      color={approvedIds.has(c.id) ? brandIcon.muted : brandIcon.stroke}
                      strokeWidth={brandIcon.swSm}
                    />
                    {approvedIds.has(c.id) ? "Отправлено на согласование" : "На согласование"}
                  </button>
                </div>
              </div>
              <p className="courses-ai-reason">
                <span className="courses-ai-reason__lead">Почему ИИ предлагает: </span>
                {c.reason}
              </p>
            </motion.article>
          ))}
        </div>

        <BrandLine />

        <p className="courses-section-label">Пройденные курсы</p>
        <div className="courses-list courses-list--done">
          {completedCourses.map((row) => {
            const href = coursePageHref(row.url, row.title, row.provider);
            return (
              <div key={row.title} className="courses-list__row">
                <CheckCircle2 size={18} color={brandIcon.stroke} strokeWidth={brandIcon.sw} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#000000" }}>{row.title}</div>
                  <div style={{ fontSize: "11px", color: "#000000", marginTop: 3 }}>
                    {row.provider} · завершено {row.finishedAt}
                  </div>
                </div>
                <a href={href} target="_blank" rel="noopener noreferrer" className="courses-btn courses-btn--cyan courses-btn--sm">
                  Сайт курса
                  <ExternalLink size={13} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
                </a>
              </div>
            );
          })}
        </div>

        <p className="courses-section-label">Уже в вашем плане</p>
        <div className="courses-list">
          {assignedCourses.map((row) => {
            const href = coursePageHref(row.url, row.title, row.provider);
            return (
              <div key={row.title} className="courses-list__row" style={{ padding: "10px 14px" }}>
                <BookOpen size={16} color={brandIcon.muted} strokeWidth={brandIcon.swSm} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: "140px", fontSize: "13px", color: "#000000" }}>{row.title}</span>
                <div className="courses-progress">
                  <div className="courses-progress__fill" style={{ width: `${row.progress}%` }} />
                </div>
                <span style={{ fontSize: "11px", color: "#000000", width: 36, textAlign: "right" }}>{row.progress}%</span>
                <a href={href} target="_blank" rel="noopener noreferrer" className="courses-btn courses-btn--cyan courses-btn--sm">
                  Сайт
                  <ExternalLink size={12} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
