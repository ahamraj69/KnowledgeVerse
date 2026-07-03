import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useLoading } from "../context/LoadingContext";
import { auth } from "../lib/firebase";
import { Colors } from "../theme/colors"; // ✅ Added Token Reference
import { Theme } from "../theme/theme"; // ✅ Added Macro Style Reference

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { setLoading } = useLoading();

  const loginUser = useCallback(async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
      return;
    }

    try {
      setLoading(true);
      
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      router.replace("/");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, setLoading]);

  return (
    <View style={[Theme.screen, { justifyContent: "center", padding: 20 }]}>
      <Text style={[Theme.text, styles.title]}>🔐 Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={Colors.textMuted} // ✅ Token applied
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={Colors.textMuted} // ✅ Token applied
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={loginUser}
      >
        <Text style={[Theme.text, styles.btnText]}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/signup")}
        style={{ marginTop: 20 }}
      >
        <Text
          style={{
            color: Colors.purple, // ✅ Token applied for a punchy anchor link layout matching modern guidelines
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Don't have an account? Sign Up
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
    backgroundColor: Colors.card, // ✅ Token applied
    color: Colors.text,           // ✅ Token applied
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: Colors.primary, // ✅ Token applied
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
