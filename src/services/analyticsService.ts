import { getUserSubmissions } from "./assignmentService";
import { getDownloads } from "./downloadService";

export interface UserAnalytics {
  totalDownloads: number;
  totalAssignments: number;
  totalQuizScore: number;
  quizAttempts: number;
  averageScore: number;
}

/**
 * 📊 Get full user analytics
 */
export const getUserAnalytics = async (
  userId: string
): Promise<UserAnalytics> => {
  try {
    const downloads = await getDownloads();
    const submissions = await getUserSubmissions(userId);

    let totalScore = 0;
    let attempts = 0;

    // Simulate quiz analysis (simple version)
    for (const sub of submissions) {
      if (sub.status === "graded" && sub.grade !== undefined) {
        totalScore += sub.grade;
        attempts++;
      }
    }

    return {
      totalDownloads: downloads.length,
      totalAssignments: submissions.length,
      totalQuizScore: totalScore,
      quizAttempts: attempts,
      averageScore: attempts > 0 ? totalScore / attempts : 0,
    };
  } catch (error) {
    console.log("Analytics error:", error);

    return {
      totalDownloads: 0,
      totalAssignments: 0,
      totalQuizScore: 0,
      quizAttempts: 0,
      averageScore: 0,
    };
  }
};