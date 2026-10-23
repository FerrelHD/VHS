"use client";

import { useEffect, useRef } from "react";

/**
 * High-Performance CRT Viewport Hook.
 * Bypasses heavy SVG <feDisplacementMap> CPU/GPU software rasterization on live DOM trees.
 * The physical optical glass (tv-glass.webp), parabolic scanlines (CrtLines), and rounded
 * CRT chassis provide authentic analog curvature at 120 FPS and 0% CPU overhead.
 */
export function useCrtBend<T extends HTMLElement>(
  _kFactor = 0.09,
  externalRef?: React.RefObject<T | null>
) {
  const internalRef = useRef<T | null>(null);
  const containerRef = externalRef || internalRef;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Ensure no legacy displacement filter remains attached to live DOM
    if (el.style.filter && el.style.filter.includes("crt-bend")) {
      el.style.filter = "";
    }
  }, [containerRef]);

  return containerRef;
}
