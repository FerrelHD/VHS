"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TapeProject } from "@/data/tapes";
import { onArc, VHS_METRICS } from "@/lib/math";

export interface CarouselSharedState {
  currentOffset: number;
  enterProgress: number;
  velocity: number;
  squash: number;
  tilt: { x: number; y: number };
}

interface TapeMeshProps {
  tape: TapeProject;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  stateRef: React.RefObject<CarouselSharedState>;
}

export type SleeveArchetype =
  | "editorial"
  | "cyber"
  | "swiss"
  | "expedition"
  | "arcade"
  | "eco";

export function getSleeveArchetype(tape: TapeProject): SleeveArchetype {
  if (tape.id === "araki-art" || tape.id === "ferrel-portfolio") return "editorial";
  if (tape.id === "tactiq" || tape.id === "stock-predictor") return "cyber";
  if (tape.id === "student-life" || tape.id === "fersya-shop") return "swiss";
  if (tape.id === "gunung-gede" || tape.id === "nusantara-observatory") return "expedition";
  if (tape.id === "street-rush") return "arcade";
  if (tape.id === "ecobite") return "eco";

  if (tape.categoryFilter === "ml") return "cyber";
  if (tape.categoryFilter === "games") return "arcade";
  if (tape.categoryFilter === "creative") return "editorial";
  return "swiss";
}

export function TapeMesh({ tape, index, isSelected, onSelect, stateRef }: TapeMeshProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const cassetteMeshRef = useRef<THREE.Mesh | null>(null);
  const currentPeekRef = useRef(isSelected ? VHS_METRICS.PEEK : VHS_METRICS.PEEK_IDLE);

  // Dynamic front cover material reference for phosphor lighting adjustments
  const frontMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const spineMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // 1. Load handcrafted sleeve textures (Front poster and spine)
  const { frontTexture, spineTexture } = useMemo(() => {
    if (typeof window === "undefined") {
      const empty = new THREE.Texture();
      return { frontTexture: empty, spineTexture: empty };
    }
    const loader = new THREE.TextureLoader();

    const front = loader.load(`/tapes/${tape.id}-front.webp`);
    front.colorSpace = THREE.SRGBColorSpace;
    front.anisotropy = 16;
    front.minFilter = THREE.LinearMipmapLinearFilter;
    front.magFilter = THREE.LinearFilter;
    front.generateMipmaps = true;

    const spine = loader.load(`/tapes/${tape.id}-spine.webp`);
    spine.colorSpace = THREE.SRGBColorSpace;
    spine.anisotropy = 16;
    spine.minFilter = THREE.LinearMipmapLinearFilter;
    spine.magFilter = THREE.LinearFilter;
    spine.generateMipmaps = true;

    return { frontTexture: front, spineTexture: spine };
  }, [tape.id]);

  // 2. Load authentic industrial VHS cassette textures (Smoky acrylic window, reel spoke hub, fluted grip ribs)
  const { cassetteFrontTex, cassetteRoughnessTex, cassetteTopTex } = useMemo(() => {
    if (typeof window === "undefined") {
      const empty = new THREE.Texture();
      return { cassetteFrontTex: empty, cassetteRoughnessTex: empty, cassetteTopTex: empty };
    }
    const loader = new THREE.TextureLoader();

    const cFront = loader.load("/tapes/vhs-cassette-front.webp");
    cFront.colorSpace = THREE.SRGBColorSpace;
    cFront.anisotropy = 16;
    cFront.minFilter = THREE.LinearMipmapLinearFilter;
    cFront.magFilter = THREE.LinearFilter;
    cFront.generateMipmaps = true;

    const cRough = loader.load("/tapes/vhs-cassette-roughness.webp");
    cRough.anisotropy = 8;
    cRough.minFilter = THREE.LinearMipmapLinearFilter;
    cRough.generateMipmaps = true;

    const cTop = loader.load("/tapes/vhs-cassette-top.webp");
    cTop.colorSpace = THREE.SRGBColorSpace;
    cTop.anisotropy = 16;
    cTop.minFilter = THREE.LinearMipmapLinearFilter;
    cTop.magFilter = THREE.LinearFilter;
    cTop.generateMipmaps = true;

    return {
      cassetteFrontTex: cFront,
      cassetteRoughnessTex: cRough,
      cassetteTopTex: cTop,
    };
  }, []);

  useEffect(() => {
    return () => {
      frontTexture.dispose();
      spineTexture.dispose();
      cassetteFrontTex.dispose();
      cassetteRoughnessTex.dispose();
      cassetteTopTex.dispose();
    };
  }, [frontTexture, spineTexture, cassetteFrontTex, cassetteRoughnessTex, cassetteTopTex]);

  // 3. Sleeve materials
  const sleeveMaterials = useMemo(() => {
    const baseColor = new THREE.Color(tape.color);
    const sideMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.85,
    });
    const spineMat = new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.65,
      metalness: 0.05,
    });
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.6,
      metalness: 0.08,
    });
    // Top opening: dark hollow inside cardboard
    const topMat = new THREE.MeshBasicMaterial({ color: 0x050505 });

    frontMatRef.current = frontMat;
    spineMatRef.current = spineMat;

    return [
      spineMat, // +x (right spine)
      spineMat, // -x (left spine)
      topMat,   // +y (top hollow opening)
      sideMat,  // -y (bottom)
      frontMat, // +z (front cover)
      frontMat, // -z (back cover)
    ];
  }, [tape.color, frontTexture, spineTexture]);

  // 4. Cassette Body Materials (Authentic molded plastic with glassy acrylic window)
  const cassetteMaterials = useMemo(() => {
    const plasticSide = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      roughness: 0.82,
      metalness: 0.1,
    });
    const plasticTop = new THREE.MeshStandardMaterial({
      map: cassetteTopTex,
      roughness: 0.75,
      metalness: 0.12,
    });
    const plasticFront = new THREE.MeshStandardMaterial({
      map: cassetteFrontTex,
      roughnessMap: cassetteRoughnessTex,
      roughness: 0.85,
      metalness: 0.16,
    });

    return [
      plasticSide,  // +x (right edge)
      plasticSide,  // -x (left edge)
      plasticTop,   // +y (top hinge face)
      plasticSide,  // -y (bottom)
      plasticFront, // +z (front face showing window, reel, ribs)
      plasticFront, // -z (back face)
    ];
  }, [cassetteFrontTex, cassetteRoughnessTex, cassetteTopTex]);

  // Direct Hardware Frame-Rate Independent Animation Loop (0 React re-renders)
  useFrame((_, delta) => {
    const group = groupRef.current;
    const cassette = cassetteMeshRef.current;
    const state = stateRef.current;
    if (!group || !cassette || !state) return;

    const dt = Math.min(delta, 0.05);
    const M = state.enterProgress;

    // 1. Linear distance from active center slot
    const tapeLinearPos = index * VHS_METRICS.SLOT_SPACING;
    const offset = tapeLinearPos - state.currentOffset;
    const distUnits = Math.abs(offset) / VHS_METRICS.SLOT_SPACING;

    // 2. Frustum Culling
    if (distUnits > 4.5) {
      group.visible = false;
      return;
    }
    group.visible = true;

    // 3. Cylindrical Arc Positioning
    const arc = onArc(offset, VHS_METRICS.ARC_RADIUS);
    const baseY = 24;
    const riseY = (1 - M) * 260; // Swoops up from -260 below
    const pushZ = Math.abs(offset) * 0.045 * state.squash;

    group.position.set(arc.x, baseY - riseY, -arc.dropZ - pushZ);

    // 4. 3D Physical Swoop Tilt + Velocity Banking + Mouse Parallax
    const isCenter = Math.max(0, 1 - distUnits);
    const tiltX = -0.88 * (1 - M) - 0.38 * state.squash - 0.16 * state.tilt.y * isCenter;
    const bankY = Math.max(-0.45, Math.min(0.45, -0.00014 * state.velocity)) + 0.22 * state.tilt.x * isCenter;

    group.rotation.set(tiltX, arc.rotationY + bankY, 0);

    // 5. Cassette Peek Animation (Smooth slide out of sleeve)
    const targetPeek = isSelected ? VHS_METRICS.PEEK : VHS_METRICS.PEEK_IDLE;
    currentPeekRef.current += (targetPeek - currentPeekRef.current) * (1 - Math.exp(-8 * dt));
    cassette.position.y = currentPeekRef.current;

    // 6. Dynamic Phosphor Smoothstep Lighting Falloff
    const litFactor = Math.max(0, 1 - distUnits / 1.75);
    const lit = litFactor * litFactor * (3 - 2 * litFactor) * M;

    if (frontMatRef.current) {
      frontMatRef.current.color.setRGB(0.25 + 0.75 * lit, 0.25 + 0.75 * lit, 0.25 + 0.75 * lit);
    }
    if (spineMatRef.current) {
      spineMatRef.current.color.setRGB(0.25 + 0.75 * lit, 0.25 + 0.75 * lit, 0.25 + 0.75 * lit);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* 1. Inner VHS Cassette (Slides out smoothly when selected) */}
      <mesh
        ref={cassetteMeshRef}
        material={cassetteMaterials}
        castShadow
      >
        <boxGeometry
          args={[
            VHS_METRICS.TAPE.w,
            VHS_METRICS.TAPE.h,
            VHS_METRICS.TAPE.t,
          ]}
        />
      </mesh>

      {/* 2. Outer Cardboard Sleeve (Vertical Portrait) */}
      <mesh material={sleeveMaterials} castShadow receiveShadow>
        <boxGeometry
          args={[
            VHS_METRICS.CASE.w,
            VHS_METRICS.CASE.h,
            VHS_METRICS.CASE.t,
          ]}
        />
      </mesh>
    </group>
  );
}
