"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TapeProject } from "@/data/tapes";
import { onArc, VHS_METRICS } from "@/lib/math";
import { drawWear } from "./proceduralWear";

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

/**
 * Draws the front vertical cover of the VHS sleeve.
 * Dimensions: 340 x 512 (aspect ratio 130 : 196).
 */
function drawFrontCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject,
  img?: HTMLImageElement | null
) {
  // 1. Base cardboard background
  ctx.fillStyle = tape.color || "#1f1d1b";
  ctx.fillRect(0, 0, w, h);

  // Cardboard aged edge wear
  drawWear(ctx, w, h, 2026 + tape.id.length * 17);

  // Outer keyline frame
  ctx.strokeStyle = "rgba(239, 68, 68, 0.45)";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  // Header: "HOME VIDEO • STEREO"
  ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
  ctx.font = "italic bold 13px serif";
  ctx.textAlign = "center";
  ctx.fillText("HOME VIDEO ARCHIVE", w / 2, 42);

  // Center Image Poster Box coordinates
  const pX = 30;
  const pY = 56;
  const pW = w - 60;
  const pH = 236;

  // Poster Box Border
  ctx.strokeStyle = "rgba(239, 68, 68, 0.65)";
  ctx.lineWidth = 2;
  ctx.strokeRect(pX, pY, pW, pH);

  // Dark background inside poster box
  ctx.fillStyle = "#0a0908";
  ctx.fillRect(pX + 1, pY + 1, pW - 2, pH - 2);

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(pX + 2, pY + 2, pW - 4, pH - 4);
    ctx.clip();

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const boxAspect = (pW - 4) / (pH - 4);
    const imgAspect = nw / nh;
    let sx = 0,
      sy = 0,
      sw = nw,
      sh = nh;

    if (imgAspect > boxAspect) {
      sw = nh * boxAspect;
      sx = (nw - sw) / 2;
    } else {
      sh = nw / boxAspect;
      sy = (nh - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, pX + 2, pY + 2, pW - 4, pH - 4);

    // Subtle dark gradient at top and bottom of the image for vintage feel
    const grad = ctx.createLinearGradient(0, pY, 0, pY + pH);
    grad.addColorStop(0, "rgba(0,0,0,0.4)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.05)");
    grad.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = grad;
    ctx.fillRect(pX + 2, pY + 2, pW - 4, pH - 4);

    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(236, 233, 225, 0.08)";
    ctx.fillRect(48, 80, w - 96, 190);
    ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
    ctx.beginPath();
    ctx.arc(w / 2, 175, 45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#f5a742";
    ctx.font = "bold 12px monospace";
    ctx.fillText(`[ ${tape.code} ]`, w / 2, 180);
  }

  // Small Pill Badge with Project Code over the image
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(pX + 8, pY + 8, 76, 19);
  ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
  ctx.lineWidth = 1;
  ctx.strokeRect(pX + 8, pY + 8, 76, 19);

  ctx.fillStyle = "#f5a742";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";
  ctx.fillText(tape.code, pX + 14, pY + 22);

  // Big Headline Title (Stacked bold pixel/grotesque display font)
  ctx.textAlign = "center";
  ctx.fillStyle = "#ef4444";
  ctx.font = "bold 26px sans-serif";
  const words = tape.title.split(" ");
  if (words.length > 2) {
    ctx.fillText(words.slice(0, 2).join(" "), w / 2, 335);
    ctx.fillText(words.slice(2).join(" "), w / 2, 365);
  } else if (words.length === 2) {
    ctx.fillText(words[0], w / 2, 335);
    ctx.fillText(words[1], w / 2, 365);
  } else {
    ctx.fillText(tape.title, w / 2, 345);
  }

  // Category subtitle under title
  ctx.fillStyle = "rgba(236, 233, 225, 0.75)";
  ctx.font = "10px monospace";
  ctx.fillText(tape.category.slice(0, 36), w / 2, 395);

  // Bottom Badges: VHS logo, year, format
  ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 440, 50, 24);
  ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("VHS", 57, 456);

  ctx.fillStyle = "rgba(236, 233, 225, 0.7)";
  ctx.font = "11px monospace";
  ctx.fillText(String(tape.year), w / 2, 456);

  ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
  ctx.font = "10px monospace";
  ctx.fillText(tape.meta.quality || "HI-FI", w - 54, 456);
}

/**
 * Draws the vertical spine on the left side of the sleeve.
 * Dimensions: 96 x 512.
 */
function drawSpine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject
) {
  ctx.fillStyle = tape.color || "#1a1816";
  ctx.fillRect(0, 0, w, h);

  // Aged spine cardboard scuffs
  drawWear(ctx, w, h, 8888 + tape.id.length);

  // Top VHS logo
  ctx.fillStyle = "#ef4444";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VHS", w / 2, 44);

  // Project code
  ctx.fillStyle = "#f5a742";
  ctx.font = "bold 11px monospace";
  ctx.fillText(tape.code, w / 2, 74);

  // Vertical text: Title rotated 90 degrees
  ctx.save();
  ctx.translate(w / 2, 270);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = "#ece9e1";
  ctx.font = "bold 17px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(tape.title.toUpperCase(), 0, 5);
  ctx.restore();

  // Bottom Year
  ctx.fillStyle = "rgba(236, 233, 225, 0.6)";
  ctx.font = "11px monospace";
  ctx.fillText(String(tape.year), w / 2, h - 30);
}

/**
 * Generates the authentic front face texture for the VHS cassette.
 * Dimensions: 360 x 512.
 */
function createCassetteFrontTexture(tape: TapeProject): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const w = 360;
  const h = 512;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Dark charcoal molded polymeric plastic
  ctx.fillStyle = "#121214";
  ctx.fillRect(0, 0, w, h);

  // Molded bevel border
  ctx.strokeStyle = "#25252b";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(4, 4, w - 8, h - 8);

  // 2. Paper Label Sticker (Top peeking zone: y: 12 - 48)
  const lX = 20;
  const lY = 12;
  const lW = w - 40;
  const lH = 38;

  ctx.fillStyle = "#f4f1e8"; // Aged ivory paper
  ctx.fillRect(lX, lY, lW, lH);

  // Red and blue hairline label margins
  ctx.strokeStyle = "rgba(220, 38, 38, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(lX + 2, lY + 2, lW - 4, lH - 4);

  // Label text
  ctx.fillStyle = "#111111";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`T-120 • HQ`, lX + 8, lY + 23);

  ctx.fillStyle = "#991b1b";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${tape.code} : ${tape.title}`, w / 2, lY + 24);

  ctx.fillStyle = "#111111";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`SP HI-FI`, lX + lW - 8, lY + 23);

  // 3. The Iconic Twin Spool Acrylic Windows (Positioned at y: 56 - 144)
  const winX = 28;
  const winY = 56;
  const winW = w - 56;
  const winH = 88;

  // Window frame indentation
  ctx.fillStyle = "#08080a";
  ctx.fillRect(winX, winY, winW, winH);
  ctx.strokeStyle = "#2b2b32";
  ctx.lineWidth = 2;
  ctx.strokeRect(winX, winY, winW, winH);

  // Left Reel & Right Reel (Twin Spools)
  const reels = [
    { cx: 94, cy: winY + winH / 2, tapeRadius: 34 },
    { cx: w - 94, cy: winY + winH / 2, tapeRadius: 28 },
  ];

  reels.forEach((r, idx) => {
    // Magnetic Tape Spool (Dark metallic chocolate brown ribbon)
    ctx.fillStyle = idx === 0 ? "#1e1612" : "#281d16";
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, r.tapeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Wound tape circular tracks
    ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, r.tapeRadius - 4, 0, Math.PI * 2);
    ctx.arc(r.cx, r.cy, r.tapeRadius - 8, 0, Math.PI * 2);
    ctx.stroke();

    // Spool Core Hub (Ivory/cream plastic hub)
    ctx.fillStyle = "#ece7dc";
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, 18, 0, Math.PI * 2);
    ctx.fill();

    // Inner Drive Spindle Hole
    ctx.fillStyle = "#0a0a0c";
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, 9.5, 0, Math.PI * 2);
    ctx.fill();

    // 6 Radial Gear Drive Teeth
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      const tx = r.cx + Math.cos(ang) * 13;
      const ty = r.cy + Math.sin(ang) * 13;
      ctx.fillStyle = "#0a0a0c";
      ctx.beginPath();
      ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Tape Level Calibration Marks
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const rx = w / 2 - 15 + i * 6;
    ctx.beginPath();
    ctx.moveTo(rx, winY + 36);
    ctx.lineTo(rx, winY + 50);
    ctx.stroke();
  }

  // Clear Acrylic Window Gloss Sheen (diagonal specular reflection)
  const gloss = ctx.createLinearGradient(winX, winY, winX + winW, winY + winH);
  gloss.addColorStop(0, "rgba(255, 255, 255, 0.05)");
  gloss.addColorStop(0.35, "rgba(255, 255, 255, 0.25)");
  gloss.addColorStop(0.55, "rgba(255, 255, 255, 0.02)");
  gloss.addColorStop(1, "rgba(255, 255, 255, 0.12)");
  ctx.fillStyle = gloss;
  ctx.fillRect(winX + 2, winY + 2, winW - 4, winH - 4);

  // 4. Embossed Molded Plastic Arrow: "▲ INSERT THIS END ▲"
  ctx.fillStyle = "#27272d";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("▲  INSERT THIS END  ▲", w / 2, 160);

  // 5. Left & Right Finger Grip Ribs
  [10, w - 22].forEach((rx) => {
    ctx.fillStyle = "#0c0c0e";
    for (let i = 0; i < 14; i++) {
      ctx.fillRect(rx, 70 + i * 11, 12, 5);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Top face texture for the cassette: ivory spine sticker with tape title & tracking marks.
 * Dimensions: 360 x 75 (aspect ratio 120 : 25).
 */
function createCassetteTopTexture(tape: TapeProject): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const w = 360;
  const h = 75;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark molded plastic
  ctx.fillStyle = "#141416";
  ctx.fillRect(0, 0, w, h);

  // White/Ivory paper label sticker
  ctx.fillStyle = "#f4f1e8";
  ctx.fillRect(32, 10, w - 64, 55);

  // Red margin rule
  ctx.strokeStyle = "rgba(220, 38, 38, 0.8)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(34, 12, w - 68, 51);

  // Label text
  ctx.fillStyle = "#111111";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "left";
  ctx.fillText("VHS", 46, 42);

  ctx.fillStyle = "#991b1b";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`[ ${tape.code} ]  ${tape.title}`, w / 2, 42);

  ctx.fillStyle = "#111111";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "right";
  ctx.fillText(String(tape.year), w - 46, 42);

  // Finger grip ribs on left and right edges
  [8, w - 24].forEach((gx) => {
    ctx.fillStyle = "#0a0a0c";
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(gx, 12 + i * 14, 16, 7);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function TapeMesh({ tape, index, isSelected, onSelect, stateRef }: TapeMeshProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const cassetteMeshRef = useRef<THREE.Mesh | null>(null);
  const currentPeekRef = useRef(isSelected ? VHS_METRICS.PEEK : VHS_METRICS.PEEK_IDLE);

  // Dynamic front cover material reference for phosphor lighting adjustments
  const frontMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const spineMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Generate high-resolution sleeve textures
  const { frontTexture, spineTexture } = useMemo(() => {
    return {
      frontTexture: (() => {
        const canvas = document.createElement("canvas");
        canvas.width = 340;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        if (!ctx) return texture;
        drawFrontCover(ctx, 340, 512, tape, null);

        if (typeof window !== "undefined" && tape.image) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = tape.image;
          img.onload = () => {
            drawFrontCover(ctx, 340, 512, tape, img);
            texture.needsUpdate = true;
          };
        }
        return texture;
      })(),
      spineTexture: (() => {
        const canvas = document.createElement("canvas");
        canvas.width = 96;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        if (!ctx) return texture;
        drawSpine(ctx, 96, 512, tape);
        return texture;
      })(),
    };
  }, [tape]);

  // Generate cassette body textures
  const { cassetteFrontTex, cassetteTopTex } = useMemo(() => {
    return {
      cassetteFrontTex: createCassetteFrontTexture(tape),
      cassetteTopTex: createCassetteTopTexture(tape),
    };
  }, [tape]);

  useEffect(() => {
    return () => {
      frontTexture.dispose();
      spineTexture.dispose();
      cassetteFrontTex.dispose();
      cassetteTopTex.dispose();
    };
  }, [frontTexture, spineTexture, cassetteFrontTex, cassetteTopTex]);

  // Sleeve materials
  const sleeveMaterials = useMemo(() => {
    const baseColor = new THREE.Color(tape.color);
    const sideMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.85,
    });
    const spineMat = new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.85,
    });
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.78,
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

  // Cassette Body Materials
  const cassetteMaterials = useMemo(() => {
    const plasticSide = new THREE.MeshStandardMaterial({
      color: 0x121214,
      roughness: 0.5,
      metalness: 0.15,
    });
    const plasticTop = new THREE.MeshStandardMaterial({
      map: cassetteTopTex,
      roughness: 0.48,
      metalness: 0.15,
    });
    const plasticFront = new THREE.MeshStandardMaterial({
      map: cassetteFrontTex,
      roughness: 0.42,
      metalness: 0.22,
    });

    return [
      plasticSide,  // +x
      plasticSide,  // -x
      plasticTop,   // +y (top label)
      plasticSide,  // -y
      plasticFront, // +z (twin spool windows)
      plasticFront, // -z
    ];
  }, [cassetteFrontTex, cassetteTopTex]);

  // Direct Hardware Frame-Rate Independent Animation Loop (0 React re-renders)
  useFrame((_, delta) => {
    const group = groupRef.current;
    const cassette = cassetteMeshRef.current;
    const state = stateRef.current;
    if (!group || !cassette || !state) return;

    const dt = Math.min(0.1, delta);
    const tapeLinearPos = index * VHS_METRICS.SLOT_SPACING;
    const offset = tapeLinearPos - state.currentOffset;
    const distUnits = Math.abs(offset) / VHS_METRICS.SLOT_SPACING;

    // 1. Frustum culling: hide if beyond visible arc window
    if (distUnits > 3.8) {
      group.visible = false;
      return;
    }

    // 2. Staggered 3D Swoop Entrance Math (100% Arc Marumo authentic)
    // Distance rank d from center tape (0 = center, 1 = immediate neighbors, 2 = outer)
    const d = Math.min(3, Math.round(distUnits));
    const g = Math.max(0, Math.min(1, 1.7 * state.enterProgress - 0.22 * d));
    const M = 1 - Math.pow(1 - g, 3); // Cubic ease-out curve

    if (M <= 0.001) {
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
    // Starts tilted back ~50 degrees (-0.88 rad) during entrance, settles upright (0 rad)
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
