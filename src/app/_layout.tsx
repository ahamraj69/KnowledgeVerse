import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ActivityIndicator, View } from "react-native";
import ErrorFallback from "../components/ErrorFallback";

import OfflineBanner from "../components/OfflineBanner";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { LoadingProvider } from "../context/LoadingContext";
import { NetworkProvider } from "../context/NetworkContext";

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // ✅ FIXED: Safely extracts the first string folder entry node out of the active router tree
    const firstSegment = segments && segments.length > 0 ? segments[0] : "";
    const inAuthScreen = firstSegment === "login" || firstSegment === "signup";

    if (!user && !inAuthScreen) {
      router.replace("/login" as any);
    }

    if (user && inAuthScreen) {
      router.replace("/" as any);
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}

// ✅ FIXED: Explicit default export declaration satisfies Expo Router page mappings perfectly
export default function RootLayout() {
  return (
    <NetworkProvider>
      <LoadingProvider>
        <AuthProvider>
          <OfflineBanner />
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
              console.log("App Crash Intercepted:", error);
              console.log(info.componentStack);
            }}
          >
            <RootNavigator />
          </ErrorBoundary>
        </AuthProvider>
      </LoadingProvider>
    </NetworkProvider>
  );
}
