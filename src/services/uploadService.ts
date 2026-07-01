import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";

export const uploadFile = async (file: any, path: string) => {
  const fileRef = ref(storage, path);

  const response = await fetch(file.uri);
  const blob = await response.blob();

  await uploadBytes(fileRef, blob);

  return await getDownloadURL(fileRef);
};