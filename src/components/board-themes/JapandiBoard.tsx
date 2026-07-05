"use client";

import Link from "next/link";
import { cormorantGaramond, shipporiMincho } from "@/lib/fonts";
import type { Board, Occasion, Post } from "@/lib/types";
import ShareLink from "@/components/ShareLink";
import FadeIn from "@/components/FadeIn";
import PostMedia from "@/components/PostMedia";

const BG = "#EFEBE3";
const CARD = "#FAF8F2";
const INK = "#26231E";
const VERMILION = "#B03A2E";
const RULE = "#D8D2C4";

const EYEBROW: Record<Occasion, string> = {
  wedding: "IN CELEBRATION",
  farewell: "WITH GRATITUDE",
  graduation: "IN CELEBRATION",
  birthday: "MANY HAPPY RETURNS",
  retirement: "WITH RESPECT AND GRATITUDE",
  other: "WITH OUR WORDS",
};

const JP_SUBTITLE: Record<Occasion, string> = {
  wedding: "ご結婚 おめでとうございます",
  farewell: "これまでの日々に 感謝を込めて",
  graduation: "ご卒業 おめでとうございます",
  birthday: "お誕生日 おめでとうございます",
  retirement: "永年のお勤め おつかれさまでした",
  other: "心ばかりの言葉を 添えて",
};

const FOOTER_LABEL: Record<Occasion, (n: number) => string> = {
  wedding: (n) => `お祝いの言葉 ${n}名より`,
  farewell: (n) => `感謝を込めて ${n}名より`,
  graduation: (n) => `お祝いの言葉 ${n}名より`,
  birthday: (n) => `お祝いの言葉 ${n}名より`,
  retirement: (n) => `感謝を込めて ${n}名より`,
  other: (n) => `${n}名より`,
};

function formatDate(value: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return null;
  return `${y} . ${m} . ${d}`;
}

// 朱の落款（投稿者名の頭文字が入った角印風スタンプ）
function Seal({ char, size = 30 }: { char: string; size?: number }) {
  return (
    <span
      aria-hidden
      className={`${shipporiMincho.className} inline-flex items-center justify-center`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: VERMILION,
        color: "#FAF8F2",
        fontSize: `${size * 0.55}px`,
        fontWeight: 700,
        borderRadius: "3px",
        transform: "rotate(2deg)",
        boxShadow: "0 1px 3px rgba(38,35,30,0.2)",
      }}
    >
      {char}
    </span>
  );
}

export default function JapandiBoard({
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
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <header className="mb-14 flex flex-col items-center gap-4 text-center sm:mb-20">
          <p
            className={cormorantGaramond.className}
            style={{ color: INK, opacity: 0.55, letterSpacing: "0.4em", fontSize: "11px" }}
          >
            {eyebrow}
          </p>
          <div className="flex items-center gap-4">
            <span className="h-px w-10" style={{ backgroundColor: RULE }} />
            <h1
              className={`${shipporiMincho.className} text-3xl sm:text-5xl`}
              style={{ color: INK, letterSpacing: "0.25em", textIndent: "0.25em", fontWeight: 400 }}
            >
              {board.title}
            </h1>
            <span className="h-px w-10" style={{ backgroundColor: RULE }} />
          </div>
          <p
            className={`${shipporiMincho.className} text-sm sm:text-base`}
            style={{ color: INK, opacity: 0.75, letterSpacing: "0.3em", textIndent: "0.3em" }}
          >
            {jpSubtitle}
          </p>
          {dateLabel && (
            <p
              className={cormorantGaramond.className}
              style={{ color: INK, opacity: 0.5, letterSpacing: "0.25em", fontSize: "13px" }}
            >
              {dateLabel}
            </p>
          )}
          <Seal char={board.title.trim().charAt(0) || "寿"} size={34} />
        </header>

        {!preview && (
          <div className="mx-auto mb-16 flex max-w-md flex-col gap-4">
            <ShareLink slug={board.slug} theme={board.theme} />
            <Link
              href={`/board/${board.slug}/post`}
              className={`${shipporiMincho.className} px-5 py-3 text-center text-sm tracking-[0.3em] transition-opacity hover:opacity-85`}
              style={{ backgroundColor: INK, color: CARD }}
            >
              言葉を贈る
            </Link>
          </div>
        )}
        {preview && <div className="mb-12" />}

        {posts.length === 0 && (
          <p
            className={`${shipporiMincho.className} text-center`}
            style={{ color: INK, opacity: 0.6 }}
          >
            まだ言葉が届いておりません。最初の一筆をお寄せください。
          </p>
        )}

        {/* 縦書きの短冊が右から左へ並ぶ */}
        <div
          className="flex flex-wrap items-start justify-center gap-4 sm:gap-6"
          style={{ direction: "rtl" }}
        >
          {posts.map((post, i) => (
            <FadeIn
              key={post.id}
              delay={Math.min(i * 110, 1100)}
              variant="ink-slide"
            >
              <article
                className="flex flex-col items-center gap-3 px-1 py-6"
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${RULE}`,
                  boxShadow: "0 2px 10px rgba(38,35,30,0.07)",
                  direction: "ltr",
                }}
              >
                {post.image_url && (
                  <PostMedia
                    url={post.image_url}
                    alt={`${post.author_name}の投稿`}
                    className="w-28 object-cover sm:w-32"
                    style={{ border: `1px solid ${RULE}` }}
                  />
                )}
                <div
                  className="flex items-start"
                  style={{ direction: "rtl", minHeight: "200px" }}
                >
                  <div
                    className={shipporiMincho.className}
                    style={{
                      writingMode: "vertical-rl",
                      color: INK,
                      fontSize: "14px",
                      lineHeight: 2.1,
                      letterSpacing: "0.12em",
                      padding: "0 10px",
                    }}
                  >
                    <p style={{ whiteSpace: "pre-wrap" }}>{post.message}</p>
                  </div>
                  <div
                    className={shipporiMincho.className}
                    style={{
                      writingMode: "vertical-rl",
                      color: INK,
                      opacity: 0.8,
                      fontSize: "13px",
                      letterSpacing: "0.12em",
                      padding: "0 6px",
                      flexShrink: 0,
                    }}
                  >
                    {post.author_name}
                  </div>
                </div>
                <Seal char={post.author_name.trim().charAt(0) || "印"} size={24} />
              </article>
            </FadeIn>
          ))}
        </div>

        {posts.length > 0 && (
          <footer className="mt-16 flex flex-col items-center gap-3">
            <span className="h-px w-14" style={{ backgroundColor: RULE }} />
            <p
              className={shipporiMincho.className}
              style={{
                color: INK,
                opacity: 0.7,
                letterSpacing: "0.3em",
                textIndent: "0.3em",
                fontSize: "14px",
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
