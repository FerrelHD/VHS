"use client";

import { ReactNode } from "react";
import { CrtLines } from "./CrtLines";
import { CrtGrain, CrtRoll } from "./CrtEffects";

interface CrtGlassProps {
  children: ReactNode;
}

/**
 * Authentic Arc Marumo Studio Monitor CRT Chassis & Curved Optical Glass.
 * Uses high-fidelity optical glass overlay (tv-glass.webp) at z-index 60,
 * precisely aligned to the 2.6vh 2.4vw CRT chamber perimeter.
 */
export function CrtGlass({ children }: CrtGlassProps) {
  return (
    <div className="tv select-none">
      {/* 1. Active Cathode Tube Chamber */}
      <div className="vhs-chamber">
        {/* Child Views (TapeDeck 3D canvas, HUD, Detail views) */}
        {children}

        {/* Optical Deep CRT Tube Curvature Vignette (Option B) */}
        <div className="crt-tube-vignette" aria-hidden="true" />

        {/* Parabolic Curved Scanlines Overlay */}
        <CrtLines />

        {/* CRT Vertical Roll Bar */}
        <CrtRoll />

        {/* Film Grain Layer */}
        <CrtGrain />
      </div>

      {/* 2. Authentic Physical CRT Glass Overlay */}
      <div className="tv-glass" aria-hidden="true" />
    </div>
  );
}
