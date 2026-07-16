import { Text, View } from "react-native";

export default function AIPDFScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        📄 AI PDF Assistant
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 10,
        }}
      >
        Phase 37
      </Text>
    </View>
  );
}