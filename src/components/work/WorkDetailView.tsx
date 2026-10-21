"use client";

import { useEffect, useRef, useCallback } from "react";
import { TapeProject, TAPE_PROJECTS } from "@/data/tapes";
import { audio } from "@/lib/audio";
import { getSleeveArchetype } from "../deck/TapeMesh";

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
        <section className="pj-screen-height flex items-center gap-6 sm:gap-10 md:gap-12 flex-shrink-0">
          {/* Angled Mini VHS Sleeve with Archetype Personality */}
          <div
            data-parallax="true"
            className={`relative h-full max-h-[min(340px,50cqh)] min-h-[220px] aspect-[130/196] bg-[#141210] rounded-xs p-3 sm:p-3.5 border ${archetypeAccent.split(" ")[1]} shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500 flex flex-col justify-between group overflow-hidden shrink-0 will-change-transform`}
          >
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold z-10">
              <span className={archetypeAccent.split(" ")[0]}>{tape.code}</span>
              <span className="text-crt-phosphor/70">{tape.year}</span>
            </div>

            <div className="relative w-full aspect-[4/3] my-1 bg-black/80 rounded-xs overflow-hidden border border-crt-phosphor/20 shrink-0">
              <img
                src={tape.image}
                alt={tape.title}
                className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500 pointer-events-none"
              />
            </div>

            <div className="text-center z-10 px-1">
              <span className="text-[9px] sm:text-[10px] text-crt-phosphor/50 uppercase tracking-widest block truncate font-mono">
                {tape.category}
              </span>
              <h3 className="font-bit text-lg sm:text-xl md:text-2xl font-bold text-crt-phosphor tracking-wider mt-0.5 truncate phosphor-glow">
                {tape.title}
              </h3>
            </div>

            <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-crt-phosphor/40 border-t border-crt-phosphor/10 pt-1.5 z-10 font-mono">
              <span className="uppercase">{archetype} ARCHIVE</span>
              <span>{tape.meta.quality}</span>
            </div>
          </div>

          {/* Title, Overview & Direct CTAs */}
          <div className="w-[300px] sm:w-[380px] md:w-[420px] h-full flex flex-col justify-center gap-2.5 sm:gap-3 shrink-0">
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
                <span className="text-crt-phosphor/40 block text-[9px] sm:text-[10px] tracking-wider">ROLE</span>
                <span className="text-crt-phosphor font-bold truncate block">{tape.role}</span>
              </div>
              <div>
                <span className="text-crt-phosphor/40 block text-[9px] sm:text-[10px] tracking-wider">DISCIPLINE</span>
                <span className="text-crt-phosphor font-bold truncate block">
                  {tape.client}
                </span>
              </div>
            </div>

            {/* Action CTAs: Visit Live & GitHub */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] sm:text-xs">
              {tape.liveUrl && (
                <a
                  href={tape.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick(1.1)}
                  className="px-3 sm:px-3.5 py-1.5 bg-crt-phosphor/10 hover:bg-crt-phosphor/20 border border-crt-phosphor/50 hover:border-crt-phosphor text-white font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
                  className="px-3 sm:px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-crt-phosphor/30 hover:border-crt-phosphor/60 text-crt-phosphor tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
                className="text-crt-phosphor/50 hover:text-crt-phosphor transition-colors tracking-widest cursor-pointer ml-1 text-[11px] sm:text-xs"
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
            className="relative h-[88%] aspect-[16/10] bg-black/95 border border-crt-phosphor/25 rounded-xs overflow-hidden shadow-2xl group will-change-transform"
          >
            <img
              src={tape.image}
              alt={tape.title}
              className="w-full h-full object-cover contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            {/* Top-Right HUD Badge */}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/80 border border-crt-phosphor/30 text-[9px] text-crt-phosphor font-mono tracking-widest uppercase">
              <span>NTSC-SP • MASTER REEL</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-crt-phosphor/50 px-1">
            <span>01 • PRIMARY INTERFACE CAPTURE</span>
            <span className="truncate max-w-[240px]">{tape.title}</span>
          </div>
        </section>

        {/* 3. CHAPTER 01: CONCEPT - ASYMMETRICAL TOP-ALIGNED (is-high) */}
        {tape.problem && (
          <section className="pj-screen-height w-[280px] sm:w-[340px] md:w-[380px] flex flex-col justify-start pt-6 sm:pt-10 gap-3 border-l border-crt-phosphor/15 pl-6 sm:pl-8 md:pl-10 relative flex-shrink-0">
            {/* Giant Faint Watermark Numeral */}
            <span className="absolute top-2 left-4 font-bit text-8xl sm:text-9xl text-crt-phosphor/[0.06] select-none pointer-events-none">
              01
            </span>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/50 tracking-widest uppercase z-10">
              <span className="w-1.5 h-1.5 bg-crt-phosphor/70 inline-block" />
              <span>01 // THE CHALLENGE</span>
            </div>

            <h2 className="font-bit text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase z-10">
              {tape.problem.headline}
            </h2>

            <p className="text-[11px] sm:text-xs text-crt-phosphor/80 leading-relaxed z-10">
              {tape.problem.description}
            </p>

            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-crt-phosphor/10 border border-crt-phosphor/30 text-[10px] text-crt-phosphor w-fit font-bold tracking-wider z-10">
              <span>[ CORE ARCHIVAL DIRECTION ]</span>
            </div>
          </section>
        )}

        {/* 4. PAIRED STACKED SHOTS (.pj-pair) - ASYMMETRICAL RHYTHM BREAK */}
        <section className="pj-screen-height w-[320px] sm:w-[380px] md:w-[420px] flex flex-col justify-between py-1 gap-3.5 flex-shrink-0">
          {/* Top Half Shot */}
          <div className="h-[calc(50%-8px)] flex flex-col justify-between gap-1">
            <div
              data-parallax="true"
              className="relative h-full aspect-[16/10] max-w-full bg-black/90 border border-crt-phosphor/25 rounded-xs overflow-hidden group will-change-transform shadow-lg"
            >
              <img
                src={tape.shots[0]?.mediaUrl || tape.image}
                alt={tape.shots[0]?.title || "Shot 01"}
                className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 border border-crt-phosphor/30 text-[8px] sm:text-[9px] text-crt-phosphor font-mono">
                {tape.shots[0]?.tag || "INTERFACE"}
              </div>
            </div>
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-crt-phosphor/60 px-0.5">
              <span className="truncate">02.A • {tape.shots[0]?.title || "SYSTEM INTERFACE"}</span>
            </div>
          </div>

          {/* Bottom Half Shot */}
          <div className="h-[calc(50%-8px)] flex flex-col justify-between gap-1">
            <div
              data-parallax="true"
              className="relative h-full aspect-[16/10] max-w-full bg-black/90 border border-crt-phosphor/25 rounded-xs overflow-hidden group will-change-transform shadow-lg"
            >
              <img
                src={tape.shots[1]?.mediaUrl || tape.image}
                alt={tape.shots[1]?.title || "Shot 02"}
                className="w-full h-full object-cover object-bottom contrast-125 group-hover:scale-110 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 border border-crt-phosphor/30 text-[8px] sm:text-[9px] text-crt-phosphor font-mono">
                {tape.shots[1]?.tag || "TELEMETRY"}
              </div>
            </div>
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-crt-phosphor/60 px-0.5">
              <span className="truncate">02.B • {tape.shots[1]?.title || "TELEMETRY OVERLAY"}</span>
            </div>
          </div>
        </section>

        {/* 5. CHAPTER 02: SYSTEM DESIGN & HIGHLIGHTS - ASYMMETRICAL BOTTOM-ALIGNED (is-low) */}
        {tape.architecture && (
          <section className="pj-screen-height w-[300px] sm:w-[360px] md:w-[400px] flex flex-col justify-end pb-6 sm:pb-10 gap-3 border-l border-crt-phosphor/15 pl-6 sm:pl-8 md:pl-10 relative flex-shrink-0">
            {/* Giant Faint Watermark Numeral */}
            <span className="absolute bottom-6 left-4 font-bit text-8xl sm:text-9xl text-crt-phosphor/[0.06] select-none pointer-events-none">
              02
            </span>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/50 tracking-widest uppercase z-10">
              <span className="w-1.5 h-1.5 bg-crt-phosphor/70 inline-block" />
              <span>02 // ARCHITECTURE & METRICS</span>
            </div>

            <h2 className="font-bit text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase z-10">
              {tape.architecture.headline}
            </h2>

            {/* Staggered Telemetry Metrics Grid */}
            {tape.metrics && tape.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2 my-1 z-10">
                {tape.metrics.slice(0, 4).map((m, idx) => (
                  <div key={idx} className="p-2 bg-white/[0.03] border border-crt-phosphor/20">
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
        <section className="pj-screen-height flex flex-col justify-end pb-4 sm:pb-6 gap-2 flex-shrink-0">
          <div
            data-parallax="true"
            className="relative h-[66%] aspect-[21/9] min-w-[340px] sm:min-w-[460px] md:min-w-[540px] bg-black/95 border border-crt-phosphor/30 rounded-xs overflow-hidden shadow-2xl group will-change-transform"
          >
            <img
              src={tape.shots[2]?.mediaUrl || tape.image}
              alt={tape.shots[2]?.title || "Panoramic View"}
              className="w-full h-full object-cover contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/85 border border-crt-phosphor/30 text-[9px] text-crt-phosphor font-mono">
              21:9 CINEMASCOPE
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-crt-phosphor/50 px-1">
            <span>03 • {tape.shots[2]?.title || "EXPANDED TELEMETRY DISPLAY"}</span>
            <span className="truncate max-w-[240px]">{tape.title}</span>
          </div>
        </section>

        {/* 7. CHAPTER 03: TECH STACK & TAKEAWAYS - ASYMMETRICAL TOP-ALIGNED */}
        <section className="pj-screen-height w-[280px] sm:w-[340px] md:w-[380px] flex flex-col justify-start pt-6 sm:pt-10 gap-3 border-l border-crt-phosphor/15 pl-6 sm:pl-8 md:pl-10 relative flex-shrink-0">
          {/* Giant Faint Watermark Numeral */}
          <span className="absolute top-2 left-4 font-bit text-8xl sm:text-9xl text-crt-phosphor/[0.06] select-none pointer-events-none">
            03
          </span>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/50 tracking-widest uppercase z-10">
            <span className="w-1.5 h-1.5 bg-crt-phosphor/70 inline-block" />
            <span>03 // CORE ENGINE & STACK</span>
          </div>

          <h2 className="font-bit text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase z-10">
            CORE TECHNOLOGIES
          </h2>

          <p className="text-[11px] sm:text-xs text-crt-phosphor/80 leading-relaxed z-10">
            {tape.story}
          </p>

          {/* Tech Stack Chips Matrix */}
          <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] z-10">
            {tape.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-white/5 border border-crt-phosphor/25 hover:border-crt-phosphor/60 text-crt-phosphor/90 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Key Takeaways */}
          {tape.takeaways && tape.takeaways.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-crt-phosphor/15 z-10">
              <span className="text-[9px] text-crt-phosphor/50 tracking-wider uppercase">
                TAKEAWAY NOTES
              </span>
              <p className="text-[10px] sm:text-[11px] text-crt-phosphor/75 italic leading-snug">
                &ldquo;{tape.takeaways[0]}&rdquo;
              </p>
            </div>
          )}
        </section>

        {/* 8. ADVANCE TO NEXT REEL CARD with elastic parallax */}
        <section className="pj-screen-height flex items-center justify-center pr-16 sm:pr-20 pl-6 flex-shrink-0">
          <button
            data-parallax="true"
            type="button"
            onClick={() => {
              audio.playClick(1.2);
              onNextProject();
            }}
            className="p-6 sm:p-8 border border-crt-phosphor/30 hover:border-crt-phosphor bg-white/[0.02] hover:bg-white/[0.06] transition-all flex flex-col items-center gap-3 text-center cursor-pointer active:scale-95 group rounded-xs font-mono will-change-transform shadow-2xl"
          >
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-crt-phosphor/50 tracking-widest uppercase">
              <span>NEXT REEL</span>
              <span>•</span>
              <span className="text-crt-phosphor font-bold">[{nextTape.code}]</span>
            </div>

            <span className="font-bit text-3xl sm:text-4xl md:text-5xl font-bold text-crt-phosphor group-hover:text-white uppercase leading-none transition-colors">
              {nextTape.title}
            </span>

            <span className="text-[9px] sm:text-[10px] text-crt-phosphor/60 uppercase tracking-widest">
              {nextTape.category}
            </span>

            <div className="mt-1 px-4 py-1.5 bg-crt-phosphor/10 group-hover:bg-crt-phosphor/20 border border-crt-phosphor/50 group-hover:border-crt-phosphor text-white text-[11px] font-bold tracking-wider transition-all">
              [ ADVANCE REEL → ]
            </div>
          </button>
        </section>
      </div>
    </div>
  );
}
