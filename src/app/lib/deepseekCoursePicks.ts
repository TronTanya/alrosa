import { deepseekChat } from "./deepseekClient";
import { employeeAiCoursePicks, employeeAiCoursePicksById, type EmployeeAiCoursePickRow } from "../data/employeeAiCoursePicks";

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

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function intMatch(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  if (typeof v === "string") {
    const n = parseInt(v.replace(/\D/g, ""), 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function rowToLivePick(row: EmployeeAiCoursePickRow, overrides: { reason?: string; match?: unknown }): LiveAiCoursePick {
  const match =
    overrides.match !== undefined && overrides.match !== null && overrides.match !== ""
      ? clamp(intMatch(overrides.match, row.match), 65, 99)
      : row.match;
  const reason =
    typeof overrides.reason === "string" && overrides.reason.trim()
      ? overrides.reason.trim()
      : row.reason;
  return {
    id: row.id,
    title: row.title,
    provider: row.provider,
    url: row.url,
    rating: row.rating,
    reviews: row.reviews,
    match,
    duration: row.duration,
    tags: row.tags,
    reason,
  };
}

const CATALOG_SNIPPET = employeeAiCoursePicks.map((c) => ({
  id: c.id,
  title: c.title,
  provider: c.provider,
  tags: c.tags,
}));

const SYSTEM_PROMPT = `Ты аналитик корпоративного обучения «Алроса ИТ». Тебе дан ЖЁСТКИЙ каталог курсов (id, title, provider, tags) — это единственный допустимый источник рекомендаций.

Твоя задача: выбрать 4–6 позиций из каталога по релевантности профилю пользователя, УПОРЯДОЧИТЬ от более подходящих к менее, при необходимости слегка скорректировать match (65–99) и reason на русском (1–2 предложения, почему курс подходит).

КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО придумывать новые id, новые курсы или URL — используй ТОЛЬКО id из переданного JSON-каталога.

Верни ТОЛЬКО один JSON-объект (без markdown, без текста вокруг):
{
  "note": "одно короткое предложение на русском: что учтено в подборе",
  "selection": [
    {
      "id": "строка — один из id каталога",
      "match": 92,
      "reason": "почему курс подходит — на русском"
    }
  ]
}

Правила:
- В "selection" от 4 до 6 элементов, id не повторяются.
- Каждый id обязан существовать в каталоге пользователя.
- match: число 65–99.
- reason и note на русском.`;

const USER_PROMPT = `Профиль: Middle Software Engineer, backend / распределённые системы, работа в российской компании.
Цели развития 2026: system design, TypeScript, ML для инженеров, observability/SRE, лидерство в ИТ.

Каталог курсов (JSON):
${JSON.stringify(CATALOG_SNIPPET, null, 0)}

Подбери 4–6 курсов из каталога по релевантности; верни только JSON по схеме из системной инструкции.`;

type SelectionItem = { id?: unknown; match?: unknown; reason?: unknown };

function parseSelectionResponse(content: string): { note: string; selection: SelectionItem[] } | null {
  const jsonStr = tryExtractJsonObject(content);
  if (!jsonStr) return null;
  try {
    const data = JSON.parse(jsonStr) as { note?: unknown; selection?: unknown };
    const note = typeof data.note === "string" ? data.note.trim() : "";
    if (!Array.isArray(data.selection)) return null;
    return { note, selection: data.selection as SelectionItem[] };
  } catch {
    return null;
  }
}

/** Дополняет подбор до 4–6 курсов проверенными ссылками из каталога. */
function buildCoursesFromSelection(selection: SelectionItem[]): LiveAiCoursePick[] {
  const seen = new Set<string>();
  const out: LiveAiCoursePick[] = [];

  for (const item of selection) {
    const id = typeof item.id === "string" ? item.id.trim() : "";
    if (!id || seen.has(id)) continue;
    const row = employeeAiCoursePicksById.get(id);
    if (!row) continue;
    seen.add(id);
    const reasonOverride = typeof item.reason === "string" ? item.reason : undefined;
    out.push(rowToLivePick(row, { match: item.match, reason: reasonOverride }));
  }

  for (const row of employeeAiCoursePicks) {
    if (out.length >= 6) break;
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(rowToLivePick(row, {}));
  }

  return out.slice(0, 6);
}

/** Запрос к модели (YandexGPT): ранжирование курсов из каталога (рабочие ссылки из данных приложения). */
export async function fetchLiveAiCoursePicks(signal?: AbortSignal): Promise<FetchCoursePicksOutcome> {
  const out = await deepseekChat(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT },
    ],
    {
      max_tokens: 4096,
      temperature: 0.25,
      signal,
      response_format: { type: "json_object" },
    },
  );

  if (!out.ok) {
    return { ok: false, error: out.reason };
  }

  const parsed = parseSelectionResponse(out.content);
  if (!parsed) {
    return {
      ok: false,
      error:
        "Ответ модели не удалось разобрать как JSON с полем selection. Попробуйте «Обновить подбор».",
    };
  }

  const courses = buildCoursesFromSelection(parsed.selection);
  if (courses.length === 0) {
    return {
      ok: false,
      error: "Модель не выбрала ни одного известного id курса. Попробуйте «Обновить подбор».",
    };
  }

  return {
    ok: true,
    data: {
      courses,
      note: parsed.note || "Подбор сформирован из корпоративного каталога с проверенными ссылками.",
    },
  };
}
