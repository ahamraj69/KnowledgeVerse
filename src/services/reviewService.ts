import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

export const subscribeReviews = (
  courseId: string,
  callback: (reviews: Review[]) => void
) => {
  const q = query(
    collection(
      db,
      "courses",
      courseId,
      "reviews"
    ),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Review, "id">),
      }))
    );
  });
};

export const addReview = async (
  review: Omit<
    Review,
    "id" | "createdAt"
  >
) => {
  await addDoc(
    collection(
      db,
      "courses",
      review.courseId,
      "reviews"
    ),
    {
      ...review,
      createdAt: serverTimestamp(),
    }
  );
};

export const getAverageRating = (
  reviews: Review[]
) => {
  if (reviews.length === 0) return 0;

  const total = reviews.reduce(
    (sum, item) => sum + item.rating,
    0
  );

  return Number(
    (total / reviews.length).toFixed(1)
  );
};