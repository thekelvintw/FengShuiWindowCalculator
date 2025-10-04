
export const PERIOD_9_RULES = {
  period: 9,
  version: "2025-09-29",
  border_policy: { tolerance_deg: 10, edge_behavior: "conservative" },
  direction_map: {
    "坎": { "dir": "N",  "center_deg": 0   },
    "艮": { "dir": "NE", "center_deg": 45  },
    "震": { "dir": "E",  "center_deg": 90  },
    "巽": { "dir": "SE", "center_deg": 135 },
    "離": { "dir": "S",  "center_deg": 180 },
    "坤": { "dir": "SW", "center_deg": 225 },
    "兌": { "dir": "W",  "center_deg": 270 },
    "乾": { "dir": "NW", "center_deg": 315 }
  },
  fortune_map: {
    "乾": { "status": "氣吉" },
    "兌": { "status": "氣吉" },
    "艮": { "status": "氣吉" },
    "離": { "status": "氣吉" },
    "坎": { "status": "氣偏悶" },
    "震": { "status": "氣偏悶" },
    "巽": { "status": "氣偏悶" },
    "坤": { "status": "氣偏悶" }
  },
  copy_presets: {
    "氣吉": "這個方向今年很給力，開個縫，讓好氣進來。",
    "氣偏悶": "這邊的氣今年不太提神，先別開，必要時只留一點縫就好。",
    "邊界保守": "角度卡在邊線，先收起來，等量得更準再說。"
  }
};

export const TOLERANCE_DEG = PERIOD_9_RULES.border_policy.tolerance_deg;

export const GUA_BOUNDARIES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

export const GUA_DEFINITIONS: { name: string; dir: string; range: [number, number] }[] = [
    { name: '坎', dir: 'N', range: [337.5, 22.5] },
    { name: '艮', dir: 'NE', range: [22.5, 67.5] },
    { name: '震', dir: 'E', range: [67.5, 112.5] },
    { name: '巽', dir: 'SE', range: [112.5, 157.5] },
    { name: '離', dir: 'S', range: [157.5, 202.5] },
    { name: '坤', dir: 'SW', range: [202.5, 247.5] },
    { name: '兌', dir: 'W', range: [247.5, 292.5] },
    { name: '乾', dir: 'NW', range: [292.5, 337.5] },
];

export const MAX_GUEST_RECORDS = 5;
