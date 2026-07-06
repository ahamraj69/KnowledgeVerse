import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useLoading } from "../context/LoadingContext"; // ✅ Added loading context
import { auth } from "../lib/firebase";
import { createUserProfile } from "../services/userService";
import { Colors } from "../theme/colors"; // ✅ Added central color tokens
import { Theme } from "../theme/theme"; // ✅ Added centralized layout styles

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { setLoading } = useLoading(); // ✅ Hook injected locally

  // ✅ Optimized with useCallback to eliminate re-rendering performance bottlenecks
  const signup = useCallback(async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true); // 🚀 Turn on global screen-blocking blur loader overlay

      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await createUserProfile(
        credential.user.uid,
        name.trim(),
        credential.user.email ?? email.trim(),
        "student"
      );

      // Instantly clear background task screens and redirect straight to home route dashboard
      router.replace("/");
    } catch (e: any) {
      console.log("Signup error:", e);
      Alert.alert("Signup Failed", e.message ?? "Something went wrong.");
    } finally {
      setLoading(false); // 🛑 Turn off global screen-blocking loader overlay securely
    }
  }, [name, email, password, setLoading]);

  return (
    <View style={[Theme.screen, { justifyContent: "center", padding: 20 }]}>
      <Text style={[Theme.text, styles.title]}>📝 Sign Up</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor={Colors.textMuted} // ✅ Central token applied
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={Colors.textMuted} // ✅ Central token applied
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={Colors.textMuted} // ✅ Central token applied
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={signup}>
        <Text style={[Theme.text, styles.btnText]}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login toggle trigger using your exact inline styling layout definitions */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginTop: 20 }}
      >
        <Text
          style={{
            textAlign: "center",
            color: Colors.purple, // ✅ Theme color matched to login screen accent rules
            fontSize: 16,
          }}
        >
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: Colors.card, // ✅ Central token applied
    color: Colors.text, // ✅ Central token applied
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: Colors.primary, // ✅ Central token applied
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
