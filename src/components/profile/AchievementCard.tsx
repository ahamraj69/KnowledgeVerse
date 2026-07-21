import { StyleSheet, Text, View } from "react-native";

export default function AchievementCard({ title }: { title: string; }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>🔥</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E1B4B", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "rgba(99,102,241,0.2)" },
  icon: { fontSize: 20, marginRight: 12 },
  title: { color: "white", fontSize: 15, fontWeight: "bold" }
});
