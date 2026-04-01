import type { AdminNotificationRuleRow, AdminNotificationRuleStatus } from "../data/adminNotificationsCatalog";
import { adminNotificationRulesSeed } from "../data/adminNotificationsCatalog";

const STORAGE_KEY = "alrosa_admin_notification_rules_v1";

export const ADMIN_NOTIFICATION_RULES_UPDATED = "alrosa-admin-notification-rules-updated";

function dispatch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ADMIN_NOTIFICATION_RULES_UPDATED));
  }
}

export function loadAdminNotificationRules(): AdminNotificationRuleRow[] {
  if (typeof localStorage === "undefined") {
    return adminNotificationRulesSeed.map((r) => ({ ...r }));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return adminNotificationRulesSeed.map((r) => ({ ...r }));
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return adminNotificationRulesSeed.map((r) => ({ ...r }));
    const byId = new Map(adminNotificationRulesSeed.map((r) => [r.id, { ...r }]));
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Partial<AdminNotificationRuleRow>;
      if (typeof o.id !== "string" || !byId.has(o.id)) continue;
      const base = byId.get(o.id)!;
      if (o.status === "active" || o.status === "paused" || o.status === "off") {
        base.status = o.status;
      }
    }
    return Array.from(byId.values());
  } catch {
    return adminNotificationRulesSeed.map((r) => ({ ...r }));
  }
}

export function saveAdminNotificationRules(rows: AdminNotificationRuleRow[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    const minimal = rows.map((r) => ({ id: r.id, status: r.status }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
    dispatch();
  } catch {
    /* ignore */
  }
}

export function setAdminRuleStatus(id: string, status: AdminNotificationRuleStatus): void {
  const rows = loadAdminNotificationRules();
  const next = rows.map((r) => (r.id === id ? { ...r, status } : r));
  saveAdminNotificationRules(next);
}
