/**
 * Состояние «прочитано» для уведомлений в шапке — localStorage, переживает перезагрузку.
 */

export const SITE_NOTIF_READS_ADMIN = "alrosa_site_notif_reads_admin_v1";
export const SITE_NOTIF_READS_HR = "alrosa_site_notif_reads_hr_v1";
export const SITE_NOTIF_READS_MANAGER = "alrosa_site_notif_reads_manager_v1";
export const SITE_NOTIF_READS_EMPLOYEE = "alrosa_site_notif_reads_employee_v1";

export const SITE_NOTIFICATIONS_CHANGED = "alrosa-site-notifications-changed";

function dispatchChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SITE_NOTIFICATIONS_CHANGED));
  }
}

export function loadNotificationReads(storageKey: string): Record<string, boolean> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object") return {};
    const out: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
      if (typeof v === "boolean") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveNotificationReads(storageKey: string, reads: Record<string, boolean>): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(reads));
    dispatchChanged();
  } catch {
    /* ignore quota */
  }
}

export function hydrateNotificationReads<T extends { id: string; read: boolean }>(
  items: T[],
  reads: Record<string, boolean>,
): T[] {
  return items.map((item) => ({
    ...item,
    read: reads[item.id] !== undefined ? reads[item.id] : item.read,
  }));
}

export function setOneRead(storageKey: string, id: string, read: boolean): void {
  const prev = loadNotificationReads(storageKey);
  prev[id] = read;
  saveNotificationReads(storageKey, prev);
}

export function setAllRead(storageKey: string, ids: string[]): void {
  const prev = loadNotificationReads(storageKey);
  for (const id of ids) prev[id] = true;
  saveNotificationReads(storageKey, prev);
}

/** HR: число заявок «на согласовании» в момент «прочитано» — любое другое ненулевое значение снова непрочитано. */
const HR_PENDING_ACK_KEY = "alrosa_hr_topbar_pending_ack_v1";

export function getHrPendingNotifAckedCount(): number | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(HR_PENDING_ACK_KEY);
    if (raw == null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function setHrPendingNotifAckedCount(n: number): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(HR_PENDING_ACK_KEY, String(n));
    dispatchChanged();
  } catch {
    /* ignore */
  }
}

export function isHrPendingNotifUnread(currentPending: number): boolean {
  if (currentPending === 0) return false;
  const ack = getHrPendingNotifAckedCount();
  if (ack === null) return true;
  return currentPending !== ack;
}

/** Сотрудник: id последней просмотренной заявки из портала — новая заявка снова помечает уведомление. */
const EMPLOYEE_APP_NOTIF_ACK_KEY = "alrosa_employee_topbar_last_app_ack_v1";

export function getEmployeeLastAckAppId(): string | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(EMPLOYEE_APP_NOTIF_ACK_KEY);
    if (raw == null || raw === "") return null;
    return raw;
  } catch {
    return null;
  }
}

export function setEmployeeLastAckAppId(id: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(EMPLOYEE_APP_NOTIF_ACK_KEY, id);
    dispatchChanged();
  } catch {
    /* ignore */
  }
}
