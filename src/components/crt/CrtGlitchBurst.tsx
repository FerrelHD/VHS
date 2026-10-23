"use client";

interface CrtGlitchBurstProps {
  active: boolean;
}

/**
 * Authentic CRT signal displacement & chromatic tear burst.
 * Triggers on view transition to emulate analog RF channel switching.
 */
export function CrtGlitchBurst({ active }: CrtGlitchBurstProps) {
  if (!active) return null;

  return (
    <div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Red / Cyan Chromatic Aberration Slices */}
      <div className="absolute inset-0 glitch-slice-1" />
      <div className="absolute inset-0 glitch-slice-2" />

      {/* 2. Rapid Scanline Jitter */}
      <div className="absolute inset-0 glitch-scan-layer opacity-40 bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,0.08)_2px_4px)]" />

      {/* 3. High-Voltage Phosphor Flash */}
      <div className="absolute inset-0 glitch-flash-layer" />

      {/* 4. Tracking Bar Jitter */}
      <div className="absolute left-0 right-0 h-8 bg-white/20 blur-xs top-1/3 -translate-y-1/2 animate-pulse" />
    </div>
  );
}

