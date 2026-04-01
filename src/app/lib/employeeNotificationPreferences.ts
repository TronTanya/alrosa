/**
 * Настройки уведомлений сотрудника (страница /settings) — localStorage, влияют на список в колокольчике.
 */

export const EMPLOYEE_NOTIFICATION_PREFS_KEY = "alrosa_employee_notification_prefs_v1";
export const EMPLOYEE_NOTIFICATION_PREFS_CHANGED = "alrosa-employee-notification-prefs-changed";

export type EmployeeNotificationPrefs = {
  /** Напоминания о курсах и дедлайнах (колокольчик) */
  courses: boolean;
  /** События ИПР и согласований */
  ipr: boolean;
  /** Дублировать на почту (дайджест) — флаг для будущей интеграции */
  emailDigest: boolean;
};

const DEFAULTS: EmployeeNotificationPrefs = {
  courses: true,
  ipr: true,
  emailDigest: false,
};

function dispatchChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EMPLOYEE_NOTIFICATION_PREFS_CHANGED));
  }
}

export function loadEmployeeNotificationPrefs(): EmployeeNotificationPrefs {
  if (typeof localStorage === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(EMPLOYEE_NOTIFICATION_PREFS_KEY);
    if (!raw) return { ...DEFAULTS };
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object") return { ...DEFAULTS };
    const o = p as Record<string, unknown>;
    return {
      courses: typeof o.courses === "boolean" ? o.courses : DEFAULTS.courses,
      ipr: typeof o.ipr === "boolean" ? o.ipr : DEFAULTS.ipr,
      emailDigest: typeof o.emailDigest === "boolean" ? o.emailDigest : DEFAULTS.emailDigest,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveEmployeeNotificationPrefs(next: EmployeeNotificationPrefs): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(EMPLOYEE_NOTIFICATION_PREFS_KEY, JSON.stringify(next));
    dispatchChanged();
  } catch {
    /* quota */
  }
}
