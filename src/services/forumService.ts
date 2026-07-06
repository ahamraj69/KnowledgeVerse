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

import { db } from "../lib/firebase";
import { ForumPost } from "../types/forum";

const forumCollection = collection(db, "forum");

/**
 * Create a new discussion post.
 */
export const createForumPost = async (
  post: Omit<ForumPost, "id">
): Promise<void> => {
  await addDoc(forumCollection, post);
};

/**
 * Fetch all discussion posts.
 */
export const getForumPosts = async (): Promise<ForumPost[]> => {
  const q = query(
    forumCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<ForumPost, "id">),
  })) as ForumPost[];
};

/**
 * Update a forum post.
 */
export const updateForumPost = async (
  id: string,
  data: Partial<ForumPost>
): Promise<void> => {
  await updateDoc(
    doc(db, "forum", id),
    data
  );
};

/**
 * ✅ ADDED: Increments the like counter attribute for an explicit forum post document.
 */
export const likeForumPost = async (
  postId: string,
  currentLikes: number
): Promise<void> => {
  await updateDoc(
    doc(db, "forum", postId),
    {
      likes: currentLikes + 1,
    }
  );
};

/**
 * Delete a forum post.
 */
export const deleteForumPost = async (
  id: string
): Promise<void> => {
  await deleteDoc(
    doc(db, "forum", id)
  );
};
