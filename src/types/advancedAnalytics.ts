export interface TeacherPerformanceRow {
  teacherId: string;
  displayName: string;
  coursesCount: number;
  studentsCount: number;
  averageRating: number;
  completionRate: number;
  certificatesIssued: number;
}

export interface AdvancedCourseMetricRow {
  courseId: string;
  title: string;
  category: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  averageProgress: number;
  trend: "trending" | "stable" | "declining";
}

export interface RetentionDataPoint {
  day: string;
  returningUsers: number;
  percentage: number;
  dropOffPercentage: number;
}

export interface AdvancedAnalyticsSummary {
  dau: number;
  dauGrowthPercent: number;
  peakHour: string;
  mau: number;
  dauToMauRatio: number;
  newUsersCount: number;
  returningUsersCount: number;
  retentionTimeline: RetentionDataPoint[];
  teachersLeaderboard: TeacherPerformanceRow[];
  popularCourses: AdvancedCourseMetricRow[];
  platformAndroidPct: number;
  platformIosPct: number;
  platformWebPct: number;
  insights: string[];
  lastUpdated: number;
}
