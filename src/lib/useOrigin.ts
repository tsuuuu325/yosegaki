import { useSyncExternalStore } from "react";

// サーバー側では空文字、ブラウザに表示された後に実際のオリジンが入る
export function useOrigin() {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => ""
  );
}
