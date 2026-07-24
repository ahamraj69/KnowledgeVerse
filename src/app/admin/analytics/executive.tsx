import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { getExecutiveKPIOverview } from "@/lib/courses/executiveAnalyticsService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import KPICard from "@/components/analytics/KPICard";
import { ExecutiveAnalyticsPayload } from "@/types/executiveAnalytics";
import { Theme } from "@/theme/theme";

export default function AdminExecutiveKPIDashboardScreen() {
  const [metrics, setMetrics] = useState<ExecutiveAnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLiveKPIPayload = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getExecutiveKPIOverview();
      setMetrics(data);
    } catch (e) {
      console.log("Error inside automated executive tracking system:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveKPIPayload();

    // ✅ Step 4 FIXED: Automatic interval polling loops maintain synchronized interface parameters safely [INDEX]
    const intervalId = setInterval(() => {
      fetchLiveKPIPayload();
    }, 45000); // Poll sets matching the 45-second cache TTL constraints

    return () => clearInterval(intervalId);
  }, [fetchLiveKPIPayload]);

  if (loading && !metrics) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadLabel}>Syncing structural executive scorecards...</Text>
      </View>
    );
  }

  const stampLabel = metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleTimeString() : "Just Now";

  return (
    // ✅ Step 7 FIXED: Enforces un-bypassable server-ready role locks over administrative dashboards [INDEX]
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchLiveKPIPayload} tintColor="#38BDF8" />}
        >
          <Text style={styles.title}>Executive KPI Console</Text>
          <Text style={styles.sub}>Step 1: Real-time Key Performance Indicators audit log desk. Sync window: {stampLabel} [INDEX].</Text>

          {/* ✅ Step 1 & Step 5 Mobile-Optimized Modular KPI Response Grid Matrix Layout */}
          <Text style={styles.sectionHeading}>🎯 High-Utility Core Metrics</Text>
          <View style={styles.kpiGrid}>
            {metrics?.totalUsersKPI && <KPICard label="Audience Base" kpi={metrics.totalUsersKPI} />}
            {metrics?.dauKPI && <KPICard label="Daily Active Users" kpi={metrics.dauKPI} />}
            {metrics?.monthlyGrowthKPI && <KPICard label="Monthly Growth" kpi={metrics.monthlyGrowthKPI} />}
            {metrics?.courseCompletionKPI && <KPICard label="Completion Rate" kpi={metrics.courseCompletionKPI} />}
            {metrics?.aiRequestsKPI && <KPICard label="AI Inquiries Load" kpi={metrics.aiRequestsKPI} />}
            {metrics?.activeCoursesKPI && <KPICard label="Active Syllabi" kpi={metrics.activeCoursesKPI} />}
          </View>

          {/* Highlight Cards Node */}
          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>🏆 PLATFORM LEADING INSTRUCTOR DECK</Text>
            <Text style={styles.highlightValue}>{metrics?.topTeacherName || "N/A"}</Text>
            <Text style={styles.highlightSub}>Cumulative performance evaluation rating parameters index: ⭐ {metrics?.topTeacherRating || "0.0"}</Text>
          </View>

          {/* ✅ Step 3 FIXED: Predictive Growth Forecast Estimations Sheet Container Block */}
          <Text style={styles.sectionHeading}>🔮 Predictive Growth Projections</Text>
          <View style={styles.forecastSheet}>
            <Text style={styles.forecastSubTitle}>Aggregated estimates calculated across current historical transaction velocities:</Text>
            <View style={styles.forecastRow}><Text style={styles.fLabel}>Estimated Total Audience (Next Month):</Text><Text style={styles.fValue}>{metrics?.forecast.estimatedUsersNextMonth}</Text></View>
            <View style={styles.forecastRow}><Text style={styles.fLabel}>Expected New Courses Submissions:</Text><Text style={styles.fValue}>{metrics?.forecast.expectedNewCourses}</Text></View>
            <View style={styles.forecastRow}><Text style={styles.fLabel}>AI Requests Volume Projections:</Text><Text style={styles.fValue}>{metrics?.forecast.aiUsageForecastCount}</Text></View>
            <View style={styles.forecastRow}><Text style={styles.fLabel}>Projected Peak Target DAU Audience:</Text><Text style={styles.fValue}>{metrics?.forecast.projectedDau}</Text></View>
          </View>

        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadLabel: { color: "#9CA3AF", fontSize: 13, marginTop: 12, fontWeight: "500" },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  sub: { color: "#6B7280", fontSize: 13, marginTop: 4, marginBottom: 20 },
  sectionHeading: { color: "white", fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, marginTop: 16 },
  
  // Grid layout parameters tokens
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between", marginBottom: 16 },
  
  highlightCard: { backgroundColor: "rgba(16,185,129,0.05)", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(16,185,129,0.25)", marginBottom: 18 },
  highlightLabel: { color: "#10B981", fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 4 },
  highlightValue: { color: "white", fontSize: 18, fontWeight: "bold" },
  highlightSub: { color: "#9CA3AF", fontSize: 12, marginTop: 4, fontWeight: "500" },

  forecastSheet: { backgroundColor: "#111827", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  forecastSubTitle: { color: "#6B7280", fontSize: 12, marginBottom: 12, lineHeight: 18, fontWeight: "500" },
  forecastRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.02)" },
  fLabel: { color: "#CBD5E1", fontSize: 13, fontWeight: "500" },
  fValue: { color: "#38BDF8", fontSize: 14, fontWeight: "bold" }
});
