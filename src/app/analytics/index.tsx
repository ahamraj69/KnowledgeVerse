import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
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

      const data =
        await getUserAnalytics(user!.uid);

      setAnalytics(data);
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#2563EB" />

        <Text
          style={{
            color: "white",
            marginTop: 10,
          }}
        >
          Loading Analytics...
        </Text>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          No analytics available
        </Text>
      </View>
    );
  }
  return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "#0B1220",
    }}
    contentContainerStyle={{
      padding: 20,
      paddingBottom: 40,
    }}
  >
    {/* Header */}
    <Text
      style={{
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
      }}
    >
      📊 Your Analytics
    </Text>

    {/* Key Progress Cards */}
    <ProgressCard
      title="📥 Downloads"
      value={analytics.totalDownloads}
      subtitle="Offline lessons saved"
      color="#22C55E"
    />

    <ProgressCard
      title="📝 Assignments"
      value={analytics.totalAssignments}
      subtitle="Total submissions"
      color="#2563EB"
    />

    <ProgressCard
      title="🧠 Quiz Attempts"
      value={analytics.quizAttempts}
      subtitle="Completed quizzes"
      color="#A855F7"
    />

    <ProgressCard
      title="📊 Average Score"
      value={analytics.averageScore.toFixed(1)}
      subtitle="Out of 100"
      color="#F59E0B"
    />

    {/* Stats Grid */}
    <StatsCard
      title="📈 Performance Overview"
      stats={[
        {
          label: "Total Score",
          value: analytics.totalQuizScore,
          color: "#A855F7",
        },
        {
          label: "Avg Performance",
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