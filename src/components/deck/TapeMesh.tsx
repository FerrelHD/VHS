"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TapeProject } from "@/data/tapes";
import { onArc, VHS_METRICS } from "@/lib/math";
import { drawWear } from "./proceduralWear";

interface TapeMeshProps {
  tape: TapeProject;
  offset: number; // Linear offset along the arc relative to the center
  isSelected: boolean;
  onSelect: () => void;
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

  // Red outer keyline frame
  ctx.strokeStyle = "rgba(239, 68, 68, 0.45)";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  // Header: "Home Video" label
  ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
  ctx.font = "italic 13px serif";
  ctx.textAlign = "center";
  ctx.fillText("Home Video", w / 2, 42);

  // Center Image Poster Box coordinates
  const pX = 32;
  const pY = 56;
  const pW = w - 64;
  const pH = 236;

  // Poster Box Border
  ctx.strokeStyle = "rgba(239, 68, 68, 0.65)";
  ctx.lineWidth = 2;
  ctx.strokeRect(pX, pY, pW, pH);

  // Dark background inside poster box
  ctx.fillStyle = "#0c0b0a";
  ctx.fillRect(pX + 1, pY + 1, pW - 2, pH - 2);

  if (img && img.complete && img.naturalWidth > 0) {
    // Draw real project image cropped nicely with cover fit
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
    grad.addColorStop(0, "rgba(0,0,0,0.35)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.05)");
    grad.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = grad;
    ctx.fillRect(pX + 2, pY + 2, pW - 4, pH - 4);

    ctx.restore();
  } else {
    // Fallback abstract silhouette while loading
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
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(pX + 8, pY + 8, 72, 18);
  ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
  ctx.lineWidth = 1;
  ctx.strokeRect(pX + 8, pY + 8, 72, 18);

  ctx.fillStyle = "#f5a742";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";
  ctx.fillText(tape.code, pX + 14, pY + 21);

  // Big Headline Title (Stacked bold serif / display font)
  ctx.textAlign = "center";
  ctx.fillStyle = "#ef4444";
  ctx.font = "bold 25px sans-serif";
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
  ctx.fillStyle = "rgba(236, 233, 225, 0.7)";
  ctx.font = "9px monospace";
  ctx.fillText(tape.category.slice(0, 34), w / 2, 395);

  // Bottom Badges: VHS logo, year, format
  ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 440, 48, 22);
  ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText("VHS", 56, 455);

  ctx.fillStyle = "rgba(236, 233, 225, 0.65)";
  ctx.font = "11px monospace";
  ctx.fillText(String(tape.year), w / 2, 455);

  ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
  ctx.font = "10px monospace";
  ctx.fillText(tape.meta.quality || "HI-FI", w - 54, 455);

  // Apply procedural cardboard patina & edge wear
  drawWear(ctx, w, h, tape.wearSeed);
}

/**
 * Draws the vertical spine of the VHS sleeve.
 */
function drawSpine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject
) {
  ctx.fillStyle = tape.color || "#1f1d1b";
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 2);

  ctx.fillStyle = "#ece9e1";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${tape.code} // ${tape.title}`, 0, 6);
  ctx.restore();

  drawWear(ctx, w, h, tape.wearSeed);
}

/**
 * Generates vertical portrait Canvas 2D textures for the VHS cardboard sleeve.
 * Dimensions: 340 x 512 (aspect ratio 130 : 196).
 */
function createPortraitTexture(tape: TapeProject, isSpine = false): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const w = isSpine ? 96 : 340;
  const h = 512;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  if (isSpine) {
    drawSpine(ctx, w, h, tape);
  } else {
    drawFrontCover(ctx, w, h, tape, null);

    // Asynchronously load real project artwork image and redraw
    if (typeof window !== "undefined" && tape.image) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = tape.image;
      img.onload = () => {
        drawFrontCover(ctx, w, h, tape, img);
        texture.needsUpdate = true;
      };
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function TapeMesh({ tape, offset, isSelected, onSelect }: TapeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate textures once per tape
  const { frontTexture, spineTexture } = useMemo(() => {
    return {
      frontTexture: createPortraitTexture(tape, false),
      spineTexture: createPortraitTexture(tape, true),
    };
  }, [tape]);

  useEffect(() => {
    return () => {
      frontTexture.dispose();
      spineTexture.dispose();
    };
  }, [frontTexture, spineTexture]);

  // Compute 3D cylindrical arc coordinates
  const arc = onArc(offset, VHS_METRICS.ARC_RADIUS);

  // Lighting attenuation based on distance from center
  const angle = offset / VHS_METRICS.ARC_RADIUS;
  const dist = Math.abs(angle);
  const lit = Math.max(0.14, Math.cos(Math.min(Math.PI * 0.45, dist * 1.85)));

  const materials = useMemo(() => {
    const baseColor = new THREE.Color(tape.color);
    const sideMat = new THREE.MeshStandardMaterial({
      color: baseColor.clone().multiplyScalar(lit),
      roughness: 0.85,
    });
    const spineMat = new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.85,
    });
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.8,
    });
    // Top opening: dark hollow inside of cardboard
    const topMat = new THREE.MeshBasicMaterial({ color: 0x070707 });

    return [
      spineMat, // +x (right spine)
      spineMat, // -x (left spine)
      topMat, // +y (top hollow opening)
      sideMat, // -y (bottom)
      frontMat, // +z (front cover)
      frontMat, // -z (back cover)
    ];
  }, [tape.color, lit, frontTexture, spineTexture]);

  useEffect(() => {
    materials.forEach((mat) => {
      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.color.setScalar(lit);
      }
    });
  }, [materials, lit]);

  // Plastic tape cassette material (black molded plastic with ridges)
  const plasticMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x141416,
        roughness: 0.45,
        metalness: 0.2,
      }),
    []
  );

  return (
    <group
      ref={groupRef}
      position={[arc.x, 0, -arc.dropZ]}
      rotation={[0, arc.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* 1. Black Plastic Cassette Peeking Out of the Top Opening */}
      <mesh
        position={[0, isSelected ? VHS_METRICS.PEEK : VHS_METRICS.PEEK * 0.6, 0]}
        material={plasticMat}
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
      <mesh material={materials} castShadow receiveShadow>
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
