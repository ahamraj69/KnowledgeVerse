import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";

export async function uploadCourseImage(courseId: string) {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Permission denied");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
    allowsEditing: true,
  });

  if (result.canceled) return null;

  const uri = result.assets[0].uri;

  const response = await fetch(uri);
  const blob = await response.blob();

  const imageRef = ref(storage, `course-images/${courseId}.jpg`);

  await uploadBytes(imageRef, blob);

  return await getDownloadURL(imageRef);
}