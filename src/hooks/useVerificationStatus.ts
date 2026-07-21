import { auth } from "@/lib/firebase";
import { fetchVerificationStatus } from "@/lib/verificationStatusService";
import { VerificationRequest } from "@/types/verification";
import { useCallback, useEffect, useState } from "react";

export function useVerificationStatus() {
  const [verification, setVerification] = useState<VerificationRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = auth.currentUser?.uid || "";

  const refreshStatus = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchVerificationStatus(userId);
      setVerification(data);
    } catch (e) {
      console.log("Error inside useVerificationStatus driver hook pipeline:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return {
    verification,
    loading,
    refresh: refreshStatus
  };
}
