import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";

export const uploadPdf = async (
  pdfUri: string,
  folder: string
) => {
  const response = await fetch(pdfUri);
  const blob = await response.blob();

  const filename = Date.now() + ".pdf";

  const pdfRef = ref(storage, `${folder}/${filename}`);

  await uploadBytes(pdfRef, blob);

  return await getDownloadURL(pdfRef);
};