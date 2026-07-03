import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import GlobalLoader from "../src/components/GlobalLoader";
import { LoadingProvider } from "../src/context/LoadingContext";

/**
 * 🚀 Root Layout (App Entry)
 * Wraps entire app with Auth and Global Loading systems
 */
export default function RootLayout() {
  return (
    <LoadingProvider>
      <AuthProvider>
        {/* Global Loading Overlay Component */}
        <GlobalLoader />

        {/* Application Navigation Stack */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AuthProvider>
    </LoadingProvider>
  );
}
