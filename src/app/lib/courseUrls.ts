/**
 * Нормализация ссылок на курсы и безопасный fallback (поиск), если URL из ИИ некорректен.
 * Главные страницы (например https://www.edx.org/) часто отвечают ошибкой CDN в браузере —
 * для таких URL открываем DuckDuckGo-поиск по названию курса вместо прямого перехода.
 */

export function normalizeCourseUrl(raw: string | undefined | null): string | null {
  const u = (raw ?? "").trim();
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) {
    try {
      const parsed = new URL(u);
      if (!parsed.hostname) return null;
      if (parsed.hostname === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname)) {
        return parsed.href;
      }
      if (!parsed.hostname.includes(".")) return null;
      return parsed.href;
    } catch {
      return null;
    }
  }
  if (/^(www\.)?[a-z0-9][-a-z0-9.]*\.[a-z]{2,}(\/.*)?$/i.test(u)) {
    return `https://${u.replace(/^\/\//, "")}`;
  }
  return null;
}

/** Поиск курса по названию — стабильнее главных страниц edx/coursera. */
export function searchCoursePageUrl(title: string, provider: string): string {
  const q = `${title} ${provider}`.replace(/\s+/g, " ").trim();
  return `https://duckduckgo.com/?q=${encodeURIComponent(`${q} курс`)}`;
}

const LEARNING_HUB_HOSTS = new Set([
  "edx.org",
  "coursera.org",
  "udemy.com",
  "stepik.org",
  "skillbox.ru",
  "netology.ru",
  "geekbrains.ru",
  "hexlet.io",
  "practicum.yandex.ru",
]);

function isLearningPlatformHost(hostname: string): boolean {
  const h = hostname.replace(/^www\./, "").toLowerCase();
  if (LEARNING_HUB_HOSTS.has(h)) return true;
  return h.endsWith(".stepik.org") || h.endsWith(".coursera.org");
}

/** Один сегмент пути — часто «витрина», не конкретный курс. */
const HUB_PATH_SEGMENTS = new Set([
  "catalog",
  "browse",
  "courses",
  "search",
  "learn",
  "explore",
  "teach",
  "specializations",
  "professional-certificates",
  "certificates",
  "course",
]);

function isShallowPlatformUrl(href: string): boolean {
  try {
    const u = new URL(href);
    if (!isLearningPlatformHost(u.hostname)) return false;
    const path = (u.pathname.replace(/\/+$/, "") || "/").toLowerCase();
    if (path === "/") return true;
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 1 && HUB_PATH_SEGMENTS.has(segments[0])) return true;
    return false;
  } catch {
    return true;
  }
}

/**
 * Всегда возвращает рабочий https URL: конкретная страница курса или поиск по названию.
 */
export function coursePageHref(url: string | undefined | null, title: string, provider: string): string {
  const searchUrl = searchCoursePageUrl(title, provider);
  const n = normalizeCourseUrl(url);
  if (!n) return searchUrl;
  if (isShallowPlatformUrl(n)) return searchUrl;
  return n;
}
