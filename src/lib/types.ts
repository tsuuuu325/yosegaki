export type Occasion =
  | "wedding"
  | "farewell"
  | "graduation"
  | "birthday"
  | "retirement"
  | "other";

export type Theme =
  | "wedding"
  | "farewell"
  | "team"
  | "birthday"
  | "classicMono"
  | "naturalBotanical"
  | "popNeon"
  | "japandi";

export const THEME_ORDER: Theme[] = [
  "wedding",
  "farewell",
  "team",
  "birthday",
  "classicMono",
  "naturalBotanical",
  "popNeon",
  "japandi",
];

export const OCCASION_LABELS: Record<Occasion, string> = {
  wedding: "結婚式",
  farewell: "送別会",
  graduation: "卒団・卒業",
  birthday: "誕生日",
  retirement: "退職祝い",
  other: "その他",
};

export const THEME_LABELS: Record<Theme, string> = {
  wedding: "Wedding",
  farewell: "Farewell",
  team: "Team",
  birthday: "Birthday",
  classicMono: "Classic",
  naturalBotanical: "Botanical",
  popNeon: "Neon Pop",
  japandi: "Japandi",
};

// ギフト（ボード）の表示言語。英語をデフォルトとする。
export type Language = "en" | "ja" | "zh" | "ko" | "es" | "fr" | "de" | "pt";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
];

// Kudoboardの料金体系（Lite/Premium/Milestone）に合わせた3段階プラン
export type PaidTier = "lite" | "premium" | "milestone";

export type Board = {
  id: string;
  slug: string;
  title: string;
  occasion: Occasion;
  theme: Theme;
  event_date: string | null;
  is_paid: boolean;
  paid_tier: PaidTier | null;
  reveal_at: string | null;
  organizer_email: string | null;
  language: Language;
  created_at: string;
};

export type Post = {
  id: string;
  board_id: string;
  author_name: string;
  message: string;
  image_url: string | null;
  created_at: string;
};
