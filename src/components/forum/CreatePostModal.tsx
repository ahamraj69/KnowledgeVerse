import { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    content: string
  ) => void | Promise<void>;
};

export default function CreatePostModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;

    await onSubmit(title, content);

    setTitle("");
    setContent("");

    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>
            ✍ Create Discussion
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Post title"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write something..."
            placeholderTextColor="#9CA3AF"
            multiline
            style={styles.textArea}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handlePost}
          >
            <Text style={styles.buttonText}>
              Post Discussion
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={styles.cancel}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 20,
  },

  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },

  input: {
    backgroundColor: "#1F2937",
    color: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  textArea: {
    backgroundColor: "#1F2937",
    color: "white",
    borderRadius: 10,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  cancel: {
    marginTop: 15,
    alignItems: "center",
  },

  cancelText: {
    color: "#9CA3AF",
    fontSize: 15,
  },
});