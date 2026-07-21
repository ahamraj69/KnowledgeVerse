import { useState, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { hasUserAlreadyReported, submitContentReport } from "@/lib/reportService";
import { ReportType } from "@/types/report";

export function useReports() {
  const [submitting, setSubmitting] = useState(false);

  const processReportSubmission = useCallback(async (
    targetId: string,
    targetType: ReportType,
    reason: string,
    description?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return { success: false, error: "User session unauthenticated." };

    try {
      setSubmitting(true);

      // ✅ Step 9: Prevent Duplicate Reports check [INDEX]
      const alreadyReported = await hasUserAlreadyReported(userId, targetId);
      if (alreadyReported) {
        return { success: false, error: "You have already reported this content." };
      }

      await submitContentReport({
        reporterId: userId,
        targetId,
        targetType,
        reason,
        description: description?.trim() || ""
      });

      return { success: true };
    } catch (e: any) {
      console.log("Reporting logic breakdown caught: ", e);
      return { success: false, error: e?.message || "Failed to finalize content report." };
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    submitting,
    submitReport: processReportSubmission
  };
}
