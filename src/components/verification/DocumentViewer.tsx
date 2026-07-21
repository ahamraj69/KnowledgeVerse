import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DocumentViewer({ label, url }: { label: string; url?: string }) {
  const triggerActionAlert = (action: string) => {
    Alert.alert(action, `Executing system target attachment handling commands over: ${url}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.btn} onPress={() => triggerActionAlert("Open Document")}><Text style={styles.btnText}>👁️ Preview</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.secBtn]} onPress={() => triggerActionAlert("Zoom Asset")}><Text style={styles.btnText}>🔍 Zoom</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.secBtn]} onPress={() => triggerActionAlert("Download Metadata")}><Text style={styles.btnText}>📥 Save</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: "#1F2937", padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  label: { color: "white", fontSize: 14, fontWeight: "600", marginBottom: 10 },
  actionRow: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, backgroundColor: "#2563EB", paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  secBtn: { backgroundColor: "#111827" },
  btnText: { color: "white", fontSize: 12, fontWeight: "bold" }
});
