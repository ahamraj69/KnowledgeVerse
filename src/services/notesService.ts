import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface CourseNote {
  id?: string;
  userId: string;
  courseId: string;
  lessonId: string;
  title: string;
  content: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Add a new note
 */
export const addNote = async (
  userId: string,
  courseId: string,
  lessonId: string,
  title: string,
  content: string
) => {
  const ref = collection(db, "users", userId, "notes");

  const docRef = await addDoc(ref, {
    userId,
    courseId,
    lessonId,
    title,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Update an existing note
 */
export const updateNote = async (
  userId: string,
  noteId: string,
  title: string,
  content: string
) => {
  const ref = doc(db, "users", userId, "notes", noteId);

  await updateDoc(ref, {
    title,
    content,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a note
 */
export const deleteNote = async (
  userId: string,
  noteId: string
) => {
  const ref = doc(db, "users", userId, "notes", noteId);

  await deleteDoc(ref);
};

/**
 * Get notes for a lesson
 */
export const getLessonNotes = async (
  userId: string,
  lessonId: string
): Promise<CourseNote[]> => {
  const ref = collection(db, "users", userId, "notes");

  const q = query(
    ref,
    where("lessonId", "==", lessonId),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<CourseNote, "id">),
  }));
};

/**
 * Get all notes
 */
export const getAllNotes = async (
  userId: string
): Promise<CourseNote[]> => {
  const ref = collection(db, "users", userId, "notes");

  const q = query(
    ref,
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<CourseNote, "id">),
  }));
};

/**
 * Search notes by title or content
 */
export const searchNotes = async (
  userId: string,
  keyword: string
): Promise<CourseNote[]> => {
  const notes = await getAllNotes(userId);

  const lower = keyword.trim().toLowerCase();

  if (!lower) {
    return notes;
  }

  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lower) ||
      note.content.toLowerCase().includes(lower)
  );
};