import Stripe from "stripe";

// サーバー側だけで使う。ブラウザに絶対に渡してはいけない。
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
