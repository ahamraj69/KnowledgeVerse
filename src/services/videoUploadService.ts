import * as ImagePicker from "expo-image-picker";
import {
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";

import { storage } from "../lib/firebase";

export const pickAndUploadVideo = async () => {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Permission denied");
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 1,
    });

  if (result.canceled) return null;

  const asset = result.assets[0];

  const response = await fetch(asset.uri);
  const blob = await response.blob();

  const storageRef = ref(
    storage,
    `videos/${Date.now()}.mp4`
  );

  await uploadBytes(storageRef, blob);

  return await getDownloadURL(storageRef);
};