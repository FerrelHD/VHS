# High-Performance 60/120 FPS Carousel & CRT Pipeline Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate main-thread React re-render chokepoints during swipe, remove 36 redundant WebGL textures, optimize CRT post-processing memory bandwidth by 50%, and implement luxurious physics-based momentum fling for butter-smooth carousel interaction.

**Architecture:** 
1. Decouple drag position from React state by driving Three.js carousel movement entirely through `useFrame` and mutable refs (`targetOffsetRef`, `velocityTracker`), notifying React state only on settled index changes.
2. Centralize shared geometries and VHS cassette PBR textures into singleton module-level caches, reducing WebGL texture instances from 40 to 4.
3. Optimize offscreen FBO render target in `BentPostProcessing` from 16-bit half-float to 8-bit unsigned byte with zero-sample MSAA overhead, eliminating GPU bandwidth waste.
4. Promote animated CRT overlay layers (`.grain-layer`, `.vhs-crt-roll`) to isolated GPU compositor layers.

**Tech Stack:** Next.js 15, React 19, Three.js, React Three Fiber, Tailwind CSS

**Spec:** Discussion in conversation thread and analysis of Arc Marumo's production engine (`09ouw4cybbr0h.js` & `0qxtffwpvg0u2.js`).

## Global Constraints
- Strict Anti-Slop Rule: Under NO circumstances use em dashes (—) anywhere in conversation or code.
- Zero visual degradation: All tactile VHS details (screws, ribs, glossy window, nylon reels) and CRT barrel distortion must remain visually indistinguishable from current look.
- Maintain infinite circular carousel loop without boundary snapping glitches.

## Review Focus
1. Rapid mouse drag / touch swipe causing dropped frames: verified via 120 FPS drag test with zero React re-renders during motion.
2. Texture memory leak / WebGL context loss: verified by inspecting WebGL texture count in memory (must be 4 shared cassette textures instead of 40).
3. Index sync desynchronization: HUD subtitle and status bar must stay 100% in sync with the center tape when carousel settles.
4. Post-processing optical curvature: Barrel distortion on pillowed CRT corners must remain sharp without color banding or precision loss.
5. Window resize / DPR changes: Offscreen FBO must resize smoothly without resizing every frame.

---

### Task 1: Singleton Geometry & Cassette Texture Cache in `TapeMesh.tsx`

**Files:**
- Modify: `src/components/deck/TapeMesh.tsx`

**Description:**
Currently, each of the 10 `TapeMesh` instances loads its own 4 cassette textures (`front`, `normal`, `roughness`, `top`) and creates 2 `BoxGeometry` objects inline. We will hoist shared geometries and a singleton texture/material cache to module level.

- [ ] Step 1: Create module-level static singletons for `SHARED_CASE_GEOMETRY` and `SHARED_TAPE_GEOMETRY`.
- [ ] Step 2: Implement a singleton texture loader `getCassetteTextures()` and `getCassetteMaterials()` that instantiates the 4 WebGL textures and materials exactly once across all tapes.
- [ ] Step 3: Update `TapeMesh` to use `SHARED_CASE_GEOMETRY` and `SHARED_TAPE_GEOMETRY` instead of inline `<boxGeometry />` tags.
- [ ] Step 4: Remove redundant `castShadow` and `receiveShadow` flags from tape meshes since shadow maps are not enabled on the canvas.
- [ ] Step 5: Test TypeScript compilation (`npx tsc --noEmit`).
- [ ] Step 6: Commit changes with message `perf(deck): convert cassette geometries and textures to shared singletons`.

---

### Task 2: Decouple Drag Physics & Implement Momentum Fling in `TapeDeck.tsx`

**Files:**
- Modify: `src/components/deck/TapeDeck.tsx`
- Modify: `src/lib/math.ts`

**Description:**
Remove `setTargetOffset` from `handlePointerMove`. Drive carousel tracking via mutable refs and a damped spring with release fling velocity (modeled after Arc Marumo's `springTo` and `releaseSpeed`). React state updates will only fire when the carousel crosses an active slot or settles.

- [ ] Step 1: In `src/lib/math.ts`, add spring physics helper `springTo(x, v, target, dt, stiffness, damping)` with calibrated critically-damped spring coefficients.
- [ ] Step 2: In `TapeDeck.tsx`, replace `targetOffset` React state with `targetOffsetRef`. Provide a lightweight listener or sync mechanism to `TapeCarousel`.
- [ ] Step 3: In `handlePointerMove`, update `targetOffsetRef.current` directly without calling `setTargetOffset`. Track drag velocity `dragVelocity = (currentX - lastX) / dt`.
- [ ] Step 4: In `handlePointerUp`, apply fling release speed with clamped max velocity (`FLING_MAX = 4200`), computing the natural settle slot target.
- [ ] Step 5: In `useFrame`, animate position using smooth spring-damping physics, updating the active index only when crossing slot midpoints.
- [ ] Step 6: Test TypeScript compilation (`npx tsc --noEmit`).
- [ ] Step 7: Commit changes with message `perf(deck): decouple drag loop from react state and implement spring fling physics`.

---

### Task 3: Optimize CRT Post-Processing FBO Buffer in `BentPostProcessing.tsx`

**Files:**
- Modify: `src/components/deck/BentPostProcessing.tsx`

**Description:**
Halve the GPU bandwidth of the offscreen barrel distortion pass by switching `WebGLRenderTarget` from `HalfFloatType` (16-bit) to `UnsignedByteType` (8-bit) with `samples: 0`, and eliminate redundant per-frame `setSize` checks.

- [ ] Step 1: Change `renderTarget` configuration in `BentPostProcessing.tsx` to `type: THREE.UnsignedByteType` and `samples: 0`.
- [ ] Step 2: Use `useThree((state) => state.size)` and `state.viewport.dpr` with a dedicated `useEffect` or dimension check to only resize the render target when viewport dimensions actually change.
- [ ] Step 3: Test TypeScript compilation (`npx tsc --noEmit`).
- [ ] Step 4: Commit changes with message `perf(crt): optimize offscreen fbo target to unsigned byte with zero samples`.

---

### Task 4: Hardware-Accelerate CRT Scanline & Grain Overlays in `globals.css`

**Files:**
- Modify: `src/app/globals.css`

**Description:**
Isolate `.grain-layer` and `.vhs-crt-roll` into their own GPU compositing layers so CSS keyframe animations do not cause repaint or composite tree invalidation on the main thread.

- [ ] Step 1: Add `will-change: transform; transform: translateZ(0);` and `backface-visibility: hidden;` to `.grain-layer`.
- [ ] Step 2: Add `will-change: transform; transform: translateZ(0);` to `.vhs-crt-roll`.
- [ ] Step 3: Test rendering in browser to verify that grain and roll animations remain smooth without CPU spikes.
- [ ] Step 4: Commit changes with message `perf(crt): promote grain and roll overlay animations to gpu compositor layers`.

---

### Task 5: End-to-End Verification & High-Refresh Rate Drag Benchmark

**Files:**
- Test script: `scratch/benchmark_drag_smoothness.js`

**Description:**
Run automated Playwright benchmark simulating rapid continuous swipes and measure frame delta consistency and FPS to confirm 0 dropped frames.

- [ ] Step 1: Run `npx tsc --noEmit` to ensure zero type errors across the entire codebase.
- [ ] Step 2: Write and execute Playwright benchmark script tracking frame durations during intense carousel drag.
- [ ] Step 3: Verify that tape details, peek exposure, HUD subtitle sync, and keyboard navigation remain 100% intact.
- [ ] Step 4: Git status check and final summary report.
