"use client";

import Link from "next/link";
import { archivoBlack, zenKakuGothicNew } from "@/lib/fonts";
import type { Board, Occasion, Post } from "@/lib/types";
import ShareLink from "@/components/ShareLink";
import FadeIn from "@/components/FadeIn";
import PostMedia from "@/components/PostMedia";
import { subtitleFor, ui } from "@/lib/i18n";

const BG = "#F5F4F0";
const CARD = "#FFFFFF";
const INK = "#16181D";
const ACCENT = "#E4572E";

const EYEBROW: Record<Occasion, string> = {
  wedding: "BEST DAY EVER",
  farewell: "THANK YOU, CAPTAIN",
  graduation: "NEXT STAGE",
  birthday: "HAPPY BIRTHDAY",
  retirement: "LEGEND FOREVER",
  other: "ONE TEAM, ONE HEART",
};

// 投稿の合間に挟む「ベタ塗り大文字タイル」の言葉（シーンごとに変わる）
const ACCENT_WORDS: Record<Occasion, string[]> = {
  wedding: ["CONGRATS!", "BE HAPPY", "LOVE WINS", "FOREVER"],
  farewell: ["THANKS!", "GOOD LUCK", "SEE YOU", "FOREVER"],
  graduation: ["NEXT STAGE", "GO BEYOND", "ONE TEAM", "PRIDE"],
  birthday: ["CHEERS!", "SMILE!", "HAPPY DAY", "PARTY ON"],
  retirement: ["RESPECT", "LEGEND", "THANK YOU", "SALUTE"],
  other: ["THANKS!", "ONE TEAM", "RESPECT", "FOREVER"],
};

// 一番下のフッターの言葉（シーンごとに変わる）
const FOOTER_LABEL: Record<Occasion, (n: number) => string> = {
  wedding: (n) => `FROM ${n} FRIENDS`,
  farewell: (n) => `FROM ${n} TEAMMATES`,
  graduation: (n) => `FROM ${n} TEAMMATES`,
  birthday: (n) => `FROM ${n} FRIENDS`,
  retirement: (n) => `FROM ${n} COLLEAGUES`,
  other: (n) => `FROM ${n} OF US`,
};

function formatDate(value: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return null;
  return `${y}.${m}.${d}`;
}

type Item =
  | { kind: "post"; post: Post; number: number }
  | { kind: "accent"; word: string; variant: 0 | 1 };

function buildItems(posts: Post[], accentWords: string[]): Item[] {
  const items: Item[] = [];
  let accentCount = 0;
  posts.forEach((post, i) => {
    items.push({ kind: "post", post, number: i + 1 });
    // 3投稿ごとに1枚、応援ワードのタイルを差し込む
    if ((i + 1) % 3 === 0 && i < posts.length - 1) {
      items.push({
        kind: "accent",
        word: accentWords[accentCount % accentWords.length],
        variant: (accentCount % 2) as 0 | 1,
      });
      accentCount++;
    }
  });
  return items;
}

export default function TeamBoard({
  board,
  posts,
  preview = false,
}: {
  board: Board;
  posts: Post[];
  preview?: boolean;
}) {
  const eyebrow = EYEBROW[board.occasion];
  const subtitle = subtitleFor(board.language, board.occasion);
  const t = ui(board.language);
  const dateLabel = formatDate(board.event_date);
  const items = buildItems(posts, ACCENT_WORDS[board.occasion]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        {/* ポスター風の左寄せヘッダー */}
        <header className="mb-12 sm:mb-16">
          <p
            className={archivoBlack.className}
            style={{ color: ACCENT, letterSpacing: "0.3em", fontSize: "13px" }}
          >
            {eyebrow}
          </p>
          <h1
            className={`${zenKakuGothicNew.className} mt-2 text-4xl leading-tight font-black sm:text-6xl`}
            style={{ color: INK }}
          >
            {board.title}
          </h1>
          <div className="mt-4 flex h-3 w-56 sm:w-72">
            <span className="h-full flex-1" style={{ backgroundColor: INK }} />
            <span className="h-full w-14" style={{ backgroundColor: ACCENT }} />
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p
              className={`${zenKakuGothicNew.className} text-lg font-bold`}
              style={{ color: INK }}
            >
              {subtitle}
            </p>
            {dateLabel && (
              <p
                className={archivoBlack.className}
                style={{ color: INK, fontSize: "13px", letterSpacing: "0.15em" }}
              >
                {dateLabel}
              </p>
            )}
          </div>
        </header>

        {!preview && (
          <div className="mb-14 flex max-w-md flex-col gap-4">
            <ShareLink slug={board.slug} theme={board.theme} language={board.language} />
            <Link
              href={`/board/${board.slug}/post`}
              className={`${zenKakuGothicNew.className} rounded-lg px-5 py-3 text-center text-sm font-bold tracking-widest transition-transform hover:scale-[1.02]`}
              style={{
                backgroundColor: ACCENT,
                color: "#FFFFFF",
                boxShadow: `4px 4px 0 ${INK}`,
              }}
            >
              {t.giveMessage}
            </Link>
          </div>
        )}
        {preview && <div className="mb-10" />}

        {posts.length === 0 && (
          <p
            className={`${zenKakuGothicNew.className} font-bold`}
            style={{ color: INK, opacity: 0.6 }}
          >
            {t.emptyBoard}
          </p>
        )}

        {/* 大小混在タイル */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {items.map((item, i) => {
            const rotate = i % 2 === 0 ? -1.5 : 1.5;
            if (item.kind === "accent") {
              const isOrange = item.variant === 0;
              return (
                <FadeIn
                  key={`accent-${i}`}
                  delay={Math.min(i * 80, 900)}
                  variant="team-pop"
                  className="min-h-28"
                >
                  <div
                    className="flex h-full items-center justify-center rounded-lg px-3 py-6"
                    style={{
                      backgroundColor: isOrange ? ACCENT : INK,
                      transform: `rotate(${rotate}deg)`,
                      boxShadow: `4px 4px 0 ${isOrange ? INK : ACCENT}`,
                    }}
                  >
                    <span
                      className={`${archivoBlack.className} text-center text-2xl sm:text-3xl`}
                      style={{ color: "#FFFFFF", letterSpacing: "0.05em" }}
                    >
                      {item.word}
                    </span>
                  </div>
                </FadeIn>
              );
            }

            const { post, number } = item;
            const wide = number % 5 === 1 && posts.length > 2;
            return (
              <FadeIn
                key={post.id}
                delay={Math.min(i * 80, 900)}
                variant="team-pop"
                className={wide ? "col-span-2" : ""}
              >
                <article
                  className="relative h-full rounded-lg px-5 pt-7 pb-5"
                  style={{
                    backgroundColor: CARD,
                    border: `2px solid ${INK}`,
                    boxShadow: `4px 4px 0 ${INK}`,
                    transform: `rotate(${rotate}deg)`,
                  }}
                >
                  {/* 背番号タグ */}
                  <span
                    className={`${archivoBlack.className} absolute -top-3 -left-2 inline-flex h-8 min-w-8 items-center justify-center rounded px-1.5`}
                    style={{
                      backgroundColor: INK,
                      color: "#FFFFFF",
                      fontSize: "14px",
                      boxShadow: `2px 2px 0 ${ACCENT}`,
                    }}
                  >
                    {String(number).padStart(2, "0")}
                  </span>
                  {post.image_url && (
                    <PostMedia
                      url={post.image_url}
                      alt={`${post.author_name}の投稿`}
                      className="mb-3 w-full rounded object-cover"
                      style={{ border: `2px solid ${INK}` }}
                    />
                  )}
                  <p
                    className={`${zenKakuGothicNew.className} text-sm whitespace-pre-wrap`}
                    style={{ color: INK, lineHeight: 1.9 }}
                  >
                    {post.message}
                  </p>
                  <p
                    className={`${zenKakuGothicNew.className} mt-3 flex items-center gap-2 text-sm font-black`}
                    style={{ color: INK }}
                  >
                    <span
                      className="inline-block h-3.5 w-1.5"
                      style={{ backgroundColor: ACCENT }}
                    />
                    {post.author_name}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>

        {posts.length > 0 && (
          <footer className="mt-16 flex justify-center">
            <p
              className={`${archivoBlack.className} rounded-lg px-6 py-3`}
              style={{
                backgroundColor: INK,
                color: "#FFFFFF",
                letterSpacing: "0.15em",
                fontSize: "14px",
                boxShadow: `4px 4px 0 ${ACCENT}`,
              }}
            >
              {FOOTER_LABEL[board.occasion](posts.length)}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
