import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  initialTitle?: string;
  initialContent?: string;
  loading?: boolean;
  onSave: (title: string, content: string) => Promise<void>;
}

export default function NoteEditor({
  initialTitle = "",
  initialContent = "",
  loading = false,
  onSave,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const save = async () => {
    if (!title.trim()) return;
    if (!content.trim()) return;

    await onSave(title.trim(), content.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        📝 Course Note
      </Text>

      <TextInput
        placeholder="Note title..."
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />

      <TextInput
        placeholder="Write your notes here..."
        placeholderTextColor="#9CA3AF"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        style={styles.contentInput}
      />

      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={save}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            💾 Save Note
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },

  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
  },

  titleInput: {
    backgroundColor: "#1F2937",
    color: "white",
    padding: 14,
    borderRadius: 10,
    fontSize: 17,
    marginBottom: 15,
  },

  contentInput: {
    backgroundColor: "#1F2937",
    color: "white",
    padding: 14,
    borderRadius: 10,
    minHeight: 180,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});