"use client";

import { TapeProject } from "@/data/tapes";
import { BwToggle } from "./BwToggle";

interface OsdOverlayProps {
  currentTape: TapeProject;
  currentIndex: number;
  totalTapes: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: () => void;
}

export function OsdOverlay({
  currentTape,
  currentIndex,
  totalTapes,
  onPrev,
  onNext,
  onSelect,
}: OsdOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 sm:p-7 md:p-9 font-mono">
      {/* Top OSD Bar */}
      <div className="flex items-start justify-between text-xs sm:text-sm tracking-wider pointer-events-auto">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 text-crt-red font-bold">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-crt-red animate-pulse" />
            <span>REC</span>
          </div>
          <span className="text-crt-phosphor/70">{currentTape.meta.format}</span>
          <span className="hidden sm:inline text-crt-phosphor/50">|</span>
          <span className="hidden sm:inline text-crt-phosphor/70">{currentTape.meta.channel}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-crt-phosphor/70 text-xs sm:text-sm font-mono tracking-widest">
            {currentTape.meta.duration}
          </span>
          <BwToggle />
        </div>
      </div>

      {/* Center Guidance Overlay (when hovered/active) */}
      <div className="self-center text-center select-none pointer-events-none opacity-20 hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-widest text-crt-phosphor/40 uppercase">
          // DRAG OR USE ARROW KEYS TO BROWSE //
        </span>
      </div>

      {/* Bottom OSD Bar */}
      <div className="flex flex-col sm:flex-row items-end sm:items-end justify-between gap-3 text-xs sm:text-sm pointer-events-auto">
        {/* Left: Tape Meta & Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-crt-amber text-xs tracking-widest uppercase">
            <span>{currentTape.code}</span>
            <span>•</span>
            <span>{currentTape.category}</span>
            <span>•</span>
            <span>{currentTape.year}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-crt-phosphor phosphor-glow">
            {currentTape.title}
          </h2>
          <p className="text-xs text-crt-phosphor/60 max-w-md line-clamp-2">
            {currentTape.summary}
          </p>
        </div>

        {/* Right: Interactive Navigation Controls */}
        <div className="flex items-center gap-2 select-none">
          <button
            type="button"
            onClick={onPrev}
            className="px-2.5 py-1.5 border border-crt-phosphor/20 hover:border-crt-phosphor/80 bg-black/40 text-crt-phosphor/80 hover:text-crt-phosphor transition-colors active:scale-95 text-xs tracking-wider"
            aria-label="Previous Tape"
          >
            [ ← PREV ]
          </button>

          <button
            type="button"
            onClick={onSelect}
            className="px-3 py-1.5 border border-crt-amber/40 hover:border-crt-amber bg-crt-amber/10 text-crt-amber hover:text-white transition-colors active:scale-95 text-xs font-bold tracking-wider"
            aria-label="Open Project Tape"
          >
            [ PLAY ▶ ]
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-2.5 py-1.5 border border-crt-phosphor/20 hover:border-crt-phosphor/80 bg-black/40 text-crt-phosphor/80 hover:text-crt-phosphor transition-colors active:scale-95 text-xs tracking-wider"
            aria-label="Next Tape"
          >
            [ NEXT → ]
          </button>

          <span className="text-[11px] text-crt-phosphor/40 ml-2 font-mono">
            {currentIndex + 1}/{totalTapes}
          </span>
        </div>
      </div>
    </div>
  );
}

