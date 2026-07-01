import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export const createCourse = async (
  title: string,
  description: string,
  price: number
) => {
  const user = auth.currentUser;

  if (!user) throw new Error("Not logged in");

  return await addDoc(collection(db, "courses"), {
    teacherId: user.uid,
    title,
    description,
    price,
    createdAt: serverTimestamp(),
  });
};