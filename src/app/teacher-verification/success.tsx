import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VerificationSuccessScreen() {
  const router = useRouter();

  return (
    <View style={[Theme.screen, styles.viewportWrapper]}>
      <Text style={styles.graphicBadge}>✅</Text>
      <Text style={styles.title}>Verification Request Submitted</Text>
      <Text style={styles.sub}>
        Our administrative tracking team will review your uploaded documents soon.
      </Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>CURRENT STATUS: </Text>
        <Text style={styles.statusValue}>PENDING REVIEW</Text>
      </View>

      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => router.replace("/feed" as any)}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#0B1220" },
  graphicBadge: { fontSize: 64, marginBottom: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", textAlign: "center" },
  sub: { color: "#9CA3AF", fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 22, paddingHorizontal: 10 },
  statusBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#111827", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, marginTop: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
  statusLabel: { color: "#6B7280", fontSize: 12, fontWeight: "700" },
  statusValue: { color: "#F59E0B", fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },
  btn: { marginTop: 32, backgroundColor: "#2563EB", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "bold", fontSize: 15 }
});
