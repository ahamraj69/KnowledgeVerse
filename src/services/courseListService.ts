import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export const getCourses = async () => {
  const snapshot = await getDocs(collection(db, "courses"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};