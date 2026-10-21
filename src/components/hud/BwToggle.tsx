"use client";

import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";

export function BwToggle() {
  const [isBw, setIsBw] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("oldtape_bw");
    if (saved === "1") {
      setIsBw(true);
      document.documentElement.classList.add("bw");
    }
  }, []);

  const handleToggle = () => {
    audio.playSwitch();
    const next = !isBw;
    setIsBw(next);
    document.documentElement.classList.toggle("bw", next);
    try {
      localStorage.setItem("oldtape_bw", next ? "1" : "0");
    } catch {
      // Storage unavailable
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="text-xs tracking-wider uppercase px-2 py-1 border border-crt-phosphor/20 hover:border-crt-phosphor/60 transition-colors bg-black/40 backdrop-blur-sm cursor-pointer active:scale-95 flex items-center gap-1.5"
      aria-label="Toggle Black and White display mode"
    >
      <span className="text-crt-phosphor/60">COLOR:</span>
      <span className={isBw ? "text-crt-phosphor font-bold" : "text-crt-amber font-bold"}>
        {isBw ? "[B&W]" : "[CLR]"}
      </span>
    </button>
  );
}

