import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { FallbackProps } from "react-error-boundary";
import { BrandColors } from "@/theme/colors";
import { Typography } from "@/theme/theme";

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // ✅ FIXED: Safely cast the error object parameter to structural Error layout constraints [INDEX]
  const errorInstance = error as Error;

  return (
    <SafeAreaView style={styles.viewport}>
      <View style={styles.centerContainer}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={[Typography.heading, styles.title]}>Unable to load this content.</Text>
        <Text style={[Typography.body, styles.subtitle]}>
          An unexpected interface exception occurred. Please try again later.
        </Text>
        
        <View style={styles.errorLogBox}>
          <Text style={styles.errorLogText} numberOfLines={3}>
            {/* ✅ FIXED: Accessing the message property through the explicitly typed instance variable [INDEX] */}
            {errorInstance?.message || "Unknown rendering runtime stack mutation break."}
          </Text>
        </View>

        <TouchableOpacity style={styles.retryBtn} onPress={resetErrorBoundary} activeOpacity={0.85}>
          <Text style={styles.retryBtnText}>Reload Component View</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewport: { flex: 1, backgroundColor: BrandColors.backgroundDark },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  icon: { fontSize: 54, marginBottom: 16 },
  title: { color: "white", textAlign: "center", marginBottom: 8 },
  subtitle: { color: BrandColors.textMutedDark, textAlign: "center", marginBottom: 24, lineHeight: 20 },
  errorLogBox: { backgroundColor: "#111827", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", width: "100%", marginBottom: 24 },
  errorLogText: { color: "#EF4444", fontSize: 11, fontFamily: "monospace", textAlign: "center" },
  retryBtn: { backgroundColor: BrandColors.primary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  retryBtnText: { color: "white", fontWeight: "bold", fontSize: 15 }
});
