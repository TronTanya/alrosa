/**
 * Заменяет цвет текста с брендового циана на чёрный/тёмно-серый.
 * Не трогает stopColor, stroke (кроме явно текстовых), fill графиков в отдельных паттернах.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..", "src");

function fixContent(s, ext) {
  let out = s;

  // color: "#81d0f5" или '#81d0f5'
  out = out.replace(/(\bcolor:\s*)["']#81d0f5["']/g, '$1"#000000"');

  // color: rgba(129,208,245,...) с разными форматами
  out = out.replace(
    /(\bcolor:\s*["'])rgba\(129,\s*208,\s*245,\s*([\d.]+)\)(["'])/g,
    (_, pre, alpha, q) => {
      const a = parseFloat(alpha);
      if (Number.isNaN(a)) return _;
      // чуть плотнее для читаемости на белом
      const na = Math.min(0.94, a < 0.15 ? 0.38 : a < 0.3 ? 0.48 : a < 0.45 ? 0.58 : a < 0.6 ? 0.68 : a < 0.8 ? 0.82 : 0.92);
      return `${pre}rgba(0,0,0,${na})${q}`;
    }
  );

  // color: rgba(129,208,245,.65) без пробелов после запятой
  out = out.replace(
    /(\bcolor:\s*["'])rgba\(129,208,245,([\d.]+)\)(["'])/g,
    (_, pre, alpha, q) => {
      const a = parseFloat(alpha);
      if (Number.isNaN(a)) return _;
      const na = Math.min(0.94, a < 0.15 ? 0.38 : a < 0.3 ? 0.48 : a < 0.45 ? 0.58 : a < 0.6 ? 0.68 : a < 0.8 ? 0.82 : 0.92);
      return `${pre}rgba(0,0,0,${na})${q}`;
    }
  );

  // ?? "#81d0f5" как fallback цвета текста
  out = out.replace(/\?\?\s*["']#81d0f5["']/g, '?? "#000000"');

  // CSS: color: #81d0f5;
  out = out.replace(/(\bcolor:\s*)#81d0f5\b/g, "$1#000000");

  // CSS: color: rgba(129, 208, 245, ...);
  out = out.replace(
    /(\bcolor:\s*)rgba\(129,\s*208,\s*245,\s*([\d.]+)\)/g,
    (_, pre, alpha) => {
      const a = parseFloat(alpha);
      const na = Math.min(0.94, a < 0.15 ? 0.38 : a < 0.3 ? 0.48 : a < 0.45 ? 0.58 : a < 0.6 ? 0.68 : a < 0.8 ? 0.82 : 0.92);
      return `${pre}rgba(0, 0, 0, ${na})`;
    }
  );

  // var(--al-cyan) как color текста → чёрный (в CSS)
  if (ext === ".css") {
    out = out.replace(/(\bcolor:\s*)var\(--al-cyan\)/g, "$1#000000");
  }

  return out;
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts|css)$/.test(name) && !name.endsWith(".d.ts")) acc.push(p);
  }
  return acc;
}

for (const file of walk(ROOT)) {
  const raw = fs.readFileSync(file, "utf8");
  const next = fixContent(raw, path.extname(file));
  if (next !== raw) {
    fs.writeFileSync(file, next);
    console.log("updated", path.relative(ROOT, file));
  }
}
