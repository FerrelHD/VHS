"use client";

import { useEffect, useRef, useState } from "react";

interface VhsLoaderProps {
  ready?: boolean;
  onDone: () => void;
}

/**
 * Authentic VHS CRT Loading Screen (100% Arc Marumo format).
 * Features bottom tabular loading percentage, vintage CRT ticks bar,
 * dashed inactive progress rail, and smooth exponential easing.
 */
export function VhsLoader({ ready = false, onDone }: VhsLoaderProps) {
  const [percent, setPercent] = useState(0);
  const [isOut, setIsOut] = useState(false);
  const animRef = useRef(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  // Exponential progress interpolation
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.25, (now - lastTime) / 1000);
      lastTime = now;

      // Glide smoothly to ~96% if not yet ready, then rush to 100% once ready
      const target = ready ? 100 : 96;
      animRef.current += (target - animRef.current) * (1 - Math.exp(-6 * dt));

      if (ready && 100 - animRef.current < 0.4) {
        animRef.current = 100;
      }

      const floorVal = Math.min(100, Math.floor(animRef.current));
      setPercent((prev) => (floorVal > prev ? floorVal : prev));

      if (animRef.current < 100) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ready]);

  // Outro transition when 100% is reached
  useEffect(() => {
    if (percent < 100) return;

    // Hold 100% for 350ms, then trigger fade-out
    const tOut = setTimeout(() => {
      setIsOut(true);
    }, 350);

    // After 850ms (350ms hold + 500ms fade), signal parent completion
    const tDone = setTimeout(() => {
      onDoneRef.current();
    }, 850);

    return () => {
      clearTimeout(tOut);
      clearTimeout(tDone);
    };
  }, [percent]);

  return (
    <div
      role="status"
      aria-label={`Loading, ${percent}%`}
      className={`vhs-loader absolute inset-0 z-50 flex flex-col justify-end p-8 sm:p-12 md:p-16 select-none font-mono ${
        isOut ? "is-out" : ""
      }`}
    >
      {/* Label and Percentage Numbers */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-crt-phosphor tracking-widest uppercase mb-2">
        <span className="font-mono">Loading</span>
        <span className="font-mono tabular-nums font-bold">{percent}</span>
      </div>

      {/* Retro Ticks & Dashes Progress Bar */}
      <div
        className="w-full h-3 sm:h-3.5 flex items-center overflow-hidden"
        aria-hidden="true"
      >
        {/* Active Progress Ticks (Vertical stripes expanding to right) */}
        <div
          className="vhs-loader-ticks h-full transition-[width] duration-75 ease-out shrink-0"
          style={{ width: `${percent}%` }}
        />

        {/* Inactive Dashed Track */}
        <div className="vhs-loader-dashes h-[2px] flex-1 ml-1.5 opacity-40 shrink-0" />
      </div>
    </div>
  );
}
