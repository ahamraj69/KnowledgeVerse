import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export const createCourse = async (
  title: string,
  description: string,
  price: number,
  image: string
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in.");
  }

  return await addDoc(collection(db, "courses"), {
    teacherId: user.uid,
    title,
    description,
    price,
    image,
    createdAt: serverTimestamp(),
  });
};