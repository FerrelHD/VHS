"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import { motion } from "motion/react";
import { TAPE_PROJECTS, ARCHIVE_CATEGORIES, ArchiveCategoryFilter } from "@/data/tapes";
import { audio } from "@/lib/audio";
import { useCrtBend } from "@/lib/useCrtBend";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";

interface ArchiveViewProps {
  onBack: () => void;
  onSelectProject: (index: number) => void;
}

// 10 Floating constellation coordinates designed to orbit around the central HUD
const SHARD_COORDINATES = [
  { top: "6%", left: "6%", depth: 1.4, rotate: "-4deg" },     // EP.01 - Top Left Outer
  { top: "10%", left: "26%", depth: 2.5, rotate: "2deg" },     // EP.02 - Top Left Inner
  { top: "5%", left: "64%", depth: 0.9, rotate: "-2deg" },     // EP.03 - Top Right Inner
  { top: "11%", left: "84%", depth: 1.9, rotate: "4deg" },     // EP.04 - Top Right Outer
  { top: "42%", left: "3%", depth: 2.8, rotate: "-3deg" },     // EP.05 - Mid Left Edge
  { top: "40%", left: "86%", depth: 2.2, rotate: "3deg" },     // EP.06 - Mid Right Edge
  { top: "72%", left: "5%", depth: 1.6, rotate: "2deg" },      // EP.07 - Bottom Left Outer
  { top: "78%", left: "26%", depth: 0.7, rotate: "-3deg" },    // EP.08 - Bottom Left Inner
  { top: "74%", left: "62%", depth: 2.4, rotate: "4deg" },     // EP.09 - Bottom Right Inner
  { top: "76%", left: "83%", depth: 1.8, rotate: "-2deg" },    // EP.10 - Bottom Right Outer
];

/**
 * Cyberpunk: Edgerunners Cinematic Floating Vault (Option A).
 * Replaces linear scrolling with an authentic floating 3D cyberspace void.
 * Braindance shards drift with varied parallax depth around a central CRT HUD.
 */
export function ArchiveView({ onBack, onSelectProject }: ArchiveViewProps) {
  const [filter, setFilter] = useState<ArchiveCategoryFilter>("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const activeCount =
    filter === "all"
      ? TAPE_PROJECTS.length
      : TAPE_PROJECTS.filter((t) => t.categoryFilter === filter).length;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 select-none font-mono text-crt-phosphor overflow-hidden"
      tabIndex={0}
    >
      {/* 1. CENTRAL COMMAND HUD (Always visible in center with phosphor glow) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center p-4 text-center"
      >
        <div className="w-full max-w-xl flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/60 tracking-widest uppercase">
            <span className="text-amber-400 font-bold">[VAULT // SHARD MATRIX]</span>
            <span>•</span>
            <span className="text-crt-phosphor/80">TOTAL 10 REELS</span>
          </div>

          <h1 className="font-bit text-3xl sm:text-5xl md:text-6xl font-bold leading-none tracking-tight text-crt-phosphor phosphor-glow uppercase">
            BRAINDANCE VAULT
          </h1>

          <div className="text-[11px] sm:text-xs text-crt-phosphor/85 font-mono tracking-wider uppercase">
            {hoveredIndex !== null ? (
              <span className="text-amber-400 font-bold phosphor-glow">
                READY TO INITIALIZE: [{TAPE_PROJECTS[hoveredIndex]?.code} // {TAPE_PROJECTS[hoveredIndex]?.title}]
              </span>
            ) : (
              <span>SELECT A SHARD TO INITIATE PLAYBACK</span>
            )}
          </div>

          {/* Interactive Category Filter Toggles */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            {ARCHIVE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  audio.playClick(1.0);
                  setFilter(cat.id);
                }}
                className={`text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer py-1 px-1.5 ${
                  filter === cat.id
                    ? "text-amber-400 font-bold phosphor-glow border-b border-amber-400"
                    : "text-crt-phosphor/50 hover:text-white"
                }`}
              >
                [{cat.label}]
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1 text-[9px] sm:text-[10px] text-crt-phosphor/40">
            <span>SHOWING {activeCount} OF {TAPE_PROJECTS.length} SHARDS</span>
          </div>

          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onBack();
            }}
            className="pointer-events-auto mt-2 text-white/70 hover:text-amber-400 font-bold tracking-wider transition-colors cursor-pointer text-[10px] sm:text-xs py-1"
          >
            [ ← RETURN TO REELS / ESC ]
          </button>
        </div>
      </motion.div>

      {/* 2. 3D FLOATING PARALLAX VOID */}
      <Floating sensitivity={-1.1} easingFactor={0.06} className="overflow-hidden">
        {TAPE_PROJECTS.map((tape, idx) => {
          const coord = SHARD_COORDINATES[idx] || {
            top: "50%",
            left: "50%",
            depth: 1,
            rotate: "0deg",
          };
          const isMatch = filter === "all" || tape.categoryFilter === filter;
          const isHovered = hoveredIndex === idx;

          return (
            <FloatingElement
              key={tape.id}
              depth={coord.depth}
              className={`transition-opacity duration-500 ${
                isMatch ? "opacity-100" : "opacity-20 pointer-events-none"
              }`}
              style={
                {
                  top: coord.top,
                  left: coord.left,
                } as CSSProperties
              }
            >
              <div
                onClick={() => {
                  audio.playClick(1.2);
                  onSelectProject(idx);
                }}
                onMouseEnter={() => {
                  audio.playClick(1.4);
                  setHoveredIndex(idx);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                }}
                style={{ transform: `rotate(${coord.rotate})` }}
                className="group relative cursor-pointer select-none transition-transform duration-500 hover:scale-110 active:scale-95 will-change-transform"
              >
                {/* Physical VHS Mini Sleeve Poster */}
                <div
                  className={`relative w-[78px] sm:w-[98px] md:w-[118px] lg:w-[136px] aspect-[130/196] bg-[#141210] rounded-xs border overflow-hidden transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.85)] ${
                    isHovered
                      ? "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] scale-102"
                      : "border-crt-phosphor/35 hover:border-white"
                  }`}
                >
                  <img
                    src={`/tapes/${tape.id}-front.webp?v=${tape.wearSeed}`}
                    alt={tape.title}
                    className="w-full h-full object-cover rounded-xs pointer-events-none transition-[filter,transform] duration-500 contrast-105 group-hover:contrast-115 group-hover:scale-105"
                  />
                  {/* Subtle gloss lighting diagonal gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />

                  {/* Shard Play Tag Overlay */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[8px] font-mono tracking-wider text-white/90">
                    <span className="text-amber-300 font-bold">{tape.code}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-amber-300 transition-opacity">PLAY ↗</span>
                  </div>
                </div>

                {/* Floating Typographic Label Badge */}
                <div className="absolute top-[102%] left-1/2 -translate-x-1/2 pt-1 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-[9px] font-mono font-bold text-amber-400 tracking-wider phosphor-glow bg-black/85 px-1.5 py-0.5 rounded-xs border border-amber-400/40">
                    {tape.code} • {tape.title}
                  </div>
                </div>
              </div>
            </FloatingElement>
          );
        })}
      </Floating>

      {/* 3. SUBTLE CRT SCANLINE VIGNETTE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/60 z-20" />
    </div>
  );
}
