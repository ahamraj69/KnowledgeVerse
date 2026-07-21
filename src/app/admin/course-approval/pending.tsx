import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CourseApprovalCard from "@/components/courseApproval/CourseApprovalCard";
import { getCoursesByStatus } from "@/lib/courses/courseReviewService";
import { Course } from "@/types/course";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function PendingApprovalsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCoursesByStatus("pending");
      setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.box}>
        <Text style={styles.heading}>⏳ Pending Evaluation Queue</Text>
        {loading ? <ActivityIndicator color="#38BDF8" style={styles.load} /> : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CourseApprovalCard course={item} onView={() => router.push(`/admin/course-approval/${item.id}` as any)} />
            )}
            ListEmptyComponent={<Text style={styles.empty}>No courses pending review inside this database track block.</Text>}
          />
        )}
      </View>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({ box: { flex: 1, backgroundColor: "#0B1220", padding: 20 }, heading: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 }, load: { marginTop: 40 }, empty: { color: "#6B7280", fontSize: 14, textAlign: "center", marginTop: 40 } });
