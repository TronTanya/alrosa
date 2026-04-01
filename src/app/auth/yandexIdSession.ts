import type { YandexIdUserInfo } from "../lib/yandexIdUserInfo";

const STORAGE_KEY = "lk_yandex_id_user_json";

export function saveYandexIdUserInfo(info: YandexIdUserInfo): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    /* ignore */
  }
}

export function readYandexIdUserInfo(): YandexIdUserInfo | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as unknown;
    return j && typeof j === "object" ? (j as YandexIdUserInfo) : null;
  } catch {
    return null;
  }
}

export function clearYandexIdUserInfo(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Подпись для шапки ЛК, если есть данные после входа через Яндекс Suggest. */
export function getYandexProfileForTopbar(): { name: string; title: string; initials: string } | null {
  const info = readYandexIdUserInfo();
  if (!info) return null;
  const name =
    info.real_name?.trim() ||
    [info.first_name, info.last_name].filter(Boolean).join(" ").trim() ||
    info.display_name?.trim() ||
    info.login ||
    "Пользователь";
  const title =
    info.default_email ||
    (info.emails && info.emails[0]) ||
    (info.login ? `@${info.login}` : "Яндекс ID");
  const parts = name.split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2
      ? (parts[0]![0]! + parts[1]![0]!).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  return { name, title, initials };
}
