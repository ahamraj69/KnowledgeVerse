export interface Verse {
  id: string;
  title: string;
  message: string;
  author?: string;
  category: "motivation" | "learning" | "discipline" | "success" | "focus";
}

export interface DailyStudyGoal {
  lessonsTarget: number;
  lessonsCompleted: number;
  quizzesTarget: number;
  quizzesCompleted: number;
  aiQuestionsTarget: number;
  aiQuestionsCompleted: number;
  studyMinutesTarget: number;
  studyMinutesCompleted: number;
}
