export interface UnlockedReward {
  id: string;
  title: string;
  criteriaLabel: string;
  unlockedAt: number;
}

/**
 * Evaluates milestones to append rewards into profile caches [INDEX].
 */
export function evaluateAndUnlockRewards(streak: number, totalLessons: number): UnlockedReward[] {
  const unlocks: UnlockedReward[] = [];
  if (streak >= 3) {
    unlocks.push({ id: "rew_streak_3", title: "Consistent Learner Badge", criteriaLabel: "3-Day Learning Streak Secured", unlockedAt: Date.now() });
  }
  if (totalLessons >= 10) {
    unlocks.push({ id: "rew_lessons_10", title: "Premium Midnight Theme", criteriaLabel: "10 Total Lesson Nodes Finished", unlockedAt: Date.now() });
  }
  return unlocks;
}
