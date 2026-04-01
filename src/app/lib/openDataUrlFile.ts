/**
 * Скачивание файла из data: URL через blob: — надёжнее длинных data-строк в атрибуте href.
 */
const REVOKE_MS = 30_000;

export function downloadDataUrlFile(dataUrl: string, fileName: string, mimeType: string): void {
  (async () => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const typed = blob.type ? blob : new Blob([await blob.arrayBuffer()], { type: mimeType || "application/octet-stream" });
      const url = URL.createObjectURL(typed);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_MS);
    } catch {
      window.alert("Не удалось скачать файл.");
    }
  })();
}
