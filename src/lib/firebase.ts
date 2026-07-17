import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// ✅ FIXED: Storage client initialization functions registered natively
import { getStorage } from "firebase/storage";

// 1. Centralized production-grade Firebase instance credential settings
const firebaseConfig = {
  apiKey: "AIzaSyAr38ZS9tnCifA2stYihZ6uO5Y4v40BAAw",
  authDomain: "knowledgeverse-123.firebaseapp.com",
  projectId: "knowledgeverse-123",
  storageBucket: "knowledgeverse-123.firebasestorage.app",
  messagingSenderId: "833231039240",
  appId: "1:833231039240:web:43a66c0f5c997b6ff79abd",
};

// 2. Prevent instance re-initialization leaks during hot reloads or state cycles
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 3. Extract the React Native persistence driver from the module block safely
const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Explicitly typed instance handles user credential tokens natively
let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Graceful fallback prevents thread crashes if hot-reload invokes initializeAuth twice
  auth = firebaseAuth.getAuth(app);
}

// 4. Initialized state mapping handles
const db = getFirestore(app);
const storage = getStorage(app);

// Universal modular system exports
export { app, auth, db, storage };
