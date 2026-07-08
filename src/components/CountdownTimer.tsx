"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Language } from "@/lib/types";
import { ui } from "@/lib/i18n";

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

// サーバー描画時は0を返し、クライアントで1秒ごとに現在時刻を更新する
function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => Date.now(),
    () => 0
  );
}

function diffParts(ms: number) {
  const clamped = Math.max(ms, 0);
  return {
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped % 86_400_000) / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
    seconds: Math.floor((clamped % 60_000) / 1_000),
  };
}

export default function CountdownTimer({
  revealAt,
  language = "en",
}: {
  revealAt: string;
  language?: Language;
}) {
  const target = new Date(revealAt).getTime();
  const now = useNow();
  const t = ui(language);

  useEffect(() => {
    if (now > 0 && now >= target) {
      // 公開時刻になったら、通常のボード画面を見せるために読み込み直す
      window.location.reload();
    }
  }, [now, target]);

  // サーバーとクライアントで表示がズレないよう、最初の描画(now=0)では何も出さない
  if (now === 0) return null;

  const { days, hours, minutes, seconds } = diffParts(target - now);
  const units = [
    { label: t.days, value: days },
    { label: t.hours, value: hours },
    { label: t.minutes, value: minutes },
    { label: t.seconds, value: seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span className="text-3xl font-bold tabular-nums sm:text-4xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-xs opacity-70">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
