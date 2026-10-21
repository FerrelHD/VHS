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
import { useCrtBend } from "@/lib/useCrtBend";
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

  // Single permanent stage ref for subtle optical curvature on all HTML text & UI
  const bentUiRef = useCrtBend<HTMLDivElement>();

  // Fallback safety: ensure ready within 1.5s even if canvas takes a beat
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
      // Start text & 3D carousel reveal slightly before loader completely vanishes
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
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
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

        {/* Layer 2: Single Permanent Phosphor UI Stage (Always fitted strictly within CRT frame) */}
        <div
          ref={bentUiRef}
          className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between px-6 sm:px-12 md:px-16 pt-6 sm:pt-8 pb-6 sm:pb-8 overflow-hidden"
        >
          {/* Header (Top) */}
          <div className="pointer-events-auto w-full shrink-0">
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

          {/* Middle Stage: Subtitle below tape OR Full In-Screen Section Views (Never overflows or clips) */}
          <div
            className={`pointer-events-auto w-full flex-1 min-h-0 flex flex-col overflow-hidden my-2 sm:my-3 ${
              activeView === "deck" ? "justify-end pb-3 sm:pb-5" : "justify-center"
            }`}
          >
            {activeView === "deck" && (
              <div className="self-center">
                <TapeSubtitle
                  tape={currentTape}
                  intro={introStarted}
                  onOpen={() => handleOpenProject(currentTape)}
                />
              </div>
            )}

            {activeView === "work" && (
              <WorkDetailView
                tape={currentTape}
                onBack={handleBackToCarousel}
                onNextProject={handleNextProject}
              />
            )}

            {activeView === "profile" && (
              <ProfileView onBack={handleBackToCarousel} />
            )}

            {activeView === "archive" && (
              <ArchiveView
                onBack={handleBackToCarousel}
                onSelectProject={handleSelectFromArchive}
              />
            )}

            {activeView === "contact" && (
              <ContactView onBack={handleBackToCarousel} />
            )}
          </div>

          {/* Footer (Bottom) */}
          <div className="pointer-events-auto w-full shrink-0">
            <AppFooter intro={introStarted} />
          </div>
        </div>
      </CrtGlass>
    </main>
  );
}
