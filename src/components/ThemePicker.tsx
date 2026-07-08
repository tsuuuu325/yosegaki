"use client";

import { useState } from "react";
import { THEME_LABELS, THEME_ORDER, type Language, type Occasion, type Theme } from "@/lib/types";
import { subtitleFor } from "@/lib/i18n";
import {
  cormorantGaramond,
  shipporiMincho,
  yomogi,
  kleeOne,
  archivoBlack,
  zenKakuGothicNew,
  caveat,
  zenMaruGothic,
  dotGothic16,
  fraunces,
} from "@/lib/fonts";
import ThemePreviewModal from "@/components/ThemePreviewModal";

function WeddingMiniPreview({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="flex h-32 flex-col items-center justify-center gap-1.5 px-3 py-3"
      style={{ backgroundColor: "#FAF6EE" }}
    >
      <span
        className={cormorantGaramond.className}
        style={{ color: "#C0A063", letterSpacing: "0.25em", fontSize: "7px" }}
      >
        WITH ALL OUR LOVE
      </span>
      <span
        className={`${cormorantGaramond.className} italic`}
        style={{ color: "#38332B", fontSize: "20px", lineHeight: 1 }}
      >
        Yuki &amp; Sota
      </span>
      <span
        className={shipporiMincho.className}
        style={{ color: "#38332B", fontSize: "8px", letterSpacing: "0.3em" }}
      >
        {subtitle}
      </span>
      <div className="mt-1.5 flex w-full gap-1.5">
        <div
          className="flex-1 rounded-md px-1.5 py-1.5"
          style={{ backgroundColor: "#FFFDF8", border: "1px solid #ECE3D2" }}
        >
          <span className={cormorantGaramond.className} style={{ color: "#C0A063", fontSize: "10px" }}>
            &ldquo;
          </span>
          <div className="mt-0.5 h-1 w-full rounded-full" style={{ backgroundColor: "#ECE3D2" }} />
          <div className="mt-0.5 h-1 w-3/4 rounded-full" style={{ backgroundColor: "#ECE3D2" }} />
        </div>
        <div
          className="flex-1 rounded-md px-1.5 py-1.5"
          style={{ backgroundColor: "#FFFDF8", border: "1px solid #ECE3D2" }}
        >
          <div className="h-1 w-full rounded-full" style={{ backgroundColor: "#ECE3D2" }} />
          <div className="mt-0.5 h-1 w-2/3 rounded-full" style={{ backgroundColor: "#ECE3D2" }} />
          <span
            className={yomogi.className}
            style={{ color: "#A9885A", fontSize: "8px", display: "block", textAlign: "right" }}
          >
            — 田中
          </span>
        </div>
      </div>
    </div>
  );
}

function FarewellMiniPreview({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="flex h-32 flex-col items-center justify-center gap-1 px-3 py-3"
      style={{ backgroundColor: "#1E2A3A" }}
    >
      <span
        className={cormorantGaramond.className}
        style={{ color: "#A98C5B", letterSpacing: "0.25em", fontSize: "6px" }}
      >
        WISHING YOU WELL
      </span>
      <span
        className={`${cormorantGaramond.className} italic`}
        style={{ color: "#F3ECDD", fontSize: "18px", lineHeight: 1 }}
      >
        Thank You
      </span>
      <span
        className={shipporiMincho.className}
        style={{ color: "#F3ECDD", fontSize: "7px", letterSpacing: "0.3em", opacity: 0.9 }}
      >
        {subtitle}
      </span>
      <div
        className="mt-1.5 w-4/5 rounded-sm px-2 py-1.5"
        style={{ backgroundColor: "#F3ECDD", boxShadow: "0 3px 8px rgba(0,0,0,0.4)" }}
      >
        <div className="h-1 w-full rounded-full" style={{ backgroundColor: "#DCCFB4" }} />
        <div className="mt-1 h-1 w-full rounded-full" style={{ backgroundColor: "#DCCFB4" }} />
        <div className="mt-1 h-1 w-2/3 rounded-full" style={{ backgroundColor: "#DCCFB4" }} />
        <span
          className={kleeOne.className}
          style={{ color: "#33302A", fontSize: "8px", display: "block", textAlign: "right" }}
        >
          — 田中
        </span>
      </div>
    </div>
  );
}

function TeamMiniPreview({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="flex h-32 flex-col justify-center gap-1 px-3 py-3"
      style={{ backgroundColor: "#F5F4F0" }}
    >
      <span
        className={archivoBlack.className}
        style={{ color: "#E4572E", letterSpacing: "0.2em", fontSize: "6px" }}
      >
        NEXT STAGE
      </span>
      <span
        className={`${zenKakuGothicNew.className} font-black`}
        style={{ color: "#16181D", fontSize: "15px", lineHeight: 1.1 }}
      >
        {subtitle}
      </span>
      <div className="flex h-1.5 w-3/5">
        <span className="h-full flex-1" style={{ backgroundColor: "#16181D" }} />
        <span className="h-full w-3" style={{ backgroundColor: "#E4572E" }} />
      </div>
      <div className="mt-1.5 flex gap-1.5">
        <div
          className="relative flex-1 rounded px-1.5 py-1.5"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #16181D",
            boxShadow: "2px 2px 0 #16181D",
            transform: "rotate(-1.5deg)",
          }}
        >
          <span
            className={archivoBlack.className}
            style={{
              position: "absolute",
              top: "-4px",
              left: "-3px",
              backgroundColor: "#16181D",
              color: "#fff",
              fontSize: "5px",
              padding: "1px 3px",
              borderRadius: "2px",
            }}
          >
            01
          </span>
          <div className="mt-1 h-1 w-full rounded-full" style={{ backgroundColor: "#E8E6E0" }} />
          <div className="mt-0.5 h-1 w-2/3 rounded-full" style={{ backgroundColor: "#E8E6E0" }} />
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded"
          style={{
            backgroundColor: "#E4572E",
            boxShadow: "2px 2px 0 #16181D",
            transform: "rotate(1.5deg)",
          }}
        >
          <span className={archivoBlack.className} style={{ color: "#fff", fontSize: "8px" }}>
            THANKS!
          </span>
        </div>
      </div>
    </div>
  );
}

function BirthdayMiniPreview({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="flex h-32 flex-col items-center justify-center gap-0.5 px-3 py-3"
      style={{ backgroundColor: "#FFF8EC" }}
    >
      <span className={caveat.className} style={{ color: "#F06292", fontSize: "14px", fontWeight: 700 }}>
        Happy Birthday!
      </span>
      <span
        className={`${zenMaruGothic.className} font-bold`}
        style={{ color: "#4A3F3C", fontSize: "11px" }}
      >
        {subtitle}
      </span>
      <div className="mt-2 flex w-full justify-center gap-2">
        {[
          { rot: -4, tape: "#F9C74F" },
          { rot: 3, tape: "#A8DADC" },
        ].map((c, i) => (
          <div
            key={i}
            className="relative w-2/5 px-1.5 pt-2.5 pb-1.5"
            style={{
              backgroundColor: "#FFFFFF",
              transform: `rotate(${c.rot}deg)`,
              boxShadow: "0 3px 8px rgba(74,63,60,0.16)",
              borderRadius: "3px",
            }}
          >
            <span
              className="absolute -top-1.5 left-1/2 h-2.5 w-8"
              style={{
                backgroundColor: c.tape,
                opacity: 0.75,
                transform: `translateX(-50%) rotate(${-c.rot}deg)`,
              }}
            />
            <div className="h-1 w-full rounded-full" style={{ backgroundColor: "#F2E8DA" }} />
            <div className="mt-0.5 h-1 w-2/3 rounded-full" style={{ backgroundColor: "#F2E8DA" }} />
            <span
              className={caveat.className}
              style={{ color: "#F06292", fontSize: "9px", display: "block", textAlign: "right", fontWeight: 600 }}
            >
              Mina
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JapandiMiniPreview({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="flex h-32 flex-col items-center justify-center gap-1.5 px-3 py-3"
      style={{ backgroundColor: "#EFEBE3" }}
    >
      <span
        className={cormorantGaramond.className}
        style={{ color: "#26231E", opacity: 0.55, letterSpacing: "0.3em", fontSize: "6px" }}
      >
        WITH GRATITUDE
      </span>
      <span
        className={shipporiMincho.className}
        style={{ color: "#26231E", fontSize: "13px", letterSpacing: "0.2em" }}
      >
        {subtitle}
      </span>
      <div className="mt-1 flex justify-center gap-1.5" style={{ direction: "rtl" }}>
        {["あ", "り", "が"].map((c, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 px-1.5 py-2"
            style={{
              backgroundColor: "#FAF8F2",
              border: "1px solid #D8D2C4",
              boxShadow: "0 1px 4px rgba(38,35,30,0.08)",
            }}
          >
            <span
              className={shipporiMincho.className}
              style={{
                writingMode: "vertical-rl",
                color: "#26231E",
                fontSize: "8px",
                letterSpacing: "0.15em",
                height: "34px",
              }}
            >
              {c}りがとう
            </span>
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#B03A2E",
                borderRadius: "1.5px",
                transform: "rotate(2deg)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function NeonPopMiniPreview({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="flex h-32 flex-col items-center justify-center gap-1 px-3 py-3"
      style={{ backgroundColor: "#0D0B1E" }}
    >
      <span
        className={`${dotGothic16.className} neon-text-cyan`}
        style={{ fontSize: "7px", letterSpacing: "0.2em" }}
      >
        LEVEL UP!
      </span>
      <span className={`${dotGothic16.className} neon-text-pink`} style={{ fontSize: "16px" }}>
        {subtitle}
      </span>
      <div className="mt-1.5 flex w-full gap-1.5">
        <div
          className="neon-card-pink flex-1 rounded-md px-1.5 py-1.5"
          style={{ backgroundColor: "#16132B" }}
        >
          <div className="h-1 w-full rounded-full" style={{ backgroundColor: "#2A2545" }} />
          <div className="mt-0.5 h-1 w-2/3 rounded-full" style={{ backgroundColor: "#2A2545" }} />
        </div>
        <div
          className="neon-card-cyan flex flex-1 items-center justify-center rounded-md"
          style={{ backgroundColor: "#16132B" }}
        >
          <span className={`${dotGothic16.className} neon-text-cyan`} style={{ fontSize: "8px" }}>
            CHEERS!
          </span>
        </div>
      </div>
    </div>
  );
}

function BotanicalMiniPreview({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="relative flex h-32 flex-col items-center justify-center gap-1 px-3 py-3"
      style={{ backgroundColor: "#F1EDE2" }}
    >
      <span
        className={`${cormorantGaramond.className} italic`}
        style={{ color: "#5B7553", fontSize: "8px", letterSpacing: "0.15em" }}
      >
        Herbarium of Gratitude
      </span>
      <span
        className={`${kleeOne.className} font-semibold`}
        style={{ color: "#3B4A3A", fontSize: "13px" }}
      >
        {subtitle}
      </span>
      <div className="relative mt-1 w-full">
        <span
          className="absolute top-0 bottom-0 left-1/2 w-px"
          style={{ backgroundColor: "#5B7553", opacity: 0.5 }}
        />
        <div className="flex flex-col gap-1.5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`w-[45%] px-1.5 py-1.5 ${i === 0 ? "mr-auto" : "ml-auto"}`}
              style={{
                backgroundColor: "#FBF9F1",
                border: "1px dashed #CBD2B8",
              }}
            >
              <span
                className={`${cormorantGaramond.className} italic`}
                style={{ color: "#5B7553", fontSize: "6px" }}
              >
                Specimen No.0{i + 1}
              </span>
              <div className="mt-0.5 h-1 w-full rounded-full" style={{ backgroundColor: "#E3E0D0" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassicMonoMiniPreview({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="flex h-32 flex-col justify-center gap-1 px-3 py-3"
      style={{ backgroundColor: "#FCFBF7" }}
    >
      <div className="h-[2px] w-full" style={{ backgroundColor: "#111111" }} />
      <div className="mt-[1px] h-px w-full" style={{ backgroundColor: "#111111" }} />
      <div className="flex flex-col items-center py-1">
        <span
          className={fraunces.className}
          style={{ color: "#111111", fontSize: "6px", letterSpacing: "0.3em", fontWeight: 600 }}
        >
          THE TRIBUTE TIMES
        </span>
        <span
          className={fraunces.className}
          style={{ color: "#111111", fontSize: "16px", fontWeight: 900, lineHeight: 1.1 }}
        >
          Thank You
        </span>
        <span
          className={shipporiMincho.className}
          style={{ color: "#111111", fontSize: "7px", letterSpacing: "0.3em" }}
        >
          {subtitle}
        </span>
      </div>
      <div className="h-px w-full" style={{ backgroundColor: "#111111" }} />
      <div className="mt-1 flex gap-1.5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex-1 px-1.5 py-1.5"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #111111" }}
          >
            <span
              className={`${fraunces.className} italic`}
              style={{ color: "#111111", fontSize: "5px", fontWeight: 600 }}
            >
              No.0{i + 1}
            </span>
            <div className="mt-0.5 h-1 w-full rounded-full" style={{ backgroundColor: "#E8E6E0" }} />
            <div className="mt-0.5 h-1 w-2/3 rounded-full" style={{ backgroundColor: "#E8E6E0" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThemePicker({
  value,
  occasion = "wedding",
  language = "en",
  onChange,
}: {
  value: Theme;
  occasion?: Occasion;
  language?: Language;
  onChange: (theme: Theme) => void;
}) {
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const subtitle = subtitleFor(language, occasion);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {THEME_ORDER.map((theme) => {
          const selected = value === theme;
          return (
            <div
              key={theme}
              className={`overflow-hidden rounded-xl border-2 transition-all ${
                selected
                  ? "border-[#3a3227] shadow-[0_4px_16px_rgba(58,50,39,0.18)]"
                  : "border-transparent hover:border-[#d8d2c2]"
              }`}
            >
              <button
                type="button"
                onClick={() => onChange(theme)}
                aria-pressed={selected}
                className="block w-full text-left"
              >
                {theme === "wedding" ? (
                  <WeddingMiniPreview subtitle={subtitle} />
                ) : theme === "farewell" ? (
                  <FarewellMiniPreview subtitle={subtitle} />
                ) : theme === "team" ? (
                  <TeamMiniPreview subtitle={subtitle} />
                ) : theme === "birthday" ? (
                  <BirthdayMiniPreview subtitle={subtitle} />
                ) : theme === "japandi" ? (
                  <JapandiMiniPreview subtitle={subtitle} />
                ) : theme === "popNeon" ? (
                  <NeonPopMiniPreview subtitle={subtitle} />
                ) : theme === "naturalBotanical" ? (
                  <BotanicalMiniPreview subtitle={subtitle} />
                ) : (
                  <ClassicMonoMiniPreview subtitle={subtitle} />
                )}
              </button>
              <div className="flex items-center justify-between gap-1 bg-white px-2 py-1.5">
                <span className="text-xs font-medium text-[#3a3227]">
                  {THEME_LABELS[theme]}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewTheme(theme)}
                  className="shrink-0 rounded-full border border-[#e2ddd1] px-2 py-0.5 text-[10px] text-[#6b6355] hover:bg-[#f7f5f0]"
                >
                  Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {previewTheme && (
        <ThemePreviewModal
          theme={previewTheme}
          occasion={occasion}
          language={language}
          onClose={() => setPreviewTheme(null)}
          onSelect={() => {
            onChange(previewTheme);
            setPreviewTheme(null);
          }}
        />
      )}
    </>
  );
}
