import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 1. Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAr38ZS9tnCifA2stYihZ6uO5Y4v40BAAw",
  authDomain: "knowledgeverse-123.firebaseapp.com",
  projectId: "knowledgeverse-123",
  storageBucket: "knowledgeverse-123.firebasestorage.app",
  messagingSenderId: "833231039240",
  appId: "1:833231039240:web:43a66c0f5c997b6ff79abd",
};

// 2. Prevent re-initialization during hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 3. Cast the dynamic package module to get the React Native persistence handler
// This bypasses the strict type error while keeping the correct function at runtime
const getReactNativePersistence =
  (firebaseAuth as any).getReactNativePersistence;

// Explicitly typed instance to conform with strict compiler tracking options
let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = firebaseAuth.getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
