import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

/** Lucide-иконка со всеми SVG-пропсами (color, strokeWidth, style и т.д.) */
export type BrandLucideIcon = ComponentType<LucideProps>;

/**
 * Фирменный стиль иконок (линейная графика, как у графического элемента фирменного блока):
 * — контур преимущественно чёрный;
 * — акценты — фирменные красный и циан;
 * — минимальный зазор между штрихами в знаке ≈ толщине линии → в UI держим единый `sw` / `swSm` / `swLg`.
 *
 * Набор Lucide отображается в stroke-only; для заливок (`fill`) использовать осознанно (рейтинг и т.п.).
 */

export const brandIcon = {
  stroke: "#000000",
  accentRed: "#e3000b",
  accentCyan: "#81d0f5",
  muted: "rgba(0,0,0,0.55)",
  /** Базовая толщина (≈ зазор внутри знака) */
  sw: 1.75 as const,
  swSm: 1.5 as const,
  swLg: 2 as const,
} as const;

export type BrandIconColor = (typeof brandIcon)[keyof Pick<
  typeof brandIcon,
  "stroke" | "accentRed" | "accentCyan" | "muted"
>];
