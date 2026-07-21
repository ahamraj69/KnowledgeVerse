import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface TeacherVerification {
  uid: string;
  fullName: string;
  qualification: string;
  specialization: string;
  experience: string;
  bio: string;
  profilePhoto: string;
  idDocument: string;
  certificateDocument: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt: number;
}

export const submitVerification = async (
  verification: TeacherVerification
): Promise<void> => {
  await setDoc(
    doc(db, "teacherVerification", verification.uid),
    verification
  );
};

export const getVerification = async (
  uid: string
): Promise<TeacherVerification | null> => {
  const snap = await getDoc(doc(db, "teacherVerification", uid));

  if (!snap.exists()) return null;

  return snap.data() as TeacherVerification;
};
