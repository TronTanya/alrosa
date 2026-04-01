import { deepseekChat } from "./deepseekClient";
import { coursePageHref } from "./courseUrls";

/** Формат карточки «ИИ-подбор» на странице курсов (совместим с демо aiPicks). */
export type LiveAiCoursePick = {
  id: string;
  title: string;
  provider: string;
  url: string;
  rating: number;
  reviews: string;
  match: number;
  duration: string;
  tags: string[];
  reason: string;
};

export type LiveAiCourseResponse = {
  courses: LiveAiCoursePick[];
  note: string;
};

export type FetchCoursePicksOutcome =
  | { ok: true; data: LiveAiCourseResponse }
  | { ok: false; error: string };

function stripJsonFence(raw: string): string {
  const t = raw.trim();
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : t;
}

/** Если модель обернула JSON текстом — вырезаем объект с "courses". */
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
    const n = parseFloat(v.replace(",", ".").trim());
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function intMatch(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  if (typeof v === "string") {
    const n = parseInt(v.replace(/\D/g, ""), 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function normalizePick(raw: Record<string, unknown>, index: number): LiveAiCoursePick | null {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const provider = typeof raw.provider === "string" ? raw.provider.trim() : "";
  const urlRaw = typeof raw.url === "string" ? raw.url.trim() : "";
  if (!title || !provider) return null;
  const url = coursePageHref(urlRaw, title, provider);

  const rating = clamp(num(raw.rating, 4.5), 0, 5);
  const reviews = typeof raw.reviews === "string" ? raw.reviews.trim() : "—";
  const match = Math.round(clamp(intMatch(raw.match, 85), 60, 99));
  const duration = typeof raw.duration === "string" ? raw.duration.trim() : "—";
  const reason = typeof raw.reason === "string" ? raw.reason.trim() : "";
  const tags = Array.isArray(raw.tags) ? raw.tags.filter((t): t is string => typeof t === "string").slice(0, 6) : [];

  return {
    id: `live-${index}-${title.slice(0, 24).replace(/\s+/g, "-")}`,
    title,
    provider,
    url,
    rating,
    reviews,
    match,
    duration,
    tags,
    reason: reason || "Курс согласуется с вашим профилем и целями развития.",
  };
}

const SYSTEM_PROMPT = `Ты аналитик корпоративного обучения «Алроса ИТ». Подбираешь курсы по открытым данным в интернете: и зарубежные платформы, и отечественные (РФ и русскоязычные программы).

Отечественные и русскоязычные источники (обязательно учитывай в подборе): Stepik, Яндекс Практикум (practicum.yandex.ru), Нетология, Skillbox, GeekBrains, Hexlet, Открытое образование (openedu.ru), Coursera/EdX с курсами на русском или от российских вузов, платформы вузов (МФТИ, ИТМО, ВШЭ и др. на Stepik/своих LMS), ФРДО-аккредитованные программы где уместно, отечественные курсы по 152-ФЗ/ИБ для ИТ если релевантно.

Зарубежные примеры: Coursera, edX, Udemy, learn.microsoft.com и т.п.

Верни ТОЛЬКО один JSON-объект (без markdown, без текста вокруг):
{
  "note": "одно короткое предложение на русском",
  "courses": [
    {
      "title": "название курса",
      "provider": "платформа · автор/школа",
      "url": "https://...",
      "rating": 4.7,
      "reviews": "12k",
      "match": 92,
      "duration": "8 недель",
      "tags": ["навык1", "навык2"],
      "reason": "почему курс подходит — на русском, 1–2 предложения"
    }
  ]
}

Правила:
- Ровно 4–6 элементов в "courses".
- Обязательно: минимум 2 курса с отечественных или явно русскоязычных платформ (домены .ru, .рф, stepik.org, practicum.yandex.ru, netology.ru, skillbox.ru, geekbrains.ru, hexlet.io, openedu.ru и аналоги).
- Остальные можно с международных площадок для баланса.
- В поле "reason" для отечественных курсов кратко укажи, почему формат/язык/регуляторика удобны для сотрудника РФ, если уместно.
- rating: число 0–5 (допускается строка "4.7").
- match: число 65–98 (процент).
- reviews: строка.
- url: полный https:// на конкретную страницу курса (путь вида /course/…, /learn/…, /promo, /profile/…). Не используй главные страницы платформ (только домен без пути к курсу).
- Теги и reason на русском.`;

const USER_PROMPT = `Профиль: Middle Software Engineer, backend / распределённые системы, работа в российской компании.
Цели развития 2026: system design, TypeScript, ML для инженеров, observability/SRE, лидерство в ИТ.

Подбери 4–6 курсов: сочетай отечественные (минимум 2) и сильные зарубежные программы под этот план. Для каждого курса дай проверяемую прямую ссылку на страницу программы (не главную сайта).`;

function parseCourseResponse(content: string): LiveAiCourseResponse | null {
  const jsonStr = tryExtractJsonObject(content);
  if (!jsonStr) return null;
  try {
    const data = JSON.parse(jsonStr) as {
      note?: unknown;
      courses?: unknown;
    };
    const note = typeof data.note === "string" ? data.note.trim() : "";
    if (!Array.isArray(data.courses)) return null;
    const courses: LiveAiCoursePick[] = [];
    data.courses.forEach((item, i) => {
      if (item && typeof item === "object") {
        const p = normalizePick(item as Record<string, unknown>, i);
        if (p) courses.push(p);
      }
    });
    if (courses.length === 0) return null;
    return { courses, note };
  } catch {
    return null;
  }
}

/** Запрос к DeepSeek: подбор курсов. */
export async function fetchLiveAiCoursePicks(signal?: AbortSignal): Promise<FetchCoursePicksOutcome> {
  const out = await deepseekChat(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT },
    ],
    {
      max_tokens: 4096,
      temperature: 0.35,
      signal,
      response_format: { type: "json_object" },
    }
  );

  if (!out.ok) {
    return { ok: false, error: out.reason };
  }

  const parsed = parseCourseResponse(out.content);
  if (!parsed) {
    return {
      ok: false,
      error: "Ответ модели не удалось разобрать как JSON с полем courses. Попробуйте «Обновить подбор».",
    };
  }
  return { ok: true, data: parsed };
}
