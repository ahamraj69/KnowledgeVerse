import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// ✅ FIXED: Declare and export the type model contract inside the service file natively
export interface Bookmark {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  createdAt?: { seconds: number };
}

/**
 * Establishes a real-time listener subscription map for user-scoped bookmarks.
 */
export const subscribeToBookmarks = (
  userId: string,
  callback: (bookmarks: Bookmark[]) => void
) => {
  const q = collection(db, "users", userId, "bookmarks");

  return onSnapshot(
    q,
    (snapshot) => {
      const bookmarks = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt || { seconds: Date.now() / 1000 }
      } as Bookmark));
      callback(bookmarks);
    },
    (error) => {
      console.log("Real-time bookmarks subscription error:", error);
    }
  );
};

// ✅ FIXED: Added specific status lookups to satisfy BookmarkButton.tsx requirements
export const getBookmarkByLesson = async (userId: string, lessonId: string): Promise<Bookmark | null> => {
  const docSnap = await getDoc(doc(db, "users", userId, "bookmarks", lessonId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Bookmark;
};

export const addBookmark = async (userId: string, item: Omit<Bookmark, "id">): Promise<void> => {
  const payload = { ...item, createdAt: { seconds: Date.now() / 1000 } };
  await setDoc(doc(db, "users", userId, "bookmarks", item.lessonId), payload);
};

export const removeBookmark = async (userId: string, lessonId: string): Promise<void> => {
  await deleteDoc(doc(db, "users", userId, "bookmarks", lessonId));
};
