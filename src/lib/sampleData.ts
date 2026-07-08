import type { Board, Language, Occasion, Post, Theme } from "./types";

// テーマ選択画面の「完成イメージ」プレビューで使う、サンプルのボードと投稿。
// 実際のボード表示コンポーネントにそのまま渡すので、見た目は本番と完全に同じ。
// シーン（occasion）と言語（language）を渡すと、タイトルもサンプル投稿もその言語になる。

const SAMPLE_TITLES: Record<Language, Record<Occasion, string>> = {
  en: {
    wedding: "Yuki & Sota",
    farewell: "Thank You, Ms. Tanaka",
    graduation: "Congrats, Class of 2026",
    birthday: "Happy 60th, Mom",
    retirement: "Thank You, Mr. Yamada",
    other: "With All Our Thanks",
  },
  ja: {
    wedding: "Yuki & Sota",
    farewell: "田中さん、ありがとう",
    graduation: "FC青葉 卒団おめでとう",
    birthday: "お母さん、還暦おめでとう",
    retirement: "山田部長、おつかれさまでした",
    other: "ありがとうを、かたちに",
  },
  zh: {
    wedding: "Yuki & Sota",
    farewell: "谢谢你，田中",
    graduation: "毕业快乐，2026届",
    birthday: "妈妈，六十大寿快乐",
    retirement: "山田部长，辛苦了",
    other: "满满的感谢",
  },
  ko: {
    wedding: "Yuki & Sota",
    farewell: "다나카 씨, 고마워요",
    graduation: "2026 졸업 축하해",
    birthday: "엄마, 환갑 축하해요",
    retirement: "야마다 부장님, 수고하셨습니다",
    other: "마음을 담아",
  },
  es: {
    wedding: "Yuki & Sota",
    farewell: "Gracias, Sra. Tanaka",
    graduation: "Felicidades, promoción 2026",
    birthday: "Feliz 60, mamá",
    retirement: "Gracias, Sr. Yamada",
    other: "Con todo nuestro agradecimiento",
  },
  fr: {
    wedding: "Yuki & Sota",
    farewell: "Merci, Mme Tanaka",
    graduation: "Félicitations, promo 2026",
    birthday: "Joyeux 60 ans, maman",
    retirement: "Merci, M. Yamada",
    other: "Avec toute notre gratitude",
  },
  de: {
    wedding: "Yuki & Sota",
    farewell: "Danke, Frau Tanaka",
    graduation: "Glückwunsch, Jahrgang 2026",
    birthday: "Alles Gute zum 60., Mama",
    retirement: "Danke, Herr Yamada",
    other: "Mit unserem Dank",
  },
  pt: {
    wedding: "Yuki & Sota",
    farewell: "Obrigado, Sra. Tanaka",
    graduation: "Parabéns, turma de 2026",
    birthday: "Feliz 60, mãe",
    retirement: "Obrigado, Sr. Yamada",
    other: "Com toda a nossa gratidão",
  },
};

// サンプル投稿（名前とメッセージ）。1件だけ写真つき。
type RawPost = { author_name: string; message: string; image_url: string | null };

const SAMPLE_POSTS: Record<Language, RawPost[]> = {
  en: [
    { author_name: "Mina", message: "Thank you for always brightening our days. Wishing you every happiness.", image_url: null },
    { author_name: "The whole team", message: "This photo says it all — what a smile!", image_url: "/sample-photo.svg" },
    { author_name: "Haruka", message: "Since we met, every day has been more fun. Let's keep in touch!", image_url: null },
    { author_name: "Aoi", message: "All our late-night talks are treasures. I'm always cheering for you.", image_url: null },
    { author_name: "Riku", message: "On and off the field, you always lead the way. Keep it up!", image_url: null },
    { author_name: "Kenta", message: "Seeing you happy makes us happy too. Call anytime.", image_url: null },
    { author_name: "Emily", message: "Wishing you all the happiness in the world!", image_url: null },
    { author_name: "The Smiths", message: "May your new days be full of smiles.", image_url: null },
  ],
  ja: [
    { author_name: "高橋 みなと", message: "いつも周りを明るくしてくれてありがとう。これからの毎日が幸せでありますように。", image_url: null },
    { author_name: "仲間一同", message: "この一枚がすべてを物語ってる。最高の笑顔！", image_url: "/sample-photo.svg" },
    { author_name: "佐藤 はるか", message: "出会ってから毎日がもっと楽しくなりました。これからもよろしくね。", image_url: null },
    { author_name: "田中 あおい", message: "夜通し語り合ったこと、ぜんぶ宝物です。ずっと応援しています。", image_url: null },
    { author_name: "中村 りく", message: "いつも先頭で引っ張ってくれたね。これからも突き進んで！", image_url: null },
    { author_name: "山本 けんた", message: "あなたが幸せだと、こっちまで嬉しい。いつでも呼んでね。", image_url: null },
    { author_name: "エミリー", message: "世界中の幸せがあなたに訪れますように！", image_url: null },
    { author_name: "鈴木家", message: "これからの毎日が笑顔でいっぱいになりますように。", image_url: null },
  ],
  zh: [
    { author_name: "美娜", message: "谢谢你总是照亮我们的每一天，愿你幸福常伴。", image_url: null },
    { author_name: "全体伙伴", message: "这张照片说明了一切——笑得真好！", image_url: "/sample-photo.svg" },
    { author_name: "春香", message: "认识你之后，每天都更有趣了。要常联系哦！", image_url: null },
    { author_name: "小葵", message: "那些促膝长谈都是珍贵的回忆，我永远支持你。", image_url: null },
    { author_name: "陆", message: "无论台上台下，你总是带头前行。继续加油！", image_url: null },
    { author_name: "健太", message: "看到你幸福，我们也很开心。随时打给我。", image_url: null },
    { author_name: "艾米丽", message: "愿世界上所有的幸福都属于你！", image_url: null },
    { author_name: "铃木一家", message: "愿你今后的每一天都充满笑容。", image_url: null },
  ],
  ko: [
    { author_name: "미나", message: "언제나 주변을 밝게 해줘서 고마워요. 앞으로도 행복하길 바라요.", image_url: null },
    { author_name: "친구 일동", message: "이 한 장이 모든 걸 말해주네요 — 정말 멋진 미소!", image_url: "/sample-photo.svg" },
    { author_name: "하루카", message: "당신을 만난 뒤로 매일이 더 즐거웠어요. 앞으로도 자주 연락해요!", image_url: null },
    { author_name: "아오이", message: "밤새 나눈 이야기 모두 소중한 보물이에요. 항상 응원할게요.", image_url: null },
    { author_name: "리쿠", message: "언제나 앞장서서 이끌어 줬죠. 앞으로도 힘차게 나아가요!", image_url: null },
    { author_name: "켄타", message: "당신이 행복하면 우리도 행복해요. 언제든 불러요.", image_url: null },
    { author_name: "에밀리", message: "세상의 모든 행복이 당신에게 함께하길!", image_url: null },
    { author_name: "스즈키 가족", message: "앞으로의 나날이 웃음으로 가득하길 바라요.", image_url: null },
  ],
  es: [
    { author_name: "Mina", message: "Gracias por alegrarnos siempre los días. Te deseo toda la felicidad.", image_url: null },
    { author_name: "Todo el equipo", message: "Esta foto lo dice todo, ¡qué sonrisa!", image_url: "/sample-photo.svg" },
    { author_name: "Haruka", message: "Desde que te conocí, cada día es más divertido. ¡Sigamos en contacto!", image_url: null },
    { author_name: "Aoi", message: "Nuestras charlas hasta tarde son un tesoro. Siempre te apoyo.", image_url: null },
    { author_name: "Riku", message: "Dentro y fuera del campo, siempre marcas el camino. ¡Sigue así!", image_url: null },
    { author_name: "Kenta", message: "Verte feliz nos hace felices. Llámame cuando quieras.", image_url: null },
    { author_name: "Emily", message: "¡Te deseo toda la felicidad del mundo!", image_url: null },
    { author_name: "La familia Smith", message: "Que tus nuevos días estén llenos de sonrisas.", image_url: null },
  ],
  fr: [
    { author_name: "Mina", message: "Merci d'illuminer toujours nos journées. Je te souhaite tout le bonheur.", image_url: null },
    { author_name: "Toute l'équipe", message: "Cette photo dit tout — quel sourire !", image_url: "/sample-photo.svg" },
    { author_name: "Haruka", message: "Depuis notre rencontre, chaque jour est plus joyeux. Restons en contact !", image_url: null },
    { author_name: "Aoi", message: "Nos discussions jusqu'au bout de la nuit sont des trésors. Je te soutiens toujours.", image_url: null },
    { author_name: "Riku", message: "Sur le terrain comme dans la vie, tu montres la voie. Continue !", image_url: null },
    { author_name: "Kenta", message: "Te voir heureux nous rend heureux. Appelle quand tu veux.", image_url: null },
    { author_name: "Emily", message: "Je te souhaite tout le bonheur du monde !", image_url: null },
    { author_name: "La famille Smith", message: "Que tes nouveaux jours soient remplis de sourires.", image_url: null },
  ],
  de: [
    { author_name: "Mina", message: "Danke, dass du unsere Tage immer erhellst. Ich wünsche dir alles Glück.", image_url: null },
    { author_name: "Das ganze Team", message: "Dieses Foto sagt alles — was für ein Lächeln!", image_url: "/sample-photo.svg" },
    { author_name: "Haruka", message: "Seit wir uns kennen, ist jeder Tag schöner. Lass uns in Kontakt bleiben!", image_url: null },
    { author_name: "Aoi", message: "Unsere Gespräche bis spät in die Nacht sind Schätze. Ich unterstütze dich immer.", image_url: null },
    { author_name: "Riku", message: "Auf und neben dem Platz gehst du voran. Mach weiter so!", image_url: null },
    { author_name: "Kenta", message: "Dich glücklich zu sehen, macht auch uns glücklich. Ruf jederzeit an.", image_url: null },
    { author_name: "Emily", message: "Ich wünsche dir alles Glück der Welt!", image_url: null },
    { author_name: "Familie Smith", message: "Mögen deine neuen Tage voller Lächeln sein.", image_url: null },
  ],
  pt: [
    { author_name: "Mina", message: "Obrigado por sempre alegrar os nossos dias. Desejo-te toda a felicidade.", image_url: null },
    { author_name: "Toda a equipe", message: "Esta foto diz tudo — que sorriso!", image_url: "/sample-photo.svg" },
    { author_name: "Haruka", message: "Desde que te conheci, cada dia é mais divertido. Vamos manter contato!", image_url: null },
    { author_name: "Aoi", message: "As nossas conversas até tarde são tesouros. Torço sempre por ti.", image_url: null },
    { author_name: "Riku", message: "Dentro e fora de campo, mostras o caminho. Continua assim!", image_url: null },
    { author_name: "Kenta", message: "Ver-te feliz deixa-nos felizes. Liga quando quiseres.", image_url: null },
    { author_name: "Emily", message: "Desejo-te toda a felicidade do mundo!", image_url: null },
    { author_name: "A família Smith", message: "Que os teus novos dias sejam cheios de sorrisos.", image_url: null },
  ],
};

export function sampleBoard(
  theme: Theme,
  occasion: Occasion = "wedding",
  language: Language = "en"
): Board {
  return {
    id: "sample",
    slug: "sample",
    title: SAMPLE_TITLES[language][occasion],
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

export function samplePosts(language: Language = "en"): Post[] {
  return SAMPLE_POSTS[language].map((p, i) => ({
    id: `sample-${i}`,
    board_id: "sample",
    author_name: p.author_name,
    message: p.message,
    image_url: p.image_url,
    created_at: new Date().toISOString(),
  }));
}
