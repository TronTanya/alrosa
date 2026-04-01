import { deepseekChat } from "./deepseekClient";

export type IdpMentorCourseJson = {
  title: string;
  type: "internal" | "external";
  duration: string;
  roi: string;
  provider: string;
  slots: number;
  date: string;
  rating: number;
  participants: number;
  icon: "cpu" | "book" | "trending";
  /** Ссылка на программу / каталог (https) */
  url?: string;
};

export type IdpMentorPlan = {
  intro: string;
  stats: {
    competency_growth: string;
    timeline: string;
    ipr_fit: string;
  };
  courses: IdpMentorCourseJson[];
};

export type FetchIdpMentorOutcome = { ok: true; data: IdpMentorPlan } | { ok: false; error: string };

function stripJsonFence(raw: string): string {
  const t = raw.trim();
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : t;
}

function tryExtractJsonObject(raw: string): string | null {
  const t = stripJsonFence(raw);
  try {
    JSON.parse(t);
    return t;
  } catch {
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const slice = t.slice(start, end + 1);
      try {
        JSON.parse(slice);
        return slice;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function num(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(",", "."));
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function intSlots(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(1, Math.round(v));
  if (typeof v === "string") {
    const n = parseInt(v.replace(/\D/g, ""), 10);
    if (Number.isFinite(n)) return Math.max(1, n);
  }
  return fallback;
}

function normalizeIcon(v: unknown): "cpu" | "book" | "trending" {
  const s = typeof v === "string" ? v.toLowerCase().trim() : "";
  if (s.includes("book") || s.includes("книг")) return "book";
  if (s.includes("trend") || s.includes("cloud") || s.includes("aws")) return "trending";
  return "cpu";
}

function normalizeType(v: unknown): "internal" | "external" {
  const s = typeof v === "string" ? v.toLowerCase() : "";
  return s.includes("external") || s.includes("внешн") ? "external" : "internal";
}

function normalizeUrlField(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const u = raw.trim();
  if (!/^https?:\/\//i.test(u)) return undefined;
  try {
    const parsed = new URL(u);
    if (!parsed.hostname.includes(".")) return undefined;
    return parsed.href;
  } catch {
    return undefined;
  }
}

function normalizeCourse(raw: Record<string, unknown>): IdpMentorCourseJson | null {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const provider = typeof raw.provider === "string" ? raw.provider.trim() : "";
  if (!title || !provider) return null;

  const url = normalizeUrlField(raw.url);

  return {
    title,
    type: normalizeType(raw.type),
    duration: typeof raw.duration === "string" ? raw.duration.trim() : "—",
    roi:
      typeof raw.roi === "string"
        ? raw.roi.trim()
        : typeof raw.roi === "number"
          ? `+${Math.round(raw.roi)}%`
          : `+${Math.round(num(raw.roi, 20))}%`,
    provider,
    slots: intSlots(raw.slots, 3),
    date: typeof raw.date === "string" ? raw.date.trim() : "—",
    rating: Math.min(5, Math.max(0, num(raw.rating, 4.7))),
    participants: Math.max(1, Math.round(num(raw.participants, 20))),
    icon: normalizeIcon(raw.icon),
    ...(url ? { url } : {}),
  };
}

const SYSTEM = `Ты персональный ИИ-наставник корпоративного портала «Алроса ИТ». Сотрудник: Александр Иванов, Middle Software Engineer, цель к концу года — уверенный Senior; цели развития на 2026 год, русскоязычная среда.

Сформируй индивидуальный план развития на 6 месяцев и ровно 3 рекомендуемых курса (внутренние корпоративные и/или внешние), с упором на отечественные программы где уместно (Stepik, Практикум, Нетология, корпоративный университет) плюс сильные внешние при необходимости.

Верни ТОЛЬКО JSON-объект:
{
  "intro": "2–4 предложения на «ты», дружелюбно: что учёл в плане развития, упомяни Outlook-слоты обобщённо",
  "stats": {
    "competency_growth": "+N%",
    "timeline": "6 мес.",
    "ipr_fit": "N%"
  },
  "courses": [
    {
      "title": "",
      "type": "internal",
      "duration": "N часов",
      "roi": "+N%",
      "provider": "",
      "url": "https://... прямая ссылка на страницу курса (/course/, /learn/, /promo и т.п.), не главная сайта",
      "slots": 3,
      "date": "краткая дата по-русски",
      "rating": 4.8,
      "participants": 24,
      "icon": "cpu"
    }
  ]
}

Обязательно поле "url" с https:// — только конкретная страница программы, без «голых» доменов платформ.
icon только: "cpu" | "book" | "trending".
type: "internal" или "external".
Ровно 3 курса в массиве courses.`;

export async function fetchIdpMentorPlan(userMessage: string, signal?: AbortSignal): Promise<FetchIdpMentorOutcome> {
  const out = await deepseekChat(
    [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Запрос сотрудника: «${userMessage.trim()}». Построй план развития на 6 месяцев и три курса с ROI и датами старта.`,
      },
    ],
    { max_tokens: 3500, temperature: 0.4, signal, response_format: { type: "json_object" } }
  );

  if (!out.ok) return { ok: false, error: out.reason };

  const jsonStr = tryExtractJsonObject(out.content);
  if (!jsonStr) {
    return { ok: false, error: "Не удалось разобрать JSON плана развития." };
  }

  try {
    const data = JSON.parse(jsonStr) as Record<string, unknown>;
    const intro = typeof data.intro === "string" ? data.intro.trim() : "";
    const statsRaw = data.stats && typeof data.stats === "object" ? (data.stats as Record<string, unknown>) : {};
    const stats = {
      competency_growth:
        typeof statsRaw.competency_growth === "string" ? statsRaw.competency_growth : "+34%",
      timeline: typeof statsRaw.timeline === "string" ? statsRaw.timeline : "6 мес.",
      ipr_fit: typeof statsRaw.ipr_fit === "string" ? statsRaw.ipr_fit : "96%",
    };

    if (!Array.isArray(data.courses)) {
      return { ok: false, error: "В ответе нет массива courses." };
    }

    const courses: IdpMentorCourseJson[] = [];
    for (const item of data.courses) {
      if (item && typeof item === "object") {
        const c = normalizeCourse(item as Record<string, unknown>);
        if (c) courses.push(c);
      }
    }

    if (courses.length === 0) {
      return { ok: false, error: "Модель не вернула ни одного курса." };
    }

    return {
      ok: true,
      data: {
        intro: intro || "Готово: подобрал план развития на полгода и три курса с учётом вашего профиля и целей.",
        stats,
        courses: courses.slice(0, 3),
      },
    };
  } catch {
    return { ok: false, error: "Ошибка разбора плана развития." };
  }
}
