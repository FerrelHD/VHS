"use client";

import { useState, useEffect } from "react";
import { audio } from "@/lib/audio";

interface ContactViewProps {
  onBack: () => void;
}

const PRIMARY_EMAIL = "ferrelrashadakeyla2014@gmail.com";

export function ContactView({ onBack }: ContactViewProps) {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  const handleCopy = (email: string) => {
    audio.playClick(1.3);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    setCopied(email);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-xl max-h-[54vh] bg-black/60 border border-crt-phosphor/25 rounded-xs p-5 sm:p-6 flex flex-col justify-between gap-4 font-mono shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-crt-phosphor/20 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-emerald-400 inline-block animate-pulse" />
            <span className="text-[11px] sm:text-xs text-crt-phosphor/80 tracking-widest font-bold uppercase">
              TRANSMISSION • CONTACT CHANNEL
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onBack();
            }}
            className="text-[11px] text-crt-phosphor/60 hover:text-white transition-colors cursor-pointer px-2 py-0.5 border border-crt-phosphor/20 hover:border-crt-phosphor/50"
          >
            [ ← RETURN / ESC ]
          </button>
        </div>

        {/* Transmission Body */}
        <div className="flex flex-col gap-4 my-auto">
          <div>
            <h3 className="font-bit text-3xl sm:text-4xl font-bold text-crt-phosphor phosphor-glow leading-none uppercase">
              INITIATE COMMUNICATIONS
            </h3>
            <p className="text-xs text-crt-phosphor/70 mt-1.5 leading-relaxed font-mono">
              Open for creative engineering, frontend architecture, and technical consulting.
            </p>
          </div>

          {/* Primary Email */}
          <div className="bg-black/60 border border-crt-phosphor/20 p-3.5 rounded-xs flex flex-col gap-1.5">
            <span className="text-[10px] text-crt-phosphor/40 uppercase tracking-widest">
              DIRECT DISPATCH • PRIMARY EMAIL
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-bold text-crt-phosphor select-all font-mono truncate">
                {PRIMARY_EMAIL}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(PRIMARY_EMAIL)}
                  className="px-2.5 py-1 text-[10px] bg-crt-phosphor/10 hover:bg-crt-phosphor/20 border border-crt-phosphor/30 text-white font-bold transition-all cursor-pointer active:scale-95"
                >
                  {copied === PRIMARY_EMAIL ? "[ COPIED ✓ ]" : "[ COPY ]"}
                </button>
                <a
                  href={`mailto:${PRIMARY_EMAIL}`}
                  className="px-2.5 py-1 text-[10px] bg-white/5 hover:bg-white/15 border border-crt-phosphor/20 text-crt-phosphor hover:text-white transition-all cursor-pointer"
                >
                  [ MAIL ↗ ]
                </a>
              </div>
            </div>
          </div>

          {/* GitHub Profile */}
          <div className="bg-black/60 border border-crt-phosphor/20 p-3.5 rounded-xs flex flex-col gap-1.5">
            <span className="text-[10px] text-crt-phosphor/40 uppercase tracking-widest">
              PUBLIC CODE REPOSITORY
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-bold text-crt-phosphor font-mono truncate">
                github.com/FerrelHD
              </span>

              <a
                href="https://github.com/FerrelHD"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-[10px] bg-white/5 hover:bg-white/15 border border-crt-phosphor/20 text-crt-phosphor hover:text-white transition-all cursor-pointer shrink-0"
              >
                [ OPEN GITHUB ↗ ]
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-crt-phosphor/40 border-t border-crt-phosphor/20 pt-2.5 shrink-0">
          <span>TIMEZONE: UTC+7 (WIB / JAKARTA)</span>
          <span>RESPONSE LATENCY: &lt; 24H</span>
        </div>
      </div>
    </div>
  );
}
