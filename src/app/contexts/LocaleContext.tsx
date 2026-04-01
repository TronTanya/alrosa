import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AppLocale } from "../i18n/localeStorage";
import { readStoredLocale, writeStoredLocale } from "../i18n/localeStorage";
import { translate } from "../i18n/strings";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() =>
    typeof window !== "undefined" ? readStoredLocale() : "ru",
  );

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "ru";
  }, [locale]);

  const setLocale = useCallback((l: AppLocale) => {
    writeStoredLocale(l);
    setLocaleState(l);
  }, []);

  const t = useCallback((key: string) => translate(key, locale), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

/** Для редких случаев без жёсткого требования провайдера (возвращает ru и no-op). */
export function useLocaleOptional(): LocaleContextValue | null {
  return useContext(LocaleContext);
}
