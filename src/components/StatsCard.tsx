import { Text, View } from "react-native";

interface StatItem {
  label: string;
  value: string | number;
  color?: string;
}

interface Props {
  title: string;
  stats: StatItem[];
}

export default function StatsCard({ title, stats }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#111827",
        padding: 18,
        borderRadius: 16,
        marginBottom: 15,
      }}
    >
      {/* Title */}
      <Text
        style={{
          color: "#9CA3AF",
          fontSize: 14,
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      {/* Grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {stats.map((item, index) => (
          <View
            key={index}
            style={{
              width: "48%",
              backgroundColor: "#1F2937",
              padding: 12,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 12,
              }}
            >
              {item.label}
            </Text>

            <Text
              style={{
                color: item.color || "white",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 4,
              }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}