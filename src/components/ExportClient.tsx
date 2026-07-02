"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import type { Board, Post } from "@/lib/types";
import {
  isFullyPaid,
  labelForTier,
  priceForTier,
  purchaseBoard,
  requiredTier,
} from "@/lib/purchase";
import ThemedBoard from "@/components/board-themes/ThemedBoard";
import Watermark from "@/components/Watermark";
import { buildStandaloneHtml } from "@/lib/exportStandaloneHtml";

export default function ExportClient({
  board: initialBoard,
  posts,
}: {
  board: Board;
  posts: Post[];
}) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState(initialBoard);
  const [busy, setBusy] = useState<"" | "pdf" | "html" | "purchase">("");
  const [error, setError] = useState("");

  const paid = isFullyPaid(board, posts.length);
  const tier = requiredTier(posts.length);
  const price = priceForTier(tier);

  async function exportPdf() {
    const node = captureRef.current;
    if (!node) return;
    setBusy("pdf");
    setError("");
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        fetchRequestInit: { mode: "cors" },
      });
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("画像の生成に失敗しました"));
        img.src = dataUrl;
      });
      const pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "px",
        format: [img.width, img.height],
        hotfixes: ["px_scaling"],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
      pdf.save(`${board.title}.pdf`);
    } catch (e) {
      setError(
        "PDFの作成に失敗しました: " + (e instanceof Error ? e.message : String(e))
      );
    } finally {
      setBusy("");
    }
  }

  async function exportHtmlFile() {
    const node = captureRef.current;
    if (!node) return;
    setBusy("html");
    setError("");
    try {
      const html = await buildStandaloneHtml(node, board.title);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${board.title}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(
        "ファイルの作成に失敗しました: " + (e instanceof Error ? e.message : String(e))
      );
    } finally {
      setBusy("");
    }
  }

  async function handlePurchase() {
    const ok = window.confirm(
      `${labelForTier(tier)} ¥${price.toLocaleString()} を購入しますか？\n※現在はテスト中のため、実際のお支払いは発生しません。`
    );
    if (!ok) return;
    setBusy("purchase");
    setError("");
    const { error: purchaseError } = await purchaseBoard(board.id, tier);
    setBusy("");
    if (purchaseError) {
      setError("購入処理に失敗しました: " + purchaseError);
      return;
    }
    setBoard({ ...board, paid_tier: tier, is_paid: true });
    // 透かしが消えた状態が画面に反映される（再描画・再ペイント）のを待ってから
    // 「動きも残せるファイル」を自動で作る（PDFは必要な人が別途ボタンを押す）
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
    await exportHtmlFile();
  }

  return (
    <div className="min-h-screen bg-[#efece5]">
      {/* 上部バー */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href={`/board/${board.slug}`}
            className="rounded-lg border border-[#e2ddd1] px-3 py-2 text-sm text-[#3a3227] hover:bg-[#f7f5f0]"
          >
            ← ボードに戻る
          </Link>
          <p className="text-sm text-[#6b6355]">
            {posts.length}人のメッセージ
            {paid ? (
              <span className="ml-2 rounded-full bg-[#3a7d44] px-2 py-0.5 text-xs font-medium text-white">
                購入済み
              </span>
            ) : (
              <span className="ml-2 rounded-full bg-[#a5824f] px-2 py-0.5 text-xs font-medium text-white">
                無料版（透かし入り）
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {paid ? (
            <>
              <button
                type="button"
                onClick={exportHtmlFile}
                disabled={busy !== ""}
                className="rounded-lg bg-[#3a3227] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2419] disabled:opacity-50"
              >
                {busy === "html" ? "作成中..." : "HTMLで保存"}
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={busy !== ""}
                className="rounded-lg border border-[#3a3227] px-4 py-2 text-sm font-medium text-[#3a3227] transition-colors hover:bg-[#f2efe8] disabled:opacity-50"
              >
                {busy === "pdf" ? "作成中..." : "PDFでも保存"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handlePurchase}
              disabled={busy !== ""}
              className="rounded-lg bg-[#3a3227] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2419] disabled:opacity-50"
            >
              {busy === "purchase" || busy === "pdf"
                ? "処理中..."
                : `透かしを消してPDFを保存 ¥${price.toLocaleString()}`}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      {/* 書き出し対象（この枠の中がそのままPDFになる） */}
      <div className="mx-auto max-w-6xl p-4 sm:p-8">
        <div
          ref={captureRef}
          className="relative overflow-hidden rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
        >
          <ThemedBoard board={board} posts={posts} preview />
          {!paid && <Watermark />}
        </div>
      </div>
    </div>
  );
}
