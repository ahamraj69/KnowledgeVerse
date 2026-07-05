import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ProgressCard from "../../components/ProgressCard";
import StatsCard from "../../components/StatsCard";

import { useAuth } from "../../context/AuthContext";

import {
  getUserAnalytics,
  UserAnalytics,
} from "../../services/analyticsService";

export default function AnalyticsScreen() {
  const { user } = useAuth();

  const [analytics, setAnalytics] =
    useState<UserAnalytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) return;

    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const data = await getUserAnalytics(user.uid);

      setAnalytics(data);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loading}>
          Loading Analytics...
        </Text>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>
          No analytics available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        📊 Your Analytics
      </Text>

      <ProgressCard
        title="📥 Downloads"
        value={analytics.totalDownloads}
        subtitle="Offline lessons saved"
        color="#22C55E"
      />

      <ProgressCard
        title="📝 Assignments"
        value={analytics.totalAssignments}
        subtitle="Completed assignments"
        color="#2563EB"
      />

      <ProgressCard
        title="🧠 Quiz Attempts"
        value={analytics.quizAttempts}
        subtitle="Total quizzes attempted"
        color="#A855F7"
      />

      <ProgressCard
        title="📈 Average Score"
        value={`${analytics.averageScore.toFixed(
          1
        )}%`}
        subtitle="Average quiz score"
        color="#F59E0B"
      />

      <StatsCard
        title="📈 Performance Overview"
        stats={[
          {
            label: "Total Score",
            value: analytics.totalQuizScore,
            color: "#A855F7",
          },
          {
            label: "Average",
            value: `${analytics.averageScore.toFixed(
              1
            )}%`,
            color: "#22C55E",
          },
          {
            label: "Assignments",
            value: analytics.totalAssignments,
            color: "#2563EB",
          },
          {
            label: "Downloads",
            value: analytics.totalDownloads,
            color: "#F59E0B",
          },
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});