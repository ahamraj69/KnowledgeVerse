import { StyleSheet, Text, View } from "react-native";

interface HintRowProps {
  text: string;
  type?: "info" | "warning";
}

export default function HintRow({ text, type = "info" }: HintRowProps) {
  const isWarning = type === "warning";
  
  return (
    <View style={[styles.row, isWarning ? styles.warningRow : styles.infoRow]}>
      <Text style={styles.icon}>{isWarning ? "⚠️" : "💡"}</Text>
      <Text style={[styles.hintText, isWarning ? styles.warningText : styles.infoText]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1,
  },
  infoRow: { backgroundColor: "rgba(37,99,235,0.08)", borderColor: "rgba(37,99,235,0.15)" },
  warningRow: { backgroundColor: "rgba(217,119,6,0.08)", borderColor: "rgba(217,119,6,0.15)" },
  icon: { fontSize: 16, marginRight: 10 },
  hintText: { flex: 1, fontSize: 14, lineHeight: 20 },
  infoText: { color: "#38BDF8" },
  warningText: { color: "#FBBF24" },
});
