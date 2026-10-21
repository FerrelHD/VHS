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
    <header className="w-full flex items-center justify-between select-none z-40 text-xs font-mono tracking-wider shrink-0">
      {/* 1. Left: Home status & Running Timecode */}
      <Reveal on={intro} i={1}>
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onHomeClick?.();
            }}
            className={`flex items-center gap-2 transition-colors cursor-pointer group ${
              activeView === "deck"
                ? "text-white font-bold"
                : "text-crt-phosphor/70 hover:text-white"
            }`}
            aria-label="Return to carousel home"
          >
            <span
              className={`w-2 h-2 inline-block transition-transform ${
                activeView === "deck"
                  ? "bg-crt-phosphor shadow-[0_0_8px_rgba(235,235,230,0.8)]"
                  : "bg-crt-phosphor/40 group-hover:bg-crt-phosphor"
              }`}
            />
            <span className="tracking-widest text-[11px] sm:text-xs">
              {activeView === "deck" ? "HOME" : "← REELS"}
            </span>
          </button>

          <span className="text-crt-phosphor/60 tracking-widest text-[11px] sm:text-[12px]">
            {formatTimecode(seconds)}
          </span>
        </div>
      </Reveal>

      {/* 2. Center: FRA ©'26 Brand Lockup (Dead Center, in authentic NeueBit pixel font) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center select-none cursor-pointer"
        onClick={() => {
          audio.playClick(0.9);
          onHomeClick?.();
        }}
      >
        <Reveal on={intro} i={0}>
          <span className="font-bit text-2xl sm:text-3xl font-bold tracking-tight text-crt-phosphor hover:text-white transition-colors phosphor-glow leading-none">
            FRA ©&apos;26
          </span>
        </Reveal>
      </div>

      {/* 3. Right: Nav Links */}
      <Reveal on={intro} i={2}>
        <nav className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onProfileClick?.();
            }}
            className={`transition-colors cursor-pointer tracking-wider text-[11px] sm:text-xs pb-0.5 ${
              activeView === "profile"
                ? "text-white font-bold border-b border-crt-phosphor"
                : "text-crt-phosphor/70 hover:text-white border-b border-transparent"
            }`}
          >
            PROFILE
          </button>

          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onArchiveClick?.();
            }}
            className={`transition-colors cursor-pointer tracking-wider text-[11px] sm:text-xs pb-0.5 ${
              activeView === "archive"
                ? "text-white font-bold border-b border-crt-phosphor"
                : "text-crt-phosphor/70 hover:text-white border-b border-transparent"
            }`}
          >
            ARCHIVE
          </button>

          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onContactClick?.();
            }}
            className={`transition-colors cursor-pointer tracking-wider text-[11px] sm:text-xs pb-0.5 ${
              activeView === "contact"
                ? "text-white font-bold border-b border-crt-phosphor"
                : "text-crt-phosphor/70 hover:text-white border-b border-transparent"
            }`}
          >
            CONTACT
          </button>
        </nav>
      </Reveal>
    </header>
  );
}
