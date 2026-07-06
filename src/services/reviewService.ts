import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Review {
  id?: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  createdAt?: any;
}

/**
 * Commits a brand new student review document to the Firestore server collection context.
 */
export const addReview = async (
  review: Review
): Promise<void> => {
  await addDoc(
    collection(db, "reviews"),
    {
      ...review,
      createdAt: serverTimestamp(),
    }
  );
};

/**
 * Fetches all compiled reviews for a specific course ordered chronologically by newest first.
 */
export const getCourseReviews = async (
  courseId: string
): Promise<Review[]> => {
  const q = query(
    collection(db, "reviews"),
    where("courseId", "==", courseId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Review),
  }));
};

/**
 * Utility helper to calculate the single decimal average rating for an array of reviews.
 */
export const getAverageRating = (
  reviews: Review[]
): number => {
  if (!reviews.length) return 0;

  const total = reviews.reduce(
    (sum, item) => sum + item.rating,
    0
  );

  return Number(
    (total / reviews.length).toFixed(1)
  );
};
