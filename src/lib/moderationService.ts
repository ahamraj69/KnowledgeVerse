import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  addDoc,
  orderBy 
} from "firebase/firestore";
// ✅ FIXED: Switched lookups to point perfectly within the local src/lib flat folder space
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";
import { Report, ReportStatus, ReportType } from "@/types/report";

/**
 * Extracts submitted content violation reports filtered by operational status.
 */
export async function getReportsByStatus(status: ReportStatus): Promise<Report[]> {
  const q = query(
    collection(db, Collections.REPORTS),
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
}

/**
 * Fetches a single explicit content report context block by ID.
 */
export async function getReportById(id: string): Promise<Report | null> {
  const ref = doc(db, Collections.REPORTS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Report;
}

/**
 * Dynamically pulls polymorphic target content details to review.
 */
export async function loadReportedTargetContent(targetId: string, targetType: ReportType): Promise<any | null> {
  try {
    let collectionName = "";
    switch (targetType) {
      case "course": collectionName = Collections.COURSES; break;
      case "teacher": collectionName = Collections.TEACHER_PROFILES; break;
      case "lesson": 
        return { id: targetId, title: "Reported Lesson Node Fragment", description: "Inspecting lesson description fields contents." };
      case "comment":
      case "discussion":
        return { id: targetId, content: "Flagged user text dialogue context metadata sequence under inspection." };
      default: return null;
    }
    
    const snap = await getDoc(doc(db, collectionName, targetId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (e) {
    console.log("Error extracting reported context elements: ", e);
    return null;
  }
}

/**
 * Commits final moderation decisions and establishes audit histories.
 */
export async function processModerationAction(
  reportId: string, 
  action: "resolved" | "dismissed", 
  adminUid: string, 
  note: string
): Promise<void> {
  const ref = doc(db, Collections.REPORTS, reportId);
  const currentSnap = await getDoc(ref);
  const previousStatus = currentSnap.exists() ? currentSnap.data().status : "pending";

  await updateDoc(ref, {
    status: action,
    resolvedBy: adminUid,
    resolvedAt: Date.now(),
    adminNote: note,
    updatedAt: Date.now()
  });

  await addDoc(collection(db, "moderationHistory"), {
    reportId,
    resolvedBy: adminUid,
    resolvedAt: Date.now(),
    adminNote: note,
    previousStatus,
    timestamp: Date.now()
  });
}
