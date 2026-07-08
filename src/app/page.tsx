"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { customAlphabet } from "nanoid";
import { supabase } from "@/lib/supabase";
import { OCCASION_LABELS, type Occasion, type Theme } from "@/lib/types";
import { addMyBoard, getMyBoards, type SavedBoard } from "@/lib/myBoards";
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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [myBoards, setMyBoards] = useState<SavedBoard[]>([]);
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverBusy, setRecoverBusy] = useState(false);
  const [recoverResults, setRecoverResults] = useState<
    { slug: string; title: string }[] | null
  >(null);

  useEffect(() => {
    // ブラウザ表示後にlocalStorageから読み込む（サーバー描画との不一致を避けるため）
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMyBoards(getMyBoards());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("タイトルを入力してください");
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
        organizer_email: email.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      setLoading(false);
      setError("作成に失敗しました: " + insertError.message);
      return;
    }

    addMyBoard({ slug, title, createdAt: new Date().toISOString() });
    router.push(`/board/${slug}`);
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    if (!recoverEmail.trim()) return;
    setRecoverBusy(true);
    const { data } = await supabase
      .from("boards")
      .select("slug, title")
      .eq("organizer_email", recoverEmail.trim())
      .order("created_at", { ascending: false });
    setRecoverResults(data ?? []);
    setRecoverBusy(false);
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

        {myBoards.length > 0 && (
          <div className="mb-6 rounded-2xl bg-white/70 p-5">
            <p className="mb-3 text-sm font-medium text-[#3a3227]">
              この端末で作ったボード
            </p>
            <ul className="flex flex-col gap-2">
              {myBoards.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/board/${b.slug}`}
                    className="flex items-center justify-between rounded-lg border border-[#e2ddd1] bg-white px-3 py-2 text-sm text-[#3a3227] hover:border-[#a5824f]"
                  >
                    <span className="truncate">{b.title}</span>
                    <span className="ml-2 shrink-0 text-xs text-[#a5824f]">開く →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

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

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">
              メールアドレス（任意）
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="別の端末からもボードを探せるようにする"
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            />
            <span className="text-xs text-[#6b6355]">
              登録しておくと、スマホとPCなど別の端末からでもボードに戻れます（認証は不要です）。
            </span>
          </label>

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

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setRecoverOpen((v) => !v)}
            className="text-sm text-[#6b6355] underline"
          >
            別の端末で作ったボードを探す
          </button>
          {recoverOpen && (
            <form
              onSubmit={handleRecover}
              className="mt-3 flex flex-col gap-3 rounded-2xl bg-white/70 p-5 text-left"
            >
              <p className="text-xs text-[#6b6355]">
                作成時に登録したメールアドレスを入力してください。
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={recoverEmail}
                  onChange={(e) => setRecoverEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-lg border border-[#e2ddd1] px-3 py-2 text-sm outline-none focus:border-[#a5824f]"
                />
                <button
                  type="submit"
                  disabled={recoverBusy}
                  className="shrink-0 rounded-lg bg-[#3a3227] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {recoverBusy ? "検索中..." : "探す"}
                </button>
              </div>
              {recoverResults && recoverResults.length === 0 && (
                <p className="text-sm text-[#6b6355]">
                  そのメールアドレスで作られたボードは見つかりませんでした。
                </p>
              )}
              {recoverResults && recoverResults.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {recoverResults.map((b) => (
                    <li key={b.slug}>
                      <Link
                        href={`/board/${b.slug}`}
                        className="flex items-center justify-between rounded-lg border border-[#e2ddd1] bg-white px-3 py-2 text-sm text-[#3a3227] hover:border-[#a5824f]"
                      >
                        <span className="truncate">{b.title}</span>
                        <span className="ml-2 shrink-0 text-xs text-[#a5824f]">開く →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
