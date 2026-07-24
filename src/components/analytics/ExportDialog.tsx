import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface ExportDialogProps {
  onTrigger: (format: "CSV" | "PDF") => void;
}

export default function ExportDialog({ onTrigger }: ExportDialogProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>📤 SECURE ADMINISTRATIVE TELEMETRY DATA EXPORT</Text>
      <Text style={styles.sub}>Compile and packaging learning metrics logs into standalone documents files parameters.</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={() => onTrigger("CSV")} activeOpacity={0.8}>
          <Text style={styles.btnText}>Export Spreadsheet (.CSV)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.pdfBtn]} onPress={() => onTrigger("PDF")} activeOpacity={0.8}>
          <Text style={styles.btnText}>Export Document Brief (.PDF)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginBottom: 16 },
  title: { color: "white", fontSize: 13, fontWeight: "bold" },
  sub: { color: "#6B7280", fontSize: 12, marginTop: 4, marginBottom: 14, lineHeight: 18 },
  btnRow: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, backgroundColor: "#1F2937", paddingVertical: 10, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  pdfBtn: { backgroundColor: "#2563EB", borderColor: "#3B82F6" },
  btnText: { color: "white", fontSize: 13, fontWeight: "bold" }
});
