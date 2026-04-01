import { HR_EMPLOYEES_TOTAL, hrEmployeesDirectory } from "../data/hrEmployeesDirectory";
import { MANAGER_TEAM_MEMBERS } from "../data/managerTeamCatalog";
import { readStoredTrainingApplications } from "./trainingApplicationsStorage";

/** Агрегаты по справочнику HR (актуальные данные демо). */
export function buildHrOrgSnapshotJson(): string {
  const emps = hrEmployeesDirectory;
  let inLearning = 0;
  let inPlan = 0;
  let notInPlan = 0;
  let planSum = 0;
  let planN = 0;
  for (const e of emps) {
    if (e.learningStatus === "В обучении") inLearning += 1;
    else if (e.learningStatus === "В плане") inPlan += 1;
    else notInPlan += 1;
    if (e.planPct != null) {
      planSum += e.planPct;
      planN += 1;
    }
  }
  const avgPlanPct = planN > 0 ? Math.round(planSum / planN) : null;
  const apps = typeof window !== "undefined" ? readStoredTrainingApplications() : [];
  const trainingApplicationsPending = apps.length;

  return JSON.stringify(
    {
      as_of: new Date().toISOString().slice(0, 10),
      scope: "company_hr_ld",
      total_employees: HR_EMPLOYEES_TOTAL,
      learning_status_counts: {
        in_learning: inLearning,
        in_plan: inPlan,
        not_in_plan: notInPlan,
      },
      avg_plan_completion_pct: avgPlanPct,
      training_applications_pending: trainingApplicationsPending,
    },
    null,
    0
  );
}

/** Команда руководителя — те же записи, что в таблице и достижениях. */
export function buildManagerTeamSnapshotJson(): string {
  return JSON.stringify(
    {
      as_of: new Date().toISOString().slice(0, 10),
      scope: "manager_direct_reports",
      team_size: MANAGER_TEAM_MEMBERS.length,
      members: MANAGER_TEAM_MEMBERS.map((m) => ({
        shortName: m.shortName,
        fullName: m.fullName,
        dept: m.dept,
        role: m.role,
        progress: m.progress,
        recUrgency: m.recUrgency,
        courseStatus: m.courseStatus,
        aiRec: m.aiRec,
        activeCourse: m.activeCourse,
        courseProgress: m.courseProgress,
        courseDeadline: m.courseDeadline,
      })),
    },
    null,
    0
  );
}
