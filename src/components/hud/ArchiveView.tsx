"use client";

import { useEffect, useRef, useState } from "react";
import { TAPE_PROJECTS, ARCHIVE_CATEGORIES, ArchiveCategoryFilter } from "@/data/tapes";
import { audio } from "@/lib/audio";
import { useCrtBend } from "@/lib/useCrtBend";

interface ArchiveViewProps {
  onBack: () => void;
  onSelectProject: (index: number) => void;
}

interface ParallaxItem {
  el: HTMLElement;
  left: number;
  at: number;
}

/**
 * Cyberpunk: Edgerunners Braindance & Episode Shard Archive.
 * Unboxed, horizontal exhibition gallery matching WorkDetailView.
 * Directly browses all 10 anime episodes with smooth kinetic physics and instant playback.
 */
export function ArchiveView({ onBack, onSelectProject }: ArchiveViewProps) {
  const [filter, setFilter] = useState<ArchiveCategoryFilter>("all");
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Apply authentic CRT barrel distortion curvature
  useCrtBend(0.09, scrollWrapperRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  const filteredProjects = TAPE_PROJECTS.filter((tape) => {
    if (filter === "all") return true;
    return tape.categoryFilter === filter;
  });

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
      const maxDisplacement = 0.05 * viewW;
      let hasActiveSpring = false;

      for (const item of parallaxItems) {
        const stiffness = 3.2 + 2.3 * Math.min(1, Math.max(0, (item.left - currentScroll) / viewW));
        item.at += (currentScroll - item.at) * (1 - Math.exp(-stiffness * dt));

        if (Math.abs(currentScroll - item.at) < 0.5) {
          item.at = currentScroll;
        } else {
          hasActiveSpring = true;
        }

        const lag = maxDisplacement * Math.tanh(((currentScroll - item.at) * 0.2) / maxDisplacement);
        item.el.style.transform = Math.abs(lag) >= 0.1 ? `translate3d(${lag.toFixed(1)}px, 0, 0)` : "";
      }

      return hasActiveSpring;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (!isPointerDown && Math.abs(velocity) > 0.08) {
        targetScroll += velocity * dt;
        velocity *= Math.exp(-3.6 * dt);
        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
      }

      const diff = targetScroll - currentScroll;
      if (Math.abs(diff) > 0.1) {
        currentScroll += diff * (1 - Math.exp(-EASE * dt));
        renderPosition();
      } else {
        currentScroll = targetScroll;
        renderPosition();
      }

      const hasSprings = updateParallax(dt);

      if (
        isPointerDown ||
        Math.abs(diff) > 0.1 ||
        Math.abs(velocity) > 0.08 ||
        hasSprings
      ) {
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

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 1024) return;
      e.preventDefault();

      let delta = e.deltaX !== 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (e.deltaMode === 1) delta *= 38;
      else if (e.deltaMode === 2) delta *= wrapper.clientHeight;

      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + delta * 1.05));
      velocity = 0;
      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (window.innerWidth <= 1024) return;
      if (e.button !== 0) return;
      isPointerDown = true;
      dragDist = 0;
      pointerData = { x: e.clientX, y: e.clientY, t: performance.now(), v: 0 };
      velocity = 0;
      startLoop();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown || !pointerData) return;
      const dx = e.clientX - pointerData.x;
      dragDist += Math.abs(dx);
      const now = performance.now();
      const dt = Math.max(1, now - pointerData.t);

      pointerData.v = (-dx / dt) * 1000;
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll - dx));
      currentScroll = targetScroll;
      renderPosition();

      pointerData.x = e.clientX;
      pointerData.y = e.clientY;
      pointerData.t = now;
      startLoop();
    };

    const onPointerUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (pointerData && Math.abs(pointerData.v) > 50) {
        velocity = Math.max(-2800, Math.min(2800, pointerData.v * 0.8));
      }
      pointerData = null;
      startLoop();
    };

    const onClickCapture = (e: MouseEvent) => {
      if (dragDist > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth <= 1024) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        targetScroll = Math.min(maxScroll, targetScroll + 400);
        startLoop();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        targetScroll = Math.max(0, targetScroll - 400);
        startLoop();
      } else if (e.key === "Home") {
        e.preventDefault();
        targetScroll = 0;
        startLoop();
      } else if (e.key === "End") {
        e.preventDefault();
        targetScroll = maxScroll;
        startLoop();
      }
    };

    measureLayout();
    const resizeObserver = new ResizeObserver(() => measureLayout());
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
  }, [filter, onBack]);

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
        {/* 1. HERO ARCHIVE HEADER & FILTER SYSTEM */}
        <section className="pj-screen-height flex items-center gap-8 sm:gap-12 flex-shrink-0">
          <div className="w-full max-w-[420px] md:w-[420px] flex flex-col justify-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/60 tracking-widest uppercase">
              <span className="text-amber-400 font-bold">[VAULT // SHARDS]</span>
              <span>•</span>
              <span>TOTAL 10 REELS</span>
            </div>

            <h1 className="font-bit text-3xl sm:text-5xl md:text-6xl font-bold leading-[0.92] tracking-tight text-crt-phosphor phosphor-glow uppercase">
              BRAINDANCE VAULT
            </h1>

            <p className="text-[11px] sm:text-xs md:text-[13px] text-crt-phosphor/85 leading-relaxed font-mono">
              Uncut braindance reels and episode shards documenting David Martinez&apos;s ascent
              through the Night City underworld. Select any shard to load the high-fidelity exhibition gallery.
            </p>

            {/* In-Universe Category Filter Toggles (Pure typography, zero card/badge wrapper) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              {ARCHIVE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    audio.playClick(1.0);
                    setFilter(cat.id);
                  }}
                  className={`text-[10px] sm:text-[11px] uppercase tracking-wider transition-colors cursor-pointer py-0.5 ${
                    filter === cat.id
                      ? "text-amber-400 font-bold phosphor-glow"
                      : "text-crt-phosphor/50 hover:text-white"
                  }`}
                >
                  [{cat.label}]
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1 text-[10px] sm:text-[11px] text-crt-phosphor/50">
              <span className="animate-pulse">▶</span>
              <span className="tracking-widest uppercase">
                SHOWING {filteredProjects.length} OF {TAPE_PROJECTS.length} SHARDS
              </span>
            </div>
          </div>
        </section>

        {/* 2. EPISODE SHARDS (Horizontal Exhibition Cards) */}
        {filteredProjects.map((tape) => {
          const globalIndex = TAPE_PROJECTS.findIndex((t) => t.id === tape.id);

          return (
            <section
              key={tape.id}
              className="pj-screen-height flex flex-col md:flex-row items-center md:items-stretch gap-6 sm:gap-10 md:gap-12 flex-shrink-0"
            >
              {/* Left: Sleeve Poster */}
              <div
                data-parallax="true"
                onClick={() => {
                  audio.playClick(1.2);
                  onSelectProject(globalIndex);
                }}
                className="relative w-[180px] sm:w-[220px] md:w-auto h-auto md:h-full max-h-[min(360px,52cqh)] aspect-[130/196] bg-[#141210] rounded-xs border border-crt-phosphor/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden shrink-0 will-change-transform group cursor-pointer hover:border-crt-phosphor transition-all duration-500"
              >
                <img
                  src={`/tapes/${tape.id}-front.webp?v=${tape.wearSeed}`}
                  alt={tape.title}
                  className="w-full h-full object-cover rounded-xs pointer-events-none group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[9px] font-mono tracking-wider text-white/80">
                  <span className="uppercase truncate">{tape.category}</span>
                  <span className="text-amber-300 font-bold">PLAY ↗</span>
                </div>
              </div>

              {/* Right: Spec Sheet & Instant Play CTA */}
              <div className="w-full max-w-[420px] md:w-[420px] h-auto md:h-full flex flex-col justify-center gap-2.5 sm:gap-3 shrink-0">
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/60 tracking-widest uppercase">
                  <span className="text-amber-400 font-bold">[{tape.code} • {tape.year}]</span>
                  <span>•</span>
                  <span className="truncate">{tape.category}</span>
                </div>

                <h2
                  onClick={() => {
                    audio.playClick(1.2);
                    onSelectProject(globalIndex);
                  }}
                  className="font-bit text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.95] tracking-tight text-crt-phosphor phosphor-glow uppercase hover:text-white transition-colors cursor-pointer"
                >
                  {tape.title}
                </h2>

                <p className="text-[11px] sm:text-xs text-crt-phosphor/80 leading-relaxed line-clamp-3">
                  {tape.summary}
                </p>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-2 border-y border-crt-phosphor/20 py-2 text-[10px] sm:text-[11px]">
                  <div>
                    <span className="text-crt-phosphor/40 block text-[9px] tracking-wider uppercase">
                      [LEAD CHARACTER]
                    </span>
                    <span className="text-crt-phosphor font-bold truncate block">
                      {tape.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-crt-phosphor/40 block text-[9px] tracking-wider uppercase">
                      [SOUNDTRACK]
                    </span>
                    <span className="text-crt-phosphor font-bold truncate block">
                      {tape.client}
                    </span>
                  </div>
                </div>

                {/* Direct Action Play Button (Pure typography, zero card/badge wrapper) */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick(1.3);
                      onSelectProject(globalIndex);
                    }}
                    className="text-amber-400 hover:text-white font-bold tracking-wider transition-colors cursor-pointer text-xs flex items-center gap-1.5 py-1 active:scale-95"
                  >
                    <span>[ LOAD SHARD // PLAY ↗ ]</span>
                  </button>
                </div>
              </div>
            </section>
          );
        })}

        {/* 3. OUTRO SECTION */}
        <section className="pj-screen-height flex items-center justify-center flex-shrink-0 py-8 md:py-0 pl-4 md:pl-6 pr-6 md:pr-12">
          <div className="flex flex-col items-start gap-3.5">
            <span className="text-[10px] text-crt-phosphor/40 tracking-widest uppercase">
              [END OF SHARD MATRIX]
            </span>
            <h3 className="font-bit text-3xl sm:text-4xl font-bold text-crt-phosphor uppercase leading-none">
              ALL REELS CATALOGED
            </h3>
            <button
              type="button"
              onClick={() => {
                audio.playClick(0.9);
                onBack();
              }}
              className="text-white hover:text-amber-400 font-bold tracking-wider transition-colors cursor-pointer text-xs py-1"
            >
              [ ← RETURN TO REEL DECK / ESC ]
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
