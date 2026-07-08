import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { auth } from "../lib/firebase";
import { Colors } from "../theme/colors";
import { Theme } from "../theme/theme";

// ✅ FIXED: Using classic default function export so Expo Router registers the path node smoothly
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert("Invalid Input", "Please populate both login credential field streams.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      router.replace("/" as any);
    } catch (error) {
      console.log("Authentication transaction fault:", error);
      Alert.alert("Sign In Failed", "Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={[Theme.text, styles.title]}>🔐 Welcome Back</Text>
      <Text style={[Theme.muted, styles.subtitle]}>Sign in to access your KnowledgeVerse courses.</Text>

      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={styles.input}
      />

      <TouchableOpacity 
        disabled={loading} 
        onPress={handleLogin} 
        style={[styles.btn, { backgroundColor: Colors.primary, opacity: loading ? 0.6 : 1 }]}
      >
        <Text style={[Theme.text, styles.btnText]}>{loading ? "Verifying Session..." : "Sign In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={loading} onPress={() => router.push("/signup" as any)} style={styles.linkGap}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: "center", flex: 1, backgroundColor: "#0F172A" },
  title: { fontSize: 32, fontWeight: "bold" },
  subtitle: { fontSize: 16, marginTop: 6, marginBottom: 30 },
  input: {
    backgroundColor: "#111827",
    color: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    fontSize: 16,
  },
  btn: { padding: 16, borderRadius: 12, alignItems: "center", marginTop: 10 },
  btnText: { fontWeight: "bold", fontSize: 17 },
  linkGap: { marginTop: 20 },
  linkText: { color: "#2563EB", fontWeight: "600", textAlign: "center" }
});
