"use client";

import { useEffect } from "react";
import type { Occasion, Theme } from "@/lib/types";
import { THEME_LABELS } from "@/lib/types";
import { sampleBoard, samplePosts } from "@/lib/sampleData";
import ThemedBoard from "@/components/board-themes/ThemedBoard";

export default function ThemePreviewModal({
  theme,
  occasion = "wedding",
  onClose,
  onSelect,
}: {
  theme: Theme;
  occasion?: Occasion;
  onClose: () => void;
  onSelect: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const board = sampleBoard(theme, occasion);
  const posts = samplePosts();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm">
      {/* 上部バー */}
      <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 shadow-md">
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-[#3a3227] px-3 py-1 text-xs font-medium text-white">
            完成イメージ
          </span>
          <span className="text-[#6b6355]">
            {THEME_LABELS[theme]}（サンプルの文章です）
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelect}
            className="rounded-lg bg-[#3a3227] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2419]"
          >
            このデザインで作る
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="rounded-lg border border-[#e2ddd1] px-3 py-2 text-sm text-[#3a3227] hover:bg-[#f7f5f0]"
          >
            閉じる
          </button>
        </div>
      </div>

      {/* プレビュー本体（実際のボードと同じ表示） */}
      <div className="flex-1 overflow-y-auto">
        <ThemedBoard board={board} posts={posts} preview />
      </div>
    </div>
  );
}
