/** Экспорт таблиц HR: CSV (Excel) и печать / PDF через диалог браузера */

import { openPrintableReport } from "./pdfExport";

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
  const tbodyHtml = rows
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
    .join("");
  const bodyInner = `<h1>${escapeHtml(title)}</h1>
${subtitle ? `<p class="meta">${escapeHtml(subtitle)}</p>` : ""}
<table><thead><tr>${headHtml}</tr></thead><tbody>${tbodyHtml}</tbody></table>`;
  openPrintableReport(title, bodyInner);
}
