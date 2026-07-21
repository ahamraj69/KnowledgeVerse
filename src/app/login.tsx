import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { auth } from "../lib/firebase";
import { Colors } from "../theme/colors";
import { Theme } from "../theme/theme";

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert("Required Fields", "Please populate both entry field options.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);

      // ✅ Step 2 FIXED: Redirects directly over to your active /feed viewport
      router.replace("/feed" as any);
    } catch (error) {
      console.log("Authentication transaction error:", error);
      Alert.alert("Login Failed", "Invalid credentials profile token match. Try again.");
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={[Theme.text, styles.title]}>🔐 Welcome Back</Text>
      <Text style={[Theme.muted, styles.subtitle]}>Sign in to access your KnowledgeVerse curriculum tracks.</Text>

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
        secureTextEntry={true}
        editable={!loading}
        style={styles.input}
      />

      <TouchableOpacity 
        disabled={loading} 
        onPress={handleLogin} 
        style={[styles.btn, { backgroundColor: Colors.primary || "#2563EB", opacity: loading ? 0.6 : 1 }]}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={[Theme.text, styles.btnText]}>Sign In</Text>}
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
  input: { backgroundColor: "#111827", color: "white", padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 16 },
  btn: { padding: 16, borderRadius: 12, alignItems: "center", marginTop: 10, minHeight: 52, justifyContent: "center" },
  btnText: { fontWeight: "bold", fontSize: 17 },
  linkGap: { marginTop: 20 },
  linkText: { color: "#2563EB", fontWeight: "600", textAlign: "center" }
});
