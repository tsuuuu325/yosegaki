"use client";

import Link from "next/link";
import { cormorantGaramond, shipporiMincho, yomogi } from "@/lib/fonts";
import type { Board, Occasion, Post } from "@/lib/types";
import ShareLink from "@/components/ShareLink";
import FadeIn from "@/components/FadeIn";
import PostMedia from "@/components/PostMedia";
import { subtitleFor, footerFor, ui } from "@/lib/i18n";

const EYEBROW: Record<Occasion, string> = {
  wedding: "WITH ALL OUR LOVE",
  farewell: "WISHING YOU WELL",
  graduation: "CHEERS TO YOU",
  birthday: "CELEBRATING YOU",
  retirement: "WITH DEEP GRATITUDE",
  other: "TOGETHER WITH LOVE",
};

const titleFontFamily = `${cormorantGaramond.style.fontFamily}, ${shipporiMincho.style.fontFamily}`;

function DiamondIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <rect
        x="1.5"
        y="1.5"
        width="7"
        height="7"
        transform="rotate(45 5 5)"
        fill="none"
        stroke="#C0A063"
        strokeWidth="1"
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

export default function WeddingBoard({
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
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6EE" }}>
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <header className="mb-16 flex flex-col items-center gap-3 text-center sm:mb-24">
          <p
            className={cormorantGaramond.className}
            style={{ color: "#C0A063", letterSpacing: "0.35em", fontSize: "13px" }}
          >
            {eyebrow}
          </p>
          <h1
            className="text-5xl italic sm:text-6xl"
            style={{ color: "#38332B", fontFamily: titleFontFamily }}
          >
            {board.title}
          </h1>
          <p
            className={`${shipporiMincho.className} text-base sm:text-lg`}
            style={{ color: "#38332B", letterSpacing: "0.5em", textIndent: "0.5em" }}
          >
            {subtitle}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-16" style={{ backgroundColor: "#C0A063" }} />
            <DiamondIcon />
            <span className="h-px w-16" style={{ backgroundColor: "#C0A063" }} />
          </div>

          {dateLabel && (
            <p
              className={cormorantGaramond.className}
              style={{ color: "#A9885A", letterSpacing: "0.2em", fontSize: "14px" }}
            >
              {dateLabel}
            </p>
          )}
        </header>

        {!preview && (
          <div className="mx-auto mb-20 flex max-w-md flex-col gap-4">
            <ShareLink slug={board.slug} theme={board.theme} language={board.language} />
            <Link
              href={`/board/${board.slug}/post`}
              className={`${shipporiMincho.className} rounded px-5 py-3 text-center text-sm tracking-widest transition-colors`}
              style={{ backgroundColor: "#38332B", color: "#FAF6EE" }}
            >
              {t.giveMessage}
            </Link>
          </div>
        )}
        {preview && <div className="mb-12" />}

        {posts.length === 0 && (
          <p
            className={`${shipporiMincho.className} text-center opacity-70`}
            style={{ color: "#38332B" }}
          >
            {t.emptyBoard}
          </p>
        )}

        <div className="columns-2 gap-6 lg:columns-3 [column-fill:_balance]">
          {posts.map((post, i) => (
            <FadeIn
              key={post.id}
              delay={Math.min(i * 70, 700)}
              className="mb-6 break-inside-avoid"
            >
              <article
                className="rounded-2xl px-6 py-7"
                style={{
                  backgroundColor: "#FFFDF8",
                  border: "1px solid #ECE3D2",
                  boxShadow: "0 1px 2px rgba(120,95,50,0.06)",
                }}
              >
                {post.image_url && (
                  <PostMedia
                    url={post.image_url}
                    alt={`${post.author_name}の投稿`}
                    className="mb-4 w-full rounded-lg object-cover"
                  />
                )}
                {i % 2 === 0 && (
                  <span
                    aria-hidden
                    className={`${cormorantGaramond.className} block select-none text-2xl italic leading-none`}
                    style={{ color: "#C0A063" }}
                  >
                    &ldquo;
                  </span>
                )}
                <p
                  className={`${shipporiMincho.className} whitespace-pre-wrap`}
                  style={{ color: "#38332B", lineHeight: 1.9 }}
                >
                  {post.message}
                </p>
                <p
                  className={`${yomogi.className} mt-4 text-right text-base`}
                  style={{ color: "#A9885A" }}
                >
                  — {post.author_name}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>

        {posts.length > 0 && (
          <footer className="mt-16 flex flex-col items-center gap-3">
            <DiamondIcon />
            <p
              className={shipporiMincho.className}
              style={{ color: "#A9885A", letterSpacing: "0.3em", textIndent: "0.3em" }}
            >
              {footerFor(board.language, board.occasion, posts.length)}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
