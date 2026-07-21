import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// ✅ FIXED: Redirected types import reference to pull cleanly out of root chat contracts [INDEX]
import { Bookmark } from "@/types/chat";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onOpen: (courseId: string) => void;
  onDelete: (id: string) => void;
}

export default function BookmarkCard({ bookmark, onOpen, onDelete }: BookmarkCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.course}>Ref Track: {bookmark.courseId}</Text>
        <Text style={styles.title}>{bookmark.lessonTitle}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.openBtn} onPress={() => onOpen(bookmark.courseId)}>
          <Text style={styles.openText}>Resume</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(bookmark.id)}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  info: { flex: 1, paddingRight: 10 },
  course: { color: "#38BDF8", fontSize: 11, fontWeight: "700" },
  title: { color: "white", fontSize: 16, fontWeight: "bold", marginTop: 2 },
  actions: { flexDirection: "row", alignItems: "center", gap: 14 },
  openBtn: { backgroundColor: "#2563EB", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  openText: { color: "white", fontWeight: "bold", fontSize: 13 },
  deleteText: { fontSize: 16, opacity: 0.7 }
});
