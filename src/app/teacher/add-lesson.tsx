import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// ✅ FIXED: Imported the correct standardized function from the lib lesson layer
import { addLesson } from "@/lib/lessonService";
import { Theme } from "@/theme/theme";

export default function AddLessonScreen() {
  const { courseId } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handlePublish = async () => {
    if (!title.trim() || !courseId) return;
    try {
      // ✅ FIXED: Invoking standard addLesson service layout parameter
      await addLesson(String(courseId), {
        courseId: String(courseId),
        title: title.trim(),
        description: desc.trim(),
        type: "text",
        content: "New lecture materials updated.",
        duration: "10 Mins",
        order: 1,
        createdAt: Date.now()
      });
      Alert.alert("Success 🎉", "Lesson module appended cleanly.");
      router.back();
    } catch (e) {
      Alert.alert("Error", "Could not commit lesson tracking parameters.");
    }
  };

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.title}>Publish New Lesson</Text>
      <TextInput placeholder="Input Lesson Title" placeholderTextColor="#6B7280" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Input Description" placeholderTextColor="#6B7280" style={styles.input} value={desc} onChangeText={setDesc} />
      <TouchableOpacity style={styles.btn} onPress={handlePublish}>
        <Text style={styles.btnText}>Commit Lesson Node</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 24, justifyContent: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { backgroundColor: "#111827", padding: 14, borderRadius: 10, color: "white", marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  btn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 10, alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold" }
});
