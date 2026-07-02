"use client";

import Link from "next/link";
import { cormorantGaramond, kleeOne } from "@/lib/fonts";
import type { Board, Occasion, Post } from "@/lib/types";
import ShareLink from "@/components/ShareLink";
import FadeIn from "@/components/FadeIn";
import PostMedia from "@/components/PostMedia";

const BG = "#F1EDE2";
const CARD = "#FBF9F1";
const INK = "#3B4A3A";
const GREEN = "#5B7553";
const RULE = "#CBD2B8";

const EYEBROW: Record<Occasion, string> = {
  wedding: "Flora of Love",
  farewell: "Herbarium of Gratitude",
  graduation: "Records of Growth",
  birthday: "A Year in Bloom",
  retirement: "Seasons of Dedication",
  other: "Collected Words",
};

const JP_SUBTITLE: Record<Occasion, string> = {
  wedding: "おふたりの門出に 花束を",
  farewell: "感謝のことばを 押し花にして",
  graduation: "育った日々の 記録",
  birthday: "あなたの一年が 花ひらきますように",
  retirement: "積み重ねた季節に 敬意を",
  other: "集めたことばの 標本帳",
};

const FOOTER_LABEL: Record<Occasion, (n: number) => string> = {
  wedding: (n) => `${n}輪のことばを 採集しました`,
  farewell: (n) => `${n}輪の感謝を 採集しました`,
  graduation: (n) => `${n}輪のことばを 採集しました`,
  birthday: (n) => `${n}輪のことばを 採集しました`,
  retirement: (n) => `${n}輪の感謝を 採集しました`,
  other: (n) => `${n}輪のことばを 採集しました`,
};

function formatDate(value: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return null;
  return `${y} . ${m} . ${d}`;
}

function Leaf({ size = 20, flip = false }: { size?: number; flip?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={GREEN}
      strokeWidth="1.2"
      aria-hidden
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M4 20 C4 10, 10 4, 20 4 C20 14, 14 20, 4 20 Z" />
      <path d="M4 20 C9 15, 13 11, 20 4" />
    </svg>
  );
}

export default function BotanicalBoard({
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
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <header className="mb-14 flex flex-col items-center gap-3 text-center sm:mb-20">
          <div className="flex items-center gap-2">
            <Leaf size={16} flip />
            <p
              className={`${cormorantGaramond.className} italic`}
              style={{ color: GREEN, letterSpacing: "0.2em", fontSize: "14px" }}
            >
              {eyebrow}
            </p>
            <Leaf size={16} />
          </div>
          <h1
            className={`${kleeOne.className} text-3xl font-semibold sm:text-5xl`}
            style={{ color: INK, letterSpacing: "0.1em" }}
          >
            {board.title}
          </h1>
          <p
            className={`${kleeOne.className} text-sm sm:text-base`}
            style={{ color: INK, opacity: 0.75, letterSpacing: "0.15em" }}
          >
            {jpSubtitle}
          </p>
          {dateLabel && (
            <p
              className={`${cormorantGaramond.className} italic`}
              style={{ color: INK, opacity: 0.55, letterSpacing: "0.2em", fontSize: "13px" }}
            >
              collected on {dateLabel}
            </p>
          )}
        </header>

        {!preview && (
          <div className="mx-auto mb-16 flex max-w-md flex-col gap-4">
            <ShareLink slug={board.slug} theme={board.theme} />
            <Link
              href={`/board/${board.slug}/post`}
              className={`${kleeOne.className} rounded px-5 py-3 text-center text-sm tracking-widest transition-opacity hover:opacity-85`}
              style={{ backgroundColor: GREEN, color: CARD }}
            >
              ことばを添える
            </Link>
          </div>
        )}
        {preview && <div className="mb-12" />}

        {posts.length === 0 && (
          <p className={`${kleeOne.className} text-center`} style={{ color: INK, opacity: 0.6 }}>
            まだことばが集まっていません。最初の一輪をお寄せください。
          </p>
        )}

        {/* 中央の茎（タイムライン）から左右交互に葉がつく */}
        <div className="relative">
          <span
            aria-hidden
            className="absolute top-0 bottom-0 left-4 w-px md:left-1/2"
            style={{ backgroundColor: GREEN, opacity: 0.5 }}
          />
          <div className="flex flex-col gap-10">
            {posts.map((post, i) => {
              const left = i % 2 === 0;
              return (
                <FadeIn
                  key={post.id}
                  delay={Math.min(i * 130, 1300)}
                  variant="botanical-bloom"
                >
                  <div
                    className={`relative pl-12 md:w-[calc(50%-28px)] md:pl-0 ${
                      left ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    {/* 茎との接点 */}
                    <span
                      aria-hidden
                      className={`absolute top-8 left-4 h-2.5 w-2.5 -translate-x-1/2 rounded-full md:left-auto ${
                        left ? "md:-right-[34px]" : "md:-left-[22px]"
                      }`}
                      style={{ backgroundColor: GREEN }}
                    />
                    <article
                      className="relative px-6 py-6"
                      style={{
                        backgroundColor: CARD,
                        border: `1px dashed ${RULE}`,
                        boxShadow: "0 3px 12px rgba(59,74,58,0.08)",
                      }}
                    >
                      {/* カード角の葉 */}
                      <span aria-hidden className="absolute -top-2.5 -right-2.5">
                        <Leaf size={22} />
                      </span>
                      <p
                        className={`${cormorantGaramond.className} italic`}
                        style={{ color: GREEN, fontSize: "12px", letterSpacing: "0.15em" }}
                      >
                        Specimen No.{String(i + 1).padStart(2, "0")}
                      </p>
                      {post.image_url && (
                        <PostMedia
                          url={post.image_url}
                          alt={`${post.author_name}の投稿`}
                          className="mt-3 w-full object-cover"
                          style={{ border: `1px solid ${RULE}` }}
                        />
                      )}
                      <p
                        className={`${kleeOne.className} mt-3 text-sm whitespace-pre-wrap`}
                        style={{ color: INK, lineHeight: 1.9 }}
                      >
                        {post.message}
                      </p>
                      <p
                        className={`${kleeOne.className} mt-3 text-right text-sm font-semibold`}
                        style={{ color: GREEN }}
                      >
                        — {post.author_name}
                      </p>
                    </article>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {posts.length > 0 && (
          <footer className="mt-16 flex flex-col items-center gap-2">
            <Leaf size={22} />
            <p
              className={kleeOne.className}
              style={{ color: INK, opacity: 0.7, letterSpacing: "0.2em", fontSize: "14px" }}
            >
              {FOOTER_LABEL[board.occasion](posts.length)}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
