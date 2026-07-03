import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "../context/AuthContext";

import {
    getQuizByLesson,
    Quiz,
} from "../services/quizService";

interface Props {
  lessonId: string;
  onStart: (lessonId: string) => void;
}

export default function QuizCard({
  lessonId,
  onStart,
}: Props) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(
    null
  );

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);

      const data = await getQuizByLesson(lessonId);

      setQuiz(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator color="#A855F7" />
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: "#1F2937",
        padding: 18,
        borderRadius: 16,
        marginVertical: 10,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        🧠 Quiz Available
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 6,
        }}
      >
        {quiz.questions.length} Questions
      </Text>

      <TouchableOpacity
        onPress={() => onStart(lessonId)}
        style={{
          backgroundColor: "#A855F7",
          paddingVertical: 12,
          borderRadius: 10,
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          ▶ Start Quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
}