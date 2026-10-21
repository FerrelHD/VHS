"use client";

import { useEffect, useRef } from "react";
import { CRT_CONSTANTS } from "./math";

let filterIdCounter = 0;

/**
 * Creates a subtle SVG <feDisplacementMap> barrel distortion filter for HTML DOM elements.
 * Calibrated with gentle optical curvature (~12px displacement) matching the CRT glass surface,
 * ensuring text remains crisp, legible, and comfortably positioned.
 */
export function useCrtBend<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    const filterId = `crt-bend-${++filterIdCounter}`;
    const svgNS = "http://www.w3.org/2000/svg";

    let svgHost = document.getElementById("crt-svg-filters") as SVGSVGElement | null;
    if (!svgHost) {
      svgHost = document.createElementNS(svgNS, "svg") as SVGSVGElement;
      svgHost.id = "crt-svg-filters";
      svgHost.setAttribute("aria-hidden", "true");
      svgHost.style.position = "absolute";
      svgHost.style.width = "0";
      svgHost.style.height = "0";
      svgHost.style.pointerEvents = "none";
      svgHost.style.overflow = "hidden";
      document.body.appendChild(svgHost);
    }

    const filter = document.createElementNS(svgNS, "filter");
    filter.id = filterId;
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", "1");
    filter.setAttribute("height", "1");
    filter.setAttribute("primitiveUnits", "userSpaceOnUse");
    filter.setAttribute("color-interpolation-filters", "sRGB");

    const feImage = document.createElementNS(svgNS, "feImage");
    feImage.setAttribute("preserveAspectRatio", "none");
    feImage.setAttribute("result", "displacementMap");

    const feDisplacementMap = document.createElementNS(svgNS, "feDisplacementMap");
    feDisplacementMap.setAttribute("in", "SourceGraphic");
    feDisplacementMap.setAttribute("in2", "displacementMap");
    feDisplacementMap.setAttribute("xChannelSelector", "R");
    feDisplacementMap.setAttribute("yChannelSelector", "G");

    filter.appendChild(feImage);
    filter.appendChild(feDisplacementMap);
    svgHost.appendChild(filter);

    const generateDisplacementHref = (w: number, h: number, maxScale: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      const imgData = ctx.createImageData(128, 128);
      const k = CRT_CONSTANTS.K; // 0.07

      for (let y = 0; y < 128; y++) {
        const ny = ((y + 0.5) / 128) * 2 - 1;
        for (let x = 0; x < 128; x++) {
          const nx = ((x + 0.5) / 128) * 2 - 1;
          const dx = k * nx * ny * ny * (w / 2);
          const dy = k * ny * nx * nx * (h / 2);
          const idx = (y * 128 + x) * 4;

          imgData.data[idx] = Math.max(0, Math.min(255, Math.round((0.5 + dx / maxScale) * 255)));
          imgData.data[idx + 1] = Math.max(0, Math.min(255, Math.round((0.5 + dy / maxScale) * 255)));
          imgData.data[idx + 2] = 128;
          imgData.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL();
    };

    let lastSize = "";

    const updateFilter = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h || `${w}x${h}` === lastSize) return;
      lastSize = `${w}x${h}`;

      // Subtle scale: max displacement ~12px so text is gentle and clean
      const maxScale = Math.min(14, Math.max(10, Math.round(Math.max(w, h) * 0.009)));

      feImage.setAttribute("x", "0");
      feImage.setAttribute("y", "0");
      feImage.setAttribute("width", String(w));
      feImage.setAttribute("height", String(h));
      feImage.setAttribute("href", generateDisplacementHref(w, h, maxScale * 8));

      feDisplacementMap.setAttribute("scale", String(maxScale));
      el.style.filter = `url(#${filterId})`;
    };

    updateFilter();
    const observer = new ResizeObserver(updateFilter);
    observer.observe(el);

    return () => {
      observer.disconnect();
      filter.remove();
      if (el) {
        el.style.filter = "";
      }
    };
  }, []);

  return containerRef;
}
