import { Course } from "@/types/course";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CourseCardProps {
  course: Course;
  onPress?: () => void; // Optional handler to clear type warnings
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Pressable
      // ✅ Step 4 FIXED: Direct push parameter cleanly opens dynamic course profiles
      onPress={() => router.push(`/course/${course.id}` as any)}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.9 : 1.0 }
      ]}
      android_ripple={{ color: "rgba(56,189,248,0.1)" }}
    >
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{course.description}</Text>

      <View style={styles.metaRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⭐ {course.rating.toFixed(1)}</Text>
        </View>
        <View style={[styles.badge, styles.accentBadge]}>
          <Text style={styles.accentBadgeText}>{course.difficulty}</Text>
        </View>
        <Text style={styles.durationText}>⏱️ {course.duration}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  title: { color: "#FFFFFF", fontSize: 19, fontWeight: "bold", letterSpacing: 0.2 },
  description: { color: "#9CA3AF", marginTop: 8, fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 16, gap: 10 },
  badge: { backgroundColor: "rgba(255,255,255,0.04)", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  badgeText: { color: "#FBBF24", fontSize: 12, fontWeight: "700" },
  accentBadge: { backgroundColor: "rgba(56,189,248,0.1)" },
  accentBadgeText: { color: "#38BDF8", fontSize: 12, fontWeight: "700" },
  durationText: { color: "#6B7280", fontSize: 13, fontWeight: "500", marginLeft: "auto" },
});
