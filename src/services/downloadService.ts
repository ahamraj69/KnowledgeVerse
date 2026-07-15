import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

export interface DownloadItem {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  // ✅ FIXED: Marked optional to allow screen button handlers to dispatch task triggers cleanly
  downloadedAt?: number;
}

/**
 * Subscribes to real-time updates for a user's localized downloaded assets database map.
 */
export const subscribeToDownloads = (
  userId: string,
  callback: (downloads: DownloadItem[]) => void
) => {
  const q = collection(db, "users", userId, "downloads");

  return onSnapshot(q, (snapshot) => {
    const downloads: DownloadItem[] = snapshot.docs.map((d) => {
      const data = d.data();

      return {
        id: d.id,
        courseId: data.courseId ?? "",
        lessonId: data.lessonId ?? d.id,
        lessonTitle: data.lessonTitle ?? "Untitled Lesson",
        downloadedAt: data.downloadedAt ?? Date.now(),
      };
    });

    callback(downloads);
  }, (error) => {
    if (__DEV__) {
      console.log("Real-time downloads subscription error:", error);
    }
  });
};

export const isDownloaded = async (userId: string, lessonId: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, "users", userId, "downloads", lessonId));
  return snap.exists();
};

export const addDownload = async (
  userId: string,
  item: Omit<DownloadItem, "id">
): Promise<void> => {
  await setDoc(
    doc(db, "users", userId, "downloads", item.lessonId),
    {
      ...item,
      downloadedAt: Date.now(),
    }
  );
};

export const removeDownload = async (userId: string, lessonId: string): Promise<void> => {
  await deleteDoc(doc(db, "users", userId, "downloads", lessonId));
};
