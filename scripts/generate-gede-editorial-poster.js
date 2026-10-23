const { chromium } = require("playwright");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Preparing high-contrast archival images for Gunung Gede...");

  // 1. Prepare left archival image: Centered Mount Gede badge with rainforest stream
  const trailBuffer = await sharp("public/projects/Gunung-Gede.webp")
    .extract({ left: 180, top: 50, width: 950, height: 750 })
    .resize(1120, 600, { fit: "cover" })
    .grayscale()
    .linear(1.35, -25) // Boost contrast
    .toBuffer();

  const trailB64 = `data:image/png;base64,${trailBuffer.toString("base64")}`;

  // 2. Prepare right archival image: Mossy hillside & canopy sunlight
  const peakBuffer = await sharp("public/projects/Gunung-Gede.webp")
    .extract({ left: 1050, top: 50, width: 482, height: 750 })
    .resize(520, 600, { fit: "cover" })
    .grayscale()
    .linear(1.4, -25)
    .toBuffer();

  const peakB64 = `data:image/png;base64,${peakBuffer.toString("base64")}`;

  // 3. Extract ONLY the pristine header and footer from Araki Poster.png (Exact pixel bounds: NO ghost text!)
  console.log("Extracting pristine header and footer bounds from Araki Poster...");
  // Header: y: 0 to 236 (Home video + 2 horizontal rules)
  const arakiHeaderBuf = await sharp("public/projects/Araki Poster.png")
    .extract({ left: 0, top: 0, width: 1696, height: 236 })
    .toBuffer();
  const arakiHeaderB64 = `data:image/png;base64,${arakiHeaderBuf.toString("base64")}`;

  // Footer: y: 2295 to 2528 (VHS badge, 2026, reel logo)
  const arakiFooterBuf = await sharp("public/projects/Araki Poster.png")
    .extract({ left: 0, top: 2295, width: 1696, height: 233 })
    .toBuffer();
  const arakiFooterB64 = `data:image/png;base64,${arakiFooterBuf.toString("base64")}`;

  // 4. HTML Template for the Poster using Google Fonts
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cinzel:wght@700;900&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1696px;
      height: 2528px;
      background-color: #0b0c0e;
      color: #ebe7de;
      font-family: 'Playfair Display', 'Bodoni Moda', Georgia, serif;
      position: relative;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Outer border rule */
    .outer-frame {
      position: absolute;
      inset: 24px;
      border: 2px solid rgba(235, 231, 222, 0.45);
      pointer-events: none;
      z-index: 10;
    }

    /* Top header */
    .header-block {
      position: absolute;
      top: 0;
      left: 0;
      width: 1696px;
      height: 236px;
      background: url('${arakiHeaderB64}') no-repeat center;
      background-size: 1696px 236px;
      z-index: 5;
    }

    /* Big Top Title: GEDE. */
    .top-title {
      position: absolute;
      top: 250px;
      left: 70px;
      right: 70px;
      height: 550px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      letter-spacing: -0.04em;
    }
    .top-title h1 {
      font-family: 'Bodoni Moda', 'Playfair Display', serif;
      font-size: 430px;
      font-weight: 900;
      line-height: 0.82;
      color: #ebe7de;
      text-transform: uppercase;
      margin: 0;
      width: 100%;
      text-align: justify;
      text-align-last: justify;
      display: flex;
      justify-content: space-between;
    }
    .top-title span {
      display: inline-block;
    }

    /* Middle Archival Photo Collage */
    .middle-strip {
      position: absolute;
      top: 830px;
      left: 36px;
      right: 36px;
      height: 600px;
      display: flex;
      gap: 12px;
      border-top: 2px solid rgba(235, 231, 222, 0.6);
      border-bottom: 2px solid rgba(235, 231, 222, 0.6);
      padding: 10px 0;
    }

    .photo-box-left {
      position: relative;
      flex: 2.15;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(235, 231, 222, 0.3);
      background: #000;
    }
    .photo-box-left img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: contrast(1.3) brightness(0.95);
    }
    /* Horizontal scanlines overlay across photo */
    .scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.4) 0px,
        rgba(0, 0, 0, 0.4) 2px,
        transparent 2px,
        transparent 4px
      );
      pointer-events: none;
    }

    /* Corner stamp badge inside photo */
    .badge-stamp {
      position: absolute;
      top: 24px;
      left: 24px;
      background: rgba(11, 12, 14, 0.88);
      border: 1.5px solid #ebe7de;
      padding: 8px 16px;
      font-family: 'Courier Prime', monospace;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #ebe7de;
      text-transform: uppercase;
    }

    .photo-box-right {
      position: relative;
      flex: 1;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(235, 231, 222, 0.3);
      background: #000;
    }
    .photo-box-right img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: contrast(1.35) brightness(0.92);
    }

    .photo-right-tag {
      position: absolute;
      bottom: 20px;
      right: 20px;
      text-align: right;
      font-family: 'Courier Prime', monospace;
      font-size: 14px;
      color: #ebe7de;
      letter-spacing: 2px;
      line-height: 1.5;
      background: rgba(11, 12, 14, 0.85);
      padding: 6px 12px;
      border: 1px solid rgba(235, 231, 222, 0.4);
    }

    /* Middle Divider Bar */
    .middle-divider {
      position: absolute;
      top: 1450px;
      left: 64px;
      right: 64px;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .watermark-text {
      font-family: 'Bodoni Moda', serif;
      font-size: 110px;
      font-weight: 900;
      color: #1e2025;
      letter-spacing: -0.02em;
      text-transform: lowercase;
      user-select: none;
    }
    .middle-meta {
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .meta-lines {
      font-family: 'Courier Prime', monospace;
      font-size: 18px;
      line-height: 1.6;
      color: #a8a49c;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .star-glyph {
      font-size: 48px;
      color: #ebe7de;
    }

    /* Lower Big Title: GUNUNG / GEDE PANGRANGO */
    .lower-title {
      position: absolute;
      top: 1590px;
      left: 70px;
      right: 70px;
      height: 680px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
    .lower-hero-text {
      font-family: 'Bodoni Moda', 'Playfair Display', serif;
      font-size: 310px;
      font-weight: 900;
      line-height: 0.85;
      color: #ebe7de;
      text-transform: uppercase;
      letter-spacing: -0.04em;
      width: 100%;
      text-align: justify;
      text-align-last: justify;
      display: flex;
      justify-content: space-between;
    }
    .lower-hero-text span {
      display: inline-block;
    }

    .lower-sub-banner {
      width: 100%;
      margin-top: 18px;
      border-top: 2.5px solid #ebe7de;
      border-bottom: 2.5px solid #ebe7de;
      padding: 14px 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .lower-sub-banner h2 {
      font-family: 'Cinzel', 'Playfair Display', serif;
      font-size: 78px;
      font-weight: 900;
      letter-spacing: 0.22em;
      color: #ebe7de;
      text-transform: uppercase;
      margin: 0;
      padding-left: 0.22em; /* compensate tracking */
    }

    /* Bottom Footer Badges */
    .footer-block {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 1696px;
      height: 233px;
      background: url('${arakiFooterB64}') no-repeat center;
      background-size: 1696px 233px;
      z-index: 5;
    }
  </style>
</head>
<body>
  <div class="outer-frame"></div>

  <!-- 1. Header (Afc Home Video) -->
  <div class="header-block"></div>

  <!-- 2. Top Title: GEDE. -->
  <div class="top-title">
    <h1>
      <span>G</span>
      <span>E</span>
      <span>D</span>
      <span>E</span>
      <span>.</span>
    </h1>
  </div>

  <!-- 3. Middle Archival Photo Collage Strip -->
  <div class="middle-strip">
    <div class="photo-box-left">
      <img src="${trailB64}" />
      <div class="scanlines"></div>
      <div class="badge-stamp">SURYA KENCANA • 2.958 MDPL</div>
    </div>
    <div class="photo-box-right">
      <img src="${peakB64}" />
      <div class="scanlines"></div>
      <div class="photo-right-tag">
        EXPEDITION ARCHIVE<br/>
        TAMAN NASIONAL
      </div>
    </div>
  </div>

  <!-- 4. Middle Divider Bar -->
  <div class="middle-divider">
    <div class="watermark-text">gede.</div>
    <div class="middle-meta">
      <div class="meta-lines">
        <div>□ 3D TOPOGRAPHIC TRAIL SIMULATION</div>
        <div>□ GUNUNG PUTRI - SURYA KENCANA ROUTE</div>
      </div>
      <div class="star-glyph">★</div>
    </div>
  </div>

  <!-- 5. Lower Hero Title: GUNUNG / GEDE PANGRANGO -->
  <div class="lower-title">
    <div class="lower-hero-text">
      <span>G</span>
      <span>U</span>
      <span>N</span>
      <span>U</span>
      <span>N</span>
      <span>G</span>
    </div>
    <div class="lower-sub-banner">
      <h2>GEDE PANGRANGO</h2>
    </div>
  </div>

  <!-- 6. Bottom Footer (VHS, 2026, Film Reel Emblem) -->
  <div class="footer-block"></div>
</body>
</html>
  `;

  fs.writeFileSync("scripts/temp_gede_poster.html", htmlContent);

  console.log("Rendering poster via Playwright Chromium at 1696x2528...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1696, height: 2528 },
    deviceScaleFactor: 1,
  });

  await page.setContent(htmlContent, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(600);

  const rawPosterPath = "public/projects/Gunung Gede Poster.png";
  await page.screenshot({ path: rawPosterPath, type: "png" });
  await browser.close();
  console.log("Raw poster rendered to:", rawPosterPath);

  // 7. Add authentic distressed border wear & scratches (Only fine dust & scratches, NO ghost text)
  console.log("Compositing authentic edge wear and fine dust...");
  
  const dustSvg = `<svg width="1696" height="2528" viewBox="0 0 1696 2528" xmlns="http://www.w3.org/2000/svg">
    <!-- Fine scratches across surface -->
    <path d="M 120 400 L 280 620 M 1400 350 L 1280 580 M 340 1800 L 520 2100 M 1150 1700 L 1320 1950" stroke="#ffffff" stroke-width="0.8" opacity="0.12"/>
    <path d="M 600 200 L 720 380 M 900 1400 L 820 1650 M 1500 1200 L 1380 1480" stroke="#ffffff" stroke-width="0.6" opacity="0.10"/>
    <path d="M 80 1200 L 220 1380 M 800 2200 L 950 2400" stroke="#ffffff" stroke-width="0.7" opacity="0.10"/>
    
    <!-- Authentic corner edge scuffs -->
    <path d="M 30 50 Q 80 40 140 55" stroke="#ffffff" stroke-width="2" opacity="0.18" fill="none"/>
    <path d="M 1660 50 Q 1610 40 1550 55" stroke="#ffffff" stroke-width="2" opacity="0.18" fill="none"/>
    <path d="M 30 2480 Q 90 2490 160 2475" stroke="#ffffff" stroke-width="2.2" opacity="0.22" fill="none"/>
    <path d="M 1660 2480 Q 1600 2490 1530 2475" stroke="#ffffff" stroke-width="2.2" opacity="0.22" fill="none"/>
    
    <!-- Horizontal tape crease marks -->
    <line x1="30" y1="830" x2="1666" y2="830" stroke="#ffffff" stroke-width="1.2" opacity="0.15"/>
    <line x1="30" y1="1440" x2="1666" y2="1440" stroke="#ffffff" stroke-width="1.2" opacity="0.15"/>
    <line x1="30" y1="1585" x2="1666" y2="1585" stroke="#ffffff" stroke-width="1.2" opacity="0.15"/>
  </svg>`;

  const dustBuf = await sharp(Buffer.from(dustSvg))
    .png()
    .toBuffer();

  const finalPosterBuf = await sharp(rawPosterPath)
    .composite([
      {
        input: dustBuf,
        blend: "screen",
      },
    ])
    .toBuffer();

  await sharp(finalPosterBuf).toFile(rawPosterPath);
  console.log("Updated final Gunung Gede Poster.png!");

  // 8. Generate 3D VHS Cassette Textures (Front & Spine)
  console.log("Generating 3D VHS Cassette Textures (Front & Spine)...");
  // Front: 1040 x 1568
  await sharp(rawPosterPath)
    .resize(1040, 1568, { fit: "cover" })
    .webp({ quality: 90 })
    .toFile("public/tapes/gunung-gede-front.webp");

  // Spine: 112 x 1568 with dark obsidian background, vertical title "GEDE • GUNUNG PANGRANGO", code "FRA_11"
  const spineSvg = `<svg width="112" height="1568" viewBox="0 0 112 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="112" height="1568" fill="#0b0c0e"/>
    
    <!-- Outer hairline borders -->
    <rect x="8" y="16" width="96" height="1536" fill="none" stroke="#ebe7de" stroke-width="1.2" opacity="0.3"/>
    
    <!-- Top Index Number -->
    <text x="56" y="90" font-family="'Bodoni Moda', serif" font-size="34" font-weight="900" fill="#ebe7de" text-anchor="middle">11</text>
    <line x1="28" y1="125" x2="84" y2="125" stroke="#ebe7de" stroke-width="1" opacity="0.4"/>
    
    <!-- Rotated Spine Title -->
    <g transform="translate(56, 820) rotate(90)">
      <text x="0" y="8" font-family="'Cinzel', serif" font-size="34" font-weight="900" fill="#ebe7de" letter-spacing="12" text-anchor="middle">GEDE • PANGRANGO</text>
    </g>
    
    <!-- Bottom Brand & Format -->
    <line x1="28" y1="1440" x2="84" y2="1440" stroke="#ebe7de" stroke-width="1" opacity="0.4"/>
    <text x="56" y="1475" font-family="'Courier Prime', monospace" font-size="14" font-weight="bold" fill="#ebe7de" letter-spacing="2" text-anchor="middle">VHS</text>
    <text x="56" y="1505" font-family="'Courier Prime', monospace" font-size="12" fill="#a8a49c" letter-spacing="2" text-anchor="middle">2026</text>
  </svg>`;

  await sharp(Buffer.from(spineSvg))
    .webp({ quality: 90 })
    .toFile("public/tapes/gunung-gede-spine.webp");

  console.log("Gunung Gede front and spine webp updated successfully!");
}

main().catch(console.error);
