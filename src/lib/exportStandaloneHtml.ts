import {
  shipporiMincho,
  cormorantGaramond,
  yomogi,
  kleeOne,
  zenKakuGothicNew,
  archivoBlack,
  zenMaruGothic,
  caveat,
  dotGothic16,
  fraunces,
} from "./fonts";

// ボード閲覧画面で実際に使われている10書体だけをGoogle Fontsから読み込む。
// システムフォントには絶対に落とさない（デザイン原則）。
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Shippori+Mincho:wght@400;700",
    "family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600",
    "family=Yomogi",
    "family=Klee+One:wght@400;600",
    "family=Zen+Kaku+Gothic+New:wght@400;500;700;900",
    "family=Archivo+Black",
    "family=Zen+Maru+Gothic:wght@400;500;700",
    "family=Caveat:wght@400;600;700",
    "family=DotGothic16",
    "family=Fraunces:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700;1,900",
  ].join("&") +
  "&display=swap";

// next/font が生成するハッシュ付きクラス名（ビルドごとに変わる）を、
// 実際のGoogle Fontsのファミリー名に上書きするための対応表。
// 実行時に font オブジェクトの .className を読むので、ビルドが変わっても壊れない。
const FONT_FAMILY_OVERRIDES: Array<{ className: string; rule: string }> = [
  { className: shipporiMincho.className, rule: "'Shippori Mincho', serif" },
  { className: cormorantGaramond.className, rule: "'Cormorant Garamond', serif" },
  { className: yomogi.className, rule: "'Yomogi', cursive" },
  { className: kleeOne.className, rule: "'Klee One', cursive" },
  { className: zenKakuGothicNew.className, rule: "'Zen Kaku Gothic New', sans-serif" },
  { className: archivoBlack.className, rule: "'Archivo Black', sans-serif" },
  { className: zenMaruGothic.className, rule: "'Zen Maru Gothic', sans-serif" },
  { className: caveat.className, rule: "'Caveat', cursive" },
  { className: dotGothic16.className, rule: "'DotGothic16', monospace" },
  { className: fraunces.className, rule: "'Fraunces', serif" },
];

async function toDataUrl(url: string): Promise<string> {
  const res = await fetch(url, { mode: "cors" });
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("メディアの読み込みに失敗しました"));
    reader.readAsDataURL(blob);
  });
}

// 現在のページが読み込んでいるCSS（Tailwindやアニメーションの定義）を
// そのまま集めて、書き出すHTMLに埋め込む。
async function collectPageCss(): Promise<string> {
  const parts: string[] = [];
  document.querySelectorAll("style").forEach((el) => {
    if (el.textContent) parts.push(el.textContent);
  });
  const linkEls = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  );
  await Promise.all(
    linkEls.map(async (link) => {
      try {
        const res = await fetch(link.href);
        parts.push(await res.text());
      } catch {
        // 取得できないスタイルはスキップ（致命的ではない）
      }
    })
  );
  return parts.join("\n");
}

// ボードのDOMを1つの.htmlファイルにまとめる。
// 写真・動画はBase64で埋め込むので、書き出し後はどこにも通信せず、
// アニメーションも含めて何度でもオフラインで開ける。
export async function buildStandaloneHtml(
  node: HTMLElement,
  title: string
): Promise<string> {
  const clone = node.cloneNode(true) as HTMLElement;

  const mediaEls = Array.from(clone.querySelectorAll("img, video"));
  await Promise.all(
    mediaEls.map(async (el) => {
      const src = el.getAttribute("src");
      if (!src || src.startsWith("data:")) return;
      try {
        el.setAttribute("src", await toDataUrl(src));
      } catch {
        // 1件失敗しても他は書き出しを続ける
      }
    })
  );

  const pageCss = await collectPageCss();
  const fontOverrideCss = FONT_FAMILY_OVERRIDES.map(
    (f) => `.${f.className} { font-family: ${f.rule} !important; }`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link href="${GOOGLE_FONTS_HREF}" rel="stylesheet" />
<style>${pageCss}</style>
<style>${fontOverrideCss}</style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`;
}
