import { ROUTE_PATHS } from "../routePaths";

/** Полный redirect_uri для Suggest (должен совпадать с полем Redirect URI приложения на oauth.yandex.ru). */
export function getYandexSuggestRedirectUri(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${ROUTE_PATHS.yandexOAuthToken}`;
}

/** Origin вспомогательной страницы (тот же origin, что у redirect_uri). */
export function getYandexSuggestTokenPageOrigin(): string {
  if (typeof window === "undefined") return "";
  return new URL(getYandexSuggestRedirectUri()).origin;
}
