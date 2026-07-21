import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import TeacherHeader from "@/components/teacher/TeacherHeader";
import TeacherStats from "@/components/teacher/TeacherStats";
import useTeacherProfile from "@/hooks/useTeacherProfile";
import { Theme } from "@/theme/theme";

export default function TeacherScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { teacher, loading } = useTeacherProfile(id || "");

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  if (!teacher) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <Text style={styles.errorText}>Educator account trace not discovered.</Text>
      </View>
    );
  }

  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenHeading}>Educator Profile</Text>
        
        {/* Step 4 Render Panel Hook */}
        <TeacherHeader teacher={teacher} />

        {/* Step 5 Render Grid Analytics Hook */}
        <Text style={styles.sectionTitle}>📈 Performance Insights</Text>
        <TeacherStats
          students={teacher.students}
          courses={teacher.courses}
          lessons={teacher.lessons}
          rating={teacher.rating}
        />

        {/* Localized Subjects Information */}
        {teacher.subjects && teacher.subjects.length > 0 && (
          <View style={styles.detailsCard}>
            <Text style={styles.cardHeading}>📚 SPECIALIZED SUBJECT TRACKS</Text>
            <Text style={styles.cardBodyText}>{teacher.subjects.join(" • ")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#EF4444", fontSize: 16, fontWeight: "600" },
  screenHeading: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { color: "white", fontSize: 14, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  detailsCard: { backgroundColor: "#111827", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  cardHeading: { color: "#38BDF8", fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  cardBodyText: { color: "white", fontSize: 15, fontWeight: "600", marginTop: 8 }
});
