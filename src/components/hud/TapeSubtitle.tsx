"use client";

import { TapeProject } from "@/data/tapes";
import { Reveal } from "./Reveal";

interface TapeSubtitleProps {
  tape: TapeProject;
  onOpen: () => void;
  intro?: boolean;
}

/**
 * Centered project summary block beneath the active tape.
 * Accurately scaled to fit comfortably below the 3D tape and above the CRT footer.
 */
export function TapeSubtitle({ tape, onOpen, intro = true }: TapeSubtitleProps) {
  return (
    <div
      onClick={onOpen}
      className="flex flex-col items-center justify-center text-center cursor-pointer select-none group transition-transform active:scale-95 px-4 max-w-xl"
      aria-label={`Open ${tape.title} details`}
    >
      {/* Line 1: NeueBit Pixel Title */}
      <Reveal on={intro} i={0}>
        <h2 className="font-bit text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-crt-phosphor uppercase group-hover:text-white transition-colors phosphor-glow leading-tight">
          {tape.title}
        </h2>
      </Reveal>

      {/* Line 2: Headline / Impact phrase */}
      <Reveal on={intro} i={1}>
        <p className="font-mono text-[11px] sm:text-xs text-crt-phosphor/80 tracking-wider uppercase max-w-md mt-1.5 leading-relaxed">
          {tape.headline}
        </p>
      </Reveal>
    </div>
  );
}
