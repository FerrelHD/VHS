"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { TAPE_PROJECTS, TapeProject } from "@/data/tapes";
import { CrtGlass } from "@/components/crt/CrtGlass";
import { CrtGlitchBurst } from "@/components/crt/CrtGlitchBurst";
import { AppHeader, ActiveSection } from "@/components/hud/AppHeader";
import { AppFooter } from "@/components/hud/AppFooter";
import { TapeSubtitle } from "@/components/hud/TapeSubtitle";
import { WorkDetailView } from "@/components/work/WorkDetailView";
import { ArchiveView } from "@/components/hud/ArchiveView";
import { NewsView } from "@/components/hud/NewsView";
import { ContactView } from "@/components/hud/ContactView";
import { VhsLoader } from "@/components/hud/VhsLoader";
import { audio } from "@/lib/audio";

// Client-only dynamic import for the WebGL Three.js Canvas to guarantee zero SSR hydration errors
const TapeDeck = dynamic(
  () => import("@/components/deck/TapeDeck").then((mod) => mod.TapeDeck),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeView, setActiveView] = useState<ActiveSection>("deck");
  const [isGlitching, setIsGlitching] = useState(false);

  // Entrance & Loading state choreography:
  // 1. HUD (header & footer) reveals
  // 2. 3D Card project carousel glides up smoothly into place
  // 3. Center project subtitle smoothly slides up AFTER cards appear
  const [isReady, setIsReady] = useState(false);
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [textIntroStarted, setTextIntroStarted] = useState(false);
  const [cardsIntroStarted, setCardsIntroStarted] = useState(false);
  const [subtitleIntroStarted, setSubtitleIntroStarted] = useState(false);

  const cardsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const glitchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback safety: ensure ready within 1.2s even if canvas takes a beat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDeckReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const handleLoaderStartOut = useCallback(() => {
    // 1. HUD header/footer starts revealing as loader begins dissolving
    setTextIntroStarted(true);

    // 2. 3D Card carousel entrance launches smoothly after a gentle 180ms beat
    if (cardsTimerRef.current) clearTimeout(cardsTimerRef.current);
    cardsTimerRef.current = setTimeout(() => {
      setCardsIntroStarted(true);
    }, 180);
  }, []);

  // Called directly from WebGL frame-loop when cards reach their resting position
  const handleCardsEntered = useCallback(() => {
    setSubtitleIntroStarted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (cardsTimerRef.current) clearTimeout(cardsTimerRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, []);

  const handleLoaderDone = useCallback(() => {
    setIsLoaderFinished(true);
  }, []);

  const handleIndexChange = useCallback((idx: number) => {
    setCurrentIndex(idx);
  }, []);

  /**
   * Universal CRT view switcher with signal glitch and static sound burst.
   */
  const transitionToView = useCallback((next: ActiveSection) => {
    if (next === activeView) return;

    audio.playGlitch();
    setIsGlitching(true);
    setActiveView(next);

    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    glitchTimerRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, 300);
  }, [activeView]);

  const handleOpenProject = useCallback((_tape: TapeProject) => {
    transitionToView("work");
  }, [transitionToView]);

  const handleBackToCarousel = useCallback(() => {
    transitionToView("deck");
  }, [transitionToView]);

  const handleNextProject = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TAPE_PROJECTS.length);
  }, []);

  const handleSelectFromArchive = useCallback((idx: number) => {
    setCurrentIndex(idx);
    transitionToView("work");
  }, [transitionToView]);

  // Keyboard shortcut: Space or Enter opens active project if in carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView === "deck" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        transitionToView("work");
      } else if (activeView !== "deck" && e.key === "Escape") {
        transitionToView("deck");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView, transitionToView]);

  const currentTape = TAPE_PROJECTS[currentIndex] || TAPE_PROJECTS[0];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050505] select-none font-mono">
      <CrtGlass>
        {/* Layer 0: Authentic VHS CRT Loading Screen */}
        {!isLoaderFinished && (
          <VhsLoader
            ready={isReady}
            onStartOut={handleLoaderStartOut}
            onDone={handleLoaderDone}
          />
        )}

        {/* Layer 0b: CRT Signal Glitch Transition Burst */}
        <CrtGlitchBurst active={isGlitching} />

        {/* Layer 1: 3D Cylindrical Tape Deck (Only visible in deck view) */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 z-10 ${
            activeView === "deck"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <TapeDeck
            currentIndex={currentIndex}
            onIndexChange={handleIndexChange}
            onOpenProject={handleOpenProject}
            intro={cardsIntroStarted}
            onReady={handleDeckReady}
            onCardsEntered={handleCardsEntered}
          />
        </div>

        {/* Layer 2: Fixed Header across all views (Calibrated to 56px top, 100px padding-x) */}
        <div className="absolute top-0 left-0 right-0 z-40 pt-[clamp(32px,5.2vh,56px)] px-[clamp(28px,7vw,100px)] pointer-events-none">
          <AppHeader
            activeView={activeView}
            intro={textIntroStarted}
            onHomeClick={handleBackToCarousel}
            onArchiveClick={() =>
              transitionToView(activeView === "archive" ? "deck" : "archive")
            }
            onNewsClick={() =>
              transitionToView(activeView === "news" ? "deck" : "news")
            }
            onContactClick={() =>
              transitionToView(activeView === "contact" ? "deck" : "contact")
            }
          />
        </div>

        {/* Layer 3: Main Active Views */}
        {/* 3a. Reel Carousel Subtitle (When in Deck mode) */}
        {activeView === "deck" && (
          <div className="absolute bottom-[calc(var(--pad-y)+44px)] left-0 right-0 z-30 flex justify-center pointer-events-auto">
            <TapeSubtitle
              tape={currentTape}
              intro={subtitleIntroStarted}
              onOpen={() => handleOpenProject(currentTape)}
            />
          </div>
        )}

        {/* 3b. Work Detail Exhibition Gallery (Spanning full chamber) */}
        {activeView === "work" && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            <WorkDetailView
              tape={currentTape}
              onBack={handleBackToCarousel}
              onNextProject={handleNextProject}
            />
          </div>
        )}

        {/* 3c. Archive / Braindance Shards View (Unboxed, full chamber) */}
        {activeView === "archive" && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            <ArchiveView
              onBack={handleBackToCarousel}
              onSelectProject={handleSelectFromArchive}
            />
          </div>
        )}

        {/* 3e. News Watch / N54 Broadcast View (Unboxed, full chamber) */}
        {activeView === "news" && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            <NewsView onBack={handleBackToCarousel} />
          </div>
        )}

        {/* 3f. Contact / Original Creators Credits View (Unboxed, full chamber) */}
        {(activeView === "contact" || activeView === "credits") && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            <ContactView onBack={handleBackToCarousel} />
          </div>
        )}

        {/* Layer 4: Fixed Footer across all views */}
        <div className="absolute bottom-0 left-0 right-0 z-40 pb-[clamp(32px,5.5vh,60px)] px-[clamp(28px,7vw,100px)] pointer-events-auto">
          <AppFooter intro={textIntroStarted} />
        </div>
      </CrtGlass>
    </main>
  );
}
