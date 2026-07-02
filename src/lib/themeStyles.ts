import type { Theme } from "./types";

export const THEME_STYLES: Record<
  Theme,
  {
    page: string;
    title: string;
    eyebrow: string;
    card: string;
    cardName: string;
    cardText: string;
    divider: string;
    accentButton: string;
    ghostBox: string;
    inputField: string;
  }
> = {
  wedding: {
    page: "bg-[#FAF6EE] text-[#38332B]",
    title: "text-[#38332B]",
    eyebrow: "text-[#C0A063] border-[#C0A063]",
    card: "bg-[#FFFDF8] border border-[#ECE3D2] shadow-[0_1px_2px_rgba(120,95,50,0.06)]",
    cardName: "text-[#A9885A]",
    cardText: "text-[#38332B]",
    divider: "bg-gradient-to-r from-transparent via-[#C0A063] to-transparent",
    accentButton: "bg-[#38332B] hover:bg-[#2a251f] text-[#FAF6EE]",
    ghostBox: "bg-[#FFFDF8]/80 border border-[#ECE3D2]",
    inputField: "border-[#ECE3D2] bg-[#FFFDF8] focus:border-[#C0A063]",
  },
  farewell: {
    page: "bg-[#1b2330] text-[#dbe1ea]",
    title: "text-[#f0f2f6]",
    eyebrow: "text-[#a9b6c8] border-[#3d4a5c]",
    card: "bg-[#232d3d] border border-[#33415a] shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
    cardName: "text-[#eef1f5]",
    cardText: "text-[#c1cad6]",
    divider: "bg-gradient-to-r from-transparent via-[#5c6b82] to-transparent",
    accentButton: "bg-[#c9a86a] hover:bg-[#b8935f] text-[#1b2330]",
    ghostBox: "bg-[#232d3d]/70 border border-[#33415a]",
    inputField: "border-[#3d4a5c] bg-[#1f2836] text-[#eef1f5] focus:border-[#c9a86a]",
  },
  team: {
    page: "bg-[#0f1420] text-white",
    title: "text-white",
    eyebrow: "text-[#ffd23f] border-[#ffd23f]/40",
    card: "bg-gradient-to-br from-[#1c2438] to-[#141a2a] border border-white/10 shadow-[0_6px_28px_rgba(0,0,0,0.45)]",
    cardName: "text-[#ffd23f]",
    cardText: "text-white/90",
    divider: "bg-gradient-to-r from-[#ff5f6d] via-[#ffd23f] to-[#43e97b]",
    accentButton:
      "bg-gradient-to-r from-[#ff5f6d] to-[#ffd23f] text-[#0f1420] font-bold hover:opacity-90",
    ghostBox: "bg-white/5 border border-white/10",
    inputField: "border-white/15 bg-white/5 text-white focus:border-[#ffd23f]",
  },
  birthday: {
    page: "bg-gradient-to-b from-[#fff6f0] via-[#fffaf0] to-[#f2f8ff] text-[#5a4650]",
    title: "text-[#e8567a]",
    eyebrow: "text-[#e8567a] border-[#f7b8c8]",
    card: "bg-white/90 border-2 border-[#ffe0ea] shadow-[0_6px_24px_rgba(232,86,122,0.14)] rounded-3xl",
    cardName: "text-[#e8567a]",
    cardText: "text-[#5a4650]",
    divider: "bg-gradient-to-r from-[#ffb6c9] via-[#ffe08a] to-[#a0e8d0]",
    accentButton: "bg-[#e8567a] hover:bg-[#d1445f] text-white rounded-full",
    ghostBox: "bg-white/70 border-2 border-[#ffe0ea] rounded-3xl",
    inputField: "border-[#f7b8c8] bg-white rounded-xl focus:border-[#e8567a]",
  },
  classicMono: {
    page: "bg-[#fafafa] text-[#1a1a1a]",
    title: "text-[#111111]",
    eyebrow: "text-[#111111] border-[#111111]/30",
    card: "bg-white border border-black/10 shadow-[0_2px_18px_rgba(0,0,0,0.06)]",
    cardName: "text-[#111111]",
    cardText: "text-[#3a3a3a]",
    divider: "bg-gradient-to-r from-transparent via-[#111111]/40 to-transparent",
    accentButton: "bg-[#111111] hover:bg-black text-white",
    ghostBox: "bg-white border border-black/10",
    inputField: "border-black/15 bg-white focus:border-[#111111]",
  },
  naturalBotanical: {
    page: "bg-[#f4f1e6] text-[#2f3b2f]",
    title: "text-[#2f4a3c]",
    eyebrow: "text-[#4f6b52] border-[#a8bfa0]",
    card: "bg-[#fbfaf3] border border-[#d8dfc7] shadow-[0_4px_20px_rgba(47,74,60,0.08)]",
    cardName: "text-[#2f4a3c]",
    cardText: "text-[#41503f]",
    divider: "bg-gradient-to-r from-transparent via-[#7d9471] to-transparent",
    accentButton: "bg-[#3f5d43] hover:bg-[#324a36] text-[#f4f1e6]",
    ghostBox: "bg-[#fbfaf3]/80 border border-[#d8dfc7]",
    inputField: "border-[#d8dfc7] bg-white focus:border-[#7d9471]",
  },
  popNeon: {
    page: "bg-[#0b0b14] text-white",
    title: "text-[#39ff9e]",
    eyebrow: "text-[#ff2ee0] border-[#ff2ee0]/40",
    card: "bg-[#15151f] border border-[#2a2a3d] shadow-[0_0_30px_rgba(255,46,224,0.15)]",
    cardName: "text-[#39ff9e]",
    cardText: "text-white/85",
    divider: "bg-gradient-to-r from-[#ff2ee0] via-[#39ff9e] to-[#2ee0ff]",
    accentButton:
      "bg-gradient-to-r from-[#ff2ee0] to-[#2ee0ff] text-[#0b0b14] font-bold hover:opacity-90",
    ghostBox: "bg-white/5 border border-white/10",
    inputField: "border-white/15 bg-white/5 text-white focus:border-[#ff2ee0]",
  },
  japandi: {
    page: "bg-[#f7f4ee] text-[#2b2620]",
    title: "text-[#1f1b16]",
    eyebrow: "text-[#8a6a3d] border-[#c9b184]",
    card: "bg-[#fffdf8] border border-[#e3d9c2] shadow-[0_4px_20px_rgba(43,38,32,0.08)]",
    cardName: "text-[#1f1b16]",
    cardText: "text-[#4a4234]",
    divider: "bg-gradient-to-r from-transparent via-[#8a6a3d] to-transparent",
    accentButton: "bg-[#1f1b16] hover:bg-black text-[#f7f4ee]",
    ghostBox: "bg-[#fffdf8]/80 border border-[#e3d9c2]",
    inputField: "border-[#e3d9c2] bg-white focus:border-[#8a6a3d]",
  },
};
