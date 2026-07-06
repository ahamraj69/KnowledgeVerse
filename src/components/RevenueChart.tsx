import { StyleSheet, Text, View } from "react-native";

interface RevenueChartProps {
  values: number[];
}

export default function RevenueChart({
  values,
}: RevenueChartProps) {
  const max = Math.max(...values, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        📈 Revenue Overview
      </Text>

      <View style={styles.chart}>
        {values.map((value, index) => {
          const height = (value / max) * 140;

          return (
            <View
              key={index}
              style={styles.barContainer}
            >
              <View
                style={[
                  styles.bar,
                  {
                    height,
                  },
                ]}
              />

              <Text style={styles.label}>
                {index + 1}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
  },

  barContainer: {
    alignItems: "center",
    flex: 1,
  },

  bar: {
    width: 18,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    marginBottom: 8,
  },

  label: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});