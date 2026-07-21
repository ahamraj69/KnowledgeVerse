export const Collections = {
  USERS: "users",
  COURSES: "courses",
  LESSONS: "lessons",
  COURSE_PROGRESS: "courseProgress",
  LESSON_PROGRESS: "lessonProgress",
  BOOKMARKS: "bookmarks",
  AI_CHATS: "aiChats",
  AI_MESSAGES: "aiMessages",
  NOTIFICATIONS: "notifications",
  TEACHER_APPLICATIONS: "teacherApplications",
  TEACHER_PROFILES: "teacherProfiles",
} as const;

export type CollectionName = typeof Collections[keyof typeof Collections];
