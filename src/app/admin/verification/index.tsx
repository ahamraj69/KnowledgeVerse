import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboardHome() {
  const router = useRouter();

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={[Theme.screen, styles.viewportWrapper]}>
        <Text style={styles.title}>🛡️ Operations Hub</Text>
        <Text style={styles.subtitle}>Review incoming professional credential application requests.</Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => router.push("/admin/verification/pending" as any)}>
            <Text style={styles.icon}>⏳</Text>
            <Text style={styles.cardTitle}>Pending Applications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push("/admin/verification/approved" as any)}>
            <Text style={styles.icon}>✅</Text>
            <Text style={styles.cardTitle}>Approved Instructors</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push("/admin/verification/rejected" as any)}>
            <Text style={styles.icon}>❌</Text>
            <Text style={styles.cardTitle}>Rejected Inquiries</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220", padding: 24 },
  title: { color: "white", fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#9CA3AF", fontSize: 14, marginTop: 4, marginBottom: 28 },
  grid: { gap: 16 },
  card: { backgroundColor: "#111827", padding: 20, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: "#2563EB", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  icon: { fontSize: 28, marginBottom: 8 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "bold" }
});
