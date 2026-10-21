"use client";

import { useEffect } from "react";
import { audio } from "@/lib/audio";

interface ProfileViewProps {
  onBack: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-4xl max-h-[54vh] bg-black/60 border border-crt-phosphor/25 rounded-xs p-5 sm:p-6 flex flex-col justify-between gap-4 font-mono overflow-y-auto no-scrollbar shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-crt-phosphor/20 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-crt-phosphor inline-block" />
            <span className="text-[11px] sm:text-xs text-crt-phosphor/80 tracking-widest uppercase">
              BIOGRAPHY • FERREL RASHAD AKEYLA • FRA ©&apos;26
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

        {/* Content Body: Left Portrait + Right Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center flex-1 min-h-0">
          {/* Portrait Photo */}
          <div className="md:col-span-4 flex flex-col items-center gap-2">
            <div className="relative w-36 sm:w-44 aspect-[3/4] bg-black/90 border border-crt-phosphor/30 rounded-xs overflow-hidden p-1 group shrink-0">
              <img
                src="/projects/ferrel-portrait.jpg"
                alt="Ferrel Rashad Akeyla"
                className="w-full h-full object-cover object-top grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:contrast-105 transition-all duration-700"
              />
              <div className="absolute inset-2 border border-white/20 pointer-events-none opacity-40" />
            </div>

            <div className="text-center font-mono">
              <span className="font-bit text-xl sm:text-2xl text-crt-phosphor font-bold block leading-none">
                FERREL RASHAD AKEYLA
              </span>
              <span className="text-[10px] text-crt-phosphor/60 tracking-wider block mt-1">
                JAKARTA, ID • UTC+7 (WIB)
              </span>
            </div>
          </div>

          {/* Right Column: Bio, Quote & Disciplines */}
          <div className="md:col-span-8 flex flex-col gap-3">
            <div>
              <p className="text-xs sm:text-sm text-crt-phosphor/90 leading-relaxed font-mono">
                Software engineer and creative developer crafting fluid web interfaces,
                real-time data visualisations, and interactive digital graphics.
              </p>
            </div>

            <blockquote className="border-l-2 border-crt-phosphor/60 pl-3 py-0.5 bg-white/[0.02]">
              <span className="font-bit text-lg sm:text-xl text-crt-phosphor font-bold tracking-wide uppercase block leading-snug">
                &ldquo;CODE WITH PRECISION, DESIGN FOR PEOPLE.&rdquo;
              </span>
              <span className="text-[10px] text-crt-phosphor/60 block mt-0.5">
                Focusing on tactile web experiences, 3D graphics, and responsive architecture.
              </span>
            </blockquote>

            {/* Disciplines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-black/50 border border-crt-phosphor/15 p-2.5 rounded-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-crt-phosphor/60 font-bold block">
                    01 · FRONTEND
                  </span>
                  <h4 className="font-bit text-base font-bold text-crt-phosphor mt-0.5 leading-tight">
                    Frontend Engineering
                  </h4>
                </div>
                <p className="text-[10px] text-crt-phosphor/70 mt-1 leading-snug">
                  React 19, Next.js 15, Vue 3, TypeScript, and GSAP. 60 FPS motion.
                </p>
              </div>

              <div className="bg-black/50 border border-crt-phosphor/15 p-2.5 rounded-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-crt-phosphor/60 font-bold block">
                    02 · CREATIVE
                  </span>
                  <h4 className="font-bit text-base font-bold text-crt-phosphor mt-0.5 leading-tight">
                    Creative Development
                  </h4>
                </div>
                <p className="text-[10px] text-crt-phosphor/70 mt-1 leading-snug">
                  3D web graphics, procedural audio synthesis, and interactive UI.
                </p>
              </div>

              <div className="bg-black/50 border border-crt-phosphor/15 p-2.5 rounded-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-crt-phosphor/60 font-bold block">
                    03 · FULLSTACK
                  </span>
                  <h4 className="font-bit text-base font-bold text-crt-phosphor mt-0.5 leading-tight">
                    Full-Stack Systems
                  </h4>
                </div>
                <p className="text-[10px] text-crt-phosphor/70 mt-1 leading-snug">
                  Laravel 11, PostgreSQL, Prisma, and real-time event streaming.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Action Links */}
        <div className="flex flex-wrap items-center justify-between border-t border-crt-phosphor/20 pt-2.5 gap-2 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-4 text-crt-phosphor/80">
            <a
              href="https://github.com/FerrelHD"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              [ GITHUB: @FerrelHD ↗ ]
            </a>
            <a
              href="mailto:ferrelrashadakeyla2014@gmail.com"
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              [ ferrelrashadakeyla2014@gmail.com ↗ ]
            </a>
          </div>

          <span className="text-[10px] text-crt-phosphor/40">
            STATUS: ACTIVE • OPEN FOR COMMISSIONS
          </span>
        </div>
      </div>
    </div>
  );
}
