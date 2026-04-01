/**
 * Как фронтенд достучится до Yandex Foundation Models (без секретов в бандле).
 */

export type YandexLlmTransport = "vite_proxy" | "browser_api_key";

export function getYandexLlmTransport(): YandexLlmTransport {
  const k = import.meta.env.VITE_YANDEX_CLOUD_API_KEY;
  return typeof k === "string" && k.trim() ? "browser_api_key" : "vite_proxy";
}

export function yandexFoundationModelsDocsUrl(): string {
  return "https://yandex.cloud/ru/docs/foundation-models/";
}
