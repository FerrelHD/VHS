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
        <p className="font-mono text-[11px] sm:text-xs text-crt-phosphor/80 tracking-wider uppercase max-w-md mt-1 leading-relaxed">
          {tape.headline}
        </p>
      </Reveal>

      {/* Line 3: Telemetry Badges & Call to Action */}
      <Reveal on={intro} i={2}>
        <div className="flex items-center gap-2 mt-2.5 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase">
          <span className="px-2 py-0.5 border border-crt-phosphor/30 bg-black/40 text-crt-phosphor/90 group-hover:border-crt-phosphor/60 transition-colors">
            {tape.code}
          </span>
          <span className="text-crt-phosphor/40">•</span>
          <span className="px-2 py-0.5 border border-crt-phosphor/30 bg-black/40 text-crt-phosphor/90 group-hover:border-crt-phosphor/60 transition-colors">
            {tape.meta.duration}
          </span>
          <span className="text-crt-phosphor/40">•</span>
          <span className="px-2.5 py-0.5 border border-crt-phosphor/40 bg-crt-phosphor/10 text-crt-phosphor group-hover:bg-crt-phosphor group-hover:text-black font-bold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(235,231,222,0.1)]">
            <span>PLAY SHARD</span>
            <span className="text-[11px] leading-none">↗</span>
          </span>
        </div>
      </Reveal>
    </div>
  );
}
