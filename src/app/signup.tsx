import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { auth, db } from "../lib/firebase";
import { Colors } from "../theme/colors";
import { Theme } from "../theme/theme";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanName.length < 2) {
      Alert.alert("Invalid Input", "Please enter a valid name (minimum 2 characters).");
      return;
    }

    if (!cleanEmail || cleanPassword.length < 6) {
      Alert.alert("Weak Credentials", "Passwords must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const secureUserRef = userCredential.user;

      await updateProfile(secureUserRef, { displayName: cleanName });

      // ✅ FIXED: Standardized target document record schema inline to support Profile views flawlessly
      await setDoc(doc(db, "users", secureUserRef.uid), {
        uid: secureUserRef.uid,
        name: cleanName,
        email: secureUserRef.email, 
        role: "student", 
        bio: "",
        photoURL: "",
        createdAt: Date.now(), 
      });

      Alert.alert("Success", "Account generated successfully! 🎉");
      router.replace("/" as any);
    } catch (error) {
      console.log("Account registration fault catches:", error);
      Alert.alert("Registration Failed", "Something went wrong while setting up your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={[Theme.text, styles.title]}>🚀 Create Account</Text>
      <Text style={[Theme.muted, styles.subtitle]}>Join KnowledgeVerse and upgrade your skill systems today.</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
        editable={!loading}
        style={styles.input}
      />

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
        onPress={handleSignup} 
        style={[styles.btn, { backgroundColor: Colors.success, opacity: loading ? 0.6 : 1 }]}
      >
        <Text style={[Theme.text, styles.btnText]}>{loading ? "Generating Profile..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={loading} onPress={() => router.push("/login" as any)} style={styles.linkGap}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
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
