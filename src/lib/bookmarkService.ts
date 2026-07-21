import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    setDoc,
    where
} from "firebase/firestore";

import { Bookmark } from "@/types/chat";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";

export async function bookmarkLesson(userId: string, lessonId: string, courseId: string = "unknown", lessonTitle: string = "Lesson"): Promise<void> {
  const bookmarkId = `${userId}_${lessonId}`;
  await setDoc(
    doc(db, Collections.BOOKMARKS, bookmarkId),
    {
      id: bookmarkId,
      userId,
      lessonId,
      courseId,
      lessonTitle,
      createdAt: Date.now(),
    }
  );
}

export async function removeBookmark(userId: string, lessonId: string): Promise<void> {
  await deleteDoc(doc(db, Collections.BOOKMARKS, `${userId}_${lessonId}`));
}

export async function isLessonBookmarked(userId: string, lessonId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, Collections.BOOKMARKS, `${userId}_${lessonId}`));
  return snap.exists();
}

// ✅ FIXED: Added real-time subscription sync stream wrapper mapping
export function subscribeToBookmarks(userId: string, callback: (bookmarks: Bookmark[]) => void) {
  const q = query(collection(db, Collections.BOOKMARKS), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Bookmark)));
  });
}

// ✅ FIXED: Bridged backward-compatible function parameters to clear old component buttons lookups
export const addBookmark = async (userId: string, lessonId: string) => bookmarkLesson(userId, lessonId);
export const getBookmarkByLesson = async (userId: string, lessonId: string) => {
  const exists = await isLessonBookmarked(userId, lessonId);
  return exists ? { id: `${userId}_${lessonId}` } : null;
};
