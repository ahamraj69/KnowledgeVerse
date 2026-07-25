import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { executeCompleteAccountDataPurge } from "@/lib/privacy/accountDeletionService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { BrandColors } from "@/theme/colors";
import { Typography } from "@/theme/theme";

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1);

  const handlePermanentAccountDestruction = async () => {
    if (!passwordInput.trim()) {
      Alert.alert("Verification Error", "Please provide your password string to authorize this operation.");
      return;
    }

    try {
      setLoading(true);
      const result = await executeCompleteAccountDataPurge();
      if (result.success) {
        Alert.alert("Account Terminated", "Your profile data has been permanently removed.");
        router.replace("/login" as any);
      } else {
        Alert.alert("Deletion Blocked", result.message);
      }
    } catch (e) {
      Alert.alert("Error", "Could not complete account destruction routine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allow={["student", "teacher", "admin"]}>
      <View style={styles.viewportWrapper}>
        <View style={styles.container}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={[Typography.heading, styles.title]}>Permanent Account Deletion</Text>
          
          <Text style={[Typography.body, styles.warningText]}>
            This action is permanent [INDEX]. All learning progress, published courses, quiz histories, earned badges, and custom AI chat parameters will be scrubbed from platform registers [INDEX].
          </Text>

          {confirmationStep === 1 ? (
            <TouchableOpacity style={styles.dangerButton} onPress={() => setConfirmationStep(2)} activeOpacity={0.85}>
              <Text style={styles.btnText}>I Understand, Proceed</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Confirm password to authorize data purge..."
                placeholderTextColor="#4B5563"
                secureTextEntry
                value={passwordInput}
                onChangeText={setPasswordInput}
              />
              
              <TouchableOpacity style={[styles.dangerButton, styles.finalButton]} onPress={handlePermanentAccountDestruction} disabled={loading} activeOpacity={0.85}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>PURGE MY ACCOUNT PERMANENTLY</Text>}
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} disabled={loading}>
            <Text style={styles.cancelText}>Cancel and Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  warningIcon: { fontSize: 54, marginBottom: 14 },
  title: { color: "white", textAlign: "center", marginBottom: 12 },
  warningText: { color: "#EF4444", textAlign: "center", lineHeight: 22, backgroundColor: "rgba(239,68,68,0.05)", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(239,68,68,0.25)", marginBottom: 24 },
  formContainer: { width: "100%", gap: 12 },
  inputField: { backgroundColor: "#111827", padding: 14, borderRadius: 12, color: "white", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 14 },
  dangerButton: { backgroundColor: "#EF4444", paddingVertical: 14, width: "100%", borderRadius: 12, alignItems: "center", justifyContent: "center", minHeight: 52 },
  finalButton: { backgroundColor: "#B91C1C" },
  btnText: { color: "white", fontSize: 14, fontWeight: "bold", letterSpacing: 0.3 },
  cancelBtn: { marginTop: 16, padding: 12 },
  cancelText: { color: "#9CA3AF", fontSize: 14, fontWeight: "600" }
});
