import { hrCourseCatalogRows, type HrCourseCatalogRow } from "./hrCourseCatalog";

export type AdminCourseVisibility = "published" | "draft" | "hidden";

export interface AdminCourseRow extends HrCourseCatalogRow {
  visibility: AdminCourseVisibility;
  /** Демо: количество активных записей на программу */
  enrollments: number;
}

function visibilityForIndex(i: number): AdminCourseVisibility {
  if (i % 11 === 0) return "hidden";
  if (i % 7 === 0) return "draft";
  return "published";
}

export function seedAdminCourses(): AdminCourseRow[] {
  return hrCourseCatalogRows.map((r, i) => ({
    ...r,
    visibility: visibilityForIndex(i),
    enrollments: 20 + ((i + 1) * 13) % 180,
  }));
}

export const ADMIN_COURSES_TOTAL = hrCourseCatalogRows.length;
