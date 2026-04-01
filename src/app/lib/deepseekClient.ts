/**
 * Общий вызов DeepSeek Chat Completions (прокси /deepseek-api или VITE_DEEPSEEK_API_KEY).
 */

export type DeepseekChatOutcome =
  | { ok: true; content: string }
  | { ok: false; reason: string; httpStatus?: number };

export async function deepseekChat(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    signal?: AbortSignal;
    /** DeepSeek / OpenAI-совместимый режим строгого JSON */
    response_format?: { type: "json_object" };
  }
): Promise<DeepseekChatOutcome> {
  const clientKey = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined;
  const url = clientKey
    ? "https://api.deepseek.com/v1/chat/completions"
    : "/deepseek-api/v1/chat/completions";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (clientKey) headers.Authorization = `Bearer ${clientKey}`;

  const body: Record<string, unknown> = {
    model: options?.model ?? "deepseek-chat",
    messages,
    temperature: options?.temperature ?? 0.2,
    max_tokens: options?.max_tokens ?? 1024,
  };
  if (options?.response_format) body.response_format = options.response_format;

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
          ? "Сеть: проверьте интернет. Для dev нужен запущенный npm run dev и прокси /deepseek-api."
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
          "401: неверный или пустой API-ключ. В .env укажите DEEPSEEK_API_KEY=sk-... и перезапустите vite (или VITE_DEEPSEEK_API_KEY).",
      };
    }
    return {
      ok: false,
      httpStatus: res.status,
      reason: short ? `HTTP ${res.status}: ${short}` : `HTTP ${res.status}`,
    };
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    return { ok: false, reason: "Пустой ответ от DeepSeek" };
  }
  return { ok: true, content };
}
