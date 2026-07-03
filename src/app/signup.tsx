import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { auth } from "../lib/firebase";
import { createUserProfile } from "../services/userService";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
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

      // Step 4: Instantly redirect to home dashboard instead of triggering a success Alert
      router.replace("/");
    } catch (e: any) {
      console.log("Signup error:", e);
      Alert.alert("Signup Failed", e.message ?? "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Sign Up</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={signup}>
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Step 5: Login toggle trigger using your exact inline styling layout definitions */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginTop: 20 }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#2563EB",
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
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
