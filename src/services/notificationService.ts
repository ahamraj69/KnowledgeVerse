import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

/**
 * ✅ Phase 19: Live operational socket for real-time notification push events.
 */
export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: NotificationItem[]) => void
) => {
  const q = query(
    collection(db, "users", userId, "notifications"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NotificationItem));
      callback(notes);
    },
    (error) => {
      console.log("Real-time notifications socket connection exception:", error);
    }
  );
};

export const markNotificationRead = async (userId: string, notificationId: string): Promise<void> => {
  await setDoc(doc(db, "users", userId, "notifications", notificationId), { read: true }, { merge: true });
};
