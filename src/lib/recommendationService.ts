import { UserProgress } from "@/types/progress";

export interface PersonalizedRecommendation {
  reason: string;
  suggestedActionLabel: string;
  targetPath: string;
  type: "quiz" | "revision" | "lesson";
}

/**
 * ✅ Module 4 FIXED: Dynamically generates personalized review tasks by evaluating performance parameters.
 */
export function generatePersonalizedRecommendations(progress: UserProgress | null): PersonalizedRecommendation[] {
  const items: PersonalizedRecommendation[] = [];
  
  if (!progress) {
    items.push({
      reason: "Welcome to KnowledgeVerse! Let's build your study baseline.",
      suggestedActionLabel: "Start Basic AI Lesson Node",
      targetPath: "/explore",
      type: "lesson"
    });
    return items;
  }

  if (progress.streak < 3) {
    items.push({
      reason: "Your learning streak is low. Establish a consistent daily habit!",
      suggestedActionLabel: "Complete 15-Min Quick Quiz",
      targetPath: "/ai",
      type: "quiz"
    });
  }

  if (progress.completedLessons.length > 0) {
    items.push({
      reason: "Reinforce topics from your recent learning timeline.",
      suggestedActionLabel: "Review Last Minute Revision Flashcards",
      targetPath: "/ai",
      type: "revision"
    });
  }

  return items;
}
