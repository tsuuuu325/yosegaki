"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { customAlphabet } from "nanoid";
import { supabase } from "@/lib/supabase";
import { LANGUAGES, type Language, type Occasion, type Theme } from "@/lib/types";
import { addMyBoard, getMyBoards, type SavedBoard } from "@/lib/myBoards";
import ThemePicker from "@/components/ThemePicker";

const OCCASION_LABELS_EN: Record<Occasion, string> = {
  wedding: "Wedding",
  farewell: "Farewell",
  graduation: "Graduation",
  birthday: "Birthday",
  retirement: "Retirement",
  other: "Other",
};

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
  const [language, setLanguage] = useState<Language>("en");
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
      setError("Please enter a title");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address");
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
        language,
        event_date: eventDate || null,
        organizer_email: email.trim(),
      })
      .select()
      .single();

    if (insertError) {
      setLoading(false);
      setError("Could not create the board: " + insertError.message);
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
            Create a group card
          </h1>
          <p className="mt-2 text-sm text-[#6b6355]">
            Share one link and gather everyone&apos;s messages into a single gift
          </p>
        </div>

        {myBoards.length > 0 && (
          <div className="mb-6 rounded-2xl bg-white/70 p-5">
            <p className="mb-3 text-sm font-medium text-[#3a3227]">
              Boards created on this device
            </p>
            <ul className="flex flex-col gap-2">
              {myBoards.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/board/${b.slug}`}
                    className="flex items-center justify-between rounded-lg border border-[#e2ddd1] bg-white px-3 py-2 text-sm text-[#3a3227] hover:border-[#a5824f]"
                  >
                    <span className="truncate">{b.title}</span>
                    <span className="ml-2 shrink-0 text-xs text-[#a5824f]">Open →</span>
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
            <span className="text-sm font-medium text-[#3a3227]">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Thank you, Mr. Tanaka"
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">Occasion</span>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as Occasion)}
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            >
              {Object.entries(OCCASION_LABELS_EN).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">
              Card language
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <span className="text-xs text-[#6b6355]">
              The card and the message form will be shown to everyone in this language.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">Date (optional)</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-lg border border-[#e2ddd1] px-3 py-2.5 outline-none focus:border-[#a5824f]"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3a3227]">Design theme</span>
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
            {loading ? "Creating..." : "Create board"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setRecoverOpen((v) => !v)}
            className="text-sm text-[#6b6355] underline"
          >
            Find boards created on another device
          </button>
          {recoverOpen && (
            <form
              onSubmit={handleRecover}
              className="mt-3 flex flex-col gap-3 rounded-2xl bg-white/70 p-5 text-left"
            >
              <p className="text-xs text-[#6b6355]">
                Enter the email address you used when creating the board.
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
                  {recoverBusy ? "Searching..." : "Search"}
                </button>
              </div>
              {recoverResults && recoverResults.length === 0 && (
                <p className="text-sm text-[#6b6355]">
                  No boards were found for that email address.
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
                        <span className="ml-2 shrink-0 text-xs text-[#a5824f]">Open →</span>
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
