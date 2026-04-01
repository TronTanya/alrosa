/**
 * Данные пользователя API Яндекс ID (GET https://login.yandex.ru/info?format=json).
 * @see https://yandex.ru/dev/id/doc/ru/api-id/request/intro
 */

export type YandexIdUserInfo = {
  login?: string;
  id?: string;
  client_id?: string;
  psuid?: string;
  old_social_login?: string;
  default_email?: string;
  emails?: string[];
  first_name?: string;
  last_name?: string;
  display_name?: string;
  real_name?: string;
  sex?: string | null;
  birthday?: string | null;
  is_avatar_empty?: boolean;
  default_avatar_id?: string;
  default_phone?: { id?: number; number?: string };
};

const INFO_PATH = "https://login.yandex.ru/info?format=json";

/** Извлечь OAuth-токен из ответа handler() после YaAuthSuggest (implicit). */
export function extractYandexOAuthTokenFromSuggest(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === "string") {
    const t = data.trim();
    return t.length > 0 ? t : null;
  }
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["access_token", "oauth_token", "token"]) {
      const v = o[k];
      if (typeof v === "string" && v.length > 0) return v;
    }
  }
  return null;
}

function yandexIdInfoRequestUrl(): string {
  if (import.meta.env.DEV) return "/api/yandex/id/info";
  const custom = import.meta.env.VITE_YANDEX_ID_INFO_URL;
  if (typeof custom === "string" && custom.trim()) return custom.trim();
  return INFO_PATH;
}

/**
 * Запрос информации о пользователе: Authorization: OAuth &lt;token&gt;
 * Dev: прокси Vite `/api/yandex/id/info`. Prod: прямой `login.yandex.ru` (если CORS мешает — задайте `VITE_YANDEX_ID_INFO_URL` на свой прокси с тем же путём).
 */
export async function fetchYandexIdUserInfo(accessToken: string): Promise<YandexIdUserInfo> {
  const token = accessToken.trim();
  if (!token) throw new Error("Пустой OAuth-токен");

  const url = yandexIdInfoRequestUrl();
  const res = await fetch(url, {
    headers: { Authorization: `OAuth ${token}` },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text.slice(0, 280) || `login.yandex.ru/info: ${res.status}`);
  }
  try {
    return JSON.parse(text) as YandexIdUserInfo;
  } catch {
    throw new Error("Некорректный JSON от API Яндекс ID");
  }
}
