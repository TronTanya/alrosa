/**
 * Настройки уведомлений HR (страница /hr/settings) — localStorage, фильтр списка в шапке HR.
 */

export const HR_NOTIFICATION_PREFS_KEY = "alrosa_hr_notification_prefs_v1";
export const HR_NOTIFICATION_PREFS_CHANGED = "alrosa-hr-notification-prefs-changed";

export type HrNotificationPrefs = {
  newApplications: boolean;
  overdueApprovals: boolean;
  weeklyDigest: boolean;
};

const DEFAULTS: HrNotificationPrefs = {
  newApplications: true,
  overdueApprovals: true,
  weeklyDigest: false,
};

function dispatchChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(HR_NOTIFICATION_PREFS_CHANGED));
  }
}

export function loadHrNotificationPrefs(): HrNotificationPrefs {
  if (typeof localStorage === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(HR_NOTIFICATION_PREFS_KEY);
    if (!raw) return { ...DEFAULTS };
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object") return { ...DEFAULTS };
    const o = p as Record<string, unknown>;
    return {
      newApplications:
        typeof o.newApplications === "boolean" ? o.newApplications : DEFAULTS.newApplications,
      overdueApprovals:
        typeof o.overdueApprovals === "boolean" ? o.overdueApprovals : DEFAULTS.overdueApprovals,
      weeklyDigest: typeof o.weeklyDigest === "boolean" ? o.weeklyDigest : DEFAULTS.weeklyDigest,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveHrNotificationPrefs(next: HrNotificationPrefs): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(HR_NOTIFICATION_PREFS_KEY, JSON.stringify(next));
    dispatchChanged();
  } catch {
    /* quota */
  }
}
