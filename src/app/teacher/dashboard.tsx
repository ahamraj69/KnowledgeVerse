import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#0B1220" }}>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
        🎓 Teacher Dashboard
      </Text>

      <Text style={{ color: "#9CA3AF", marginTop: 10 }}>
        Welcome {user?.email}
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>+ Create Course</Text>
      </TouchableOpacity>
    </View>
  );
}