"use client";

import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import { TapeProject, TAPE_PROJECTS } from "@/data/tapes";
import { audio } from "@/lib/audio";

interface WorkDetailViewProps {
  tape: TapeProject;
  onBack: () => void;
  onNextProject: () => void;
}

/**
 * Editorial Exhibition Gallery (100% Arc Marumo authentic format).
 * Powered by Lenis for silky-smooth horizontal inertia scrolling.
 * Zero neon badges - purely muted studio phosphor aesthetics.
 */
export function WorkDetailView({ tape, onBack, onNextProject }: WorkDetailViewProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Find next project for the end-of-track teaser
  const currentIndex = TAPE_PROJECTS.findIndex((t) => t.id === tape.id);
  const nextTape = TAPE_PROJECTS[(currentIndex + 1) % TAPE_PROJECTS.length];

  // Initialize Lenis smooth horizontal scroll engine
  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    const content = scrollContentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      gestureOrientation: "both",
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.4,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      } else if (e.key === "ArrowRight") {
        const current = lenisRef.current?.scroll || scrollWrapperRef.current?.scrollLeft || 0;
        lenisRef.current?.scrollTo(current + 480);
      } else if (e.key === "ArrowLeft") {
        const current = lenisRef.current?.scroll || scrollWrapperRef.current?.scrollLeft || 0;
        lenisRef.current?.scrollTo(current - 480);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  return (
    <div
      ref={scrollWrapperRef}
      className="w-full h-full overflow-x-auto overflow-y-hidden no-scrollbar select-none cursor-default"
      tabIndex={0}
    >
      <div
        ref={scrollContentRef}
        className="h-full flex items-center py-2 gap-12 sm:gap-16 w-max"
      >
        {/* 1. HERO INTRO: Physical VHS Sleeve & Overview */}
        <div className="flex-shrink-0 flex items-center gap-8 sm:gap-12 pl-2">
          {/* Angled Mini VHS Sleeve */}
          <div className="relative w-[180px] sm:w-[210px] aspect-[130/196] bg-[#1a1816] rounded-xs p-3.5 border border-crt-phosphor/25 shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 flex flex-col justify-between group overflow-hidden shrink-0">
            <div className="flex items-center justify-between text-[10px] text-crt-phosphor/70 font-mono font-bold z-10">
              <span>{tape.code}</span>
              <span>{tape.year}</span>
            </div>

            <div className="relative w-full aspect-[4/3] my-2 bg-black/80 rounded-xs overflow-hidden border border-crt-phosphor/20">
              <img
                src={tape.image}
                alt={tape.title}
                className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500"
              />
            </div>

            <div className="text-center z-10">
              <span className="text-[9px] text-crt-phosphor/50 uppercase tracking-widest block truncate font-mono">
                {tape.category}
              </span>
              <h3 className="font-bit text-xl sm:text-2xl font-bold text-crt-phosphor tracking-wider mt-0.5 truncate phosphor-glow">
                {tape.title}
              </h3>
            </div>

            <div className="flex items-center justify-between text-[8px] text-crt-phosphor/40 border-t border-crt-phosphor/10 pt-2 z-10 font-mono">
              <span>{tape.meta.format}</span>
              <span>{tape.meta.quality}</span>
            </div>
          </div>

          {/* Title, Editorial Lead & Direct Links */}
          <div className="w-[320px] sm:w-[440px] flex flex-col justify-center gap-3 shrink-0 font-mono">
            <div className="flex items-center gap-2 text-[11px] text-crt-phosphor/60 tracking-widest uppercase">
              <span>[{tape.code} // {tape.year}]</span>
              <span>•</span>
              <span>{tape.category}</span>
            </div>

            <h1 className="font-bit text-4xl sm:text-6xl font-bold leading-none tracking-tight text-crt-phosphor phosphor-glow uppercase">
              {tape.title}
            </h1>

            <p className="text-xs text-crt-phosphor/80 leading-relaxed max-w-md">
              {tape.summary}
            </p>

            {/* Metadata Specs Bar */}
            <div className="grid grid-cols-2 gap-3 border-y border-crt-phosphor/15 py-2.5 text-[10px]">
              <div>
                <span className="text-crt-phosphor/40 block text-[9px]">ROLE</span>
                <span className="text-crt-phosphor font-bold">{tape.role}</span>
              </div>
              <div>
                <span className="text-crt-phosphor/40 block text-[9px]">DISCIPLINE</span>
                <span className="text-crt-phosphor font-bold truncate block">
                  {tape.client}
                </span>
              </div>
            </div>

            {/* Action CTAs: Visit Live & GitHub */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              {tape.liveUrl && (
                <a
                  href={tape.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick(1.1)}
                  className="px-3.5 py-1.5 bg-crt-phosphor/10 hover:bg-crt-phosphor/20 border border-crt-phosphor/40 hover:border-crt-phosphor text-white font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-crt-phosphor/25 hover:border-crt-phosphor/50 text-crt-phosphor tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
                className="text-crt-phosphor/50 hover:text-crt-phosphor transition-colors tracking-widest cursor-pointer ml-1 text-[11px]"
              >
                [ ← RETURN ]
              </button>
            </div>
          </div>
        </div>

        {/* 2. CINEMATIC LARGE-SCALE VISUAL HERO (Edge-to-Edge Project Image) */}
        <div className="flex-shrink-0 w-[440px] sm:w-[560px] flex flex-col justify-center gap-2">
          <div className="relative aspect-[16/10] bg-black/90 border border-crt-phosphor/20 rounded-xs overflow-hidden shadow-2xl group">
            <img
              src={tape.image}
              alt={tape.title}
              className="w-full h-full object-cover contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-crt-phosphor/40 px-1">
            <span>PLATE 01 // OVERVIEW CAPTURE</span>
            <span>{tape.title}</span>
          </div>
        </div>

        {/* 3. EDITORIAL CHAPTER 01: Concept & Narrative */}
        {tape.problem && (
          <div className="flex-shrink-0 w-[300px] sm:w-[380px] flex flex-col justify-center gap-3 border-l border-crt-phosphor/15 pl-8 sm:pl-10 font-mono">
            <span className="text-xs text-crt-phosphor/50 tracking-widest uppercase">
              01 · NARRATIVE & CONCEPT
            </span>

            <h2 className="font-bit text-2xl sm:text-3xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase">
              {tape.problem.headline}
            </h2>

            <p className="text-xs text-crt-phosphor/75 leading-relaxed">
              {tape.problem.description}
            </p>
          </div>
        )}

        {/* 4. EDITORIAL CHAPTER 02: Architecture & Directive */}
        {tape.architecture && (
          <div className="flex-shrink-0 w-[320px] sm:w-[420px] flex flex-col justify-center gap-3 border-l border-crt-phosphor/15 pl-8 sm:pl-10 font-mono">
            <span className="text-xs text-crt-phosphor/50 tracking-widest uppercase">
              02 · ARCHITECTURE & DIRECTIVE
            </span>

            <h2 className="font-bit text-2xl sm:text-3xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase">
              {tape.architecture.headline}
            </h2>

            <div className="flex flex-col gap-2.5 pt-1">
              {tape.architecture.highlights.map((h, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-crt-phosphor flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-crt-phosphor/50 inline-block" />
                    <span>{h.title}</span>
                  </span>
                  <span className="text-[10px] text-crt-phosphor/65 pl-3.5 leading-snug">
                    {h.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. EDITORIAL CHAPTER 03: Pipeline & Systems */}
        <div className="flex-shrink-0 w-[280px] sm:w-[360px] flex flex-col justify-center gap-3 border-l border-crt-phosphor/15 pl-8 sm:pl-10 font-mono">
          <span className="text-xs text-crt-phosphor/50 tracking-widest uppercase">
            03 · PIPELINE & SYSTEMS
          </span>

          <h2 className="font-bit text-2xl sm:text-3xl font-bold leading-tight text-crt-phosphor phosphor-glow uppercase">
            TECHNOLOGICAL MATRIX
          </h2>

          <p className="text-[11px] text-crt-phosphor/75 leading-relaxed">
            {tape.story}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
            {tape.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/5 border border-crt-phosphor/20 text-crt-phosphor/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 6. ADVANCE TO NEXT REEL CARD */}
        <div className="flex-shrink-0 flex items-center justify-center pr-8 pl-4">
          <button
            type="button"
            onClick={() => {
              audio.playClick(1.2);
              onNextProject();
            }}
            className="p-6 sm:p-8 border border-crt-phosphor/25 hover:border-crt-phosphor/60 bg-white/[0.02] hover:bg-white/[0.06] transition-all flex flex-col items-center gap-3 text-center cursor-pointer active:scale-95 group rounded-xs font-mono"
          >
            <span className="text-[10px] text-crt-phosphor/50 tracking-widest uppercase">
              NEXT REEL // [{nextTape.code}]
            </span>

            <span className="font-bit text-3xl sm:text-4xl font-bold text-crt-phosphor group-hover:text-white uppercase leading-none">
              {nextTape.title}
            </span>

            <span className="text-[11px] font-bold text-crt-phosphor/70 group-hover:text-white tracking-wider border-b border-crt-phosphor/40 pb-0.5">
              [ ADVANCE REEL → ]
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
