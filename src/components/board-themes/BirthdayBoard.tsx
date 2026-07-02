"use client";

import Link from "next/link";
import { caveat, zenMaruGothic } from "@/lib/fonts";
import type { Board, Occasion, Post } from "@/lib/types";
import ShareLink from "@/components/ShareLink";
import FadeIn from "@/components/FadeIn";
import PostMedia from "@/components/PostMedia";

const BG = "#FFF8EC";
const CARD = "#FFFFFF";
const INK = "#4A3F3C";
const PINK = "#F06292";
const TAPES = ["#F9C74F", "#90BE6D", "#F8961E", "#A8DADC"];

const EYEBROW: Record<Occasion, string> = {
  wedding: "Happy Wedding!",
  farewell: "Thank You & Good Luck!",
  graduation: "Congrats!",
  birthday: "Happy Birthday!",
  retirement: "Happy Retirement!",
  other: "For You!",
};

const JP_SUBTITLE: Record<Occasion, string> = {
  wedding: "けっこん おめでとう！",
  farewell: "いままで ありがとう！",
  graduation: "そつぎょう おめでとう！",
  birthday: "おたんじょうび おめでとう！",
  retirement: "おつかれさまでした！",
  other: "きもちを こめて",
};

const FOOTER_LABEL: Record<Occasion, (n: number) => string> = {
  wedding: (n) => `${n}人から、おめでとう！`,
  farewell: (n) => `${n}人から、ありがとう！`,
  graduation: (n) => `${n}人から、おめでとう！`,
  birthday: (n) => `${n}人から、おめでとう！`,
  retirement: (n) => `${n}人から、ありがとう！`,
  other: (n) => `${n}人のきもちです`,
};

// 散らばり感を出すための傾き（index順に繰り返す疑似ランダム）
const ROTATIONS = [-4, 2.5, -1.5, 3.5, -3, 1.5, 4, -2];

function formatDate(value: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return null;
  return `${Number(m)}/${Number(d)}/${y}`;
}

// 紙吹雪（画面全体にゆっくり降る環境演出）
function Confetti() {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 53) % 100}%`,
    color: [...TAPES, PINK][i % 5],
    size: 6 + (i % 3) * 2,
    dur: 7 + (i % 5) * 1.6,
    delay: -((i * 1.7) % 12),
    round: i % 2 === 0,
  }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: p.left,
              width: `${p.size}px`,
              height: `${p.round ? p.size : p.size * 1.6}px`,
              backgroundColor: p.color,
              borderRadius: p.round ? "50%" : "2px",
              opacity: 0.65,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// マスキングテープ（ポラロイドの上端を留める）
function Tape({ color, rotate }: { color: string; rotate: number }) {
  return (
    <span
      aria-hidden
      className="absolute -top-3 left-1/2 h-6 w-20"
      style={{
        backgroundColor: color,
        opacity: 0.75,
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
      }}
    />
  );
}

export default function BirthdayBoard({
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

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: BG }}>
      <Confetti />
      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <header className="mb-12 flex flex-col items-center gap-2 text-center sm:mb-16">
          <p
            className={`${caveat.className} text-3xl sm:text-4xl`}
            style={{ color: PINK, fontWeight: 700 }}
          >
            {eyebrow}
          </p>
          <h1
            className={`${zenMaruGothic.className} text-4xl font-bold sm:text-5xl`}
            style={{ color: INK }}
          >
            {board.title}
          </h1>
          <p
            className={`${zenMaruGothic.className} text-base font-medium sm:text-lg`}
            style={{ color: INK, letterSpacing: "0.2em", textIndent: "0.2em", opacity: 0.85 }}
          >
            {jpSubtitle}
          </p>
          {/* 手描きの波線 */}
          <svg width="140" height="12" viewBox="0 0 140 12" aria-hidden className="mt-1">
            <path
              d="M2 7 Q 12 1, 22 7 T 42 7 T 62 7 T 82 7 T 102 7 T 122 7 T 138 7"
              fill="none"
              stroke={PINK}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          {dateLabel && (
            <p className={`${caveat.className} text-xl`} style={{ color: INK, opacity: 0.7 }}>
              {dateLabel}
            </p>
          )}
        </header>

        {!preview && (
          <div className="mx-auto mb-14 flex max-w-md flex-col gap-4">
            <ShareLink slug={board.slug} theme={board.theme} />
            <Link
              href={`/board/${board.slug}/post`}
              className={`${zenMaruGothic.className} rounded-full px-5 py-3 text-center text-sm font-bold tracking-widest text-white transition-transform hover:scale-[1.02]`}
              style={{ backgroundColor: PINK, boxShadow: "0 4px 14px rgba(240,98,146,0.35)" }}
            >
              メッセージをおくる
            </Link>
          </div>
        )}
        {preview && <div className="mb-10" />}

        {posts.length === 0 && (
          <p
            className={`${zenMaruGothic.className} text-center font-medium`}
            style={{ color: INK, opacity: 0.6 }}
          >
            まだメッセージがありません。さいしょのひとことを届けよう！
          </p>
        )}

        {/* 散らばるポラロイド */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3">
          {posts.map((post, i) => {
            const rotate = ROTATIONS[i % ROTATIONS.length];
            const tape = TAPES[i % TAPES.length];
            const offset = (i % 3) * 10;
            return (
              <FadeIn
                key={post.id}
                delay={Math.min(i * 90, 1000)}
                variant="birthday-drop"
              >
                <article
                  className="relative px-4 pt-6 pb-5"
                  style={{
                    backgroundColor: CARD,
                    transform: `rotate(${rotate}deg)`,
                    marginTop: `${offset}px`,
                    boxShadow: "0 6px 18px rgba(74,63,60,0.14)",
                    borderRadius: "4px",
                  }}
                >
                  <Tape color={tape} rotate={rotate > 0 ? -3 : 3} />
                  {post.image_url && (
                    <PostMedia
                      url={post.image_url}
                      alt={`${post.author_name}の投稿`}
                      className="mb-3 w-full object-cover"
                      style={{ borderRadius: "2px" }}
                    />
                  )}
                  <p
                    className={`${zenMaruGothic.className} text-sm whitespace-pre-wrap`}
                    style={{ color: INK, lineHeight: 1.9 }}
                  >
                    {post.message}
                  </p>
                  <p
                    className={`${caveat.className} mt-3 text-right text-xl`}
                    style={{ color: PINK, fontWeight: 600 }}
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
              className={`${zenMaruGothic.className} rounded-full px-6 py-2.5 text-sm font-bold`}
              style={{
                color: INK,
                backgroundColor: CARD,
                boxShadow: "0 4px 14px rgba(74,63,60,0.12)",
              }}
            >
              🎉 {FOOTER_LABEL[board.occasion](posts.length)}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
