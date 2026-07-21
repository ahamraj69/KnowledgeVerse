export type ModerationAction = "warning" | "suspension" | "ban";

export interface ModerationRecord {
  id: string;
  userId: string;
  action: ModerationAction;
  reason: string;
  adminId: string;
  createdAt: number;
  expiresAt?: number;
}
