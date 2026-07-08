import { db } from "@/lib/firebase";
import { getCache, setCache } from "@/services/cache";
import { collection, getDocs, query, where } from "firebase/firestore";

export interface TransactionReceipt {
  id: string;
  studentName: string;
  courseTitle: string;
  amount: number;
  purchasedAt: number;
}

export interface EarningsLedger {
  grossRevenue: number;
  totalSalesCount: number;
  payoutBalance: number;
  recentTransactions: TransactionReceipt[];
}

const getTeacherEarningsCacheKey = (teacherId: string) => `teacher_earnings_${teacherId}`;

export const getTeacherEarningsData = async (teacherId: string): Promise<EarningsLedger> => {
  const cacheKey = getTeacherEarningsCacheKey(teacherId);
  const cached = getCache<EarningsLedger>(cacheKey);
  if (cached) return cached;

  const salesRef = collection(db, "transactions");
  const q = query(salesRef, where("teacherId", "==", teacherId));
  const snap = await getDocs(q);

  let grossRevenue = 0;
  const recentTransactions: TransactionReceipt[] = [];

  snap.forEach((docItem) => {
    const data = docItem.data();
    const amount = data.amount || 0;
    grossRevenue += amount;

    recentTransactions.push({
      id: docItem.id,
      studentName: data.studentName || "Anonymous Student",
      courseTitle: data.courseTitle || "KnowledgeVerse Course",
      amount: amount,
      purchasedAt: data.purchasedAt || Date.now(),
    });
  });

  recentTransactions.sort((a, b) => b.purchasedAt - a.purchasedAt);

  const ledger: EarningsLedger = {
    grossRevenue,
    totalSalesCount: snap.size,
    payoutBalance: grossRevenue * 0.7, 
    recentTransactions: recentTransactions.slice(0, 5), 
  };

  setCache(cacheKey, ledger);
  return ledger;
};
