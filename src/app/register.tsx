import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] =
    useState<"student" | "teacher">("student");

  const registerUser = async () => {
    if (!email || !password) {
      Alert.alert(
        "Error",
        "Enter email and password"
      );
      return;
    }

    try {
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      await setDoc(
        doc(db, "users", result.user.uid),
        {
          email: email.trim(),
          role,
          createdAt: new Date(),
        }
      );

      Alert.alert(
        "Success",
        "Account created successfully!"
      );
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Registration Failed",
        error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        📝 Register
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={styles.roleRow}>
        <TouchableOpacity
          onPress={() =>
            setRole("student")
          }
          style={[
            styles.roleBtn,
            role === "student" &&
              styles.active,
          ]}
        >
          <Text style={styles.roleText}>
            👨‍🎓 Student
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setRole("teacher")
          }
          style={[
            styles.roleBtn,
            role === "teacher" &&
              styles.active,
          ]}
        >
          <Text style={styles.roleText}>
            👨‍🏫 Teacher
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={registerUser}
      >
        <Text style={styles.btnText}>
          Create Account
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

  roleRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  roleBtn: {
    flex: 1,
    backgroundColor: "#1F2937",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },

  active: {
    backgroundColor: "#2563EB",
  },

  roleText: {
    color: "white",
    fontWeight: "bold",
  },

  btn: {
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});