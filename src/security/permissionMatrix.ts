import { UserRole } from "@/types/role";

export type PlatformCapability =
  | "COURSE_READ"
  | "COURSE_CREATE"
  | "COURSE_EDIT_OWN"
  | "COURSE_APPROVE"
  | "QUIZ_SUBMIT"
  | "USER_MANAGE"
  | "ANALYTICS_VIEW_GLOBAL"
  | "TEACHER_VERIFY_MANAGE";

const ROLE_PERMISSIONS_REGISTRY: Record<UserRole, PlatformCapability[]> = {
  student: [
    "COURSE_READ",
    "QUIZ_SUBMIT"
  ],
  teacher: [
    "COURSE_READ",
    "COURSE_CREATE",
    "COURSE_EDIT_OWN",
    "QUIZ_SUBMIT"
  ],
  admin: [
    "COURSE_READ",
    "COURSE_CREATE",
    "COURSE_EDIT_OWN",
    "COURSE_APPROVE",
    "QUIZ_SUBMIT",
    "USER_MANAGE",
    "ANALYTICS_VIEW_GLOBAL",
    "TEACHER_VERIFY_MANAGE"
  ]
};

/**
 * Evaluates whether an explicitly assigned active user role contains specific execution clearances [INDEX].
 */
export function hasCapabilityPermission(role: UserRole, capability: PlatformCapability): boolean {
  const authorizedCapabilities = ROLE_PERMISSIONS_REGISTRY[role];
  if (!authorizedCapabilities) return false;
  return authorizedCapabilities.includes(capability);
}
