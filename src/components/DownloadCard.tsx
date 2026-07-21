import { Theme } from "@/theme/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DownloadCard({ item, onRemove }: { item: any; onRemove: (id: string) => void }) {
  // ✅ FIXED: Safely resolves timestamps by falling back directly on custom payload variables
  const dateObj = new Date(item.downloadedAt || item.timestamp || Date.now());

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        {/* ✅ FIXED: Safeguarded text mapping evaluation blocks using safe inline fallback string variables */}
        <Text style={[Theme.text, styles.title]}>{item.lessonTitle || item.title || "Offline Video Module"}</Text>
        <Text style={[Theme.muted, styles.date]}>Cached: {dateObj.toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={() => onRemove(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  info: { flex: 1, paddingRight: 10 },
  title: { fontSize: 16, fontWeight: "bold", color: "white" },
  date: { fontSize: 12, marginTop: 4, color: "#6B7280" },
  deleteIcon: { fontSize: 16, opacity: 0.7 }
});
