"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
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
}

function TapeCarousel({
  targetOffset,
  currentIndex,
  onSelectTape,
  intro = true,
  mouseRef,
  isDraggingRef,
}: {
  targetOffset: number;
  currentIndex: number;
  onSelectTape: (index: number) => void;
  intro?: boolean;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDraggingRef: React.RefObject<boolean>;
}) {
  const sharedStateRef = useRef<CarouselSharedState>({
    currentOffset: currentIndex * VHS_METRICS.SLOT_SPACING,
    enterProgress: 0,
    velocity: 0,
    squash: 0,
    tilt: { x: 0, y: 0 },
  });

  const prevOffsetRef = useRef(currentIndex * VHS_METRICS.SLOT_SPACING);

  useFrame((_, delta) => {
    const dt = Math.min(0.1, delta);
    const state = sharedStateRef.current;

    // 1. Enter progress (Staggered swoop entrance curve)
    if (intro) {
      state.enterProgress = Math.min(1, state.enterProgress + dt / 1.5);
    } else {
      state.enterProgress = 0;
    }

    // 2. Position exponential decay
    const prev = state.currentOffset;
    const next = expDecay(prev, targetOffset, isDraggingRef.current ? 22 : 14, dt);
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
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Authentic CRT Studio Lighting */}
      <ambientLight intensity={0.65} color="#ece9e1" />
      <directionalLight position={[0, 220, 420]} intensity={2.2} castShadow color="#ffffff" />
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

export function TapeDeck({
  currentIndex,
  onIndexChange,
  onOpenProject,
  intro = true,
  onReady,
}: TapeDeckProps) {
  const [targetOffset, setTargetOffset] = useState(currentIndex * VHS_METRICS.SLOT_SPACING);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const snapToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(TAPE_PROJECTS.length - 1, index));
      const newOffset = clamped * VHS_METRICS.SLOT_SPACING;
      setTargetOffset(newOffset);
      onIndexChange(clamped);
      audio.playSnap();
    },
    [onIndexChange]
  );

  // Sync external index changes
  useEffect(() => {
    setTargetOffset(currentIndex * VHS_METRICS.SLOT_SPACING);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        snapToIndex(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        snapToIndex(currentIndex + 1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpenProject(TAPE_PROJECTS[currentIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, snapToIndex, onOpenProject]);

  // Mouse Wheel navigation on the 3D Carousel
  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 25) return;
    if (wheelLockRef.current) return;

    wheelLockRef.current = true;
    if (delta > 0) {
      snapToIndex(currentIndex + 1);
    } else {
      snapToIndex(currentIndex - 1);
    }

    setTimeout(() => {
      wheelLockRef.current = false;
    }, 280);
  };

  // Pointer drag interactions & Mouse Parallax Tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      offset: targetOffset,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // 1. Always update normalized mouse coordinates for 3D parallax tilt [-1, 1]
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      };
    }

    // 2. Drag physics
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const nextOffset = dragStartRef.current.offset - dx * 1.15;

    const minOffset = -VHS_METRICS.SLOT_SPACING * 0.4;
    const maxOffset = (TAPE_PROJECTS.length - 1 + 0.4) * VHS_METRICS.SLOT_SPACING;
    const clamped = Math.max(minOffset, Math.min(maxOffset, nextOffset));

    setTargetOffset(clamped);

    const approxIndex = Math.max(
      0,
      Math.min(
        TAPE_PROJECTS.length - 1,
        Math.round(clamped / VHS_METRICS.SLOT_SPACING)
      )
    );
    if (approxIndex !== currentIndex) {
      onIndexChange(approxIndex);
      audio.playClick();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    const nearestIndex = Math.max(
      0,
      Math.min(
        TAPE_PROJECTS.length - 1,
        Math.round(targetOffset / VHS_METRICS.SLOT_SPACING)
      )
    );
    snapToIndex(nearestIndex);
  };

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
        dpr={[1, 2]}
      >
        <TapeCarousel
          targetOffset={targetOffset}
          currentIndex={currentIndex}
          intro={intro}
          mouseRef={mouseRef}
          isDraggingRef={isDraggingRef}
          onSelectTape={(idx) => {
            if (idx === currentIndex) {
              onOpenProject(TAPE_PROJECTS[idx]);
            } else {
              snapToIndex(idx);
            }
          }}
        />

        {/* The CRT Optical Barrel Distortion Post-Processing Pass */}
        <BentPostProcessing />
      </Canvas>
    </div>
  );
}
