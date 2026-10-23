"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { audio } from "@/lib/audio";
import { Reveal } from "./Reveal";

export type ActiveSection = "deck" | "work" | "profile" | "archive" | "news" | "contact" | "credits";

interface AppHeaderProps {
  activeView: ActiveSection;
  onHomeClick?: () => void;
  onArchiveClick?: () => void;
  onNewsClick?: () => void;
  onContactClick?: () => void;
  intro?: boolean;
}

export function AppHeader({
  activeView,
  onHomeClick,
  onArchiveClick,
  onNewsClick,
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

  const isHomeActive = activeView === "deck" || activeView === "work";
  const isArchiveActive = activeView === "archive";
  const isNewsActive = activeView === "news";
  const isCreditsActive = activeView === "contact" || activeView === "credits";

  return (
    <header className="w-full flex items-center justify-between select-none z-40 font-mono tracking-wider shrink-0 relative pointer-events-auto">
      {/* 1. Left: Home status & Running Timecode (Adaptive gap) */}
      <div className="flex items-center gap-[clamp(16px,8vw,214px)]">
        <Reveal on={intro} i={1} inline>
          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onHomeClick?.();
            }}
            className={`flex items-center gap-1.5 sm:gap-2.5 transition-colors cursor-pointer group whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs text-[clamp(11px,1.05vw,15px)] ${
              isHomeActive
                ? "text-white font-bold"
                : "text-crt-phosphor/70 hover:text-white"
            }`}
            aria-label="Return to carousel home"
          >
            {isHomeActive && (
              <motion.span
                layoutId="nav-active-indicator"
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 inline-block bg-crt-phosphor shadow-[0_0_8px_rgba(235,235,230,0.85)] shrink-0"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="tracking-widest">
              {activeView === "deck" ? "HOME" : "← REELS"}
            </span>
          </button>
        </Reveal>

        <Reveal on={intro} i={2} inline className="hidden md:inline-flex">
          <span className="text-crt-phosphor/60 tracking-widest tabular-nums select-none whitespace-nowrap text-[clamp(13px,1.2vw,17px)]">
            {formatTimecode(seconds)}
          </span>
        </Reveal>
      </div>

      {/* 2. Center: Brand Lockup (Dead Center, adaptive font in authentic NeueBit pixel font) */}
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
            className="font-bit font-bold tracking-tight text-crt-phosphor hover:text-white transition-colors phosphor-glow leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs cursor-pointer text-[clamp(20px,2.2vw,36px)] whitespace-nowrap"
            aria-label="FRA 2026 Home"
          >
            FRA ©&apos;26
          </button>
        </Reveal>
      </div>

      {/* 3. Right: Nav Links (Adaptive gutter and font) */}
      <nav className="flex items-center gap-[clamp(10px,2.4vw,52px)] text-[clamp(11px,1.05vw,15px)]">
        <Reveal on={intro} i={2} inline>
          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onArchiveClick?.();
            }}
            className={`flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer tracking-wider whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs ${
              isArchiveActive
                ? "text-white font-bold phosphor-glow"
                : "text-crt-phosphor/60 hover:text-white"
            }`}
          >
            {isArchiveActive && (
              <motion.span
                layoutId="nav-active-indicator"
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 inline-block bg-crt-phosphor shadow-[0_0_8px_rgba(235,235,230,0.85)] shrink-0"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span>ARCHIVE</span>
          </button>
        </Reveal>

        <Reveal on={intro} i={3} inline>
          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onNewsClick?.();
            }}
            className={`flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer tracking-wider whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs ${
              isNewsActive
                ? "text-white font-bold phosphor-glow"
                : "text-crt-phosphor/60 hover:text-white"
            }`}
          >
            {isNewsActive && (
              <motion.span
                layoutId="nav-active-indicator"
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 inline-block bg-crt-phosphor shadow-[0_0_8px_rgba(235,235,230,0.85)] shrink-0"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span>NEWS</span>
          </button>
        </Reveal>

        <Reveal on={intro} i={4} inline>
          <button
            type="button"
            onClick={() => {
              audio.playClick(1.0);
              onContactClick?.();
            }}
            className={`flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer tracking-wider whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crt-phosphor/70 rounded-xs ${
              isCreditsActive
                ? "text-white font-bold phosphor-glow"
                : "text-crt-phosphor/60 hover:text-white"
            }`}
          >
            {isCreditsActive && (
              <motion.span
                layoutId="nav-active-indicator"
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 inline-block bg-crt-phosphor shadow-[0_0_8px_rgba(235,235,230,0.85)] shrink-0"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span>CREDITS</span>
          </button>
        </Reveal>
      </nav>
    </header>
  );
}
