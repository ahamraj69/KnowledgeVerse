import { useState, useMemo } from "react";
import { StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useTeacherCourseStatus } from "@/hooks/useTeacherCourseStatus";
import TeacherCourseStatusCard from "@/components/courseApproval/TeacherCourseStatusCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Theme } from "@/theme/theme";

export default function TeacherCourseStatusPortalScreen() {
  const router = useRouter();
  const { courses, loading, refresh } = useTeacherCourseStatus();
  const [search, setSearch] = useState("");

  // ✅ Step 12: Calculate Dashboard Analytics Widgets Summary Counters
  const summary = useMemo(() => {
    return {
      pending: courses.filter(c => c.status === "pending").length,
      approved: courses.filter(c => c.status === "approved").length,
      rejected: courses.filter(c => c.status === "rejected").length,
      drafts: courses.filter(c => c.status === "draft").length
    };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  }, [courses, search]);

  if (loading && courses.length === 0) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  return (
    <ProtectedRoute allow={["teacher", "admin"]}>
      <View style={styles.viewportWrapper}>
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listScroll}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#38BDF8" />}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Program Tracking Portal</Text>
              <Text style={styles.sub}>Monitor the operational validation and publication stages of your curriculum assets.</Text>

              {/* ✅ Step 12 Summary Metrics Top Widgets Row Row */}
              <View style={styles.statsRow}>
                <View style={[styles.statsCard, styles.pendingBorder]}><Text style={styles.val}>{summary.pending}</Text><Text style={styles.lbl}>Pending</Text></View>
                <View style={[styles.statsCard, styles.approvedBorder]}><Text style={styles.val}>{summary.approved}</Text><Text style={styles.lbl}>Live</Text></View>
                <View style={[styles.statsCard, styles.rejectedBorder]}><Text style={styles.val}>{summary.rejected}</Text><Text style={styles.lbl}>Revisions</Text></View>
                <View style={[styles.statsCard, styles.draftBorder]}><Text style={styles.val}>{summary.drafts}</Text><Text style={styles.lbl}>Drafts</Text></View>
              </View>

              {/* ✅ Step 13 Search Bar */}
              <TextInput style={styles.searchBar} placeholder="Search course tracks by title..." placeholderTextColor="#4B5563" value={search} onChangeText={setSearch} />
              
              <Text style={styles.sectionHeading}>Your Academic Courses ({filteredCourses.length})</Text>
            </>
          }
          renderItem={({ item }) => (
            <TeacherCourseStatusCard course={item} onPress={() => router.push(`/teacher/course-status/${item.id}` as any)} />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No matching curriculum tracks discovered.</Text>}
        />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  listScroll: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  sub: { color: "#9CA3AF", fontSize: 13, marginTop: 4, marginBottom: 20 },
  
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  statsCard: { flex: 1, backgroundColor: "#111827", padding: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  pendingBorder: { borderBottomWidth: 3, borderBottomColor: "#F59E0B" },
  approvedBorder: { borderBottomWidth: 3, borderBottomColor: "#10B981" },
  rejectedBorder: { borderBottomWidth: 3, borderBottomColor: "#EF4444" },
  draftBorder: { borderBottomWidth: 3, borderBottomColor: "#9CA3AF" },
  val: { color: "white", fontSize: 18, fontWeight: "bold" },
  lbl: { color: "#6B7280", fontSize: 10, fontWeight: "700", textTransform: "uppercase", marginTop: 2 },
  
  searchBar: { backgroundColor: "#111827", padding: 12, borderRadius: 10, color: "white", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 14, marginBottom: 18 },
  sectionHeading: { color: "white", fontSize: 14, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  emptyText: { color: "#6B7280", fontSize: 14, textAlign: "center", marginTop: 24 }
});
