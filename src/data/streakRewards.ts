export interface StreakMilestoneReward {
  daysThreshold: number;
  tierTitle: string;
  badgeIcon: string;
}

export const streakMilestoneRewards: StreakMilestoneReward[] = [
  { daysThreshold: 3, tierTitle: "Consistent Learner", badgeIcon: "🔥" },
  { daysThreshold: 7, tierTitle: "Rising Scholar", badgeIcon: "⭐" },
  { daysThreshold: 15, tierTitle: "Dedicated Thinker", badgeIcon: "🧠" },
  { daysThreshold: 30, tierTitle: "Master Learner", badgeIcon: "🏆" },
  { daysThreshold: 60, tierTitle: "Knowledge Legend", badgeIcon: "💎" },
  { daysThreshold: 100, tierTitle: "Century Scholar", badgeIcon: "👑" }
];
