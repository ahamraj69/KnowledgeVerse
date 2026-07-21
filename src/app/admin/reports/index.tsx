import { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { calculateModerationAnalytics, ModerationMetricsSummary } from "@/lib/courses/moderationAnalyticsService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Theme } from "@/theme/theme";

export default function AdminModerationDashboardMaster() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<ModerationMetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await calculateModerationAnalytics();
      setMetrics(data);
    } catch (e) {
      console.log("Error loading moderation dashboard trends: ", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading && !metrics) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#EF4444" /></View>;
  }

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadDashboardData} tintColor="#EF4444" />}
        >
          <Text style={styles.title}>Moderation Command Panel</Text>
          <Text style={styles.subtitle}>Step 3: Central workspace handling active platform enforcement data tracking logs [INDEX].</Text>

          {/* ✅ Step 4 FIXED: Core Operations Counter Summary Widgets Grid */}
          <Text style={styles.sectionHeading}>📊 Enforcement Queue Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statsCard, styles.pendingBorder]}>
              <Text style={styles.statsVal}>{metrics?.pendingCount || 0}</Text>
              <Text style={styles.statsLbl}>Pending</Text>
            </View>
            <View style={[styles.statsCard, styles.resolvedBorder]}>
              <Text style={styles.statsVal}>{metrics?.resolvedCount || 0}</Text>
              <Text style={styles.statsLbl}>Resolved</Text>
            </View>
            <View style={[styles.statsCard, styles.dismissedBorder]}>
              <Text style={styles.statsVal}>{metrics?.dismissedCount || 0}</Text>
              <Text style={styles.statsLbl}>Dismissed</Text>
            </View>
            <View style={[styles.statsCard, styles.priorityBorder]}>
              <Text style={styles.statsVal}>{metrics?.highPriorityCount || 0}</Text>
              <Text style={styles.statsLbl}>High Priority</Text>
            </View>
          </View>

          {/* ✅ Step 5 FIXED: Core Platform Abuse Trend Insights Widget Container */}
          <Text style={styles.sectionHeading}>📈 Identified Abuse Trend Highlights</Text>
          <View style={styles.trendBox}>
            <Text style={styles.trendHeaderLabel}>🚩 MOST FREQUENTLY REPORTED TARGET NODE</Text>
            <Text style={styles.trendValueText}>Entity Type: {(metrics?.mostReportedType || "None").toUpperCase()}</Text>
            <Text style={styles.trendSubText}>Reference Target Identifier Key: {metrics?.mostReportedTargetId || "None"}</Text>
          </View>

          {/* Navigation Action Links */}
          <Text style={styles.sectionHeading}>Queue Sub-Views</Text>
          <View style={styles.navStack}>
            <TouchableOpacity style={styles.linkCard} onPress={() => router.push("/admin/reports/pending" as any)}>
              <Text style={styles.cardTitle}>⏳ Review Active Pending Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkCard} onPress={() => router.push("/admin/moderation/warnings" as any)}>
              <Text style={styles.cardTitle}>⚠️ Inspect Logged Warnings list</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkCard} onPress={() => router.push("/admin/moderation/suspended" as any)}>
              <Text style={styles.cardTitle}>🚫 Suspended Profiles Records</Text>
            </TouchableOpacity>
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
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#6B7280", fontSize: 13, marginTop: 4, marginBottom: 24, lineHeight: 18 },
  sectionHeading: { color: "white", fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, marginTop: 14 },
  
  // Stats Layout Tokens
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between", marginBottom: 20 },
  statsCard: { flex: 1, minWidth: "47%", backgroundColor: "#111827", padding: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  pendingBorder: { borderBottomWidth: 3, borderBottomColor: "#EF4444" },
  resolvedBorder: { borderBottomWidth: 3, borderBottomColor: "#10B981" },
  dismissedBorder: { borderBottomWidth: 3, borderBottomColor: "#4B5563" },
  priorityBorder: { borderBottomWidth: 3, borderBottomColor: "#F59E0B" },
  statsVal: { color: "white", fontSize: 20, fontWeight: "bold" },
  statsLbl: { color: "#6B7280", fontSize: 11, fontWeight: "700", marginTop: 4 },

  // Trend Box Styling Tokens
  trendBox: { backgroundColor: "#111827", padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: "#EF4444", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)", marginBottom: 20 },
  trendHeaderLabel: { color: "#6B7280", fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 6 },
  trendValueText: { color: "white", fontSize: 15, fontWeight: "bold" },
  trendSubText: { color: "#9CA3AF", fontSize: 12, marginTop: 4 },

  // Navigation Links Stack Layout
  navStack: { gap: 12 },
  linkCard: { backgroundColor: "#111827", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  cardTitle: { color: "white", fontSize: 14, fontWeight: "600" }
});
