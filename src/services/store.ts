import { auth, db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

// TypeScript 型別定義
export interface FortuneRecord {
  id: string;
  room: string;
  mode: 'manual' | 'compass';
  user_deg: number;
  rel_deg: number | null;
  abs_deg: number | null;
  gua: string;
  fortune_status: string;
  advice: string;
  copy: string;
  created_at: string;
}

// 將 SavedRecord 轉換為 FortuneRecord
const convertToFortuneRecord = (record: any): FortuneRecord => ({
  id: record.id,
  room: record.room,
  mode: record.mode,
  user_deg: record.userDeg,
  rel_deg: record.relativeDeg,
  abs_deg: record.absoluteDeg,
  gua: record.gua,
  fortune_status: record.fortuneStatus,
  advice: record.advice,
  copy: record.copy,
  created_at: record.createdAt,
});

// 將 FortuneRecord 轉換為 SavedRecord
const convertToSavedRecord = (record: FortuneRecord): any => ({
  id: record.id,
  room: record.room,
  mode: record.mode,
  userDeg: record.user_deg,
  relativeDeg: record.rel_deg,
  absoluteDeg: record.abs_deg,
  northDeg: 0, // 這個需要從其他地方獲取
  gua: record.gua,
  fortuneStatus: record.fortune_status,
  advice: record.advice,
  copy: record.copy,
  createdAt: record.created_at,
});

// 保存記錄到 Firestore
export const saveRecord = async (record: any): Promise<void> => {
  if (auth.currentUser) {
    try {
      const fortuneRecord = convertToFortuneRecord(record);
      const recordsRef = collection(db, 'users', auth.currentUser.uid, 'records');
      await setDoc(doc(recordsRef, record.id), fortuneRecord);
    } catch (error) {
      console.error('Failed to save record to Firestore:', error);
      throw error;
    }
  } else {
    // Fallback 到 localStorage
    const existingRecords = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
    const updatedRecords = [record, ...existingRecords];
    localStorage.setItem('fortuneRecords', JSON.stringify(updatedRecords));
  }
};

// 列出記錄
export const listRecords = async (): Promise<any[]> => {
  if (auth.currentUser) {
    try {
      const recordsRef = collection(db, 'users', auth.currentUser.uid, 'records');
      const q = query(recordsRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => convertToSavedRecord(doc.data() as FortuneRecord));
    } catch (error) {
      console.error('Failed to fetch records from Firestore:', error);
      return [];
    }
  } else {
    // Fallback 到 localStorage
    return JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
  }
};

// 更新記錄
export const updateRecord = async (record: any): Promise<void> => {
  if (auth.currentUser) {
    try {
      const fortuneRecord = convertToFortuneRecord(record);
      const recordsRef = collection(db, 'users', auth.currentUser.uid, 'records');
      await updateDoc(doc(recordsRef, record.id), fortuneRecord);
    } catch (error) {
      console.error('Failed to update record in Firestore:', error);
      throw error;
    }
  } else {
    // Fallback 到 localStorage
    const existingRecords = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
    const updatedRecords = existingRecords.map((r: any) => 
      r.id === record.id ? record : r
    );
    localStorage.setItem('fortuneRecords', JSON.stringify(updatedRecords));
  }
};

// 刪除記錄
export const deleteRecord = async (recordId: string): Promise<void> => {
  if (auth.currentUser) {
    try {
      const recordsRef = collection(db, 'users', auth.currentUser.uid, 'records');
      await deleteDoc(doc(recordsRef, recordId));
    } catch (error) {
      console.error('Failed to delete record from Firestore:', error);
      throw error;
    }
  } else {
    // Fallback 到 localStorage
    const existingRecords = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
    const updatedRecords = existingRecords.filter((r: any) => r.id !== recordId);
    localStorage.setItem('fortuneRecords', JSON.stringify(updatedRecords));
  }
};

// 檢查是否達到訪客記錄上限
export const reachGuestLimit = (): boolean => {
  const existingRecords = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
  return existingRecords.length >= 5; // MAX_GUEST_RECORDS
};

// 同步本地記錄到雲端
export const syncLocalRecords = async (localRecords: any[]): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to sync records');
  }

  try {
    const recordsRef = collection(db, 'users', auth.currentUser.uid, 'records');
    
    // 獲取現有的雲端記錄
    const existingSnapshot = await getDocs(recordsRef);
    const existingRecords = existingSnapshot.docs.map(doc => doc.data() as FortuneRecord);
    
    // 合併記錄並去重
    const allRecords = [...localRecords, ...existingRecords.map(convertToSavedRecord)];
    const uniqueRecords = Array.from(
      new Map(allRecords.map(item => [item.id, item])).values()
    );
    
    // 保存所有記錄
    const savePromises = uniqueRecords.map(record => saveRecord(record));
    await Promise.all(savePromises);
  } catch (error) {
    console.error('Failed to sync local records:', error);
    throw error;
  }
};

// 遷移本地記錄到雲端
export const migrateLocalToCloud = async (userId: string): Promise<void> => {
  try {
    const localRecords = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
    if (localRecords.length > 0) {
      await syncLocalRecords(localRecords);
      // 清空本地記錄
      localStorage.removeItem('fortuneRecords');
    }
  } catch (error) {
    console.error('Failed to migrate local records to cloud:', error);
    throw error;
  }
};
