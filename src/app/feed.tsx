import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { askAI } from "../lib/ai";
import { markLearned } from "../lib/progress";

const DATA = [
  {
    id: "1",
    teacherId: "t1",
    author: "Prof. Sharma",
    tag: "Physics",
    title: "Newton’s First Law",
    content: "Explain Newton’s First Law in simple words",
  },
  {
    id: "2",
    teacherId: "t2",
    author: "Dr. Mehta",
    tag: "Biology",
    title: "Cell Structure",
    content: "Explain cell structure simply",
  },
];

export default function Feed() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAskAI = async (item: any) => {
    try {
      setLoadingId(item.id);

      const res = await askAI(item.content);

      setAnswers((prev) => ({
        ...prev,
        [item.id]: res,
      }));
    } catch (err) {
      setAnswers((prev) => ({
        ...prev,
        [item.id]: "AI error occurred",
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 🤖 AI NAV BUTTON */}
      <Pressable
        style={styles.aiButton}
        onPress={() => router.push("/ai")}
      >
        <Text style={styles.aiText}>🤖 Open AI Tutor</Text>
      </Pressable>

      <Text style={styles.header}>🌌 Knowledge Feed</Text>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            
            <Text style={styles.tag}>{item.tag}</Text>

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.content}>{item.content}</Text>

            {/* 🧑‍🏫 TEACHER PROFILE */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/teacher/[id]",
                  params: { id: item.teacherId },
                })
              }
            >
              <Text style={styles.teacher}>
                — {item.author}
              </Text>
            </Pressable>

            {/* 📊 MARK LEARNED */}
            <Pressable
              style={styles.learnBtn}
              onPress={() => markLearned(item.title)}
            >
              <Text style={styles.learnText}>Mark as Learned</Text>
            </Pressable>

            {/* ❓ ASK AI */}
            <Pressable
              style={styles.askBtn}
              onPress={() => handleAskAI(item)}
            >
              <Text style={styles.askText}>
                {loadingId === item.id ? "Thinking..." : "Ask Question"}
              </Text>
            </Pressable>

            {/* 🤖 AI ANSWER */}
            {answers[item.id] ? (
              <View style={styles.answerBox}>
                <Text style={styles.answerText}>
                  🤖 {answers[item.id]}
                </Text>
              </View>
            ) : null}

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    padding: 16,
  },

  aiButton: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },

  aiText: {
    color: "#60A5FA",
    fontWeight: "700",
  },

  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  tag: {
    color: "#60A5FA",
    fontSize: 12,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 5,
  },

  content: {
    color: "#9CA3AF",
    marginTop: 5,
  },

  teacher: {
    color: "#6B7280",
    marginTop: 10,
  },

  learnBtn: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  learnText: {
    color: "#fff",
    fontWeight: "700",
  },

  askBtn: {
    marginTop: 8,
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  askText: {
    color: "#fff",
    fontWeight: "700",
  },

  answerBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#0F172A",
    borderRadius: 10,
  },

  answerText: {
    color: "#fff",
  },
});