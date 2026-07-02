import { supabase } from "./supabase";
import type { Board, PaidTier } from "./types";

// ===== 料金・人数のルール（Kudoboardの料金体系に合わせてある） =====
// 参考: Kudoboard Lite $5.99(20件まで) / Premium $8.99(100件まで) / Milestone $19.99(無制限)

// 投稿を受け付ける絶対上限（Milestone＝無制限の技術的な安全上限）
export const MAX_POSTS = 150;

const TIER_ORDER: PaidTier[] = ["lite", "premium", "milestone"];

// 各プランでカバーできる投稿数の上限（milestoneはMAX_POSTSまでを「無制限」として扱う）
const TIER_MAX_POSTS: Record<PaidTier, number> = {
  lite: 20,
  premium: 100,
  milestone: MAX_POSTS,
};

const TIER_PRICE: Record<PaidTier, number> = {
  lite: 900,
  premium: 1350,
  milestone: 3000,
};

const TIER_LABEL: Record<PaidTier, string> = {
  lite: "ライトプラン（20件まで）",
  premium: "プレミアムプラン（100件まで）",
  milestone: "マイルストーンプラン（無制限）",
};

export function priceForTier(tier: PaidTier): number {
  return TIER_PRICE[tier];
}

export function labelForTier(tier: PaidTier): string {
  return TIER_LABEL[tier];
}

// 投稿数に応じて、必要な購入プランを返す
export function requiredTier(postCount: number): PaidTier {
  return (
    TIER_ORDER.find((tier) => postCount <= TIER_MAX_POSTS[tier]) ?? "milestone"
  );
}

// 「支払い済みで、透かし無し書き出しができる状態か」を判定する。
// 投稿数が増えて現在のプランの上限を超えた場合は、上位プランへの
// アップグレードが必要になる（falseが返る）。
export function isFullyPaid(board: Board, postCount: number): boolean {
  if (!board.paid_tier) return false;
  const owned = TIER_ORDER.indexOf(board.paid_tier);
  const required = TIER_ORDER.indexOf(requiredTier(postCount));
  return owned >= required;
}

// ===== 購入処理 =====
// ※現在は仮実装：ボタンを押すとすぐ購入済みになる。
//   リリース時はこの関数の中身だけをStripe決済（チェックアウト→Webhookで
//   paid_tier更新）に差し替える。呼び出し側は変更不要。
export async function purchaseBoard(
  boardId: string,
  tier: PaidTier
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from("boards")
    .update({ paid_tier: tier, is_paid: true })
    .eq("id", boardId);
  return error ? { error: error.message } : {};
}
