import { StyleSheet, Text, View } from "react-native";

interface Props {
  role: "user" | "assistant";
  message: string;
}

export default function PdfChatBubble({
  role,
  message,
}: Props) {
  const isUser = role === "user";

  return (
    <View
      style={[
        styles.container,
        isUser
          ? styles.userContainer
          : styles.aiContainer,
      ]}
    >
      <Text style={styles.label}>
        {isUser ? "You" : "AI"}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 14,
    borderRadius: 12,
  },

  userContainer: {
    backgroundColor: "#2563EB",
    alignSelf: "flex-end",
    maxWidth: "85%",
  },

  aiContainer: {
    backgroundColor: "#1F2937",
    alignSelf: "flex-start",
    maxWidth: "85%",
  },

  label: {
    color: "#CBD5E1",
    fontWeight: "bold",
    marginBottom: 6,
  },

  message: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },
});