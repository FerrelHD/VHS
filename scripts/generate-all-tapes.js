const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Helper to load image as base64 data URI
function getBase64Image(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return '';
  const ext = path.extname(fullPath).toLowerCase();
  const mime = ext === '.webp' ? 'image/webp' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(fullPath).toString('base64')}`;
}

// Generate realistic SVG Barcode lines
function svgBarcode(x, y, w, h, seed = 1234, color = '#ffffff') {
  let s = seed;
  const rand = () => (s = (16807 * s) % 0x7fffffff) / 0x7fffffff;
  let lines = '';
  let curX = x;
  while (curX < x + w - 6) {
    const barW = rand() > 0.5 ? 4 : 2;
    const gap = 2 + rand() * 4;
    lines += `<rect x="${curX.toFixed(1)}" y="${y}" width="${barW}" height="${h}" fill="${color}" opacity="0.9"/>`;
    curX += barW + gap;
  }
  return `<g>${lines}</g>`;
}

// Common distressed vintage cardboard textures & vignette
function svgVintageOverlay(w, h, seed = 999) {
  return `
    <defs>
      <linearGradient id="vignette-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
        <stop offset="25%" stop-color="#000000" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="vignette-bot" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.75"/>
        <stop offset="30%" stop-color="#000000" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${w}" height="8" fill="url(#vignette-top)"/>
    <rect x="0" y="${h - 8}" width="${w}" height="8" fill="url(#vignette-bot)"/>
    <path d="M 0,0 L 40,0 L 0,40 Z" fill="#ffffff" opacity="0.04"/>
    <path d="M ${w},0 L ${w - 40},0 L ${w},40 Z" fill="#ffffff" opacity="0.04"/>
  `;
}

// ============================================================================
// 1. ARAKI ART ARCHIVE (Haute-Couture / Editorial Luxury Monograph)
// ============================================================================
function getArakiArtCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#14110f"/>
    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.4"/>
    <rect x="44" y="44" width="952" height="1480" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.75"/>
    
    <text x="520" y="90" font-family="'Times New Roman', Times, serif" font-size="20" font-style="italic" font-weight="bold" fill="#d4af37" letter-spacing="8" text-anchor="middle">✦  HAUTE COUTURE ARCHIVE • LUXURY EDITION  ✦</text>
    <text x="520" y="118" font-family="'Courier New', monospace" font-size="14" fill="#a89a80" letter-spacing="4" text-anchor="middle">MUSÉE DU LOUVRE • GUCCI RETROSPECTIVE 2026</text>
    
    <rect x="64" y="146" width="912" height="780" fill="#080706" stroke="#d4af37" stroke-width="3"/>
    <image href="${b64}" x="66" y="148" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>
    <rect x="66" y="148" width="908" height="776" fill="url(#vignette-bot)"/>

    <rect x="96" y="176" width="310" height="48" fill="#120e0b" stroke="#d4af37" stroke-width="2" rx="4"/>
    <text x="251" y="206" font-family="'Times New Roman', Times, serif" font-size="16" font-weight="bold" fill="#d4af37" letter-spacing="3" text-anchor="middle">✦ OFFICIAL EXHIBITION ✦</text>

    <rect x="740" y="860" width="200" height="42" fill="#14110f" opacity="0.9" stroke="#d4af37" stroke-width="1.5"/>
    <text x="840" y="887" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="4" text-anchor="middle">荒木飛呂彦 美術展</text>

    <text x="520" y="1020" font-family="'Times New Roman', Times, serif" font-size="78" font-weight="bold" fill="#fcf8f0" letter-spacing="6" text-anchor="middle">ARAKI ART</text>
    <text x="520" y="1100" font-family="'Times New Roman', Times, serif" font-size="62" font-style="italic" fill="#d4af37" letter-spacing="12" text-anchor="middle">ARCHIVE</text>

    <line x1="220" y1="1140" x2="820" y2="1140" stroke="#d4af37" stroke-width="1.5" opacity="0.6"/>
    <text x="520" y="1185" font-family="'Courier New', monospace" font-size="18" fill="#ded7c8" letter-spacing="3" text-anchor="middle">12-COLUMN SWISS BLUEPRINT • DUAL PALETTE ENGINE</text>
    <text x="520" y="1215" font-family="'Times New Roman', Times, serif" font-size="16" font-style="italic" fill="#a89a80" letter-spacing="2" text-anchor="middle">Curated Lookbook by Ferrel Rashad • Paris / Milan / Tokyo</text>

    <g transform="translate(810, 1260) rotate(-6)">
      <rect width="140" height="60" fill="#facc15" stroke="#000000" stroke-width="2" rx="3"/>
      <text x="70" y="25" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">SPECIAL IMPORT</text>
      <text x="70" y="48" font-family="sans-serif" font-size="20" font-weight="900" fill="#dc2626" text-anchor="middle">¥ 3,800</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#0c0a09" stroke="#d4af37" stroke-width="1.5" opacity="0.9"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#d4af37" letter-spacing="2">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#ded7c8" letter-spacing="2">HI-FI STEREO</text>
    <text x="520" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#d4af37" letter-spacing="3" text-anchor="middle">[ FRA_00 • NTSC-SP ]</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#ded7c8" letter-spacing="2" text-anchor="end">105 MIN • 2026</text>

    ${svgVintageOverlay(1040, 1568, 1987)}
  </svg>`;
}

function getArakiArtSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#14110f"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#d4af37" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#d4af37" letter-spacing="2" text-anchor="middle">VHS</text>
    <text x="120" y="148" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#facc15" letter-spacing="3" text-anchor="middle">FRA_00</text>
    <text x="120" y="174" font-family="'Times New Roman', Times, serif" font-size="14" font-style="italic" fill="#d4af37" text-anchor="middle">✦ HI-FI ✦</text>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="'Times New Roman', Times, serif" font-size="46" font-weight="bold" fill="#fcf8f0" letter-spacing="6" text-anchor="middle">ARAKI ART ARCHIVE</text>
    </g>

    <text x="120" y="1320" font-family="sans-serif" font-size="18" font-weight="bold" fill="#d4af37" letter-spacing="3" text-anchor="middle">美術展 2026</text>
    ${svgBarcode(30, 1420, 180, 60, 4401, '#d4af37')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#ded7c8" letter-spacing="2" text-anchor="middle">VOL. 01 • SP</text>
    ${svgVintageOverlay(240, 1568, 777)}
  </svg>`;
}

// ============================================================================
// 2. TACTIQ ANALYTICS (Football Intelligence & Telemetry HUD)
// ============================================================================
function getTactiqCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#0a0f18"/>
    <defs>
      <pattern id="tactiq-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f0ff" stroke-width="0.7" opacity="0.08"/>
      </pattern>
    </defs>
    <rect width="1040" height="1568" fill="url(#tactiq-grid)"/>

    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#00f0ff" stroke-width="1.5" opacity="0.3"/>
    <path d="M 36 80 L 36 36 L 80 36 M 960 36 L 1004 36 L 1004 80 M 36 1488 L 36 1532 L 80 1532 M 960 1532 L 1004 1532 L 1004 1488" fill="none" stroke="#00f0ff" stroke-width="4"/>

    <circle cx="68" cy="80" r="7" fill="#22c55e"/>
    <text x="90" y="86" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#00f0ff" letter-spacing="3">SYS.ONLINE // REALTIME FOOTBALL HUD</text>
    <text x="970" y="86" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#f59e0b" letter-spacing="2" text-anchor="end">LATENCY &lt; 45MS</text>

    <rect x="64" y="120" width="912" height="780" fill="#05080e" stroke="#00f0ff" stroke-width="2"/>
    <image href="${b64}" x="66" y="122" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>
    <rect x="66" y="122" width="908" height="776" fill="url(#vignette-bot)"/>

    <rect x="96" y="150" width="260" height="44" fill="#050912" opacity="0.9" stroke="#00f0ff" stroke-width="1.5"/>
    <text x="226" y="178" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#00f0ff" letter-spacing="3" text-anchor="middle">LIVE VECTOR RADAR</text>

    <text x="520" y="990" font-family="sans-serif" font-size="82" font-weight="900" fill="#00f0ff" letter-spacing="4" text-anchor="middle">TACTIQ</text>
    <text x="520" y="1060" font-family="'Courier New', monospace" font-size="34" font-weight="bold" fill="#f59e0b" letter-spacing="8" text-anchor="middle">INTELLIGENCE PLATFORM</text>

    <line x1="120" y1="1100" x2="920" y2="1100" stroke="#00f0ff" stroke-width="1" opacity="0.4"/>
    <text x="520" y="1145" font-family="'Courier New', monospace" font-size="18" fill="#e2e8f0" letter-spacing="2" text-anchor="middle">HIGH-FREQUENCY CANVAS 2D • SUB-50MS SOCKET TRANSPORT</text>
    <text x="520" y="1180" font-family="'Courier New', monospace" font-size="16" fill="#38bdf8" letter-spacing="3" text-anchor="middle">7-AXIS MULTIVARIATE RADAR • AI MATCH FORECAST ENGINE</text>

    <rect x="120" y="1230" width="800" height="120" fill="#070c14" stroke="#00f0ff" stroke-width="1"/>
    <text x="145" y="1265" font-family="'Courier New', monospace" font-size="14" fill="#f59e0b">GPS COORD: 51.5560° N, 0.2795° W // WEMBLEY HUD</text>
    <text x="145" y="1295" font-family="'Courier New', monospace" font-size="14" fill="#00f0ff">DATA PACKETS: 10,480 PTS/SEC // DOUBLE-BUFFERED CANVAS</text>
    <text x="145" y="1325" font-family="'Courier New', monospace" font-size="14" fill="#22c55e">MATCH STATE: 60 FPS LOCKED • DRIFT 0.00ms</text>

    <rect x="64" y="1410" width="912" height="74" fill="#060910" stroke="#00f0ff" stroke-width="1.5"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#00f0ff">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#e2e8f0">[ FRA_02 • 2026 ]</text>
    <text x="520" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#f59e0b" text-anchor="middle">HQ HI-FI • STEREO AUDIO</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#00f0ff" text-anchor="end">TACTICAL PERFORMANCE LABS</text>

    ${svgVintageOverlay(1040, 1568, 2049)}
  </svg>`;
}

function getTactiqSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#0a0f18"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#00f0ff" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#00f0ff" letter-spacing="2" text-anchor="middle">VHS</text>

    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#f59e0b" letter-spacing="3" text-anchor="middle">FRA_02</text>
    <circle cx="120" cy="180" r="5" fill="#22c55e"/>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="sans-serif" font-size="48" font-weight="900" fill="#00f0ff" letter-spacing="6" text-anchor="middle">TACTIQ ANALYTICS</text>
    </g>

    <text x="120" y="1320" font-family="'Courier New', monospace" font-size="16" fill="#f59e0b" letter-spacing="3" text-anchor="middle">TELEMETRY HUD</text>
    ${svgBarcode(30, 1420, 180, 60, 5521, '#00f0ff')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#e2e8f0" text-anchor="middle">T-120 QUANTUM</text>
    ${svgVintageOverlay(240, 1568, 666)}
  </svg>`;
}

// ============================================================================
// 3. PERSONA 3 RELOAD (Atlus Console UI & Procedural Web Audio)
// ============================================================================
function getPersona3Cover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#08101e"/>
    <!-- Deep Blue Moon Motif -->
    <circle cx="860" cy="240" r="280" fill="#00d2ff" opacity="0.08"/>
    <circle cx="860" cy="240" r="220" fill="#08101e"/>

    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#00d2ff" stroke-width="2" opacity="0.4"/>
    <text x="520" y="90" font-family="sans-serif" font-size="22" font-weight="900" fill="#00d2ff" letter-spacing="8" text-anchor="middle">ATLUS ENTERTAINMENT • RELOAD ARCHIVE</text>
    <text x="520" y="120" font-family="'Courier New', monospace" font-size="14" fill="#93c5fd" letter-spacing="4" text-anchor="middle">DARK HOUR SIMULATION • PROCEDURAL WEB AUDIO</text>

    <!-- Main Plate -->
    <rect x="64" y="146" width="912" height="780" fill="#040810" stroke="#00d2ff" stroke-width="3"/>
    <image href="${b64}" x="66" y="148" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>
    <rect x="66" y="148" width="908" height="776" fill="url(#vignette-bot)"/>

    <!-- Arcana Tag -->
    <rect x="96" y="176" width="220" height="46" fill="#050d1a" stroke="#00d2ff" stroke-width="1.5" rx="4"/>
    <text x="206" y="206" font-family="sans-serif" font-size="16" font-weight="900" fill="#00d2ff" letter-spacing="3" text-anchor="middle">ARCANA: 00</text>

    <!-- Japanese Subtitle Callout -->
    <rect x="730" y="860" width="210" height="42" fill="#08101e" opacity="0.9" stroke="#00d2ff" stroke-width="1.5"/>
    <text x="835" y="887" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="3" text-anchor="middle">ペルソナ3 リロード</text>

    <!-- Title Section -->
    <text x="520" y="1000" font-family="sans-serif" font-size="82" font-weight="900" fill="#ffffff" letter-spacing="4" text-anchor="middle">PERSONA 3</text>
    <text x="520" y="1070" font-family="sans-serif" font-size="52" font-weight="900" fill="#00d2ff" letter-spacing="12" text-anchor="middle">RELOAD</text>

    <line x1="200" y1="1110" x2="840" y2="1110" stroke="#00d2ff" stroke-width="1.5" opacity="0.5"/>
    <text x="520" y="1155" font-family="'Courier New', monospace" font-size="18" fill="#e2e8f0" letter-spacing="3" text-anchor="middle">PROCEDURAL OSCILLATOR ACOUSTICS • 0KB MP3 FOOTPRINT</text>
    <text x="520" y="1190" font-family="'Courier New', monospace" font-size="16" fill="#93c5fd" letter-spacing="2" text-anchor="middle">ZERO-SCROLL VIEWPORT MATRIX • 60 FPS CONSOLE EXPERIENCE</text>

    <g transform="translate(180, 1240)">
      <rect width="680" height="90" fill="#050c18" stroke="#00d2ff" stroke-width="1"/>
      <text x="340" y="38" font-family="'Courier New', monospace" font-size="15" fill="#00d2ff" text-anchor="middle">AUDIO ENGINE: GAIN NODES / PEAK METERS / FREQUENCY BANDS</text>
      <text x="340" y="68" font-family="'Courier New', monospace" font-size="15" fill="#fde047" text-anchor="middle">STATE MACHINE: CONSOLE CONTROLLER PARITY [FRA_03]</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#050a12" stroke="#00d2ff" stroke-width="1.5"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#00d2ff">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#e2e8f0">[ FRA_03 • ATLUS ]</text>
    <text x="520" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#00d2ff" text-anchor="middle">DOLBY STEREO AUDIO</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#93c5fd" text-anchor="end">YEAR 2026</text>

    ${svgVintageOverlay(1040, 1568, 2006)}
  </svg>`;
}

function getPersona3Spine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#08101e"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#00d2ff" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#00d2ff" letter-spacing="2" text-anchor="middle">VHS</text>
    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#ffffff" letter-spacing="3" text-anchor="middle">FRA_03</text>
    <text x="120" y="176" font-family="sans-serif" font-size="14" fill="#00d2ff" text-anchor="middle">CERO B</text>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="sans-serif" font-size="48" font-weight="900" fill="#ffffff" letter-spacing="6" text-anchor="middle">PERSONA 3 RELOAD</text>
    </g>

    <text x="120" y="1320" font-family="sans-serif" font-size="16" font-weight="bold" fill="#00d2ff" text-anchor="middle">P3R AUDIO</text>
    ${svgBarcode(30, 1420, 180, 60, 3311, '#00d2ff')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#93c5fd" text-anchor="middle">ATLUS 2026</text>
    ${svgVintageOverlay(240, 1568, 303)}
  </svg>`;
}

// ============================================================================
// 4. NUSANTARA OBSERVATORY
// ============================================================================
function getNusantaraCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#0c141d"/>
    <circle cx="520" cy="510" r="440" fill="none" stroke="#d97706" stroke-width="1" opacity="0.2"/>
    <circle cx="520" cy="510" r="380" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.25"/>
    <circle cx="520" cy="510" r="300" fill="none" stroke="#d97706" stroke-width="1" opacity="0.2"/>

    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#d97706" stroke-width="2" opacity="0.5"/>
    <text x="520" y="90" font-family="'Times New Roman', Times, serif" font-size="20" font-weight="bold" fill="#f59e0b" letter-spacing="6" text-anchor="middle">★ ASTRONOMICAL OBSERVATION ARCHIVE ★</text>
    <text x="520" y="118" font-family="'Courier New', monospace" font-size="14" fill="#cbd5e1" letter-spacing="4" text-anchor="middle">INDONESIAN CRUSTAL ARCHIPELAGO SURVEY • 2026</text>

    <rect x="64" y="146" width="912" height="780" fill="#06090f" stroke="#d97706" stroke-width="2.5"/>
    <image href="${b64}" x="66" y="148" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>
    <rect x="66" y="148" width="908" height="776" fill="url(#vignette-bot)"/>

    <g transform="translate(800, 810) rotate(-12)">
      <circle r="60" fill="none" stroke="#f59e0b" stroke-width="2.5" opacity="0.85"/>
      <circle r="52" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.85"/>
      <text x="0" y="-12" font-family="'Times New Roman', Times, serif" font-size="13" font-weight="bold" fill="#f59e0b" text-anchor="middle">OBSERVATORIUM</text>
      <text x="0" y="8" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f59e0b" text-anchor="middle">★ APPROVED ★</text>
      <text x="0" y="26" font-family="'Courier New', monospace" font-size="12" fill="#f59e0b" text-anchor="middle">NO. 1984</text>
    </g>

    <text x="520" y="1010" font-family="'Times New Roman', Times, serif" font-size="70" font-weight="bold" fill="#fef3c7" letter-spacing="4" text-anchor="middle">NUSANTARA</text>
    <text x="520" y="1080" font-family="'Times New Roman', Times, serif" font-size="52" font-style="italic" fill="#f59e0b" letter-spacing="8" text-anchor="middle">OBSERVATORY</text>

    <line x1="200" y1="1120" x2="840" y2="1120" stroke="#d97706" stroke-width="1.5" opacity="0.5"/>
    <text x="520" y="1165" font-family="'Courier New', monospace" font-size="18" fill="#e2e8f0" letter-spacing="3" text-anchor="middle">07°49'S 110°21'E • MERAPI-MERBABU CELESTIAL AXIS</text>
    <text x="520" y="1200" font-family="'Times New Roman', Times, serif" font-size="16" font-style="italic" fill="#cbd5e1" letter-spacing="2" text-anchor="middle">Real-time Solar &amp; Planetary Telemetry Monograph</text>

    <g transform="translate(180, 1260)">
      <rect width="680" height="90" fill="#080e16" stroke="#d97706" stroke-width="1"/>
      <text x="340" y="35" font-family="'Courier New', monospace" font-size="15" fill="#f59e0b" text-anchor="middle">SPECTRUM: 380 - 750 NM • ASTRONOMICAL LINEN VOL. 84</text>
      <text x="340" y="65" font-family="'Courier New', monospace" font-size="15" fill="#cbd5e1" text-anchor="middle">THREE.JS 3D EPHEMERIS ENGINE • SATELLITE ORBIT MAPPING</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#070c13" stroke="#d97706" stroke-width="1.5"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#f59e0b">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#cbd5e1">[ FRA_03 • EXPEDITION ]</text>
    <text x="520" y="1452" font-family="'Times New Roman', Times, serif" font-size="18" font-style="italic" fill="#fef3c7" text-anchor="middle">Archival Document • Stereo Sound</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#f59e0b" text-anchor="end">YEAR 2026</text>

    ${svgVintageOverlay(1040, 1568, 1923)}
  </svg>`;
}

function getNusantaraSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#0c141d"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#d97706" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#f59e0b" letter-spacing="2" text-anchor="middle">VHS</text>
    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#fef3c7" letter-spacing="3" text-anchor="middle">FRA_03</text>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="'Times New Roman', Times, serif" font-size="44" font-weight="bold" fill="#fef3c7" letter-spacing="6" text-anchor="middle">NUSANTARA OBSERVATORY</text>
    </g>

    <text x="120" y="1320" font-family="'Courier New', monospace" font-size="15" fill="#f59e0b" letter-spacing="2" text-anchor="middle">CELESTIAL VOL. III</text>
    ${svgBarcode(30, 1420, 180, 60, 9912, '#f59e0b')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#cbd5e1" text-anchor="middle">NTSC STEREO</text>
    ${svgVintageOverlay(240, 1568, 444)}
  </svg>`;
}

// ============================================================================
// 5. CHARLES LECLERC #16 (Scuderia Ferrari F1 Telemetry & Kinetic Motion)
// ============================================================================
function getCharlesLeclercCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#180707"/>
    <!-- Italian Flag Ribbon Top Accent -->
    <rect x="0" y="0" width="346" height="12" fill="#009246"/>
    <rect x="346" y="0" width="348" height="12" fill="#ffffff"/>
    <rect x="694" y="0" width="346" height="12" fill="#ce2b37"/>

    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.4"/>
    <text x="520" y="90" font-family="sans-serif" font-size="24" font-weight="900" fill="#dc2626" letter-spacing="8" text-anchor="middle">SCUDERIA CORSA • REDLINE TELEMETRY</text>
    <text x="520" y="120" font-family="'Courier New', monospace" font-size="14" fill="#facc15" letter-spacing="4" text-anchor="middle">MARANELLO MOTORSPORT VISUAL LAB • MONZA GP</text>

    <!-- Main Plate with Carbon Bevel -->
    <rect x="64" y="146" width="912" height="780" fill="#080202" stroke="#dc2626" stroke-width="3"/>
    <image href="${b64}" x="66" y="148" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>
    <rect x="66" y="148" width="908" height="776" fill="url(#vignette-bot)"/>

    <!-- Giant Driver Number 16 -->
    <g transform="translate(760, 160) skewX(-12)">
      <text x="0" y="120" font-family="sans-serif" font-size="150" font-weight="900" fill="#facc15" opacity="0.95">16</text>
    </g>

    <!-- Title Section -->
    <g transform="skewX(-8) translate(70, 0)">
      <text x="520" y="1000" font-family="sans-serif" font-size="78" font-weight="900" fill="#ffffff" letter-spacing="4" text-anchor="middle">CHARLES LECLERC</text>
      <text x="520" y="1070" font-family="sans-serif" font-size="44" font-weight="900" fill="#dc2626" letter-spacing="10" text-anchor="middle">REDLINE VELOCITY #16</text>
    </g>

    <line x1="160" y1="1110" x2="880" y2="1110" stroke="#dc2626" stroke-width="1.5" opacity="0.6"/>
    <text x="520" y="1155" font-family="'Courier New', monospace" font-size="18" fill="#e2e8f0" letter-spacing="2" text-anchor="middle">MAX RPM: 15,000 • SECTOR DELTA: -0.142S • GSAP 3 MOTORSPORT</text>
    <text x="520" y="1190" font-family="'Courier New', monospace" font-size="16" fill="#facc15" letter-spacing="3" text-anchor="middle">DYNAMIC TACHOMETER SHADER • 60 FPS TELEMETRY VISUALIZER</text>

    <!-- Pit Radio Pill -->
    <g transform="translate(180, 1240)">
      <rect width="680" height="90" fill="#0d0404" stroke="#dc2626" stroke-width="1"/>
      <text x="340" y="38" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#facc15" text-anchor="middle">PIT RADIO: &quot;BOX BOX BOX • P1 CONFIRMED&quot;</text>
      <text x="340" y="68" font-family="'Courier New', monospace" font-size="15" fill="#ffffff" text-anchor="middle">CIRCUIT DE MONACO • LAP TIME: 1:10.270</text>
    </g>

    <!-- Bottom Specs -->
    <rect x="64" y="1410" width="912" height="74" fill="#0a0303" stroke="#dc2626" stroke-width="1.5"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#dc2626">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#facc15">[ FRA_04 • F1 ]</text>
    <text x="520" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">SCUDERIA CORSA AUDIO</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#dc2626" text-anchor="end">SEASON 2025</text>

    ${svgVintageOverlay(1040, 1568, 2019)}
  </svg>`;
}

function getCharlesLeclercSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#180707"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#dc2626" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#dc2626" letter-spacing="2" text-anchor="middle">VHS</text>

    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#facc15" letter-spacing="3" text-anchor="middle">FRA_04</text>
    <text x="120" y="176" font-family="sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">#16</text>

    <g transform="translate(120, 800) rotate(90) skewX(-8)">
      <text x="0" y="12" font-family="sans-serif" font-size="48" font-weight="900" fill="#ffffff" letter-spacing="6" text-anchor="middle">LECLERC #16</text>
    </g>

    <text x="120" y="1320" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626" text-anchor="middle">SCUDERIA</text>
    ${svgBarcode(30, 1420, 180, 60, 1616, '#dc2626')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#facc15" text-anchor="middle">MONZA 2025</text>
    ${svgVintageOverlay(240, 1568, 1616)}
  </svg>`;
}

// ============================================================================
// 6. ECOBITE (Zero-Waste IoT)
// ============================================================================
function getEcobiteCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#0c1f15"/>
    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#34d399" stroke-width="2" opacity="0.4"/>

    <text x="520" y="90" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#34d399" letter-spacing="4" text-anchor="middle">🌿 CIRCULAR PANTRY INTELLIGENCE • ZERO WASTE</text>
    <text x="520" y="118" font-family="sans-serif" font-size="14" fill="#a7f3d0" letter-spacing="3" text-anchor="middle">SMART IOT SENSORS • REAL-TIME SPOILAGE FORECAST</text>

    <rect x="64" y="146" width="912" height="780" fill="#06120b" stroke="#34d399" stroke-width="2" rx="6"/>
    <image href="${b64}" x="66" y="148" width="908" height="776" preserveAspectRatio="xMidYMid slice" rx="6"/>
    <rect x="66" y="148" width="908" height="776" fill="url(#vignette-bot)" rx="6"/>

    <rect x="96" y="176" width="280" height="46" fill="#091b11" opacity="0.9" stroke="#34d399" stroke-width="1.5" rx="4"/>
    <text x="236" y="206" font-family="'Courier New', monospace" font-size="15" font-weight="bold" fill="#34d399" letter-spacing="2" text-anchor="middle">♻ 100% RECYCLED SYSTEM</text>

    <text x="520" y="1010" font-family="sans-serif" font-size="82" font-weight="900" fill="#ffffff" letter-spacing="2" text-anchor="middle">ECOBITE</text>
    <text x="520" y="1080" font-family="'Courier New', monospace" font-size="34" font-weight="bold" fill="#34d399" letter-spacing="6" text-anchor="middle">SUSTAINABLE PANTRY OS</text>

    <line x1="200" y1="1120" x2="840" y2="1120" stroke="#34d399" stroke-width="1.5" opacity="0.5"/>
    <text x="520" y="1165" font-family="'Courier New', monospace" font-size="18" fill="#e2e8f0" letter-spacing="3" text-anchor="middle">IOT SMART STORAGE • SPOILAGE TELEMETRY MATRIX</text>
    <text x="520" y="1200" font-family="sans-serif" font-size="16" fill="#a7f3d0" letter-spacing="2" text-anchor="middle">Zero-Waste Digital Lookbook • Environmental Engineering</text>

    <g transform="translate(180, 1260)">
      <rect width="680" height="90" fill="#08170e" stroke="#34d399" stroke-width="1" rx="4"/>
      <text x="340" y="35" font-family="'Courier New', monospace" font-size="15" fill="#34d399" text-anchor="middle">METRIC: 42% FOOD WASTE REDUCTION • 10K+ INVENTORY LOGS</text>
      <text x="340" y="65" font-family="'Courier New', monospace" font-size="15" fill="#a7f3d0" text-anchor="middle">HARDWARE PROTOCOL: MQTT / WEBSOCKETS / NEXT.JS</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#06120c" stroke="#34d399" stroke-width="1.5" rx="4"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#34d399">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#e2e8f0">[ FRA_05 • ECO SPEC ]</text>
    <text x="520" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#34d399" text-anchor="middle">ISO 14001 CERTIFIED</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#34d399" text-anchor="end">YEAR 2026</text>

    ${svgVintageOverlay(1040, 1568, 2026)}
  </svg>`;
}

function getEcobiteSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#0c1f15"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#34d399" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#34d399" letter-spacing="2" text-anchor="middle">VHS</text>
    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#ffffff" letter-spacing="3" text-anchor="middle">FRA_05</text>
    <text x="120" y="176" font-family="sans-serif" font-size="14" fill="#34d399" text-anchor="middle">♻ ECO IOT</text>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="6" text-anchor="middle">ECOBITE ZERO-WASTE</text>
    </g>

    ${svgBarcode(30, 1420, 180, 60, 3321, '#34d399')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#a7f3d0" text-anchor="middle">CIRCULAR 2026</text>
    ${svgVintageOverlay(240, 1568, 333)}
  </svg>`;
}

// ============================================================================
// 7. SPIDEY DEV (Spider-Man 90s Comic & Interactive Web Audio)
// ============================================================================
function getSpideyDevCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#180a0a"/>
    <!-- Web Pattern Lines from Top Left -->
    <path d="M 0 0 L 1040 600 M 0 0 L 800 1568 M 0 0 L 400 1568 M 0 0 L 1040 200" stroke="#dc2626" stroke-width="1" opacity="0.15"/>

    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.4"/>

    <!-- Marvel-style Corner Stamp Box -->
    <rect x="54" y="54" width="130" height="70" fill="#dc2626"/>
    <text x="119" y="82" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">MARVEL</text>
    <text x="119" y="104" font-family="sans-serif" font-size="16" font-weight="900" fill="#facc15" text-anchor="middle">COMICS</text>

    <text x="560" y="90" font-family="sans-serif" font-size="24" font-weight="900" fill="#dc2626" letter-spacing="6" text-anchor="middle">★ SPIDEY DEV CINEMATIC UNIVERSE ★</text>
    <text x="560" y="120" font-family="'Courier New', monospace" font-size="14" fill="#facc15" letter-spacing="4" text-anchor="middle">INTERACTIVE WEB AUDIO &amp; GSAP CANVAS WEBS</text>

    <!-- Main Plate with Comic Halftone Frame -->
    <rect x="64" y="146" width="912" height="780" fill="#080202" stroke="#dc2626" stroke-width="3"/>
    <image href="${b64}" x="66" y="148" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>
    <rect x="66" y="148" width="908" height="776" fill="url(#vignette-bot)"/>

    <!-- Title Section -->
    <g transform="skewX(-6) translate(50, 0)">
      <text x="520" y="1000" font-family="sans-serif" font-size="84" font-weight="900" fill="#dc2626" letter-spacing="4" text-anchor="middle">SPIDEY DEV</text>
      <text x="520" y="1070" font-family="sans-serif" font-size="44" font-weight="900" fill="#2563eb" letter-spacing="10" text-anchor="middle">KINETIC PORTFOLIO</text>
    </g>

    <line x1="160" y1="1110" x2="880" y2="1110" stroke="#dc2626" stroke-width="1.5" opacity="0.6"/>
    <text x="520" y="1155" font-family="'Courier New', monospace" font-size="18" fill="#e2e8f0" letter-spacing="2" text-anchor="middle">PROCEDURAL WEB SOUNDSCAPES • ELASTIC CANVAS WEB PHYSICS</text>
    <text x="520" y="1190" font-family="'Courier New', monospace" font-size="16" fill="#facc15" letter-spacing="3" text-anchor="middle">HALFTONE SCREEN SHADER • INTERACTIVE CURSOR SLINGING</text>

    <g transform="translate(180, 1240)">
      <rect width="680" height="90" fill="#0d0404" stroke="#2563eb" stroke-width="1"/>
      <text x="340" y="38" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#facc15" text-anchor="middle">APPROVED BY COMICS CODE AUTHORITY • SPECIAL RELEASE</text>
      <text x="340" y="68" font-family="'Courier New', monospace" font-size="15" fill="#ffffff" text-anchor="middle">REACT 19 • GSAP TIMELINE ENGINE • TAILWIND CSS</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#0a0303" stroke="#dc2626" stroke-width="1.5"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#dc2626">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#facc15">[ FRA_06 • COMIC ]</text>
    <text x="520" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">STEREO SURROUND SOUND</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#dc2626" text-anchor="end">YEAR 2025</text>

    ${svgVintageOverlay(1040, 1568, 2002)}
  </svg>`;
}

function getSpideyDevSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#180a0a"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#dc2626" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#dc2626" letter-spacing="2" text-anchor="middle">VHS</text>

    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#facc15" letter-spacing="3" text-anchor="middle">FRA_06</text>
    <text x="120" y="176" font-family="sans-serif" font-size="15" font-weight="900" fill="#2563eb" text-anchor="middle">SPIDEY</text>

    <g transform="translate(120, 800) rotate(90) skewX(-6)">
      <text x="0" y="12" font-family="sans-serif" font-size="50" font-weight="900" fill="#ffffff" letter-spacing="6" text-anchor="middle">SPIDEY DEV PORTFOLIO</text>
    </g>

    <text x="120" y="1320" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626" text-anchor="middle">COMIC 2025</text>
    ${svgBarcode(30, 1420, 180, 60, 2002, '#dc2626')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#facc15" text-anchor="middle">STEREO HI-FI</text>
    ${svgVintageOverlay(240, 1568, 502)}
  </svg>`;
}

// ============================================================================
// 8. FERSYA SHOP (Tokyo Brutalist Streetwear)
// ============================================================================
function getFersyaShopCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#0a0a0a"/>
    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.3"/>

    <rect x="0" y="0" width="1040" height="100" fill="#facc15"/>
    <text x="520" y="62" font-family="sans-serif" font-size="36" font-weight="900" fill="#000000" letter-spacing="6" text-anchor="middle">FERSYA COMMERCE // 限定ドロップ 007</text>

    <rect x="64" y="130" width="912" height="780" fill="#000000" stroke="#ffffff" stroke-width="3"/>
    <image href="${b64}" x="66" y="132" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>

    <g transform="translate(680, 840) rotate(-6)">
      <rect width="260" height="56" fill="#f43f5e" stroke="#000000" stroke-width="2"/>
      <text x="130" y="38" font-family="sans-serif" font-size="22" font-weight="900" fill="#ffffff" letter-spacing="4" text-anchor="middle">SOLD OUT 99.4%</text>
    </g>

    <text x="520" y="1000" font-family="sans-serif" font-size="88" font-weight="900" fill="#ffffff" letter-spacing="4" text-anchor="middle">FERSYA SHOP</text>
    <text x="520" y="1070" font-family="'Courier New', monospace" font-size="34" font-weight="900" fill="#facc15" letter-spacing="8" text-anchor="middle">STREETWEAR ARCHIVE</text>

    <line x1="120" y1="1110" x2="920" y2="1110" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
    <text x="520" y="1155" font-family="'Courier New', monospace" font-size="18" fill="#ffffff" letter-spacing="3" text-anchor="middle">AVANT-GARDE E-COMMERCE • ZERO-LATENCY CART ARCHITECTURE</text>
    <text x="520" y="1190" font-family="sans-serif" font-size="16" font-weight="bold" fill="#f43f5e" letter-spacing="4" text-anchor="middle">TOKYO STREET CULTURE // DROP MONOGRAPH</text>

    <g transform="translate(100, 1240)">
      <rect width="840" height="120" fill="#ffffff"/>
      ${svgBarcode(20, 15, 600, 90, 7712, '#000000')}
      <text x="730" y="70" font-family="sans-serif" font-size="32" font-weight="900" fill="#000000">¥ 12,000</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#141414" stroke="#ffffff" stroke-width="1.5"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#ffffff">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#facc15">[ FRA_07 • DROP 07 ]</text>
    <text x="520" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">NTSC JAPAN • STEREO FX</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#f43f5e" text-anchor="end">AUTUMN 2026</text>

    ${svgVintageOverlay(1040, 1568, 777)}
  </svg>`;
}

function getFersyaShopSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#facc15"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#ffffff" letter-spacing="2" text-anchor="middle">VHS</text>

    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#000000" letter-spacing="3" text-anchor="middle">FRA_07</text>
    <text x="120" y="176" font-family="sans-serif" font-size="15" font-weight="900" fill="#f43f5e" text-anchor="middle">DROP 07</text>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="sans-serif" font-size="52" font-weight="900" fill="#000000" letter-spacing="6" text-anchor="middle">FERSYA COMMERCE</text>
    </g>

    ${svgBarcode(30, 1400, 180, 70, 9988, '#000000')}
    <text x="120" y="1510" font-family="sans-serif" font-size="16" font-weight="900" fill="#000000" text-anchor="middle">STREETWEAR</text>
    ${svgVintageOverlay(240, 1568, 111)}
  </svg>`;
}

// ============================================================================
// 9. STUDENT LIFE (Swiss Helvetica)
// ============================================================================
function getStudentLifeCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#141416"/>
    <rect x="0" y="0" width="1040" height="420" fill="#dc2626"/>

    <text x="70" y="240" font-family="Helvetica, Arial, sans-serif" font-size="210" font-weight="900" fill="#ffffff" letter-spacing="-8">04</text>
    
    <text x="370" y="140" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="2">SWISS MODERNISM</text>
    <text x="370" y="180" font-family="'Courier New', monospace" font-size="18" fill="#ffffff" opacity="0.9" letter-spacing="3">ARCHIVE VOL. 26 // HELVETICA EDITION</text>
    <text x="370" y="220" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff">CAMPUS OPERATING SYSTEM</text>

    <g transform="translate(0, 412)">
      <rect width="1040" height="16" fill="#000000"/>
      <path d="M 0 0 L 16 16 M 32 0 L 48 16 M 64 0 L 80 16 M 96 0 L 112 16 M 128 0 L 144 16 M 160 0 L 176 16 M 192 0 L 208 16 M 224 0 L 240 16 M 256 0 L 272 16 M 288 0 L 304 16 M 320 0 L 336 16 M 352 0 L 368 16 M 384 0 L 400 16 M 416 0 L 432 16 M 448 0 L 464 16 M 480 0 L 496 16 M 512 0 L 528 16 M 544 0 L 560 16 M 576 0 L 592 16 M 608 0 L 624 16 M 640 0 L 656 16 M 672 0 L 688 16 M 704 0 L 720 16 M 736 0 L 752 16 M 768 0 L 784 16 M 800 0 L 816 16 M 832 0 L 848 16 M 864 0 L 880 16 M 896 0 L 912 16 M 928 0 L 944 16 M 960 0 L 976 16 M 992 0 L 1008 16 M 1024 0 L 1040 16" stroke="#facc15" stroke-width="8"/>
    </g>

    <rect x="70" y="460" width="900" height="600" fill="#000000" stroke="#ffffff" stroke-width="4"/>
    <image href="${b64}" x="74" y="464" width="892" height="592" preserveAspectRatio="xMidYMid slice"/>

    <text x="70" y="1150" font-family="Helvetica, Arial, sans-serif" font-size="82" font-weight="900" fill="#ffffff" letter-spacing="-1">STUDENT LIFE</text>
    <text x="70" y="1220" font-family="'Courier New', monospace" font-size="28" font-weight="bold" fill="#dc2626" letter-spacing="4">MODULAR ACADEMIC PORTAL</text>

    <line x1="70" y1="1260" x2="970" y2="1260" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
    <text x="70" y="1305" font-family="'Courier New', monospace" font-size="18" fill="#ffffff" letter-spacing="2">ROLE: LEAD UI ENGINEER • SYSTEM ARCHITECTURE: NEXT.JS / TAILWIND</text>
    <text x="70" y="1335" font-family="'Courier New', monospace" font-size="18" fill="#a1a1aa" letter-spacing="2">INTERNATIONAL TYPOGRAPHIC STYLE • STRICT 12-COL BLUEPRINT</text>

    <g transform="translate(70, 1390)">
      <rect width="900" height="90" fill="#ffffff"/>
      ${svgBarcode(20, 12, 540, 66, 8821, '#000000')}
      <text x="720" y="58" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="900" fill="#000000">CH-8001</text>
      <text x="860" y="58" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#dc2626">FRA_04</text>
    </g>

    ${svgVintageOverlay(1040, 1568, 1968)}
  </svg>`;
}

function getStudentLifeSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#141416"/>
    <rect x="0" y="0" width="240" height="260" fill="#dc2626"/>
    <text x="120" y="120" font-family="Helvetica, Arial, sans-serif" font-size="82" font-weight="900" fill="#ffffff" letter-spacing="-4" text-anchor="middle">04</text>
    <text x="120" y="170" font-family="Helvetica, Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">SWISS</text>
    <text x="120" y="210" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">FRA_04</text>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="Helvetica, Arial, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="6" text-anchor="middle">STUDENT LIFE</text>
    </g>

    ${svgBarcode(30, 1400, 180, 70, 2211, '#ffffff')}
    <text x="120" y="1510" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">VOL. 04 • 2026</text>
    ${svgVintageOverlay(240, 1568, 888)}
  </svg>`;
}

// ============================================================================
// 10. STOCK PREDICTION (Bloomberg Telemetry & LSTM Engine)
// ============================================================================
function getStockPredictorCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#070c12"/>
    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.3"/>

    <rect x="0" y="44" width="1040" height="40" fill="#0e1724"/>
    <text x="520" y="70" font-family="'Courier New', monospace" font-size="15" font-weight="bold" fill="#22c55e" letter-spacing="4" text-anchor="middle">AAPL +2.4% ▲ • TSLA -0.8% ▼ • NVDA +4.1% ▲ • BTC +5.6% ▲ • ETH +3.2% ▲</text>

    <text x="520" y="120" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#f59e0b" letter-spacing="4" text-anchor="middle">BLOOMBERG TERMINAL • LSTM FORECAST TELEMETRY</text>

    <rect x="64" y="146" width="912" height="780" fill="#04070a" stroke="#f59e0b" stroke-width="2"/>
    <image href="${b64}" x="66" y="148" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>
    <rect x="66" y="148" width="908" height="776" fill="url(#vignette-bot)"/>

    <rect x="96" y="176" width="280" height="44" fill="#050a10" opacity="0.9" stroke="#22c55e" stroke-width="1.5"/>
    <text x="236" y="204" font-family="'Courier New', monospace" font-size="15" font-weight="bold" fill="#22c55e" letter-spacing="3" text-anchor="middle">MODEL: DUAL LSTM V4</text>

    <text x="520" y="1000" font-family="'Courier New', monospace" font-size="72" font-weight="bold" fill="#f59e0b" letter-spacing="4" text-anchor="middle">STOCK TELEMETRY</text>
    <text x="520" y="1065" font-family="sans-serif" font-size="34" font-weight="900" fill="#22c55e" letter-spacing="8" text-anchor="middle">QUANTITATIVE LSTM ENGINE</text>

    <line x1="160" y1="1105" x2="880" y2="1105" stroke="#f59e0b" stroke-width="1.5" opacity="0.5"/>
    <text x="520" y="1150" font-family="'Courier New', monospace" font-size="18" fill="#e2e8f0" letter-spacing="2" text-anchor="middle">HIGH-FREQUENCY CANDLESTICK PREDICTION • BACKTEST REPORT</text>
    <text x="520" y="1185" font-family="'Courier New', monospace" font-size="16" fill="#f59e0b" letter-spacing="3" text-anchor="middle">MEAN SQUARED ERROR: 0.0014 • 250 TRAINING EPOCHS</text>

    <g transform="translate(140, 1240)">
      <rect width="760" height="100" fill="#09111a" stroke="#22c55e" stroke-width="1"/>
      <text x="40" y="38" font-family="'Courier New', monospace" font-size="16" fill="#22c55e">FEATURE WEIGHTS: RSI (0.28) • MACD (0.34) • VOL (0.38)</text>
      <text x="40" y="70" font-family="'Courier New', monospace" font-size="16" fill="#f59e0b">ACCURACY SCORE: 88.6% • SHARPE RATIO: 2.44 // TRADING SPEC</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#060b10" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#f59e0b">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#e2e8f0">[ FRA_09 • FINANCIAL ]</text>
    <text x="520" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#22c55e" text-anchor="middle">QUANTITATIVE DATA RELEASE</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#f59e0b" text-anchor="end">YEAR 2026</text>

    ${svgVintageOverlay(1040, 1568, 2024)}
  </svg>`;
}

function getStockPredictorSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#070c12"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#f59e0b" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#f59e0b" letter-spacing="2" text-anchor="middle">VHS</text>
    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#22c55e" letter-spacing="3" text-anchor="middle">FRA_09</text>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="'Courier New', monospace" font-size="48" font-weight="bold" fill="#f59e0b" letter-spacing="6" text-anchor="middle">STOCK TELEMETRY</text>
    </g>

    <text x="120" y="1320" font-family="'Courier New', monospace" font-size="16" fill="#22c55e" text-anchor="middle">LSTM MODEL V4</text>
    ${svgBarcode(30, 1420, 180, 60, 4432, '#f59e0b')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#e2e8f0" text-anchor="middle">FINANCIAL 2026</text>
    ${svgVintageOverlay(240, 1568, 999)}
  </svg>`;
}

// ============================================================================
// 11. STREET RUSH (16-Bit Retro Arcade Classic)
// ============================================================================
function getStreetRushCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#08080d"/>

    <defs>
      <pattern id="arcade-check" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#facc15"/>
        <rect x="12" width="12" height="12" fill="#000000"/>
        <rect y="12" width="12" height="12" fill="#000000"/>
        <rect x="12" y="12" width="12" height="12" fill="#facc15"/>
      </pattern>
    </defs>
    <rect x="0" y="24" width="1040" height="24" fill="url(#arcade-check)"/>
    <rect x="0" y="1520" width="1040" height="24" fill="url(#arcade-check)"/>

    <text x="520" y="90" font-family="sans-serif" font-size="24" font-weight="900" fill="#f43f5e" letter-spacing="6" text-anchor="middle">★ 16-BIT RETRO ARCADE CLASSIC ★</text>
    <text x="520" y="120" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#facc15" letter-spacing="4" text-anchor="middle">INSERT COIN 25¢ • STEREO SOUND BLASTER</text>

    <rect x="64" y="146" width="912" height="780" fill="#000000" stroke="#f43f5e" stroke-width="4"/>
    <image href="${b64}" x="68" y="150" width="904" height="772" preserveAspectRatio="xMidYMid slice"/>
    <rect x="68" y="150" width="904" height="772" fill="url(#vignette-bot)"/>

    <rect x="96" y="176" width="310" height="48" fill="#000000" stroke="#facc15" stroke-width="2" rx="4"/>
    <text x="251" y="208" font-family="'Courier New', monospace" font-size="18" font-weight="900" fill="#facc15" letter-spacing="3" text-anchor="middle">★ HI-SCORE: 999900 ★</text>

    <g transform="skewX(-10) translate(180, 0)">
      <text x="520" y="1010" font-family="sans-serif" font-size="88" font-weight="900" fill="#facc15" letter-spacing="4" text-anchor="middle">STREET RUSH</text>
      <text x="520" y="1080" font-family="sans-serif" font-size="44" font-weight="900" fill="#f43f5e" letter-spacing="10" text-anchor="middle">OVERDRIVE RACER</text>
    </g>

    <line x1="160" y1="1130" x2="880" y2="1130" stroke="#f43f5e" stroke-width="2"/>
    <text x="520" y="1175" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#38bdf8" letter-spacing="3" text-anchor="middle">CHALLENGER STAGE 01 // OVERDRIVE SPEED // 60 FPS</text>
    <text x="520" y="1210" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="2" text-anchor="middle">SEGA OUTRUN &amp; SYNTHWAVE TRIBUTE • TURBO NITRO BOOST</text>

    <g transform="translate(360, 1260)">
      <rect width="320" height="70" fill="#14141e" stroke="#facc15" stroke-width="2" rx="6"/>
      <rect x="50" y="28" width="80" height="14" fill="#000000" stroke="#facc15" stroke-width="1"/>
      <text x="180" y="44" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#facc15">INSERT 1 COIN</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#0f0f18" stroke="#f43f5e" stroke-width="2"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#facc15">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#38bdf8">[ FRA_10 • 16-BIT ]</text>
    <text x="520" y="1452" font-family="sans-serif" font-size="18" font-weight="900" fill="#f43f5e" text-anchor="middle">COIN-OP RETRO ARCADE</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#facc15" text-anchor="end">YEAR 1986 / 2026</text>

    ${svgVintageOverlay(1040, 1568, 1986)}
  </svg>`;
}

function getStreetRushSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#08080d"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#f43f5e" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#facc15" letter-spacing="2" text-anchor="middle">VHS</text>
    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#f43f5e" letter-spacing="3" text-anchor="middle">FRA_10</text>

    <g transform="translate(120, 800) rotate(90) skewX(-8)">
      <text x="0" y="12" font-family="sans-serif" font-size="52" font-weight="900" fill="#facc15" letter-spacing="6" text-anchor="middle">STREET RUSH</text>
    </g>

    <text x="120" y="1320" font-family="sans-serif" font-size="18" font-weight="900" fill="#38bdf8" text-anchor="middle">16-BIT ARCADE</text>
    ${svgBarcode(30, 1420, 180, 60, 8888, '#facc15')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#ffffff" text-anchor="middle">COIN-OP 2026</text>
    ${svgVintageOverlay(240, 1568, 444)}
  </svg>`;
}

// ============================================================================
// 12. GUNUNG GEDE (Volcanic Field Simulation)
// ============================================================================
function getGunungGedeCover(b64) {
  return `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1040" height="1568" fill="#201813"/>
    <path d="M 0 300 Q 300 200 600 350 T 1040 280 M 0 380 Q 400 320 700 420 T 1040 360 M 0 460 Q 320 400 650 490 T 1040 440" fill="none" stroke="#d97706" stroke-width="1.2" opacity="0.2"/>

    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#d97706" stroke-width="2" opacity="0.5"/>
    <text x="520" y="90" font-family="'Times New Roman', Times, serif" font-size="20" font-weight="bold" fill="#d97706" letter-spacing="6" text-anchor="middle">★ GEOGRAPHIC EXPEDITION • FIELD SURVEY LOG ★</text>
    <text x="520" y="118" font-family="'Courier New', monospace" font-size="14" fill="#fde68a" letter-spacing="4" text-anchor="middle">GUNUNG GEDE PANGRANGO NATIONAL PARK • WEST JAVA</text>

    <rect x="64" y="146" width="912" height="780" fill="#0f0c09" stroke="#d97706" stroke-width="2.5"/>
    <image href="${b64}" x="66" y="148" width="908" height="776" preserveAspectRatio="xMidYMid slice"/>
    <rect x="66" y="148" width="908" height="776" fill="url(#vignette-bot)"/>

    <polygon points="66,148 106,148 66,188" fill="#d97706" opacity="0.85"/>
    <polygon points="974,148 934,148 974,188" fill="#d97706" opacity="0.85"/>
    <polygon points="66,924 106,924 66,884" fill="#d97706" opacity="0.85"/>
    <polygon points="974,924 934,924 974,884" fill="#d97706" opacity="0.85"/>

    <g transform="translate(820, 810) rotate(-8)">
      <rect width="130" height="70" fill="none" stroke="#d97706" stroke-width="2.5" rx="4"/>
      <text x="65" y="28" font-family="'Times New Roman', Times, serif" font-size="14" font-weight="bold" fill="#d97706" text-anchor="middle">SUMMIT SPEC</text>
      <text x="65" y="52" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle">2,958M ASL</text>
    </g>

    <text x="520" y="1010" font-family="'Times New Roman', Times, serif" font-size="76" font-weight="bold" fill="#fef3c7" letter-spacing="4" text-anchor="middle">GUNUNG GEDE</text>
    <text x="520" y="1080" font-family="'Times New Roman', Times, serif" font-size="52" font-style="italic" fill="#d97706" letter-spacing="8" text-anchor="middle">EXPEDITION SIMULATION</text>

    <line x1="200" y1="1120" x2="840" y2="1120" stroke="#d97706" stroke-width="1.5" opacity="0.5"/>
    <text x="520" y="1165" font-family="'Courier New', monospace" font-size="18" fill="#ded7c8" letter-spacing="3" text-anchor="middle">06°47'24"S 106°59'12"E • SURYAKENCANA EDELWEISS MATRIX</text>
    <text x="520" y="1200" font-family="'Times New Roman', Times, serif" font-size="16" font-style="italic" fill="#fde68a" letter-spacing="2" text-anchor="middle">Atmospheric Volcanic Simulator • Three.js Dynamic Lighting</text>

    <g transform="translate(180, 1260)">
      <rect width="680" height="90" fill="#140f0c" stroke="#d97706" stroke-width="1"/>
      <text x="340" y="35" font-family="'Courier New', monospace" font-size="15" fill="#d97706" text-anchor="middle">ELEVATION PROFILE: 1,400M - 2,958M • 10 KM TERRAIN SCALE</text>
      <text x="340" y="65" font-family="'Courier New', monospace" font-size="15" fill="#fef3c7" text-anchor="middle">PROCEDURAL FOG DENSITY • REALISTIC ALTIMETER HUD</text>
    </g>

    <rect x="64" y="1410" width="912" height="74" fill="#110d0a" stroke="#d97706" stroke-width="1.5"/>
    <text x="110" y="1454" font-family="sans-serif" font-size="28" font-weight="900" fill="#d97706">VHS</text>
    <text x="210" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#ded7c8">[ FRA_11 • EXPEDITION ]</text>
    <text x="520" y="1452" font-family="'Times New Roman', Times, serif" font-size="18" font-style="italic" fill="#fde68a" text-anchor="middle">Topographic Field Specimen • Stereo Audio</text>
    <text x="890" y="1452" font-family="'Courier New', monospace" font-size="16" fill="#d97706" text-anchor="end">YEAR 2026</text>

    ${svgVintageOverlay(1040, 1568, 1888)}
  </svg>`;
}

function getGunungGedeSpine() {
  return `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#201813"/>
    <rect x="24" y="40" width="192" height="70" fill="#000000" stroke="#d97706" stroke-width="2"/>
    <text x="120" y="86" font-family="sans-serif" font-size="36" font-weight="900" fill="#d97706" letter-spacing="2" text-anchor="middle">VHS</text>
    <text x="120" y="150" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#fde68a" letter-spacing="3" text-anchor="middle">FRA_11</text>

    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="12" font-family="'Times New Roman', Times, serif" font-size="48" font-weight="bold" fill="#fef3c7" letter-spacing="6" text-anchor="middle">GUNUNG GEDE SIM</text>
    </g>

    <text x="120" y="1320" font-family="'Courier New', monospace" font-size="16" fill="#d97706" letter-spacing="2" text-anchor="middle">ELEV. 2,958M</text>
    ${svgBarcode(30, 1420, 180, 60, 6612, '#d97706')}
    <text x="120" y="1510" font-family="'Courier New', monospace" font-size="14" fill="#ded7c8" text-anchor="middle">FIELD LOG 2026</text>
    ${svgVintageOverlay(240, 1568, 222)}
  </svg>`;
}

// Master execution array covering all project IDs in src/data/tapes.ts
const TAPES = [
  { id: 'araki-art', img: 'public/projects/araki-art.png', front: getArakiArtCover, spine: getArakiArtSpine },
  { id: 'tactiq', img: 'public/projects/TactIQ.png', front: getTactiqCover, spine: getTactiqSpine },
  { id: 'persona-3', img: 'public/projects/Persona.png', front: getPersona3Cover, spine: getPersona3Spine },
  { id: 'nusantara-observatory', img: 'public/projects/nusantara-observatory.png', front: getNusantaraCover, spine: getNusantaraSpine },
  { id: 'charles-leclerc', img: 'public/projects/Charles-Leclerc.png', front: getCharlesLeclercCover, spine: getCharlesLeclercSpine },
  { id: 'ecobite', img: 'public/projects/ecobite.png', front: getEcobiteCover, spine: getEcobiteSpine },
  { id: 'spidey-dev', img: 'public/projects/spider-dev.png', front: getSpideyDevCover, spine: getSpideyDevSpine },
  { id: 'fersya-shop', img: 'public/projects/fersya-shop.webp', front: getFersyaShopCover, spine: getFersyaShopSpine },
  { id: 'student-life', img: 'public/projects/student-life.png', front: getStudentLifeCover, spine: getStudentLifeSpine },
  { id: 'stock-prediction', img: 'public/projects/stock-prediction.png', front: getStockPredictorCover, spine: getStockPredictorSpine },
  { id: 'street-rush', img: 'public/projects/street-rush.webp', front: getStreetRushCover, spine: getStreetRushSpine },
  { id: 'gunung-gede', img: 'public/projects/Gunung-Gede.webp', front: getGunungGedeCover, spine: getGunungGedeSpine },
];

async function generateAll() {
  const outDir = path.join(process.cwd(), 'public', 'tapes');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Starting generation of all ${TAPES.length} bespoke VHS sleeves...`);

  for (const item of TAPES) {
    const b64 = getBase64Image(item.img);
    const frontSvg = item.front(b64);
    const spineSvg = item.spine();

    const frontPath = path.join(outDir, `${item.id}-front.webp`);
    const spinePath = path.join(outDir, `${item.id}-spine.webp`);

    await sharp(Buffer.from(frontSvg))
      .webp({ quality: 95, effort: 4 })
      .toFile(frontPath);

    await sharp(Buffer.from(spineSvg))
      .webp({ quality: 95, effort: 4 })
      .toFile(spinePath);

    console.log(`✓ Generated: ${item.id}-front.webp & ${item.id}-spine.webp`);
  }

  // Also create aliases for compatibility (stock-predictor -> stock-prediction, ferrel-portfolio -> persona-3)
  fs.copyFileSync(path.join(outDir, 'stock-prediction-front.webp'), path.join(outDir, 'stock-predictor-front.webp'));
  fs.copyFileSync(path.join(outDir, 'stock-prediction-spine.webp'), path.join(outDir, 'stock-predictor-spine.webp'));
  fs.copyFileSync(path.join(outDir, 'persona-3-front.webp'), path.join(outDir, 'ferrel-portfolio-front.webp'));
  fs.copyFileSync(path.join(outDir, 'persona-3-spine.webp'), path.join(outDir, 'ferrel-portfolio-spine.webp'));

  console.log(`All VHS tape covers and spines successfully created in public/tapes/!`);
}

generateAll().catch((err) => {
  console.error('Generation error:', err);
  process.exit(1);
});
