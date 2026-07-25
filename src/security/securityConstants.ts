export const SecurityConstants = {
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 Minute Inactivity Guard
  MAX_LOGIN_ATTEMPTS: 5,
  APP_VERSION_REQUIREMENT: "1.7.0"
} as const;

export type SecurityEvent =
  | "AUTH_FAILED_LOGIN"
  | "AUTH_PASSWORD_ATTEMPTS_EXCEEDED"
  | "ROUTE_UNAUTHORIZED_ACCESS"
  | "FIRESTORE_PERMISSION_DENIED"
  | "ADMIN_ACTION_EXECUTE"
  | "TEACHER_VERIFICATION_APPROVE"
  | "TEACHER_VERIFICATION_REJECT"
  | "ACCOUNT_SUSPENDED_OR_BANNED";

export interface SecurityEventLog {
  id: string;
  userId: string;
  event: SecurityEvent;
  timestamp: number;
  platform: string;
  appVersion: string;
  metadata?: Record<string, any>;
}
