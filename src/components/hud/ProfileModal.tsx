"use client";

import { useEffect } from "react";
import { audio } from "@/lib/audio";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-heading"
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#121110]/95 border border-crt-phosphor/30 rounded-xs p-6 sm:p-8 overflow-y-auto no-scrollbar shadow-2xl flex flex-col justify-between gap-6 font-mono">
        {/* Top Bar: Title & Close Button */}
        <div className="flex items-center justify-between border-b border-crt-phosphor/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-crt-amber inline-block" />
            <span className="text-xs text-crt-amber tracking-widest font-mono">
              DOSSIER // PERSON OF INTEREST // FRA ©&apos;26
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onClose();
            }}
            className="text-xs font-mono text-crt-phosphor/70 hover:text-white transition-colors cursor-pointer px-2.5 py-1 border border-crt-phosphor/20 hover:border-crt-phosphor/60"
            aria-label="Close dossier"
          >
            [ ESC / CLOSE ✕ ]
          </button>
        </div>

        {/* Main Content Grid: Portrait on Left, Bio on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start my-auto">
          {/* Portrait Photo (3/4 aspect, passport viewfinder frame) */}
          <div className="md:col-span-4 flex flex-col items-center gap-3">
            <div className="relative w-48 sm:w-56 aspect-[3/4] bg-black/80 border border-crt-phosphor/30 rounded-xs overflow-hidden p-1 group">
              <img
                src="/projects/ferrel-portrait.jpg"
                alt="Ferrel Rashad Akeyla"
                className="w-full h-full object-cover object-top grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:contrast-105 transition-all duration-700"
              />
              <div className="absolute inset-2 border border-white/20 pointer-events-none opacity-40" />
            </div>

            <div className="text-center font-mono">
              <span className="font-bit text-2xl sm:text-3xl text-crt-phosphor font-bold block leading-none mt-1">
                FERREL RASHAD AKEYLA
              </span>
              <span className="text-[10px] text-crt-amber tracking-widest block mt-0.5">
                JAKARTA, ID • UTC+7 (WIB)
              </span>
            </div>
          </div>

          {/* Bio, Philosophy, and Engineering Disciplines */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <div>
              <span className="text-[10px] text-crt-phosphor/40 tracking-widest uppercase block mb-1">
                EXECUTIVE SUMMARY
              </span>
              <p className="text-sm sm:text-base text-crt-phosphor leading-relaxed font-mono font-normal">
                Hi, I&apos;m Ferrel — a software engineer and creative
                technologist focused on crafting fluid web interfaces, real-time
                data visualisations, and interactive digital experiences.
              </p>
            </div>

            <blockquote className="border-l-2 border-crt-amber/80 pl-3.5 py-1 bg-white/[0.02]">
              <span className="font-bit text-xl sm:text-2xl text-crt-amber font-bold tracking-wide uppercase block leading-snug">
                &ldquo;CODE WITH PRECISION, DESIGN FOR PEOPLE.&rdquo;
              </span>
              <span className="text-[11px] text-crt-phosphor/60 block mt-0.5">
                Beyond engineering: 3D modeling, game environments, and
                interactive graphics.
              </span>
            </blockquote>

            {/* Core 3 Capabilities / Disciplines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-black/50 border border-crt-phosphor/15 p-3 rounded-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-crt-amber font-mono font-bold block">
                    01 // FRONTEND
                  </span>
                  <h4 className="font-bit text-lg font-bold text-crt-phosphor mt-0.5 leading-tight">
                    Frontend Engineering
                  </h4>
                </div>
                <p className="text-[10px] text-crt-phosphor/70 mt-1 leading-snug">
                  React 19, Next.js 15, Vue 3, TypeScript, and GSAP. Type-safe
                  APIs and 60 FPS motion.
                </p>
              </div>

              <div className="bg-black/50 border border-crt-phosphor/15 p-3 rounded-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-crt-amber font-mono font-bold block">
                    02 // CREATIVE
                  </span>
                  <h4 className="font-bit text-lg font-bold text-crt-phosphor mt-0.5 leading-tight">
                    Creative Development
                  </h4>
                </div>
                <p className="text-[10px] text-crt-phosphor/70 mt-1 leading-snug">
                  Console game UI, procedural Web Audio synthesis, and kinetic
                  typography.
                </p>
              </div>

              <div className="bg-black/50 border border-crt-phosphor/15 p-3 rounded-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-crt-amber font-mono font-bold block">
                    03 // FULLSTACK
                  </span>
                  <h4 className="font-bit text-lg font-bold text-crt-phosphor mt-0.5 leading-tight">
                    Full-Stack Architecture
                  </h4>
                </div>
                <p className="text-[10px] text-crt-phosphor/70 mt-1 leading-snug">
                  Laravel 11, PostgreSQL, Prisma, real-time websockets, and
                  microservice persistence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Action Links */}
        <div className="flex flex-wrap items-center justify-between border-t border-crt-phosphor/20 pt-4 gap-3 text-xs font-mono">
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
              [ EMAIL TRANSMISSION ↗ ]
            </a>
          </div>

          <span className="text-[10px] text-crt-phosphor/40">
            RECORD SERIAL: FRA-2026-SYS
          </span>
        </div>
      </div>
    </div>
  );
}
