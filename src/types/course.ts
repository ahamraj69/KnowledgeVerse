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
  // ✅ FIXED: Added properties directly to unify data models across all display layers
  duration: string;
  difficulty: string;
}
