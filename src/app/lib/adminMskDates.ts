/** Даты и окна по часовому поясу Москвы — для админ-дашборда и страницы «Администрирование». */

export function moscowHour(d: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",
    hour: "numeric",
    hour12: false,
  }).formatToParts(d);
  return parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
}

/** Следующее ночное окно 02:00 (бэкап / обслуживание): «сегодня» или «завтра». */
export function nextNightlyWindowWord(now: Date): "сегодня" | "завтра" {
  return moscowHour(now) >= 2 ? "завтра" : "сегодня";
}

/** Подпись для резервного копирования на главной. */
export function nextBackupLabel(now: Date): string {
  const dayWord = nextNightlyWindowWord(now);
  return `02:00 · ${dayWord} ночью (МСК)`;
}

/** Текст окна обслуживания 02:00–02:30. */
export function maintenanceWindowLine(now: Date): string {
  const w = nextNightlyWindowWord(now);
  return `${w} 02:00–02:30 МСК`;
}

export function formatMskLine(d: Date): string {
  return d.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
    timeZoneName: "short",
  });
}

/** Демо: «дней до истечения SSL» (1–3), стабильно в течение суток. */
export function demoSslDaysLeft(now: Date): number {
  const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h + key.charCodeAt(i)) % 3;
  return 1 + h;
}
