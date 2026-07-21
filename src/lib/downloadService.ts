import { collection, deleteDoc, doc, getDoc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";

export interface DownloadItem {
  id: string;
  userId: string;
  lessonId: string;
  title: string;
  timestamp: number;
}

export function subscribeToDownloads(userId: string, callback: (downloads: any[]) => void) {
  const q = query(collection(db, Collections.LESSON_PROGRESS), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

/**
 * Removes local offline cache download indices securely.
 */
export async function removeDownload(downloadId: string): Promise<void> {
  await deleteDoc(doc(db, Collections.LESSON_PROGRESS, downloadId));
}

// ✅ FIXED: Added missing addDownload operation hook to satisfy interactive button layouts
export async function addDownload(userId: string, lessonId: string, title: string = "Lesson Module"): Promise<void> {
  const downloadId = `${userId}_${lessonId}`;
  await setDoc(doc(db, Collections.LESSON_PROGRESS, downloadId), {
    id: downloadId,
    userId,
    lessonId,
    title,
    lessonTitle: title, // Backwards compatibility alias fallback key
    timestamp: Date.now(),
    downloadedAt: Date.now() // Backwards compatibility timestamp index
  });
}

// ✅ FIXED: Added missing isDownloaded validation check hook to clear button status lookups
export async function isDownloaded(userId: string, lessonId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, Collections.LESSON_PROGRESS, `${userId}_${lessonId}`));
  return snap.exists();
}
