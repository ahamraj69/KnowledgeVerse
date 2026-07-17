import { db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly";
  aiMessages: number;
  premiumCourses: boolean;
  certificates: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Tier",
    price: 0,
    duration: "monthly",
    aiMessages: 30,
    premiumCourses: false,
    certificates: true,
  },
  {
    id: "premium_monthly",
    name: "Premium Monthly",
    price: 199,
    duration: "monthly",
    aiMessages: 1000,
    premiumCourses: true,
    certificates: true,
  },
  {
    id: "premium_yearly",
    name: "Premium Yearly",
    price: 1999,
    duration: "yearly",
    aiMessages: 15000,
    premiumCourses: true,
    certificates: true,
  },
];

export interface UserSubscription {
  planId: string;
  expiresAt: number;
}

export const saveSubscription = async (
  uid: string,
  subscription: UserSubscription
): Promise<void> => {
  await setDoc(doc(db, "subscriptions", uid), subscription);
};

export const getSubscription = async (uid: string): Promise<UserSubscription | null> => {
  const snap = await getDoc(doc(db, "subscriptions", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserSubscription;
};

export const subscribeSubscription = (
  uid: string,
  callback: (subscription: UserSubscription | null) => void
) => {
  return onSnapshot(
    doc(db, "subscriptions", uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback(snapshot.data() as UserSubscription);
    },
    (error) => {
      if (__DEV__) {
        console.log("Subscription channel mapping failure:", error);
      }
    }
  );
};

export const hasPremiumAccess = (subscription: UserSubscription | null): boolean => {
  if (!subscription) return false;
  return (
    subscription.planId !== "free" &&
    subscription.expiresAt > Date.now()
  );
};

/**
 * ✅ Step 1: Simulated upgrade pipeline calculates timeline horizons natively
 */
export const activatePlan = async (uid: string, planId: string): Promise<void> => {
  let durationDays = 30;

  if (planId === "premium_yearly") {
    durationDays = 365;
  }

  if (planId === "free") {
    durationDays = 0;
  }

  const expiresAt =
    durationDays === 0
      ? 0
      : Date.now() + durationDays * 24 * 60 * 60 * 1000;

  await saveSubscription(uid, {
    planId,
    expiresAt,
  });
};
