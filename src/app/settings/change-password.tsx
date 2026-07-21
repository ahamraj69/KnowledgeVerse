import { updateUserPassword } from "@/lib/user/settingsService";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleCommitChange = useCallback(async () => {
    if (password.length < 6) {
      Alert.alert("Validation Defect", "Secure password matrix length must be at least 6 tokens long.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Mismatch", "Password parameter confirmation entries do not align.");
      return;
    }
    try {
      setUpdating(true);
      await updateUserPassword(password);
      Alert.alert("Success 🎉", "Security credentials modified successfully.");
      router.back();
    } catch (e) {
      Alert.alert("Process Blocked", "This operation requires active credentials context. Log out and sign in again.");
    } finally {
      setUpdating(false);
    }
  }, [password, confirm, router]);

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.title}>Update Password</Text>
      <TextInput secureTextEntry placeholder="Input New Password" placeholderTextColor="#4B5563" style={styles.input} value={password} onChangeText={setPassword} />
      <TextInput secureTextEntry placeholder="Confirm New Password" placeholderTextColor="#4B5563" style={styles.input} value={confirm} onChangeText={setConfirm} />
      <TouchableOpacity style={[styles.btn, updating && styles.dis]} onPress={handleCommitChange} disabled={updating}>
        {updating ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Apply New Credentials</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 24, justifyContent: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  input: { backgroundColor: "#111827", padding: 14, borderRadius: 10, color: "white", marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  btn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 10, alignItems: "center", justifyContent: "center", minHeight: 50 },
  dis: { opacity: 0.6 },
  btnText: { color: "white", fontWeight: "bold", fontSize: 15 }
});
