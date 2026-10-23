"use client";

import { useEffect, useState } from "react";
import { N54_HEADLINES, N54_BULLETINS, NewsBulletin } from "@/data/news";
import { audio } from "@/lib/audio";
import { useCrtBend } from "@/lib/useCrtBend";
import { useRef } from "react";

interface NewsViewProps {
  onBack: () => void;
}

/**
 * N54 News Watch (Inspired by arcmarumo.com/news-watch).
 * Full-bleed analog television news broadcast stream with rolling marquee headlines
 * and authentic in-universe Night City emergency bulletins.
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
      className="pj-view no-scrollbar select-none font-mono text-crt-phosphor overflow-y-auto px-[var(--margin)] py-[var(--pj-top)]"
      tabIndex={0}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-16">
        {/* 1. BROADCAST TOP BANNER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crt-phosphor/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <div>
              <div className="flex items-center gap-2 text-[10px] text-crt-phosphor/60 tracking-widest uppercase">
                <span className="text-red-400 font-bold">[N54 NEWS LIVE]</span>
                <span>•</span>
                <span>CH-54 NIGHT CITY BROADCAST</span>
              </div>
              <h1 className="font-bit text-3xl sm:text-5xl font-bold leading-none text-crt-phosphor phosphor-glow uppercase tracking-tight">
                NIGHT CITY NEWS WATCH
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-[11px] text-crt-phosphor/50 tracking-wider">
              FEED FREQUENCY: 142.85 MHZ
            </span>
            <button
              type="button"
              onClick={() => {
                audio.playClick(0.9);
                onBack();
              }}
              className="text-white hover:text-amber-400 font-bold tracking-wider transition-colors cursor-pointer text-xs py-1"
            >
              [ ← RETURN / ESC ]
            </button>
          </div>
        </div>

        {/* 2. INFINITE ROLLING MARQUEE TICKERS (arcmarumo style) */}
        <div className="flex flex-col gap-2 overflow-hidden border-y border-crt-phosphor/30 py-3 bg-black/40">
          {/* Ticker Row 1: Fast High-Priority Flash */}
          <div className="flex overflow-hidden whitespace-nowrap text-xs sm:text-sm tracking-widest text-amber-300 font-bold uppercase">
            <div className="flex animate-[marquee_28s_linear_infinite] gap-8 shrink-0">
              {N54_HEADLINES.map((h, i) => (
                <span key={`t1-${i}`} className="flex items-center gap-3">
                  <span className="text-red-500 font-black">[FLASH]</span>
                  <span>{h}</span>
                  <span className="text-crt-phosphor/40">///</span>
                </span>
              ))}
            </div>
            <div className="flex animate-[marquee_28s_linear_infinite] gap-8 shrink-0" aria-hidden="true">
              {N54_HEADLINES.map((h, i) => (
                <span key={`t1-dup-${i}`} className="flex items-center gap-3">
                  <span className="text-red-500 font-black">[FLASH]</span>
                  <span>{h}</span>
                  <span className="text-crt-phosphor/40">///</span>
                </span>
              ))}
            </div>
          </div>

          {/* Ticker Row 2: Massive Pixel Font Marquee */}
          <div className="flex overflow-hidden whitespace-nowrap text-2xl sm:text-4xl font-bit tracking-wide text-crt-phosphor uppercase">
            <div className="flex animate-[marquee_38s_linear_infinite_reverse] gap-10 shrink-0">
              <span className="text-crt-phosphor phosphor-glow">ARASAKA TOWER ALERT &bull; MILITECH HIGHWAY PURSUIT &bull; SANTO DOMINGO INCIDENT &bull; PACIFICA BLACKOUT &bull; LUNAR FLIGHTS 250,000 ED &bull;</span>
              <span className="text-crt-phosphor phosphor-glow">MAX-TAC DISPATCH TO CORONADO BAY &bull; ACID RAIN WARNING PH 3.2 &bull; AFTERLIFE CONTRACTS OPEN &bull;</span>
            </div>
            <div className="flex animate-[marquee_38s_linear_infinite_reverse] gap-10 shrink-0" aria-hidden="true">
              <span className="text-crt-phosphor phosphor-glow">ARASAKA TOWER ALERT &bull; MILITECH HIGHWAY PURSUIT &bull; SANTO DOMINGO INCIDENT &bull; PACIFICA BLACKOUT &bull; LUNAR FLIGHTS 250,000 ED &bull;</span>
              <span className="text-crt-phosphor phosphor-glow">MAX-TAC DISPATCH TO CORONADO BAY &bull; ACID RAIN WARNING PH 3.2 &bull; AFTERLIFE CONTRACTS OPEN &bull;</span>
            </div>
          </div>
        </div>

        {/* 3. SPLIT EDITORIAL: Featured Incident + Dispatch Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Active Highlighted Bulletin */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[10px] text-crt-phosphor/60 tracking-widest uppercase">
              <span className="text-red-400 font-bold">[{activeBulletin.category}]</span>
              <span>•</span>
              <span>{activeBulletin.timestamp}</span>
              <span>•</span>
              <span className="text-crt-phosphor/40">{activeBulletin.source}</span>
            </div>

            <h2 className="font-bit text-3xl sm:text-5xl font-bold leading-[0.95] text-crt-phosphor phosphor-glow uppercase tracking-tight">
              {activeBulletin.headline}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-crt-phosphor/85 leading-relaxed font-mono pt-2">
              {activeBulletin.body}
            </p>

            <div className="border-t border-crt-phosphor/20 pt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] text-crt-phosphor/60">
              <span>STATUS: UNCONFIRMED DISPATCH // CORONADO RELAY</span>
              <span className="text-amber-400">RESTRICTED FOR PUBLIC RELEASE</span>
            </div>
          </div>

          {/* Right Column: Bulletin Selector Reel */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="text-[10px] text-crt-phosphor/40 tracking-widest uppercase mb-1">
              [DISPATCH ARCHIVE // SELECT LOG]
            </span>

            <div className="space-y-2">
              {N54_BULLETINS.map((b) => {
                const isSelected = activeBulletin.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      audio.playClick(1.1);
                      setActiveBulletin(b);
                    }}
                    className={`py-2 px-1 transition-all cursor-pointer border-b border-crt-phosphor/15 ${
                      isSelected
                        ? "text-white phosphor-glow"
                        : "text-crt-phosphor/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] tracking-wider mb-1">
                      <span className="font-bold text-amber-300">[{b.category}]</span>
                      <span className="text-crt-phosphor/50">{b.timestamp}</span>
                    </div>
                    <h3 className="font-bit text-lg sm:text-xl font-bold uppercase leading-tight line-clamp-1">
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
