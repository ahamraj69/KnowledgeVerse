export interface AIContext {
  userId: string;
  currentCourseId?: string;
  currentLessonId?: string;
  subject?: string;
  teacherName?: string;
  progress?: number;
  completedLessons?: string[];
  bookmarks?: string[];
  recentCourses?: string[];
  chatHistory?: string[];
}
