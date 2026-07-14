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

import { sendMessage } from "@/services/aiService";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export default function AIQuizScreen() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
 const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
const [selectedAnswers, setSelectedAnswers] = useState<{
  [key: number]: string;
}>({});
const [score, setScore] = useState<number | null>(null);

 const generateQuiz = async () => {
  if (!topic.trim()) return;

  try {
    setLoading(true);
    setQuiz([]);
    setSelectedAnswers({});
    setScore(null);

    const prompt = `
Generate exactly 5 multiple choice questions about "${topic}".

Return ONLY valid JSON.

Example:

[
  {
    "question":"What is React?",
    "options":[
      "Library",
      "Database",
      "OS",
      "Browser"
    ],
    "answer":"Library"
  }
]
`;

    const response = await sendMessage(prompt);

    try {
      const parsed: QuizQuestion[] = JSON.parse(response);
      setQuiz(parsed);
    } catch {
      console.log("Invalid AI JSON");
      setQuiz([]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const selectAnswer = (questionIndex: number, answer: string) => {
  if (score !== null) return;

  setSelectedAnswers((prev) => ({
    ...prev,
    [questionIndex]: answer,
  }));
};

const submitQuiz = () => {

  let total = 0;
 

  quiz.forEach((question, index) => {
    if (selectedAnswers[index] === question.answer) {
      total++;
    }
  });

  setScore(total);
};

const retryQuiz = () => {
  setSelectedAnswers({});
  setScore(null);
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>🧠 AI Quiz Generator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a topic..."
        placeholderTextColor="#9CA3AF"
        value={topic}
        onChangeText={setTopic}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={generateQuiz}
      >
        <Text style={styles.buttonText}>Generate Quiz</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#6366F1"
          style={{ marginTop: 20 }}
        />
      )}
{quiz.map((item, index) => (
  <View
    key={index}
    style={styles.card}
  >
    <Text style={styles.question}>
      {index + 1}. {item.question}
    </Text>

    {item.options.map((option) => {
      const selected = selectedAnswers[index] === option;

      const correct = option === item.answer;

      const wrong =
        score !== null &&
        selected &&
        !correct;

      return (
        <TouchableOpacity
          key={option}
          disabled={score !== null}
          onPress={() => selectAnswer(index, option)}
          style={[
            styles.option,
            selected &&
              score === null &&
              styles.selectedOption,
            score !== null &&
              correct &&
              styles.correctOption,
            wrong &&
              styles.wrongOption,
          ]}
        >
          <Text
            style={[
              styles.optionText,
              score !== null &&
                correct &&
                styles.correctOptionText,
              wrong &&
                styles.wrongOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      );
    })}
    {score !== null && (
  <Text style={styles.answerText}>
    ✅ Correct Answer: {item.answer}
  </Text>
)}
  </View>
))}
    {quiz.length > 0 && score === null && (
  <TouchableOpacity
    style={styles.submitButton}
    onPress={submitQuiz}
  >
    <Text style={styles.buttonText}>
      Submit Quiz
    </Text>
  </TouchableOpacity>
)}
    </ScrollView>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
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
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },

  button: {
    backgroundColor: "#6366F1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  card: {
    marginTop: 20,
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 12,
  },

  question: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },

  option: {
    paddingVertical: 8,
  },

  optionText: {
    color: "#D1D5DB",
    fontSize: 15,
  },
  
  selectedOption: {
  backgroundColor: "#4F46E5",
},

submitButton: {
  backgroundColor: "#16A34A",
  padding: 14,
  borderRadius: 10,
  alignItems: "center",
  marginVertical: 20,
},

scoreCard: {
  backgroundColor: "#111827",
  padding: 20,
  borderRadius: 14,
  marginTop: 20,
  alignItems: "center",
},

scoreTitle: {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
},

score: {
  color: "#10B981",
  fontSize: 30,
  fontWeight: "bold",
  marginVertical: 10,
},

retryButton: {
  backgroundColor: "#2563EB",
  padding: 14,
  borderRadius: 10,
  marginTop: 15,
  alignItems: "center",
},

correctOption: {
  backgroundColor: "#14532D",
  borderRadius: 8,
},

wrongOption: {
  backgroundColor: "#7F1D1D",
  borderRadius: 8,
},

correctOptionText: {
  color: "#BBF7D0",
  fontWeight: "bold",
},

wrongOptionText: {
  color: "#FECACA",
  fontWeight: "bold",
},
answerText: {
  color: "#22C55E",
  marginTop: 12,
  fontWeight: "bold",
  fontSize: 15,
},
});
