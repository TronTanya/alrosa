import {
  InteractionRequiredAuthError,
  PublicClientApplication,
  type AccountInfo,
} from "@azure/msal-browser";

/** Области для чтения профиля и основного календаря (Microsoft Graph). */
export const OUTLOOK_GRAPH_SCOPES = ["User.Read", "Calendars.Read"] as const;

/** После «Выйти» не запускать авто-вход до нового явного входа (sessionStorage). */
export const OUTLOOK_MSAL_SKIP_AUTO_KEY = "outlook-msal-skip-auto";

/** Один авто-редирект на вход (защита от двойного вызова в React Strict Mode). */
export const OUTLOOK_MSAL_AUTO_REDIRECT_LOCK_KEY = "outlook-msal-auto-redirect-lock";

function clientId(): string {
  const v = import.meta.env.VITE_MSAL_CLIENT_ID;
  return typeof v === "string" ? v.trim() : "";
}

export function isOutlookMsalConfigured(): boolean {
  return clientId().length > 0;
}

function redirectUri(): string {
  const v = import.meta.env.VITE_MSAL_REDIRECT_URI;
  if (typeof v === "string" && v.trim()) return v.trim();
  return `${window.location.origin}/`;
}

function authority(): string {
  const v = import.meta.env.VITE_MSAL_AUTHORITY;
  if (typeof v === "string" && v.trim()) return v.trim();
  return "https://login.microsoftonline.com/common";
}

let instance: PublicClientApplication | null = null;

export function getOutlookMsal(): PublicClientApplication {
  if (!isOutlookMsalConfigured()) {
    throw new Error("Задайте VITE_MSAL_CLIENT_ID для входа в Outlook.");
  }
  if (!instance) {
    instance = new PublicClientApplication({
      auth: {
        clientId: clientId(),
        authority: authority(),
        redirectUri: redirectUri(),
      },
      cache: { cacheLocation: "localStorage" },
    });
  }
  return instance;
}

export async function outlookMsalInitialize(): Promise<PublicClientApplication> {
  const app = getOutlookMsal();
  await app.initialize();
  return app;
}

function loginHintFromEnv(): string | undefined {
  const v = import.meta.env.VITE_MSAL_LOGIN_HINT;
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/**
 * `false` / `0` — только кнопка «Войти», без автоматического редиректа на Microsoft.
 * По умолчанию включено: на странице календаря без сессии откроется вход.
 */
export function isMsalAutoLoginEnabled(): boolean {
  const v = import.meta.env.VITE_MSAL_AUTO_LOGIN;
  if (v === "false" || v === "0") return false;
  return true;
}

/**
 * Учётная запись из кэша или тихий SSO (сессия Microsoft в этом браузере).
 * Без интерактивного окна; при необходимости подсказка почты из VITE_MSAL_LOGIN_HINT.
 */
export async function tryOutlookSilentSignIn(): Promise<AccountInfo | null> {
  if (!isOutlookMsalConfigured()) return null;
  const app = await outlookMsalInitialize();
  const cached = app.getActiveAccount() ?? app.getAllAccounts()[0] ?? null;
  if (cached) {
    app.setActiveAccount(cached);
    return cached;
  }
  const hint = loginHintFromEnv();
  try {
    const result = await app.ssoSilent({
      scopes: [...OUTLOOK_GRAPH_SCOPES],
      ...(hint ? { loginHint: hint } : {}),
    });
    if (result.account) {
      app.setActiveAccount(result.account);
      return result.account;
    }
  } catch {
    /* InteractionRequiredAuthError и др. — нужен интерактивный вход */
  }
  return null;
}

/**
 * Вход без popup: переход на login.microsoftonline.com и обратно.
 * Нужен для браузеров с блокировкой всплывающих окон (корпоративные политики).
 */
export async function outlookLoginRedirect(redirectStartPage?: string): Promise<void> {
  const app = await outlookMsalInitialize();
  const page = redirectStartPage ?? (window.location.pathname + window.location.search || "/");
  await app.loginRedirect({
    scopes: [...OUTLOOK_GRAPH_SCOPES],
    redirectStartPage: page,
  });
}

export async function outlookLogoutRedirect(account: AccountInfo): Promise<void> {
  const app = await outlookMsalInitialize();
  app.setActiveAccount(null);
  await app.logoutRedirect({ account });
}

export async function acquireOutlookGraphToken(account: AccountInfo): Promise<string> {
  const app = await outlookMsalInitialize();
  try {
    const silent = await app.acquireTokenSilent({ account, scopes: [...OUTLOOK_GRAPH_SCOPES] });
    return silent.accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      const page = `${window.location.pathname}${window.location.search}` || "/";
      await app.acquireTokenRedirect({
        account,
        scopes: [...OUTLOOK_GRAPH_SCOPES],
        redirectStartPage: page,
      });
      const redirecting = new Error("Перенаправление на вход Microsoft…");
      redirecting.name = "AuthRedirect";
      throw redirecting;
    }
    throw e;
  }
}

export function getStoredOutlookAccount(): AccountInfo | null {
  if (!isOutlookMsalConfigured()) return null;
  const app = getOutlookMsal();
  return app.getActiveAccount() ?? app.getAllAccounts()[0] ?? null;
}

export function setStoredOutlookActiveAccount(account: AccountInfo | null): void {
  if (!isOutlookMsalConfigured()) return;
  getOutlookMsal().setActiveAccount(account);
}
