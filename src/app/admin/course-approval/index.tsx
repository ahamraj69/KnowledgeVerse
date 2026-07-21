import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Theme } from "@/theme/theme";

export default function CourseApprovalDashboardHome() {
  const router = useRouter();

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={[Theme.screen, styles.viewportWrapper]}>
        <Text style={styles.title}>🛡️ Curriculum Gatekeeper</Text>
        <Text style={styles.subtitle}>Evaluate and moderate submitted tutor academic programs before public rollout.</Text>

        {/* ✅ Step 11: Dashboard Statistics Overview Widgets Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statsCard}><Text style={styles.statsVal}>LIVE</Text><Text style={styles.statsLbl}>Production</Text></View>
          <View style={styles.statsCard}><Text style={styles.statsVal}>SYNC</Text><Text style={styles.statsLbl}>Cloud Storage</Text></View>
        </View>

        <View style={styles.navStack}>
          <TouchableOpacity style={styles.linkCard} onPress={() => router.push("/admin/course-approval/pending" as any)}>
            <Text style={styles.cardTitle}>⏳ Review Pending Queue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkCard} onPress={() => router.push("/admin/course-approval/approved" as any)}>
            <Text style={styles.cardTitle}>🟢 Approved Syllabi Records</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkCard} onPress={() => router.push("/admin/course-approval/rejected" as any)}>
            <Text style={styles.cardTitle}>🔴 Rejected Submissions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220", padding: 24 },
  title: { color: "white", fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#9CA3AF", fontSize: 14, marginTop: 4, marginBottom: 24, lineHeight: 20 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statsCard: { flex: 1, backgroundColor: "#111827", padding: 14, borderRadius: 12, alignItems: "center" },
  statsVal: { color: "#38BDF8", fontSize: 18, fontWeight: "bold" },
  statsLbl: { color: "#6B7280", fontSize: 11, fontWeight: "700", marginTop: 2 },
  navStack: { gap: 14 },
  linkCard: { backgroundColor: "#111827", padding: 18, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  cardTitle: { color: "white", fontSize: 15, fontWeight: "bold" }
});
