import { Pressable, StyleSheet, Text } from "react-native";
import { Lesson } from "../types/lesson";

interface LessonCardProps {
  lesson: Lesson;
  onPress: () => void;
}

export default function LessonCard({ lesson, onPress }: LessonCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.cardTitle}>{lesson.title}</Text>
      <Text style={styles.cardText}>{lesson.duration}</Text>
      <Text style={styles.category}>{lesson.type.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  cardTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  cardText: {
    color: "#9CA3AF",
    marginTop: 8,
    fontSize: 14,
  },
  category: {
    color: "#38BDF8",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
});
