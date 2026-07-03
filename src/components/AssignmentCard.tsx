import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { Assignment } from "../services/assignmentService";

interface Props {
  assignment: Assignment;
  onOpen: (assignment: Assignment) => void;
}

export default function AssignmentCard({
  assignment,
  onOpen,
}: Props) {
  const openAssignment = () => {
    onOpen(assignment);
  };

  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>
        📘 {assignment.title}
      </Text>

      {/* Description */}
      <Text style={styles.desc}>
        {assignment.description}
      </Text>

      {/* Due Date */}
      {assignment.dueDate && (
        <Text style={styles.due}>
          ⏰ Due: {assignment.dueDate}
        </Text>
      )}

      {/* Action */}
      <TouchableOpacity
        onPress={openAssignment}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          ✍️ Submit Assignment
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2937",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  desc: {
    color: "#9CA3AF",
    marginTop: 8,
    fontSize: 14,
  },

  due: {
    color: "#FBBF24",
    marginTop: 10,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});