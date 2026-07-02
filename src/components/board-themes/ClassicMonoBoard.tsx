"use client";

import Link from "next/link";
import { fraunces, shipporiMincho } from "@/lib/fonts";
import type { Board, Occasion, Post } from "@/lib/types";
import ShareLink from "@/components/ShareLink";
import FadeIn from "@/components/FadeIn";
import PostMedia from "@/components/PostMedia";

const BG = "#FCFBF7";
const CARD = "#FFFFFF";
const INK = "#111111";

const EYEBROW: Record<Occasion, string> = {
  wedding: "THE WEDDING GAZETTE",
  farewell: "THE FAREWELL TIMES",
  graduation: "THE GRADUATION HERALD",
  birthday: "THE BIRTHDAY POST",
  retirement: "THE TRIBUTE TIMES",
  other: "THE MESSAGE PRESS",
};

const JP_SUBTITLE: Record<Occasion, string> = {
  wedding: "祝 ご結婚",
  farewell: "感謝を込めて",
  graduation: "祝 ご卒業",
  birthday: "祝 お誕生日",
  retirement: "祝 ご退職",
  other: "寄せ書き特別号",
};

const FOOTER_LABEL: Record<Occasion, (n: number) => string> = {
  wedding: (n) => `EDITED BY ${n} CONTRIBUTORS`,
  farewell: (n) => `WITH THANKS FROM ${n} CONTRIBUTORS`,
  graduation: (n) => `EDITED BY ${n} CONTRIBUTORS`,
  birthday: (n) => `EDITED BY ${n} CONTRIBUTORS`,
  retirement: (n) => `WITH THANKS FROM ${n} CONTRIBUTORS`,
  other: (n) => `EDITED BY ${n} CONTRIBUTORS`,
};

function formatDate(value: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return null;
  return `${y}.${m}.${d}`;
}

// 二重罫線（新聞の見出しまわりの装飾）
function DoubleRule() {
  return (
    <div aria-hidden className="w-full">
      <div className="h-[3px] w-full" style={{ backgroundColor: INK }} />
      <div className="mt-[3px] h-px w-full" style={{ backgroundColor: INK }} />
    </div>
  );
}

export default function ClassicMonoBoard({
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
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        {/* 新聞のマストヘッド */}
        <header className="mb-12 sm:mb-16">
          <DoubleRule />
          <div className="flex flex-col items-center gap-2 py-6 text-center sm:py-8">
            <p
              className={fraunces.className}
              style={{ color: INK, letterSpacing: "0.35em", fontSize: "12px", fontWeight: 600 }}
            >
              {eyebrow}
            </p>
            <h1
              className={`${fraunces.className} text-4xl sm:text-6xl`}
              style={{ color: INK, fontWeight: 900, lineHeight: 1.15 }}
            >
              {board.title}
            </h1>
            <div className="mt-1 flex items-center gap-3">
              <span className="h-px w-12" style={{ backgroundColor: INK }} />
              <p
                className={shipporiMincho.className}
                style={{ color: INK, letterSpacing: "0.4em", textIndent: "0.4em", fontSize: "14px" }}
              >
                {jpSubtitle}
              </p>
              <span className="h-px w-12" style={{ backgroundColor: INK }} />
            </div>
            {dateLabel && (
              <p
                className={`${fraunces.className} italic`}
                style={{ color: INK, opacity: 0.7, fontSize: "13px", letterSpacing: "0.15em" }}
              >
                {dateLabel} EDITION
              </p>
            )}
          </div>
          <DoubleRule />
        </header>

        {!preview && (
          <div className="mx-auto mb-14 flex max-w-md flex-col gap-4">
            <ShareLink slug={board.slug} theme={board.theme} />
            <Link
              href={`/board/${board.slug}/post`}
              className={`${shipporiMincho.className} px-5 py-3 text-center text-sm tracking-[0.3em] transition-opacity hover:opacity-80`}
              style={{ backgroundColor: INK, color: BG }}
            >
              寄稿する
            </Link>
          </div>
        )}
        {preview && <div className="mb-10" />}

        {posts.length === 0 && (
          <p
            className={`${shipporiMincho.className} text-center`}
            style={{ color: INK, opacity: 0.6 }}
          >
            まだ記事がありません。最初の一報をお寄せください。
          </p>
        )}

        {/* 新聞の段組風マソンリー */}
        <div className="columns-2 gap-5 md:columns-3 [column-fill:_balance]">
          {posts.map((post, i) => {
            const firstChar = post.message.trim().charAt(0);
            const rest = post.message.trim().slice(1);
            return (
              <FadeIn key={post.id} delay={Math.min(i * 50, 500)} className="mb-5 break-inside-avoid">
                <article
                  className="px-5 py-5"
                  style={{ backgroundColor: CARD, border: `1.5px solid ${INK}` }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`${fraunces.className} italic`}
                      style={{ color: INK, fontSize: "12px", fontWeight: 600 }}
                    >
                      No.{String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px flex-1" style={{ backgroundColor: INK, opacity: 0.35 }} />
                  </div>
                  {post.image_url && (
                    <PostMedia
                      url={post.image_url}
                      alt={`${post.author_name}の投稿`}
                      className="mt-3 w-full object-cover"
                      style={{ border: `1px solid ${INK}`, filter: "grayscale(1) contrast(1.05)" }}
                    />
                  )}
                  <p
                    className={`${shipporiMincho.className} mt-3 text-sm whitespace-pre-wrap`}
                    style={{ color: INK, lineHeight: 1.9 }}
                  >
                    {/* 先頭文字を大きく（ドロップキャップ） */}
                    <span
                      className={fraunces.className}
                      style={{
                        float: "left",
                        fontSize: "2.6em",
                        lineHeight: 0.9,
                        paddingRight: "6px",
                        paddingTop: "2px",
                        fontWeight: 900,
                      }}
                    >
                      {firstChar}
                    </span>
                    {rest}
                  </p>
                  <p
                    className={`${shipporiMincho.className} mt-3 clear-both text-right text-xs`}
                    style={{ color: INK, letterSpacing: "0.1em" }}
                  >
                    ― {post.author_name} 記
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>

        {posts.length > 0 && (
          <footer className="mt-14 flex flex-col items-center gap-4">
            <DoubleRule />
            <p
              className={`${fraunces.className} italic`}
              style={{ color: INK, letterSpacing: "0.25em", fontSize: "13px" }}
            >
              {FOOTER_LABEL[board.occasion](posts.length)}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
