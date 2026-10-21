"use client";

import { useEffect, useState } from "react";
import { TapeProject } from "@/data/tapes";
import { audio } from "@/lib/audio";

interface TapeDetailModalProps {
  tape: TapeProject | null;
  onClose: () => void;
}

export function TapeDetailModal({ tape, onClose }: TapeDetailModalProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!tape) return;
    audio.playClick(1.4);
    setSeconds(0);
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tape]);

  if (!tape) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const timecode = `00:${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-6 sm:p-10 font-mono text-crt-phosphor overflow-y-auto">
      {/* Top Playback Status */}
      <div className="flex items-center justify-between border-b border-crt-phosphor/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-crt-amber font-bold flex items-center gap-2 text-sm sm:text-base">
            <span className="w-2.5 h-2.5 bg-crt-amber rounded-full animate-pulse" />
            PLAY ▶
          </span>
          <span className="text-crt-phosphor/60 text-xs sm:text-sm">{tape.code}</span>
          <span className="text-crt-phosphor/40">|</span>
          <span className="text-crt-phosphor/80 text-xs sm:text-sm font-bold tracking-widest">
            {timecode}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            audio.playClick(0.8);
            onClose();
          }}
          className="px-3 py-1.5 border border-crt-red/60 text-crt-red hover:bg-crt-red/10 hover:text-white transition-all text-xs font-bold tracking-widest uppercase cursor-pointer active:scale-95 flex items-center gap-2"
        >
          <span>[ EJECT ⏏ ]</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-8 max-w-3xl mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-xs text-crt-amber tracking-widest uppercase">
            // ARCHIVE ENTRY: {tape.category} // {tape.year}
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider phosphor-glow">
            {tape.title}
          </h1>
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-crt-phosphor/80 border-l-2 border-crt-amber/60 pl-4 py-1">
          {tape.summary}
        </p>

        {/* Tech Stack Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-crt-phosphor/10 text-xs">
          <div>
            <span className="text-crt-phosphor/40 block mb-1">STANDARD</span>
            <span className="text-crt-phosphor font-bold">{tape.meta.format}</span>
          </div>
          <div>
            <span className="text-crt-phosphor/40 block mb-1">AUDIO TRACK</span>
            <span className="text-crt-phosphor font-bold">{tape.meta.quality}</span>
          </div>
          <div>
            <span className="text-crt-phosphor/40 block mb-1">TUNER</span>
            <span className="text-crt-phosphor font-bold">{tape.meta.channel}</span>
          </div>
          <div>
            <span className="text-crt-phosphor/40 block mb-1">TOTAL LENGTH</span>
            <span className="text-crt-phosphor font-bold">{tape.meta.duration}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tape.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 bg-crt-phosphor/5 border border-crt-phosphor/20 text-crt-phosphor/70"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Technical Status */}
      <div className="flex items-center justify-between text-[11px] text-crt-phosphor/40 border-t border-crt-phosphor/20 pt-4">
        <span>OLDTAPE // VCR SIMULATION ENGINE</span>
        <span>PRESS [ESC] OR [EJECT] TO RETURN</span>
      </div>
    </div>
  );
}

