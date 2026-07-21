import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { ForumPost } from "../types/forum";

const getForumCollection = () => collection(db, "forum");

/**
 * ✅ Phase 19: Establishes a real-time reactive pipeline to capture live forum streams.
 */
export const subscribeToForumPosts = (
  callback: (posts: ForumPost[]) => void
) => {
  const q = query(
    getForumCollection(),
    orderBy("createdAt", "desc")
  );

  // Returns the native unbind execution hook to prevent active leaks
  return onSnapshot(
    q, 
    (snapshot) => {
      const posts = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<ForumPost, "id">),
      })) as ForumPost[];
      callback(posts);
    },
    (error) => {
      console.log("Real-time forum listener broadcast blocked:", error);
    }
  );
};

export const createForumPost = async (post: Omit<ForumPost, "id">): Promise<void> => {
  await addDoc(getForumCollection(), post);
};

export const updateForumPost = async (id: string, data: Partial<ForumPost>): Promise<void> => {
  await updateDoc(doc(db, "forum", id), data);
};

export const likeForumPost = async (postId: string, currentLikes: number): Promise<void> => {
  await updateDoc(doc(db, "forum", postId), { likes: currentLikes + 1 });
};

export const deleteForumPost = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "forum", id));
};
