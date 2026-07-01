import { useContext, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen() {
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");

  const registerUser = async () => {
    if (!auth) return;

    try {
      await auth.register(email, password, role);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
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
          onPress={() => setRole("student")}
          style={[
            styles.roleBtn,
            role === "student" && styles.active,
          ]}
        >
          <Text style={{ color: "#fff" }}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setRole("teacher")}
          style={[
            styles.roleBtn,
            role === "teacher" && styles.active,
          ]}
        >
          <Text style={{ color: "#fff" }}>Teacher</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn} onPress={registerUser}>
        <Text style={{ color: "#fff" }}>Create Account</Text>
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
    fontSize: 28,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1F2937",
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    color: "#fff",
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  roleBtn: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#1F2937",
    alignItems: "center",
    borderRadius: 10,
  },
  active: {
    backgroundColor: "#2563EB",
  },
  btn: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});