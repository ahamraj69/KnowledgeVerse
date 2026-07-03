import { getUserAnalytics } from "./analyticsService";

export interface AISuggestion {
  type: "lesson" | "quiz" | "revision";
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

/**
 * 🧠 AI Learning Suggestions Engine
 */
export const getAISuggestions = async (
  userId: string
): Promise<AISuggestion[]> => {
  const analytics = await getUserAnalytics(userId);

  const suggestions: AISuggestion[] = [];

  // 📉 Weak performance detection
  if (analytics.averageScore < 50) {
    suggestions.push({
      type: "revision",
      title: "Revise previous lessons",
      reason:
        "Your average score is low. Revision recommended.",
      priority: "high",
    });
  }

  // 🧠 Moderate performance
  if (
    analytics.averageScore >= 50 &&
    analytics.averageScore < 80
  ) {
    suggestions.push({
      type: "quiz",
      title: "Take more practice quizzes",
      reason:
        "Improve accuracy with practice questions.",
      priority: "medium",
    });
  }

  // 🚀 Strong learner
  if (analytics.averageScore >= 80) {
    suggestions.push({
      type: "lesson",
      title: "Advance to next level lessons",
      reason:
        "You're performing well! Move ahead.",
      priority: "low",
    });
  }

  // 📚 Engagement boost
  if (analytics.totalAssignments < 3) {
    suggestions.push({
      type: "quiz",
      title: "Complete more assignments",
      reason:
        "Increase engagement with assignments.",
      priority: "medium",
    });
  }

  return suggestions;
};