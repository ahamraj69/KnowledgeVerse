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

export default function CreateCourse() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const saveCourse = async () => {
    if (!title || !description || !price) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      await createCourse(
        title,
        description,
        Number(price)
      );

      Alert.alert("Success", "Course created successfully.");

      router.back();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to create course.");
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
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        ➕ Create Course
      </Text>

      <TextInput
        placeholder="Course Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 14,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 14,
          borderRadius: 10,
          height: 120,
          textAlignVertical: "top",
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Price (₹)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 14,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={saveCourse}
        style={{
          backgroundColor: "#2563EB",
          padding: 16,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Create Course
        </Text>
      </TouchableOpacity>
    </View>
  );
}