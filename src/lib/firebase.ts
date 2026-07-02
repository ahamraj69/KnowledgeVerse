import { initializeApp } from "firebase/app";

import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Firebase Config
 */
const firebaseConfig = {
  apiKey: "AIzaSyAr38ZS9tnCifA2stYihZ6uO5Y4v40BAAw",
  authDomain: "knowledgeverse-123.firebaseapp.com",
  projectId: "knowledgeverse-123",
  storageBucket: "knowledgeverse-123.firebasestorage.app",
  messagingSenderId: "833231039240",
  appId: "1:833231039240:web:43a66c0f5c997b6ff79abd",
};

const app = initializeApp(firebaseConfig);

/**
 * Persistent Authentication
 */
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Firestore Database
 */
export const db = getFirestore(app);

/**
 * Firebase Storage
 */
export const storage = getStorage(app);

export default app;