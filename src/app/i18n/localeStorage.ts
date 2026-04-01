export type AppLocale = "ru" | "en";

const STORAGE_KEY = "alrosa_locale_v1";

export function readStoredLocale(): AppLocale {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === "en" || s === "ru") return s;
  } catch {
    /* ignore */
  }
  return "ru";
}

export function writeStoredLocale(locale: AppLocale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}
