/** Глобалы скриптов passport-sdk (sdk-suggest / sdk-suggest-token) */

export interface YaAuthSuggestInitResult {
  status: "ok" | "error";
  handler?: () => Promise<unknown>;
  code?: string;
}

export interface YaAuthSuggestAPI {
  init(
    oauthQueryParams: {
      client_id: string;
      response_type: string;
      redirect_uri: string;
    },
    tokenPageOrigin: string,
    suggestParams?: Record<string, unknown>,
  ): Promise<YaAuthSuggestInitResult>;
}

declare global {
  interface Window {
    YaAuthSuggest?: YaAuthSuggestAPI;
    /** Передаёт токен на страницу входа через postMessage; вызывать на вспомогательной странице. */
    YaSendSuggestToken?: (origin: string, extraData?: Record<string, unknown>) => void;
  }
}

export {};
