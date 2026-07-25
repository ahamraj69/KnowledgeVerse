import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Collections } from "../firebaseCollections";
import { Alert } from "react-native";

export interface CompletePortableDataArchive {
  generatedAt: number;
  userProfile: Record<string, any>;
  learningProgress: Record<string, any>;
  bookmarks: Record<string, any>;
  verificationStatus: Record<string, any>;
}

/**
 * Packs comprehensive user document parameters into an exportable archive [INDEX].
 */
export async function generateUserDataPortabilityExport(): Promise<CompletePortableDataArchive | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    const uid = currentUser.uid;
    
    const [userSnap, progressSnap, bookmarkSnap, verifySnap] = await Promise.all([
      getDoc(doc(db, Collections.USERS, uid)),
      getDoc(doc(db, "userProgress", uid)),
      getDoc(doc(db, "bookmarks", uid)),
      getDoc(doc(db, "teacherVerification", uid))
    ]);

    const dataArchive: CompletePortableDataArchive = {
      generatedAt: Date.now(),
      userProfile: userSnap.exists() ? userSnap.data() : {},
      learningProgress: progressSnap.exists() ? progressSnap.data() : {},
      bookmarks: bookmarkSnap.exists() ? bookmarkSnap.data() : {},
      verificationStatus: verifySnap.exists() ? verifySnap.data() : {}
    };

    Alert.alert("Export Ready 🎉", "Your operational personal dataset package has been compiled cleanly.");
    return dataArchive;
  } catch (error) {
    console.log("Error compilation data export bundle: ", error);
    return null;
  }
}
