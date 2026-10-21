"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { TAPE_PROJECTS, TapeProject } from "@/data/tapes";
import { CrtGlass } from "@/components/crt/CrtGlass";
import { AppHeader } from "@/components/hud/AppHeader";
import { AppFooter } from "@/components/hud/AppFooter";
import { TapeSubtitle } from "@/components/hud/TapeSubtitle";
import { WorkDetailView } from "@/components/work/WorkDetailView";
import { ProfileModal } from "@/components/hud/ProfileModal";
import { ArchiveModal } from "@/components/hud/ArchiveModal";
import { ContactModal } from "@/components/hud/ContactModal";
import { useCrtBend } from "@/lib/useCrtBend";
import { audio } from "@/lib/audio";

// Client-only dynamic import for the WebGL Three.js Canvas to guarantee zero SSR hydration errors
const TapeDeck = dynamic(
  () => import("@/components/deck/TapeDeck").then((mod) => mod.TapeDeck),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-crt-phosphor/40 gap-2">
        <span className="w-3 h-3 border-2 border-crt-phosphor/20 border-t-crt-phosphor animate-spin rounded-full" />
        <span className="tracking-widest uppercase">// INITIALIZING CRT OPTICS //</span>
      </div>
    ),
  }
);

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Single permanent stage ref for subtle optical curvature on all HTML text & UI
  const bentUiRef = useCrtBend<HTMLDivElement>();

  const handleIndexChange = useCallback((idx: number) => {
    setCurrentIndex(idx);
  }, []);

  const handleOpenProject = useCallback((tape: TapeProject) => {
    audio.playClick(1.2);
    setIsDetailView(true);
  }, []);

  const handleBackToCarousel = useCallback(() => {
    audio.playClick(0.9);
    setIsDetailView(false);
    setIsProfileOpen(false);
    setIsArchiveOpen(false);
    setIsContactOpen(false);
  }, []);

  const handleNextProject = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TAPE_PROJECTS.length);
  }, []);

  const handleSelectFromArchive = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setIsDetailView(true);
  }, []);

  // Keyboard shortcut: Space or Enter opens active project if in carousel and modals are closed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const anyModalOpen = isProfileOpen || isArchiveOpen || isContactOpen;
      if (!isDetailView && !anyModalOpen && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setIsDetailView(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailView, isProfileOpen, isArchiveOpen, isContactOpen]);

  const currentTape = TAPE_PROJECTS[currentIndex] || TAPE_PROJECTS[0];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050505] select-none font-mono">
      <CrtGlass>
        {/* Layer 1: 3D Cylindrical Tape Deck (Only rendered in carousel mode) */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            isDetailView ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <TapeDeck
            currentIndex={currentIndex}
            onIndexChange={handleIndexChange}
            onOpenProject={handleOpenProject}
          />
        </div>

        {/* Layer 2: Single Permanent Phosphor UI Stage (Generous breathing room & padding) */}
        <div
          ref={bentUiRef}
          className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between px-10 sm:px-16 md:px-20 pt-8 sm:pt-9 pb-8 sm:pb-9 overflow-hidden"
        >
          {/* Header (Top) */}
          <div className="pointer-events-auto w-full">
            <AppHeader
              isDetailView={isDetailView}
              onHomeClick={handleBackToCarousel}
              onProfileClick={() => setIsProfileOpen(true)}
              onArchiveClick={() => setIsArchiveOpen(true)}
              onContactClick={() => setIsContactOpen(true)}
            />
          </div>

          {/* Middle Stage: Subtitle below tape OR Full-Height Horizontal Exhibition */}
          <div
            className={`pointer-events-auto w-full h-full flex flex-col overflow-hidden my-auto ${
              !isDetailView ? "justify-end pb-3 sm:pb-6" : "justify-center"
            }`}
          >
            {!isDetailView ? (
              <div className="self-center">
                <TapeSubtitle
                  tape={currentTape}
                  onOpen={() => handleOpenProject(currentTape)}
                />
              </div>
            ) : (
              <WorkDetailView
                tape={currentTape}
                onBack={handleBackToCarousel}
                onNextProject={handleNextProject}
              />
            )}
          </div>

          {/* Footer (Bottom) */}
          <div className="pointer-events-auto w-full">
            <AppFooter />
          </div>

          {/* Overlays / Modals (Rendered inside CRT Phosphor chamber) */}
          <div className="pointer-events-auto">
            <ProfileModal
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
            <ArchiveModal
              isOpen={isArchiveOpen}
              onClose={() => setIsArchiveOpen(false)}
              onSelectProject={handleSelectFromArchive}
            />
            <ContactModal
              isOpen={isContactOpen}
              onClose={() => setIsContactOpen(false)}
            />
          </div>
        </div>
      </CrtGlass>
    </main>
  );
}
