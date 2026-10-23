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

// 10 Floating constellation coordinates with authentic 3D spherical dome orientation (Option A)
const SHARD_COORDINATES = [
  { top: "6%", left: "8%", depth: 1.4, rotY: 14, rotX: -10, rotate: -3 },     // EP.01 - Top Left Outer
  { top: "10%", left: "28%", depth: 2.2, rotY: 8, rotX: -7, rotate: 2 },      // EP.02 - Top Left Inner
  { top: "6%", left: "64%", depth: 0.9, rotY: -8, rotX: -7, rotate: -2 },     // EP.03 - Top Right Inner
  { top: "11%", left: "84%", depth: 1.8, rotY: -14, rotX: -10, rotate: 3 },   // EP.04 - Top Right Outer
  { top: "42%", left: "5%", depth: 2.6, rotY: 17, rotX: 0, rotate: -2 },      // EP.05 - Mid Left Edge
  { top: "40%", left: "85%", depth: 2.2, rotY: -17, rotX: 0, rotate: 2 },     // EP.06 - Mid Right Edge
  { top: "72%", left: "8%", depth: 1.6, rotY: 14, rotX: 9, rotate: 2 },       // EP.07 - Bottom Left Outer
  { top: "78%", left: "28%", depth: 0.7, rotY: 8, rotX: 7, rotate: -2 },      // EP.08 - Bottom Left Inner
  { top: "74%", left: "62%", depth: 2.4, rotY: -8, rotX: 7, rotate: 3 },      // EP.09 - Bottom Right Inner
  { top: "76%", left: "82%", depth: 1.8, rotY: -14, rotX: 9, rotate: -2 },    // EP.10 - Bottom Right Outer
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
        <div className="w-full max-w-xl flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-crt-phosphor/60 tracking-widest uppercase">
            <span className="text-amber-400 font-bold">[VAULT // SHARD MATRIX]</span>
            <span>•</span>
            <span className="text-crt-phosphor/80">TOTAL 10 REELS</span>
          </div>

          <h1 className="font-bit text-3xl sm:text-5xl md:text-6xl font-bold leading-none tracking-tight text-crt-phosphor phosphor-glow uppercase">
            BRAINDANCE VAULT
          </h1>

          {/* Locked height prevents any layout shift on hover */}
          <div className="h-6 flex items-center justify-center text-[11px] sm:text-xs text-crt-phosphor/85 font-mono tracking-wider uppercase px-2">
            {hoveredIndex !== null ? (
              <span className="text-amber-400 font-bold phosphor-glow truncate max-w-full">
                READY TO INITIALIZE: [{TAPE_PROJECTS[hoveredIndex]?.code} // {TAPE_PROJECTS[hoveredIndex]?.title}]
              </span>
            ) : (
              <span>SELECT A SHARD TO INITIATE PLAYBACK</span>
            )}
          </div>

          {/* Interactive Category Filter Toggles */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
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

          <div className="flex items-center gap-2 pt-0.5 text-[9px] sm:text-[10px] text-crt-phosphor/40">
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

      {/* 2. 3D FLOATING PARALLAX VOID (Option A: 3D Spherical Concave Dome) */}
      <Floating sensitivity={-1.1} easingFactor={0.06} className="overflow-hidden [perspective:1200px] [transform-style:preserve-3d]">
        {TAPE_PROJECTS.map((tape, idx) => {
          const coord = SHARD_COORDINATES[idx] || {
            top: "50%",
            left: "50%",
            depth: 1,
            rotY: 0,
            rotX: 0,
            rotate: 0,
          };
          const isMatch = filter === "all" || tape.categoryFilter === filter;

          return (
            <FloatingElement
              key={tape.id}
              depth={coord.depth}
              className={`transition-opacity duration-500 [transform-style:preserve-3d] ${
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
                  if (hoveredIndex !== idx) {
                    audio.playClick(1.4);
                    setHoveredIndex(idx);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                }}
                style={{
                  transform: `perspective(1000px) rotateY(${coord.rotY}deg) rotateX(${coord.rotX}deg) rotateZ(${coord.rotate}deg)`,
                  transformStyle: "preserve-3d",
                }}
                className="group relative cursor-pointer select-none will-change-transform active:scale-95"
              >
                {/* Physical VHS Mini Sleeve Poster (Option 3: Analog Plastic Gloss Sheen, zero physical scale) */}
                <div
                  className="relative w-[78px] sm:w-[98px] md:w-[118px] lg:w-[136px] aspect-[130/196] bg-[#141210] rounded-xs border border-crt-phosphor/30 group-hover:border-crt-phosphor/90 overflow-hidden transition-[border-color,box-shadow] duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.85)] group-hover:shadow-[0_18px_45px_rgba(0,0,0,0.95)]"
                >
                  <img
                    src={`/tapes/${tape.id}-front.webp?v=${tape.wearSeed}`}
                    alt={tape.title}
                    className="w-full h-full object-cover rounded-xs pointer-events-none transition-[filter] duration-300 contrast-105 brightness-95 group-hover:contrast-115 group-hover:brightness-105"
                  />

                  {/* 1. Base Subtle Ambient Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />

                  {/* 2. Analog Physical Plastic Gloss Reflection (Sweeps across on hover) */}
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/30 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{ mixBlendMode: "overlay" }}
                  />

                  {/* 3. Shard Play Tag Overlay */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[8px] font-mono tracking-wider">
                    <span className="font-bold text-white/70 group-hover:text-white group-hover:phosphor-glow transition-colors duration-200">
                      {tape.code}
                    </span>
                    <span className="font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      PLAY ↗
                    </span>
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
