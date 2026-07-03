import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Board, Post } from "@/lib/types";
import { isFullyPaid } from "@/lib/purchase";
import ThemedBoard from "@/components/board-themes/ThemedBoard";
import Watermark from "@/components/Watermark";
import CountdownScreen from "@/components/CountdownScreen";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: board } = await supabase
    .from("boards")
    .select("*")
    .eq("slug", slug)
    .single<Board>();

  if (!board) {
    notFound();
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("board_id", board.id)
    .order("created_at", { ascending: false })
    .returns<Post[]>();

  const paid = isFullyPaid(board, posts?.length ?? 0);

  if (board.reveal_at && new Date(board.reveal_at) > new Date()) {
    return <CountdownScreen board={board} />;
  }

  return (
    <div className="relative">
      <ThemedBoard board={board} posts={posts ?? []} />
      {!paid && <Watermark />}
      <Link
        href={`/board/${board.slug}/export`}
        className="fixed right-5 bottom-5 z-50 rounded-full bg-[#1a1611] px-5 py-3 text-sm font-medium text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
      >
        完成
      </Link>
    </div>
  );
}
