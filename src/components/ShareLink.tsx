"use client";

import { useState } from "react";
import type { Theme } from "@/lib/types";
import { THEME_STYLES } from "@/lib/themeStyles";
import { useOrigin } from "@/lib/useOrigin";

export default function ShareLink({
  slug,
  theme = "wedding",
}: {
  slug: string;
  theme?: Theme;
}) {
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  const url = origin ? `${origin}/board/${slug}` : "";
  const s = THEME_STYLES[theme];

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`flex flex-col gap-2 rounded p-4 ${s.ghostBox}`}>
      <p className="text-sm font-medium opacity-80">このURLを皆様にお送りください</p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className={`flex-1 rounded border px-3 py-2 text-sm ${s.inputField}`}
        />
        <button
          onClick={handleCopy}
          className={`shrink-0 rounded px-4 py-2 text-sm font-medium transition-colors ${s.accentButton}`}
        >
          {copied ? "コピーした！" : "コピー"}
        </button>
      </div>
    </div>
  );
}
