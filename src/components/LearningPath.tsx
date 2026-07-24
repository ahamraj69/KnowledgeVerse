import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { AISuggestion } from "@/lib/aiSuggestionService";

interface LearningPathProps {
  suggestions: AISuggestion[];
  onSelectNode: (subject: string) => void;
}

export default function LearningPath({ suggestions, onSelectNode }: LearningPathProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>⚡ Your Personalized Learning Path</Text>
      
      {suggestions.map((item, index) => {
        const priorityColor = 
          item.priority === "high" 
            ? "#EF4444" 
            : item.priority === "medium" 
              ? "#F59E0B" 
              : "#10B981";

        return (
          <TouchableOpacity 
            key={item.id || index.toString()} 
            style={[styles.nodeCard, { borderLeftColor: priorityColor }]}
            onPress={() => onSelectNode(item.suggestedSubject)}
            activeOpacity={0.8}
          >
            <View style={styles.metaRow}>
              <Text style={styles.nodeTitle}>{item.title || "Study Recommendation"}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}15`, borderColor: priorityColor }]}>
                {/* ✅ FIXED: Fallback operator prevents undefined string errors */}
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {(item.priority || "low").toUpperCase()} PRIORITY
                </Text>
              </View>
            </View>

            <Text style={styles.suggestionText}>{item.suggestionText}</Text>
            {item.reason ? <Text style={styles.reasonText}>🎯 Reason: {item.reason}</Text> : null}
            <Text style={styles.subjectTag}>📖 {item.suggestedSubject}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginVertical: 16, paddingHorizontal: 2 },
  nodeCard: { backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 14, borderLeftWidth: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 },
  nodeTitle: { color: "white", fontSize: 16, fontWeight: "bold", flex: 1, paddingRight: 8 },
  priorityBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1 },
  priorityText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
  suggestionText: { color: "#CBD5E1", fontSize: 14, lineHeight: 22 },
  reasonText: { color: "#9CA3AF", fontSize: 13, marginTop: 8, fontStyle: "italic" },
  subjectTag: { color: "#38BDF8", fontSize: 12, fontWeight: "700", marginTop: 12, textTransform: "uppercase", letterSpacing: 0.3 }
});
