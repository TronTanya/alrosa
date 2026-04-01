/**
 * Семантический подбор через DeepSeek (OpenAI-совместимый API).
 *
 * Локально: задайте DEEPSEEK_API_KEY в .env — Vite проксирует /deepseek-api без утечки ключа в бандл.
 * Иначе: VITE_DEEPSEEK_API_KEY (ключ попадёт в клиент — только для прототипов).
 */

import { deepseekChat } from "./deepseekClient";

export type DeepseekCatalogItem = {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
};

export type DeepseekSearchAIResult = {
  orderedIds: string[];
  summary: string;
};

function stripJsonFence(raw: string): string {
  const t = raw.trim();
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : t;
}

function parseAIResponse(content: string): DeepseekSearchAIResult | null {
  try {
    const text = stripJsonFence(content);
    const data = JSON.parse(text) as { ids?: unknown; summary?: unknown };
    if (!Array.isArray(data.ids)) return null;
    const orderedIds = data.ids.filter((x): x is string => typeof x === "string");
    const summary = typeof data.summary === "string" ? data.summary.trim() : "";
    if (orderedIds.length === 0 && !summary) return null;
    return { orderedIds, summary };
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `Ты помощник корпоративного портала обучения «Алроса ИТ». По запросу пользователя и каталогу сущностей выбери наиболее релевантные пункты.

Правила:
- В ответе ТОЛЬКО один JSON-объект, без текста до или после.
- Поле "ids": массив строк — до 5 id из каталога, от более релевантных к менее.
- Поле "summary": одна короткая фраза на русском (до 200 символов), почему ты так ранжируешь; если нечего подобрать — пустая строка "".
- Используй ТОЛЬКО id из переданного каталога, не выдумывай новые.
- Если ничего не подходит, верни "ids": [] и "summary": "По запросу нет явных совпадений в каталоге."`;

export async function deepseekRankSearch(
  userQuery: string,
  catalog: DeepseekCatalogItem[],
  signal?: AbortSignal
): Promise<DeepseekSearchAIResult | null> {
  if (!userQuery.trim() || catalog.length === 0) return null;

  const catalogJson = JSON.stringify(
    catalog.map((c) => ({ id: c.id, kind: c.kind, title: c.title, subtitle: c.subtitle }))
  );

  const out = await deepseekChat(
    [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Запрос пользователя: «${userQuery.trim()}»\n\nКаталог (JSON):\n${catalogJson}`,
      },
    ],
    { max_tokens: 500, temperature: 0.2, signal }
  );

  if (!out.ok) return null;
  return parseAIResponse(out.content);
}
