"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { audio } from "@/lib/audio";
import { useCrtBend } from "@/lib/useCrtBend";

interface ContactViewProps {
  onBack: () => void;
}

interface DisplaceableLine {
  el: HTMLElement;
  side: "left" | "right";
  initialTop: number;
}

export interface CreditsTweakSettings {
  initialTop: number;
  initialScale: number;
  finalScale: number;
  baseColGap: number;
  repulsionPush: number;
  repulsionRadius: number;
  headlinePadding: number;
}

const DEFAULT_SETTINGS: CreditsTweakSettings = {
  initialTop: 75,
  initialScale: 0.44,
  finalScale: 1.05,
  baseColGap: 56,
  repulsionPush: 115,
  repulsionRadius: 210,
  headlinePadding: 165,
};

function getSavedSettings(): CreditsTweakSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem("vhs_credits_tweak_settings");
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

/**
 * Cyberpunk: Edgerunners Production Credits View.
 * 100% Faithful recreation of arcmarumo.com/profile:
 * - Upright physical VHS tape in dead center with 3D Y-axis spinning on scroll + mouse parallax
 * - Dynamic Obstacle Repulsion ("Teks Minggir"): As each credit line approaches the vertical zone
 *   of the center tape, it dynamically slides outward (-115px to the left, +115px to the right),
 *   creating an organic magnetic corridor around the cassette!
 * - Large editorial serif statement sweeping behind the tape
 * - Smooth exponential inertia scrolling engine with top & bottom CRT cathode beam fade
 * - Integrated Live Tweak HUD to interactively adjust poster height, scale, and text spacing in real-time!
 */
export function ContactView({ onBack }: ContactViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const tapeRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<CreditsTweakSettings>(getSavedSettings);
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0 });
  const startLoopRef = useRef<() => void>(() => {});
  const measureRef = useRef<() => void>(() => {});
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
    try {
      localStorage.setItem("vhs_credits_tweak_settings", JSON.stringify(settings));
    } catch {}
    measureRef.current();
    startLoopRef.current();
  }, [settings]);

  const updateSetting = <K extends keyof CreditsTweakSettings>(
    key: K,
    val: CreditsTweakSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    audio.playClick(0.9);
    setSettings(DEFAULT_SETTINGS);
  };

  const handleCopy = () => {
    audio.playClick(1.1);
    navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Apply authentic CRT barrel distortion curvature
  useCrtBend(0.09, containerRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth <= 1024) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    mouseRef.current = { x, y };
    startLoopRef.current();
  }, []);

  // Native Arc Marumo Kinetic Engine with Dynamic Obstacle Repulsion
  useEffect(() => {
    const container = containerRef.current;
    const reel = reelRef.current;
    const tape = tapeRef.current;
    if (!container || !reel) return;

    let targetY = 0;
    let currentY = 0;
    let velocity = 0;
    let maxY = 0;
    let lastTime = performance.now();
    let isPointerDown = false;
    let pointerStartY = 0;
    let pointerLastY = 0;
    let pointerLastTime = 0;
    let dragDist = 0;
    let rafId = 0;
    let lines: DisplaceableLine[] = [];

    const EASE = 13;

    const measure = () => {
      if (!container || !reel) return;
      const viewH = container.clientHeight;
      const contentH = reel.scrollHeight;
      maxY = Math.max(0, contentH - viewH + 200);
      targetY = Math.max(0, Math.min(maxY, targetY));
      currentY = Math.max(0, Math.min(maxY, currentY));

      // Cache all displaceable lines and their absolute top relative to the reel
      const elements = Array.from(reel.querySelectorAll<HTMLElement>("[data-displace]"));
      lines = elements.map((el) => {
        let top = 0;
        let curr: HTMLElement | null = el;
        while (curr && curr !== reel) {
          top += curr.offsetTop;
          curr = curr.offsetParent as HTMLElement | null;
        }
        return {
          el,
          side: (el.getAttribute("data-displace") as "left" | "right") || "left",
          initialTop: top + el.offsetHeight / 2,
        };
      });

      render();
    };

    measureRef.current = measure;

    /**
     * Render vertical scroll position, 3D tape rotation,
     * dynamic scale expansion from top to center via GPU compositing,
     * and dynamic magnetic obstacle repulsion for each line!
     */
    const render = () => {
      if (!reel) return;

      // 1. Move credits reel vertically
      reel.style.transform = `translate3d(0, ${-currentY.toFixed(1)}px, 0)`;

      // 2. Dynamic Tape Position & Scale from top-small to center-large
      const { initialTop, initialScale, finalScale, repulsionPush, repulsionRadius } =
        settingsRef.current;
      const isDesktop = window.innerWidth > 640;
      const topAnchor = initialTop;
      const baseTapeHeight = isDesktop ? 331 : 286;
      const centerY = container.clientHeight / 2;

      const scrollThreshold = 360;
      const progress = Math.min(1, Math.max(0, currentY / scrollThreshold));

      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);

      // Tape scale starts compact at initialScale and expands to finalScale
      const tapeScale = initialScale + ease * (finalScale - initialScale);

      // Target shift down from top anchor to dead center of viewport
      const targetCenterShift = Math.max(0, centerY - topAnchor - (baseTapeHeight * finalScale) / 2);
      const dy = targetCenterShift * ease;

      // Tape screen Y coordinate for obstacle calculation
      const tapeScreenY = topAnchor + (baseTapeHeight * tapeScale) / 2 + dy;

      if (tape) {
        // Continuous 3D rotation on scroll (0.24 deg/px) + mouse parallax tilt
        const spinY = currentY * 0.24 + mouseRef.current.x * 6;
        const tiltX = -mouseRef.current.y * 5;

        tape.style.top = `${topAnchor}px`;
        tape.style.transform = `translate3d(-50%, ${dy.toFixed(
          1
        )}px, 0) perspective(1200px) rotateY(${spinY.toFixed(2)}deg) rotateX(${tiltX.toFixed(
          2
        )}deg) scale(${tapeScale.toFixed(3)})`;
      }

      // 3. Dynamic Obstacle Repulsion ("Teks Minggir")
      if (window.innerWidth > 768) {
        const radius = (repulsionRadius / 1.05) * tapeScale; // Influence radius scales with the physical tape
        const maxDisplacement = repulsionPush * Math.min(1.2, tapeScale); // Max horizontal push to the side

        for (const item of lines) {
          // Current vertical center of this line relative to tape's current position
          const lineY = item.initialTop - currentY;
          const distY = lineY - tapeScreenY;
          const absDy = Math.abs(distY);

          if (absDy < radius) {
            // Smooth cosine repulsion curve: 1 at center, 0 at radius boundary
            const curve = Math.cos((absDy / radius) * (Math.PI / 2));
            const push = maxDisplacement * curve;
            const shiftX = item.side === "left" ? -push : push;
            item.el.style.transform = `translate3d(${shiftX.toFixed(1)}px, 0, 0)`;
          } else {
            if (item.el.style.transform) {
              item.el.style.transform = "";
            }
          }
        }
      } else {
        // Clear on mobile to keep stacked columns natural
        for (const item of lines) {
          if (item.el.style.transform) item.el.style.transform = "";
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (!isPointerDown && Math.abs(velocity) > 0.08) {
        targetY += velocity * dt;
        velocity *= Math.exp(-3.8 * dt);
        targetY = Math.max(0, Math.min(maxY, targetY));
      }

      const diff = targetY - currentY;
      if (Math.abs(diff) > 0.1) {
        currentY += diff * (1 - Math.exp(-EASE * dt));
        render();
      } else if (currentY !== targetY) {
        currentY = targetY;
        render();
      } else {
        render();
      }

      if (isPointerDown || Math.abs(diff) > 0.1 || Math.abs(velocity) > 0.08) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const startLoop = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    startLoopRef.current = startLoop;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 38;
      else if (e.deltaMode === 2) delta *= container.clientHeight;

      targetY = Math.max(0, Math.min(maxY, targetY + delta * 0.95));
      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isPointerDown = true;
      dragDist = 0;
      pointerStartY = e.clientY;
      pointerLastY = e.clientY;
      pointerLastTime = performance.now();
      velocity = 0;
      startLoop();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const dy = e.clientY - pointerLastY;
      dragDist += Math.abs(dy);
      const now = performance.now();
      const dt = Math.max(1, now - pointerLastTime);

      velocity = (-dy / dt) * 1000;
      targetY = Math.max(0, Math.min(maxY, targetY - dy));
      currentY = targetY;
      render();

      pointerLastY = e.clientY;
      pointerLastTime = now;
      startLoop();
    };

    const onPointerUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (Math.abs(velocity) > 50) {
        velocity = Math.max(-2800, Math.min(2800, velocity * 0.8));
      }
      startLoop();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        targetY = Math.min(maxY, targetY + 280);
        startLoop();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        targetY = Math.max(0, targetY - 280);
        startLoop();
      } else if (e.key === "Home") {
        e.preventDefault();
        targetY = 0;
        startLoop();
      } else if (e.key === "End") {
        e.preventDefault();
        targetY = maxY;
        startLoop();
      }
    };

    measure();
    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(container);
    resizeObserver.observe(reel);

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 select-none font-mono text-crt-phosphor overflow-hidden cursor-grab active:cursor-grabbing"
      tabIndex={0}
    >
      {/* 1. TOP & BOTTOM CRT SCANLINE FADE MASK */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent calc(var(--pj-top) - 15px), #000 calc(var(--pj-top) + 40px), #000 calc(100% - var(--pj-bottom) - 45px), transparent calc(100% - var(--pj-bottom) + 10px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent calc(var(--pj-top) - 15px), #000 calc(var(--pj-top) + 40px), #000 calc(100% - var(--pj-bottom) - 45px), transparent calc(100% - var(--pj-bottom) + 10px), transparent 100%)",
        }}
      >
        {/* 2. VERTICAL ROLLING CREDITS REEL */}
        <div
          ref={reelRef}
          style={{ paddingTop: `calc(var(--pj-top) + ${settings.headlinePadding}px)` }}
          className="w-full max-w-5xl mx-auto px-6 sm:px-10 pb-[calc(var(--pj-bottom)+180px)] flex flex-col items-center will-change-transform"
        >
          {/* SECTION A: MASSIVE EDITORIAL SERIF HEADLINE */}
          <div className="w-full max-w-2xl text-center mb-16 sm:mb-24 pt-4 sm:pt-6">
            <h1 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-white/90 leading-relaxed font-normal tracking-tight">
              An original animated tragedy forged by Studio TRIGGER and CD PROJEKT RED,
              setting fire to the skies of Night City.
            </h1>
          </div>

          {/* SECTION B: CREDITS PAIR 01 - STUDIOS & CREATIVE DIRECTION */}
          <div
            style={{ columnGap: `${settings.baseColGap}px` }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-10 my-10 sm:my-16 text-xs sm:text-sm"
          >
            {/* Left Column (Pushes to the LEFT when passing tape) */}
            <div className="flex flex-col md:items-end">
              <h2
                data-displace="left"
                className="text-[11px] text-crt-phosphor/60 tracking-widest uppercase mb-3 font-mono will-change-transform"
              >
                [PRODUCTION ENTITIES]
              </h2>
              <ul className="flex flex-col gap-3 w-full md:items-end">
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">STUDIO TRIGGER</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">ANIMATION</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">CD PROJEKT RED</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">ORIGINAL IP</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">MIKE PONDSMITH</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">CYBERPUNK CREATOR</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">NETFLIX</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">GLOBAL BROADCAST</span>
                </li>
              </ul>
            </div>

            {/* Right Column (Pushes to the RIGHT when passing tape) */}
            <div className="flex flex-col md:items-start">
              <h2
                data-displace="right"
                className="text-[11px] text-crt-phosphor/60 tracking-widest uppercase mb-3 font-mono will-change-transform"
              >
                [CREATIVE DIRECTION]
              </h2>
              <ul className="flex flex-col gap-3 w-full md:items-start">
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">HIROYUKI IMAISHI</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">SERIES DIRECTOR</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">YOH YOSHINARI</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">CHARACTER DESIGN</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">MASAHIKO OTSUKA</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">COMPOSITION</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">YOSHIKI USA</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">SCREENPLAY</span>
                </li>
              </ul>
            </div>
          </div>

          {/* SECTION C: CREDITS PAIR 02 - SOUNDTRACK & SCORE */}
          <div
            style={{ columnGap: `${settings.baseColGap}px` }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-10 my-10 sm:my-16 text-xs sm:text-sm"
          >
            {/* Left Column: Music & Themes (Pushes LEFT) */}
            <div className="flex flex-col md:items-end">
              <h2
                data-displace="left"
                className="text-[11px] text-crt-phosphor/60 tracking-widest uppercase mb-3 font-mono will-change-transform"
              >
                [SOUNDTRACK &amp; SCORE]
              </h2>
              <ul className="flex flex-col gap-3 w-full md:items-end">
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">AKIRA YAMAOKA</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">ORIGINAL SCORE</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">MARCIN PRZYBYŁOWICZ</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">MUSIC DIRECTOR</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">ROSA WALTON</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">&ldquo;STAY AT YOUR HOUSE&rdquo;</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">FRANZ FERDINAND</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">&ldquo;THIS FFFIRE&rdquo; (OP)</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">DAWID PODSIADŁO</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">&ldquo;LET YOU DOWN&rdquo; (ED)</span>
                </li>
              </ul>
            </div>

            {/* Right Column: Key Voice Cast (Pushes RIGHT) */}
            <div className="flex flex-col md:items-start">
              <h2
                data-displace="right"
                className="text-[11px] text-crt-phosphor/60 tracking-widest uppercase mb-3 font-mono will-change-transform"
              >
                [PRINCIPAL CAST]
              </h2>
              <ul className="flex flex-col gap-3 w-full md:items-start">
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">DAVID MARTINEZ</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">KENN / ZACH AGUILAR</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">LUCY KUSHINADA</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">AOI YŪKI / EMI LO</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">REBECCA</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">TOMOYO KUROSAWA</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">MAINE</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">HIROKI TOUCHI</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">ADAM SMASHER</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">YŪKI MATSUYAMA</span>
                </li>
              </ul>
            </div>
          </div>

          {/* SECTION D: CREDITS PAIR 03 - NIGHT CITY REALM & SQUAD */}
          <div
            style={{ columnGap: `${settings.baseColGap}px` }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-10 my-10 sm:my-16 text-xs sm:text-sm"
          >
            {/* Left Column: Locations (Pushes LEFT) */}
            <div className="flex flex-col md:items-end">
              <h2
                data-displace="left"
                className="text-[11px] text-crt-phosphor/60 tracking-widest uppercase mb-3 font-mono will-change-transform"
              >
                [NIGHT CITY RELAYS]
              </h2>
              <ul className="flex flex-col gap-3 w-full md:items-end">
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">SANTO DOMINGO</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">ARROYO MEGATOWER</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">WATSON &amp; PACIFICA</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">COMBAT CORRIDOR</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">ARASAKA TOWER</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">CORPO ROOFTOP</span>
                </li>
                <li
                  data-displace="left"
                  className="flex items-baseline justify-between md:justify-end gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">TYCHO BASIN</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">LUNAR DREAMS</span>
                </li>
              </ul>
            </div>

            {/* Right Column: Squad Alliances (Pushes RIGHT) */}
            <div className="flex flex-col md:items-start">
              <h2
                data-displace="right"
                className="text-[11px] text-crt-phosphor/60 tracking-widest uppercase mb-3 font-mono will-change-transform"
              >
                [EDGERUNNER LEGACY]
              </h2>
              <ul className="flex flex-col gap-3 w-full md:items-start">
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">DAVID &amp; LUCY</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">MOONLIT PROMISE</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">MAINE &amp; DORIO</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">SANTO SHIELD</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">REBECCA &amp; PILAR</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">CUSTOM GUNNERS</span>
                </li>
                <li
                  data-displace="right"
                  className="flex items-baseline justify-between md:justify-start gap-2 w-full will-change-transform"
                >
                  <span className="font-bold text-white">KIWI &amp; FALCO</span>
                  <span className="text-crt-phosphor/25 tracking-tighter hidden sm:inline">---------</span>
                  <span className="text-crt-phosphor/70">NET &amp; GETAWAY</span>
                </li>
              </ul>
            </div>
          </div>

          {/* SECTION E: COMMEMORATIVE EPILOGUE & DEDICATION */}
          <div className="w-full max-w-xl text-center mt-12 sm:mt-24 pt-10 border-t border-crt-phosphor/20 flex flex-col items-center gap-3">
            <span className="text-[10px] text-crt-phosphor/40 tracking-widest uppercase">
              [EPILOGUE // NIGHT CITY 2076]
            </span>
            <blockquote className="text-xs sm:text-sm text-crt-phosphor/80 italic font-mono leading-relaxed max-w-md">
              &ldquo;I really want to stay at your house, and I hope it finds you well.&rdquo;
            </blockquote>
            <p className="text-[10px] sm:text-[11px] text-crt-phosphor/50 leading-relaxed font-mono max-w-md">
              A tribute archive honoring Studio TRIGGER and CD PROJEKT RED.
              Dedicated to every legend that burned out too bright in the dark skies of Santo Domingo.
            </p>
            <div className="text-[9px] text-crt-phosphor/30 tracking-wider pt-2">
              PAL HI-FI STEREO &bull; COLOR &bull; © 2026 CYBERPUNK EDGERUNNERS HOMAGE
            </div>

            <button
              type="button"
              onClick={() => {
                audio.playClick(0.9);
                onBack();
              }}
              className="mt-6 text-white hover:text-amber-400 font-bold tracking-wider transition-colors cursor-pointer text-xs py-1"
            >
              [ ← RETURN TO REELS / ESC ]
            </button>
          </div>
        </div>
      </div>

      {/* 3. HERO PHYSICAL 3D VHS CASSETTE (CSS-anchored, live adjustable) */}
      <div
        ref={tapeRef}
        className="absolute left-1/2 pointer-events-none z-20 flex flex-col items-center justify-center opacity-95 [transform-style:preserve-3d] origin-top will-change-transform"
        style={{
          top: `${settings.initialTop}px`,
          transform: `translate3d(-50%, 0px, 0) perspective(1200px) rotateY(0deg) rotateX(0deg) scale(${settings.initialScale})`,
        }}
      >
        {/* 3D Cassette Box Container with 18px Depth */}
        <div className="relative w-[190px] sm:w-[220px] aspect-[130/196] [transform-style:preserve-3d]">
          {/* A. Drop Shadow behind the tape */}
          <div
            className="absolute inset-2 bg-black/90 rounded-sm blur-xl pointer-events-none"
            style={{ transform: "translateZ(-30px)" }}
          />

          {/* B. Front Face (Poster artwork) */}
          <div
            className="absolute inset-0 bg-[#0d0d10] rounded-xs border border-crt-phosphor/40 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.8)] [backface-visibility:hidden]"
            style={{ transform: "translateZ(9px)" }}
          >
            <img
              src="/tapes/edgerunners-credits-tape.webp"
              alt="Cyberpunk Edgerunners Home Video Cassette"
              className="w-full h-full object-cover rounded-xs"
            />
            {/* Subtle gloss lighting diagonal gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 pointer-events-none" />
          </div>

          {/* C. Back Face */}
          <div
            className="absolute inset-0 bg-[#09090c] rounded-xs border border-crt-phosphor/20 overflow-hidden flex flex-col justify-between p-3.5 text-crt-phosphor/60 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg) translateZ(9px)" }}
          >
            <div className="flex items-center justify-between text-[8px] uppercase tracking-widest text-crt-phosphor/40 font-mono">
              <span>NC-2076 // TRIG-CDPR</span>
              <span>VHS PAL</span>
            </div>
            <div className="text-center font-bit text-xs text-crt-phosphor/80 uppercase tracking-wider">
              CYBERPUNK EDGERUNNERS
            </div>
            <div className="text-[7px] text-crt-phosphor/40 font-mono text-center">
              PROPERTY OF NIGHT CITY BROADCAST &bull; STEREO HI-FI
            </div>
          </div>

          {/* D. Left Spine (Thickness) */}
          <div
            className="absolute top-0 bottom-0 left-[-9px] w-[18px] bg-[#121216] border-l border-crt-phosphor/40 border-r border-black/80 flex items-center justify-center overflow-hidden"
            style={{ transform: "rotateY(-90deg)" }}
          >
            <span
              className="text-[7px] text-crt-phosphor/60 font-mono tracking-widest uppercase whitespace-nowrap rotate-90"
              style={{ transformOrigin: "center" }}
            >
              EDGERUNNERS &bull; 2076
            </span>
          </div>

          {/* E. Right Spine (Thickness) */}
          <div
            className="absolute top-0 bottom-0 right-[-9px] w-[18px] bg-[#121216] border-r border-crt-phosphor/40 border-l border-black/80"
            style={{ transform: "rotateY(90deg)" }}
          />

          {/* F. Top Edge (Thickness) */}
          <div
            className="absolute top-[-9px] left-0 right-0 h-[18px] bg-[#18181f] border-t border-crt-phosphor/30 border-b border-black/80"
            style={{ transform: "rotateX(90deg)" }}
          />

          {/* G. Bottom Edge (Thickness) */}
          <div
            className="absolute bottom-[-9px] left-0 right-0 h-[18px] bg-[#0c0c10] border-b border-black border-t border-black/50"
            style={{ transform: "rotateX(-90deg)" }}
          />
        </div>
      </div>

      {/* 4. LIVE CYBERPUNK TWEAK HUD PANEL */}
      <div className="fixed bottom-4 right-6 z-50 pointer-events-auto font-mono select-none">
        {isHudOpen ? (
          <div className="bg-[#0c0c12]/95 backdrop-blur-md border border-amber-400/50 rounded-xs p-4 shadow-[0_0_25px_rgba(245,167,66,0.25)] w-[310px] text-xs text-crt-phosphor flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-crt-phosphor/20">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold tracking-wider text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>CREDITS TWEAK HUD</span>
              </div>
              <button
                type="button"
                onClick={() => setIsHudOpen(false)}
                className="text-crt-phosphor/60 hover:text-white cursor-pointer px-1 text-[11px]"
              >
                [ ✕ ]
              </button>
            </div>

            {/* Sliders */}
            <div className="flex flex-col gap-2.5 text-[10px]">
              {/* Slider 1: Initial Top Y */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-crt-phosphor/80">
                  <span>POSTER INITIAL Y</span>
                  <span className="text-amber-400 font-bold">{settings.initialTop}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={200}
                  step={2}
                  value={settings.initialTop}
                  onChange={(e) => updateSetting("initialTop", Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider 2: Headline Top Padding */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-crt-phosphor/80">
                  <span>HEADLINE PADDING</span>
                  <span className="text-amber-400 font-bold">{settings.headlinePadding}px</span>
                </div>
                <input
                  type="range"
                  min={90}
                  max={260}
                  step={5}
                  value={settings.headlinePadding}
                  onChange={(e) => updateSetting("headlinePadding", Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider 3: Base Column Gap */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-crt-phosphor/80">
                  <span>BASE COLUMN GAP</span>
                  <span className="text-amber-400 font-bold">{settings.baseColGap}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={140}
                  step={2}
                  value={settings.baseColGap}
                  onChange={(e) => updateSetting("baseColGap", Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider 4: Text Push Distance */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-crt-phosphor/80">
                  <span>TEXT PUSH (REPULSION)</span>
                  <span className="text-amber-400 font-bold">{settings.repulsionPush}px</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={180}
                  step={2}
                  value={settings.repulsionPush}
                  onChange={(e) => updateSetting("repulsionPush", Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider 5: Initial Scale */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-crt-phosphor/80">
                  <span>INITIAL SCALE</span>
                  <span className="text-amber-400 font-bold">{settings.initialScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={0.7}
                  step={0.01}
                  value={settings.initialScale}
                  onChange={(e) => updateSetting("initialScale", Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider 6: Final Scale */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-crt-phosphor/80">
                  <span>EXPANDED SCALE</span>
                  <span className="text-amber-400 font-bold">{settings.finalScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.85}
                  max={1.3}
                  step={0.01}
                  value={settings.finalScale}
                  onChange={(e) => updateSetting("finalScale", Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-crt-phosphor/20 text-[10px]">
              <button
                type="button"
                onClick={handleReset}
                className="text-crt-phosphor/60 hover:text-white cursor-pointer"
              >
                [ RESET ]
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="text-amber-400 hover:text-white font-bold cursor-pointer"
              >
                {copied ? "[ COPIED! ]" : "[ COPY SETTINGS ]"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsHudOpen(true)}
            className="px-2.5 py-1 bg-black/80 hover:bg-black/95 border border-amber-400/50 hover:border-amber-400 text-amber-400 text-[11px] font-bold tracking-wider rounded-xs cursor-pointer shadow-lg transition-all"
          >
            [ ⚙ TWEAK HUD ]
          </button>
        )}
      </div>
    </div>
  );
}
