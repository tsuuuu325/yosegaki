const VIDEO_EXTENSIONS = ["mp4", "mov", "webm", "m4v", "ogv"];

function isVideoUrl(url: string) {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  return !!ext && VIDEO_EXTENSIONS.includes(ext);
}

// 投稿の画像/動画を、URLの拡張子から自動判定して表示する。
// 動画には <video controls> のネイティブ再生ボタンがそのまま付く。
// 何件動画が来ても、この部品を使う限り各カードごとに独立した再生ボタンになる。
export default function PostMedia({
  url,
  alt,
  className,
  style,
}: {
  url: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  // crossOrigin="anonymous" を付けないと、PDF書き出し時に
  // 「他のドメインの画像が混ざったキャンバスは書き出せない」エラーになる
  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        controls
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className={className}
        style={style}
      >
        お使いのブラウザは動画再生に対応していません。
      </video>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      crossOrigin="anonymous"
      className={className}
      style={style}
    />
  );
}
