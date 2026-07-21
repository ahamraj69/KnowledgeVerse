import { StyleSheet, Text, View } from "react-native";

interface TeacherData {
  name: string;
  bio: string;
}

interface TeacherMiniCardProps {
  teacher?: TeacherData;
}

export default function TeacherMiniCard({ teacher }: TeacherMiniCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        👨‍🏫 {teacher?.name || "Verified Educator"}
      </Text>
      <Text style={styles.bio}>
        {teacher?.bio || "Expert instructor specializing in curriculum learning systems."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#111827",
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  bio: {
    color: "#9CA3AF",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
});
