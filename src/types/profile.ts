export interface UserProfile {
  uid: string;
  displayName: string;
  name?: string;
  email: string;
  role: string;
  photoURL?: string;
  bio?: string;
  school?: string;
  grade?: string;
  country?: string;
  language?: string;
  interests: string[];
  learningGoal?: string;
  dailyGoalMinutes: number;
  streak: number;
  longestStreak: number;
  studyHours: number;
  completedCourses: number;
  completedLessons: number;
  quizAverage: number;
  aiChats: number;
  bookmarks: number;
  certificates: number;
  achievements: string[];
  createdAt: number;
  updatedAt: number;
  
  // ✅ FIXED: Declared verification properties directly on the shared model
  verifiedTeacher?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected" | "needs_more_info" | "unapplied";
  verifiedAt?: number;
}
