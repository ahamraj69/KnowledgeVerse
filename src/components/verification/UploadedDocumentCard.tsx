import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UploadedDocumentCard({ label, url, resubmitting, onReplace }: { label: string; url?: string; resubmitting: boolean; onReplace: () => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label} numberOfLines={1}>📄 {label}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.viewBtn} onPress={() => Alert.alert("Viewer", `Opening document preview downlink: ${url}`)}>
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
        {resubmitting && (
          <TouchableOpacity style={styles.repBtn} onPress={onReplace}>
            <Text style={styles.repText}>Replace</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1F2937", padding: 12, borderRadius: 10, marginBottom: 10 },
  label: { color: "white", fontSize: 14, fontWeight: "500", flex: 1, paddingRight: 8 },
  actions: { flexDirection: "row", gap: 10 },
  viewBtn: { backgroundColor: "#111827", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  viewText: { color: "#38BDF8", fontSize: 12, fontWeight: "bold" },
  repBtn: { backgroundColor: "#2563EB", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  repText: { color: "white", fontSize: 12, fontWeight: "bold" }
});
