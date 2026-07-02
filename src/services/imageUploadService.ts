import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";

export const uploadImage = async (
  imageUri: string,
  folder: string
) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const filename = Date.now() + ".jpg";

  const imageRef = ref(storage, `${folder}/${filename}`);

  await uploadBytes(imageRef, blob);

  return await getDownloadURL(imageRef);
};