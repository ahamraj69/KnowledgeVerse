import { verses } from "@/data/verses";
import { learningQuotes, LearningQuote } from "@/data/quotes";
import { Verse } from "@/types/verse";

export function getVerseOfTheDay(): Verse {
  const currentTimestamp = Date.now();
  const dayIndexOffset = Math.floor(currentTimestamp / (1000 * 60 * 60 * 24));
  const selectionIndex = dayIndexOffset % verses.length;
  return verses[selectionIndex];
}

export function getRandomLearningQuote(): LearningQuote {
  const currentTimestamp = Date.now();
  const selectionIndex = currentTimestamp % learningQuotes.length;
  return learningQuotes[selectionIndex];
}

export function getStreakMilestoneEncouragement(
  currentStreak: number
): { nextMilestone: number; message: string } {

  const milestones = [3, 7, 15, 30, 60, 100, 365];

  const targetMilestone =
    milestones.find((m) => m > currentStreak) ??
    (currentStreak + 1);

  const remaining = targetMilestone - currentStreak;

  return {
    nextMilestone: targetMilestone,
    message: `🔥 Push forward today to secure your ${currentStreak + 1}-day streak! Only ${remaining} day${remaining > 1 ? "s" : ""} away from the ${targetMilestone}-Day milestone.`,
  };
}