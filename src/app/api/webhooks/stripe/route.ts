import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { PaidTier } from "@/lib/types";

// Stripeから「支払いが完了しました」という通知を受け取るための窓口。
// ここだけがボードの支払い状態を書き換えられる（RLSでは誰も書けない設定にしてある）。
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "署名がありません" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `署名の検証に失敗しました: ${err instanceof Error ? err.message : err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const boardId = session.metadata?.boardId;
    const tier = session.metadata?.tier as PaidTier | undefined;

    if (boardId && tier) {
      await supabaseAdmin
        .from("boards")
        .update({ paid_tier: tier, is_paid: true })
        .eq("id", boardId);
    }
  }

  return NextResponse.json({ received: true });
}
