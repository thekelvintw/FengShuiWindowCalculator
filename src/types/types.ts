export enum Page {
  HOME = 'HOME',
  S1_NORTH = 'S1_NORTH',
  S2_USER = 'S2_USER',
  S3_OPENING = 'S3_OPENING',
  R1_RESULT = 'R1_RESULT',
  R2_POST_SAVE = 'R2_POST_SAVE',
  L1_LIST = 'L1_LIST',
  PROFILE = 'PROFILE',
}

export type AppMode = 'sitting' | 'lying';

export interface CalculationState {
  northDeg: number;
  userDeg: number;
  relativeDeg: number | null;
  absoluteDeg: number | null;
}

export interface FortuneResult {
  abs_deg: number;
  direction: string;
  gua: string;
  borderline: boolean;
  fortune_status: '氣吉' | '氣偏悶' | '邊界保守';
  copy: string;
}

export interface SavedRecord extends CalculationState, FortuneResult {
  id: string;
  room: string;
  mode: AppMode;
  createdAt: string;
}

export interface User {
  id: string; // Corresponds to Google's 'sub'
  email: string;
  displayName: string;
  photoURL: string;
}
