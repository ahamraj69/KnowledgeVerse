import { Text, View } from "react-native";

interface Props {
  title: string;
  description: string;
}

export default function CourseHeader({
  title,
  description,
}: Props) {
  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          fontSize: 16,
          marginTop: 10,
          lineHeight: 22,
        }}
      >
        {description}
      </Text>
    </View>
  );
}