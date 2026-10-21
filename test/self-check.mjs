import assert from "node:assert";

// 1. Math verification
const K = 0.16;
const FADE = 0.12;
const ARC_RADIUS = 950;

function onArc(offset, arcRadius = ARC_RADIUS) {
  const angle = offset / arcRadius;
  return {
    x: arcRadius * Math.sin(angle),
    dropZ: arcRadius * (1 - Math.cos(angle)),
    rotationY: angle,
  };
}

function unbendPoint(screenX, screenY, rect, k = K) {
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const nx = (screenX - rect.left - cx) / cx;
  const ny = (screenY - rect.top - cy) / cy;
  return {
    x: rect.left + cx + nx * (1 + k * ny * ny) * cx,
    y: rect.top + cy + ny * (1 + k * nx * nx) * cy,
  };
}

function expDecay(current, target, speed, dt) {
  return target + (current - target) * Math.exp(-speed * dt);
}

// Test 1: onArc at offset 0
const center = onArc(0);
assert.strictEqual(center.x, 0, "Center X must be 0");
assert.strictEqual(center.dropZ, 0, "Center dropZ must be 0");
assert.strictEqual(center.rotationY, 0, "Center rotationY must be 0");

// Test 2: onArc with positive offset
const right = onArc(100);
assert(right.x > 0, "Right X must be positive");
assert(right.dropZ > 0, "Right dropZ must be positive (dropping back into Z)");
assert(right.rotationY > 0, "Right rotation must be positive");

// Test 3: unbendPoint center remains center
const rect = { left: 0, top: 0, width: 800, height: 600 };
const unbentCenter = unbendPoint(400, 300, rect);
assert.strictEqual(Math.round(unbentCenter.x), 400, "Unbent center X must equal 400");
assert.strictEqual(Math.round(unbentCenter.y), 300, "Unbent center Y must equal 300");

// Test 4: unbendPoint corner gets expanded by K=0.16
const corner = unbendPoint(800, 600, rect);
// nx = 1, ny = 1 -> nx * (1 + 0.16) = 1.16 -> x = 400 + 1.16 * 400 = 864
assert.strictEqual(Math.round(corner.x), 864, "Corner X must be distorted by factor 1.16");
assert.strictEqual(Math.round(corner.y), 648, "Corner Y must be distorted by factor 1.16");

// Test 5: expDecay convergence
let val = 0;
for (let i = 0; i < 60; i++) {
  val = expDecay(val, 100, 10, 1 / 60);
}
assert(Math.abs(val - 100) < 0.1, "Exponential decay should converge to 100");

console.log("✓ All OldTape mathematical invariant checks passed cleanly!");

