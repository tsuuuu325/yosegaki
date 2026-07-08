"use client";

import Link from "next/link";
import { cormorantGaramond, shipporiMincho, kleeOne } from "@/lib/fonts";
import type { Board, Occasion, Post } from "@/lib/types";
import ShareLink from "@/components/ShareLink";
import FadeIn from "@/components/FadeIn";
import PostMedia from "@/components/PostMedia";
import { subtitleFor, footerFor, ui } from "@/lib/i18n";

const NAVY = "#1E2A3A";
const PAPER = "#F3ECDD";
const INK = "#33302A";
const GOLD = "#A98C5B";
const RULE = "#DCCFB4";

const EYEBROW: Record<Occasion, string> = {
  wedding: "WITH ALL OUR LOVE",
  farewell: "WISHING YOU WELL",
  graduation: "TO YOUR NEXT CHAPTER",
  birthday: "MANY HAPPY RETURNS",
  retirement: "WITH DEEP GRATITUDE",
  other: "FROM ALL OF US",
};

const titleFontFamily = `${cormorantGaramond.style.fontFamily}, ${shipporiMincho.style.fontFamily}`;

function WaxSeal({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="18" fill="#9C7C46" />
      <circle cx="20" cy="20" r="18" fill="none" stroke="#7E5E30" strokeWidth="1.5" opacity="0.5" />
      <circle
        cx="20"
        cy="20"
        r="13"
        fill="none"
        stroke={PAPER}
        strokeWidth="0.8"
        opacity="0.6"
        strokeDasharray="2 2"
      />
      <path
        d="M20 12 L22 18 L28 18 L23 22 L25 28 L20 24 L15 28 L17 22 L12 18 L18 18 Z"
        fill={PAPER}
        opacity="0.85"
      />
    </svg>
  );
}

function formatDate(value: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return null;
  return `${y} . ${m} . ${d}`;
}

export default function FarewellBoard({
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: NAVY }}>
      <div className="mx-auto max-w-xl px-6 py-20 sm:py-28">
        <header className="mb-16 flex flex-col items-center gap-3 text-center sm:mb-20">
          <p
            className={cormorantGaramond.className}
            style={{ color: GOLD, letterSpacing: "0.35em", fontSize: "13px" }}
          >
            {eyebrow}
          </p>
          <h1
            className="text-5xl italic sm:text-6xl"
            style={{ color: PAPER, fontFamily: titleFontFamily }}
          >
            {board.title}
          </h1>
          <p
            className={`${shipporiMincho.className} text-base sm:text-lg`}
            style={{ color: PAPER, letterSpacing: "0.5em", textIndent: "0.5em", opacity: 0.9 }}
          >
            {subtitle}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <span className="h-px w-16" style={{ backgroundColor: GOLD }} />
            <WaxSeal size={30} />
            <span className="h-px w-16" style={{ backgroundColor: GOLD }} />
          </div>

          {dateLabel && (
            <p
              className={cormorantGaramond.className}
              style={{ color: GOLD, letterSpacing: "0.2em", fontSize: "14px" }}
            >
              {dateLabel}
            </p>
          )}
        </header>

        {!preview && (
          <div className="mx-auto mb-16 flex max-w-md flex-col gap-4">
            <ShareLink slug={board.slug} theme={board.theme} language={board.language} />
            <Link
              href={`/board/${board.slug}/post`}
              className={`${shipporiMincho.className} rounded px-5 py-3 text-center text-sm tracking-widest transition-colors`}
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              {t.giveMessage}
            </Link>
          </div>
        )}
        {preview && <div className="mb-12" />}

        {posts.length === 0 && (
          <p
            className={`${shipporiMincho.className} text-center`}
            style={{ color: PAPER, opacity: 0.7 }}
          >
            {t.emptyBoard}
          </p>
        )}

        <div className="flex flex-col gap-10">
          {posts.map((post, i) => (
            <FadeIn
              key={post.id}
              delay={Math.min(i * 120, 1200)}
              variant="letter-arrive"
            >
              <article
                className="relative mx-auto w-full rounded-sm px-7 py-8"
                style={{
                  backgroundColor: PAPER,
                  boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
                }}
              >
                {post.image_url && (
                  <div className="mb-6 flex justify-center">
                    <PostMedia
                      url={post.image_url}
                      alt={`${post.author_name}の写真`}
                      className="w-3/4 rounded-sm"
                      style={{
                        border: "6px solid #FFFDF8",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
                        transform: "rotate(-1.5deg)",
                      }}
                    />
                  </div>
                )}
                <p
                  className={shipporiMincho.className}
                  style={{
                    color: INK,
                    fontSize: "15px",
                    lineHeight: "30px",
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 29px, ${RULE} 29px, ${RULE} 30px)`,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {post.message}
                </p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <span
                    className={kleeOne.className}
                    style={{ color: INK, fontSize: "18px" }}
                  >
                    — {post.author_name}
                  </span>
                  <WaxSeal size={34} />
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        {posts.length > 0 && (
          <footer className="mt-16 flex flex-col items-center gap-3">
            <WaxSeal size={26} />
            <p
              className={shipporiMincho.className}
              style={{ color: GOLD, letterSpacing: "0.3em", textIndent: "0.3em" }}
            >
              {footerFor(board.language, board.occasion, posts.length)}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
