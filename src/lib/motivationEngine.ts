interface BehavioralMetricsInput {
  streak: number;
  aiQuestionsCount: number;
  completedCoursesCount: number;
  totalLessonsCompleted: number;
}

/**
 * Evaluates usage markers to return a tailored motivation string [INDEX].
 */
export function processPersonalizedMotivationMessage(metrics: BehavioralMetricsInput): string {
  if (metrics.streak >= 14) {
    return "You're on fire! Protect your streak commitment today to reach your next milestone badge.";
  }
  
  if (metrics.aiQuestionsCount > 15) {
    return "Great curiosity leads to deep engineering mastery. Keep challenging your AI Tutor with technical queries.";
  }
  
  if (metrics.completedCoursesCount > 0 && metrics.totalLessonsCompleted % 5 === 0) {
    return "Ready for your next big challenge? Explore new curriculum categories today.";
  }
  
  if (metrics.totalLessonsCompleted === 0) {
    return "Start small today. Reviewing just one lesson video builds consistency.";
  }
  
  return "Focus your mind, eliminate notification triggers, and take a quick quiz to verify your progress.";
}
