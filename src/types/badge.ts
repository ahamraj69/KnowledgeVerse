export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "lessons" | "ai" | "quizzes" | "streaks" | "courses" | "verification";
}
