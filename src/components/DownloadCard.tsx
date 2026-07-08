import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DownloadItem } from "../services/downloadService";
import { Theme } from "../theme/theme";

interface Props {
  item: DownloadItem;
  onRemove: () => void;
}

export default function DownloadCard({ item, onRemove }: Props) {
  // ✅ FIX: Force numeric extraction fallback so the native Date constructor parameters type-check perfectly
  const dateObj = new Date(item.downloadedAt ?? Date.now());
  const dateString = dateObj.toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={[Theme.text, styles.title]}>{item.lessonTitle}</Text>
        <Text style={[Theme.muted, styles.date]}>Downloaded on: {dateString}</Text>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
        <Text style={styles.removeText}>Delete 🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 13,
    marginTop: 4,
  },
  removeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  removeText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 14,
  },
});
