import {
  Shippori_Mincho,
  Noto_Serif_JP,
  Noto_Sans_JP,
  Zen_Old_Mincho,
  Zen_Kaku_Gothic_New,
  Mochiy_Pop_One,
  Zen_Maru_Gothic,
  Shippori_Antique,
  Kaisei_HarunoUmi,
  Zen_Kurenaido,
  RocknRoll_One,
  Yuji_Syuku,
  Cormorant_Garamond,
  Yomogi,
  Klee_One,
  Archivo_Black,
  Caveat,
  DotGothic16,
  Fraunces,
} from "next/font/google";
import type { Theme } from "./types";

export const shipporiMincho = Shippori_Mincho({
  weight: ["400", "700"],
  subsets: ["latin"],
});
export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
export const yomogi = Yomogi({
  weight: ["400"],
  subsets: ["latin"],
});
export const kleeOne = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
});
export const archivoBlack = Archivo_Black({
  weight: ["400"],
  subsets: ["latin"],
});
export const caveat = Caveat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});
export const dotGothic16 = DotGothic16({
  weight: ["400"],
  subsets: ["latin"],
});
export const fraunces = Fraunces({
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
});
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
});
const zenOldMincho = Zen_Old_Mincho({
  weight: ["400", "700"],
  subsets: ["latin"],
});
export const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});
const mochiyPopOne = Mochiy_Pop_One({
  weight: ["400"],
  subsets: ["latin"],
});
export const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});
const shipporiAntique = Shippori_Antique({
  weight: ["400"],
  subsets: ["latin"],
});
export const kaiseiHarunoUmi = Kaisei_HarunoUmi({
  weight: ["400", "700"],
  subsets: ["latin"],
});
const zenKurenaido = Zen_Kurenaido({
  weight: ["400"],
  subsets: ["latin"],
});
const rocknRollOne = RocknRoll_One({
  weight: ["400"],
  subsets: ["latin"],
});
const yujiSyuku = Yuji_Syuku({
  weight: ["400"],
  subsets: ["latin"],
});

export const THEME_FONTS: Record<Theme, { heading: string; body: string }> = {
  wedding: { heading: shipporiMincho.className, body: shipporiMincho.className },
  farewell: { heading: zenOldMincho.className, body: notoSerifJP.className },
  team: { heading: zenKakuGothicNew.className, body: zenKakuGothicNew.className },
  birthday: { heading: mochiyPopOne.className, body: zenMaruGothic.className },
  classicMono: { heading: shipporiAntique.className, body: notoSansJP.className },
  naturalBotanical: { heading: kaiseiHarunoUmi.className, body: zenKurenaido.className },
  popNeon: { heading: rocknRollOne.className, body: notoSansJP.className },
  japandi: { heading: yujiSyuku.className, body: notoSerifJP.className },
};
