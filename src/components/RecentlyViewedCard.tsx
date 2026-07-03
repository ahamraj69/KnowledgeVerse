import { Text, TouchableOpacity } from "react-native";

interface Props {
  courseId: string;
  title: string;
  onPress: (courseId: string) => void;
}

export default function RecentlyViewedCard({
  courseId,
  title,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={() => onPress(courseId)}
      style={{
        backgroundColor: "#1F2937",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: "#9CA3AF",
          fontSize: 13,
          marginBottom: 4,
        }}
      >
        📚 Recently Viewed
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}