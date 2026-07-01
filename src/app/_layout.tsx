import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

/**
 * 🚀 Root Layout (App Entry)
 * Wraps entire app with Auth system
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}