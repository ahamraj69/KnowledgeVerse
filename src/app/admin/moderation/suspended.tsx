import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { fetchAllActionsByType } from "@/lib/warningService";
import ModerationHistoryCard from "@/components/moderation/ModerationHistoryCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SuspendedListScreen() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetchAllActionsByType("suspension").then(setItems); }, []);
  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.box}><Text style={styles.h}>🚫 Suspended User Profiles</Text>
        <FlatList data={items} keyExtractor={(i)=>i.id} renderItem={({item})=><ModerationHistoryCard record={item}/>} />
      </View>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({ box: { flex: 1, backgroundColor: "#0B1220", padding: 20 }, h: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 20 } });
