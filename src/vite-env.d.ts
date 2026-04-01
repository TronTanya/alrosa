/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** OAuth-клиент для Яндекс.Календаря (публичный), см. .env.example */
  readonly VITE_YANDEX_OAUTH_CLIENT_ID?: string;
}
