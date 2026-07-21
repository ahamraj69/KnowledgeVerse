import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { auth } from "../lib/firebase";

export default function PatrioticSplash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth.currentUser) {
        router.replace("/feed" as any);
      } else {
        router.replace("/onboarding" as any);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/animations/indian-flag.json")}
        autoPlay={true}
        loop={true}
        hardwareAccelerationAndroid={true}
        style={styles.flag}
      />

      <Text style={styles.title}>Jai Hind 🇮🇳</Text>

      <Text style={styles.subtitle}>
        Welcome to KnowledgeVerse
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },
  flag: {
    width: 260,
    height: 260,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
  },
  subtitle: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 18,
  },
});
