import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ✅ 3. Fixed import contract targeting type-safe models strictly
import {
  getStudents,
  Student,
} from "../../services/studentService";

export default function StudentsScreen() {
  // ✅ 4. Clean parameter signature alignment
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (e) {
      console.log("Error loading students:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
        <Text style={styles.loading}>
          Loading students...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        👨‍Grad Student Management
      </Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // ✅ 5. Infused structural telemetry text nodes into the card layout render view loop
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.email}>
              {item.email}
            </Text>

            <Text style={styles.info}>
              📚 Enrolled Courses: {item.enrolledCourses}
            </Text>

            <Text style={styles.info}>
              ✅ Completed Courses: {item.completedCourses}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1220",
  },
  loading: {
    color: "white",
    marginTop: 10,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    color: "#9CA3AF",
    marginTop: 5,
  },
  // ✅ 6. New Visual Styles Infused cleanly for sub-detail data rows
  info: {
    color: "#D1D5DB",
    marginTop: 6,
    fontSize: 14,
  },
});
