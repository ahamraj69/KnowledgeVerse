import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

import {
    getCourse,
    updateCourse,
} from "../../../services/courseListService";

export default function EditCourse() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      const course = await getCourse(id);

      if (!course) {
        Alert.alert("Error", "Course not found.");
        router.back();
        return;
      }

      setTitle(course.title);
      setDescription(course.description);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required.");
      return;
    }

    try {
      setSaving(true);

      await updateCourse(id, {
        title,
        description,
      });

      Alert.alert("Success", "Course updated successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update course.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color="#2563EB"
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.heading}>
        ✏️ Edit Course
      </Text>

      <Text style={styles.label}>
        Course Title
      </Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Course title"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Course description"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveCourse}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0B1220",
    flexGrow: 1,
  },

  heading: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 25,
  },

  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },

  input: {
    backgroundColor: "#1F2937",
    color: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },

  textArea: {
    height: 140,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});