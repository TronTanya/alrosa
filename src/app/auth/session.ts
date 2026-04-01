/** Ключ сессии демо-портала (в проде заменить на ответ SSO / refresh token). */
const SESSION_KEY = "lk_curator_portal_session";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function login(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
