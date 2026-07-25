import { deleteDoc, doc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth, db } from "../firebase";
import { Collections } from "../firebaseCollections";

/**
 * Executes a complete deletion purge across all platform data stores for the current user.
 */
export async function executeCompleteAccountDataPurge(): Promise<{ success: boolean; message: string }> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, message: "No active authenticated session detected." };
  }

  const userId = currentUser.uid;

  try {
    console.log(`[PRIVACY ENGINE] Initializing cascade deletion sequence for UID: ${userId}`);

    // 1. Purge Core Student Profile Metadata Document
    await deleteDoc(doc(db, Collections.USERS, userId));

    // 2. Clear Learning Progress Tracking Documents [1]
    await deleteDoc(doc(db, "userProgress", userId));
    await deleteDoc(doc(db, "courseProgress", userId));

    // 3. Delete Sub-Collection Subscriptions and Bookmarks Shards [1]
    await deleteDoc(doc(db, "bookmarks", userId));
    await deleteDoc(doc(db, "lessonProgress", userId));

    // 4. Remove Secondary Verification Requests Entries [1]
    await deleteDoc(doc(db, "teacherVerification", userId));

    // 5. Finalize by terminating the identity reference pointer inside Firebase Auth [1]
    await deleteUser(currentUser);

    console.log(`[PRIVACY ENGINE] Cascade deletion completed for UID: ${userId}`);
    return { success: true, message: "Account data completely purged from platform registers." };
  } catch (error: any) {
    console.log("CRITICAL PRIVACY EXCEPTION: Account deletion routine failed: ", error);
    return { 
      success: false, 
      message: error?.message || "Data purge aborted. Re-authentication might be required." 
    };
  }
}
