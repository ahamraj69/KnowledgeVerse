import { StyleSheet, Text, View } from "react-native";

interface EarningCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function EarningCard({
  title,
  value,
  icon,
  color,
}: EarningCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>

        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>

          <Text style={[styles.value, { color }]}>
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 14,
    borderLeftWidth: 6,
    padding: 18,
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 32,
    marginRight: 15,
  },

  info: {
    flex: 1,
  },

  title: {
    color: "#9CA3AF",
    fontSize: 15,
    marginBottom: 6,
  },

  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
});