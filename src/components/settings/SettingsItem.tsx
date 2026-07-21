import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsItem({ label, value, onPress }: { label: string; value?: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        {value && <Text style={styles.value}>{value}</Text>}
        <Text style={styles.arrow}>▶</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.03)" },
  label: { color: "white", fontSize: 15, fontWeight: "500" },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  value: { color: "#9CA3AF", fontSize: 14 },
  arrow: { color: "#4B5563", fontSize: 12 }
});
