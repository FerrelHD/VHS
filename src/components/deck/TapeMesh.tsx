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

/**
 * Clips and draws an image proportionally with subtle dark top/bottom vignettes.
 */
function drawClippedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null | undefined,
  pX: number,
  pY: number,
  pW: number,
  pH: number,
  fallbackText: string,
  accentColor: string
) {
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(pX, pY, pW, pH);
    ctx.clip();

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const boxAspect = pW / pH;
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

    ctx.drawImage(img, sx, sy, sw, sh, pX, pY, pW, pH);

    // Subtle dark gradient at top and bottom of the image for vintage feel
    const grad = ctx.createLinearGradient(0, pY, 0, pY + pH);
    grad.addColorStop(0, "rgba(0,0,0,0.45)");
    grad.addColorStop(0.35, "rgba(0,0,0,0.0)");
    grad.addColorStop(0.7, "rgba(0,0,0,0.0)");
    grad.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = grad;
    ctx.fillRect(pX, pY, pW, pH);

    ctx.restore();
  } else {
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(pX, pY, pW, pH);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(pX + 8, pY + 8, pW - 16, pH - 16);

    ctx.fillStyle = accentColor;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`[ ${fallbackText} ]`, pX + pW / 2, pY + pH / 2);
  }
}

/**
 * Draws realistic procedural barcodes.
 */
function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  let s = seed;
  const rand = () => (s = (16807 * s) % 0x7fffffff) / 0x7fffffff;
  let curX = x;
  while (curX < x + w - 4) {
    const barW = rand() > 0.55 ? 2.5 : 1.2;
    const gap = 1 + rand() * 2.2;
    ctx.fillRect(curX, y, barW, h);
    curX += barW + gap;
  }
  ctx.restore();
}

/**
 * Draws corner alignment brackets.
 */
function drawCornerBrackets(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  len: number,
  color: string,
  lineWidth = 1.5
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  // Top-Left
  ctx.beginPath();
  ctx.moveTo(x, y + len);
  ctx.lineTo(x, y);
  ctx.lineTo(x + len, y);
  ctx.stroke();
  // Top-Right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + len);
  ctx.stroke();
  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(x, y + h - len);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + len, y + h);
  ctx.stroke();
  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - len);
  ctx.stroke();
  ctx.restore();
}

/**
 * Helper to split title into 1 or 2 lines for best fit.
 */
function drawTitleLines(
  ctx: CanvasRenderingContext2D,
  title: string,
  cx: number,
  startY: number,
  lineHeight = 28
) {
  const words = title.split(" ");
  if (words.length > 2) {
    const mid = Math.ceil(words.length / 2);
    ctx.fillText(words.slice(0, mid).join(" "), cx, startY);
    ctx.fillText(words.slice(mid).join(" "), cx, startY + lineHeight);
  } else if (words.length === 2) {
    ctx.fillText(words[0], cx, startY);
    ctx.fillText(words[1], cx, startY + lineHeight);
  } else {
    ctx.fillText(title, cx, startY + lineHeight / 2);
  }
}

// ============================================================================
// ARCHETYPE 1: EDITORIAL / HAUTE-COUTURE (Araki Art, Ferrel Portfolio)
// ============================================================================
function drawEditorialCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject,
  img?: HTMLImageElement | null
) {
  ctx.fillStyle = tape.color || "#1c1916";
  ctx.fillRect(0, 0, w, h);
  drawWear(ctx, w, h, 1987 + tape.id.length * 23);

  // Elegant double hairline gold border
  const gold = "#d4af37";
  const goldDim = "rgba(212, 175, 55, 0.45)";
  ctx.strokeStyle = goldDim;
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.strokeRect(20, 20, w - 40, h - 40);
  drawCornerBrackets(ctx, 12, 12, w - 24, h - 24, 10, gold, 1.5);

  // Header: Haute Couture Monograph
  ctx.fillStyle = gold;
  ctx.font = "italic bold 11px serif";
  ctx.textAlign = "center";
  ctx.fillText("✦ HAUTE COUTURE ARCHIVE • LUXURY EDITION ✦", w / 2, 40);

  // Poster Image Frame
  const pX = 26;
  const pY = 52;
  const pW = w - 52;
  const pH = 248;

  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pX - 1, pY - 1, pW + 2, pH + 2);
  drawClippedImage(ctx, img, pX, pY, pW, pH, tape.code, gold);

  // Inset Gold Laurel Pill Badge on Image
  ctx.fillStyle = "rgba(20, 16, 12, 0.9)";
  ctx.fillRect(pX + 8, pY + 8, 124, 20);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1;
  ctx.strokeRect(pX + 8, pY + 8, 124, 20);
  ctx.fillStyle = gold;
  ctx.font = "bold 9px serif";
  ctx.textAlign = "center";
  ctx.fillText(`✦ SPECIAL EXHIBITION ✦`, pX + 70, pY + 22);

  // Headline Title (High-contrast luxury serif display)
  ctx.textAlign = "center";
  ctx.fillStyle = "#fcf9f2";
  ctx.font = "bold 25px serif";
  drawTitleLines(ctx, tape.title, w / 2, 335, 28);

  // Refined Subtitle
  ctx.fillStyle = gold;
  ctx.font = "italic 10px serif";
  ctx.fillText("CURATED BY FERREL K. • PARIS / MILAN / TOKYO", w / 2, 400);

  ctx.fillStyle = "rgba(236, 233, 225, 0.65)";
  ctx.font = "9px monospace";
  ctx.fillText(`SWISS 12-COL GRID • ${tape.meta.channel}`, w / 2, 418);

  // Bottom Metadata Badges
  ctx.strokeStyle = goldDim;
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 442, 60, 22);
  ctx.fillStyle = gold;
  ctx.font = "bold 10px serif";
  ctx.fillText("STEREO", 58, 457);

  ctx.fillStyle = "#ede7db";
  ctx.font = "11px monospace";
  ctx.fillText(`VOL. ${tape.year}`, w / 2, 457);

  ctx.strokeStyle = goldDim;
  ctx.strokeRect(w - 88, 442, 60, 22);
  ctx.fillStyle = gold;
  ctx.font = "bold 10px serif";
  ctx.fillText(tape.meta.quality || "HI-FI", w - 58, 457);
}

// ============================================================================
// ARCHETYPE 2: CYBER / TACTICAL HUD TELEMETRY (TactIQ, Stock Predictor)
// ============================================================================
function drawCyberCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject,
  img?: HTMLImageElement | null
) {
  ctx.fillStyle = "#090d15";
  ctx.fillRect(0, 0, w, h);
  drawWear(ctx, w, h, 2049 + tape.id.length * 19);

  // Cyan Grid Lines
  ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
  ctx.lineWidth = 1;
  for (let y = 30; y < h - 30; y += 26) {
    ctx.beginPath();
    ctx.moveTo(16, y);
    ctx.lineTo(w - 16, y);
    ctx.stroke();
  }
  for (let x = 30; x < w - 30; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, h - 20);
    ctx.stroke();
  }

  // Cyan outer corner brackets
  const cyan = "#38bdf8";
  const amber = "#f59e0b";
  drawCornerBrackets(ctx, 16, 16, w - 32, h - 32, 14, cyan, 2);

  // Header: Real-Time HUD Status
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(32, 38, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = cyan;
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";
  ctx.fillText("LIVE TELEMETRY // HUD.SYS.V2", 44, 42);

  ctx.textAlign = "right";
  ctx.fillStyle = amber;
  ctx.fillText("LATENCY < 45MS", w - 24, 42);

  // Image Frame with Technical Crosshairs
  const pX = 24;
  const pY = 52;
  const pW = w - 48;
  const pH = 236;

  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pX, pY, pW, pH);
  drawClippedImage(ctx, img, pX + 1, pY + 1, pW - 2, pH - 2, tape.code, cyan);

  // Cyan HUD Corner Ticks on image
  drawCornerBrackets(ctx, pX + 4, pY + 4, pW - 8, pH - 8, 8, cyan, 1.5);

  // Telemetry Callout Pill
  ctx.fillStyle = "rgba(9, 13, 21, 0.9)";
  ctx.fillRect(pX + 8, pY + 8, 92, 18);
  ctx.strokeStyle = cyan;
  ctx.lineWidth = 1;
  ctx.strokeRect(pX + 8, pY + 8, 92, 18);
  ctx.fillStyle = cyan;
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`SYS_${tape.code}`, pX + 54, pY + 21);

  // Headline Title (Techno Sans Display)
  ctx.textAlign = "center";
  ctx.fillStyle = cyan;
  ctx.font = "bold 25px sans-serif";
  drawTitleLines(ctx, tape.title, w / 2, 328, 27);

  // Telemetry Data Barcode / Coordinate Readout
  ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
  ctx.font = "9px monospace";
  ctx.fillText("COORD: 104.22°E -06.18°S | CORE: ACTIVE", w / 2, 390);

  drawBarcode(ctx, 36, 404, w - 72, 16, 9991 + tape.id.length, "rgba(56, 189, 248, 0.65)");

  // Bottom Badges
  ctx.fillStyle = amber;
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`T-120 // QUANT`, 28, 455);

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(236, 233, 225, 0.7)";
  ctx.fillText(`[ ${tape.year} ]`, w / 2, 455);

  ctx.textAlign = "right";
  ctx.fillStyle = cyan;
  ctx.fillText("SOCKET.IO", w - 28, 455);
}

// ============================================================================
// ARCHETYPE 3: SWISS MODERNISM / BAUHAUS (Student Life, Fersya Shop)
// ============================================================================
function drawSwissCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject,
  img?: HTMLImageElement | null
) {
  // Top Block Color (Stark Vermillion or Cobalt)
  const isRed = tape.id === "student-life";
  const bannerCol = isRed ? "#dc2626" : "#2563eb";

  // Background
  ctx.fillStyle = "#161618";
  ctx.fillRect(0, 0, w, h);

  // Top color banner block
  ctx.fillStyle = bannerCol;
  ctx.fillRect(0, 0, w, 140);

  drawWear(ctx, w, h, 1968 + tape.id.length * 31);

  // Oversized Index Numeral (Helvetica Bauhaus style)
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 68px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(tape.id === "student-life" ? "04" : "08", 24, 76);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("SWISS MODERNISM", 112, 44);
  ctx.font = "9px monospace";
  ctx.fillText("ARCHIVE VOL. 26 // HELVETICA", 112, 60);

  // Diagonal Black/White Hazard Tape Strip
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 134, w, 6);

  // Sharp Rectangular Image Frame
  const pX = 24;
  const pY = 152;
  const pW = w - 48;
  const pH = 175;

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(pX - 1, pY - 1, pW + 2, pH + 2);
  drawClippedImage(ctx, img, pX, pY, pW, pH, tape.code, "#ffffff");

  // Inset Stark White Badge
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(pX + 8, pY + 8, 80, 18);
  ctx.fillStyle = "#000000";
  ctx.font = "900 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(tape.code, pX + 48, pY + 21);

  // Massive Grotesque Sans Headline Title
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 27px sans-serif";
  drawTitleLines(ctx, tape.title, 26, 362, 28);

  // Typographic Spec Divider
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, 424);
  ctx.lineTo(w - 24, 424);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "9px monospace";
  ctx.fillText(`DISCIPLINE: ${tape.categoryFilter.toUpperCase()} • YEAR: ${tape.year}`, 26, 440);

  // Authentic Barcode with numbers
  drawBarcode(ctx, 24, 452, 140, 24, 8821 + tape.id.length, "#ffffff");
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 12px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("CH-8001", w - 24, 470);
}

// ============================================================================
// ARCHETYPE 4: EXPEDITION / TOPOGRAPHIC SURVEY (Gunung Gede, Nusantara Obs)
// ============================================================================
function drawExpeditionCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject,
  img?: HTMLImageElement | null
) {
  const isMountain = tape.id === "gunung-gede";
  ctx.fillStyle = isMountain ? "#221913" : "#141e15";
  ctx.fillRect(0, 0, w, h);
  drawWear(ctx, w, h, 1888 + tape.id.length * 13);

  // Faint Topographic Contour Curves / Celestial Rings
  const brass = "#d97706";
  const brassDim = "rgba(217, 119, 6, 0.25)";
  ctx.strokeStyle = brassDim;
  ctx.lineWidth = 1;
  for (let r = 50; r <= 220; r += 42) {
    ctx.beginPath();
    ctx.arc(w / 2, 180, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Header: Expedition Field Log
  ctx.fillStyle = brass;
  ctx.font = "bold 10px serif";
  ctx.textAlign = "center";
  ctx.fillText(
    isMountain
      ? "★ GEOGRAPHIC SURVEY • EXPEDITION ARCHIVE ★"
      : "★ ASTRONOMICAL OBSERVATION ARCHIVE ★",
    w / 2,
    42
  );

  // Vintage Specimen Photo Frame with Photo Mounting Corners
  const pX = 28;
  const pY = 54;
  const pW = w - 56;
  const pH = 236;

  ctx.strokeStyle = "rgba(217, 119, 6, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pX, pY, pW, pH);
  drawClippedImage(ctx, img, pX + 1, pY + 1, pW - 2, pH - 2, tape.code, brass);

  // 4 Photo Mounting Corner Tabs (Triangles)
  const drawCornerTab = (cx: number, cy: number, dx: number, dy: number) => {
    ctx.fillStyle = "rgba(217, 119, 6, 0.85)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + dx * 14, cy);
    ctx.lineTo(cx, cy + dy * 14);
    ctx.closePath();
    ctx.fill();
  };
  drawCornerTab(pX, pY, 1, 1);
  drawCornerTab(pX + pW, pY, -1, 1);
  drawCornerTab(pX, pY + pH, 1, -1);
  drawCornerTab(pX + pW, pY + pH, -1, -1);

  // Circular Rubber Stamp Overlay
  ctx.save();
  ctx.translate(pX + pW - 55, pY + pH - 50);
  ctx.rotate(-0.18);
  ctx.strokeStyle = "rgba(217, 119, 6, 0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(217, 119, 6, 0.85)";
  ctx.font = "bold 7px serif";
  ctx.textAlign = "center";
  ctx.fillText("FIELD SPECIMEN", 0, -8);
  ctx.fillText("★ APPROVED ★", 0, 4);
  ctx.fillText("SERIES 1984", 0, 16);
  ctx.restore();

  // Rugged Explorer Serif Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#f5ede0";
  ctx.font = "bold 24px serif";
  drawTitleLines(ctx, tape.title, w / 2, 332, 27);

  // Expedition Coordinates Subtitle
  ctx.fillStyle = brass;
  ctx.font = "bold 10px monospace";
  ctx.fillText(
    isMountain ? "06°47'24\"S 106°59'12\"E • ELEV. 2,958M" : "07°49'S 110°21'E • CELESTIAL SPEC",
    w / 2,
    396
  );

  ctx.fillStyle = "rgba(245, 237, 224, 0.6)";
  ctx.font = "9px monospace";
  ctx.fillText("ARCHIVAL SPECIMEN • THREE.JS 3D", w / 2, 414);

  // Bottom Archival Badges
  ctx.strokeStyle = brassDim;
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 442, 64, 22);
  ctx.fillStyle = brass;
  ctx.font = "bold 10px serif";
  ctx.fillText("EXPEDITION", 60, 457);

  ctx.fillStyle = "#f5ede0";
  ctx.font = "11px monospace";
  ctx.fillText(`[ ${tape.year} ]`, w / 2, 457);

  ctx.strokeStyle = brassDim;
  ctx.strokeRect(w - 92, 442, 64, 22);
  ctx.fillStyle = brass;
  ctx.font = "bold 10px serif";
  ctx.fillText("SPEC. 84", w - 60, 457);
}

// ============================================================================
// ARCHETYPE 5: NEO-ARCADE SYNTHWAVE (Street Rush)
// ============================================================================
function drawArcadeCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject,
  img?: HTMLImageElement | null
) {
  ctx.fillStyle = "#07070b";
  ctx.fillRect(0, 0, w, h);
  drawWear(ctx, w, h, 1986);

  // Racing Checkerboard Bands along top and bottom
  const drawCheckers = (y: number, hgt: number) => {
    const sz = 8;
    const cols = Math.ceil(w / sz);
    const rows = Math.ceil(hgt / sz);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? "#facc15" : "#000000";
        ctx.fillRect(c * sz, y + r * sz, sz, sz);
      }
    }
  };
  drawCheckers(12, 16);
  drawCheckers(h - 28, 16);

  // Header: Retro Arcade
  ctx.fillStyle = "#f43f5e";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("★ 16-BIT RETRO ARCADE CLASSIC ★", w / 2, 46);

  // Image Frame with Neon Magenta Glow
  const pX = 24;
  const pY = 56;
  const pW = w - 48;
  const pH = 236;

  ctx.strokeStyle = "#f43f5e";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(pX, pY, pW, pH);
  drawClippedImage(ctx, img, pX + 1, pY + 1, pW - 2, pH - 2, tape.code, "#facc15");

  // Arcade High Score Pill
  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  ctx.fillRect(pX + 8, pY + 8, 130, 20);
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 1;
  ctx.strokeRect(pX + 8, pY + 8, 130, 20);
  ctx.fillStyle = "#facc15";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("★ HI-SCORE: 999900 ★", pX + 73, pY + 22);

  // Slanted Arcade Speed Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#facc15";
  ctx.font = "italic 900 28px sans-serif";
  drawTitleLines(ctx, tape.title, w / 2, 332, 28);

  ctx.fillStyle = "#f43f5e";
  ctx.font = "italic bold 11px monospace";
  ctx.fillText("CHALLENGER STAGE 01 // OVERDRIVE", w / 2, 396);

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "9px monospace";
  ctx.fillText("INSERT COIN 25¢ • STEREO AUDIO", w / 2, 414);

  // Bottom Arcade Coin-Op Badges
  ctx.fillStyle = "#f43f5e";
  ctx.font = "900 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("16-BIT", 28, 448);

  ctx.textAlign = "center";
  ctx.fillStyle = "#facc15";
  ctx.fillText(`[ ${tape.year} ]`, w / 2, 448);

  ctx.textAlign = "right";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("COIN-OP", w - 28, 448);
}

// ============================================================================
// ARCHETYPE 6: ECO-MODERN BOTANICAL (Ecobite)
// ============================================================================
function drawEcoCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject,
  img?: HTMLImageElement | null
) {
  ctx.fillStyle = "#0c1f15";
  ctx.fillRect(0, 0, w, h);
  drawWear(ctx, w, h, 2026);

  const mint = "#34d399";
  const mintDim = "rgba(52, 211, 153, 0.4)";

  // Clean Scandinavian border
  ctx.strokeStyle = mintDim;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  // Header: Sustainable IoT
  ctx.fillStyle = mint;
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText("🌿 CIRCULAR IOT INTELLIGENCE • ZERO WASTE", w / 2, 42);

  // Image Frame
  const pX = 26;
  const pY = 54;
  const pW = w - 52;
  const pH = 236;

  ctx.strokeStyle = mint;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pX, pY, pW, pH);
  drawClippedImage(ctx, img, pX + 1, pY + 1, pW - 2, pH - 2, tape.code, mint);

  // Recycled Badge Pill
  ctx.fillStyle = "rgba(12, 31, 21, 0.9)";
  ctx.fillRect(pX + 8, pY + 8, 134, 20);
  ctx.strokeStyle = mint;
  ctx.lineWidth = 1;
  ctx.strokeRect(pX + 8, pY + 8, 134, 20);
  ctx.fillStyle = mint;
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("♻ 100% CIRCULAR TECH", pX + 75, pY + 22);

  // Clean Neo-Grotesque Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  drawTitleLines(ctx, tape.title, w / 2, 332, 28);

  ctx.fillStyle = mint;
  ctx.font = "10px monospace";
  ctx.fillText("SMART PANTRY • REAL-TIME SPOILAGE", w / 2, 396);

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "9px monospace";
  ctx.fillText("ECOBITE IOT SENSOR ARCHIVE", w / 2, 414);

  // Bottom Badges
  ctx.strokeStyle = mintDim;
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 442, 60, 22);
  ctx.fillStyle = mint;
  ctx.font = "bold 10px monospace";
  ctx.fillText("ECO SPEC", 58, 457);

  ctx.fillStyle = "#ffffff";
  ctx.font = "11px monospace";
  ctx.fillText(String(tape.year), w / 2, 457);

  ctx.strokeStyle = mintDim;
  ctx.strokeRect(w - 88, 442, 60, 22);
  ctx.fillStyle = mint;
  ctx.font = "bold 10px monospace";
  ctx.fillText("CERTIFIED", w - 58, 457);
}

/**
 * Dispatches drawing to the bespoke archetype.
 */
function drawFrontCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject,
  img?: HTMLImageElement | null
) {
  const archetype = getSleeveArchetype(tape);
  switch (archetype) {
    case "editorial":
      return drawEditorialCover(ctx, w, h, tape, img);
    case "cyber":
      return drawCyberCover(ctx, w, h, tape, img);
    case "swiss":
      return drawSwissCover(ctx, w, h, tape, img);
    case "expedition":
      return drawExpeditionCover(ctx, w, h, tape, img);
    case "arcade":
      return drawArcadeCover(ctx, w, h, tape, img);
    case "eco":
      return drawEcoCover(ctx, w, h, tape, img);
  }
}

/**
 * Draws the vertical spine on the left side of the sleeve according to archetype.
 * Dimensions: 96 x 512.
 */
function drawSpine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tape: TapeProject
) {
  const archetype = getSleeveArchetype(tape);

  if (archetype === "editorial") {
    ctx.fillStyle = tape.color || "#1a1614";
    ctx.fillRect(0, 0, w, h);
    drawWear(ctx, w, h, 8888 + tape.id.length);

    const gold = "#d4af37";
    ctx.fillStyle = gold;
    ctx.font = "italic bold 13px serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ VHS ✦", w / 2, 44);

    ctx.fillStyle = "rgba(212, 175, 55, 0.7)";
    ctx.font = "bold 10px monospace";
    ctx.fillText(tape.code, w / 2, 72);

    ctx.save();
    ctx.translate(w / 2, 270);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#fcf9f2";
    ctx.font = "bold 16px serif";
    ctx.textAlign = "center";
    ctx.fillText(tape.title.toUpperCase(), 0, 5);
    ctx.restore();

    ctx.fillStyle = gold;
    ctx.font = "11px serif";
    ctx.fillText(`VOL. ${tape.year}`, w / 2, h - 30);
    return;
  }

  if (archetype === "cyber") {
    ctx.fillStyle = "#090d15";
    ctx.fillRect(0, 0, w, h);
    drawWear(ctx, w, h, 7777 + tape.id.length);

    const cyan = "#38bdf8";
    ctx.fillStyle = cyan;
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("SYS.REC", w / 2, 44);

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 10px monospace";
    ctx.fillText(tape.code, w / 2, 70);

    ctx.save();
    ctx.translate(w / 2, 260);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = cyan;
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "center";
    ctx.fillText(tape.title.toUpperCase(), 0, 5);
    ctx.restore();

    drawBarcode(ctx, 16, h - 70, w - 32, 24, 666 + tape.id.length, cyan);
    ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
    ctx.font = "9px monospace";
    ctx.fillText(String(tape.year), w / 2, h - 25);
    return;
  }

  if (archetype === "swiss") {
    const isRed = tape.id === "student-life";
    const bannerCol = isRed ? "#dc2626" : "#2563eb";
    ctx.fillStyle = "#161618";
    ctx.fillRect(0, 0, w, h);

    // Top color band
    ctx.fillStyle = bannerCol;
    ctx.fillRect(0, 0, w, 110);
    drawWear(ctx, w, h, 5555 + tape.id.length);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tape.id === "student-life" ? "04" : "08", w / 2, 54);

    ctx.font = "bold 10px sans-serif";
    ctx.fillText("SWISS", w / 2, 80);

    ctx.save();
    ctx.translate(w / 2, 280);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 17px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tape.title.toUpperCase(), 0, 5);
    ctx.restore();

    drawBarcode(ctx, 14, h - 65, w - 28, 22, 1122 + tape.id.length, "#ffffff");
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "bold 10px monospace";
    ctx.fillText(String(tape.year), w / 2, h - 22);
    return;
  }

  if (archetype === "expedition") {
    const isMountain = tape.id === "gunung-gede";
    ctx.fillStyle = isMountain ? "#221913" : "#141e15";
    ctx.fillRect(0, 0, w, h);
    drawWear(ctx, w, h, 4444 + tape.id.length);

    const brass = "#d97706";
    ctx.fillStyle = brass;
    ctx.font = "bold 12px serif";
    ctx.textAlign = "center";
    ctx.fillText("★ SURVEY ★", w / 2, 44);

    ctx.fillStyle = "#f5ede0";
    ctx.font = "bold 10px monospace";
    ctx.fillText(tape.code, w / 2, 70);

    ctx.save();
    ctx.translate(w / 2, 270);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#f5ede0";
    ctx.font = "bold 15px serif";
    ctx.textAlign = "center";
    ctx.fillText(tape.title.toUpperCase(), 0, 5);
    ctx.restore();

    ctx.fillStyle = brass;
    ctx.font = "bold 10px serif";
    ctx.fillText(`VOL. ${tape.year}`, w / 2, h - 30);
    return;
  }

  if (archetype === "arcade") {
    ctx.fillStyle = "#07070b";
    ctx.fillRect(0, 0, w, h);
    drawWear(ctx, w, h, 3333);

    ctx.fillStyle = "#facc15";
    ctx.font = "900 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ARCADE", w / 2, 44);

    ctx.fillStyle = "#f43f5e";
    ctx.font = "bold 10px monospace";
    ctx.fillText("16-BIT", w / 2, 68);

    ctx.save();
    ctx.translate(w / 2, 270);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#facc15";
    ctx.font = "italic 900 17px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tape.title.toUpperCase(), 0, 5);
    ctx.restore();

    ctx.fillStyle = "#f43f5e";
    ctx.font = "900 12px sans-serif";
    ctx.fillText("COIN-OP", w / 2, h - 30);
    return;
  }

  // Eco archetype
  ctx.fillStyle = "#0c1f15";
  ctx.fillRect(0, 0, w, h);
  drawWear(ctx, w, h, 2222);

  const mint = "#34d399";
  ctx.fillStyle = mint;
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "center";
  ctx.fillText("♻ ECO", w / 2, 44);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px monospace";
  ctx.fillText(tape.code, w / 2, 68);

  ctx.save();
  ctx.translate(w / 2, 270);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(tape.title.toUpperCase(), 0, 5);
  ctx.restore();

  ctx.fillStyle = mint;
  ctx.font = "bold 10px monospace";
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
