import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

export const sendNotification = async (
  title: string,
  message: string
) => {
  const user = auth.currentUser;

  if (!user) return;

  await addDoc(collection(db, "notifications"), {
    userId: user.uid,
    title,
    message,
    createdAt: serverTimestamp(),
  });
};

export const getNotifications = async () => {
  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, "notifications"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};