export interface UserProfile {
  uid: string;
  displayName: string;
  // ✅ FIXED: Added name alias to satisfy home feed greeting selectors natively
  name?: string;
  email: string;
  // ✅ FIXED: Added role property string definition to allow role badge rendering
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
}
