import { useFocusEffect } from "expo-router";
import { memo, useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { getUserAnalytics, UserAnalytics } from "../../services/analyticsService";
import { Theme } from "../../theme/theme";

function AnalyticsScreen() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Phase 21.10: Data parsing executes lazily ONLY upon viewport focus
  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;

      const loadData = async () => {
        try {
          setLoading(true);
          const data = await getUserAnalytics(user.uid);
          setAnalytics(data);
        } catch (e) {
          console.log(e);
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

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.content}>
      <Text style={[Theme.text, styles.title]}>📊 My Analytics</Text>
      {analytics && (
        <View style={styles.grid}>
          <Text style={Theme.text}>Downloads: {analytics.totalDownloads}</Text>
          <Text style={Theme.text}>Assignments: {analytics.totalAssignments}</Text>
          <Text style={Theme.text}>Quiz Attempts: {analytics.quizAttempts}</Text>
          <Text style={Theme.text}>Average Score: {analytics.averageScore}%</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  grid: { gap: 12 }
});

// ✅ Phase 21.3: Heavy computing screens are memo-blocked against repetitive re-renders
export default memo(AnalyticsScreen);
