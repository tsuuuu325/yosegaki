"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Theme } from "@/lib/types";
import { THEME_STYLES } from "@/lib/themeStyles";
import { MAX_POSTS } from "@/lib/purchase";

export default function PostForm({
  boardId,
  boardSlug,
  theme = "wedding",
}: {
  boardId: string;
  boardSlug: string;
  theme?: Theme;
}) {
  const s = THEME_STYLES[theme];
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const MAX_IMAGE_MB = 8;
  const MAX_VIDEO_MB = 50;

  function handleMediaChange(file: File | null) {
    setError("");
    if (!file) {
      setMediaFile(null);
      return;
    }
    const isVideo = file.type.startsWith("video/");
    const maxBytes = (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(
        `${isVideo ? "動画" : "写真"}のサイズが大きすぎます（上限${
          isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB
        }MB）`
      );
      setMediaFile(null);
      return;
    }
    setMediaFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) {
      setError("お名前とメッセージをご入力ください");
      return;
    }
    setLoading(true);
    setError("");

    // 投稿数の上限チェック
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("board_id", boardId);
    if ((count ?? 0) >= MAX_POSTS) {
      setLoading(false);
      setError(`このボードは投稿の上限（${MAX_POSTS}件）に達しています。`);
      return;
    }

    let imageUrl: string | null = null;

    if (mediaFile) {
      const ext = mediaFile.name.split(".").pop();
      const path = `${boardId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, mediaFile);

      if (uploadError) {
        setLoading(false);
        setError(
          `${mediaFile.type.startsWith("video/") ? "動画" : "画像"}のアップロードに失敗しました: ` +
            uploadError.message
        );
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("posts").insert({
      board_id: boardId,
      author_name: authorName,
      message,
      image_url: imageUrl,
    });

    setLoading(false);

    if (insertError) {
      setError("投稿に失敗しました: " + insertError.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className={`flex flex-col items-center gap-4 rounded p-10 text-center ${s.card}`}>
        <p className={`text-2xl ${s.cardName}`}>ありがとうございました！</p>
        <p className={`opacity-80 ${s.cardText}`}>メッセージを送りました。</p>
        <Link href={`/board/${boardSlug}`} className={`mt-2 text-sm underline ${s.cardText}`}>
          ボードを見る
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-5 rounded p-6 ${s.card}`}>
      <label className="flex flex-col gap-1">
        <span className={`text-sm font-medium ${s.cardText}`}>お名前</span>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className={`rounded border px-3 py-2 ${s.inputField}`}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={`text-sm font-medium ${s.cardText}`}>メッセージ</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={`rounded border px-3 py-2 ${s.inputField}`}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={`text-sm font-medium ${s.cardText}`}>
          写真・動画（任意、音声付きもOK）
        </span>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => handleMediaChange(e.target.files?.[0] ?? null)}
          className={s.cardText}
        />
        <span className={`text-xs opacity-60 ${s.cardText}`}>
          写真は{MAX_IMAGE_MB}MBまで、動画は{MAX_VIDEO_MB}MBまで
        </span>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`rounded px-4 py-3 font-medium transition-colors disabled:opacity-50 ${s.accentButton}`}
      >
        {loading ? "送信中..." : "メッセージを贈る"}
      </button>
    </form>
  );
}
