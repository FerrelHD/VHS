"use client";

import { useEffect, useState, useRef } from "react";
import { N54_HEADLINES, N54_BULLETINS, NewsBulletin } from "@/data/news";
import { audio } from "@/lib/audio";
import { useCrtBend } from "@/lib/useCrtBend";

interface NewsViewProps {
  onBack: () => void;
}

/**
 * N54 News Watch (Inspired by arcmarumo.com/news-watch).
 * Analog television news broadcast stream with rolling marquee headlines
 * and authentic in-universe Night City emergency bulletins.
 * Tuned with compact, responsive proportions for laptops and desktops.
 */
export function NewsView({ onBack }: NewsViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBulletin, setActiveBulletin] = useState<NewsBulletin>(N54_BULLETINS[0]);

  // Apply authentic CRT curvature
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

  return (
    <div
      ref={containerRef}
      className="pj-view no-scrollbar select-none font-mono text-crt-phosphor overflow-y-auto px-[var(--margin)] pt-[calc(var(--pj-top)+6px)] pb-[calc(var(--pj-bottom)+24px)]"
      tabIndex={0}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
        {/* 1. BROADCAST TOP BANNER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-crt-phosphor/20 pb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-crt-phosphor/60 tracking-widest uppercase">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
              </span>
              <span className="text-red-400 font-bold">[N54 NEWS LIVE]</span>
              <span>•</span>
              <span>CH-54 NIGHT CITY BROADCAST</span>
            </div>
            <h1 className="font-bit text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-none text-crt-phosphor phosphor-glow uppercase tracking-tight">
              NIGHT CITY NEWS WATCH
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] sm:text-[10px] text-crt-phosphor/50 tracking-wider">
              FEED FREQUENCY: 142.85 MHZ
            </span>
            <button
              type="button"
              onClick={() => {
                audio.playClick(0.9);
                onBack();
              }}
              className="text-white hover:text-amber-400 font-bold tracking-wider transition-colors cursor-pointer text-[10px] sm:text-xs py-1"
            >
              [ ← RETURN / ESC ]
            </button>
          </div>
        </div>

        {/* 2. INFINITE ROLLING MARQUEE TICKERS (Compact Retro Stream) */}
        <div className="flex flex-col gap-1.5 overflow-hidden border-y border-crt-phosphor/30 py-2 sm:py-2.5 bg-black/40">
          {/* Ticker Row 1: Fast High-Priority Flash */}
          <div className="flex overflow-hidden whitespace-nowrap text-[10px] sm:text-xs tracking-wider text-amber-300 font-bold uppercase">
            <div className="flex animate-[marquee_28s_linear_infinite] gap-8 shrink-0">
              {N54_HEADLINES.map((h, i) => (
                <span key={`t1-${i}`} className="flex items-center gap-2.5">
                  <span className="text-red-500 font-black">[FLASH]</span>
                  <span>{h}</span>
                  <span className="text-crt-phosphor/40">///</span>
                </span>
              ))}
            </div>
            <div className="flex animate-[marquee_28s_linear_infinite] gap-8 shrink-0" aria-hidden="true">
              {N54_HEADLINES.map((h, i) => (
                <span key={`t1-dup-${i}`} className="flex items-center gap-2.5">
                  <span className="text-red-500 font-black">[FLASH]</span>
                  <span>{h}</span>
                  <span className="text-crt-phosphor/40">///</span>
                </span>
              ))}
            </div>
          </div>

          {/* Ticker Row 2: Pixel Font Marquee (Scaled for Laptops & Monitors) */}
          <div className="flex overflow-hidden whitespace-nowrap text-base sm:text-lg md:text-2xl font-bit tracking-wide text-crt-phosphor uppercase">
            <div className="flex animate-[marquee_38s_linear_infinite_reverse] gap-8 shrink-0">
              <span className="text-crt-phosphor phosphor-glow">ARASAKA TOWER ALERT &bull; MILITECH HIGHWAY PURSUIT &bull; SANTO DOMINGO INCIDENT &bull; PACIFICA BLACKOUT &bull; LUNAR FLIGHTS 250,000 ED &bull;</span>
              <span className="text-crt-phosphor phosphor-glow">MAX-TAC DISPATCH TO CORONADO BAY &bull; ACID RAIN WARNING PH 3.2 &bull; AFTERLIFE CONTRACTS OPEN &bull;</span>
            </div>
            <div className="flex animate-[marquee_38s_linear_infinite_reverse] gap-8 shrink-0" aria-hidden="true">
              <span className="text-crt-phosphor phosphor-glow">ARASAKA TOWER ALERT &bull; MILITECH HIGHWAY PURSUIT &bull; SANTO DOMINGO INCIDENT &bull; PACIFICA BLACKOUT &bull; LUNAR FLIGHTS 250,000 ED &bull;</span>
              <span className="text-crt-phosphor phosphor-glow">MAX-TAC DISPATCH TO CORONADO BAY &bull; ACID RAIN WARNING PH 3.2 &bull; AFTERLIFE CONTRACTS OPEN &bull;</span>
            </div>
          </div>
        </div>

        {/* 3. SPLIT EDITORIAL: Featured Incident + Dispatch Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Active Highlighted Bulletin */}
          <div className="lg:col-span-7 flex flex-col gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-crt-phosphor/60 tracking-widest uppercase">
              <span className="text-red-400 font-bold">[{activeBulletin.category}]</span>
              <span>•</span>
              <span>{activeBulletin.timestamp}</span>
              <span>•</span>
              <span className="text-crt-phosphor/40">{activeBulletin.source}</span>
            </div>

            <h2 className="font-bit text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-[0.96] text-crt-phosphor phosphor-glow uppercase tracking-tight">
              {activeBulletin.headline}
            </h2>

            <p className="text-[11px] sm:text-xs md:text-[13px] text-crt-phosphor/85 leading-relaxed font-mono pt-1">
              {activeBulletin.body}
            </p>

            <div className="border-t border-crt-phosphor/20 pt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] sm:text-[10px] text-crt-phosphor/60">
              <span>STATUS: UNCONFIRMED DISPATCH // CORONADO RELAY</span>
              <span className="text-amber-400 font-bold">RESTRICTED FOR PUBLIC RELEASE</span>
            </div>
          </div>

          {/* Right Column: Bulletin Selector Reel */}
          <div className="lg:col-span-5 flex flex-col gap-1.5">
            <span className="text-[9px] sm:text-[10px] text-crt-phosphor/40 tracking-widest uppercase mb-0.5">
              [DISPATCH ARCHIVE // SELECT LOG]
            </span>

            <div className="space-y-1.5">
              {N54_BULLETINS.map((b) => {
                const isSelected = activeBulletin.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      audio.playClick(1.1);
                      setActiveBulletin(b);
                    }}
                    className={`py-1.5 px-1.5 transition-all cursor-pointer border-b border-crt-phosphor/15 ${
                      isSelected
                        ? "text-white phosphor-glow bg-white/[0.03] border-crt-phosphor/40"
                        : "text-crt-phosphor/60 hover:text-white hover:bg-white/[0.015]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[8px] sm:text-[9px] tracking-wider mb-0.5">
                      <span className="font-bold text-amber-300">[{b.category}]</span>
                      <span className="text-crt-phosphor/50">{b.timestamp}</span>
                    </div>
                    <h3 className="font-bit text-sm sm:text-base md:text-lg font-bold uppercase leading-tight line-clamp-1">
                      {b.headline}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
