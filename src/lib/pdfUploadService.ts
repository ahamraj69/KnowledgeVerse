import * as DocumentPicker from "expo-document-picker";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "../lib/firebase";

export const pickAndUploadPDF = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return null;
  }

  const file = result.assets[0];

  const response = await fetch(file.uri);
  const blob = await response.blob();

  const storageRef = ref(
    storage,
    `pdfs/${Date.now()}-${file.name}`
  );

  await uploadBytes(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};