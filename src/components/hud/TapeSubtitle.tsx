"use client";

import { TapeProject } from "@/data/tapes";

interface TapeSubtitleProps {
  tape: TapeProject;
  onOpen: () => void;
}

/**
 * Centered project summary block beneath the active tape.
 * Exactly matches the typographic lockup in the Arc Marumo reference:
 * - Huge bold pixelated NeueBit title
 * - Precision Neue Montreal Mono subtitle and metadata
 */
export function TapeSubtitle({ tape, onOpen }: TapeSubtitleProps) {
  return (
    <div
      onClick={onOpen}
      className="flex flex-col items-center justify-center text-center cursor-pointer select-none group transition-transform active:scale-95 px-4"
      aria-label={`Open ${tape.title} details`}
    >
      {/* Line 1: Big NeueBit Pixel Title */}
      <h2 className="font-bit text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-crt-phosphor uppercase group-hover:text-white transition-colors phosphor-glow leading-none">
        {tape.title}
      </h2>

      {/* Line 2: Headline / Impact phrase */}
      <p className="font-mono text-[11px] sm:text-xs text-crt-phosphor/80 tracking-wider uppercase max-w-lg mt-2 leading-relaxed">
        {tape.headline}
      </p>

      {/* Line 3: Category, Year, Code */}
      <div className="font-mono text-[10px] sm:text-[11px] text-crt-amber tracking-widest uppercase mt-1.5 flex items-center gap-2">
        <span>[{tape.code}]</span>
        <span>•</span>
        <span>{tape.category}</span>
        <span>•</span>
        <span>{tape.year}</span>
      </div>
    </div>
  );
}
