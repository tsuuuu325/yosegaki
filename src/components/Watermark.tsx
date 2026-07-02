// 未購入ボードの上に重ねる透かし。閲覧画面・PDF書き出しの両方に写り込む。
// pointer-events: none なので下のボードは普通に操作できる。

const TILE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220">` +
    `<text x="40" y="130" transform="rotate(-24 160 110)" ` +
    `font-family="Arial, sans-serif" font-size="26" font-weight="bold" ` +
    `fill="rgba(128,128,128,0.30)" letter-spacing="4">SAMPLE</text>` +
    `</svg>`
);

export default function Watermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-40 select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,${TILE}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
