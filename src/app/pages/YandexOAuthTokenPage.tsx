import React, { useEffect } from "react";

/**
 * Вспомогательная страница для передачи токена OAuth обратно на страницу входа (postMessage).
 * В кабинете Яндекс ID укажите Redirect URI: {origin}/yandex-oauth-token
 * @see https://yandex.ru/dev/id/doc/ru/suggest/script-sdk-suggest-token
 */
export function YandexOAuthTokenPage() {
  useEffect(() => {
    if (typeof window.YaSendSuggestToken === "function") {
      window.YaSendSuggestToken(window.location.origin, {});
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "14px",
        color: "#000000",
        background: "#f5f5f7",
      }}
    >
      <p style={{ margin: 0 }}>Завершение входа через Яндекс…</p>
    </div>
  );
}
