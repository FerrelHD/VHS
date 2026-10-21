"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { HudConfig, DEFAULT_HUD_CONFIG, exportConfigAsText, saveHudConfig } from "@/lib/hudConfig";
import { audio } from "@/lib/audio";

interface HudCalibrationDeckProps {
  config: HudConfig;
  onChange: (newConfig: HudConfig) => void;
  onReset: () => void;
}

export function HudCalibrationDeck({
  config,
  onChange,
  onReset,
}: HudCalibrationDeckProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<"labels" | "geometry">("geometry");
  const [copied, setCopied] = useState(false);

  // Floating coordinates (default near center-right)
  const [pos, setPos] = useState({ x: 40, y: 80 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  // Keyboard shortcut: Shift + E toggles editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "E" || e.key === "e")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dragging handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPos({
      x: Math.max(10, Math.min(window.innerWidth - 380, dragStartRef.current.startX + dx)),
      y: Math.max(10, Math.min(window.innerHeight - 100, dragStartRef.current.startY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const updateField = useCallback(
    <K extends keyof HudConfig>(key: K, value: HudConfig[K]) => {
      const next = { ...config, [key]: value };
      onChange(next);
      saveHudConfig(next);
    },
    [config, onChange]
  );

  const handleCopy = () => {
    audio.playClick(1.2);
    const text = exportConfigAsText(config);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    audio.playClick(0.8);
    onReset();
    saveHudConfig(DEFAULT_HUD_CONFIG);
  };

  return (
    <>
      {/* 1. Toggle Button (Bottom right subtle CRT calibration tab) */}
      <div className="fixed bottom-3 right-4 z-[75] select-none pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            audio.playClick(1.0);
            setIsOpen((prev) => !prev);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xs font-mono text-[11px] tracking-wider transition-all cursor-pointer shadow-lg border ${
            isOpen
              ? "bg-crt-amber text-black font-bold border-crt-amber shadow-[0_0_12px_rgba(245,167,66,0.5)]"
              : "bg-black/85 text-crt-phosphor/80 hover:text-white border-crt-phosphor/30 hover:border-crt-phosphor/70"
          }`}
          title="Toggle Live Navbar/Footer Editor (Shortcut: Shift + E)"
        >
          <span className="w-2 h-2 inline-block bg-current rounded-full animate-pulse" />
          <span>{isOpen ? "[ CLOSE EDITOR ]" : "[ ⚙ HUD LIVE EDITOR ]"}</span>
        </button>
      </div>

      {/* 2. Draggable / Resizable Studio Calibration Drawer */}
      {isOpen && (
        <aside
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            width: "360px",
          }}
          className="fixed top-0 left-0 z-[80] bg-[#0c0c0e]/95 border border-crt-phosphor/35 rounded-xs shadow-[0_8px_32px_rgba(0,0,0,0.85)] font-mono text-xs select-none backdrop-blur-md pointer-events-auto flex flex-col overflow-hidden max-h-[85vh]"
          aria-label="HUD Calibration Panel"
        >
          {/* Header Bar (Draggable handle) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full bg-[#16161a] border-b border-crt-phosphor/20 px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing shrink-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-crt-phosphor/40">:::</span>
              <span className="text-[11px] font-bold text-crt-phosphor tracking-widest uppercase">
                HUD CALIBRATION DECK
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Minimize toggle */}
              <button
                type="button"
                onClick={() => setIsMinimized((m) => !m)}
                className="text-crt-phosphor/60 hover:text-white transition-colors cursor-pointer px-1 text-sm font-bold"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? "□" : "_"}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-crt-phosphor/60 hover:text-red-400 transition-colors cursor-pointer px-1 text-sm font-bold"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 border-b border-crt-phosphor/20 text-[11px] shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick(0.9);
                    setActiveTab("geometry");
                  }}
                  className={`py-2 text-center transition-colors cursor-pointer tracking-wider ${
                    activeTab === "geometry"
                      ? "bg-crt-phosphor/15 text-white font-bold border-b-2 border-crt-amber"
                      : "text-crt-phosphor/60 hover:text-white"
                  }`}
                >
                  POSISI & SIZE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick(0.9);
                    setActiveTab("labels");
                  }}
                  className={`py-2 text-center transition-colors cursor-pointer tracking-wider ${
                    activeTab === "labels"
                      ? "bg-crt-phosphor/15 text-white font-bold border-b-2 border-crt-amber"
                      : "text-crt-phosphor/60 hover:text-white"
                  }`}
                >
                  TEKS / LABELS
                </button>
              </div>

              {/* Scrollable Controls Body */}
              <div className="p-3.5 space-y-4 overflow-y-auto max-h-[58vh] no-scrollbar text-[11px]">
                {activeTab === "geometry" ? (
                  <div className="space-y-4">
                    {/* Section: Navbar Position & Spacing */}
                    <div className="space-y-2.5 bg-black/40 p-2.5 rounded-xs border border-crt-phosphor/15">
                      <div className="text-[10px] tracking-widest text-crt-amber font-bold uppercase">
                        ▲ NAVBAR SPACING
                      </div>

                      {/* Header Gap Left (Home <-> Timecode) */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Jarak Home ↔ Timecode:</span>
                          <span className="font-bold text-crt-phosphor">{config.headerGapLeft}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="250"
                          step="2"
                          value={config.headerGapLeft}
                          onChange={(e) => updateField("headerGapLeft", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>

                      {/* Header Gap Right (Nav Links Gutter) */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Jarak Antar Menu Nav:</span>
                          <span className="font-bold text-crt-phosphor">{config.headerGapRight}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="120"
                          step="2"
                          value={config.headerGapRight}
                          onChange={(e) => updateField("headerGapRight", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>

                      {/* Top Padding */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Padding Atas (Top):</span>
                          <span className="font-bold text-crt-phosphor">{config.headerPaddingTop}px</span>
                        </div>
                        <input
                          type="range"
                          min="12"
                          max="90"
                          step="2"
                          value={config.headerPaddingTop}
                          onChange={(e) => updateField("headerPaddingTop", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>

                      {/* Horizontal Padding */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Padding Samping (X):</span>
                          <span className="font-bold text-crt-phosphor">{config.headerPaddingX}px</span>
                        </div>
                        <input
                          type="range"
                          min="16"
                          max="100"
                          step="2"
                          value={config.headerPaddingX}
                          onChange={(e) => updateField("headerPaddingX", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>
                    </div>

                    {/* Section: Navbar Font Sizes */}
                    <div className="space-y-2.5 bg-black/40 p-2.5 rounded-xs border border-crt-phosphor/15">
                      <div className="text-[10px] tracking-widest text-crt-amber font-bold uppercase">
                        A FONT SIZES (NAVBAR)
                      </div>

                      {/* Center Brand Font Size */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Ukuran Logo Tengah:</span>
                          <span className="font-bold text-crt-phosphor">{config.brandFontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="16"
                          max="48"
                          step="1"
                          value={config.brandFontSize}
                          onChange={(e) => updateField("brandFontSize", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>

                      {/* Nav Links Font Size */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Ukuran Teks Menu:</span>
                          <span className="font-bold text-crt-phosphor">{config.navFontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="9"
                          max="18"
                          step="1"
                          value={config.navFontSize}
                          onChange={(e) => updateField("navFontSize", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>

                      {/* Timecode Font Size */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Ukuran Timecode:</span>
                          <span className="font-bold text-crt-phosphor">{config.timecodeFontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="9"
                          max="18"
                          step="1"
                          value={config.timecodeFontSize}
                          onChange={(e) => updateField("timecodeFontSize", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>
                    </div>

                    {/* Section: Footer Spacing & Size */}
                    <div className="space-y-2.5 bg-black/40 p-2.5 rounded-xs border border-crt-phosphor/15">
                      <div className="text-[10px] tracking-widest text-crt-amber font-bold uppercase">
                        ▼ FOOTER SPACING & SIZE
                      </div>

                      {/* Footer Bottom Padding */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Padding Bawah (Bottom):</span>
                          <span className="font-bold text-crt-phosphor">{config.footerPaddingBottom}px</span>
                        </div>
                        <input
                          type="range"
                          min="12"
                          max="90"
                          step="2"
                          value={config.footerPaddingBottom}
                          onChange={(e) => updateField("footerPaddingBottom", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>

                      {/* Footer Left Gap */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Jarak Item Kiri Footer:</span>
                          <span className="font-bold text-crt-phosphor">{config.footerGapLeft}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="60"
                          step="2"
                          value={config.footerGapLeft}
                          onChange={(e) => updateField("footerGapLeft", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>

                      {/* Footer Right Gap */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Jarak Item Kanan Footer:</span>
                          <span className="font-bold text-crt-phosphor">{config.footerGapRight}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="60"
                          step="2"
                          value={config.footerGapRight}
                          onChange={(e) => updateField("footerGapRight", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>

                      {/* Footer Font Size */}
                      <div>
                        <div className="flex justify-between text-crt-phosphor/80 mb-1">
                          <span>Ukuran Font Footer:</span>
                          <span className="font-bold text-crt-phosphor">{config.footerFontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="9"
                          max="18"
                          step="1"
                          value={config.footerFontSize}
                          onChange={(e) => updateField("footerFontSize", Number(e.target.value))}
                          className="w-full accent-crt-amber cursor-pointer h-1.5 bg-black/60 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Labels Tab */
                  <div className="space-y-3">
                    <div>
                      <label className="block text-crt-phosphor/70 mb-1">Tombol Home:</label>
                      <input
                        type="text"
                        value={config.navHome}
                        onChange={(e) => updateField("navHome", e.target.value)}
                        className="w-full bg-black/70 border border-crt-phosphor/30 rounded-xs px-2 py-1 text-white focus:outline-none focus:border-crt-amber"
                      />
                    </div>

                    <div>
                      <label className="block text-crt-phosphor/70 mb-1">Tombol Back (Reels):</label>
                      <input
                        type="text"
                        value={config.navReels}
                        onChange={(e) => updateField("navReels", e.target.value)}
                        className="w-full bg-black/70 border border-crt-phosphor/30 rounded-xs px-2 py-1 text-white focus:outline-none focus:border-crt-amber"
                      />
                    </div>

                    <div>
                      <label className="block text-crt-phosphor/70 mb-1">Teks Brand Tengah:</label>
                      <input
                        type="text"
                        value={config.brandText}
                        onChange={(e) => updateField("brandText", e.target.value)}
                        className="w-full bg-black/70 border border-crt-phosphor/30 rounded-xs px-2 py-1 text-white focus:outline-none focus:border-crt-amber"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-crt-phosphor/70 mb-1">Nav 1:</label>
                        <input
                          type="text"
                          value={config.navProfile}
                          onChange={(e) => updateField("navProfile", e.target.value)}
                          className="w-full bg-black/70 border border-crt-phosphor/30 rounded-xs px-2 py-1 text-white focus:outline-none focus:border-crt-amber"
                        />
                      </div>
                      <div>
                        <label className="block text-crt-phosphor/70 mb-1">Nav 2:</label>
                        <input
                          type="text"
                          value={config.navArchive}
                          onChange={(e) => updateField("navArchive", e.target.value)}
                          className="w-full bg-black/70 border border-crt-phosphor/30 rounded-xs px-2 py-1 text-white focus:outline-none focus:border-crt-amber"
                        />
                      </div>
                      <div>
                        <label className="block text-crt-phosphor/70 mb-1">Nav 3:</label>
                        <input
                          type="text"
                          value={config.navContact}
                          onChange={(e) => updateField("navContact", e.target.value)}
                          className="w-full bg-black/70 border border-crt-phosphor/30 rounded-xs px-2 py-1 text-white focus:outline-none focus:border-crt-amber"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-crt-phosphor/20 space-y-3">
                      <div>
                        <label className="block text-crt-phosphor/70 mb-1">Footer Source Label:</label>
                        <input
                          type="text"
                          value={config.footerSource}
                          onChange={(e) => updateField("footerSource", e.target.value)}
                          className="w-full bg-black/70 border border-crt-phosphor/30 rounded-xs px-2 py-1 text-white focus:outline-none focus:border-crt-amber"
                        />
                      </div>

                      <div>
                        <label className="block text-crt-phosphor/70 mb-1">Footer Email Label:</label>
                        <input
                          type="text"
                          value={config.footerEmailLabel}
                          onChange={(e) => updateField("footerEmailLabel", e.target.value)}
                          className="w-full bg-black/70 border border-crt-phosphor/30 rounded-xs px-2 py-1 text-white focus:outline-none focus:border-crt-amber"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-[#121216] border-t border-crt-phosphor/20 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 text-[10px] text-crt-phosphor/60 hover:text-white border border-crt-phosphor/20 hover:border-crt-phosphor/50 rounded-xs transition-colors cursor-pointer"
                  title="Kembalikan ke settingan awal"
                >
                  RESET
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex-1 py-1 px-3 text-[11px] font-bold tracking-wider rounded-xs transition-all cursor-pointer shadow flex items-center justify-center gap-1.5 ${
                    copied
                      ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                      : "bg-crt-phosphor text-black hover:bg-white"
                  }`}
                  title="Copy semua posisi dan teks untuk ditempelkan ke chat AI"
                >
                  {copied ? "[ ✓ COPIED TO CLIPBOARD! ]" : "[ 📋 COPAS POSISI & TEKS ]"}
                </button>
              </div>
            </>
          )}
        </aside>
      )}
    </>
  );
}
