export interface TeacherProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  verified: boolean;
  subjects: string[];
  experience: number;
  country?: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  students: number;
  courses: number;
  lessons: number;
  joinedAt: number;
  updatedAt: number;
}
