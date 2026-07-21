import { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useVerificationRequests } from "@/hooks/useVerificationRequests";
import VerificationCard from "@/components/verification/VerificationCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RejectedInstructorsScreen() {
  const { requests, loading, loadQueue } = useVerificationRequests();
  useEffect(() => { loadQueue("rejected"); }, [loadQueue]);

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>❌ Rejected Inquiries</Text>
        {loading ? <ActivityIndicator color="#38BDF8" /> : (
          <FlatList data={requests} keyExtractor={(item) => item.id} renderItem={({ item }) => <VerificationCard request={item} onView={() => {}} />} />
        )}
      </View>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({ wrapper: { flex: 1, backgroundColor: "#0B1220", padding: 20 }, title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 } });
