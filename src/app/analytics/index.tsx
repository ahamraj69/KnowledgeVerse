import { useFocusEffect } from "expo-router";
import { memo, useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { getUserAnalytics, UserAnalytics } from "@/lib/analyticsService";
import { Theme } from "../../theme/theme";

function AnalyticsScreen() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      // ✅ FIXED: Enforced clear fallback termination state to prevent stuck loops if user is undefined
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      const loadData = async () => {
        try {
          setLoading(true);
          const data = await getUserAnalytics(user.uid);
          setAnalytics(data);
        } catch (e) {
          console.log("Analytics telemetry fetch error catch trace:", e);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [user?.uid])
  );

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // ✅ FIXED: Added helper flag logic to evaluate empty statistics states cleanly
  const hasNoData = analytics === null || (
    analytics.totalDownloads === 0 &&
    analytics.totalAssignments === 0 &&
    analytics.quizAttempts === 0
  );

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.content}>
      <Text style={[Theme.text, styles.title]}> My Analytics</Text>
      
      {analytics && (
        <View style={styles.grid}>
          <Text style={Theme.text}>Downloads: {analytics.totalDownloads}</Text>
          <Text style={Theme.text}>Assignments: {analytics.totalAssignments}</Text>
          <Text style={Theme.text}>Quiz Attempts: {analytics.quizAttempts}</Text>
          <Text style={Theme.text}>Average Score: {analytics.averageScore}%</Text>
        </View>
      )}

      {/* ✅ FIXED: High-utility message container breaks empty screen confusion completely */}
      {hasNoData && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyCardTitle}> No analytics yet</Text>
          <Text style={styles.emptyCardSub}>
            Start learning courses, taking quizzes and submitting assignments.
            Your statistics will appear here automatically.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  grid: { gap: 12 },
  // ✅ FIXED: Shifted inline style objects out of runtime evaluation threads to keep updates fast
  emptyCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)"
  },
  emptyCardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyCardSub: {
    color: "#9CA3AF",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20
  }
});

export default memo(AnalyticsScreen);
