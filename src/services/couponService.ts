import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

export interface Coupon {
  id: string;
  code: string;
  type: "fixed" | "percentage";
  discount: number;
  expiry: number;
  active: boolean;
  oneTime: boolean;
}

/**
 * Validates a submitted coupon string by cross-referencing cloud Firestore records.
 * Throws precise context error strings to provide high-fidelity user feedback [INDEX].
 */
export const validateCoupon = async (code: string): Promise<Coupon> => {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    throw new Error("Please enter a valid coupon code.");
  }

  const q = query(collection(db, "coupons"), where("code", "==", cleanCode));
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error("This coupon code does not exist.");
  }

  const matchedDoc = snap.docs[0];
  const data = matchedDoc.data();

  const coupon: Coupon = {
    id: matchedDoc.id,
    code: data.code || cleanCode,
    type: data.type === "percentage" ? "percentage" : "fixed",
    discount: Number(data.discount) || 0,
    expiry: Number(data.expiry) || 0,
    active: data.active ?? false,
    oneTime: data.oneTime ?? false,
  };

  // ✅ Step 2 FIXED: Clear, descriptive thrown exceptions replace broad null assignments
  if (!coupon.active) {
    throw new Error("Coupon inactive");
  }

  if (coupon.expiry && Date.now() > coupon.expiry) {
    throw new Error("Coupon expired");
  }

  return coupon;
};

export const calculateDiscount = (originalPrice: number, coupon: Coupon): number => {
  if (coupon.type === "fixed") {
    return Math.max(0, originalPrice - coupon.discount);
  }

  const reduction = (originalPrice * coupon.discount) / 100;
  return Math.max(0, Math.round(originalPrice - reduction));
};

export const hasRedeemedCoupon = async (userId: string, code: string): Promise<boolean> => {
  try {
    const ref = doc(db, "users", userId, "couponHistory", code.toUpperCase());
    const snap = await getDoc(ref);
    return snap.exists();
  } catch (e) {
    return false;
  }
};

export const redeemCoupon = async (userId: string, coupon: Coupon): Promise<void> => {
  const ref = doc(db, "users", userId, "couponHistory", coupon.code.toUpperCase());
  await setDoc(ref, {
    code: coupon.code.toUpperCase(),
    redeemedAt: Date.now(),
  });
};
