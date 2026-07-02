import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Board, Post } from "@/lib/types";
import ExportClient from "@/components/ExportClient";

export default async function ExportPage({
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

  return <ExportClient board={board} posts={posts ?? []} />;
}
