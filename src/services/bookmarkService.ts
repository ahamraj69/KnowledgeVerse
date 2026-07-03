import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface Bookmark {
  id?: string;
  userId: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  createdAt?: any;
}

/**
 * Add bookmark
 */
export const addBookmark = async (
  userId: string,
  courseId: string,
  lessonId: string,
  lessonTitle: string
) => {
  const ref = collection(
    db,
    "users",
    userId,
    "bookmarks"
  );

  const q = query(
    ref,
    where("lessonId", "==", lessonId)
  );

  const existing = await getDocs(q);

  if (!existing.empty) {
    return existing.docs[0].id;
  }

  const docRef = await addDoc(ref, {
    userId,
    courseId,
    lessonId,
    lessonTitle,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Remove bookmark
 */
export const removeBookmark = async (
  userId: string,
  bookmarkId: string
) => {
  await deleteDoc(
    doc(
      db,
      "users",
      userId,
      "bookmarks",
      bookmarkId
    )
  );
};

/**
 * Get all bookmarks
 */
export const getBookmarks = async (
  userId: string
): Promise<Bookmark[]> => {
  const ref = collection(
    db,
    "users",
    userId,
    "bookmarks"
  );

  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Bookmark, "id">),
  }));
};

/**
 * Check bookmark
 */
export const getBookmarkByLesson = async (
  userId: string,
  lessonId: string
) => {
  const ref = collection(
    db,
    "users",
    userId,
    "bookmarks"
  );

  const q = query(
    ref,
    where("lessonId", "==", lessonId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...(snapshot.docs[0].data() as Omit<
      Bookmark,
      "id"
    >),
  };
};