import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  QueryDocumentSnapshot 
} from "firebase/firestore";
import { db } from "../firebase";
import { Collections } from "../firebaseCollections";
import { Course } from "@/types/course";

export interface PaginatedCoursesResult {
  courses: Course[];
  lastVisibleSnapshot: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

const PAGE_SIZE_THRESHOLD = 20; // ✅ Step 3 Rule: Cap query sizes tightly to 20 files

/**
 * Pulls cursor-paginated data chunks from the approved courses database stream [INDEX].
 */
export async function fetchCoursesSegmentPaginated(
  lastVisibleDoc: QueryDocumentSnapshot | null = null
): Promise<PaginatedCoursesResult> {
  try {
    let q = query(
      collection(db, Collections.COURSES),
      where("status", "==", "approved"),
      orderBy("submittedAt", "desc"),
      limit(PAGE_SIZE_THRESHOLD)
    );

    if (lastVisibleDoc) {
      q = query(q, startAfter(lastVisibleDoc));
    }

    const snapshot = await getDocs(q);
    const courses: Course[] = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as Course));

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    const hasMore = snapshot.docs.length === PAGE_SIZE_THRESHOLD;

    return {
      courses,
      lastVisibleSnapshot: lastDoc,
      hasMore
    };
  } catch (error) {
    console.log("Error extracting paginated collection metrics branch: ", error);
    return { courses: [], lastVisibleSnapshot: null, hasMore: false };
  }
}
