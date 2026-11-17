"use client";

import { TapeProject } from "@/data/tapes";
import { Reveal } from "./Reveal";

interface TapeSubtitleProps {
  tape: TapeProject;
  onOpen: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  intro?: boolean;
}

/**
 * Centered project summary block beneath the active tape.
 * Accurately scaled to fit comfortably below the 3D tape and above the CRT footer.
 */
export function TapeSubtitle({
  tape,
  onOpen,
  onPrev,
  onNext,
  intro = true,
}: TapeSubtitleProps) {
  return (
    <div
      onClick={onOpen}
      role="region"
      aria-live="polite"
      aria-atomic="true"
      className="flex flex-col items-center justify-center text-center cursor-pointer select-none group transition-transform active:scale-95 px-4 max-w-xl"
      aria-label={`Active reel: ${tape.title} (${tape.code})`}
    >
      {/* Line 1: NeueBit Pixel Title (Adaptive font size) */}
      <Reveal on={intro} i={0}>
        <h2 className="font-bit text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-crt-phosphor uppercase group-hover:text-white transition-colors phosphor-glow leading-tight">
          {tape.title}
        </h2>
      </Reveal>

      {/* Line 2: Headline / Impact phrase */}
      <Reveal on={intro} i={1}>
        <p className="font-mono text-[10px] sm:text-xs text-crt-phosphor/80 tracking-wider uppercase max-w-md mt-0.5 sm:mt-1 leading-relaxed">
          {tape.headline}
        </p>
      </Reveal>

      {/* Line 3: Telemetry & Call to Action (Plain text without cards or badges) */}
      <Reveal on={intro} i={2}>
        <div className="flex items-center gap-1.5 sm:gap-2.5 mt-1 sm:mt-2 font-mono text-[9px] sm:text-[11px] tracking-widest uppercase text-crt-phosphor/70">
          {onPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="text-crt-phosphor/50 hover:text-amber-400 font-bold transition-colors cursor-pointer py-0.5 px-1 active:scale-90"
              aria-label="Previous reel"
            >
              [ ◀ PREV ]
            </button>
          )}

          <span>{tape.code}</span>
          <span className="text-crt-phosphor/40">•</span>
          <span>{tape.meta.duration}</span>
          <span className="text-crt-phosphor/40">•</span>
          <span className="text-crt-phosphor group-hover:text-white transition-colors flex items-center gap-1 font-semibold">
            <span>PLAY SHARD</span>
            <span className="text-[11px] leading-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </span>

          {onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="text-crt-phosphor/50 hover:text-amber-400 font-bold transition-colors cursor-pointer py-0.5 px-1 active:scale-90"
              aria-label="Next reel"
            >
              [ NEXT ▶ ]
            </button>
          )}
        </div>
      </Reveal>
    </div>
  );
}
