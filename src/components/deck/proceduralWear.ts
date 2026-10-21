/**
 * Procedural wear and tear texture generator for cardboard VHS sleeves.
 * Recreates authentic cardboard scuffs, creases, and edge wear using PRNG.
 */
export function drawWear(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed = 20260
) {
  let s = seed;
  const rand = () => (s = (16807 * s) % 0x7fffffff) / 0x7fffffff;
  const wearCol = (alpha: number) => `rgba(238, 232, 218, ${alpha})`;

  // 1. Base cardboard handling patina
  ctx.fillStyle = "rgba(190, 160, 110, 0.08)";
  ctx.fillRect(0, 0, width, height);

  // 2. Radial vignette for cardboard depth
  const rad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0.3 * height,
    width / 2,
    height / 2,
    0.75 * height
  );
  rad.addColorStop(0, "rgba(0, 0, 0, 0)");
  rad.addColorStop(1, "rgba(10, 6, 2, 0.38)");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, width, height);

  // 3. Handling blotches / thumb patina
  for (let t = 0; t < 7; t++) {
    const cx = rand() * width;
    const cy = rand() * height;
    const r = 60 + 180 * rand();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, `rgba(40, 28, 14, ${0.06 + 0.08 * rand()})`);
    grad.addColorStop(1, "rgba(40, 28, 14, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  }

  // 4. Procedural scuffs along the cardboard borders
  const drawEdgeScuffs = (
    len: number,
    getCoord: (d: number, offset: number) => [number, number],
    vertical: boolean
  ) => {
    for (let d = 0; d < len; d += 2 + 5 * rand()) {
      if (rand() < 0.12) d += 60 * rand();
      const offset = Math.pow(rand(), 2.2) * 26;
      const [x, y] = getCoord(d, offset);
      const rx = 1.5 + rand() * (offset < 6 ? 7 : 3.5);
      const ry = 0.8 + 2.2 * rand();
      ctx.fillStyle = wearCol(offset < 5 ? 0.55 + 0.4 * rand() : 0.2 + 0.35 * rand());
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        vertical ? ry : rx,
        vertical ? rx : ry,
        (rand() - 0.5) * 0.6,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  // Scuff each of the 4 borders
  drawEdgeScuffs(width, (d, off) => [d, 4 + off], false);
  drawEdgeScuffs(width, (d, off) => [d, height - 4 - off], false);
  drawEdgeScuffs(height, (d, off) => [4 + off, d], true);
  drawEdgeScuffs(height, (d, off) => [width - 4 - off, d], true);
}

