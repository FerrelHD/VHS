"use client";

import { useState, useEffect } from "react";
import { audio } from "@/lib/audio";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIMARY_EMAIL = "ferrelrashadakeyla2014@gmail.com";

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (email: string) => {
    audio.playClick(1.3);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    setCopied(email);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-heading"
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-xl bg-[#121110]/95 border border-crt-phosphor/30 rounded-xs p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col justify-between gap-6 font-mono">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-crt-phosphor/20 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-400 inline-block animate-pulse" />
            <span className="text-xs text-crt-amber tracking-widest font-bold">
              TRANSMISSION // CONTACT CHANNEL
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onClose();
            }}
            className="text-xs text-crt-phosphor/70 hover:text-white transition-colors cursor-pointer px-2.5 py-1 border border-crt-phosphor/20 hover:border-crt-phosphor/60"
            aria-label="Close transmission"
          >
            [ ESC / CLOSE ✕ ]
          </button>
        </div>

        {/* Transmission Body */}
        <div className="flex flex-col gap-5 my-2">
          <div>
            <h3 className="font-bit text-3xl sm:text-4xl font-bold text-crt-phosphor phosphor-glow leading-none">
              INITIATE COMMUNICATIONS
            </h3>
            <p className="text-xs text-crt-phosphor/70 mt-1.5 leading-relaxed font-mono">
              Open for creative engineering, frontend architecture, and technical consulting.
            </p>
          </div>

          {/* Primary Email */}
          <div className="bg-black/60 border border-crt-phosphor/20 p-4 rounded-xs flex flex-col gap-2">
            <span className="text-[10px] text-crt-phosphor/40 uppercase tracking-widest">
              DIRECT DISPATCH // PRIMARY EMAIL
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-bold text-crt-phosphor select-all font-mono truncate">
                {PRIMARY_EMAIL}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(PRIMARY_EMAIL)}
                  className="px-2.5 py-1 text-[10px] bg-crt-amber/15 hover:bg-crt-amber/30 border border-crt-amber/40 text-crt-amber font-bold transition-all cursor-pointer active:scale-95"
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
          <div className="bg-black/60 border border-crt-phosphor/20 p-4 rounded-xs flex flex-col gap-2">
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
        <div className="flex items-center justify-between text-[10px] text-crt-phosphor/40 border-t border-crt-phosphor/20 pt-3">
          <span>TIMEZONE: UTC+7 (WIB / JAKARTA)</span>
          <span>RESPONSE LATENCY: &lt; 24H</span>
        </div>
      </div>
    </div>
  );
}
