import type { Language, Occasion } from "./types";

// ===== ギフト（閲覧者が見る部分）の多言語テキスト =====
// 幹事の作業画面は英語固定。ここはボードごとに選んだ言語で表示される。

// タイトル下に出る、お祝い/感謝のひとこと（シーンごと・言語ごと）
const SUBTITLE: Record<Language, Record<Occasion, string>> = {
  en: {
    wedding: "Congratulations",
    farewell: "Thank You",
    graduation: "Congratulations",
    birthday: "Happy Birthday",
    retirement: "Thank You",
    other: "With Love",
  },
  ja: {
    wedding: "ご結婚おめでとう",
    farewell: "今までありがとう",
    graduation: "卒業おめでとう",
    birthday: "お誕生日おめでとう",
    retirement: "長い間おつかれさま",
    other: "こころを込めて",
  },
  zh: {
    wedding: "新婚快乐",
    farewell: "感谢有你",
    graduation: "毕业快乐",
    birthday: "生日快乐",
    retirement: "退休快乐",
    other: "心意满满",
  },
  ko: {
    wedding: "결혼을 축하합니다",
    farewell: "그동안 감사했습니다",
    graduation: "졸업을 축하합니다",
    birthday: "생일 축하합니다",
    retirement: "그동안 수고하셨습니다",
    other: "마음을 담아",
  },
  es: {
    wedding: "Felicidades",
    farewell: "Gracias por todo",
    graduation: "Felicidades",
    birthday: "Feliz Cumpleaños",
    retirement: "Feliz Jubilación",
    other: "Con Cariño",
  },
  fr: {
    wedding: "Félicitations",
    farewell: "Merci pour tout",
    graduation: "Félicitations",
    birthday: "Joyeux Anniversaire",
    retirement: "Bonne Retraite",
    other: "Avec Amour",
  },
  de: {
    wedding: "Herzlichen Glückwunsch",
    farewell: "Danke für alles",
    graduation: "Herzlichen Glückwunsch",
    birthday: "Alles Gute zum Geburtstag",
    retirement: "Alles Gute zum Ruhestand",
    other: "Mit Liebe",
  },
  pt: {
    wedding: "Parabéns",
    farewell: "Obrigado por tudo",
    graduation: "Parabéns",
    birthday: "Feliz Aniversário",
    retirement: "Feliz Aposentadoria",
    other: "Com Carinho",
  },
};

// シーンを3つの気持ちに寄せる（フッター文言の出し分け用）
type Sentiment = "celebrate" | "thanks" | "love";
const OCCASION_SENTIMENT: Record<Occasion, Sentiment> = {
  wedding: "celebrate",
  graduation: "celebrate",
  birthday: "celebrate",
  farewell: "thanks",
  retirement: "thanks",
  other: "love",
};

// 一番下に出る「◯人からの祝福」的なフッター（言語ごと・気持ちごと）
const FOOTER: Record<Language, Record<Sentiment, (n: number) => string>> = {
  en: {
    celebrate: (n) => `${n} heartfelt wishes`,
    thanks: (n) => `${n} messages of thanks`,
    love: (n) => `${n} messages with love`,
  },
  ja: {
    celebrate: (n) => `${n}人からの祝福`,
    thanks: (n) => `${n}人からの感謝`,
    love: (n) => `${n}人からの想い`,
  },
  zh: {
    celebrate: (n) => `来自${n}人的祝福`,
    thanks: (n) => `来自${n}人的感谢`,
    love: (n) => `来自${n}人的心意`,
  },
  ko: {
    celebrate: (n) => `${n}명의 축하 메시지`,
    thanks: (n) => `${n}명의 감사 메시지`,
    love: (n) => `${n}명의 마음`,
  },
  es: {
    celebrate: (n) => `${n} felicitaciones`,
    thanks: (n) => `${n} mensajes de agradecimiento`,
    love: (n) => `${n} mensajes con cariño`,
  },
  fr: {
    celebrate: (n) => `${n} vœux`,
    thanks: (n) => `${n} messages de remerciement`,
    love: (n) => `${n} messages affectueux`,
  },
  de: {
    celebrate: (n) => `${n} Glückwünsche`,
    thanks: (n) => `${n} Dankesnachrichten`,
    love: (n) => `${n} liebevolle Nachrichten`,
  },
  pt: {
    celebrate: (n) => `${n} felicitações`,
    thanks: (n) => `${n} mensagens de agradecimento`,
    love: (n) => `${n} mensagens com carinho`,
  },
};

// DBに language 列が無い古いボード等で lang が未設定でも落ちないよう英語にフォールバック
function safeLang(lang: Language): Language {
  return SUBTITLE[lang] ? lang : "en";
}

export function subtitleFor(lang: Language, occasion: Occasion): string {
  return SUBTITLE[safeLang(lang)][occasion];
}

export function footerFor(lang: Language, occasion: Occasion, n: number): string {
  return FOOTER[safeLang(lang)][OCCASION_SENTIMENT[occasion]](n);
}

// ===== 閲覧者が見るUIの文言 =====
export type UIStrings = {
  sharePrompt: string;
  copy: string;
  copied: string;
  giveMessage: string;
  emptyBoard: string;
  postHeading: string;
  postFor: string; // 「◯◯へ」の接続。{title}を置き換える
  nameLabel: string;
  messageLabel: string;
  mediaLabel: string;
  mediaNote: string;
  send: string;
  sending: string;
  validation: string;
  uploadFailed: string;
  postFailed: string;
  thankYouTitle: string;
  thankYouBody: string;
  seeBoard: string;
  comingSoon: string;
  comingSoonBody: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const UI: Record<Language, UIStrings> = {
  en: {
    sharePrompt: "Send this link to everyone",
    copy: "Copy",
    copied: "Copied!",
    giveMessage: "Write a message",
    emptyBoard: "No messages yet. Be the first to write one.",
    postHeading: "Write a message",
    postFor: "A message for {title}",
    nameLabel: "Your name",
    messageLabel: "Message",
    mediaLabel: "Photo / Video (optional)",
    mediaNote: "Photos up to 8MB, videos up to 50MB",
    send: "Send",
    sending: "Sending...",
    validation: "Please enter your name and message",
    uploadFailed: "Upload failed",
    postFailed: "Could not send your message",
    thankYouTitle: "Thank you!",
    thankYouBody: "Your message has been sent.",
    seeBoard: "See the board",
    comingSoon: "Coming Soon",
    comingSoonBody: "Almost there. We're gathering messages.",
    days: "days",
    hours: "hours",
    minutes: "min",
    seconds: "sec",
  },
  ja: {
    sharePrompt: "このリンクを皆様にお送りください",
    copy: "コピー",
    copied: "コピーした！",
    giveMessage: "メッセージを贈る",
    emptyBoard: "まだメッセージが届いていません。最初の一言をお寄せください。",
    postHeading: "メッセージを贈る",
    postFor: "{title} へのメッセージ",
    nameLabel: "お名前",
    messageLabel: "メッセージ",
    mediaLabel: "写真・動画（任意）",
    mediaNote: "写真は8MBまで、動画は50MBまで",
    send: "贈る",
    sending: "送信中...",
    validation: "お名前とメッセージをご入力ください",
    uploadFailed: "アップロードに失敗しました",
    postFailed: "投稿に失敗しました",
    thankYouTitle: "ありがとうございました！",
    thankYouBody: "メッセージを送りました。",
    seeBoard: "ボードを見る",
    comingSoon: "Coming Soon",
    comingSoonBody: "公開までもう少し。今はメッセージを集めています。",
    days: "日",
    hours: "時間",
    minutes: "分",
    seconds: "秒",
  },
  zh: {
    sharePrompt: "请将此链接发送给大家",
    copy: "复制",
    copied: "已复制！",
    giveMessage: "写留言",
    emptyBoard: "还没有留言。快来写下第一条吧。",
    postHeading: "写留言",
    postFor: "给 {title} 的留言",
    nameLabel: "您的名字",
    messageLabel: "留言",
    mediaLabel: "照片 / 视频（可选）",
    mediaNote: "照片最大8MB，视频最大50MB",
    send: "发送",
    sending: "发送中...",
    validation: "请输入您的名字和留言",
    uploadFailed: "上传失败",
    postFailed: "留言发送失败",
    thankYouTitle: "谢谢！",
    thankYouBody: "留言已发送。",
    seeBoard: "查看留言板",
    comingSoon: "敬请期待",
    comingSoonBody: "即将公开。我们正在收集留言。",
    days: "天",
    hours: "时",
    minutes: "分",
    seconds: "秒",
  },
  ko: {
    sharePrompt: "이 링크를 모두에게 보내주세요",
    copy: "복사",
    copied: "복사됨!",
    giveMessage: "메시지 남기기",
    emptyBoard: "아직 메시지가 없습니다. 첫 메시지를 남겨보세요.",
    postHeading: "메시지 남기기",
    postFor: "{title} 에게 보내는 메시지",
    nameLabel: "이름",
    messageLabel: "메시지",
    mediaLabel: "사진 / 동영상 (선택)",
    mediaNote: "사진은 8MB, 동영상은 50MB까지",
    send: "보내기",
    sending: "보내는 중...",
    validation: "이름과 메시지를 입력해 주세요",
    uploadFailed: "업로드에 실패했습니다",
    postFailed: "메시지를 보내지 못했습니다",
    thankYouTitle: "감사합니다!",
    thankYouBody: "메시지를 보냈습니다.",
    seeBoard: "보드 보기",
    comingSoon: "Coming Soon",
    comingSoonBody: "곧 공개됩니다. 지금은 메시지를 모으고 있어요.",
    days: "일",
    hours: "시간",
    minutes: "분",
    seconds: "초",
  },
  es: {
    sharePrompt: "Envía este enlace a todos",
    copy: "Copiar",
    copied: "¡Copiado!",
    giveMessage: "Escribir un mensaje",
    emptyBoard: "Aún no hay mensajes. Sé el primero en escribir uno.",
    postHeading: "Escribir un mensaje",
    postFor: "Un mensaje para {title}",
    nameLabel: "Tu nombre",
    messageLabel: "Mensaje",
    mediaLabel: "Foto / Video (opcional)",
    mediaNote: "Fotos hasta 8MB, videos hasta 50MB",
    send: "Enviar",
    sending: "Enviando...",
    validation: "Por favor ingresa tu nombre y mensaje",
    uploadFailed: "Error al subir",
    postFailed: "No se pudo enviar tu mensaje",
    thankYouTitle: "¡Gracias!",
    thankYouBody: "Tu mensaje ha sido enviado.",
    seeBoard: "Ver el tablero",
    comingSoon: "Próximamente",
    comingSoonBody: "Ya casi. Estamos reuniendo los mensajes.",
    days: "días",
    hours: "horas",
    minutes: "min",
    seconds: "seg",
  },
  fr: {
    sharePrompt: "Envoyez ce lien à tout le monde",
    copy: "Copier",
    copied: "Copié !",
    giveMessage: "Écrire un message",
    emptyBoard: "Aucun message pour l'instant. Soyez le premier à en écrire un.",
    postHeading: "Écrire un message",
    postFor: "Un message pour {title}",
    nameLabel: "Votre nom",
    messageLabel: "Message",
    mediaLabel: "Photo / Vidéo (facultatif)",
    mediaNote: "Photos jusqu'à 8 Mo, vidéos jusqu'à 50 Mo",
    send: "Envoyer",
    sending: "Envoi...",
    validation: "Veuillez saisir votre nom et votre message",
    uploadFailed: "Échec du téléversement",
    postFailed: "Impossible d'envoyer votre message",
    thankYouTitle: "Merci !",
    thankYouBody: "Votre message a été envoyé.",
    seeBoard: "Voir le tableau",
    comingSoon: "Bientôt",
    comingSoonBody: "Plus que quelques instants. Nous rassemblons les messages.",
    days: "jours",
    hours: "heures",
    minutes: "min",
    seconds: "sec",
  },
  de: {
    sharePrompt: "Sende diesen Link an alle",
    copy: "Kopieren",
    copied: "Kopiert!",
    giveMessage: "Nachricht schreiben",
    emptyBoard: "Noch keine Nachrichten. Schreib die erste.",
    postHeading: "Nachricht schreiben",
    postFor: "Eine Nachricht für {title}",
    nameLabel: "Dein Name",
    messageLabel: "Nachricht",
    mediaLabel: "Foto / Video (optional)",
    mediaNote: "Fotos bis 8 MB, Videos bis 50 MB",
    send: "Senden",
    sending: "Senden...",
    validation: "Bitte gib deinen Namen und deine Nachricht ein",
    uploadFailed: "Upload fehlgeschlagen",
    postFailed: "Nachricht konnte nicht gesendet werden",
    thankYouTitle: "Danke!",
    thankYouBody: "Deine Nachricht wurde gesendet.",
    seeBoard: "Zur Pinnwand",
    comingSoon: "Demnächst",
    comingSoonBody: "Fast geschafft. Wir sammeln gerade die Nachrichten.",
    days: "Tage",
    hours: "Std",
    minutes: "Min",
    seconds: "Sek",
  },
  pt: {
    sharePrompt: "Envie este link para todos",
    copy: "Copiar",
    copied: "Copiado!",
    giveMessage: "Escrever uma mensagem",
    emptyBoard: "Ainda não há mensagens. Seja o primeiro a escrever uma.",
    postHeading: "Escrever uma mensagem",
    postFor: "Uma mensagem para {title}",
    nameLabel: "Seu nome",
    messageLabel: "Mensagem",
    mediaLabel: "Foto / Vídeo (opcional)",
    mediaNote: "Fotos até 8MB, vídeos até 50MB",
    send: "Enviar",
    sending: "Enviando...",
    validation: "Por favor, insira seu nome e mensagem",
    uploadFailed: "Falha no envio",
    postFailed: "Não foi possível enviar sua mensagem",
    thankYouTitle: "Obrigado!",
    thankYouBody: "Sua mensagem foi enviada.",
    seeBoard: "Ver o mural",
    comingSoon: "Em breve",
    comingSoonBody: "Quase lá. Estamos reunindo as mensagens.",
    days: "dias",
    hours: "horas",
    minutes: "min",
    seconds: "seg",
  },
};

export function ui(lang: Language): UIStrings {
  return UI[lang] ?? UI.en;
}
