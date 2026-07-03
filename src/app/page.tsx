"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { customAlphabet } from "nanoid";
import { supabase } from "@/lib/supabase";
import { OCCASION_LABELS, type Occasion, type Theme } from "@/lib/types";
import { COUNTDOWN_PRICE } from "@/lib/purchase";
import ThemePicker from "@/components/ThemePicker";

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  10
);

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [occasion, setOccasion] = useState<Occasion>("wedding");
  const [theme, setTheme] = useState<Theme>("wedding");
  const [eventDate, setEventDate] = useState("");
  const [countdownEnabled, setCountdownEnabled] = useState(false);
  const [revealAt, setRevealAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    if (countdownEnabled && !revealAt) {
      setError("カウントダウン公開にする場合は、公開日時を指定してください");
      return;
    }
    setLoading(true);
    setError("");

    const slug = nanoid();
    const { error: insertError } = await supabase
      .from("boards")
      .insert({
        slug,
        title,
        occasion,
        theme,
        event_date: eventDate || null,
        reveal_at: countdownEnabled && revealAt ? new Date(revealAt).toISOString() : null,
      })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError("作成に失敗しました: " + insertError.message);
      return;
    }

    router.push(`/board/${slug}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f7f5f0] to-[#eeece4] px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.3em] text-[#a5824f] uppercase">
            Yosegaki Gift
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#3a3227]">
            寄せ書きギフトを作る
          </h1>
          <p className="mt-2 text-sm text-[#6b6355]">
            URLを配って、みんなでひとつの贈り物に
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-[0_8px_40px_rgba(60,50,30,0.08)]"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">タイトル</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：田中先生ありがとうございました"
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">シーン</span>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as Occasion)}
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            >
              {Object.entries(OCCASION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">日付（任意）</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            />
          </label>

          <div className="flex flex-col gap-2 rounded-lg border border-[#e2ddd1] p-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={countdownEnabled}
                onChange={(e) => setCountdownEnabled(e.target.checked)}
              />
              <span className="text-sm font-medium text-[#3a3227]">
                カウントダウン公開にする（+¥{COUNTDOWN_PRICE}）
              </span>
            </label>
            <p className="text-xs text-[#6b6355]">
              指定した日時になるまで、ボードの中身（メッセージ）は誰にも見えなくなります。投稿はその間も裏で集められます。料金は購入時にまとめて請求されます。
            </p>
            {countdownEnabled && (
              <input
                type="datetime-local"
                value={revealAt}
                onChange={(e) => setRevealAt(e.target.value)}
                className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">デザインテーマ</span>
            <ThemePicker
              value={theme}
              occasion={occasion}
              onChange={(t: Theme) => setTheme(t)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#3a3227] px-4 py-3 font-medium text-white transition-colors hover:bg-[#2a2419] disabled:opacity-50"
          >
            {loading ? "作成中..." : "ボードを作る"}
          </button>
        </form>
      </div>
    </main>
  );
}
