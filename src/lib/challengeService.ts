export interface ActiveChallenge {
  id: string;
  title: string;
  type: "weekly" | "monthly";
  targetCount: number;
  currentCount: number;
  metricLabel: string;
}

/**
 * Fetches dynamic challenges based on tracking indices [INDEX].
 */
export function getActiveUserChallenges(completedLessons: number, quizzAttempts: number): ActiveChallenge[] {
  return [
    { id: "ch_w_01", title: "Weekly Syllabus Sprint", type: "weekly", targetCount: 5, currentCount: Math.min(completedLessons, 5), metricLabel: "Lessons Completed" },
    { id: "ch_m_02", title: "Monthly Assessment Marathon", type: "monthly", targetCount: 3, currentCount: Math.min(quizzAttempts, 3), metricLabel: "Quizzes Passed" }
  ];
}
