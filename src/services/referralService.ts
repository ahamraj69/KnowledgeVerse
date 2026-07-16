import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface ReferralProfile {
  code: string;
  referredBy?: string;
  rewardPoints: number;
}

export const generateReferralCode = (uid: string): string => {
  return (
    "KV" +
    uid.substring(0, 6).toUpperCase()
  );
};

export const createReferralProfile = async (uid: string): Promise<void> => {
  try {
    const ref = doc(db, "referrals", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) return;

    await setDoc(ref, {
      code: generateReferralCode(uid),
      rewardPoints: 0,
    });
  } catch (error) {
    if (__DEV__) {
      console.log("Referral initialization exception caught:", error);
    }
  }
};

export const getReferralProfile = async (uid: string): Promise<ReferralProfile | null> => {
  const snap = await getDoc(doc(db, "referrals", uid));

  if (!snap.exists()) return null;

  return snap.data() as ReferralProfile;
};

export const subscribeReferralProfile = (
  uid: string,
  callback: (profile: ReferralProfile | null) => void
) => {
  return onSnapshot(
    doc(db, "referrals", uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback(snapshot.data() as ReferralProfile);
    },
    (error) => {
      if (__DEV__) {
        console.log("Referral snapshot streaming error:", error);
      }
    }
  );
};

export const addRewardPoints = async (uid: string, points: number): Promise<void> => {
  await updateDoc(
    doc(db, "referrals", uid),
    {
      rewardPoints: increment(points),
    }
  );
};

export const applyReferralCode = async (
  currentUserId: string,
  referralCode: string
): Promise<string> => {
  try {
    const cleanCode = referralCode.trim().toUpperCase();
    if (!cleanCode) return "Please enter a code.";

    const q = query(
      collection(db, "referrals"),
      where("code", "==", cleanCode)
    );

    const result = await getDocs(q);

    if (result.empty) {
      return "Referral code not found.";
    }

    const referrerDoc = result.docs[0];
    const referrerId = referrerDoc.id;

    if (referrerId === currentUserId) {
      return "You cannot use your own referral code.";
    }

    const currentUserRef = doc(db, "referrals", currentUserId);
    const currentSnap = await getDoc(currentUserRef);

    if (!currentSnap.exists()) {
      return "Referral profile not found.";
    }

    const currentData = currentSnap.data() as ReferralProfile;

    if (currentData.referredBy) {
      return "Referral already used.";
    }

    await updateDoc(currentUserRef, {
      referredBy: referrerId,
    });

    await addRewardPoints(referrerId, 100);

    return "Referral applied successfully!";
  } catch (error) {
    if (__DEV__) console.log("Apply code failure tracing intercept:", error);
    return "Unable to apply referral code.";
  }
};

/**
 * ✅ Step 2: Subscribes to reverse query snapshot metrics to compute current counts
 */
export const subscribeReferralHistory = (
  uid: string,
  callback: (count: number) => void
) => {
  const q = query(
    collection(db, "referrals"),
    where("referredBy", "==", uid)
  );

  return onSnapshot(q, (snapshot) => {
    // Passes the continuous size property cleanly down the state dispatcher loop
    callback(snapshot.size);
  }, (error) => {
    if (__DEV__) console.log("Referral history tracking thread fault:", error);
  });
};
