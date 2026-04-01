import React from "react";

const LOCKUP_SRC = "/branding/alrosa-it-lockup.png";

type LogoProps = {
  className?: string;
  /** По умолчанию wordmark («АЛРОСА» — «ИТ»); lockup — знак + «Алроса ИТ» (PNG) */
  variant?: "lockup" | "wordmark";
};

/** Векторный wordmark: АЛРОСА · красная линия с пустыми кругами · ИТ (брендбук ALROSA IT). */
export function AlrosaWordmark({ className }: { className?: string }) {
  return (
    <div
      className={className ? `alrosa-wordmark ${className}` : "alrosa-wordmark"}
      role="img"
      aria-label="АЛРОСА ИТ"
    >
      <span className="alrosa-wordmark__alrosa">АЛРОСА</span>
      <span className="alrosa-wordmark__connector" aria-hidden>
        <svg className="alrosa-wordmark__ring-svg" viewBox="0 0 10 10" aria-hidden>
          <circle
            cx="5"
            cy="5"
            r="3.35"
            fill="var(--alrosa-wordmark-hole, #ffffff)"
            stroke="#e3000b"
            strokeWidth="1.1"
          />
        </svg>
        <span className="alrosa-wordmark__rule" />
        <svg className="alrosa-wordmark__ring-svg" viewBox="0 0 10 10" aria-hidden>
          <circle
            cx="5"
            cy="5"
            r="3.35"
            fill="var(--alrosa-wordmark-hole, #ffffff)"
            stroke="#e3000b"
            strokeWidth="1.1"
          />
        </svg>
      </span>
      <span className="alrosa-wordmark__it">ИТ</span>
    </div>
  );
}

/** Wordmark — вектор; lockup — PNG из `public/branding/` */
export function AlrosaLogo({ className, variant = "wordmark" }: LogoProps) {
  const wrap = className ? `alrosa-logo-wrap ${className}` : "alrosa-logo-wrap";
  if (variant === "wordmark") {
    return (
      <div className={wrap}>
        <AlrosaWordmark />
      </div>
    );
  }
  return (
    <div className={wrap}>
      <img
        src={LOCKUP_SRC}
        alt="АЛРОСА ИТ"
        className="alrosa-logo-img alrosa-logo-img--lockup"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}

type BrandLineProps = {
  variant?: "red" | "cyan";
  wide?: boolean;
  medium?: boolean;
  short?: boolean;
  className?: string;
};

export function BrandLine({ variant = "red", wide, medium, short, className }: BrandLineProps) {
  const mod = short ? "brand-line--short" : medium ? "brand-line--medium" : wide ? "brand-line--wide" : "";
  return (
    <div
      className={`brand-line ${mod} ${variant === "cyan" ? "brand-line--cyan" : ""} ${className ?? ""}`.trim()}
      aria-hidden
    >
      <span className="brand-line__dot" />
      <span className="brand-line__bar" />
      <span className="brand-line__dot" />
    </div>
  );
}
