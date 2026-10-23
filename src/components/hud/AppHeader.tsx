"use client";

import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";
import { Reveal } from "./Reveal";

export type ActiveSection = "deck" | "work" | "profile" | "archive" | "contact";

interface AppHeaderProps {
  activeView: ActiveSection;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onArchiveClick?: () => void;
  onContactClick?: () => void;
  intro?: boolean;
}

export function AppHeader({
  activeView,
  onHomeClick,
  onProfileClick,
  onArchiveClick,
  onContactClick,
  intro = true,
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

  return (
    <header className="w-full flex items-center justify-between select-none z-40 font-mono tracking-wider shrink-0 relative">
      {/* 1. Left: Home status & Running Timecode (Fixed 214px broadcast gap) */}
      <div className="flex items-center gap-[clamp(48px,14vw,214px)]">
        <Reveal on={intro} i={1} inline>
          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onHomeClick?.();
            }}
            className={`flex items-center gap-2.5 transition-colors cursor-pointer group whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs text-[clamp(12px,1.1vw,15px)] ${
              activeView === "deck"
                ? "text-white font-bold"
                : "text-crt-phosphor/70 hover:text-white"
            }`}
            aria-label="Return to carousel home"
          >
            <span
              className={`w-2.5 h-2.5 inline-block transition-transform shrink-0 ${
                activeView === "deck"
                  ? "bg-crt-phosphor shadow-[0_0_8px_rgba(235,235,230,0.8)]"
                  : "bg-crt-phosphor/40 group-hover:bg-crt-phosphor"
              }`}
            />
            <span className="tracking-widest">
              {activeView === "deck" ? "HOME" : "← REELS"}
            </span>
          </button>
        </Reveal>

        <Reveal on={intro} i={2} inline className="hidden sm:inline-flex">
          <span className="text-crt-phosphor/60 tracking-widest tabular-nums select-none whitespace-nowrap text-[clamp(13px,1.2vw,17px)]">
            {formatTimecode(seconds)}
          </span>
        </Reveal>
      </div>

      {/* 2. Center: Brand Lockup (Dead Center, calibrated 36px font in authentic NeueBit pixel font) */}
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
            className="font-bit font-bold tracking-tight text-crt-phosphor hover:text-white transition-colors phosphor-glow leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs cursor-pointer text-[clamp(26px,2.5vw,36px)]"
            aria-label="FRA 2026 Home"
          >
            FRA ©&apos;26
          </button>
        </Reveal>
      </div>

      {/* 3. Right: Nav Links (Fixed 52px gutter, 15px font) */}
      <nav className="flex items-center gap-[clamp(20px,3.8vw,52px)] text-[clamp(12px,1.1vw,15px)]">
        <Reveal on={intro} i={2} inline>
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
          >
            PROFILE
          </button>
        </Reveal>

        <Reveal on={intro} i={3} inline>
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
          >
            ARCHIVE
          </button>
        </Reveal>

        <Reveal on={intro} i={4} inline>
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
          >
            CONTACT
          </button>
        </Reveal>
      </nav>
    </header>
  );
}
