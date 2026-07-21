export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_more_info";

export interface VerificationRequest {
  id: string;
  teacherId: string;
  fullName: string;
  phone: string;
  country: string;
  experience: number;
  bio: string;
  subjects: string[];
  profilePhotoURL: string;
  idDocumentURL: string;
  certificateURL?: string;
  status: VerificationStatus;
  adminComment?: string;
  submittedAt: number;
  updatedAt: number;
}
