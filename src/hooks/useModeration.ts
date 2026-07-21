import { useState, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { executeModerationAction, getUserModerationHistory, assessRepeatOffenderMetrics } from "@/lib/moderationActionService";
import { ModerationRecord, ModerationAction } from "@/types/moderation";

export function useModeration(targetUserId?: string) {
  const [history, setHistory] = useState<ModerationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [escalation, setEscalation] = useState<{ warnings: number; suspensions: number; suggestedAction?: ModerationAction } | null>(null);

  const syncUserMetrics = useCallback(async () => {
    if (!targetUserId) return;
    try {
      setLoading(true);
      const userHistory = await getUserModerationHistory(targetUserId);
      const metrics = await assessRepeatOffenderMetrics(targetUserId);
      setHistory(userHistory);
      setEscalation(metrics);
    } catch (e) {
      console.log("Error inside moderation hook tracking loop: ", e);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  const commitAction = useCallback(async (action: ModerationAction, reason: string, durationDays?: number) => {
    if (!targetUserId) return;
    const adminId = auth.currentUser?.uid || "admin_node";
    await executeModerationAction(targetUserId, action, reason, adminId, durationDays);
    await syncUserMetrics();
  }, [targetUserId, syncUserMetrics]);

  return {
    history,
    loading,
    escalation,
    syncUserMetrics,
    issueEnforcement: commitAction
  };
}
