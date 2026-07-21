import { collection, addDoc, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";
import { Report, ReportType } from "@/types/report";

/**
 * Checks if a user has already submitted a report for a specific content target [INDEX].
 */
export async function hasUserAlreadyReported(reporterId: string, targetId: string): Promise<boolean> {
  const q = query(
    collection(db, Collections.REPORTS),
    where("reporterId", "==", reporterId),
    where("targetId", "==", targetId),
    limit(1)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

/**
 * Commits a content report document down to the Firestore collection [INDEX].
 */
export async function submitContentReport(requestData: Omit<Report, "id" | "status" | "createdAt">): Promise<string> {
  const fullPayload = {
    ...requestData,
    status: "pending" as const,
    createdAt: Date.now()
  };

  const docRef = await addDoc(collection(db, Collections.REPORTS), fullPayload);
  return docRef.id;
}
