interface UserPerformanceMetrics {
  streakCount: number;
  coursesCompleted: number;
  recentQuizScore: number;
  aiChatsCount: number;
}

/**
 * Evaluates live session attributes to generate personalized motivation indicators [INDEX].
 */
export function generateAIMotivationMessage(metrics: UserPerformanceMetrics): string {
  if (metrics.streakCount >= 30) {
    return "Your consistency is becoming your greatest strength. Protect the 30+ day milestone threshold today!";
  }
  if (metrics.recentQuizScore > 0 && metrics.recentQuizScore < 60) {
    return "Mistakes are proof that real learning is happening. Take another concept query pass with your AI Tutor.";
  }
  if (metrics.coursesCompleted > 0 && metrics.aiChatsCount > 20) {
    return "Congratulations on expanding your syllabus metrics! You are ready for a completely new academic track challenge.";
  }
  if (metrics.streakCount === 0) {
    return "Every expert began with a single simple lesson. Initialize your learning path loop today.";
  }

  return "Focus your mind, clear external notification signals, and lock into an active concept block.";
}
