import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
      return;
    }

    try {
      // Step 2: Authenticate user session
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Step 2: Redirect to home route directly instead of showing a success alert
      router.replace("/");
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Login Failed",
        error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={loginUser}
      >
        <Text style={styles.btnText}>
          Login
        </Text>
      </TouchableOpacity>

      {/* Step 3: Add a Sign Up button with inline styles directly below the login button */}
      <TouchableOpacity
        onPress={() => router.push("/signup")}
        style={{ marginTop: 20 }}
      >
        <Text
          style={{
            color: "#60A5FA",
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
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1F2937",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
