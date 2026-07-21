import { UserSettings } from "@/types/settings";
import { deleteUser, sendEmailVerification, signOut, updatePassword } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Collections } from "../firebaseCollections";

const defaultSettings: UserSettings = {
  language: "English",
  darkMode: true,
  notifications: true,
  emailNotifications: false,
  aiSuggestions: true,
  publicProfile: true,
  biometricLogin: false,
  autoPlayVideos: true,
  downloadOnWifiOnly: true,
  updatedAt: Date.now()
};

export async function getSettings(uid: string): Promise<UserSettings> {
  const ref = doc(db, Collections.USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists() || !snap.data().settings) {
    return defaultSettings;
  }
  return snap.data().settings as UserSettings;
}

export async function updateSettings(uid: string, data: Partial<UserSettings>): Promise<void> {
  const ref = doc(db, Collections.USERS, uid);
  const snap = await getDoc(ref);
  const currentSettings = snap.exists() && snap.data().settings ? snap.data().settings : defaultSettings;
  
  await updateDoc(ref, {
    settings: {
      ...currentSettings,
      ...data,
      updatedAt: Date.now()
    }
  });
}

export async function resetSettings(uid: string): Promise<void> {
  const ref = doc(db, Collections.USERS, uid);
  await updateDoc(ref, { settings: defaultSettings });
}

export async function executeLogout(): Promise<void> {
  await signOut(auth);
}

export async function verifyUserEmail(): Promise<void> {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
}

export async function updateUserPassword(password: string): Promise<void> {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, password);
  }
}

export async function executeAccountDeletion(uid: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Unauthenticated user scope layout context.");

  // Wipe associated data nodes atomically before deleting auth identity
  const userDocRef = doc(db, Collections.USERS, uid);
  await deleteDoc(userDocRef);

  const clearCollections = [Collections.BOOKMARKS, Collections.AI_CHATS, Collections.COURSE_PROGRESS, Collections.NOTIFICATIONS];
  for (const collectionName of clearCollections) {
    const q = query(collection(db, collectionName), where("userId", "==", uid));
    const snap = await getDocs(q);
    snap.docs.forEach(async (d) => await deleteDoc(doc(db, collectionName, d.id)));
  }

  await deleteUser(user);
}
