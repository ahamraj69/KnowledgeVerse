import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { ModerationRecord } from "@/types/moderation";

export async function fetchAllActionsByType(actionType: "warning" | "suspension" | "ban"): Promise<ModerationRecord[]> {
  const q = query(collection(db, "moderation"), where("action", "==", actionType));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ModerationRecord));
}
