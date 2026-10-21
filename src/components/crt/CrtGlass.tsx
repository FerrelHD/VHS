"use client";

import { ReactNode } from "react";
import { CrtLines } from "./CrtLines";
import { CrtGrain, CrtRoll } from "./CrtEffects";

interface CrtGlassProps {
  children: ReactNode;
}

/**
 * Clean Studio Monitor CRT Frame (Sony Trinitron / PVM style).
 * Symmetrical rounded chassis with generous inset and authentic inner cathode glass depth.
 */
export function CrtGlass({ children }: CrtGlassProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#050505] select-none">
      {/* 1. Symmetrical Studio Monitor Chassis */}
      <div className="absolute inset-[2.4vh_2.6vw] sm:inset-[2.8vh_2.8vw] rounded-[36px] sm:rounded-[46px] overflow-hidden bg-crt-tube crt-monitor flex flex-col justify-between crt-bezel-shadow">
        {/* Active Content Chamber */}
        <div className="relative w-full h-full overflow-hidden">
          {children}
        </div>

        {/* Parabolic Scanlines Canvas (K = 0.07) */}
        <CrtLines />

        {/* CRT Vertical Roll Bar */}
        <CrtRoll />

        {/* Film Grain Layer */}
        <CrtGrain />

        {/* Optical Tube Glare & Inner Glass Vignette */}
        <div className="absolute inset-0 tv-glass-overlay pointer-events-none z-30" />
      </div>
    </div>
  );
}
