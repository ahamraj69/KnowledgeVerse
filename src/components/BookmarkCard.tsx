import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Bookmark } from "../services/bookmarkService";

interface Props {
  bookmark: Bookmark;
  onOpen: (courseId: string) => void;
  onDelete: (bookmarkId: string) => Promise<void>;
}

export default function BookmarkCard({
  bookmark,
  onOpen,
  onDelete,
}: Props) {
  const confirmDelete = () => {
    Alert.alert(
      "Remove Bookmark",
      "Do you want to remove this bookmark?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            if (bookmark.id) {
              await onDelete(bookmark.id);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.course}>
        📚 {bookmark.courseId}
      </Text>

      <Text style={styles.lesson}>
        {bookmark.lessonTitle}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() =>
            onOpen(bookmark.courseId)
          }
        >
          <Text style={styles.buttonText}>
            ▶ Open
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
    marginBottom: 16,
  },

  course: {
    color: "#60A5FA",
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },

  lesson: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  openButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});