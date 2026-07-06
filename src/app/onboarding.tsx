import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Onboarding() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B1220" }}>
      <Text style={{ fontSize: 22, marginBottom: 20, color: "white", fontWeight: "bold" }}>
        Onboarding Screen
      </Text>

      <Pressable
        // ✅ FIX: Rerouted from non-existent /signin path to your verified active /signup layout screen
        onPress={() => router.replace("/signup")}
        style={{
          backgroundColor: "#3B82F6",
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Go to Sign Up</Text>
      </Pressable>
    </View>
  );
}
