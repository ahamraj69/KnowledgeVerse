import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface CourseServiceType {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export const getCourses = async (): Promise<CourseServiceType[]> => {
  const coursesRef = collection(db, "courses");
  const q = query(coursesRef);

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      title: data.title || "Untitled Course",
      description: data.description || "No description provided.",
      thumbnail: data.thumbnail || "",
    };
  });
};

export const getCourse = async (
  id: string
): Promise<CourseServiceType | null> => {
  const ref = doc(db, "courses", id);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    id: snapshot.id,
    title: data.title || "",
    description: data.description || "",
    thumbnail: data.thumbnail || "",
  };
};

export const updateCourse = async (
  id: string,
  data: Partial<CourseServiceType>
) => {
  const ref = doc(db, "courses", id);

  await updateDoc(ref, data);
};