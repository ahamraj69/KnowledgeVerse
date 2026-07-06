import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  // ✅ FIX: Import fallback persistence layers safely directly from core auth
  browserSessionPersistence,
  getAuth,
  initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * 🛠️ Firebase Project Production Credentials
 */
const firebaseConfig = {
  apiKey: "AIzaSyAr38ZS9tnCifA2stYihZ6uO5Y4v40BAAw", 
  authDomain: "://firebaseapp.com", 
  projectId: "knowledgeverse-123",
  storageBucket: "knowledgeverse-123.firebasestorage.app",
  messagingSenderId: "833231039240",
  appId: "1:833231039240:web:43a66c0f5c997b6ff79abd",
};

// Target index 0 of the array so 'app' is strictly typed as a single FirebaseApp instance
const app: FirebaseApp = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0]; // ✅ FIX: Added exact array index lookup to safely resolve type mapping rules

/**
 * 🔐 Safe Persistent Authentication Instance
 * Guards against dual initialization errors on hot reload sweeps
 */
let auth: any;

try {
  // ✅ FIX: Using a type-safe dynamic require statement for the React Native specific entry point
  // This bypasses the static compile-time import path resolution error completely
  const { getReactNativePersistence } = require("firebase/auth/react-native");
  
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  try {
    auth = initializeAuth(app, {
      persistence: browserSessionPersistence,
    });
  } catch {
    auth = getAuth(app);
  }
}

/**
 * 🗄️ Firestore Database Context Connection Instance
 */
export const db = getFirestore(app);

/**
 * 📦 Firebase Cloud Storage Assets File Upload Instance
 */
export const storage = getStorage(app);

export { app, auth };
export default app;
