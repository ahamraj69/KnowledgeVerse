import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Collections } from "@/lib/firebaseCollections";
import { UserRole } from "@/types/role";

export interface TokenValidationPackage {
  uid: string;
  role: UserRole;
  isActive: boolean;
}

/**
 * Validates the current user context directly against trusted database fields [INDEX].
 */
export async function validateClientTokenClaimsContext(): Promise<TokenValidationPackage | null> {
  const currentFirebaseUser = auth.currentUser;
  if (!currentFirebaseUser) return null;

  try {
    // Read directly from the server snapshot to prevent user role spoofing
    const userDocRef = doc(db, Collections.USERS, currentFirebaseUser.uid);
    const snap = await getDoc(userDocRef);

    if (!snap.exists()) return null;

    const data = snap.data();
    const accountStatus = data.accountStatus || "active";

    return {
      uid: currentFirebaseUser.uid,
      role: (data.role as UserRole) || "student",
      isActive: accountStatus === "active"
    };
  } catch (error) {
    console.log("Security context check aborted:", error);
    return null;
  }
}
