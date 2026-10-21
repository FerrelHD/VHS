export const CRT_CONSTANTS = {
  K: 0.07, // Subtle, refined optical curvature matching Sony Trinitron PVM
  FADE: 0.06, // Gentle edge vignette fade
  SCANLINE_SPACING: 3, // Spacing between scanlines in px
  SCANLINE_COLOR: "rgba(0, 0, 0, 0.28)",
};

/**
 * Millimetric physical metrics for vertical portrait VHS sleeves & tape cassettes.
 */
export const VHS_METRICS = {
  CASE: { w: 130, h: 196, t: 30 },
  TAPE: { w: 120, h: 185, t: 25 },
  PEEK: 42, // Proud exposure of the twin spool windows and cassette label
  PEEK_IDLE: 14, // Subtle peek when unselected
  ARC_RADIUS: 900, // Radius of the tape carousel cylinder in 3D units
  SLOT_SPACING: 210, // Distance between consecutive vertical tapes along the arc
};

/**
 * Calculates 3D position and rotation on a cylindrical arc.
 */
export function onArc(offset: number, arcRadius = VHS_METRICS.ARC_RADIUS) {
  const angle = offset / arcRadius;
  return {
    x: arcRadius * Math.sin(angle),
    dropZ: arcRadius * (1 - Math.cos(angle)),
    rotationY: angle,
  };
}

/**
 * Inverts barrel distortion for mouse/touch raycasting.
 */
export function unbendPoint(
  screenX: number,
  screenY: number,
  rect: DOMRect,
  k = CRT_CONSTANTS.K
) {
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const nx = (screenX - rect.left - cx) / cx;
  const ny = (screenY - rect.top - cy) / cy;
  return {
    x: rect.left + cx + nx * (1 + k * ny * ny) * cx,
    y: rect.top + cy + ny * (1 + k * nx * nx) * cy,
  };
}

/**
 * Exponential decay spring physics.
 */
export function expDecay(current: number, target: number, speed: number, dt: number): number {
  return target + (current - target) * Math.exp(-speed * dt);
}
