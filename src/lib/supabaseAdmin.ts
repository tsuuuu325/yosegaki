import { createClient } from "@supabase/supabase-js";

// サーバー側だけで使う「なんでもできる」鍵のクライアント。
// RLS(行レベルの権限)を無視して更新できるので、
// Stripeのwebhookなど、信頼できるサーバー処理からのみ使うこと。
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
