// src/types.ts
export type Page = 'home' | 'measure' | 'result' | 'records';
export type AppMode = 'sitting' | 'lying';
export type FortuneStatus = '氣吉' | '氣偏悶' | '氣不夠好';

export interface FortuneResult {
  gua: string;
  fortuneStatus: FortuneStatus;
  advice: string;
}

export interface CalculationState {
  room?: string | null;
  mode: AppMode;
  userDeg?: number;
  relDeg?: number;
  absDeg?: number;
  gua?: string;
  fortune?: FortuneResult | null;
}

export interface SavedRecord {
  id?: string;
  room?: string | null;
  mode: AppMode;
  userDeg: number;
  relDeg: number;
  absDeg: number;
  gua: string;
  fortuneStatus: FortuneStatus;
  advice: string;
  copy?: string;
  createdAt?: number | Date;
  isSynced?: boolean;
}

// 兼容舊稱呼
export type Mode = AppMode;
export interface ResultRecord extends SavedRecord {}
export interface AuthUserLite {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
}