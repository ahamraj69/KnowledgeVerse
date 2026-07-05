import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { sendMessage } from "../../services/aiService";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

// ✅ Part 5: Add a Quiz History data structure definition
interface QuizHistory {
  topic: string;
  score: number;
  total: number;
  completedAt: string;
}

export default function AIQuizScreen() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [score, setScore] = useState<number | null>(null);

  // ✅ Part 5: Add quiz history state hook tracker
  const [history, setHistory] = useState<QuizHistory[]>([]);

  const generateQuiz = async () => {
    if (!topic.trim()) return;

    try {
      setLoading(true);
      setQuiz([]); 
      setSelectedAnswers({});
      setScore(null);

      const prompt = `
Generate exactly 5 multiple-choice questions about:

${topic}

Return ONLY valid JSON.

Example:

[
  {
    "question":"...",
    "options":[
      "A",
      "B",
      "C",
      "D"
    ],
    "answer":"A"
  }
]
`;

      const result = await sendMessage(prompt);

      try {
        const parsed = JSON.parse(result);
        setQuiz(parsed);
      } catch {
        console.log("Invalid AI JSON payload parsing target mismatch");
        setQuiz([]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionIndex: number, answer: string) => {
    // Freeze choosing state cycles if quiz has already been evaluated
    if (score !== null) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  // ✅ Part 5: Updated score calculations with structured history ledger trace
  const calculateScore = () => {
    let total = 0;

    quiz.forEach((item, index) => {
      if (selectedAnswers[index] === item.answer) {
        total++;
      }
    });

    setScore(total);

    // Save current session metrics block seamlessly to profile array history
    setHistory((prev) => [
      {
        topic: topic.trim(),
        score: total,
        total: quiz.length,
        completedAt: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  // ✅ Part 4: Add local instant state retry function logic
  const retryQuiz = () => {
    setSelectedAnswers({});
    setScore(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>📝 AI Quiz Generator</Text>

      <TextInput
        placeholder="Enter lesson topic..."
        placeholderTextColor="#9CA3AF"
        value={topic}
        onChangeText={setTopic}
        style={styles.input}
      />

      <TouchableOpacity 
        style={[styles.button, { opacity: loading ? 0.7 : 1 }]} 
        onPress={generateQuiz}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Generate Quiz</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#8B5CF6"
          style={{ marginTop: 25 }}
        />
      )}

      {/* Main assessment presentation layer mappings */}
      {quiz.map((item, index) => (
        <View key={index} style={styles.resultCard}>
          <Text style={styles.question}>
            {index + 1}. {item.question}
          </Text>

          {/* ✅ Part 4: Color-coded feedback highlights overlay configuration maps */}
          {item.options.map((option, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => selectAnswer(index, option)}
              style={[
                styles.optionButton,
                selectedAnswers[index] === option && styles.selectedOption,
                score !== null && option === item.answer && styles.correctOption,
                score !== null && selectedAnswers[index] === option && option !== item.answer && styles.wrongOption,
              ]}
              disabled={score !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          {/* ✅ Part 4: Inline descriptive validation key text block labels */}
          {score !== null && (
            <Text style={styles.answerText}>
              ✅ Correct Answer: {item.answer}
            </Text>
          )}
        </View>
      ))}

      {/* Quiz Submission Action Trigger */}
      {quiz.length > 0 && score === null && (
        <TouchableOpacity style={styles.submitButton} onPress={calculateScore}>
          <Text style={styles.buttonText}>Submit Quiz</Text>
        </TouchableOpacity>
      )}

      {/* Metrics Score Dashboard Container */}
      {score !== null && (
        <View style={styles.scoreCard}>
          <Text style={styles.scoreText}>
            Your Score: {score} / {quiz.length}
          </Text>
        </View>
      )}

      {/* ✅ Part 4: Context Reset Functional Retry Action Trigger Button */}
      {score !== null && (
        <TouchableOpacity style={styles.retryButton} onPress={retryQuiz}>
          <Text style={styles.buttonText}>🔄 Retry Quiz</Text>
        </TouchableOpacity>
      )}

      {/* ✅ Part 5: History Attempt Multi-Card Selection Feed Builder Component */}
      {history.length > 0 && (
        <>
          <Text style={styles.historyTitle}>📚 Quiz History</Text>

          {history.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <Text style={styles.historyTopic}>{item.topic}</Text>
              <Text style={styles.historyScore}>
                Score: {item.score}/{item.total}
              </Text>
              <Text style={styles.historyDate}>{item.completedAt}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#111827",
    color: "white",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  resultCard: {
    backgroundColor: "#111827",
    marginTop: 25,
    padding: 18,
    borderRadius: 12,
  },
  question: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#2563EB",
  },
  optionText: {
    color: "white",
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  scoreCard: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  scoreText: {
    color: "#FACC15",
    fontSize: 22,
    fontWeight: "bold",
  },
  // ✅ Parts 4 & 5 Infused Layout Styling Tokens
  correctOption: {
    backgroundColor: "#16A34A",
  },
  wrongOption: {
    backgroundColor: "#DC2626",
  },
  answerText: {
    color: "#FACC15",
    marginTop: 10,
    fontWeight: "bold",
  },
  retryButton: {
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  historyTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  historyTopic: {
    color: "#60A5FA",
    fontWeight: "bold",
    fontSize: 17,
  },
  historyScore: {
    color: "#FACC15",
    marginTop: 6,
    fontSize: 16,
  },
  historyDate: {
    color: "#9CA3AF",
    marginTop: 6,
    fontSize: 13,
  },
});
