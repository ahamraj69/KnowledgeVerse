import { db } from "@/lib/firebase";
import {
    addDoc,
    collection,
    doc,
    increment,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

export interface Discussion {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  title: string;
  message: string;
  likes: number;
  createdAt?: any;
}

// ✅ Step 1: Mounted DiscussionReply interface schema data constraints
export interface DiscussionReply {
  id: string;
  discussionId: string;
  userId: string;
  userName: string;
  message: string;
  teacher: boolean;
  createdAt?: any;
}

export const subscribeDiscussions = (
  courseId: string,
  callback: (items: Discussion[]) => void
) => {
  const q = query(
    collection(db, "courses", courseId, "discussions"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Discussion, "id">),
      }))
    );
  });
};

export const createDiscussion = async (
  discussion: Omit<Discussion, "id" | "likes" | "createdAt">
) => {
  await addDoc(
    collection(db, "courses", discussion.courseId, "discussions"),
    {
      ...discussion,
      likes: 0,
      createdAt: serverTimestamp(),
    }
  );
};

export const likeDiscussion = async (
  courseId: string,
  discussionId: string
) => {
  await updateDoc(
    doc(db, "courses", courseId, "discussions", discussionId),
    {
      likes: increment(1),
    }
  );
};  

// ✅ Step 2: Mounted real-time response thread sub-collection listeners
export const subscribeReplies = (
  courseId: string,
  discussionId: string,
  callback: (items: DiscussionReply[]) => void
) => {
  const q = query(
    collection(
      db,
      "courses",
      courseId,
      "discussions",
      discussionId,
      "replies"
    ),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<DiscussionReply, "id">),
      }))
    );
  });
};

// ✅ Step 2: Mounted transaction block mapping for posting replies
export const addReply = async (
  courseId: string,
  discussionId: string,
  reply: Omit<DiscussionReply, "id" | "createdAt">
) => {
  await addDoc(
    collection(
      db,
      "courses",
      courseId,
      "discussions",
      discussionId,
      "replies"
    ),
    {
      ...reply,
      createdAt: serverTimestamp(),
    }
  );
};
