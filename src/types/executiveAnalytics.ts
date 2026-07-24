export interface KPITrendData {
  currentValue: number | string;
  previousValue: number | string;
  percentageChange: number;
  isPositiveTrend: boolean;
}

export interface PredictiveGrowthForecast {
  estimatedUsersNextMonth: number;
  expectedNewCourses: number;
  aiUsageForecastCount: number;
  projectedDau: number;
}

export interface ExecutiveAnalyticsPayload {
  totalUsersKPI: KPITrendData;
  monthlyGrowthKPI: KPITrendData;
  courseCompletionKPI: KPITrendData;
  aiRequestsKPI: KPITrendData;
  activeCoursesKPI: KPITrendData;
  dauKPI: KPITrendData;
  topTeacherName: string;
  topTeacherRating: number;
  forecast: PredictiveGrowthForecast;
  lastUpdated: number;
}
