import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { CourseNote } from "../services/notesService";

interface Props {
  note: CourseNote;
  onEdit: (note: CourseNote) => void;
  onDelete: (noteId: string) => Promise<void>;
}

export default function CourseNoteCard({
  note,
  onEdit,
  onDelete,
}: Props) {
  const confirmDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (note.id) {
              await onDelete(note.id);
            }
          },
        },
      ]
    );
  };

  const updated =
    note.updatedAt?.toDate?.()?.toLocaleDateString() ??
    "Just now";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {note.title}
      </Text>

      <Text
        style={styles.content}
        numberOfLines={3}
      >
        {note.content}
      </Text>

      <Text style={styles.date}>
        Updated: {updated}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(note)}
        >
          <Text style={styles.buttonText}>
            ✏ Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={confirmDelete}
        >
          <Text style={styles.buttonText}>
            🗑 Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  content: {
    color: "#D1D5DB",
    fontSize: 16,
    lineHeight: 24,
  },

  date: {
    color: "#9CA3AF",
    marginTop: 14,
    fontSize: 13,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  editButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  deleteButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});