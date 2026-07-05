import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * 🛠️ Firebase Project Production Credentials
 */
const firebaseConfig = {
  apiKey: "AIzaSyAr38ZS9tnCifA2stYihZ6uO5Y4v40BAAw",
  authDomain: "knowledgeverse-123.firebaseapp.com", // ✅ FIX: Valid domain configuration fixed
  projectId: "knowledgeverse-123",
  storageBucket: "knowledgeverse-123.firebasestorage.app",
  messagingSenderId: "833231039240",
  appId: "1:833231039240:web:43a66c0f5c997b6ff79abd",
};

// Securely initialize the native Firebase application engine instance
const app = initializeApp(firebaseConfig);

/**
 * 🔐 Persistent Authentication Instance
 * Configured with cross-platform native React Native local AsyncStorage layers
 */
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * 🗄️ Firestore Database Context Connection Instance
 */
export const db = getFirestore(app);

/**
 * 📦 Firebase Cloud Storage Assets File Upload Instance
 */
export const storage = getStorage(app);

export default app;
