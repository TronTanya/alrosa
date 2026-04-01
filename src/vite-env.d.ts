/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MSAL_CLIENT_ID?: string;
  readonly VITE_MSAL_AUTHORITY?: string;
  readonly VITE_MSAL_REDIRECT_URI?: string;
  /** Подсказка UPN для ssoSilent (корпоративный tenant). */
  readonly VITE_MSAL_LOGIN_HINT?: string;
  /** false / 0 — отключить авто-редирект на вход Microsoft на странице календаря (по умолчанию включено). */
  readonly VITE_MSAL_AUTO_LOGIN?: string;
  readonly VITE_OUTLOOK_CALENDAR_URL?: string;
  readonly VITE_DEEPSEEK_API_KEY?: string;
  /** Базовый URL FastAPI с Nylas; пусто — тот же origin (прокси Vite /nylas) */
  readonly VITE_NYLAS_API_BASE?: string;
}
