import { toast } from "sonner";

/** Тост для действий в админ-панели (через Sonner — единая очередь и стили). */

export function showAdminToast(message: string, ms = 2600): void {
  toast(message, { duration: ms });
}

export function downloadTextFile(filename: string, content: string, mime = "text/plain;charset=utf-8"): void {
  const blob = new Blob([`\uFEFF${content}`], { type: mime });
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
