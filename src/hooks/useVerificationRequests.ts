import { approveTeacher, getRequestsByStatus, updateRequestStatus } from "@/lib/verificationAdminService";
import { VerificationRequest, VerificationStatus } from "@/types/verification";
import { useCallback, useState } from "react";

export function useVerificationRequests() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async (status: VerificationStatus) => {
    try {
      setLoading(true);
      const data = await getRequestsByStatus(status);
      setRequests(data);
    } catch (e) {
      console.log("Error loading pending queue loops:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requests,
    loading,
    loadQueue: fetchRequests,
    approve: approveTeacher,
    updateStatus: updateRequestStatus
  };
}
