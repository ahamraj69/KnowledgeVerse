import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { createLesson } from "../../services/lessonService";

export default function AddLesson() {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const saveLesson = async () => {
    if (
      !courseId ||
      !title ||
      !description ||
      !videoUrl ||
      !pdfUrl
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill all fields."
      );
      return;
    }

    try {
      await createLesson({
        courseId,
        title,
        description,
        videoUrl,
        pdfUrl,
      });

      Alert.alert(
        "Success",
        "Lesson created successfully!"
      );

      setCourseId("");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setPdfUrl("");
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Unable to create lesson."
      );
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
      }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 30,
        }}
      >
        ➕ Add Lesson
      </Text>

      <TextInput
        placeholder="Course ID"
        placeholderTextColor="#9CA3AF"
        value={courseId}
        onChangeText={setCourseId}
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 12,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Lesson Title"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 12,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Lesson Description"
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 12,
          height: 120,
          textAlignVertical: "top",
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Video URL"
        placeholderTextColor="#9CA3AF"
        value={videoUrl}
        onChangeText={setVideoUrl}
        autoCapitalize="none"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 12,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="PDF URL"
        placeholderTextColor="#9CA3AF"
        value={pdfUrl}
        onChangeText={setPdfUrl}
        autoCapitalize="none"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 12,
          marginBottom: 30,
        }}
      />

      <TouchableOpacity
        onPress={saveLesson}
        style={{
          backgroundColor: "#10B981",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          💾 Save Lesson
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}