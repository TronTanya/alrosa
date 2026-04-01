import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { AlrosaLogo, BrandLine } from "../components/AlrosaBrand";
import { login, isAuthed } from "../auth/session";
import { saveYandexIdUserInfo } from "../auth/yandexIdSession";
import { extractYandexOAuthTokenFromSuggest, fetchYandexIdUserInfo } from "../lib/yandexIdUserInfo";
import { getYandexSuggestRedirectUri, getYandexSuggestTokenPageOrigin } from "../lib/yandexPassportSuggest";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
  const yandexSuggestInitDone = useRef(false);

  useEffect(() => {
    if (isAuthed()) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  /** Мгновенный вход Яндекс ID (Suggest): https://yandex.ru/dev/id/doc/ru/suggest/script-sdk-suggest */
  useEffect(() => {
    const clientId = typeof import.meta.env.VITE_YANDEX_OAUTH_CLIENT_ID === "string" ? import.meta.env.VITE_YANDEX_OAUTH_CLIENT_ID.trim() : "";
    if (!clientId || yandexSuggestInitDone.current) return;
    const { YaAuthSuggest } = window;
    if (!YaAuthSuggest?.init) return;
    yandexSuggestInitDone.current = true;

    const redirectUri = getYandexSuggestRedirectUri();
    const tokenPageOrigin = getYandexSuggestTokenPageOrigin();

    YaAuthSuggest.init(
      {
        client_id: clientId,
        response_type: "token",
        redirect_uri: redirectUri,
      },
      tokenPageOrigin,
    )
      .then((result) => {
        if (result.status !== "ok" || !result.handler) {
          return Promise.reject(new Error(result.code ?? "YaAuthSuggest"));
        }
        return result.handler();
      })
      .then((data: unknown) => {
        const token = extractYandexOAuthTokenFromSuggest(data);
        if (!token) {
          login();
          navigate(from, { replace: true });
          return;
        }
        return fetchYandexIdUserInfo(token)
          .then((info) => {
            saveYandexIdUserInfo(info);
            login();
            navigate(from, { replace: true });
          })
          .catch((e: unknown) => {
            console.warn("[Yandex ID info]", e);
            login();
            navigate(from, { replace: true });
          });
      })
      .catch((err: unknown) => {
        console.warn("[Yandex Suggest]", err);
        yandexSuggestInitDone.current = false;
      });
  }, [navigate, from]);

  return (
    <div className="login-alrosa">
      <div className="landing-alrosa__network" aria-hidden />
      <motion.div
        className="login-alrosa-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <AlrosaLogo />
        </div>
        <BrandLine wide />
        <h1 className="login-alrosa-title">Алроса ИТ</h1>
        <p className="login-alrosa-lead login-alrosa-lead--accent">Единая среда обучения · ИИ-Куратор</p>
        <button
          type="button"
          className="login-alrosa-btn"
          onClick={() => {
            login();
            navigate(from, { replace: true });
          }}
        >
          Войти в портал
        </button>
        <p className="login-alrosa-hint">
          Демо-режим: вход без пароля. При настроенном{" "}
          <code style={{ fontSize: "11px" }}>VITE_YANDEX_OAUTH_CLIENT_ID</code> доступен мгновенный вход Яндекс (Suggest);
          в кабинете OAuth укажите Redirect URI: <code style={{ fontSize: "10px" }}>{typeof window !== "undefined" ? `${window.location.origin}/yandex-oauth-token` : "/yandex-oauth-token"}</code>
        </p>
      </motion.div>
    </div>
  );
}
