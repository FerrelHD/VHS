"use client";

import { useEffect, useRef } from "react";
import { CRT_CONSTANTS } from "./math";

let filterIdCounter = 0;

/**
 * Creates an authentic SVG <feDisplacementMap> barrel distortion filter for HTML DOM elements.
 * Calibrated with full CRT curvature (Option B: k = 0.09) matching the 3D cassette deck post-processing.
 */
export function useCrtBend<T extends HTMLElement>(
  kFactor = 0.09,
  externalRef?: React.RefObject<T | null>
) {
  const internalRef = useRef<T | null>(null);
  const containerRef = externalRef || internalRef;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    const filterId = `crt-bend-${++filterIdCounter}`;
    const svgNS = "http://www.w3.org/2000/svg";
    const xlinkNS = "http://www.w3.org/1999/xlink";

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
    filter.setAttribute("x", "-6%");
    filter.setAttribute("y", "-6%");
    filter.setAttribute("width", "112%");
    filter.setAttribute("height", "112%");
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

    const generateDisplacementHref = (w: number, h: number, maxDisp: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      const imgData = ctx.createImageData(128, 128);
      const k = kFactor;
      const scaleVal = maxDisp * 2;

      for (let y = 0; y < 128; y++) {
        const ny = ((y + 0.5) / 128) * 2 - 1;
        for (let x = 0; x < 128; x++) {
          const nx = ((x + 0.5) / 128) * 2 - 1;
          const dx = k * nx * ny * ny * (w / 2);
          const dy = k * ny * nx * nx * (h / 2);
          const idx = (y * 128 + x) * 4;

          // Normalized into [-0.5, 0.5] range relative to scaleVal
          const normX = Math.max(-0.5, Math.min(0.5, dx / scaleVal));
          const normY = Math.max(-0.5, Math.min(0.5, dy / scaleVal));

          imgData.data[idx] = Math.round((normX + 0.5) * 255);
          imgData.data[idx + 1] = Math.round((normY + 0.5) * 255);
          imgData.data[idx + 2] = 128;
          imgData.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL("image/png");
    };

    let lastSize = "";

    const updateFilter = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h || `${w}x${h}` === lastSize) return;
      lastSize = `${w}x${h}`;

      // Calculate maximum displacement for Option B (k = 0.09)
      const maxDisp = Math.max(16, Math.round(Math.max(w, h) * kFactor * 0.5));
      const scaleVal = maxDisp * 2;

      const dataUrl = generateDisplacementHref(w, h, maxDisp);
      feImage.setAttribute("x", "0");
      feImage.setAttribute("y", "0");
      feImage.setAttribute("width", String(w));
      feImage.setAttribute("height", String(h));
      feImage.setAttribute("href", dataUrl);
      feImage.setAttributeNS(xlinkNS, "href", dataUrl);

      feDisplacementMap.setAttribute("scale", String(scaleVal));
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
  }, [kFactor, containerRef]);

  return containerRef;
}
