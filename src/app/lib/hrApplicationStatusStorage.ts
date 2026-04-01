/**
 * Решения HR по заявкам (одобрить / отклонить) — демо в localStorage.
 * Ключ: числовой id строки в таблице (hrRowId для заявок из портала, 1–10 для статики).
 */

import type { ApplicationsTableStatus } from "./hrApplicationStatusTypes";

const STORAGE_KEY = "alrosa_hr_application_decisions_v1";

export type StoredHrDecisions = Record<number, ApplicationsTableStatus>;

export function readHrDecisions(): StoredHrDecisions {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: StoredHrDecisions = {};
    for (const [k, v] of Object.entries(parsed)) {
      const id = Number(k);
      if (!Number.isFinite(id)) continue;
      if (
        v === "pending" ||
        v === "approved" ||
        v === "rejected" ||
        v === "in-progress" ||
        v === "completed"
      ) {
        out[id] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function writeHrDecision(id: number, status: ApplicationsTableStatus): void {
  if (typeof localStorage === "undefined") return;
  const cur = readHrDecisions();
  cur[id] = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cur));
  window.dispatchEvent(new CustomEvent("alrosa-hr-decisions-updated"));
}

export const HR_DECISIONS_UPDATED = "alrosa-hr-decisions-updated";
