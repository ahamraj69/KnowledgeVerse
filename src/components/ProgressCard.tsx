import { Text, View } from "react-native";

interface Props {
  title: string;
  value: number | string; // ✅ STEP 2B FIX: Union type allows both string and number inputs without compiler errors
  subtitle?: string;
  color?: string;
}

export default function ProgressCard({
  title,
  value,
  subtitle,
  color = "#2563EB",
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#1F2937",
        padding: 18,
        borderRadius: 16,
        marginBottom: 12,
      }}
    >
      {/* Title */}
      <Text
        style={{
          color: "#9CA3AF",
          fontSize: 14,
        }}
      >
        {title}
      </Text>

      {/* Value */}
      <Text
        style={{
          color: color,
          fontSize: 28,
          fontWeight: "bold",
          marginTop: 6,
        }}
      >
        {value}
      </Text>

      {/* Subtitle */}
      {subtitle && (
        <Text
          style={{
            color: "#6B7280",
            marginTop: 4,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
