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
import { ui } from "./i18n";
import type { Language } from "./types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 公開日時までメッセージを隠し、カウントダウンを見せるオーバーレイと、
// 公開の瞬間に紙吹雪を出すスクリプトを生成する。
// ファイル内で完結する“ソフトな鍵”（サプライズ用途向け）。
function countdownOverlay(
  revealAt: string,
  language: Language,
  title: string,
  bg: string,
  fg: string
): string {
  const targetMs = new Date(revealAt).getTime();
  const t = ui(language);
  return `
<div id="yg-lock" style="position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;text-align:center;padding:24px;background:${bg};color:${fg};font-family:'Cormorant Garamond','Shippori Mincho',serif;">
  <div style="letter-spacing:.35em;text-transform:uppercase;font-size:13px;opacity:.7;">${escapeHtml(t.comingSoon)}</div>
  <div style="font-size:clamp(28px,6vw,44px);font-weight:600;line-height:1.2;">${escapeHtml(title)}</div>
  <div style="opacity:.8;font-size:15px;">${escapeHtml(t.comingSoonBody)}</div>
  <div id="yg-timer" style="display:flex;gap:20px;"></div>
</div>
<canvas id="yg-confetti" style="position:fixed;inset:0;z-index:100000;pointer-events:none;display:none;"></canvas>
<script>
(function(){
  var target=${targetMs};
  var lock=document.getElementById('yg-lock');
  var timer=document.getElementById('yg-timer');
  var L={d:${JSON.stringify(t.days)},h:${JSON.stringify(t.hours)},m:${JSON.stringify(t.minutes)},s:${JSON.stringify(t.seconds)}};
  function pad(n){return(n<10?'0':'')+n;}
  function unit(v,l){return '<div style="display:flex;flex-direction:column;align-items:center;"><span style="font-size:clamp(26px,7vw,40px);font-weight:700;">'+pad(v)+'</span><span style="font-size:11px;opacity:.7;letter-spacing:.05em;">'+l+'</span></div>';}
  var iv=null, revealed=false;
  function render(){
    var diff=target-Date.now();
    if(diff<=0){finish();return;}
    var d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
    timer.innerHTML=unit(d,L.d)+unit(h,L.h)+unit(m,L.m)+unit(s,L.s);
  }
  function finish(){
    if(revealed)return; revealed=true;
    if(iv)clearInterval(iv);
    lock.style.transition='opacity .8s ease'; lock.style.opacity='0';
    setTimeout(function(){ if(lock.parentNode)lock.parentNode.removeChild(lock); confetti(); },800);
  }
  function confetti(){
    var c=document.getElementById('yg-confetti'); if(!c)return;
    c.style.display='block'; var ctx=c.getContext('2d');
    function size(){c.width=window.innerWidth;c.height=window.innerHeight;} size(); window.addEventListener('resize',size);
    var colors=['#C0A063','#E4572E','#F06292','#39ff9e','#33E0FF','#ffd23f'];
    var P=[]; for(var i=0;i<150;i++){P.push({x:Math.random()*c.width,y:-20-Math.random()*c.height*0.4,r:4+Math.random()*5,vy:2+Math.random()*3,vx:-1.2+Math.random()*2.4,rot:Math.random()*6,vr:-.12+Math.random()*.24,col:colors[i%colors.length]});}
    var start=Date.now();
    (function frame(){
      ctx.clearRect(0,0,c.width,c.height);
      for(var i=0;i<P.length;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.col;ctx.fillRect(-p.r,-p.r,p.r*2,p.r*1.4);ctx.restore();}
      if(Date.now()-start<4500)requestAnimationFrame(frame); else {c.style.display='none';}
    })();
  }
  if(target-Date.now()<=0){ revealed=true; if(lock.parentNode)lock.parentNode.removeChild(lock); }
  else { iv=setInterval(render,1000); render(); }
})();
</script>`;
}

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
  title: string,
  options?: { revealAt?: string | null; language?: Language }
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

  const language = options?.language ?? "en";

  // カウントダウン公開が設定されていれば、鍵オーバーレイを埋め込む。
  // ボード本体の背景色・文字色を拾って、オーバーレイの見た目をテーマに合わせる。
  let overlay = "";
  if (options?.revealAt) {
    const themeRoot = (node.firstElementChild as HTMLElement | null) ?? node;
    const cs = getComputedStyle(themeRoot);
    const bg = cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)"
      ? cs.backgroundColor
      : "#FAF6EE";
    const fg = cs.color || "#38332B";
    overlay = countdownOverlay(options.revealAt, language, title, bg, fg);
  }

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link href="${GOOGLE_FONTS_HREF}" rel="stylesheet" />
<style>${pageCss}</style>
<style>${fontOverrideCss}</style>
</head>
<body>
${clone.outerHTML}
${overlay}
</body>
</html>`;
}
