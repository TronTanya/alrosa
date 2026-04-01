/**
 * Вызов Yandex Foundation Models (YandexGPT / Алиса) через прокси /yandex-llm-api или VITE_YANDEX_CLOUD_API_KEY.
 */

export type DeepseekChatOutcome =
  | { ok: true; content: string }
  | { ok: false; reason: string; httpStatus?: number };

/** Каталог по умолчанию — должен совпадать с каталогом сервисного аккаунта API-ключа (иначе HTTP 400). Переопределение: VITE_YANDEX_FOLDER_ID в .env */
export const YANDEX_DEFAULT_FOLDER_ID = "b1gnc9an0lt80ms6im44";

const PROXY_BASE = "/yandex-llm-api";
const DIRECT_URL = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

type YandexMsg = { role: "system" | "user" | "assistant"; text: string };

function buildModelUri(): string {
  const full = import.meta.env.VITE_YANDEX_MODEL_URI as string | undefined;
  if (full?.trim()) return full.trim();
  const folder =
    (import.meta.env.VITE_YANDEX_FOLDER_ID as string | undefined)?.trim() || YANDEX_DEFAULT_FOLDER_ID;
  const model = (import.meta.env.VITE_YANDEX_MODEL as string | undefined)?.trim() || "yandexgpt/latest";
  return `gpt://${folder}/${model}`;
}

function toYandexMessages(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  jsonMode: boolean
): YandexMsg[] {
  const base: YandexMsg[] = messages.map((m) => ({ role: m.role, text: m.content }));
  if (!jsonMode) return base;
  const hint = "Верни строго один JSON-объект без markdown и без текста до или после.";
  const sysIdx = base.findIndex((m) => m.role === "system");
  if (sysIdx >= 0) {
    const copy = [...base];
    copy[sysIdx] = { ...copy[sysIdx], text: `${copy[sysIdx].text}\n\n${hint}` };
    return copy;
  }
  return [{ role: "system", text: hint }, ...base];
}

export async function deepseekChat(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    signal?: AbortSignal;
    response_format?: { type: "json_object" };
  }
): Promise<DeepseekChatOutcome> {
  const clientKey = import.meta.env.VITE_YANDEX_CLOUD_API_KEY as string | undefined;
  const url = clientKey ? DIRECT_URL : `${PROXY_BASE}/foundationModels/v1/completion`;
  const folderId =
    (import.meta.env.VITE_YANDEX_FOLDER_ID as string | undefined)?.trim() || YANDEX_DEFAULT_FOLDER_ID;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (clientKey) {
    headers.Authorization = `Api-Key ${clientKey}`;
    headers["x-folder-id"] = folderId;
  }

  const jsonMode = options?.response_format?.type === "json_object";
  const yandexMessages = toYandexMessages(messages, jsonMode);

  let modelUri = buildModelUri();
  if (options?.model?.startsWith("gpt://")) {
    modelUri = options.model;
  }

  const maxTok = String(Math.min(Math.max(options?.max_tokens ?? 1024, 1), 8000));

  const body = {
    modelUri,
    completionOptions: {
      stream: false,
      temperature: options?.temperature ?? 0.2,
      maxTokens: maxTok,
    },
    messages: yandexMessages,
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: options?.signal,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      reason:
        msg.includes("Failed to fetch") || msg.includes("NetworkError")
          ? "Сеть: проверьте интернет. Для dev нужен запущенный npm run dev и прокси /yandex-llm-api."
          : msg,
    };
  }

  if (!res.ok) {
    let errText = "";
    try {
      errText = await res.text();
    } catch {
      /* ignore */
    }
    const short = errText.replace(/\s+/g, " ").slice(0, 180);
    if (res.status === 401) {
      return {
        ok: false,
        httpStatus: 401,
        reason:
          "401: неверный или пустой API-ключ Yandex Cloud. В .env укажите YANDEX_CLOUD_API_KEY=AQVN... и перезапустите vite (или VITE_YANDEX_CLOUD_API_KEY).",
      };
    }
    if (res.status === 400 && /folder ID.*does not match/i.test(short)) {
      return {
        ok: false,
        httpStatus: 400,
        reason:
          "400: каталог (folder id) в запросе не совпадает с каталогом сервисного аккаунта ключа. В .env задайте VITE_YANDEX_FOLDER_ID=<id из консоли Yandex, тот же что у ключа> и перезапустите dev.",
      };
    }
    return {
      ok: false,
      httpStatus: res.status,
      reason: short ? `HTTP ${res.status}: ${short}` : `HTTP ${res.status}`,
    };
  }

  const data = (await res.json()) as {
    result?: {
      alternatives?: Array<{ message?: { text?: string } }>;
    };
    error?: { message?: string };
  };

  if (data.error?.message) {
    return { ok: false, reason: data.error.message };
  }

  const text = data.result?.alternatives?.[0]?.message?.text;
  if (typeof text !== "string" || !text.trim()) {
    return { ok: false, reason: "Пустой ответ от модели (YandexGPT)" };
  }
  return { ok: true, content: text };
}
