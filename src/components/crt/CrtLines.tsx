"use client";

import { useEffect, useRef } from "react";
import { CRT_CONSTANTS } from "@/lib/math";

/**
 * Parabolic Curved Scanlines Overlay.
 * Curves horizontally with K = 0.16 to mimic the cylindrical curvature of a CRT tube glass.
 */
export function CrtLines() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const K = CRT_CONSTANTS.K;

      ctx.fillStyle = CRT_CONSTANTS.SCANLINE_COLOR;
      const pad = 3 * Math.ceil((height * K) / 3);

      for (let y = -pad; y < height + pad; y += CRT_CONSTANTS.SCANLINE_SPACING) {
        ctx.beginPath();
        // Top edge of the curved line
        for (let x = 0; x <= width + 12; x += 12) {
          const nx = (x - cx) / cx;
          const curvedY = cy + (y - cy) / (1 + K * nx * nx);
          if (x === 0) ctx.moveTo(x, curvedY);
          else ctx.lineTo(x, curvedY);
        }
        // Bottom edge (1px line thickness)
        for (let x = 12 * Math.ceil((width + 12) / 12); x >= 0; x -= 12) {
          const nx = (x - cx) / cx;
          const curvedY = cy + (y - cy) / (1 + K * nx * nx) + 1;
          ctx.lineTo(x, curvedY);
        }
        ctx.fill();
      }
    };

    render();
    const observer = new ResizeObserver(render);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
      aria-hidden="true"
    />
  );
}

