import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CourseApprovalCard from "@/components/courseApproval/CourseApprovalCard";
import { getCoursesByStatus } from "@/lib/courses/courseReviewService";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function RejectedCatalogScreen() {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCoursesByStatus("rejected");
      setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.box}>
        <Text style={styles.heading}>🔴 Rejected Course Inquiries</Text>
        {loading ? <ActivityIndicator color="#38BDF8" style={styles.load} /> : (
          <FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => <CourseApprovalCard course={item} onView={() => {}} />} />
        )}
      </View>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({ box: { flex: 1, backgroundColor: "#0B1220", padding: 20 }, heading: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 }, load: { marginTop: 40 } });
