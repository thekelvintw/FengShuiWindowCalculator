import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, googleProvider, db } from '../services/firebase';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
});

async function migrateLocalToCloud(uid: string) {
  const raw = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
  if (!Array.isArray(raw) || raw.length === 0) return;
  
  try {
    await Promise.all(
      raw.map((r: any) => addDoc(collection(db, `users/${uid}/records`), { 
        ...r, 
        created_at: serverTimestamp() 
      }))
    );
    localStorage.setItem('fortuneRecords', '[]');
    console.log(`Successfully migrated ${raw.length} records to cloud`);
  } catch (error) {
    console.error('Failed to migrate local records to cloud:', error);
    throw error;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(convertFirebaseUser(firebaseUser));
        // 登入成功後自動遷移本地記錄到雲端
        try {
          await migrateLocalToCloud(firebaseUser.uid);
        } catch (error) {
          console.error('migrate fail', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (): Promise<User | null> => {
    try {
      setLoading(true);
      
      // 先嘗試 signInWithPopup
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return convertFirebaseUser(result.user);
      } catch (popupError) {
        console.log('Popup failed, trying redirect:', popupError);
        
        // 如果 popup 失敗，使用 redirect
        await signInWithRedirect(auth, googleProvider);
        return null; // redirect 會重新載入頁面
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};