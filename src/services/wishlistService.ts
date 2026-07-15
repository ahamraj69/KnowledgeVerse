import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface WishlistItem {
  id: string;
  courseId: string;
  title: string;
  thumbnail?: string;
  createdAt?: {
    seconds: number;
  };
}

export const subscribeToWishlist = (
  userId: string,
  callback: (items: WishlistItem[]) => void
) => {
  const ref = collection(db, "users", userId, "wishlist");

  return onSnapshot(ref, (snapshot) => {
    const items = snapshot.docs.map(
      (docItem) =>
        ({
          id: docItem.id,
          ...docItem.data(),
        }) as WishlistItem
    );

    callback(items);
  });
};

export const addWishlist = async (
  userId: string,
  item: Omit<WishlistItem, "id">
) => {
  await setDoc(
    doc(db, "users", userId, "wishlist", item.courseId),
    {
      ...item,
      createdAt: {
        seconds: Date.now() / 1000,
      },
    }
  );
};

export const removeWishlist = async (
  userId: string,
  courseId: string
) => {
  await deleteDoc(
    doc(db, "users", userId, "wishlist", courseId)
  );
};

export const getWishlistItem = async (
  userId: string,
  courseId: string
) => {
  const snap = await getDoc(
    doc(db, "users", userId, "wishlist", courseId)
  );

  if (!snap.exists()) {
    return null;
  }

  return {
    id: snap.id,
    ...snap.data(),
  } as WishlistItem;
};