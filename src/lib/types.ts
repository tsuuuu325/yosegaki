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
  wedding: "Wedding（上品）",
  farewell: "Farewell（落ち着き）",
  team: "Team（躍動）",
  birthday: "Birthday（華やか）",
  classicMono: "Classic（モノクロ）",
  naturalBotanical: "Botanical（自然）",
  popNeon: "Neon Pop（にぎやか）",
  japandi: "Japandi（和モダン）",
};

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
