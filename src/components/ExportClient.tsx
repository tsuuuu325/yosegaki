"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import type { Board, Post } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import {
  COUNTDOWN_PRICE,
  isFullyPaid,
  labelForTier,
  requiredTier,
  startCheckout,
  totalPrice,
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
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [error, setError] = useState("");
  const [wantsCountdown, setWantsCountdown] = useState(false);
  const [revealAtInput, setRevealAtInput] = useState("");

  const paid = isFullyPaid(board, posts.length);
  const tier = requiredTier(posts.length);
  const hasCountdown = paid ? !!board.reveal_at : wantsCountdown;
  const price = totalPrice(tier, hasCountdown);

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
    if (wantsCountdown && !revealAtInput) {
      setError("カウントダウン公開にする場合は、公開日時を指定してください");
      return;
    }
    setBusy("purchase");
    setError("");
    const { error: checkoutError } = await startCheckout(
      board.id,
      wantsCountdown && revealAtInput ? new Date(revealAtInput).toISOString() : null
    );
    if (checkoutError) {
      setBusy("");
      setError("決済ページへの移動に失敗しました: " + checkoutError);
    }
    // 成功時はここでStripeの決済ページに移動するので、busyの解除は不要
  }

  // Stripeの決済ページから戻ってきたら、支払いの反映を少し待ってから
  // 自動でHTMLファイルを作る（webhookの処理がわずかに遅れることがあるため）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") return;

    window.history.replaceState({}, "", window.location.pathname);
    let cancelled = false;

    async function waitForPayment() {
      setConfirmingPayment(true);
      for (let i = 0; i < 15; i++) {
        const { data } = await supabase
          .from("boards")
          .select("*")
          .eq("id", initialBoard.id)
          .single<Board>();
        if (cancelled) return;
        if (data && isFullyPaid(data, posts.length)) {
          setBoard(data);
          setConfirmingPayment(false);
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          );
          await exportHtmlFile();
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (!cancelled) {
        setConfirmingPayment(false);
        setError(
          "お支払いの確認に時間がかかっています。少し待ってからページを更新してください。"
        );
      }
    }

    waitForPayment();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            {paid && (
              <span className="ml-2 rounded-full bg-[#3a7d44] px-2 py-0.5 text-xs font-medium text-white">
                購入済み
              </span>
            )}
          </p>
        </div>
        {paid && (
          <div className="flex flex-wrap items-center gap-2">
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
          </div>
        )}
      </div>

      {!paid && (
        <div className="mx-auto mt-4 flex max-w-md flex-col gap-3 rounded-lg border border-[#e2ddd1] bg-white p-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={wantsCountdown}
              onChange={(e) => setWantsCountdown(e.target.checked)}
              disabled={busy !== "" || confirmingPayment}
            />
            <span className="text-sm font-medium text-[#3a3227]">
              カウントダウン公開にする（+¥{COUNTDOWN_PRICE}）
            </span>
          </label>
          <p className="text-xs text-[#6b6355]">
            指定した日時になるまで、ボードの中身は誰にも見えなくなります（招待リンクはそのまま使えます）。
          </p>
          {wantsCountdown && (
            <input
              type="datetime-local"
              value={revealAtInput}
              onChange={(e) => setRevealAtInput(e.target.value)}
              disabled={busy !== "" || confirmingPayment}
              className="rounded-lg border border-[#e2ddd1] px-3 py-2 outline-none focus:border-[#a5824f]"
            />
          )}

          <button
            type="button"
            onClick={handlePurchase}
            disabled={busy !== "" || confirmingPayment}
            className="rounded-lg bg-[#3a3227] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a2419] disabled:opacity-50"
          >
            {confirmingPayment
              ? "お支払いを確認中..."
              : busy === "purchase"
                ? "移動中..."
                : `${labelForTier(tier)} ¥${price.toLocaleString()} を購入`}
          </button>
        </div>
      )}

      {error && (
        <p className="mx-auto mt-3 max-w-md bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
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
