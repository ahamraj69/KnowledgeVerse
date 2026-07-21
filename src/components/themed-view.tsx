import { StyleSheet, Text, TextProps } from "react-native";

interface ThemedTextProps extends TextProps {
  type?: "title" | "subtitle" | "body" | "muted";
}

export default function ThemedText({ children, type = "body", style, ...props }: ThemedTextProps) {
  return (
    <Text
      style={[
        type === "title" && styles.title,
        type === "subtitle" && styles.subtitle,
        type === "body" && styles.body,
        type === "muted" && styles.muted,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "white", fontSize: 18, fontWeight: "600" },
  body: { color: "#E5E7EB", fontSize: 15, lineHeight: 22 },
  muted: { color: "#9CA3AF", fontSize: 14 },
});
