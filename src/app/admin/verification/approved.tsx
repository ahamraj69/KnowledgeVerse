import ProtectedRoute from "@/components/auth/ProtectedRoute";
import VerificationCard from "@/components/verification/VerificationCard";
import { useVerificationRequests } from "@/hooks/useVerificationRequests";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function ApprovedInstructorsScreen() {
  const { requests, loading, loadQueue } = useVerificationRequests();
  useEffect(() => { loadQueue("approved"); }, [loadQueue]);

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>✅ Approved Instructors</Text>
        {loading ? <ActivityIndicator color="#38BDF8" /> : (
          <FlatList data={requests} keyExtractor={(item) => item.id} renderItem={({ item }) => <VerificationCard request={item} onView={() => {}} />} />
        )}
      </View>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({ wrapper: { flex: 1, backgroundColor: "#0B1220", padding: 20 }, title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 } });
