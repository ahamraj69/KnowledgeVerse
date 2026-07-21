import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/theme/theme";

export default function ReportSuccessScreen() {
  const router = useRouter();

  return (
    <View style={[Theme.screen, styles.viewportWrapper]}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Report Submitted Successfully</Text>
      <Text style={styles.sub}>
        Our moderation team will review the flagged content and take appropriate actions. Thank you for keeping KnowledgeVerse safe.
      </Text>

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
  icon: { fontSize: 64, marginBottom: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", textAlign: "center" },
  sub: { color: "#9CA3AF", fontSize: 14, textAlign: "center", marginTop: 10, lineHeight: 22, paddingHorizontal: 12 },
  btn: { marginTop: 32, backgroundColor: "#111827", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  btnText: { color: "#38BDF8", fontWeight: "bold", fontSize: 15 }
});
