import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  teacherId: string;
  amount: number;
  teacherAmount: number;
  platformFee: number;
  createdAt: any;
}

export async function getTeacherPayments(
  teacherId: string
): Promise<Payment[]> {
  const q = query(
    collection(db, "payments"),
    where("teacherId", "==", teacherId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Payment, "id">),
  }));
}

export function calculateEarnings(payments: Payment[]) {
  const totalRevenue = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const teacherRevenue = payments.reduce(
    (sum, p) => sum + p.teacherAmount,
    0
  );

  const platformRevenue = payments.reduce(
    (sum, p) => sum + p.platformFee,
    0
  );

  return {
    totalRevenue,
    teacherRevenue,
    platformRevenue,
    totalSales: payments.length,
  };
}