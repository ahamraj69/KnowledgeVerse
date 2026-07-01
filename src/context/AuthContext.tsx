import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

/**
 * 🔐 Auth Context Type
 */
type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

/**
 * 🧠 Create Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 🚀 Provider Component
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 👀 Listen to login state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * 🚪 Logout function
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 📌 Custom Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};