import { VerificationRequest } from "@/types/verification";
import { collection, doc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "./firebase";
import { Collections } from "./firebaseCollections";

/**
 * Streams files sequentially up to structured cloud buckets, tracking chunks [INDEX].
 */
export async function uploadVerificationFile(
  userId: string,
  fileName: string,
  fileBlob: Blob,
  onProgress: (progress: number) => void
): Promise<string> {
  const fileStorageRef = ref(storage, `teacher-documents/${userId}/${fileName}`);
  const uploadTask = uploadBytesResumable(fileStorageRef, fileBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(percent);
      },
      (error) => reject(error),
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadUrl);
      }
    );
  });
}

/**
 * Commits a full teacher profile application structural document down to Firestore [INDEX].
 */
export async function submitVerification(requestData: Omit<VerificationRequest, "id" | "submittedAt" | "updatedAt">): Promise<string> {
  const requestId = `${requestData.teacherId}_verify`;
  const fullPayload: VerificationRequest = {
    ...requestData,
    id: requestId,
    submittedAt: Date.now(),
    updatedAt: Date.now()
  };

  await setDoc(doc(db, Collections.TEACHER_APPLICATIONS, requestId), fullPayload);
  return requestId;
}

/**
 * Extracts historical credential submissions based on active user context constraints [INDEX].
 */
export async function getVerification(teacherId: string): Promise<VerificationRequest | null> {
  const q = query(
    collection(db, Collections.TEACHER_APPLICATIONS),
    where("teacherId", "==", teacherId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as VerificationRequest;
}
