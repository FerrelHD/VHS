"use client";

import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";

export function AudioToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(audio.isMuted);
  }, []);

  const handleToggle = () => {
    const next = !muted;
    setMuted(next);
    audio.setMuted(next);
    if (!next) {
      audio.playClick(1.2);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 py-0.5"
      aria-label="Toggle audio effects"
    >
      <span className="text-crt-phosphor/60">AUDIO:</span>
      <span className={muted ? "text-crt-phosphor/50 font-bold" : "text-crt-amber font-bold"}>
        {muted ? "[MUTED]" : "[ON]"}
      </span>
    </button>
  );
}
