import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Board } from "@/lib/types";
import { THEME_FONTS } from "@/lib/fonts";
import { THEME_STYLES } from "@/lib/themeStyles";
import { ui } from "@/lib/i18n";
import PostForm from "@/components/PostForm";

export default async function PostPage({
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

  const fonts = THEME_FONTS[board.theme];
  const s = THEME_STYLES[board.theme];
  const t = ui(board.language);

  return (
    <div className={`min-h-screen ${s.page} ${fonts.body}`}>
      <main className="mx-auto flex max-w-md flex-col gap-8 px-6 py-16">
        <div className="text-center">
          <p className={`text-sm opacity-70 ${s.cardText}`}>
            {t.postFor.replace("{title}", board.title)}
          </p>
          <h1 className={`mt-2 text-3xl ${fonts.heading} ${s.title}`}>
            {t.postHeading}
          </h1>
        </div>
        <PostForm
          boardId={board.id}
          boardSlug={board.slug}
          theme={board.theme}
          language={board.language}
        />
      </main>
    </div>
  );
}
