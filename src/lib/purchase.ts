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

// カウントダウン公開（公開日時になるまで内容を隠す）の追加料金
export const COUNTDOWN_PRICE = 200;

export function priceForTier(tier: PaidTier): number {
  return TIER_PRICE[tier];
}

// プラン料金＋（カウントダウン公開を使う場合）追加料金の合計
export function totalPrice(tier: PaidTier, hasCountdown: boolean): number {
  return priceForTier(tier) + (hasCountdown ? COUNTDOWN_PRICE : 0);
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
// Stripeの決済ページを発行し、そのURLへ移動する。
// 実際に「支払い済み」としてDBを更新するのは、支払い完了後にStripeから
// 届くwebhook（src/app/api/webhooks/stripe/route.ts）だけが行う。
export async function startCheckout(
  boardId: string,
  revealAt?: string | null
): Promise<{ error?: string }> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ boardId, origin: window.location.origin, revealAt }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? "決済ページの作成に失敗しました" };
  }

  const { url } = (await res.json()) as { url: string };
  window.location.href = url;
  return {};
}
