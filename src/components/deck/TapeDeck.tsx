"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { TAPE_PROJECTS, TapeProject } from "@/data/tapes";
import { VHS_METRICS, expDecay } from "@/lib/math";
import { audio } from "@/lib/audio";
import { TapeMesh } from "./TapeMesh";
import { BentPostProcessing } from "./BentPostProcessing";

interface TapeDeckProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onOpenProject: (tape: TapeProject) => void;
}

function TapeCarousel({
  targetOffset,
  currentIndex,
  onSelectTape,
}: {
  targetOffset: number;
  currentIndex: number;
  onSelectTape: (index: number) => void;
}) {
  const currentOffsetRef = useRef(0);
  const [, setRerender] = useState(0);

  useFrame((_, delta) => {
    const dt = Math.min(0.1, delta);
    const prev = currentOffsetRef.current;
    const next = expDecay(prev, targetOffset, 14, dt);

    if (Math.abs(next - prev) > 0.05) {
      currentOffsetRef.current = next;
      setRerender((v) => v + 1);
    }
  });

  const activeOffset = currentOffsetRef.current;

  return (
    <group position={[0, 28, 0]}>
      {/* Lighting setup: Phosphor tube fill + Key directional light */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[0, 180, 420]} intensity={2.0} castShadow />
      <pointLight position={[0, 20, 220]} intensity={1.0} color="#ece9e1" distance={650} />

      {TAPE_PROJECTS.map((tape, idx) => {
        const tapeLinearPos = idx * VHS_METRICS.SLOT_SPACING;
        const offset = tapeLinearPos - activeOffset;

        if (Math.abs(offset) > VHS_METRICS.SLOT_SPACING * 3.8) {
          return null;
        }

        return (
          <TapeMesh
            key={tape.id}
            tape={tape}
            offset={offset}
            isSelected={idx === currentIndex}
            onSelect={() => onSelectTape(idx)}
          />
        );
      })}
    </group>
  );
}

export function TapeDeck({ currentIndex, onIndexChange, onOpenProject }: TapeDeckProps) {
  const [targetOffset, setTargetOffset] = useState(currentIndex * VHS_METRICS.SLOT_SPACING);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);

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

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      offset: targetOffset,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
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
