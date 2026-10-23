"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { TAPE_PROJECTS, TapeProject } from "@/data/tapes";
import { CrtGlass } from "@/components/crt/CrtGlass";
import { AppHeader, ActiveSection } from "@/components/hud/AppHeader";
import { AppFooter } from "@/components/hud/AppFooter";
import { TapeSubtitle } from "@/components/hud/TapeSubtitle";
import { WorkDetailView } from "@/components/work/WorkDetailView";
import { ProfileView } from "@/components/hud/ProfileView";
import { ArchiveView } from "@/components/hud/ArchiveView";
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

  // Entrance & Loading state choreography (100% Arc Marumo authentic)
  const [isReady, setIsReady] = useState(false);
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);

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

  const handleLoaderDone = useCallback(() => {
    setIsLoaderFinished(true);
  }, []);

  // Trigger entrance animation once ready
  useEffect(() => {
    if (isReady) {
      const t = setTimeout(() => {
        setIntroStarted(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isReady]);

  const handleIndexChange = useCallback((idx: number) => {
    setCurrentIndex(idx);
  }, []);

  const handleOpenProject = useCallback((tape: TapeProject) => {
    audio.playClick(1.2);
    setActiveView("work");
  }, []);

  const handleBackToCarousel = useCallback(() => {
    audio.playClick(0.9);
    setActiveView("deck");
  }, []);

  const handleNextProject = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TAPE_PROJECTS.length);
  }, []);

  const handleSelectFromArchive = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setActiveView("work");
  }, []);

  // Keyboard shortcut: Space or Enter opens active project if in carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView === "deck" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setActiveView("work");
      } else if (activeView !== "deck" && e.key === "Escape") {
        setActiveView("deck");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView]);

  const currentTape = TAPE_PROJECTS[currentIndex] || TAPE_PROJECTS[0];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050505] select-none font-mono">
      <CrtGlass>
        {/* Layer 0: Authentic VHS CRT Loading Screen */}
        {!isLoaderFinished && (
          <VhsLoader ready={isReady} onDone={handleLoaderDone} />
        )}

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
            intro={introStarted}
            onReady={handleDeckReady}
          />
        </div>

        {/* Layer 2: Fixed Header across all views (Calibrated to 56px top, 100px padding-x) */}
        <div className="absolute top-0 left-0 right-0 z-40 pt-[clamp(32px,5.2vh,56px)] px-[clamp(28px,7vw,100px)] pointer-events-auto">
          <AppHeader
            activeView={activeView}
            intro={introStarted}
            onHomeClick={handleBackToCarousel}
            onProfileClick={() =>
              setActiveView((prev) => (prev === "profile" ? "deck" : "profile"))
            }
            onArchiveClick={() =>
              setActiveView((prev) => (prev === "archive" ? "deck" : "archive"))
            }
            onContactClick={() =>
              setActiveView((prev) => (prev === "contact" ? "deck" : "contact"))
            }
          />
        </div>

        {/* Layer 3: Main Active Views */}
        {/* 3a. Reel Carousel Subtitle (When in Deck mode) */}
        {activeView === "deck" && (
          <div className="absolute bottom-[calc(var(--pad-y)+44px)] left-0 right-0 z-30 flex justify-center pointer-events-auto">
            <TapeSubtitle
              tape={currentTape}
              intro={introStarted}
              onOpen={() => handleOpenProject(currentTape)}
            />
          </div>
        )}

        {/* 3b. Work Detail Exhibition Gallery (Spanning full chamber with calculated margins) */}
        {activeView === "work" && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            <WorkDetailView
              tape={currentTape}
              onBack={handleBackToCarousel}
              onNextProject={handleNextProject}
            />
          </div>
        )}

        {/* 3c. Profile Biography View */}
        {activeView === "profile" && (
          <div className="absolute inset-0 z-20 pointer-events-auto flex items-center justify-center px-[var(--pad-x)] pt-[var(--pj-top)] pb-[var(--pj-bottom)]">
            <ProfileView onBack={handleBackToCarousel} />
          </div>
        )}

        {/* 3d. Archive Matrix View */}
        {activeView === "archive" && (
          <div className="absolute inset-0 z-20 pointer-events-auto flex items-center justify-center px-[var(--pad-x)] pt-[var(--pj-top)] pb-[var(--pj-bottom)]">
            <ArchiveView
              onBack={handleBackToCarousel}
              onSelectProject={handleSelectFromArchive}
            />
          </div>
        )}

        {/* 3e. Direct Contact View */}
        {activeView === "contact" && (
          <div className="absolute inset-0 z-20 pointer-events-auto flex items-center justify-center px-[var(--pad-x)] pt-[var(--pj-top)] pb-[var(--pj-bottom)]">
            <ContactView onBack={handleBackToCarousel} />
          </div>
        )}

        {/* Layer 4: Fixed Footer across all views (Calibrated to 60px bottom, 100px padding-x matching navbar) */}
        <div className="absolute bottom-0 left-0 right-0 z-40 pb-[clamp(32px,5.5vh,60px)] px-[clamp(28px,7vw,100px)] pointer-events-auto">
          <AppFooter intro={introStarted} />
        </div>
      </CrtGlass>
    </main>
  );
}
