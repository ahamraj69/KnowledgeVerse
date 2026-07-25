import { UserRole } from "@/types/role";

/**
 * Reusable permission logic checking role-gated access tiers before mounting screens [INDEX].
 */
export function verifyRolePermission(currentRole: UserRole, requiredRoles: UserRole[]): boolean {
  if (currentRole === "admin") return true; // Global admin bypasses role blocks safely
  return requiredRoles.includes(currentRole);
}
