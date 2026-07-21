import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt?: any;
}

export const subscribeNotifications = (
  userId: string,
  callback: (items: NotificationItem[]) => void
) => {
  const q = query(
    collection(
      db,
      "users",
      userId,
      "notifications"
    ),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<
          NotificationItem,
          "id"
        >),
      }))
    );
  });
};

export const addNotification = async (
  userId: string,
  title: string,
  message: string
) => {
  await addDoc(
    collection(
      db,
      "users",
      userId,
      "notifications"
    ),
    {
      title,
      message,
      read: false,
      createdAt: serverTimestamp(),
    }
  );
};

export const markNotificationRead = async (
  userId: string,
  id: string
) => {
  await updateDoc(
    doc(
      db,
      "users",
      userId,
      "notifications",
      id
    ),
    {
      read: true,
    }
  );
};

export const deleteNotification = async (
  userId: string,
  id: string
) => {
  await deleteDoc(
    doc(
      db,
      "users",
      userId,
      "notifications",
      id
    )
  );
};