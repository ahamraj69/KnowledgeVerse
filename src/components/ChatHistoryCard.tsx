import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { ChatSession } from "@/types/chat";

interface ChatHistoryCardProps {
  session: ChatSession;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function ChatHistoryCard({ session, active, onSelect, onDelete }: ChatHistoryCardProps) {
  // Simple localized relative time string calculation loop
  const timeLabel = new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity 
      style={[styles.card, active && styles.activeCard]} 
      onPress={onSelect} 
      activeOpacity={0.8}
    >
      <View style={styles.contentColumn}>
        <Text style={[styles.title, active && styles.activeTitle]} numberOfLines={1}>
          {session.title}
        </Text>
        <Text style={styles.timeMuted}>{timeLabel}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteWrapper} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.deleteBtn}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  activeCard: { backgroundColor: "rgba(37,99,235,0.15)", borderColor: "#2563EB" },
  contentColumn: { flex: 1, paddingRight: 8 },
  title: { color: "#CBD5E1", fontSize: 14, fontWeight: "600" },
  activeTitle: { color: "#38BDF8", fontWeight: "700" },
  timeMuted: { color: "#6B7280", fontSize: 11, marginTop: 4, fontWeight: "500" },
  deleteWrapper: { padding: 4 },
  deleteBtn: { fontSize: 14, opacity: 0.6 }
});
