import { deepseekChat } from "./deepseekClient";
import { isDomesticCourseUrl } from "./domesticCourseUrl";
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
  if (!isDomesticCourseUrl(url)) return null;

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

const SYSTEM_PROMPT = `Ты аналитик корпоративного обучения «Алроса ИТ». Подбираешь ТОЛЬКО отечественные курсы: платформы РФ, русскоязычные программы на российских доменах (.ru, .рф, .edu.ru) и признанные сервисы (Stepik, Яндекс Практикум, Нетология, Skillbox, GeekBrains, Hexlet, Открытое образование, OTUS и т.д.).

Важно по составу подборки: нужны не только «популярные» массовые онлайн-курсы, но и программы от образовательных организаций высшего и среднего профессионального образования — государственных и коммерческих вузов и колледжей: дистанционные и очно-заочные программы, ДПО, профпереподготовка, курсы на openedu.ru, программы на Stepik от вузов, страницы конкретных курсов/направлений на официальных сайтах вузов и колледжей (в т.ч. .edu.ru). Старайся сбалансировать список: часть позиций — с коммерческих школ/платформ, часть — из академической среды (вуз/колледж), если есть релевантные публичные ссылки. В поле "provider" указывай понятно: например «МФТИ · …», «Колледж …», «Нетология», «Stepik · ИТМО».

КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО включать курсы с зарубежных MOOC и глобальных площадок: Coursera, edX, Udemy, Pluralsight, Khan Academy, LinkedIn Learning, AWS/Google/Microsoft training на международных доменах и любые аналоги. Если не находишь 4–6 уверенных отечественных вариантов — всё равно не подставляй зарубежные ссылки; лучше честно сузь список в note.

Верни ТОЛЬКО один JSON-объект (без markdown, без текста вокруг):
{
  "note": "одно короткое предложение на русском (что учтено в подборе)",
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
- Ровно 4–6 элементов в "courses", все — исключительно отечественные площадки (см. выше).
- По возможности включи программы разного типа: и с крупных онлайн-платформ, и с сайтов вузов/колледжей (государственных или коммерческих), если есть прямые ссылки на страницу курса.
- Каждый "url" — прямой https:// на страницу курса на допустимом домене (.ru, .рф, .edu.ru, stepik.org, practicum.yandex.ru, hexlet.io и т.п.).
- В "reason" укажи, почему программа уместна (в т.ч. если это вузовская/колледжская программа — кратко: уровень, аккредитация/формат, язык).
- rating: число 0–5 (допускается строка "4.7").
- match: число 65–98 (процент).
- reviews: строка.
- Не используй главные страницы платформ без пути к курсу.
- Теги и reason на русском.`;

const USER_PROMPT = `Профиль: Middle Software Engineer, backend / распределённые системы, работа в российской компании.
Цели развития 2026: system design, TypeScript, ML для инженеров, observability/SRE, лидерство в ИТ.

Подбери 4–6 курсов ТОЛЬКО на отечественных площадках под этот план: сочетай популярные открытые курсы и программы вузов/колледжей (государственных и коммерческих), где уместно. Для каждого курса — проверяемая прямая ссылка на страницу программы (не главную сайта). Зарубежные платформы не использовать.`;

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

/** Запрос к модели (YandexGPT): подбор курсов. */
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
      error:
        "Ответ модели не удалось разобрать как JSON с полем courses, либо все ссылки не с отечественных площадок. Попробуйте «Обновить подбор».",
    };
  }
  return { ok: true, data: parsed };
}
