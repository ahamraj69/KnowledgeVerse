import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// ✅ FIXED: Re-routed imports onto standard, verified lib structures to eliminate broken relative string references
import { getCourse, updateCourse } from "@/lib/courseService";
import { Theme } from "@/theme/theme";
import { Course } from "@/types/course";

export default function EditCourseScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function loadCourseData() {
      if (!id) return;
      const data = await getCourse(String(id));
      if (data) {
        setCourse(data);
        setTitle(data.title);
      }
      setLoading(false);
    }
    loadCourseData();
  }, [id]);

  const handleUpdate = async () => {
    if (!id || !title.trim()) return;
    try {
      await updateCourse(String(id), { title: title.trim() });
      Alert.alert("Success", "Course information updated cleanly.");
      router.back();
    } catch (e) {
      Alert.alert("Update Error", "Could not complete modifications.");
    }
  };

  if (loading) return <View style={[Theme.screen, styles.center]}><ActivityIndicator color="#38BDF8" /></View>;

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.headerTitle}>Modify Course Profile</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Course Title" placeholderTextColor="#6B7280" />
      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 24, justifyContent: "center" },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { backgroundColor: "#111827", padding: 14, borderRadius: 10, color: "white", marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  btn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 10, alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B1220" }
});
