"use client";

import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";

interface AppHeaderProps {
  isDetailView?: boolean;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onArchiveClick?: () => void;
  onContactClick?: () => void;
}

export function AppHeader({
  isDetailView = false,
  onHomeClick,
  onProfileClick,
  onArchiveClick,
  onContactClick,
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
    <header className="w-full flex items-center justify-between select-none z-40 text-xs tracking-wider">
      {/* 1. Left: Home status & Running Timecode */}
      <div className="flex items-center gap-5 sm:gap-7">
        <button
          type="button"
          onClick={() => {
            audio.playClick(0.9);
            onHomeClick?.();
          }}
          className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
          aria-label="Return to carousel home"
        >
          <span className="w-2.5 h-2.5 bg-crt-phosphor inline-block group-hover:scale-110 transition-transform" />
          <span className="font-bold tracking-widest">HOME</span>
        </button>

        <span className="text-crt-phosphor/70 font-mono tracking-widest text-[13px]">
          {formatTimecode(seconds)}
        </span>
      </div>

      {/* 2. Center: FRA ©'26 Brand Lockup (Dead Center) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center select-none cursor-pointer"
        onClick={() => {
          audio.playClick(0.9);
          onHomeClick?.();
        }}
      >
        <span className="text-base sm:text-lg font-black tracking-tighter text-crt-phosphor hover:text-white transition-colors phosphor-glow font-sans">
          FRA ©&apos;26
        </span>
      </div>

      {/* 3. Right: Nav Links */}
      <nav className="flex items-center gap-5 sm:gap-7">
        <button
          type="button"
          onClick={() => {
            audio.playClick(1.0);
            onProfileClick?.();
          }}
          className="text-crt-phosphor/70 hover:text-white transition-colors cursor-pointer tracking-wider"
        >
          PROFILE
        </button>

        <button
          type="button"
          onClick={() => {
            audio.playClick(1.0);
            onArchiveClick?.();
          }}
          className="text-crt-phosphor/70 hover:text-white transition-colors cursor-pointer tracking-wider"
        >
          ARCHIVE
        </button>

        <button
          type="button"
          onClick={() => {
            audio.playClick(1.0);
            onContactClick?.();
          }}
          className="text-crt-phosphor/70 hover:text-white transition-colors cursor-pointer tracking-wider"
        >
          CONTACT
        </button>
      </nav>
    </header>
  );
}
