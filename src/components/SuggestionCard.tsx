import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { AISuggestion } from "@/lib/aiSuggestionService";

interface SuggestionCardProps {
  suggestion: AISuggestion;
  onActionPress?: () => void;
}

export default function SuggestionCard({ suggestion, onActionPress }: SuggestionCardProps) {
  const priorityColor = 
    suggestion.priority === "high" 
      ? "#EF4444" 
      : suggestion.priority === "medium" 
        ? "#F59E0B" 
        : "#10B981";

  return (
    <View style={[styles.card, { borderColor: `${priorityColor}30` }]}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 {suggestion.title || "AI Tutor Insight"}</Text>
        <View style={[styles.badge, { backgroundColor: `${priorityColor}15`, borderColor: priorityColor }]}>
          {/* ✅ FIXED: Safely invokes toUpperCase with inline fallback strings checks */}
          <Text style={[styles.badgeText, { color: priorityColor }]}>
            {(suggestion.priority || "low").toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.body}>{suggestion.suggestionText}</Text>
      
      {suggestion.reason ? (
        <Text style={styles.reason}>Focus Target: {suggestion.reason}</Text>
      ) : null}

      <View style={styles.footerRow}>
        <Text style={styles.subjectText}>Subject: {suggestion.suggestedSubject}</Text>
        {onActionPress && (
          <TouchableOpacity style={styles.actionBtn} onPress={onActionPress} activeOpacity={0.75}>
            <Text style={styles.actionText}>Launch Hub</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { color: "white", fontSize: 15, fontWeight: "bold", flex: 1, paddingRight: 6 },
  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.3 },
  body: { color: "#CBD5E1", fontSize: 14, lineHeight: 22 },
  reason: { color: "#9CA3AF", fontSize: 13, marginTop: 8, fontStyle: "italic" },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.02)" },
  subjectText: { color: "#38BDF8", fontSize: 12, fontWeight: "600" },
  actionBtn: { backgroundColor: "#2563EB", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  actionText: { color: "white", fontSize: 12, fontWeight: "bold" }
});
