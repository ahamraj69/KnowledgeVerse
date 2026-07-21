import { UserProfile } from "@/types/profile";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Collections } from "../firebaseCollections";

/**
 * Retrieves a targeted user profile record from the users directory.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, Collections.USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

/**
 * Commits a baseline fallback user template profile down to the database.
 */
export async function createUserProfile(uid: string, email: string, name: string): Promise<UserProfile> {
  const baseProfile: UserProfile = {
    uid,
    displayName: name || "Student",
    name: name || "Student", // ✅ FIXED: Populating fallback variable matches contract types
    email: email || "",
    role: "student", // ✅ FIXED: Assigning structural platform security user role identity mapping
    photoURL: "",
    bio: "",
    school: "",
    grade: "",
    country: "India",
    language: "English",
    interests: [],
    learningGoal: "",
    dailyGoalMinutes: 30,
    streak: 0,
    longestStreak: 0,
    studyHours: 0,
    completedCourses: 0,
    completedLessons: 0,
    quizAverage: 0,
    aiChats: 0,
    bookmarks: 0,
    certificates: 0,
    achievements: ["First Lesson"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(doc(db, Collections.USERS, uid), baseProfile);
  return baseProfile;
}

/**
 * Modifies selective biographical tracking properties safely on a target profile.
 */
export async function updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const ref = doc(db, Collections.USERS, uid);
  await updateDoc(ref, {
    ...data,
    updatedAt: Date.now(),
  });
}

/**
 * Commits new content asset URLs safely down to image attribute descriptors.
 */
export async function updatePhoto(uid: string, photoURL: string): Promise<void> {
  await updateProfile(uid, { photoURL });
}

/**
 * Dynamically aggregates metric parameters from related sub-collections to lock down live progress analytics.
 */
export async function updateLearningStats(uid: string): Promise<void> {
  try {
    const bookmarksQuery = query(collection(db, Collections.BOOKMARKS), where("userId", "==", uid));
    const bookmarksSnap = await getDocs(bookmarksQuery);

    const chatsQuery = query(collection(db, Collections.AI_CHATS), where("userId", "==", uid));
    const chatsSnap = await getDocs(chatsQuery);

    await updateProfile(uid, {
      bookmarks: bookmarksSnap.size,
      aiChats: chatsSnap.size,
    });
  } catch (e) {
    console.log("Stats compilation fallback tracking fault caught: ", e);
  }
}
