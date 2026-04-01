const STORAGE_KEY = "alrosa_user_certificates_v1";

export const USER_CERTIFICATES_UPDATED = "alrosa-user-certificates-updated";

export type StoredUserCertificate = {
  id: string;
  title: string;
  issuer: string;
  /** ISO date string */
  issuedAt: string;
  fileName: string;
  mimeType: string;
  /** data:application/pdf;base64,... */
  dataUrl: string;
};

const MAX_FILE_BYTES = 2_400_000;
const MAX_TOTAL_BYTES = 12_000_000;

function dispatch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(USER_CERTIFICATES_UPDATED));
  }
}

function totalStoredBytes(list: StoredUserCertificate[]): number {
  return list.reduce((n, c) => n + (c.dataUrl?.length ?? 0), 0);
}

export function readUserCertificates(): StoredUserCertificate[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (x): x is StoredUserCertificate =>
        x &&
        typeof x === "object" &&
        typeof (x as StoredUserCertificate).id === "string" &&
        typeof (x as StoredUserCertificate).dataUrl === "string" &&
        (x as StoredUserCertificate).dataUrl.startsWith("data:"),
    );
  } catch {
    return [];
  }
}

export function addUserCertificate(
  input: Omit<StoredUserCertificate, "id">,
): { ok: true; cert: StoredUserCertificate } | { ok: false; error: string } {
  const list = readUserCertificates();
  if (input.dataUrl.length > MAX_FILE_BYTES * 1.4) {
    return { ok: false, error: `Файл слишком большой (макс. ~${Math.round(MAX_FILE_BYTES / 1024 / 1024)} МБ).` };
  }
  if (totalStoredBytes(list) + input.dataUrl.length > MAX_TOTAL_BYTES * 1.4) {
    return { ok: false, error: "Превышен общий лимит хранилища сертификатов. Удалите часть файлов." };
  }
  const cert: StoredUserCertificate = {
    ...input,
    id: `uc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([cert, ...list]));
  dispatch();
  return { ok: true, cert };
}

export function removeUserCertificate(id: string): void {
  const list = readUserCertificates().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  dispatch();
}

export function formatCertDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}
