import { Stack } from "expo-router";
import GlobalLoader from "../components/GlobalLoader";
import { AuthProvider } from "../context/AuthContext";
import { LoadingProvider } from "../context/LoadingContext";

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
