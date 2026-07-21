export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  teacherId: string;
  teacherName: string;
  category: string;
  level: string;
  lessons: number;
  students: number;
  rating: number;
  createdAt: number;
  duration: string;
  difficulty: string;
  
  // ✅ Step 2 FIXED: Added workflow tracking metadata parameters
  status: "draft" | "pending" | "approved" | "rejected";
  submittedAt?: number;
  approvedAt?: number;
  reviewComment?: string;
  reviewedBy?: string;
}
