import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

// ✅ FIX: Realigned path to point accurately up to your active core engine module file
import { db } from "../lib/firebase";
import { Comment } from "../types/comment";

const getCommentsCollection = (courseId: string) =>
  collection(db, "courses", courseId, "comments");

/**
 * Appends a new student discussion comment to a specific nested course sub-collection track.
 */
export const addComment = async (
  comment: Omit<Comment, "id">
): Promise<void> => {
  await addDoc(
    getCommentsCollection(comment.courseId),
    comment
  );
};

/**
 * Fetches all interactive comments under a course, sorted chronologically from newest to oldest.
 */
export const getComments = async (
  courseId: string
): Promise<Comment[]> => {
  const q = query(
    getCommentsCollection(courseId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Comment, "id">),
  })) as Comment[];
};

/**
 * Updates a comment document entry node's contents or properties inside Firestore.
 */
export const updateComment = async (
  courseId: string,
  commentId: string,
  data: Partial<Comment>
): Promise<void> => {
  await updateDoc(
    doc(db, "courses", courseId, "comments", commentId),
    data
  );
};

/**
 * Permanently drops a comment sub-collection document out of the database workspace.
 */
export const deleteComment = async (
  courseId: string,
  commentId: string
): Promise<void> => {
  await deleteDoc(
    doc(db, "courses", courseId, "comments", commentId)
  );
};
