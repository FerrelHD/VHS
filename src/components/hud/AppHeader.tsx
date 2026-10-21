"use client";

import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";
import { Reveal } from "./Reveal";
import { HudConfig } from "@/lib/hudConfig";

export type ActiveSection = "deck" | "work" | "profile" | "archive" | "contact";

interface AppHeaderProps {
  activeView: ActiveSection;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onArchiveClick?: () => void;
  onContactClick?: () => void;
  intro?: boolean;
  config?: HudConfig;
}

export function AppHeader({
  activeView,
  onHomeClick,
  onProfileClick,
  onArchiveClick,
  onContactClick,
  intro = true,
  config,
}: AppHeaderProps) {
  const [seconds, setSeconds] = useState(724); // Starting around 00:12:04 like reference

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `00:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const navHomeText = config?.navHome ?? "HOME";
  const navReelsText = config?.navReels ?? "← REELS";
  const brandText = config?.brandText ?? "FRA ©'26";
  const navProfileText = config?.navProfile ?? "PROFILE";
  const navArchiveText = config?.navArchive ?? "ARCHIVE";
  const navContactText = config?.navContact ?? "CONTACT";

  return (
    <header className="w-full flex items-center justify-between select-none z-40 text-xs font-mono tracking-wider shrink-0 relative">
      {/* 1. Left: Home status & Running Timecode (Spaced to authentic broadcast OSD column) */}
      <Reveal on={intro} i={1}>
        <div
          className="flex items-center gap-[clamp(28px,7.5vw,130px)]"
          style={config ? { gap: `${config.headerGapLeft}px` } : undefined}
        >
          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onHomeClick?.();
            }}
            className={`flex items-center gap-2.5 transition-colors cursor-pointer group whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs ${
              activeView === "deck"
                ? "text-white font-bold"
                : "text-crt-phosphor/70 hover:text-white"
            }`}
            style={config ? { fontSize: `${config.navFontSize}px` } : undefined}
            aria-label="Return to carousel home"
          >
            <span
              className={`w-2 h-2 inline-block transition-transform shrink-0 ${
                activeView === "deck"
                  ? "bg-crt-phosphor shadow-[0_0_8px_rgba(235,235,230,0.8)]"
                  : "bg-crt-phosphor/40 group-hover:bg-crt-phosphor"
              }`}
            />
            <span className="tracking-widest">
              {activeView === "deck" ? navHomeText : navReelsText}
            </span>
          </button>

          <span
            className="hidden sm:inline-block text-crt-phosphor/60 tracking-widest tabular-nums select-none whitespace-nowrap"
            style={config ? { fontSize: `${config.timecodeFontSize}px` } : undefined}
          >
            {formatTimecode(seconds)}
          </span>
        </div>
      </Reveal>

      {/* 2. Center: Brand Lockup (Dead Center, in authentic NeueBit pixel font) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center select-none cursor-pointer z-10"
        onClick={() => {
          audio.playClick(0.9);
          onHomeClick?.();
        }}
      >
        <Reveal on={intro} i={0}>
          <button
            type="button"
            className="font-bit font-bold tracking-tight text-crt-phosphor hover:text-white transition-colors phosphor-glow leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs cursor-pointer"
            style={
              config
                ? { fontSize: `${config.brandFontSize}px` }
                : undefined
            }
            aria-label="FRA 2026 Home"
          >
            {brandText}
          </button>
        </Reveal>
      </div>

      {/* 3. Right: Nav Links with generous broadcast breathing room */}
      <Reveal on={intro} i={2}>
        <nav
          className="flex items-center gap-[clamp(20px,4.2vw,56px)]"
          style={config ? { gap: `${config.headerGapRight}px` } : undefined}
        >
          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onProfileClick?.();
            }}
            className={`transition-colors cursor-pointer tracking-wider pb-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs ${
              activeView === "profile"
                ? "text-white font-bold border-b border-crt-phosphor"
                : "text-crt-phosphor/70 hover:text-white border-b border-transparent"
            }`}
            style={config ? { fontSize: `${config.navFontSize}px` } : undefined}
          >
            {navProfileText}
          </button>

          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onArchiveClick?.();
            }}
            className={`transition-colors cursor-pointer tracking-wider pb-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs ${
              activeView === "archive"
                ? "text-white font-bold border-b border-crt-phosphor"
                : "text-crt-phosphor/70 hover:text-white border-b border-transparent"
            }`}
            style={config ? { fontSize: `${config.navFontSize}px` } : undefined}
          >
            {navArchiveText}
          </button>

          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onContactClick?.();
            }}
            className={`transition-colors cursor-pointer tracking-wider pb-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs ${
              activeView === "contact"
                ? "text-white font-bold border-b border-crt-phosphor"
                : "text-crt-phosphor/70 hover:text-white border-b border-transparent"
            }`}
            style={config ? { fontSize: `${config.navFontSize}px` } : undefined}
          >
            {navContactText}
          </button>
        </nav>
      </Reveal>
    </header>
  );
}
