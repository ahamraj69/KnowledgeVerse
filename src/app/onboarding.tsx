import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Onboarding() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Onboarding Screen
      </Text>

      <Pressable
        onPress={() => router.replace("/signin")}
        style={{
          backgroundColor: "#3B82F6",
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>Go to Sign In</Text>
      </Pressable>
    </View>
  );
}