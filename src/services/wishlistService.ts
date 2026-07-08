import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// ✅ FIXED: Export interface contract signature explicitly
export interface WishlistItem {
  id: string;
  courseId: string;
}

/**
 * Real-time listener for monitoring changes to the user's wishlist.
 */
export const subscribeToWishlist = (
  userId: string,
  callback: (items: WishlistItem[]) => void
) => {
  const q = collection(db, "users", userId, "wishlist");

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as WishlistItem));
      callback(items);
    },
    (error) => {
      console.log("Real-time wishlist subscription error:", error);
    }
  );
};

export const addToWishlist = async (userId: string, courseId: string): Promise<void> => {
  await setDoc(doc(db, "users", userId, "wishlist", courseId), { courseId });
};

export const removeFromWishlist = async (userId: string, courseId: string): Promise<void> => {
  await deleteDoc(doc(db, "users", userId, "wishlist", courseId));
};
