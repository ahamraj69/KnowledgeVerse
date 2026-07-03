import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface RecentlyViewedCourse {
  courseId: string;
  courseTitle: string;
  lastViewedAt: any;
}

// Phase 11.5.4.6: Save and trim history to only the latest 10 courses
export async function saveRecentlyViewed(
  userId: string,
  courseId: string
) {
  const ref = doc(
    db,
    "users",
    userId,
    "recentlyViewed",
    courseId
  );

  await setDoc(
    ref,
    {
      courseId,
      lastViewedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const q = query(
    collection(db, "users", userId, "recentlyViewed"),
    orderBy("lastViewedAt", "desc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.size > 10) {
    const docs = snapshot.docs;
    // Iterate and drop everything past index 9
    for (let i = 10; i < docs.length; i++) {
      await deleteDoc(docs[i].ref);
    }
  }
}

// Phase 11.5.4.7: Firestore Query Optimization with explicit limit
export async function getRecentlyViewed(
  userId: string
): Promise<RecentlyViewedCourse[]> {
  try {
    const q = query(
      collection(db, "users", userId, "recentlyViewed"),
      orderBy("lastViewedAt", "desc"),
      limit(10) // Returns only the newest 10 documents
    );

    const snapshot = await getDocs(q);
    
    const detailedCourses = await Promise.all(
      snapshot.docs.map(async (historyDoc) => {
        const courseId = historyDoc.id;
        const historyData = historyDoc.data();
        
        const courseDocRef = doc(db, "courses", courseId);
        const courseDocSnap = await getDoc(courseDocRef);
        
        let courseTitle = "Unknown Course";
        if (courseDocSnap.exists()) {
          courseTitle = courseDocSnap.data().title || "Untitled Course";
        }

        return {
          courseId,
          courseTitle,
          ...historyData,
        };
      })
    );

    return detailedCourses as RecentlyViewedCourse[];
  } catch (error) {
    console.log("getRecentlyViewed error:", error);
    return [];
  }
}
