import { VerificationRequest } from "@/types/verification";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StatusBadge from "./StatusBadge";

export default function VerificationCard({ request, onView }: { request: VerificationRequest; onView: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.name}>{request.fullName}</Text>
        <Text style={styles.sub}>📍 {request.country} • 💼 {request.experience} Yrs Exp</Text>
        <Text style={styles.subjects} numberOfLines={1}>📚 Focus: {request.subjects.join(", ")}</Text>
      </View>
      <View style={styles.right}>
        <StatusBadge status={request.status} />
        <TouchableOpacity style={styles.btn} onPress={onView} activeOpacity={0.8}>
          <Text style={styles.btnText}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  left: { flex: 1, paddingRight: 8 },
  name: { color: "white", fontSize: 16, fontWeight: "bold" },
  sub: { color: "#9CA3AF", fontSize: 13, marginTop: 4 },
  subjects: { color: "#38BDF8", fontSize: 12, marginTop: 6, fontWeight: "600" },
  right: { alignItems: "flex-end", gap: 12 },
  btn: { backgroundColor: "#2563EB", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  btnText: { color: "white", fontSize: 13, fontWeight: "bold" }
});
