/** Экспорт таблиц HR: CSV (Excel) и печать / PDF через диалог браузера */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** CSV с UTF-8 BOM — корректно открывается в Excel с кириллицей */
export function downloadCsv(filename: string, headers: string[], rows: string[][]): void {
  const sep = ";";
  const esc = (cell: string) => {
    if (/[;\n"]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
    return cell;
  };
  const lines = [headers.map(esc).join(sep), ...rows.map((r) => r.map(esc).join(sep))];
  const body = `\uFEFF${lines.join("\r\n")}`;
  downloadBlob(filename.endsWith(".csv") ? filename : `${filename}.csv`, new Blob([body], { type: "text/csv;charset=utf-8" }));
}

export function openPrintableDocument(options: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
}): void {
  const { title, subtitle, headers, rows } = options;
  const headHtml = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const bodyHtml = rows
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
    .join("");
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px; color: #111; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    .sub { font-size: 12px; color: #444; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
    th { background: #f3f4f6; font-weight: 700; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${subtitle ? `<p class="sub">${escapeHtml(subtitle)}</p>` : ""}
  <table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}
