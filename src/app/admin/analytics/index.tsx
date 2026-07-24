import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { getAdvancedAnalyticsOverview } from "@/lib/analyticsService";
import { exportTelemetryDataPayload } from "@/lib/analyticsExportService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import StatCard from "@/components/analytics/StatCard";
import InsightCard from "@/components/analytics/InsightCard";
// ✅ FIXED: Appended missing custom presentation components imports to lock down types stability
import TeacherLeaderboard from "@/components/analytics/TeacherLeaderboard";
import CourseLeaderboard from "@/components/analytics/CourseLeaderboard";
import RetentionChart from "@/components/analytics/RetentionChart";
import ExportDialog from "@/components/analytics/ExportDialog";
import PieChart from "@/components/analytics/PieChart";
import { AdvancedAnalyticsSummary } from "@/types/advancedAnalytics";
import { Theme } from "@/theme/theme";

export default function AdvancedAnalyticsDashboardMasterScreen() {
  const [metrics, setMetrics] = useState<AdvancedAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAdvancedTelemetry = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdvancedAnalyticsOverview();
      setMetrics(data);
    } catch (e) {
      console.log("Error inside advanced telemetry hydration processing loop: ", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncAdvancedTelemetry();
  }, [syncAdvancedTelemetry]);

  const handleDocumentExport = async (format: "CSV" | "PDF") => {
    await exportTelemetryDataPayload(format, "system_overview_metrics");
  };

  if (loading && !metrics) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadTxt}>Compiling advanced cross-collection evaluation metrics...</Text>
      </View>
    );
  }

  const timeLabel = metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleTimeString() : "Just Now";

  const platformDistributionPayload = [
    { label: "Android OS", value: metrics?.platformAndroidPct || 62, color: "#10B981" },
    { label: "Apple iOS", value: metrics?.platformIosPct || 28, color: "#38BDF8" },
    { label: "Web Portals", value: metrics?.platformWebPct || 10, color: "#F59E0B" }
  ];

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={syncAdvancedTelemetry} tintColor="#38BDF8" />}
        >
          <View style={styles.header}>
            <View style={styles.titleColumn}>
              <Text style={styles.title}>Enterprise Telemetry Hub</Text>
              <Text style={styles.metaLabel}>Last synced telemetry packet: {timeLabel}</Text>
            </View>
            <TouchableOpacity style={styles.refreshBadgeBtn} onPress={syncAdvancedTelemetry} activeOpacity={0.7}>
              <Text style={styles.refreshBadgeBtnText}>🔄 Sync</Text>
            </TouchableOpacity>
          </View>

          {metrics?.insights && <InsightCard insights={metrics.insights} />}

          <AnalyticsSection title="👥 Active Platform Audience Sticks (DAU / MAU)">
            <StatCard label="Daily Actives (DAU)" value={metrics?.dau || 0} tint="#38BDF8" />
            <StatCard label="Monthly Actives (MAU)" value={metrics?.mau || 0} tint="#2563EB" />
            <StatCard label="Audience DAU/MAU Ratio" value={`${metrics?.dauToMauRatio || 0}%`} tint="#A855F7" />
            <StatCard label="Daily Active DAU Growth" value={`+${metrics?.dauGrowthPercent || 0}%`} tint="#10B981" />
          </AnalyticsSection>

          {metrics?.retentionTimeline && <RetentionChart data={metrics.retentionTimeline} />}

          {metrics?.teachersLeaderboard && <TeacherLeaderboard data={metrics.teachersLeaderboard} />}

          {metrics?.popularCourses && <CourseLeaderboard data={metrics.popularCourses} />}

          <PieChart data={platformDistributionPayload} title="🌍 HARDWARE ARCHITECTURE PLATFORM DISTRIBUTION USAGE" />

          <ExportDialog onTrigger={handleDocumentExport} />

        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B1220" },
  loadTxt: { color: "#9CA3AF", fontSize: 13, marginTop: 12, fontWeight: "600" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  titleColumn: { flex: 1, paddingRight: 8 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  metaLabel: { color: "#6B7280", fontSize: 12, marginTop: 4, fontWeight: "500" },
  refreshBadgeBtn: { backgroundColor: "rgba(56,189,248,0.08)", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: "rgba(56,189,248,0.2)" },
  refreshBadgeBtnText: { color: "#38BDF8", fontSize: 12, fontWeight: "700" }
});
