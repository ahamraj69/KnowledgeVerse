import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0F172A" },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course/[id]/index" />
        <Stack.Screen name="course/[id]/lessons" />
        <Stack.Screen name="lesson/video/[id]" />
        <Stack.Screen name="lesson/pdf/[id]" />
        <Stack.Screen name="lesson/text/[id]" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
});
