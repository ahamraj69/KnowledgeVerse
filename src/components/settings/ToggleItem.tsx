import { StyleSheet, Switch, Text, View } from "react-native";

export default function ToggleItem({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (val: boolean) => void }) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: "#1F2937", true: "#2563EB" }} thumbColor="white" />
    </View>
  );
}
const styles = StyleSheet.create({
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.03)" },
  label: { color: "white", fontSize: 15, fontWeight: "500" }
});
