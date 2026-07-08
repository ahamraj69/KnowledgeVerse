import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Theme } from "../theme/theme";

// ✅ FIXED: Standardized fallback props contract to mirror library definitions
type Props = {
  error: any;
  resetErrorBoundary: () => void;
};

export default function ErrorFallback({ error, resetErrorBoundary }: Props) {
  return (
    <View style={[Theme.screen, styles.center]}>
      <Text style={[Theme.text, styles.title]}>⚠️ Unexpected Anomaly Caught</Text>
      <Text style={[Theme.muted, styles.msg]}>{error?.message || "An unhandled execution crash occurred."}</Text>
      <TouchableOpacity style={styles.btn} onPress={resetErrorBoundary}>
        <Text style={styles.btnText}>Restart App Runtime 🔄</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  msg: { marginTop: 10, marginBottom: 24, textAlign: "center", color: "#EF4444" },
  btn: { backgroundColor: "#2563EB", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 }
});
