import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { Theme } from "../theme/theme";

interface CardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

// ✅ Phase 21.1: Memoized core component layout freezes state re-evaluations
const DashboardCard = memo(function DashboardCard({ title, icon, color, onPress }: CardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { borderLeftColor: color }]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[Theme.text, styles.cardTitle]}>{title}</Text>
        <Text style={[Theme.muted, styles.cardSub]}>Launch module pipeline</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ Phase 21.2: Stable memoized functional routing callbacks
  const openAnalytics = useCallback(() => {
    if (!user) {
      router.push("/login" as any);
      return;
    }
    router.push("/analytics" as any);
  }, [user, router]);

  const openExplore = useCallback(() => {
    router.push("/explore" as any);
  }, [router]);

  const openForum = useCallback(() => {
    router.push("/forum" as any);
  }, [router]);

  const openTeacher = useCallback(() => {
    router.push("/teacher" as any);
  }, [router]);

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.container}>
      <Text style={[Theme.text, styles.welcomeTitle]}>
        👋 Welcome, {user?.displayName || "Student"}
      </Text>
      <Text style={[Theme.muted, styles.subtitle]}>
        Manage curriculum streams and telemetry tracking nodes.
      </Text>

      <View style={styles.grid}>
        <DashboardCard title="Analytics" icon="📊" color="#0EA5E9" onPress={openAnalytics} />
        <DashboardCard title="Explore Courses" icon="🎓" color="#10B981" onPress={openExplore} />
        <DashboardCard title="Discussion Forum" icon="💬" color="#6366F1" onPress={openForum} />
        <DashboardCard title="Teacher Studio" icon="👨‍🏫" color="#F59E0B" onPress={openTeacher} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  welcomeTitle: { fontSize: 26, fontWeight: "bold", marginTop: 10 },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 25 },
  grid: { gap: 16 },
  card: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderLeftWidth: 5,
  },
  iconContainer: { width: 50, height: 50, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 15 },
  iconText: { fontSize: 24 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "600" },
  cardSub: { fontSize: 13, marginTop: 2 },
});
