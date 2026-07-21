import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Onboarding() {
  const router = useRouter();

  // ✅ Memoized routing pipelines secure lightning fast viewport switching speeds
  const handleLoginNavigation = useCallback(() => {
    router.push("/login");
  }, [router]);

  const handleSignupNavigation = useCallback(() => {
    router.push("/signup");
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.logoArt}>🚀</Text>
      
      <Text style={styles.title}>Welcome to KnowledgeVerse</Text>
      
      <Text style={styles.subtitle}>
        India's elite AI-powered curriculum learning portal network layers.
      </Text>

      <View style={styles.buttonStack}>
        {/* ✅ FIXED: Primary active router hook loads the login panel */}
        <Pressable
          onPress={handleLoginNavigation}
          style={styles.primaryBtn}
          android_ripple={{ color: "rgba(255,255,255,0.1)" }}
        >
          <Text style={styles.primaryBtnText}>Sign In to Account</Text>
        </Pressable>

        {/* ✅ FIXED: Secondary router hook maps directly over to the registration layout */}
        <Pressable
          onPress={handleSignupNavigation}
          style={styles.secondaryBtn}
          android_ripple={{ color: "rgba(56,189,248,0.1)" }}
        >
          <Text style={styles.secondaryBtnText}>Create New Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1220",
    padding: 24,
  },
  logoArt: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    marginBottom: 8,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonStack: {
    width: "100%",
    gap: 14,
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#38BDF8",
  },
  secondaryBtnText: {
    color: "#38BDF8",
    fontWeight: "bold",
    fontSize: 16,
  },
});
