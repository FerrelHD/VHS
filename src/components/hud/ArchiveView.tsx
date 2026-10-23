"use client";

import { useState, useEffect } from "react";
import {
  TAPE_PROJECTS,
  ARCHIVE_CATEGORIES,
  ArchiveCategoryFilter,
} from "@/data/tapes";
import { audio } from "@/lib/audio";

interface ArchiveViewProps {
  onBack: () => void;
  onSelectProject: (index: number) => void;
}

export function ArchiveView({ onBack, onSelectProject }: ArchiveViewProps) {
  const [filter, setFilter] = useState<ArchiveCategoryFilter>("all");

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

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-5xl max-h-[54vh] bg-black/60 border border-crt-phosphor/25 rounded-xs p-4 sm:p-5 flex flex-col justify-between gap-3 font-mono shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-crt-phosphor/20 pb-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-crt-phosphor inline-block" />
            <span className="text-[11px] sm:text-xs text-crt-phosphor/80 tracking-widest font-bold uppercase">
              ARCHIVE CATALOGUE • {TAPE_PROJECTS.length} SHARDS
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onBack();
            }}
            className="text-[11px] text-crt-phosphor/60 hover:text-white transition-colors cursor-pointer px-2 py-0.5 border border-crt-phosphor/20 hover:border-crt-phosphor/50"
          >
            [ ← RETURN / ESC ]
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {ARCHIVE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                audio.playClick(1.0);
                setFilter(cat.id);
              }}
              className={`px-2.5 py-0.5 text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                filter === cat.id
                  ? "bg-crt-phosphor/20 text-white font-bold border border-crt-phosphor"
                  : "bg-white/5 text-crt-phosphor/60 hover:text-white border border-crt-phosphor/20 hover:border-crt-phosphor/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-[10px] text-crt-phosphor/40 ml-auto font-mono">
            COUNT: {filteredProjects.length} / {TAPE_PROJECTS.length}
          </span>
        </div>

        {/* Project Table List */}
        <div className="flex-1 overflow-y-auto no-scrollbar border border-crt-phosphor/15 rounded-xs bg-black/40 min-h-0">
          <div className="grid grid-cols-1 divide-y divide-crt-phosphor/10">
            {filteredProjects.map((tape) => {
              const globalIndex = TAPE_PROJECTS.findIndex((t) => t.id === tape.id);
              return (
                <div
                  key={tape.id}
                  onClick={() => {
                    audio.playClick(1.2);
                    onSelectProject(globalIndex);
                  }}
                  className="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  {/* Left: Code, Thumbnail, Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] text-crt-phosphor font-bold font-mono w-16 shrink-0">
                      [{tape.code}]
                    </span>

                    <div className="w-12 h-8 bg-black/60 rounded-xs overflow-hidden border border-crt-phosphor/20 shrink-0">
                      <img
                        src={tape.image}
                        alt={tape.title}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bit text-xl sm:text-2xl font-bold text-crt-phosphor group-hover:text-white truncate uppercase leading-none">
                          {tape.title}
                        </h4>
                        <span className="text-[10px] text-crt-phosphor/40 font-mono">
                          {tape.year}
                        </span>
                      </div>
                      <span className="text-[10px] text-crt-phosphor/60 block truncate mt-0.5">
                        {tape.headline}
                      </span>
                    </div>
                  </div>

                  {/* Right: Category & Action CTA */}
                  <div className="flex items-center gap-3 shrink-0 sm:self-center pl-1 sm:pl-0">
                    <span className="text-[10px] text-crt-phosphor/50 uppercase tracking-widest hidden md:inline">
                      {tape.category}
                    </span>
                    <span className="text-[10px] text-crt-phosphor/70 group-hover:text-white font-bold border border-crt-phosphor/20 group-hover:border-crt-phosphor/60 px-2 py-0.5 transition-colors">
                      [ INSPECT REEL → ]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] text-crt-phosphor/40 border-t border-crt-phosphor/15 pt-2 shrink-0">
          <span>SORT: CHRONOLOGICAL ARCHIVE</span>
          <span>SELECT AN ENTRY TO PLAY REEL</span>
        </div>
      </div>
    </div>
  );
}
