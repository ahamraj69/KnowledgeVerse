export type ReportType = "course" | "lesson" | "teacher" | "comment" | "discussion";

export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: ReportType;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: number;
  resolvedAt?: number;
  resolvedBy?: string;
}
