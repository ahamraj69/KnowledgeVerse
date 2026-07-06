import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useLoading } from "../../../context/LoadingContext";
import { storage } from "../../../lib/firebase";
import { Colors } from "../../../theme/colors";
import { Theme } from "../../../theme/theme";

// ✅ FIXED IMPORTS: Resolves missing exported member parameters accurately
import { getCourse } from "../../../services/courseListService";
import { updateCourse } from "../../../services/updateCourseService";

export default function EditCourseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Dynamic directory uses [id] param layout structure
  const { setLoading } = useLoading();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [isNewImageSelected, setIsNewImageSelected] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCourseDetails();
    }
  }, [id]);

  const loadCourseDetails = async () => {
    try {
      setScreenLoading(true);
      const data = await getCourse(id as string);

      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        // Safely check if a raw price metric historical attribute was tied to schema
        setPrice((data as any).price ? (data as any).price.toString() : "");
        setThumbnail(data.thumbnail || "");
        setExistingThumbnail(data.thumbnail || "");
      } else {
        Alert.alert("Error", "Course record not found.");
        router.back();
      }
    } catch (error) {
      console.log("Error loading course details:", error);
      Alert.alert("Error", "Failed to retrieve course data.");
    } finally {
      setScreenLoading(false);
    }
  };

  const pickThumbnail = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "Please allow gallery permission.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setThumbnail(result.assets[0].uri);
        setIsNewImageSelected(true);
      }
    } catch (error) {
      console.log("Image picking sequence broken:", error);
      Alert.alert("Error", "Failed to access photo gallery.");
    }
  };

  const uploadImageAndGetUrl = async (localUri: string): Promise<string> => {
    const response = await fetch(localUri);
    const blob = await response.blob();
    const fileRef = ref(storage, `course-thumbnails/${id}.jpg`);
    
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  const handleUpdate = useCallback(async () => {
    if (!title.trim() || !description.trim() || !price.trim()) {
      Alert.alert("Validation Error", "Please fill in all mandatory fields.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      Alert.alert("Validation Error", "Please enter a valid numeric value for price.");
      return;
    }

    try {
      setLoading(true);
      let finalCloudUrl = existingThumbnail;

      if (isNewImageSelected && thumbnail) {
        finalCloudUrl = await uploadImageAndGetUrl(thumbnail);
      }

      await updateCourse(
        id as string,
        title.trim(),
        description.trim(),
        parsedPrice,
        finalCloudUrl
      );

      Alert.alert("Success", "Course updated successfully. 🎉");
      router.back();
    } catch (error) {
      console.log("Master saving flow pipe structural exception:", error);
      Alert.alert("Update Failed", "Unable to update course.");
    } finally {
      setLoading(false);
    }
  }, [id, title, description, price, thumbnail, existingThumbnail, isNewImageSelected, setLoading]);

  if (screenLoading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[Theme.text, { marginTop: 15 }]}>Fetching course layout data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.content}>
      <Text style={[Theme.text, styles.mainTitle]}>✏️ Edit Course</Text>
      <Text style={[Theme.muted, styles.subtitle]}>Modify your curriculum definitions and billing rates.</Text>

      <Text style={[Theme.text, styles.label]}>Course Title *</Text>
      <TextInput
        placeholder="Course Title"
        placeholderTextColor={Colors.textMuted}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={[Theme.text, styles.label]}>Description *</Text>
      <TextInput
        placeholder="Provide course summary details..."
        placeholderTextColor={Colors.textMuted}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
      />

      <Text style={[Theme.text, styles.label]}>Price (INR) *</Text>
      <TextInput
        placeholder="Price"
        placeholderTextColor={Colors.textMuted}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
      />

      <Text style={[Theme.text, styles.label]}>Course Thumbnail Image</Text>
      <TouchableOpacity 
        style={[styles.pickerBtn, { borderColor: Colors.border, backgroundColor: Colors.card }]} 
        onPress={pickThumbnail}
      >
        <Text style={[Theme.text, { fontWeight: "600" }]}>🖼️ Choose Image from Gallery</Text>
      </TouchableOpacity>

      {!!thumbnail && (
        <View style={[styles.previewContainer, { borderColor: Colors.border }]}>
          <Image source={{ uri: thumbnail }} style={styles.previewImage} />
          <Text style={[Theme.muted, { marginTop: 8, fontSize: 13, textAlign: "center" }]}>
            {isNewImageSelected ? "✨ Selected New Image Preview" : "☁️ Active Cloud Thumbnail"}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.saveBtn, { backgroundColor: Colors.success }]} 
        onPress={handleUpdate}
      >
        <Text style={[Theme.text, styles.btnText]}>Save Changes 💾</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 6,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 5,
  },
  input: {
    backgroundColor: Colors.card,
    color: Colors.text,
    padding: 15,
    borderRadius: 12,
    marginBottom: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 18,
  },
  previewContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#111827",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveBtn: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
