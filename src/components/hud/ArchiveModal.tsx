"use client";

import { useState, useEffect } from "react";
import {
  TAPE_PROJECTS,
  ARCHIVE_CATEGORIES,
  ArchiveCategoryFilter,
} from "@/data/tapes";
import { audio } from "@/lib/audio";

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (index: number) => void;
}

export function ArchiveModal({
  isOpen,
  onClose,
  onSelectProject,
}: ArchiveModalProps) {
  const [filter, setFilter] = useState<ArchiveCategoryFilter>("all");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = TAPE_PROJECTS.filter((tape) => {
    if (filter === "all") return true;
    return tape.categoryFilter === filter;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-heading"
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-5xl max-h-[88vh] bg-[#121110]/95 border border-crt-phosphor/30 rounded-xs p-5 sm:p-7 overflow-hidden shadow-2xl flex flex-col justify-between gap-5 font-mono">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-crt-phosphor/20 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-crt-amber inline-block" />
            <span className="text-xs text-crt-amber tracking-widest font-bold">
              CATALOGUE ARCHIVE // ALL REELS [12 ENTRIES]
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              audio.playClick(0.9);
              onClose();
            }}
            className="text-xs text-crt-phosphor/70 hover:text-white transition-colors cursor-pointer px-2.5 py-1 border border-crt-phosphor/20 hover:border-crt-phosphor/60"
            aria-label="Close archive"
          >
            [ ESC / CLOSE ✕ ]
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {ARCHIVE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                audio.playClick(1.0);
                setFilter(cat.id);
              }}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                filter === cat.id
                  ? "bg-crt-amber text-black font-bold border border-crt-amber shadow-sm"
                  : "bg-white/5 text-crt-phosphor/70 hover:text-white border border-crt-phosphor/20 hover:border-crt-phosphor/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-[10px] text-crt-phosphor/40 ml-auto">
            SHOWING: {filteredProjects.length} OF {TAPE_PROJECTS.length}
          </span>
        </div>

        {/* Project Table / Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar border border-crt-phosphor/15 rounded-xs bg-black/40">
          <div className="grid grid-cols-1 divide-y divide-crt-phosphor/10">
            {filteredProjects.map((tape) => {
              const globalIndex = TAPE_PROJECTS.findIndex((t) => t.id === tape.id);
              return (
                <div
                  key={tape.id}
                  onClick={() => {
                    audio.playClick(1.2);
                    onSelectProject(globalIndex);
                    onClose();
                  }}
                  className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  {/* Left: Code, Thumbnail, Title */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-[11px] text-crt-amber font-bold font-mono w-16 shrink-0">
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
                      <div className="flex items-center gap-2.5">
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

                  {/* Right: Category, Stack & Action CTA */}
                  <div className="flex items-center gap-4 shrink-0 sm:ml-auto">
                    <span className="text-[10px] text-crt-phosphor/50 uppercase tracking-wider hidden md:inline-block">
                      {tape.category}
                    </span>

                    <span className="text-[11px] font-bold text-crt-amber group-hover:text-white transition-colors">
                      [ LOAD TAPE → ]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] text-crt-phosphor/40 border-t border-crt-phosphor/20 pt-2">
          <span>SOURCE INDEX: FERREL RASHAD ARCHIVE</span>
          <span>SELECT ANY ROW TO ENGAGE DECK</span>
        </div>
      </div>
    </div>
  );
}
