// 幹事が作ったボードを「この端末のブラウザ」に覚えておくための仕組み。
// ログイン不要で、ページを閉じても作成済みボードに戻れるようにする。

export type SavedBoard = {
  slug: string;
  title: string;
  createdAt: string;
};

const KEY = "yosegaki_my_boards";

export function getMyBoards(): SavedBoard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedBoard[]) : [];
  } catch {
    return [];
  }
}

export function addMyBoard(board: SavedBoard) {
  if (typeof window === "undefined") return;
  const existing = getMyBoards().filter((b) => b.slug !== board.slug);
  const next = [board, ...existing].slice(0, 50);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
