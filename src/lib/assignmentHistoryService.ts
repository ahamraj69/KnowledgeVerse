import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface AssignmentHistoryItem {
  id: string;
  topic: string;
  type: string;
  difficulty: string;
  result: string;
  createdAt?: any;
}

export const saveAssignment = async (
  userId: string,
  item: Omit<
    AssignmentHistoryItem,
    "id" | "createdAt"
  >
) => {
  await addDoc(
    collection(
      db,
      "users",
      userId,
      "assignments"
    ),
    {
      ...item,
      createdAt: serverTimestamp(),
    }
  );
};

export const subscribeAssignments = (
  userId: string,
  callback: (
    assignments: AssignmentHistoryItem[]
  ) => void
) => {
  const q = query(
    collection(
      db,
      "users",
      userId,
      "assignments"
    ),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<
          AssignmentHistoryItem,
          "id"
        >),
      }))
    );
  });
};