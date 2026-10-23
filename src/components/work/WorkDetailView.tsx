"use client";

import { useEffect, useRef, useCallback } from "react";
import { TapeProject, TAPE_PROJECTS } from "@/data/tapes";
import { audio } from "@/lib/audio";
import { getSleeveArchetype } from "../deck/TapeMesh";
import { useCrtBend } from "@/lib/useCrtBend";

interface WorkDetailViewProps {
  tape: TapeProject;
  onBack: () => void;
  onNextProject: () => void;
}

interface ParallaxItem {
  el: HTMLElement;
  left: number;
  at: number;
}

/**
 * Editorial Exhibition Gallery (100% Arc Marumo authentic physics engine).
 * - Zero third-party library overhead (pure vanilla 60/120fps physics)
 * - Delta-time exponential decay damping (frame-rate independent)
 * - Hyperbolic tangent elastic parallax on images (Math.tanh)
 * - Unified trackpad/wheel + pointer drag inertia coasting
 */
export function WorkDetailView({ tape, onBack, onNextProject }: WorkDetailViewProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Apply Option B authentic CRT barrel distortion curvature (k = 0.09) matching home deck
  useCrtBend(0.09, scrollWrapperRef);

  const currentIndex = TAPE_PROJECTS.findIndex((t) => t.id === tape.id);
  const nextTape = TAPE_PROJECTS[(currentIndex + 1) % TAPE_PROJECTS.length];

  // Native Arc Marumo Physics Engine
  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    const track = scrollContentRef.current;
    if (!wrapper || !track) return;

    let targetScroll = 0;
    let currentScroll = 0;
    let velocity = 0;
    let maxScroll = 0;
    let lastTime = performance.now();
    let isPointerDown = false;
    let rafId = 0;
    let dragDist = 0;
    let pointerData: { x: number; y: number; t: number; v: number } | null = null;
    let parallaxItems: ParallaxItem[] = [];

    const EASE = 14;

    const measureLayout = () => {
      if (!wrapper || !track) return;
      const isMobile = window.innerWidth <= 1024;
      if (isMobile) {
        track.style.transform = "";
        return;
      }

      maxScroll = Math.max(0, track.scrollWidth - wrapper.clientWidth);
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
      currentScroll = Math.max(0, Math.min(maxScroll, currentScroll));

      // Cache shot elements for hyperbolic tangent parallax
      const shots = Array.from(track.querySelectorAll<HTMLElement>("[data-parallax='true']"));
      parallaxItems = shots.map((el) => {
        el.style.transform = "";
        return {
          el,
          left: el.offsetLeft + (el.parentElement === track ? 0 : el.parentElement?.offsetLeft || 0),
          at: currentScroll,
        };
      });

      renderPosition();
    };

    const renderPosition = () => {
      if (!track) return;
      if (window.innerWidth <= 1024) {
        track.style.transform = "";
        return;
      }
      track.style.transform = `translate3d(${-currentScroll.toFixed(1)}px, 0, 0)`;
    };

    const updateParallax = (dt: number): boolean => {
      if (window.innerWidth <= 1024) return false;
      const viewW = wrapper.clientWidth;
      const maxDisplacement = 0.06 * viewW;
      let hasActiveSpring = false;

      for (const item of parallaxItems) {
        const stiffness = 3.2 + 2.3 * Math.min(1, Math.max(0, (item.left - currentScroll) / viewW));
        item.at += (currentScroll - item.at) * (1 - Math.exp(-stiffness * dt));

        if (Math.abs(currentScroll - item.at) < 0.5) {
          item.at = currentScroll;
        } else {
          hasActiveSpring = true;
        }

        // Hyperbolic tangent elastic cushioning (Arc Marumo authentic)
        const lag = maxDisplacement * Math.tanh(((currentScroll - item.at) * 0.2) / maxDisplacement);
        item.el.style.transform = Math.abs(lag) >= 0.1 ? `translate3d(${lag.toFixed(1)}px, 0, 0)` : "";
      }

      return hasActiveSpring;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      // 1. Inertia / Momentum velocity coasting
      if (velocity !== 0) {
        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + velocity * dt));
        velocity *= Math.exp(-dt / 0.325);
        if (Math.abs(velocity) < 12 || targetScroll <= 0 || targetScroll >= maxScroll) {
          velocity = 0;
        }
      }

      // 2. Critical damped position interpolation
      currentScroll += (targetScroll - currentScroll) * (1 - Math.exp(-(isPointerDown ? 22 : EASE) * dt));
      if (Math.abs(targetScroll - currentScroll) < 0.3) {
        currentScroll = targetScroll;
      }

      renderPosition();

      // 3. Elastic Parallax update
      const hasParallax = updateParallax(dt);

      // Continue loop if motion remains
      if (currentScroll !== targetScroll || velocity !== 0 || hasParallax) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const requestMotion = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const addScroll = (delta: number) => {
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + delta));
      requestMotion();
    };

    // Unified wheel listener (both vertical wheel and horizontal trackpad)
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 1024) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const mult = e.deltaMode === 1 ? 16 : 1;
      addScroll(delta * mult * 1.15);
    };

    // Pointer drag physics
    const onPointerDown = (e: PointerEvent) => {
      if (window.innerWidth <= 1024 || e.button > 0) return;
      velocity = 0;
      isPointerDown = true;
      dragDist = 0;
      pointerData = {
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
        v: 0,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerData) return;
      const dx = pointerData.x - e.clientX;
      const dy = pointerData.y - e.clientY;
      const dist = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
      dragDist += Math.abs(dx) + Math.abs(dy);
      addScroll(dist);

      const now = performance.now();
      const instantV = (dist / Math.max(8, now - pointerData.t)) * 1000;
      pointerData.v = 0.6 * pointerData.v + 0.4 * instantV;
      pointerData.x = e.clientX;
      pointerData.y = e.clientY;
      pointerData.t = now;
    };

    const onPointerUp = () => {
      isPointerDown = false;
      if (pointerData && performance.now() - pointerData.t < 80) {
        velocity = pointerData.v;
        requestMotion();
      }
      pointerData = null;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (dragDist > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        addScroll(450);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        addScroll(-450);
      }
    };

    measureLayout();
    const resizeObserver = new ResizeObserver(measureLayout);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(track);

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    wrapper.addEventListener("pointerdown", onPointerDown);
    wrapper.addEventListener("click", onClickCapture, true);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      resizeObserver.disconnect();
      wrapper.removeEventListener("wheel", onWheel);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      wrapper.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onBack]);

  const archetype = getSleeveArchetype(tape);
  const archetypeAccent =
    archetype === "editorial"
      ? "text-[#d4af37] border-[#d4af37]/40"
      : archetype === "cyber"
      ? "text-[#38bdf8] border-[#38bdf8]/40"
      : archetype === "swiss"
      ? "text-[#dc2626] border-[#dc2626]/40"
      : archetype === "expedition"
      ? "text-[#d97706] border-[#d97706]/40"
      : archetype === "arcade"
      ? "text-[#facc15] border-[#facc15]/40"
      : "text-[#34d399] border-[#34d399]/40";

  return (
    <div
      ref={scrollWrapperRef}
      className="pj-view no-scrollbar select-none cursor-grab active:cursor-grabbing font-mono text-crt-phosphor"
      tabIndex={0}
    >
      <div
        ref={scrollContentRef}
        className="pj-track w-max min-w-full"
      >
        {/* 1. HERO INTRO: Physical Mini VHS Sleeve & Overview */}
        <section className="pj-screen-height flex flex-col md:flex-row items-center md:items-stretch gap-6 sm:gap-10 md:gap-12 flex-shrink-0">
          {/* Angled Authentic Physical VHS Sleeve with Elastic Parallax */}
          <div
            data-parallax="true"
            className="relative w-[180px] sm:w-[220px] md:w-auto h-auto md:h-full max-h-[min(350px,52cqh)] aspect-[130/196] bg-[#141210] rounded-xs border border-crt-phosphor/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rotate-[-2deg] hover:rotate-0 transition-transform duration-500 overflow-hidden shrink-0 will-change-transform group cursor-pointer"
          >
            <img
              src={`/tapes/${tape.id}-front.webp?v=${tape.wearSeed}`}
              alt={tape.title}
              className="w-full h-full object-cover rounded-xs pointer-events-none group-hover:scale-102 transition-transform duration-500"
            />
          </div>

          {/* Title, Overview & Direct CTAs */}
          <div className="w-full max-w-[420px] md:w-[420px] h-auto md:h-full flex flex-col justify-center gap-2.5 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/60 tracking-widest uppercase">
              <span className={archetypeAccent.split(" ")[0]}>[{tape.code} • {tape.year}]</span>
              <span>•</span>
              <span className="truncate">{tape.category}</span>
            </div>

            <h1 className="font-bit text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.95] tracking-tight text-crt-phosphor phosphor-glow uppercase">
              {tape.title}
            </h1>

            <p className="text-[11px] sm:text-xs md:text-[13px] text-crt-phosphor/85 leading-relaxed">
              {tape.summary}
            </p>

            {/* Metadata Specs Bar */}
            <div className="grid grid-cols-2 gap-2.5 border-y border-crt-phosphor/20 py-2 sm:py-2.5 text-[10px] sm:text-[11px]">
              <div>
                <span className="text-crt-phosphor/40 block text-[9px] sm:text-[10px] tracking-wider">
                  {tape.id.startsWith("ep-") ? "FEATURED CHARACTER" : "ROLE"}
                </span>
                <span className="text-crt-phosphor font-bold truncate block">{tape.role}</span>
              </div>
              <div>
                <span className="text-crt-phosphor/40 block text-[9px] sm:text-[10px] tracking-wider">
                  {tape.id.startsWith("ep-") ? "KEY SOUNDTRACK" : "DISCIPLINE"}
                </span>
                <span className="text-crt-phosphor font-bold truncate block">
                  {tape.client}
                </span>
              </div>
            </div>

            {/* Action CTAs: Visit Live & GitHub (Pure typography, zero card/badge wrapper) */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] sm:text-xs">
              {tape.liveUrl && (
                <a
                  href={tape.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick(1.1)}
                  className="text-amber-400 hover:text-white font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <span>[ VISIT LIVE ↗ ]</span>
                </a>
              )}

              {tape.githubUrl && (
                <a
                  href={tape.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick(1.0)}
                  className="text-crt-phosphor/70 hover:text-white font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <span>[ SOURCE CODE ↗ ]</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  audio.playClick(0.9);
                  onBack();
                }}
                className="text-crt-phosphor/50 hover:text-white transition-colors tracking-widest cursor-pointer ml-1 text-[11px] sm:text-xs py-1"
              >
                [ ← RETURN ]
              </button>
            </div>
          </div>
        </section>

        {/* 2. PRIMARY HERO SHOT: Full Height & Elastic Parallax */}
        <section className="pj-screen-height flex flex-col justify-center gap-2 flex-shrink-0">
          <div
            data-parallax="true"
            className="relative w-full max-w-[640px] md:w-auto h-auto md:h-[88%] aspect-[16/10] bg-black/95 border border-crt-phosphor/25 rounded-xs overflow-hidden shadow-2xl group will-change-transform"
          >
            <img
              src={tape.shots[0]?.mediaUrl || tape.image}
              alt={tape.shots[0]?.title || tape.title}
              className="w-full h-full object-cover contrast-110 brightness-95 grayscale-[40%] group-hover:grayscale-0 group-hover:contrast-105 group-hover:brightness-100 group-hover:scale-105 transition-[filter,transform] duration-500 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-crt-phosphor/50 px-1">
            <span>01 • {tape.shots[0]?.title || "PRIMARY INTERFACE CAPTURE"}</span>
            <span className="truncate max-w-[240px]">{tape.shots[0]?.caption || tape.title}</span>
          </div>
        </section>

        {/* 3. CHAPTER 01: CONCEPT - ASYMMETRICAL TOP-ALIGNED (is-high) */}
        {tape.problem && (
          <section className="pj-screen-height w-full max-w-[420px] md:w-[380px] flex flex-col justify-start pt-4 sm:pt-6 md:pt-10 gap-3 border-l border-crt-phosphor/15 pl-4 sm:pl-6 md:pl-10 relative flex-shrink-0">
            {/* Giant Faint Watermark Numeral */}
            <span className="absolute top-2 left-4 font-bit text-7xl sm:text-8xl md:text-9xl text-crt-phosphor/[0.06] select-none pointer-events-none">
              01
            </span>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/50 tracking-widest uppercase z-10">
              <span className="w-1.5 h-1.5 bg-crt-phosphor/70 inline-block" />
              <span>{tape.id.startsWith("ep-") ? "01 // THE INCITING INCIDENT" : "01 // THE CHALLENGE"}</span>
            </div>

            <h2 className="font-bit text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase z-10">
              {tape.problem.headline}
            </h2>

            <p className="text-[11px] sm:text-xs text-crt-phosphor/80 leading-relaxed z-10">
              {tape.problem.description}
            </p>

            <div className="mt-2 text-[10px] text-amber-400 font-bold tracking-wider z-10 font-mono">
              <span>{tape.id.startsWith("ep-") ? "[ INCIDENT DOSSIER ]" : "[ CORE ARCHIVAL DIRECTION ]"}</span>
            </div>
          </section>
        )}

        {/* 4. PAIRED STACKED SHOTS (.pj-pair) - ASYMMETRICAL RHYTHM BREAK */}
        <section className="pj-screen-height w-full max-w-[420px] md:w-[420px] flex flex-col justify-between py-1 gap-3.5 flex-shrink-0">
          {/* Top Half Shot */}
          <div className="h-auto md:h-[calc(50%-8px)] flex flex-col justify-between gap-1">
            <div
              data-parallax="true"
              className="relative w-full md:w-auto h-auto md:h-full aspect-[16/10] max-w-full bg-black/90 border border-crt-phosphor/25 rounded-xs overflow-hidden group will-change-transform shadow-lg"
            >
              <img
                src={tape.shots[1]?.mediaUrl || tape.shots[0]?.mediaUrl || tape.image}
                alt={tape.shots[1]?.title || "Shot 01"}
                className="w-full h-full object-cover object-top scale-105 contrast-110 brightness-95 grayscale-[40%] group-hover:grayscale-0 group-hover:contrast-105 group-hover:brightness-100 group-hover:scale-110 transition-[filter,transform] duration-500 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-crt-phosphor/60 px-0.5">
              <span className="truncate">02.A • {tape.shots[1]?.title || tape.shots[0]?.title || "SYSTEM INTERFACE"}</span>
            </div>
          </div>

          {/* Bottom Half Shot */}
          <div className="h-auto md:h-[calc(50%-8px)] flex flex-col justify-between gap-1">
            <div
              data-parallax="true"
              className="relative w-full md:w-auto h-auto md:h-full aspect-[16/10] max-w-full bg-black/90 border border-crt-phosphor/25 rounded-xs overflow-hidden group will-change-transform shadow-lg"
            >
              <img
                src={tape.shots[2]?.mediaUrl || tape.shots[1]?.mediaUrl || tape.image}
                alt={tape.shots[2]?.title || "Shot 02"}
                className="w-full h-full object-cover object-bottom contrast-110 brightness-95 grayscale-[40%] group-hover:grayscale-0 group-hover:contrast-105 group-hover:brightness-100 group-hover:scale-110 transition-[filter,transform] duration-500 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-crt-phosphor/60 px-0.5">
              <span className="truncate">02.B • {tape.shots[2]?.title || tape.shots[1]?.title || "TELEMETRY OVERLAY"}</span>
            </div>
          </div>
        </section>

        {/* 5. CHAPTER 02: SYSTEM DESIGN & HIGHLIGHTS - ASYMMETRICAL BOTTOM-ALIGNED (is-low) */}
        {tape.architecture && (
          <section className="pj-screen-height w-full max-w-[420px] md:w-[400px] flex flex-col justify-start md:justify-end pb-4 sm:pb-6 md:pb-10 gap-3 border-l border-crt-phosphor/15 pl-4 sm:pl-6 md:pl-10 relative flex-shrink-0">
            {/* Giant Faint Watermark Numeral */}
            <span className="absolute bottom-6 left-4 font-bit text-7xl sm:text-8xl md:text-9xl text-crt-phosphor/[0.06] select-none pointer-events-none">
              02
            </span>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/50 tracking-widest uppercase z-10">
              <span className="w-1.5 h-1.5 bg-crt-phosphor/70 inline-block" />
              <span>{tape.id.startsWith("ep-") ? "02 // CLIMAX & TURNING POINT" : "02 // ARCHITECTURE & METRICS"}</span>
            </div>

            <h2 className="font-bit text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase z-10">
              {tape.architecture.headline}
            </h2>

            {/* Staggered Telemetry Metrics Grid (Pure typography, no boxed cards) */}
            {tape.metrics && tape.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3 my-1 z-10">
                {tape.metrics.slice(0, 4).map((m, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5 border-l border-crt-phosphor/25 pl-2">
                    <span className="text-[9px] text-crt-phosphor/50 uppercase tracking-wider block">
                      {m.label}
                    </span>
                    <span className="font-bit text-base sm:text-lg text-crt-phosphor font-bold phosphor-glow block">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Highlights List */}
            <div className="flex flex-col gap-2 pt-0.5 z-10">
              {tape.architecture.highlights.slice(0, 2).map((h, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <span className="text-[11px] sm:text-xs font-bold text-crt-phosphor flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-crt-phosphor/60 inline-block shrink-0" />
                    <span>{h.title}</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-crt-phosphor/70 pl-3.5 leading-snug">
                    {h.detail}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. PANORAMIC WIDE SHOT: ASYMMETRICAL BOTTOM-GROUNDED (self-end) */}
        <section className="pj-screen-height flex flex-col justify-start md:justify-end pb-4 sm:pb-6 gap-2 flex-shrink-0">
          <div
            data-parallax="true"
            className="relative w-full max-w-[640px] md:w-auto h-auto md:h-[66%] aspect-[16/9] md:aspect-[21/9] min-w-0 md:min-w-[540px] bg-black/95 border border-crt-phosphor/30 rounded-xs overflow-hidden shadow-2xl group will-change-transform"
          >
            <img
              src={tape.shots[3]?.mediaUrl || tape.shots[2]?.mediaUrl || tape.image}
              alt={tape.shots[3]?.title || "Panoramic View"}
              className="w-full h-full object-cover contrast-110 brightness-95 grayscale-[40%] group-hover:grayscale-0 group-hover:contrast-105 group-hover:brightness-100 group-hover:scale-105 transition-[filter,transform] duration-500 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-crt-phosphor/50 px-1">
            <span>03 • {tape.shots[3]?.title || tape.shots[2]?.title || "EXPANDED TELEMETRY DISPLAY"}</span>
            <span className="truncate max-w-[240px]">{tape.shots[3]?.caption || tape.title}</span>
          </div>
        </section>

        {/* 7. CHAPTER 03: TECH STACK & TAKEAWAYS - ASYMMETRICAL TOP-ALIGNED */}
        <section className="pj-screen-height w-full max-w-[420px] md:w-[380px] flex flex-col justify-start pt-4 sm:pt-6 md:pt-10 gap-3 border-l border-crt-phosphor/15 pl-4 sm:pl-6 md:pl-10 relative flex-shrink-0">
          {/* Giant Faint Watermark Numeral */}
          <span className="absolute top-2 left-4 font-bit text-7xl sm:text-8xl md:text-9xl text-crt-phosphor/[0.06] select-none pointer-events-none">
            03
          </span>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/50 tracking-widest uppercase z-10">
            <span className="w-1.5 h-1.5 bg-crt-phosphor/70 inline-block" />
            <span>{tape.id.startsWith("ep-") ? "03 // DIALOGUE & AFTERMATH" : "03 // CORE ENGINE & STACK"}</span>
          </div>

          <h2 className="font-bit text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase z-10">
            {tape.id.startsWith("ep-") ? "ICONIC DIALOGUE" : "CORE TECHNOLOGIES"}
          </h2>

          <p className="text-[11px] sm:text-xs text-crt-phosphor/80 leading-relaxed z-10">
            {tape.story}
          </p>

          {/* Tech Stack Chips Matrix (Pure typography, zero card/badge borders) */}
          <div className="flex flex-wrap gap-2 pt-1 text-[10px] sm:text-[11px] z-10 font-mono">
            {tape.tags.map((tag) => (
              <span
                key={tag}
                className="text-crt-phosphor/70 hover:text-white transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Key Takeaways */}
          {tape.takeaways && tape.takeaways.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-crt-phosphor/15 z-10">
              <span className="text-[9px] text-crt-phosphor/50 tracking-wider uppercase">
                {tape.id.startsWith("ep-") ? "KEY QUOTE" : "TAKEAWAY NOTES"}
              </span>
              <p className="text-[10px] sm:text-[11px] text-crt-phosphor/75 italic leading-snug">
                &ldquo;{tape.takeaways[0]}&rdquo;
              </p>
            </div>
          )}
        </section>

        {/* 7.B ADDITIONAL ARCHIVAL CAPTURES (if > 4 shots) */}
        {tape.shots && tape.shots.slice(4).map((shot, idx) => (
          <section
            key={shot.title + idx}
            className="pj-screen-height flex flex-col justify-center gap-2 flex-shrink-0"
          >
            <div
              data-parallax="true"
              className="relative w-full max-w-[640px] md:w-auto h-auto md:h-[84%] aspect-[16/10] bg-black/95 border border-crt-phosphor/25 rounded-xs overflow-hidden shadow-2xl group will-change-transform"
            >
              <img
                src={shot.mediaUrl || tape.image}
                alt={shot.title}
                className="w-full h-full object-cover contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-crt-phosphor/50 px-1">
              <span>0{4 + idx} • {shot.title}</span>
              <span className="truncate max-w-[280px]">{shot.caption}</span>
            </div>
          </section>
        ))}

        {/* 8. ADVANCE TO NEXT REEL - Pure Physical Tape Cover Poster (Zero boxed text card) */}
        <section className="pj-screen-height flex items-center justify-center py-8 md:py-0 pr-6 sm:pr-12 md:pr-24 pl-6 sm:pl-8 flex-shrink-0">
          <div
            data-parallax="true"
            onClick={() => {
              audio.playClick(1.2);
              onNextProject();
            }}
            className="flex flex-col items-center gap-4 cursor-pointer group will-change-transform select-none"
          >
            {/* Physical VHS Sleeve Poster */}
            <div className="relative w-[190px] sm:w-[220px] aspect-[130/196] rounded-xs overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-crt-phosphor/40 transition-all duration-500 group-hover:scale-105 group-hover:border-white group-hover:shadow-[0_0_35px_rgba(236,233,225,0.4)]">
              <img
                src={`/tapes/${nextTape.id}-front.webp`}
                alt={nextTape.title}
                className="w-full h-full object-cover rounded-xs"
              />
              {/* Gloss lighting layer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 pointer-events-none" />
              {/* Hover highlight overlay */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
            </div>

            {/* Pure Typographic Label (No card/badge borders) */}
            <div className="flex flex-col items-center gap-1 font-mono text-center">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/60 tracking-widest uppercase">
                <span>NEXT REEL</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{nextTape.code}</span>
              </div>

              <div className="font-bit text-2xl sm:text-3xl text-crt-phosphor group-hover:text-white uppercase leading-tight tracking-tight transition-colors phosphor-glow">
                {nextTape.title}
              </div>

              <div className="text-[10px] text-crt-phosphor/50 group-hover:text-amber-400 tracking-wider transition-colors pt-0.5">
                [ ADVANCE REEL ↗ ]
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
