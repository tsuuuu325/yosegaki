"use client";

import Link from "next/link";
import { dotGothic16, zenKakuGothicNew } from "@/lib/fonts";
import type { Board, Occasion, Post } from "@/lib/types";
import ShareLink from "@/components/ShareLink";
import FadeIn from "@/components/FadeIn";
import PostMedia from "@/components/PostMedia";

const BG = "#0D0B1E";
const CARD = "#16132B";
const TEXT = "#F2F0FF";

const EYEBROW: Record<Occasion, string> = {
  wedding: "PLAYER 1 & PLAYER 2",
  farewell: "SEE YOU NEXT STAGE",
  graduation: "STAGE CLEAR!",
  birthday: "LEVEL UP!",
  retirement: "GAME COMPLETE!",
  other: "PRESS START",
};

const JP_SUBTITLE: Record<Occasion, string> = {
  wedding: "けっこんおめでとう",
  farewell: "いままでありがとう",
  graduation: "そつぎょうおめでとう",
  birthday: "おたんじょうびおめでとう",
  retirement: "おつかれさまでした",
  other: "みんなからのメッセージ",
};

// 投稿の合間に挟むネオンサインの言葉（シーンごとに変わる）
const ACCENT_WORDS: Record<Occasion, string[]> = {
  wedding: ["LOVE", "CHEERS!", "FOREVER", "HAPPY!"],
  farewell: ["THANKS!", "GOOD LUCK", "SEE YOU", "BYE BYE"],
  graduation: ["CLEAR!", "NEW GAME", "GO GO!", "YEAH!"],
  birthday: ["HBD!", "PARTY!", "CHEERS!", "YEAH!"],
  retirement: ["THANKS!", "LEGEND", "RESPECT", "CHEERS!"],
  other: ["THANKS!", "CHEERS!", "YEAH!", "GO GO!"],
};

const FOOTER_LABEL: Record<Occasion, (n: number) => string> = {
  wedding: (n) => `FROM ${n} GUESTS`,
  farewell: (n) => `FROM ${n} MATES`,
  graduation: (n) => `FROM ${n} MATES`,
  birthday: (n) => `FROM ${n} FRIENDS`,
  retirement: (n) => `FROM ${n} MATES`,
  other: (n) => `FROM ${n} PLAYERS`,
};

function formatDate(value: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return null;
  return `${y}.${m}.${d}`;
}

type Item =
  | { kind: "post"; post: Post; number: number }
  | { kind: "accent"; word: string; pink: boolean };

function buildItems(posts: Post[], accentWords: string[]): Item[] {
  const items: Item[] = [];
  let accentCount = 0;
  posts.forEach((post, i) => {
    items.push({ kind: "post", post, number: i + 1 });
    if ((i + 1) % 3 === 0 && i < posts.length - 1) {
      items.push({
        kind: "accent",
        word: accentWords[accentCount % accentWords.length],
        pink: accentCount % 2 === 0,
      });
      accentCount++;
    }
  });
  return items;
}

export default function NeonPopBoard({
  board,
  posts,
  preview = false,
}: {
  board: Board;
  posts: Post[];
  preview?: boolean;
}) {
  const eyebrow = EYEBROW[board.occasion];
  const jpSubtitle = JP_SUBTITLE[board.occasion];
  const dateLabel = formatDate(board.event_date);
  const items = buildItems(posts, ACCENT_WORDS[board.occasion]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <header className="mb-12 flex flex-col items-center gap-3 text-center sm:mb-16">
          <p
            className={`${dotGothic16.className} neon-text-cyan text-sm sm:text-base`}
            style={{ letterSpacing: "0.25em" }}
          >
            {eyebrow}
          </p>
          <h1
            className={`${dotGothic16.className} neon-text-pink text-4xl sm:text-6xl`}
            style={{ lineHeight: 1.2 }}
          >
            {board.title}
          </h1>
          <p
            className={`${zenKakuGothicNew.className} text-sm font-medium sm:text-base`}
            style={{ color: TEXT, opacity: 0.85, letterSpacing: "0.25em", textIndent: "0.25em" }}
          >
            {jpSubtitle}
          </p>
          {dateLabel && (
            <p
              className={`${dotGothic16.className} text-sm`}
              style={{ color: TEXT, opacity: 0.6, letterSpacing: "0.2em" }}
            >
              {dateLabel}
            </p>
          )}
        </header>

        {!preview && (
          <div className="mx-auto mb-14 flex max-w-md flex-col gap-4">
            <ShareLink slug={board.slug} theme={board.theme} />
            <Link
              href={`/board/${board.slug}/post`}
              className={`${dotGothic16.className} neon-card-pink rounded-lg px-5 py-3 text-center text-sm tracking-widest`}
              style={{ backgroundColor: CARD, color: TEXT }}
            >
              メッセージをおくる
            </Link>
          </div>
        )}
        {preview && <div className="mb-10" />}

        {posts.length === 0 && (
          <p
            className={`${zenKakuGothicNew.className} text-center`}
            style={{ color: TEXT, opacity: 0.6 }}
          >
            まだメッセージがありません。さいしょのコインを入れよう！
          </p>
        )}

        {/* 大小混在タイル＋ネオンサイン */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {items.map((item, i) => {
            if (item.kind === "accent") {
              return (
                <FadeIn
                  key={`accent-${i}`}
                  delay={Math.min(i * 90, 1000)}
                  variant="neon-flicker"
                  className="min-h-28"
                >
                  <div
                    className={`flex h-full items-center justify-center rounded-xl px-3 py-6 ${
                      item.pink ? "neon-card-pink" : "neon-card-cyan"
                    }`}
                    style={{ backgroundColor: CARD }}
                  >
                    <span
                      className={`${dotGothic16.className} ${
                        item.pink ? "neon-text-pink" : "neon-text-cyan"
                      } text-center text-2xl sm:text-3xl`}
                    >
                      {item.word}
                    </span>
                  </div>
                </FadeIn>
              );
            }

            const { post, number } = item;
            const pink = number % 2 === 1;
            const wide = number % 5 === 1 && posts.length > 2;
            return (
              <FadeIn
                key={post.id}
                delay={Math.min(i * 90, 1000)}
                variant="neon-flicker"
                className={wide ? "col-span-2" : ""}
              >
                <article
                  className={`h-full rounded-xl px-5 py-5 ${
                    pink ? "neon-card-pink" : "neon-card-cyan"
                  }`}
                  style={{ backgroundColor: CARD }}
                >
                  {post.image_url && (
                    <PostMedia
                      url={post.image_url}
                      alt={`${post.author_name}の投稿`}
                      className="mb-3 w-full rounded-lg object-cover"
                      style={{ opacity: 0.92 }}
                    />
                  )}
                  <p
                    className={`${zenKakuGothicNew.className} text-sm whitespace-pre-wrap`}
                    style={{ color: TEXT, lineHeight: 1.9 }}
                  >
                    {post.message}
                  </p>
                  <p
                    className={`${dotGothic16.className} ${
                      pink ? "neon-text-pink" : "neon-text-cyan"
                    } mt-3 text-right text-base`}
                  >
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
              className={`${dotGothic16.className} neon-card-cyan neon-text-cyan rounded-full px-6 py-2.5 text-sm`}
              style={{ backgroundColor: CARD, letterSpacing: "0.2em" }}
            >
              {FOOTER_LABEL[board.occasion](posts.length)}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
