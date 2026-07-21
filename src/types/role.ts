export type UserRole = "student" | "teacher" | "admin";

export interface UserRoleData {
  uid: string;
  role: UserRole;
  verifiedTeacher: boolean;
  createdAt: number;
  updatedAt: number;
}
