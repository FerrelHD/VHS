"use client";

import { TapeProject } from "@/data/tapes";

interface TapeSubtitleProps {
  tape: TapeProject;
  onOpen: () => void;
}

/**
 * Centered 4-line project summary block beneath the active tape.
 * Exactly matches the typographic lockup in the Arc Marumo reference.
 */
export function TapeSubtitle({ tape, onOpen }: TapeSubtitleProps) {
  return (
    <div
      onClick={onOpen}
      className="flex flex-col items-center justify-center text-center cursor-pointer select-none group transition-transform active:scale-95"
      aria-label={`Open ${tape.title} details`}
    >
      {/* Line 1: Title */}
      <h2 className="text-xs sm:text-sm font-bold tracking-widest text-crt-phosphor uppercase group-hover:text-white transition-colors">
        {tape.title}
      </h2>

      {/* Line 2 & 3: Headline / Impact phrase */}
      <p className="text-[11px] sm:text-xs text-crt-phosphor/80 tracking-wider uppercase max-w-md mt-1 leading-snug">
        {tape.headline.replace(".", ",")}
      </p>
      <p className="text-[10px] sm:text-[11px] text-crt-phosphor/60 tracking-wider uppercase max-w-md leading-snug">
        FEATURED EXPERIMENTAL ARCHIVE ENTRY
      </p>

      {/* Line 4: Category & Role */}
      <div className="text-[9px] sm:text-[10px] text-crt-phosphor/40 tracking-widest uppercase mt-1.5 flex items-center gap-1.5">
        <span>{tape.category.replace("//", "•")}</span>
      </div>
    </div>
  );
}

