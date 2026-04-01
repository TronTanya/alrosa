/** Небольшой тост для действий в админ-панели (демо). */

export function showAdminToast(message: string, ms = 2600): void {
  const el = document.createElement("div");
  el.textContent = message;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "80px",
    right: "24px",
    zIndex: "9999",
    background: "rgba(0,0,0,0.92)",
    border: "1px solid rgba(129,208,245,0.35)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "13px",
    fontFamily: "var(--font-sans)",
    fontWeight: "400",
    maxWidth: "380px",
    lineHeight: 1.45,
    boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
    transition: "opacity 0.25s ease",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 280);
  }, ms);
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
