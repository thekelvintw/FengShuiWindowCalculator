import { User, SavedRecord } from '../types';
import { auth, db } from './firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

// --- FIREBASE SERVICE HELPERS ---
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  displayName: firebaseUser.displayName || '',
  photoURL: firebaseUser.photoURL || '',
});

const getRecordsCollection = (userId: string) => collection(db, 'users', userId, 'records');

// --- PUBLIC API ---

export const login = async (): Promise<User | null> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return convertFirebaseUser(result.user);
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const checkSession = (): User | null => {
  // Firebase handles session persistence automatically
  // This function is kept for compatibility but Firebase manages auth state
  return null;
};

export const getCloudRecords = async (userId: string): Promise<SavedRecord[]> => {
  try {
    const recordsRef = getRecordsCollection(userId);
    const snapshot = await getDocs(recordsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedRecord));
  } catch (error) {
    console.error("Failed to get cloud records:", error);
    return [];
  }
};

export const saveAllCloudRecords = async (userId: string, records: SavedRecord[]): Promise<void> => {
  try {
    const recordsRef = getRecordsCollection(userId);
    
    // Delete existing records first
    const existingSnapshot = await getDocs(recordsRef);
    const deletePromises = existingSnapshot.docs.map(docSnapshot => 
      deleteDoc(docSnapshot.ref)
    );
    await Promise.all(deletePromises);
    
    // Save new records
    const savePromises = records.map(record => 
      setDoc(doc(recordsRef, record.id), record)
    );
    await Promise.all(savePromises);
  } catch (error) {
    console.error("Failed to save all cloud records:", error);
  }
};

export const syncRecords = async (userId: string, localRecords: SavedRecord[]): Promise<void> => {
  try {
    const existingRecords = await getCloudRecords(userId);
    const combinedRecords = [...localRecords, ...existingRecords];
    
    // Simple de-duplication based on ID
    const uniqueRecords = Array.from(
      new Map(combinedRecords.map(item => [item.id, item])).values()
    );
    
    uniqueRecords.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    await saveAllCloudRecords(userId, uniqueRecords);
  } catch (error) {
    console.error("Failed to sync records:", error);
  }
};

export const saveCloudRecord = async (userId: string, record: SavedRecord): Promise<void> => {
  try {
    const recordsRef = getRecordsCollection(userId);
    await setDoc(doc(recordsRef, record.id), record);
  } catch (error) {
    console.error("Failed to save cloud record:", error);
  }
};

export const updateCloudRecord = async (userId: string, record: SavedRecord): Promise<void> => {
  try {
    const recordsRef = getRecordsCollection(userId);
    await updateDoc(doc(recordsRef, record.id), record);
  } catch (error) {
    console.error("Failed to update cloud record:", error);
  }
};

export const deleteCloudRecord = async (userId: string, recordId: string): Promise<void> => {
  try {
    const recordsRef = getRecordsCollection(userId);
    await deleteDoc(doc(recordsRef, recordId));
  } catch (error) {
    console.error("Failed to delete cloud record:", error);
  }
};

export const deleteAllUserData = async (userId: string): Promise<void> => {
  try {
    const recordsRef = getRecordsCollection(userId);
    const snapshot = await getDocs(recordsRef);
    const deletePromises = snapshot.docs.map(docSnapshot => 
      deleteDoc(docSnapshot.ref)
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Failed to delete all user data:", error);
  }
};
