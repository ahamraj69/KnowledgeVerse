import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export default function Collapsible({ title, children }: CollapsibleProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trigger} onPress={toggleExpand} activeOpacity={0.8}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.arrow}>{expanded ? "🔼" : "🔽"}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  titleText: { color: "white", fontSize: 15, fontWeight: "600" },
  arrow: { fontSize: 12, color: "#9CA3AF" },
  content: { padding: 16, paddingTop: 0, borderTopWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
});
