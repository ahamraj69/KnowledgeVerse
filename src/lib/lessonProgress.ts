import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "./firebase";

export async function completeLesson(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<void> {
  await setDoc(
    doc(db, "lessonProgress", `${userId}_${lessonId}`),
    {
      userId,
      courseId,
      lessonId,
      completed: true,
      completedAt: Date.now(),
    }
  );
}

export async function checkLessonStatus(userId: string, lessonId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "lessonProgress", `${userId}_${lessonId}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().completed === true : false;
  } catch (error) {
    console.error("Error matching performance check vectors: ", error);
    return false;
  }
}

export async function getCompletedLessonIds(userId: string, courseId: string): Promise<string[]> {
  try {
    const q = query(
      collection(db, "lessonProgress"),
      where("userId", "==", userId),
      where("courseId", "==", courseId),
      where("completed", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().lessonId);
  } catch (error) {
    console.error("Error querying historic completions matrix: ", error);
    return [];
  }
}
