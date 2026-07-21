import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ActivityIndicator, View } from "react-native";
import ErrorFallback from "../components/ErrorFallback";

import OfflineBanner from "../components/OfflineBanner";
import { Routes } from "../constants/routes";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { LoadingProvider } from "../context/LoadingContext";
import { NetworkProvider } from "../context/NetworkContext";
import { RoleProvider, useRoleContext } from "../context/RoleContext";

function AuthGatedContent() {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRoleContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || roleLoading) return;

    const firstSegment = segments && segments.length > 0 ? segments[0] : "";
    const authScreens = ["login", "signup", "onboarding", "patriotic-splash", ""];
    const isAuthScreen = authScreens.includes(firstSegment);

    if (!user && !isAuthScreen) {
      router.replace(Routes.Splash as any);
      return;
    }

    // ✅ Step 10 FIXED: Automatic role-based routing routing paths upon session detection [INDEX]
    if (user && (firstSegment === "login" || firstSegment === "signup" || firstSegment === "onboarding" || firstSegment === "")) {
      switch (role) {
        case "teacher":
          router.replace("/teacher" as any);
          break;
        case "admin":
          router.replace("/admin" as any);
          break;
        case "student":
        default:
          router.replace(Routes.Feed as any);
          break;
      }
    }
  }, [user, authLoading, roleLoading, role, segments, router]);

  if (authLoading || roleLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />;
}

function RootNavigator() {
  const { user } = useAuth();

  return (
    // ✅ Nested dynamically inside AuthContext to extract user variables securely [INDEX]
    <RoleProvider uid={user?.uid}>
      <AuthGatedContent />
    </RoleProvider>
  );
}

export default function RootLayout() {
  return (
    <NetworkProvider>
      <LoadingProvider>
        <AuthProvider>
          <OfflineBanner />
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.log("Intercepted Error:", error)}>
            <RootNavigator />
          </ErrorBoundary>
        </AuthProvider>
      </LoadingProvider>
    </NetworkProvider>
  );
}
