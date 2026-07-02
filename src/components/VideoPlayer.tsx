import { Text, View } from "react-native";

export default function VideoPlayer({ uri }: { uri: string }) {
  return (
    <View
      style={{
        width: "100%",
        height: 250,
        backgroundColor: "#1F2937",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      }}
    >
      <Text style={{ color: "white", textAlign: "center" }}>
        🎥 Video Player Placeholder
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 10,
          textAlign: "center",
          paddingHorizontal: 10,
        }}
      >
        {uri}
      </Text>
    </View>
  );
}