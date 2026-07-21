import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Collections } from "../firebaseCollections";
import { Report } from "@/types/report";

export interface ModerationMetricsSummary {
  pendingCount: number;
  resolvedCount: number;
  dismissedCount: number;
  highPriorityCount: number;
  mostReportedTargetId: string;
  mostReportedType: string;
}

/**
 * ✅ Step 5 & 6 FIXED: Aggregates real-time violation logs and calculates priority queues [INDEX].
 */
export async function calculateModerationAnalytics(): Promise<ModerationMetricsSummary> {
  const snap = await getDocs(collection(db, Collections.REPORTS));
  const allReports = snap.docs.map(d => d.data() as Report);

  const pending = allReports.filter(r => r.status === "pending");
  const resolved = allReports.filter(r => r.status === "resolved");
  const dismissed = allReports.filter(r => r.status === "dismissed");

  // ✅ Step 5: Process trend frequencies using map trackers [INDEX]
  const frequencyMap: Record<string, { count: number; type: string }> = {};
  allReports.forEach(r => {
    if (!frequencyMap[r.targetId]) {
      frequencyMap[r.targetId] = { count: 0, type: r.targetType };
    }
    frequencyMap[r.targetId].count += 1;
  });

  let maxCount = 0;
  let topTargetId = "None";
  let topTargetType = "None";

  Object.keys(frequencyMap).forEach(id => {
    if (frequencyMap[id].count > maxCount) {
      maxCount = frequencyMap[id].count;
      topTargetId = id;
      topTargetType = frequencyMap[id].type;
    }
  });

  // ✅ Step 6 FIXED: Flags content exceeding a 5-report validation matrix threshold [INDEX]
  const highPriorityItems = pending.filter(r => {
    const targetMatchCount = allReports.filter(allR => allR.targetId === r.targetId).length;
    return targetMatchCount >= 5; 
  });

  return {
    pendingCount: pending.length,
    resolvedCount: resolved.length,
    dismissedCount: dismissed.length,
    highPriorityCount: highPriorityItems.length,
    mostReportedTargetId: topTargetId,
    mostReportedType: topTargetType
  };
}
