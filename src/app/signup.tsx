import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

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
        email,
        password
      );

      await createUserProfile(
        credential.user.uid,
        name,
        credential.user.email ?? email,
        "student"
      );

      Alert.alert("Success", "Account created successfully!");
    } catch (e: any) {
      console.log("Signup error:", e);
      Alert.alert("Signup Failed", e.message ?? "Something went wrong.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      <Button title="Sign Up" onPress={signup} />
    </View>
  );
}