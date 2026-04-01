import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { AlrosaLogo, BrandLine } from "../components/AlrosaBrand";
import { login, isAuthed } from "../auth/session";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

  useEffect(() => {
    if (isAuthed()) {
      navigate(from, { replace: true });
    }
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
        <p className="login-alrosa-hint">Демо-режим: вход без пароля. В продакшене здесь будет корпоративный SSO.</p>
      </motion.div>
    </div>
  );
}
