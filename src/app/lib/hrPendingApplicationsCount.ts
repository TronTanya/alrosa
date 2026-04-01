import { readHrDecisions } from "./hrApplicationStatusStorage";
import type { ApplicationsTableStatus as Status } from "./hrApplicationStatusTypes";
import { readStoredTrainingApplications } from "./trainingApplicationsStorage";

/** Статические заявки из ApplicationsTable (id → статус по умолчанию до решения HR). */
const STATIC_DEFAULT: { id: number; status: Status }[] = [
  { id: 1, status: "pending" },
  { id: 2, status: "approved" },
  { id: 3, status: "in-progress" },
  { id: 4, status: "pending" },
  { id: 5, status: "pending" },
  { id: 6, status: "rejected" },
  { id: 7, status: "approved" },
  { id: 8, status: "in-progress" },
  { id: 9, status: "pending" },
  { id: 10, status: "completed" },
];

/** Число заявок в статусе «ожидает» (согласование) — из localStorage и демо-таблицы. */
export function countHrPendingApplications(): number {
  const decisions = readHrDecisions();
  let n = 0;
  for (const s of readStoredTrainingApplications()) {
    const st = (decisions[s.hrRowId] ?? "pending") as Status;
    if (st === "pending") n++;
  }
  for (const row of STATIC_DEFAULT) {
    const st = (decisions[row.id] ?? row.status) as Status;
    if (st === "pending") n++;
  }
  return n;
}
