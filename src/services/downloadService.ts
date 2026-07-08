import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface DownloadItem {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  downloadedAt?: number;
}

/**
 * Real-time subscription matrix tracking active download tasks.
 */
export const subscribeToDownloads = (
  userId: string,
  callback: (downloads: DownloadItem[]) => void
) => {
  const q = collection(db, "users", userId, "downloads");

  return onSnapshot(
    q,
    (snapshot) => {
      const downloads = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        downloadedAt: d.data().downloadedAt || Date.now()
      } as DownloadItem));
      callback(downloads);
    },
    (error) => {
      console.log("Real-time downloads subscription error:", error);
    }
  );
};

// ✅ FIXED: Enforced global Promise wrapper configuration for async return values
export const isDownloaded = async (userId: string, lessonId: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, "users", userId, "downloads", lessonId));
  return snap.exists();
};

export const addDownload = async (userId: string, item: Omit<DownloadItem, "id">): Promise<void> => {
  await setDoc(doc(db, "users", userId, "downloads", item.lessonId), { ...item, downloadedAt: Date.now() });
};

export const removeDownload = async (userId: string, lessonId: string): Promise<void> => {
  await deleteDoc(doc(db, "users", userId, "downloads", lessonId));
};
