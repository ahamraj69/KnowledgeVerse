import { DailyStudyGoal } from "@/types/verse";

/**
 * Generates an adaptive, tailored daily target payload matching current user metrics [INDEX].
 */
export function generateDynamicDailyGoalForUser(userRole: string, totalLessonsCompleted: number): DailyStudyGoal {
  // Scenario: Fresh New User
  if (totalLessonsCompleted === 0) {
    return {
      lessonsTarget: 1,
      lessonsCompleted: 0,
      quizzesTarget: 0,
      quizzesCompleted: 0,
      aiQuestionsTarget: 1,
      aiQuestionsCompleted: 0,
      studyMinutesTarget: 10,
      studyMinutesCompleted: 0
    };
  }

  // Scenario: Active Educator
  if (userRole === "teacher") {
    return {
      lessonsTarget: 2,
      lessonsCompleted: 0,
      quizzesTarget: 0,
      quizzesCompleted: 0,
      aiQuestionsTarget: 0,
      aiQuestionsCompleted: 0,
      studyMinutesTarget: 30,
      studyMinutesCompleted: 0
    };
  }

  // Default Scenario: Standard Active Student
  return {
    lessonsTarget: 1,
    lessonsCompleted: 0,
    quizzesTarget: 1,
    quizzesCompleted: 0,
    aiQuestionsTarget: 3,
    aiQuestionsCompleted: 0,
    studyMinutesTarget: 20,
    studyMinutesCompleted: 0
  };
}
