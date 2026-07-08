import Link from "next/link";
import type { Board } from "@/lib/types";
import { THEME_FONTS } from "@/lib/fonts";
import { THEME_STYLES } from "@/lib/themeStyles";
import { ui } from "@/lib/i18n";
import ShareLink from "@/components/ShareLink";
import CountdownTimer from "@/components/CountdownTimer";

// 公開日時になるまで、投稿の中身を隠して代わりに見せる画面。
// 投稿を集めるための招待リンクは、この画面からも引き続き使える。
export default function CountdownScreen({ board }: { board: Board }) {
  const fonts = THEME_FONTS[board.theme];
  const s = THEME_STYLES[board.theme];
  const t = ui(board.language);

  return (
    <div className={`min-h-screen ${s.page} ${fonts.body}`}>
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <div>
          <p className={`text-xs tracking-[0.3em] uppercase opacity-70 ${s.eyebrow}`}>
            {t.comingSoon}
          </p>
          <h1 className={`mt-2 text-3xl ${fonts.heading} ${s.title}`}>{board.title}</h1>
        </div>

        <p className={`${s.cardText} opacity-80`}>{t.comingSoonBody}</p>

        {board.reveal_at && (
          <div className={s.title}>
            <CountdownTimer revealAt={board.reveal_at} language={board.language} />
          </div>
        )}

        <div className="flex w-full flex-col gap-4">
          <ShareLink slug={board.slug} theme={board.theme} language={board.language} />
          <Link
            href={`/board/${board.slug}/post`}
            className={`rounded px-5 py-3 text-center text-sm font-medium tracking-wide transition-colors ${s.accentButton}`}
          >
            {t.giveMessage}
          </Link>
        </div>
      </div>
    </div>
  );
}
