import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getReportsByStatus } from "@/lib/moderationService";
import ModerationCard from "@/components/reports/ModerationCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ResolvedIncidentsScreen() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { getReportsByStatus("resolved").then(setItems); }, []);

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.box}><Text style={styles.heading}>✅ Resolved Incident Logs</Text>
        <FlatList data={items} keyExtractor={(i)=>i.id} renderItem={({item})=><ModerationCard report={item} onView={()=>{}}/>} />
      </View>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({ box: { flex: 1, backgroundColor: "#0B1220", padding: 20 }, heading: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 } });
