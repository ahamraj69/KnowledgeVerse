import { auth } from "@/lib/firebase";
import { getVerification, submitVerification, uploadVerificationFile } from "@/lib/verificationService";
import { VerificationRequest } from "@/types/verification";
import { useCallback, useEffect, useState } from "react";

export function useVerification() {
  const [activeRequest, setActiveRequest] = useState<VerificationRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const userId = auth.currentUser?.uid || "";

  const checkExistingRequest = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const request = await getVerification(userId);
      setActiveRequest(request);
    } catch (e) {
      console.log("Error assessing credential profiles tracking:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const processFormSubmission = useCallback(async (
    formData: { fullName: string; phone: string; country: string; experience: number; bio: string; subjects: string[] },
    files: { profileBlob: Blob | null; idBlob: Blob | null; certBlob: Blob | null },
    onProgressUpdate: (fileKey: string, percent: number) => void
  ) => {
    if (!userId || !files.profileBlob || !files.idBlob) {
      throw new Error("Missing required file assets context.");
    }

    try {
      setSubmitting(true);

      // 1. Dispatch profile picture stream to cloud buckets
      const profilePhotoURL = await uploadVerificationFile(userId, "profile.jpg", files.profileBlob, (p) => onProgressUpdate("profile", p));

      // 2. Dispatch identification document stream to cloud buckets
      const idDocumentURL = await uploadVerificationFile(userId, "government-id.jpg", files.idBlob, (p) => onProgressUpdate("idDoc", p));

      // 3. Dispatch certification document stream if present
      let certificateURL = "";
      if (files.certBlob) {
        certificateURL = await uploadVerificationFile(userId, "certificate.pdf", files.certBlob, (p) => onProgressUpdate("cert", p));
      }

      // 4. Commit aggregated metadata parameters down to database registries
      await submitVerification({
        teacherId: userId,
        fullName: formData.fullName,
        phone: formData.phone,
        country: formData.country,
        experience: Number(formData.experience),
        bio: formData.bio,
        subjects: formData.subjects,
        profilePhotoURL,
        idDocumentURL,
        certificateURL: certificateURL || undefined,
        status: "pending"
      });

      await checkExistingRequest();
    } catch (e) {
      console.log("Submission breakdown intercept loop trace:", e);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [userId, checkExistingRequest]);

  useEffect(() => {
    checkExistingRequest();
  }, [checkExistingRequest]);

  return {
    activeRequest,
    loading,
    submitting,
    submitRequest: processFormSubmission,
    refreshStatus: checkExistingRequest,
    isPending: activeRequest?.status === "pending"
  };
}
