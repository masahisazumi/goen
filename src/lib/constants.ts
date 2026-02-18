export const VENDOR_CATEGORIES = [
  { id: "kitchen-car", label: "キッチンカー", icon: "Truck", description: "キッチンカー・フードトラック" },
  { id: "handmade", label: "ハンドメイドショップ", icon: "Palette", description: "ハンドメイド・クラフト作品" },
  { id: "other", label: "その他", icon: "Package", description: "その他の出店者" },
] as const;

export const VENDOR_CATEGORY_LABELS = VENDOR_CATEGORIES.map(c => c.label);

export const SEARCH_CATEGORIES = ["すべて", ...VENDOR_CATEGORY_LABELS];

export const AREAS = [
  "すべて",
  "東京都",
  "神奈川県",
  "埼玉県",
  "千葉県",
  "大阪府",
  "京都府",
  "兵庫県",
  "愛知県",
  "福岡県",
  "北海道",
  "その他",
];
