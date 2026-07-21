export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: "video" | "pdf" | "text" | "quiz" | "assignment";
  content: string;
  duration: string;
  order: number;
  createdAt: number;
}
