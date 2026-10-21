"use client";

import { useEffect, useRef, useCallback } from "react";
import { TapeProject } from "@/data/tapes";
import { audio } from "@/lib/audio";

interface WorkDetailViewProps {
  tape: TapeProject;
  onBack: () => void;
  onNextProject: () => void;
}

/**
 * Horizontal Editorial Exhibition Gallery (Arc Marumo style).
 * Sits comfortably in the middle stage between the permanent Header and Footer.
 */
export function WorkDetailView({ tape, onBack, onNextProject }: WorkDetailViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation: Escape to go back, ArrowLeft/ArrowRight to scroll horizontally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      } else if (e.key === "ArrowRight") {
        scrollContainerRef.current?.scrollBy({ left: 420, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        scrollContainerRef.current?.scrollBy({ left: -420, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  // Natural Horizontal Scrolling via Wheel (supports mouse wheel deltaY & trackpad gestures)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      container.scrollLeft += e.deltaX;
      return;
    }

    container.scrollLeft += e.deltaY * 1.15;
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      onWheel={handleWheel}
      className="w-full h-full flex items-center overflow-x-auto overflow-y-hidden no-scrollbar py-2 gap-10 sm:gap-14 select-none scroll-smooth cursor-default"
      tabIndex={0}
    >
      {/* PANEL 1: Physical VHS Sleeve Showcase with Real Project Artwork */}
      <div className="flex-shrink-0 flex items-center justify-center pl-2">
        <div className="relative w-[180px] sm:w-[210px] aspect-[130/196] bg-[#1a1816] rounded-sm p-3.5 border border-crt-phosphor/25 shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 flex flex-col justify-between group overflow-hidden">
          {/* Top metadata */}
          <div className="flex items-center justify-between text-[10px] text-crt-amber font-mono font-bold z-10">
            <span>{tape.code}</span>
            <span>{tape.year}</span>
          </div>

          {/* Real Project Cover Poster */}
          <div className="relative w-full aspect-[4/3] my-2 bg-black/80 rounded-sm overflow-hidden border border-crt-phosphor/20">
            <img
              src={tape.image}
              alt={tape.title}
              className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Title & Category */}
          <div className="text-center z-10">
            <span className="text-[9px] text-crt-phosphor/50 uppercase tracking-widest block truncate">
              {tape.category}
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-crt-phosphor tracking-wider mt-0.5 truncate phosphor-glow">
              {tape.title}
            </h3>
          </div>

          {/* Bottom tape spec bar */}
          <div className="flex items-center justify-between text-[8px] text-crt-phosphor/40 border-t border-crt-phosphor/10 pt-2 z-10">
            <span>{tape.meta.format}</span>
            <span>{tape.meta.quality}</span>
          </div>
        </div>
      </div>

      {/* PANEL 2: Editorial Intro & Headline (Arc Marumo style) */}
      <div className="flex-shrink-0 w-[300px] sm:w-[420px] flex flex-col justify-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-crt-amber tracking-widest uppercase font-mono font-bold">
            [{tape.code} // {tape.category}]
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-crt-phosphor/20 text-crt-phosphor/60">
            {tape.year}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight phosphor-glow text-crt-phosphor">
          {tape.headline}
        </h1>

        <p className="text-xs text-crt-phosphor/75 leading-relaxed">
          {tape.summary}
        </p>

        {/* Live Demo & GitHub CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {tape.liveUrl && (
            <a
              href={tape.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audio.playClick(1.1)}
              className="px-3.5 py-1.5 bg-crt-phosphor/10 hover:bg-crt-phosphor/20 border border-crt-phosphor/40 hover:border-crt-phosphor text-white text-[11px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-crt-phosphor/25 hover:border-crt-phosphor/50 text-crt-phosphor text-[11px] tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
            className="text-[11px] text-crt-phosphor/50 hover:text-crt-phosphor transition-colors tracking-widest cursor-pointer ml-1"
          >
            [ ← RETURN ]
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[10px] text-crt-phosphor/40 tracking-widest">
          <span>[ SCROLL HORIZONTALLY OR USE ARROWS → ]</span>
        </div>
      </div>

      {/* PANEL 3: Real Key Metrics Grid */}
      {tape.metrics && tape.metrics.length > 0 && (
        <div className="flex-shrink-0 w-[260px] sm:w-[320px] flex flex-col justify-center gap-2.5">
          <div className="text-[11px] text-crt-amber tracking-widest uppercase font-mono">
            // TELEMETRY & BENCHMARKS
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {tape.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-black/60 border border-crt-phosphor/20 p-3 rounded-sm flex flex-col justify-between"
              >
                <span className="text-[9px] text-crt-phosphor/50 uppercase tracking-widest block">
                  {m.label}
                </span>
                <span className="text-sm sm:text-base font-bold text-crt-phosphor phosphor-glow mt-1 font-mono">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PANEL 4: Problem Statement & Challenge */}
      {tape.problem && (
        <div className="flex-shrink-0 w-[280px] sm:w-[380px] flex flex-col justify-center gap-2.5 border-l border-crt-phosphor/15 pl-6 sm:pl-8">
          <div className="text-[11px] text-crt-amber tracking-widest uppercase font-mono">
            // THE PROBLEM // CHALLENGE
          </div>
          <h3 className="text-sm sm:text-base font-bold text-crt-phosphor leading-snug">
            {tape.problem.headline}
          </h3>
          <p className="text-[11px] text-crt-phosphor/70 leading-relaxed max-h-[220px] overflow-y-auto no-scrollbar">
            {tape.problem.description}
          </p>
        </div>
      )}

      {/* PANEL 5: Architecture Highlights */}
      {tape.architecture && (
        <div className="flex-shrink-0 w-[300px] sm:w-[420px] flex flex-col justify-center gap-2.5 border-l border-crt-phosphor/15 pl-6 sm:pl-8">
          <div className="text-[11px] text-crt-amber tracking-widest uppercase font-mono">
            // ARCHITECTURE & ENGINEERING
          </div>
          <p className="text-[11px] text-crt-phosphor/80 leading-relaxed font-bold">
            {tape.architecture.headline}
          </p>

          <div className="flex flex-col gap-2 pt-1">
            {tape.architecture.highlights.map((h, idx) => (
              <div
                key={idx}
                className="bg-black/40 border border-crt-phosphor/15 p-2.5 rounded-sm"
              >
                <div className="text-[10px] font-bold text-crt-phosphor/90 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-crt-amber inline-block" />
                  <span>{h.title}</span>
                </div>
                <div className="text-[10px] text-crt-phosphor/60 mt-1 leading-snug">
                  {h.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PANEL 6: Core Features */}
      {tape.features && tape.features.length > 0 && (
        <div className="flex-shrink-0 w-[280px] sm:w-[360px] flex flex-col justify-center gap-2.5 border-l border-crt-phosphor/15 pl-6 sm:pl-8">
          <div className="text-[11px] text-crt-amber tracking-widest uppercase font-mono">
            // CURATED CAPABILITIES
          </div>

          <div className="flex flex-col gap-2">
            {tape.features.map((f, idx) => (
              <div
                key={idx}
                className="bg-black/60 border border-crt-phosphor/20 p-2.5 rounded-sm flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-crt-phosphor tracking-wider">
                    {f.title}
                  </span>
                  {f.tag && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-white/10 text-crt-phosphor/70">
                      {f.tag}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-crt-phosphor/60 leading-snug">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PANEL 7: Specifications, Tech Stack & Client */}
      <div className="flex-shrink-0 w-[280px] sm:w-[360px] flex flex-col justify-center gap-3 border-l border-crt-phosphor/15 pl-6 sm:pl-8">
        <div className="text-[11px] text-crt-amber tracking-widest uppercase font-mono">
          // SYSTEM SPECIFICATIONS
        </div>

        <div className="grid grid-cols-2 gap-3 text-[11px] border-y border-crt-phosphor/10 py-2.5">
          <div>
            <span className="text-crt-phosphor/40 block text-[9px]">ROLE</span>
            <span className="text-crt-phosphor font-bold">{tape.role}</span>
          </div>
          <div>
            <span className="text-crt-phosphor/40 block text-[9px]">INITIATIVE</span>
            <span className="text-crt-phosphor font-bold truncate block">
              {tape.client}
            </span>
          </div>
        </div>

        <div>
          <span className="text-crt-phosphor/40 block text-[9px] mb-1">
            CORE PIPELINE
          </span>
          <span className="text-[11px] text-crt-phosphor/90 font-mono block">
            {tape.system}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {tape.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 bg-white/5 border border-crt-phosphor/20 text-crt-phosphor/70"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* PANEL 8: Advance to Next Reel */}
      <div className="flex-shrink-0 flex items-center justify-center pr-6">
        <button
          type="button"
          onClick={() => {
            audio.playClick(1.2);
            onNextProject();
          }}
          className="px-6 py-8 border border-crt-amber/40 hover:border-crt-amber bg-crt-amber/5 hover:bg-crt-amber/10 transition-all flex flex-col items-center gap-2.5 text-center cursor-pointer active:scale-95 group"
        >
          <span className="text-[11px] text-crt-amber tracking-widest uppercase font-mono">
            NEXT REEL //
          </span>
          <span className="text-lg sm:text-xl font-bold text-crt-phosphor group-hover:text-white">
            [ ADVANCE REEL → ]
          </span>
          <span className="text-[9px] text-crt-phosphor/40 font-mono">
            CLICK OR USE ARROWS
          </span>
        </button>
      </div>
    </div>
  );
}
