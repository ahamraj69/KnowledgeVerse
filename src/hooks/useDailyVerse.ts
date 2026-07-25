import { useState, useEffect, useCallback } from "react";
import { versesEN } from "@/data/verses.en";
import { versesHI } from "@/data/verses.hi";
import { quotesEN } from "@/data/quotes.en";
import { quotesHI } from "@/data/quotes.hi";
import { getSmartRotatedVerse } from "@/lib/verseRotationService";
import { generateDynamicDailyGoalForUser } from "@/lib/dailyGoalService";
import { Verse, DailyStudyGoal } from "@/types/verse";
import { LearningQuote } from "@/data/quotes";

export function useDailyVerse(userStreakCount: number = 0, userRole: string = "student", completedLessonsCount: number = 0, langPreference: "en" | "hi" = "en") {
  const [dailyVerse, setDailyVerse] = useState<Verse>({ id: "v_init", title: "Study", message: "Build consistency.", category: "learning" });
  const [dailyQuote, setDailyQuote] = useState<LearningQuote>({ id: "q_init", quote: "Continuous learning leads to mastery.", author: "System" });
  const [goals, setGoals] = useState<DailyStudyGoal>({
    lessonsTarget: 1, lessonsCompleted: 0,
    quizzesTarget: 1, quizzesCompleted: 0,
    aiQuestionsTarget: 3, aiQuestionsCompleted: 0,
    studyMinutesTarget: 20, studyMinutesCompleted: 0
  });

  useEffect(() => {
    // 1. Resolve smart date-rotated verse
    const activeVerse = getSmartRotatedVerse();
    
    // ✅ Step 4 FIXED: Translate verse data mappings depending on lang parameters [INDEX]
    if (langPreference === "hi") {
      const hiMatch = versesHI.find(v => v.category === activeVerse.category);
      if (hiMatch) setDailyVerse(hiMatch);
      else setDailyVerse(activeVerse);
      setDailyQuote(quotesHI[0] || { id: "0", quote: "सीखना निरंतर जारी रखें।", author: "नॉलेजवर्स" });
    } else {
      const enMatch = versesEN.find(v => v.category === activeVerse.category);
      if (enMatch) setDailyVerse(enMatch);
      else setDailyVerse(activeVerse);
      setDailyQuote(quotesEN[0] || { id: "0", quote: "Keep learning daily.", author: "KnowledgeVerse" });
    }

    // 2. Generate dynamic user activity goals [INDEX]
    const adaptiveGoal = generateDynamicDailyGoalForUser(userRole, completedLessonsCount);
    setGoals(adaptiveGoal);
  }, [userRole, completedLessonsCount, langPreference]);

  return {
    dailyVerse,
    dailyQuote,
    goals
  };
}
