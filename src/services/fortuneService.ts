
import { FortuneResult } from '../types';
import { PERIOD_9_RULES, GUA_BOUNDARIES, TOLERANCE_DEG, GUA_DEFINITIONS } from '../constants';

function normalizeAngle(deg: number): number {
  return (deg % 360 + 360) % 360;
}

function getShortestAngle(a: number, b: number): number {
  const diff = Math.abs(a - b);
  return Math.min(diff, 360 - diff);
}

export function isBorderline(deg: number): boolean {
  for (const boundary of GUA_BOUNDARIES) {
    if (getShortestAngle(deg, boundary) <= TOLERANCE_DEG) {
      return true;
    }
  }
  return false;
}

export function getGuaFromDegree(deg: number): { name: string; dir: string } {
    const normalizedDeg = normalizeAngle(deg);
    for (const gua of GUA_DEFINITIONS) {
        const [start, end] = gua.range;
        if (start > end) { // Wraps around 360/0 (e.g., N)
            if (normalizedDeg >= start || normalizedDeg < end) {
                return { name: gua.name, dir: gua.dir };
            }
        } else {
            if (normalizedDeg >= start && normalizedDeg < end) {
                return { name: gua.name, dir: gua.dir };
            }
        }
    }
    return { name: '坎', dir: 'N' }; // Fallback for 0 degree
}

export function calculateFortune(northDeg: number, userDeg: number, relativeDeg: number | null, absoluteDeg: number | null): FortuneResult {
  let finalAbsDeg: number;

  if (absoluteDeg !== null) {
    // Direct absolute input, northDeg is ignored in this path
    finalAbsDeg = normalizeAngle(absoluteDeg);
  } else {
    // Relative calculation
    const userAbsoluteDeg = normalizeAngle(userDeg - northDeg);
    finalAbsDeg = normalizeAngle(userAbsoluteDeg + (relativeDeg ?? 0));
  }

  const borderline = isBorderline(finalAbsDeg);
  const { name: gua, dir: direction } = getGuaFromDegree(finalAbsDeg);

  let fortune_status: '氣吉' | '氣偏悶' | '邊界保守';
  let copy: string;

  if (borderline) {
    fortune_status = '邊界保守';
    copy = PERIOD_9_RULES.copy_presets['邊界保守'];
  } else {
    type GuaName = keyof typeof PERIOD_9_RULES.fortune_map;
    const fortuneInfo = PERIOD_9_RULES.fortune_map[gua as GuaName];
    if (fortuneInfo) {
      fortune_status = fortuneInfo.status as '氣吉' | '氣偏悶';
      copy = PERIOD_9_RULES.copy_presets[fortune_status];
    } else {
      fortune_status = '邊界保守'; // Fallback if rule not found
      copy = PERIOD_9_RULES.copy_presets['邊界保守'];
    }
  }

  return {
    abs_deg: Math.round(finalAbsDeg),
    direction,
    gua,
    borderline,
    fortune_status,
    copy,
  };
}
