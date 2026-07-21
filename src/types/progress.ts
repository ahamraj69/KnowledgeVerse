export interface UserProgress {
  userId: string;

  // Dashboard
  streak: number;
  completedCourses: number;
  totalLessons: number;

  // Current learning
  lastCourseId: string;
  currentLessonId: string;

  // Overall progress
  progress: number;
  completedLessons: string[];

  // User activity
  recentCourses: string[];
  bookmarks: string[];

  updatedAt: number;
}
