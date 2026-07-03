import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  studentName: string;
  courseName: string;
  completedDate: string;
  onPress: () => void;
}

export default function CertificateCard({
  studentName,
  courseName,
  completedDate,
  onPress,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#1E3A8A",
        borderRadius: 18,
        padding: 20,
        marginVertical: 15,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        🏆 Course Certificate
      </Text>

      <Text
        style={{
          color: "#E5E7EB",
          marginTop: 20,
        }}
      >
        Student
      </Text>

      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {studentName}
      </Text>

      <Text
        style={{
          color: "#E5E7EB",
          marginTop: 15,
        }}
      >
        Course
      </Text>

      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {courseName}
      </Text>

      <Text
        style={{
          color: "#E5E7EB",
          marginTop: 15,
        }}
      >
        Completed
      </Text>

      <Text
        style={{
          color: "white",
          fontWeight: "bold",
        }}
      >
        {completedDate}
      </Text>

      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: "#2563EB",
          padding: 14,
          borderRadius: 10,
          marginTop: 25,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          🎓 View Certificate
        </Text>
      </TouchableOpacity>
    </View>
  );
}
