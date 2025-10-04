// src/types.ts
export type Mode = 'sitting' | 'lying'  // 坐著 / 躺著

export type FortuneStatus = '氣吉' | '氣偏悶' | '氣不夠好'

export interface ResultRecord {
  id?: string
  room?: string | null
  mode: Mode
  userDeg: number         // 使用者面向（或床頭）絕對度
  relDeg: number          // 開口相對度
  absDeg: number          // 開口推回的絕對度
  gua: string             // 卦象（乾/兌/坎/離/艮/震/巽/坤）
  fortuneStatus: FortuneStatus
  advice: string          // 建議文案
  copy?: string           // 分享/複製文案
  createdAt?: number | Date
}

// 可選：登入使用者最小型
export interface AuthUserLite {
  uid: string
  displayName?: string | null
  photoURL?: string | null
  email?: string | null
}
