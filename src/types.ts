// src/types.ts

// App 畫面（可依你實際頁面再加）
export type Page = 'home' | 'measure' | 'result' | 'records';

// 坐姿 / 躺姿
export type AppMode = 'sitting' | 'lying';

// 風水吉凶文字（沿用你偏好的文案）
export type FortuneStatus = '氣吉' | '氣偏悶' | '氣不夠好';

// 計算後的結果物件
export interface FortuneResult {
  gua: string;                 // 卦象：乾/兌/坎/離/艮/震/巽/坤
  fortuneStatus: FortuneStatus; // 吉 / 偏悶 / 不夠好
  advice: string;              // 建議文案
}

// 單次量測的狀態（畫面暫存用）
export interface CalculationState {
  room?: string | null;  // 房名（可空）
  mode: AppMode;         // sitting / lying
  userDeg?: number;      // 使用者面向或床頭的「絕對度」
  relDeg?: number;       // 開口相對於人的角度（相對度）
  absDeg?: number;       // 推回的「絕對度」
  gua?: string;          // 推算出的卦
  fortune?: FortuneResult | null; // 該次推算的吉凶物件
}

// 儲存到 localStorage/Firestore 的紀錄
export interface SavedRecord {
  id?: string;                 // Firestore doc id（登入後才會有）
  room?: string | null;
  mode: AppMode;
  userDeg: number;
  relDeg: number;
  absDeg: number;
  gua: string;
  fortuneStatus: FortuneStatus;
  advice: string;
  copy?: string;               // 分享/複製用文案
  createdAt?: number | Date;   // 時間戳
  // 是否已同步到雲端（未登入時為 false）
  isSynced?: boolean;
}

// 也保留你之前可能用到的別名
export type Mode = AppMode;
export interface ResultRecord extends SavedRecord {}
export interface AuthUserLite {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
}