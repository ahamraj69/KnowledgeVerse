import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { CourseServiceType, getCourses } from "@/lib/courseListService";
import { Theme } from "../../theme/theme";

export default function TeacherStudioScreen() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadDashboard = async () => {
        try {
          setLoading(true);
          const data = await getCourses();
          setCourses(data);
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
        }
      };

      loadDashboard();
    }, [])
  );

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.content}>
      <Text style={[Theme.text, styles.title]}>👨‍🏫 Teacher Studio</Text>
      <Text style={Theme.text}>Total Managed Curriculums: {courses.length}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 }
});
