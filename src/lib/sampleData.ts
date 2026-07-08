import type { Board, Language, Occasion, Post, Theme } from "./types";

// テーマ選択画面の「完成イメージ」プレビューで使う、サンプルのボードと投稿。
// 実際のボード表示コンポーネントにそのまま渡すので、見た目は本番と完全に同じ。
// シーン（occasion）を渡すと、タイトルやボード上の定型文もそのシーン向けに変わる。

const SAMPLE_TITLES: Record<Occasion, string> = {
  wedding: "Yuki & Sota",
  farewell: "田中さん、ありがとう",
  graduation: "FC青葉 卒団おめでとう",
  birthday: "Happy 60th, お母さん",
  retirement: "山田部長、おつかれさまでした",
  other: "ありがとうを、かたちに",
};

export function sampleBoard(
  theme: Theme,
  occasion: Occasion = "wedding",
  language: Language = "ja"
): Board {
  return {
    id: "sample",
    slug: "sample",
    title: SAMPLE_TITLES[occasion],
    occasion,
    theme,
    event_date: "2026-06-20",
    is_paid: false,
    paid_tier: null,
    reveal_at: null,
    organizer_email: null,
    language,
    created_at: new Date().toISOString(),
  };
}

// どのシーン（結婚式・送別会・卒団・誕生日・退職）でも自然に読める文面にしてある
const RAW: Array<Pick<Post, "author_name" | "message" | "image_url">> = [
  {
    author_name: "高橋 みなと",
    message:
      "いつも周りを明るくしてくれてありがとう。これからの毎日が、笑顔でいっぱいになりますように。",
    image_url: null,
  },
  {
    author_name: "仲間一同",
    message: "みんなで撮った大切な一枚。いつ見ても、いい顔してる！",
    image_url: "/sample-photo.svg",
  },
  {
    author_name: "佐藤 はるか",
    message:
      "初めて会った日のことを、今でもよく覚えています。あなたのおかげで、毎日がずっと楽しかった。これからも変わらず、よろしくね。",
    image_url: null,
  },
  {
    author_name: "田中 あおい",
    message:
      "夜遅くまで語り合ったこと、くだらないことで笑い転げたこと、ぜんぶ大切な宝物です。あなたのまっすぐなところが大好きです。どこにいても、ずっと応援しています。",
    image_url: null,
  },
  {
    author_name: "中村 りく",
    message:
      "ピッチでも人生でも、お前の判断はいつも正しい。これからも思いっきり突っ走れ！",
    image_url: null,
  },
  {
    author_name: "山本 けんた",
    message:
      "お前が幸せそうにしてると、こっちまで嬉しくなるよ。困った時はいつでも呼べ。",
    image_url: null,
  },
  {
    author_name: "Emily",
    message: "Wishing you all the happiness in the world. Cheers to your new chapter!",
    image_url: null,
  },
  {
    author_name: "鈴木 家",
    message: "新しい毎日に、たくさんの笑顔がありますように。",
    image_url: null,
  },
];

export function samplePosts(): Post[] {
  return RAW.map((p, i) => ({
    id: `sample-${i}`,
    board_id: "sample",
    author_name: p.author_name,
    message: p.message,
    image_url: p.image_url,
    created_at: new Date().toISOString(),
  }));
}
