import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { COUNTDOWN_PRICE, priceForTier, labelForTier, requiredTier } from "@/lib/purchase";
import type { PaidTier } from "@/lib/types";

// 決済ページ（Stripe Checkout）のURLを発行するAPI。
// 金額は必ずサーバー側で投稿数から計算し直す（ブラウザから来た金額は信用しない）。
export async function POST(request: Request) {
  const { boardId, origin } = (await request.json()) as {
    boardId: string;
    origin: string;
  };

  if (!boardId || !origin) {
    return NextResponse.json({ error: "パラメータが不足しています" }, { status: 400 });
  }

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("id, slug, title, reveal_at")
    .eq("id", boardId)
    .single();

  if (boardError || !board) {
    return NextResponse.json({ error: "ボードが見つかりません" }, { status: 404 });
  }

  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("board_id", boardId);

  const tier: PaidTier = requiredTier(count ?? 0);
  const price = priceForTier(tier);
  const hasCountdown = !!board.reveal_at;

  const lineItems = [
    {
      price_data: {
        currency: "jpy",
        unit_amount: price,
        product_data: {
          name: `${board.title}（${labelForTier(tier)}）`,
        },
      },
      quantity: 1,
    },
  ];
  if (hasCountdown) {
    lineItems.push({
      price_data: {
        currency: "jpy",
        unit_amount: COUNTDOWN_PRICE,
        product_data: {
          name: "カウントダウン公開オプション",
        },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    metadata: {
      boardId: board.id,
      tier,
    },
    success_url: `${origin}/board/${board.slug}/export?checkout=success`,
    cancel_url: `${origin}/board/${board.slug}/export?checkout=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
