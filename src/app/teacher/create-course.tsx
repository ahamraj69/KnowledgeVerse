import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createCourse } from "../../services/courseService";
import { uploadCourseImage } from "../../services/imageUploadService";

export default function CreateCourse() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUploadImage = async () => {
    try {
      const url = await uploadCourseImage(Date.now().toString());

      if (url) {
        setImageUrl(url);
        Alert.alert("Success", "Thumbnail uploaded successfully.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Image upload failed.");
    }
  };

  const handleCreateCourse = async () => {
    if (!title || !description || !price) {
      Alert.alert("Missing Information", "Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await createCourse(
        title,
        description,
        Number(price),
        imageUrl
      );

      Alert.alert("Success", "Course created successfully!");

      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 25,
        }}
      >
        ➕ Create Course
      </Text>

      <TextInput
        placeholder="Course Title"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Course Description"
        placeholderTextColor="#9CA3AF"
        multiline
        value={description}
        onChangeText={setDescription}
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 10,
          height: 120,
          textAlignVertical: "top",
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Price (₹)"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleUploadImage}
        style={{
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {imageUrl
            ? "✅ Thumbnail Uploaded"
            : "📷 Upload Thumbnail"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={loading}
        onPress={handleCreateCourse}
        style={{
          backgroundColor: loading ? "#6B7280" : "#10B981",
          padding: 16,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {loading ? "Creating Course..." : "🚀 Create Course"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}