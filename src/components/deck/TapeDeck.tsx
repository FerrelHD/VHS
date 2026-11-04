"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { TAPE_PROJECTS, TapeProject } from "@/data/tapes";
import { VHS_METRICS, expDecay } from "@/lib/math";
import { audio } from "@/lib/audio";
import { TapeMesh, CarouselSharedState } from "./TapeMesh";
import { BentPostProcessing } from "./BentPostProcessing";

interface TapeDeckProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onOpenProject: (tape: TapeProject) => void;
  intro?: boolean;
  onReady?: () => void;
  onCardsEntered?: () => void;
  active?: boolean;
}

function TapeCarousel({
  targetOffsetRef,
  currentIndex,
  onSelectTape,
  onSlotCrossed,
  intro = true,
  mouseRef,
  isDraggingRef,
  onCardsEntered,
}: {
  targetOffsetRef: React.RefObject<number>;
  currentIndex: number;
  onSelectTape: (index: number) => void;
  onSlotCrossed?: (index: number) => void;
  intro?: boolean;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDraggingRef: React.RefObject<boolean>;
  onCardsEntered?: () => void;
}) {
  const sharedStateRef = useRef<CarouselSharedState>({
    currentOffset: currentIndex * VHS_METRICS.SLOT_SPACING,
    enterProgress: 0,
    velocity: 0,
    squash: 0,
    tilt: { x: 0, y: 0 },
  });

  const prevOffsetRef = useRef(currentIndex * VHS_METRICS.SLOT_SPACING);
  const enteredCalledRef = useRef(false);
  const lastSlotRef = useRef(currentIndex);

  useFrame((_, delta) => {
    const dt = Math.min(0.1, delta);
    const state = sharedStateRef.current;

    // 1. Enter progress (Smooth 0.85s physical glide)
    if (intro) {
      state.enterProgress = Math.min(1, state.enterProgress + dt / 0.85);
      if (state.enterProgress >= 0.92 && !enteredCalledRef.current) {
        enteredCalledRef.current = true;
        setTimeout(() => onCardsEntered?.(), 0);
      }
    } else {
      state.enterProgress = 0;
      enteredCalledRef.current = false;
    }

    // 2. Position exponential decay & physics tracking
    const targetOffset = targetOffsetRef.current ?? 0;
    const prev = state.currentOffset;
    const next = expDecay(prev, targetOffset, isDraggingRef.current ? 26 : 14, dt);
    state.currentOffset = next;

    // 3. Velocity tracking
    const rawVel = dt > 0 ? (next - prevOffsetRef.current) / dt : 0;
    prevOffsetRef.current = next;
    state.velocity = expDecay(state.velocity, rawVel, 10, dt);

    // 4. Dynamic squash & depth compression during fast spin
    const targetSquash = Math.min(1, Math.abs(state.velocity) / 2400 + (isDraggingRef.current ? 0.2 : 0));
    state.squash = expDecay(state.squash, targetSquash, targetSquash > state.squash ? 8 : 3.5, dt);

    // 5. Mouse Parallax Tilt
    const targetMouse = mouseRef.current || { x: 0, y: 0 };
    state.tilt.x = expDecay(state.tilt.x, targetMouse.x, 2.5, dt);
    state.tilt.y = expDecay(state.tilt.y, targetMouse.y, 2.5, dt);

    // 6. Slot traversal check for tactile clicks and subtitle updates
    const N = TAPE_PROJECTS.length;
    const approxSlot = Math.round(next / VHS_METRICS.SLOT_SPACING);
    const approxIndex = ((approxSlot % N) + N) % N;
    if (approxIndex !== lastSlotRef.current) {
      lastSlotRef.current = approxIndex;
      onSlotCrossed?.(approxIndex);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Authentic CRT Studio Lighting */}
      <ambientLight intensity={0.65} color="#ece9e1" />
      <directionalLight position={[0, 220, 420]} intensity={2.2} color="#ffffff" />
      <pointLight position={[0, 50, 260]} intensity={1.2} color="#f5f0e6" distance={750} />
      <pointLight position={[0, -160, -100]} intensity={0.5} color="#38bdf8" distance={600} />

      {TAPE_PROJECTS.map((tape, idx) => (
        <TapeMesh
          key={tape.id}
          tape={tape}
          index={idx}
          isSelected={idx === currentIndex}
          onSelect={() => onSelectTape(idx)}
          stateRef={sharedStateRef}
        />
      ))}
    </group>
  );
}

/**
 * Dynamically adjusts 3D camera depth based on viewport aspect ratio.
 * On narrow portrait mobile screens, pulls camera back slightly to keep the active
 * cassette beautifully framed while peeking adjacent cards on both edges.
 */
function ResponsiveDeckCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    if (aspect < 1) {
      const targetZ = Math.min(840, Math.max(620, 620 / Math.max(0.68, aspect * 1.35)));
      camera.position.set(0, 10, targetZ);
      camera.updateProjectionMatrix();
    } else {
      camera.position.set(0, 0, 620);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  return null;
}

export function TapeDeck({
  currentIndex,
  onIndexChange,
  onOpenProject,
  intro = true,
  onReady,
  onCardsEntered,
  active = true,
}: TapeDeckProps) {
  const targetOffsetRef = useRef(currentIndex * VHS_METRICS.SLOT_SPACING);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, time: 0, offset: 0 });
  const dragVelocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const snapToSlot = useCallback(
    (slot: number) => {
      const N = TAPE_PROJECTS.length;
      const newOffset = slot * VHS_METRICS.SLOT_SPACING;
      const normalizedIndex = ((slot % N) + N) % N;
      targetOffsetRef.current = newOffset;
      onIndexChange(normalizedIndex);
      audio.playSnap();
    },
    [onIndexChange]
  );

  // Sync external index changes (shortest circular path)
  useEffect(() => {
    const N = TAPE_PROJECTS.length;
    const currentSlot = Math.round(targetOffsetRef.current / VHS_METRICS.SLOT_SPACING);
    const currentNorm = ((currentSlot % N) + N) % N;
    let diff = currentIndex - currentNorm;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    if (diff !== 0) {
      targetOffsetRef.current = (currentSlot + diff) * VHS_METRICS.SLOT_SPACING;
    }
  }, [currentIndex]);

  // Keyboard navigation (Endless Left / Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const currentSlot = Math.round(targetOffsetRef.current / VHS_METRICS.SLOT_SPACING);
        snapToSlot(currentSlot - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const currentSlot = Math.round(targetOffsetRef.current / VHS_METRICS.SLOT_SPACING);
        snapToSlot(currentSlot + 1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpenProject(TAPE_PROJECTS[currentIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, snapToSlot, onOpenProject]);

  // Mouse Wheel navigation on the 3D Carousel (Infinite Looping)
  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 25) return;
    if (wheelLockRef.current) return;

    wheelLockRef.current = true;
    const currentSlot = Math.round(targetOffsetRef.current / VHS_METRICS.SLOT_SPACING);
    if (delta > 0) {
      snapToSlot(currentSlot + 1);
    } else {
      snapToSlot(currentSlot - 1);
    }

    setTimeout(() => {
      wheelLockRef.current = false;
    }, 240);
  };

  // Pointer drag interactions & Mouse Parallax Tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    const now = performance.now();
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      time: now,
      offset: targetOffsetRef.current,
    };
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
    dragVelocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // 1. Update normalized mouse coordinates for 3D parallax tilt [-1, 1]
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      };
    }

    // 2. Continuous drag physics (0 React re-renders during motion)
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;

    // Instant velocity in px/sec with smoothing
    const instantVelocity = (-dx / dt) * 1000;
    dragVelocityRef.current = 0.55 * dragVelocityRef.current + 0.45 * instantVelocity;

    const totalDx = e.clientX - dragStartRef.current.x;
    targetOffsetRef.current = dragStartRef.current.offset - totalDx * 1.18;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Apply luxurious momentum fling based on release speed (Arc Marumo physics)
    const fling = Math.max(-3600, Math.min(3600, dragVelocityRef.current * 0.26));
    const projectedOffset = targetOffsetRef.current + fling;
    const targetSlot = Math.round(projectedOffset / VHS_METRICS.SLOT_SPACING);
    snapToSlot(targetSlot);
  };

  const handleSelectTape = useCallback(
    (idx: number) => {
      const N = TAPE_PROJECTS.length;
      const currentSlot = Math.round(targetOffsetRef.current / VHS_METRICS.SLOT_SPACING);
      const currentNorm = ((currentSlot % N) + N) % N;
      let diff = idx - currentNorm;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      const targetSlot = currentSlot + diff;

      if (diff === 0) {
        onOpenProject(TAPE_PROJECTS[idx]);
      } else {
        snapToSlot(targetSlot);
      }
    },
    [onOpenProject, snapToSlot]
  );

  const handleSlotCrossed = useCallback(
    (normalizedIndex: number) => {
      onIndexChange(normalizedIndex);
      audio.playClick(0.65);
    },
    [onIndexChange]
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 620], fov: 38, near: 10, far: 3000 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.35]}
        frameloop={active ? "always" : "never"}
      >
        <ResponsiveDeckCamera />
        <TapeCarousel
          targetOffsetRef={targetOffsetRef}
          currentIndex={currentIndex}
          intro={intro}
          mouseRef={mouseRef}
          isDraggingRef={isDraggingRef}
          onSelectTape={handleSelectTape}
          onSlotCrossed={handleSlotCrossed}
          onCardsEntered={onCardsEntered}
        />

        {/* The CRT Optical Barrel Distortion Post-Processing Pass */}
        <BentPostProcessing paused={!active} />
      </Canvas>
    </div>
  );
}
