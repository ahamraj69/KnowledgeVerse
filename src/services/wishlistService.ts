import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

export const addToWishlist = async (courseId: string) => {
  const user = auth.currentUser;

  if (!user) throw new Error("Not logged in");

  await addDoc(collection(db, "wishlist"), {
    userId: user.uid,
    courseId,
  });
};

export const removeFromWishlist = async (wishlistId: string) => {
  await deleteDoc(doc(db, "wishlist", wishlistId));
};

export const getWishlist = async () => {
  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, "wishlist"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};