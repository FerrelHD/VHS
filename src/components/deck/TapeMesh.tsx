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
 * Creates authentic physical VHS tape body textures:
 * - Front face: Twin transparent reel windows showing the magnetic tape & 6-toothed white spools, paper label sticker, and molded arrows.
 * - Top edge: White/ivory paper spine label with tracking marks and finger grip ribs.
 */
function createCassetteFrontTexture(tape: TapeProject): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const w = 380;
  const h = 210;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Dark molded plastic shell background with subtle texture
  ctx.fillStyle = "#141416";
  ctx.fillRect(0, 0, w, h);

  // Plastic shell perimeter bevel line
  ctx.strokeStyle = "#252528";
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  // 2. Paper Label Sticker (Centered on upper face)
  const lX = 32;
  const lY = 16;
  const lW = w - 64;
  const lH = 46;

  ctx.fillStyle = "#f3efe6"; // Vintage aged ivory label paper
  ctx.fillRect(lX, lY, lW, lH);

  // Red and blue hairline label margins
  ctx.strokeStyle = "rgba(220, 38, 38, 0.75)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(lX + 3, lY + 3, lW - 6, lH - 6);

  ctx.strokeStyle = "rgba(37, 99, 235, 0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(lX + 6, lY + 6, lW - 12, lH - 12);

  // Label text
  ctx.fillStyle = "#111111";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`T-120 // HQ`, lX + 12, lY + 28);

  ctx.fillStyle = "#991b1b";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${tape.code} : ${tape.title}`, w / 2, lY + 29);

  ctx.fillStyle = "#111111";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`SP HI-FI`, lX + lW - 12, lY + 28);

  // 3. The Iconic Twin Spool Acrylic Windows (Centered lower half)
  const winX = 54;
  const winY = 74;
  const winW = w - 108;
  const winH = 105;

  // Window frame indentation
  ctx.fillStyle = "#0c0c0e";
  ctx.fillRect(winX, winY, winW, winH);
  ctx.strokeStyle = "#2b2b30";
  ctx.lineWidth = 2;
  ctx.strokeRect(winX, winY, winW, winH);

  // Left Reel & Right Reel
  const reels = [
    { cx: 120, cy: winY + winH / 2 },
    { cx: w - 120, cy: winY + winH / 2 },
  ];

  reels.forEach((r, idx) => {
    // Magnetic Tape Spool (Dark chocolate brown metallic ring)
    ctx.fillStyle = idx === 0 ? "#1b1411" : "#221915";
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, 40, 0, Math.PI * 2);
    ctx.fill();

    // Spool core (white/translucent plastic wheel)
    ctx.fillStyle = "#eae6dc";
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, 22, 0, Math.PI * 2);
    ctx.fill();

    // Gear Teeth Hub (6 radial teeth cutouts)
    ctx.fillStyle = "#0c0c0e";
    ctx.beginPath();
    ctx.arc(r.cx, r.cy, 12, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      const tx = r.cx + Math.cos(ang) * 16;
      const ty = r.cy + Math.sin(ang) * 16;
      ctx.fillStyle = "#0c0c0e";
      ctx.beginPath();
      ctx.arc(tx, ty, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Center tape progress level ruler
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i++) {
    const rx = w / 2 - 24 + i * 8;
    ctx.beginPath();
    ctx.moveTo(rx, winY + 45);
    ctx.lineTo(rx, winY + 60);
    ctx.stroke();
  }

  // Clear Acrylic Window Gloss Sheen (diagonal reflective specular gradient)
  const gloss = ctx.createLinearGradient(winX, winY, winX + winW, winY + winH);
  gloss.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  gloss.addColorStop(0.35, "rgba(255, 255, 255, 0.18)");
  gloss.addColorStop(0.55, "rgba(255, 255, 255, 0.02)");
  gloss.addColorStop(1, "rgba(255, 255, 255, 0.09)");
  ctx.fillStyle = gloss;
  ctx.fillRect(winX + 2, winY + 2, winW - 4, winH - 4);

  // 4. Embossed Molded Plastic Arrow: "INSERT THIS END"
  ctx.fillStyle = "#222226";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("▲  INSERT THIS END  ▲", w / 2, 196);

  // 5. Left & Right Finger Grip Ribs
  [12, w - 24].forEach((rx) => {
    ctx.fillStyle = "#0e0e10";
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(rx, 80 + i * 11, 12, 5);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Top face texture for the cassette: ivory spine sticker with tape title & tracking marks.
 */
function createCassetteTopTexture(tape: TapeProject): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const w = 380;
  const h = 50;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark plastic
  ctx.fillStyle = "#141416";
  ctx.fillRect(0, 0, w, h);

  // White/Ivory paper label sticker
  ctx.fillStyle = "#f3efe6";
  ctx.fillRect(35, 8, w - 70, 34);

  // Red margin rule
  ctx.strokeStyle = "rgba(220, 38, 38, 0.7)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(37, 10, w - 74, 30);

  // Label text
  ctx.fillStyle = "#111111";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "left";
  ctx.fillText("VHS", 48, 28);

  ctx.fillStyle = "#991b1b";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`[ ${tape.code} ]  ${tape.title}`, w / 2, 28);

  ctx.fillStyle = "#111111";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "right";
  ctx.fillText(String(tape.year), w - 48, 28);

  // Finger grip ribs on left and right edges
  [8, w - 24].forEach((gx) => {
    ctx.fillStyle = "#0c0c0e";
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(gx, 10 + i * 8, 16, 4);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function TapeMesh({ tape, offset, isSelected, onSelect }: TapeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate sleeve textures
  const { frontTexture, spineTexture } = useMemo(() => {
    return {
      frontTexture: (() => {
        const canvas = document.createElement("canvas");
        canvas.width = 340;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (!ctx) return new THREE.CanvasTexture(canvas);
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
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      })(),
      spineTexture: (() => {
        const canvas = document.createElement("canvas");
        canvas.width = 96;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (!ctx) return new THREE.CanvasTexture(canvas);
        drawSpine(ctx, 96, 512, tape);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      })(),
    };
  }, [tape]);

  // Generate authentic physical VHS cassette body textures
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

  // Compute 3D cylindrical arc coordinates
  const arc = onArc(offset, VHS_METRICS.ARC_RADIUS);

  // Lighting attenuation based on distance from center
  const angle = offset / VHS_METRICS.ARC_RADIUS;
  const dist = Math.abs(angle);
  const lit = Math.max(0.14, Math.cos(Math.min(Math.PI * 0.45, dist * 1.85)));

  // Sleeve materials
  const sleeveMaterials = useMemo(() => {
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

  // Cassette Body Materials (Authentic VHS plastic + twin reel windows + label)
  const cassetteMaterials = useMemo(() => {
    const plasticSide = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.55,
      metalness: 0.15,
    });
    const plasticTop = new THREE.MeshStandardMaterial({
      map: cassetteTopTex,
      roughness: 0.5,
      metalness: 0.15,
    });
    const plasticFront = new THREE.MeshStandardMaterial({
      map: cassetteFrontTex,
      roughness: 0.45,
      metalness: 0.2,
    });

    return [
      plasticSide, // +x (right ribbed edge)
      plasticSide, // -x (left ribbed edge)
      plasticTop, // +y (top spine label)
      plasticSide, // -y (bottom)
      plasticFront, // +z (front twin spool windows)
      plasticFront, // -z (back face)
    ];
  }, [cassetteFrontTex, cassetteTopTex]);

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
      {/* 1. Authentic Physical VHS Cassette (Slides out of top opening) */}
      <mesh
        position={[
          0,
          isSelected ? VHS_METRICS.PEEK : VHS_METRICS.PEEK * 0.45,
          0,
        ]}
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
