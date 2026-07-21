import { QuizPayload } from "@/lib/quizAIService";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuizCard({ quiz, onStart }: { quiz: QuizPayload; onStart: () => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>📝 AI QUIZ ASSESSMENT</Text>
      <Text style={styles.meta}>Subject Focus: {quiz.subject} • {quiz.difficulty}</Text>
      <Text style={styles.text}>This assessment contains {quiz.questions.length} target questions. Estimated window is {quiz.durationMinutes} minutes.</Text>
      <TouchableOpacity style={styles.btn} onPress={onStart} activeOpacity={0.85}>
        <Text style={styles.btnText}>Launch Assessment Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ✅ FIXED: Replaced invalid border width shortcuts with standard cross-platform properties
  card: { 
    backgroundColor: "#111827", 
    padding: 18, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: "rgba(56,189,248,0.25)", 
    marginVertical: 10 
  },
  title: { color: "white", fontSize: 16, fontWeight: "bold" },
  meta: { color: "#38BDF8", fontSize: 12, marginTop: 4, fontWeight: "600", textTransform: "uppercase" },
  text: { color: "#9CA3AF", fontSize: 14, marginTop: 10, lineHeight: 20 },
  btn: { backgroundColor: "#2563EB", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 16 },
  btnText: { color: "white", fontSize: 14, fontWeight: "bold" }
});
