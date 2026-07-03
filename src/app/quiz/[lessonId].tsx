import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import QuestionCard from "../../components/QuestionCard";
import {
  calculateScore,
  getQuizByLesson,
  Quiz,
} from "../../services/quizService";

export default function QuizScreen() {
  const { lessonId } = useLocalSearchParams();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);

      const data = await getQuizByLesson(
        lessonId as string
      );

      setQuiz(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!quiz) return;

    const newAnswers = [...answers, isCorrect ? 1 : 0];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < quiz.questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    }, 800);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#A855F7" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Loading Quiz...
        </Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>
          No quiz available
        </Text>
      </View>
    );
  }

  if (finished) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            color: "white",
            fontWeight: "bold",
          }}
        >
          🎉 Quiz Completed
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 10,
            fontSize: 18,
          }}
        >
          Your Score
        </Text>

        <Text
          style={{
            fontSize: 40,
            color: "#A855F7",
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          {score} / {quiz.questions.length}
        </Text>

        <Text
          style={{
            color: "white",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Great job! Keep learning 🚀
        </Text>
      </View>
    );
  }

  const question = quiz.questions[currentIndex];
  return (
  <View
    style={{
      flex: 1,
      backgroundColor: "#0B1220",
      padding: 20,
    }}
  >
    {/* Header */}
    <Text
      style={{
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
      }}
    >
      🧠 Quiz
    </Text>

    {/* Progress */}
    <Text
      style={{
        color: "#9CA3AF",
        marginBottom: 20,
      }}
    >
      Question {currentIndex + 1} /{" "}
      {quiz.questions.length}
    </Text>

    {/* Question */}
    <QuestionCard
      question={question}
      index={currentIndex}
      onSelect={handleAnswer}
    />

    {/* Score (live) */}
    <View
      style={{
        marginTop: 20,
        padding: 15,
        backgroundColor: "#1F2937",
        borderRadius: 12,
      }}
    >
      <Text style={{ color: "white" }}>
        Score: {score}
      </Text>
    </View>
  </View>
);