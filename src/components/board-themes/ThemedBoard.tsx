import type { Board, Post } from "@/lib/types";
import WeddingBoard from "./WeddingBoard";
import FarewellBoard from "./FarewellBoard";
import TeamBoard from "./TeamBoard";
import BirthdayBoard from "./BirthdayBoard";
import JapandiBoard from "./JapandiBoard";
import NeonPopBoard from "./NeonPopBoard";
import BotanicalBoard from "./BotanicalBoard";
import ClassicMonoBoard from "./ClassicMonoBoard";

// テーマ名から、対応するボード表示コンポーネントを選んで描く。
// 全テーマに専用デザインを必ず用意する方針のため、フォールバックは存在しない。
// 新しいテーマを types.ts に追加したら、ここに case を足さない限りビルドが通らない。
export default function ThemedBoard({
  board,
  posts,
  preview = false,
}: {
  board: Board;
  posts: Post[];
  preview?: boolean;
}) {
  const theme = board.theme;
  switch (theme) {
    case "wedding":
      return <WeddingBoard board={board} posts={posts} preview={preview} />;
    case "farewell":
      return <FarewellBoard board={board} posts={posts} preview={preview} />;
    case "team":
      return <TeamBoard board={board} posts={posts} preview={preview} />;
    case "birthday":
      return <BirthdayBoard board={board} posts={posts} preview={preview} />;
    case "japandi":
      return <JapandiBoard board={board} posts={posts} preview={preview} />;
    case "popNeon":
      return <NeonPopBoard board={board} posts={posts} preview={preview} />;
    case "naturalBotanical":
      return <BotanicalBoard board={board} posts={posts} preview={preview} />;
    case "classicMono":
      return <ClassicMonoBoard board={board} posts={posts} preview={preview} />;
  }
  // ここに到達するテーマ＝専用デザイン未実装。全テーマ実装済みになると
  // theme の型が never に絞られ、この行の型エラーが消える仕組み。
  return assertAllThemesImplemented(theme);
}

function assertAllThemesImplemented(theme: never): never {
  throw new Error(`テーマ「${theme}」の専用デザインが未実装です`);
}
