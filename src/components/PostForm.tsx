"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Language, Theme } from "@/lib/types";
import { THEME_STYLES } from "@/lib/themeStyles";
import { MAX_POSTS } from "@/lib/purchase";
import { ui } from "@/lib/i18n";

export default function PostForm({
  boardId,
  boardSlug,
  theme = "wedding",
  language = "en",
}: {
  boardId: string;
  boardSlug: string;
  theme?: Theme;
  language?: Language;
}) {
  const s = THEME_STYLES[theme];
  const t = ui(language);
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
        `${t.uploadFailed} (max ${isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB}MB)`
      );
      setMediaFile(null);
      return;
    }
    setMediaFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) {
      setError(t.validation);
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
      setError(`This board has reached its limit of ${MAX_POSTS} messages.`);
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
        setError(t.uploadFailed + ": " + uploadError.message);
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
      setError(t.postFailed + ": " + insertError.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className={`flex flex-col items-center gap-4 rounded p-10 text-center ${s.card}`}>
        <p className={`text-2xl ${s.cardName}`}>{t.thankYouTitle}</p>
        <p className={`opacity-80 ${s.cardText}`}>{t.thankYouBody}</p>
        <Link href={`/board/${boardSlug}`} className={`mt-2 text-sm underline ${s.cardText}`}>
          {t.seeBoard}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-5 rounded p-6 ${s.card}`}>
      <label className="flex flex-col gap-1">
        <span className={`text-sm font-medium ${s.cardText}`}>{t.nameLabel}</span>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className={`rounded border px-3 py-2 ${s.inputField}`}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={`text-sm font-medium ${s.cardText}`}>{t.messageLabel}</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={`rounded border px-3 py-2 ${s.inputField}`}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={`text-sm font-medium ${s.cardText}`}>{t.mediaLabel}</span>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => handleMediaChange(e.target.files?.[0] ?? null)}
          className={s.cardText}
        />
        <span className={`text-xs opacity-60 ${s.cardText}`}>{t.mediaNote}</span>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`rounded px-4 py-3 font-medium transition-colors disabled:opacity-50 ${s.accentButton}`}
      >
        {loading ? t.sending : t.send}
      </button>
    </form>
  );
}
