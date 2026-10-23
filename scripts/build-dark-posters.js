const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function svgBarcode(x, y, w, h, seed = 1234, color = '#ffffff') {
  let s = seed;
  const rand = () => (s = (16807 * s) % 0x7fffffff) / 0x7fffffff;
  let lines = '';
  let curX = x;
  while (curX < x + w - 6) {
    const barW = rand() > 0.5 ? 4 : 2;
    const gap = 2 + rand() * 4;
    lines += `<rect x="${curX.toFixed(1)}" y="${y}" width="${barW}" height="${h}" fill="${color}" opacity="0.85"/>`;
    curX += barW + gap;
  }
  return `<g>${lines}</g>`;
}

async function buildGunungGede() {
  const mountainBuf = await sharp('public/projects/Gunung Gede Poster.png')
    .resize(960, 680, { fit: 'cover' })
    .toBuffer();
  const mountainB64 = `data:image/png;base64,${mountainBuf.toString('base64')}`;

  const frontSvg = `<svg width="1040" height="1568" viewBox="0 0 1040 1568" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="vignette-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#070a08" stop-opacity="1"/>
        <stop offset="45%" stop-color="#070a08" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#070a08" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="vignette-bot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#070a08" stop-opacity="0"/>
        <stop offset="60%" stop-color="#070a08" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#070a08" stop-opacity="1"/>
      </linearGradient>
    </defs>

    <!-- Deep obsidian black background -->
    <rect width="1040" height="1568" fill="#070a08"/>

    <!-- Subtle golden topographical elevation contour lines -->
    <path d="M 0 280 Q 280 180 540 290 T 1040 240 M 0 350 Q 360 280 660 380 T 1040 320 M 0 420 Q 300 370 600 450 T 1040 400 M 0 1180 Q 320 1250 680 1160 T 1040 1220 M 0 1260 Q 360 1320 720 1230 T 1040 1290" fill="none" stroke="#d97706" stroke-width="1.2" opacity="0.18"/>

    <!-- Outer archival hairline border (matching Araki / TactIQ) -->
    <rect x="36" y="36" width="968" height="1496" fill="none" stroke="#d97706" stroke-width="1.5" opacity="0.4"/>
    <rect x="44" y="44" width="952" height="1480" fill="none" stroke="#d97706" stroke-width="0.8" opacity="0.25"/>

    <!-- Top Technical Editorial Header -->
    <text x="520" y="88" font-family="'Times New Roman', Times, serif" font-size="18" font-weight="bold" fill="#d97706" letter-spacing="7" text-anchor="middle">★  ARCHIVAL EXPEDITION  •  FIELD SURVEY LOG  ★</text>
    <text x="520" y="116" font-family="'Courier New', monospace" font-size="13" fill="#fde68a" letter-spacing="4" text-anchor="middle">GUNUNG GEDE PANGRANGO NATIONAL PARK  •  WEST JAVA</text>

    <!-- Central Cinematic Mountain Image Frame -->
    <g transform="translate(40, 148)">
      <image href="${mountainB64}" x="0" y="0" width="960" height="680" preserveAspectRatio="xMidYMid slice"/>
      <!-- Seamless vignette fading into obsidian black on top and bottom -->
      <rect x="0" y="0" width="960" height="150" fill="url(#vignette-top)"/>
      <rect x="0" y="440" width="960" height="240" fill="url(#vignette-bot)"/>
      
      <!-- Topo overlay across image -->
      <path d="M 40 300 C 200 240, 400 340, 600 280 S 840 250, 920 310" fill="none" stroke="#fbbf24" stroke-width="1.4" opacity="0.4"/>
      <path d="M 40 380 C 240 320, 460 410, 680 350 S 880 320, 920 390" fill="none" stroke="#fbbf24" stroke-width="1.4" opacity="0.35"/>
      
      <!-- Golden corner brackets -->
      <path d="M 0,40 L 0,0 L 40,0" fill="none" stroke="#d97706" stroke-width="2.5"/>
      <path d="M 920,0 L 960,0 L 960,40" fill="none" stroke="#d97706" stroke-width="2.5"/>
      <path d="M 0,640 L 0,680 L 40,680" fill="none" stroke="#d97706" stroke-width="2.5"/>
      <path d="M 920,680 L 960,680 L 960,640" fill="none" stroke="#d97706" stroke-width="2.5"/>
    </g>

    <!-- Floating Expedition Badge -->
    <g transform="translate(80, 770)">
      <rect width="170" height="52" fill="#070a08" stroke="#d97706" stroke-width="1.5" rx="2" opacity="0.9"/>
      <text x="85" y="22" font-family="'Times New Roman', Times, serif" font-size="11" font-weight="bold" fill="#d97706" letter-spacing="2" text-anchor="middle">SUMMIT ELEVATION</text>
      <text x="85" y="42" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#fef3c7" letter-spacing="2" text-anchor="middle">2,958M ASL</text>
    </g>

    <!-- Main Editorial Title Typography -->
    <text x="520" y="920" font-family="'Times New Roman', Times, serif" font-size="24" font-weight="bold" fill="#d97706" letter-spacing="10" text-anchor="middle">EKSPEDISI</text>
    <text x="520" y="1010" font-family="'Times New Roman', Times, serif" font-size="88" font-weight="bold" fill="#fef3c7" letter-spacing="4" text-anchor="middle">GUNUNG GEDE</text>
    <text x="520" y="1068" font-family="'Times New Roman', Times, serif" font-size="28" font-style="italic" fill="#d97706" letter-spacing="6" text-anchor="middle">3D ENVIRONMENTAL TRAIL SIMULATION</text>

    <!-- Hairline Divider -->
    <line x1="160" y1="1110" x2="880" y2="1110" stroke="#d97706" stroke-width="1.5" opacity="0.4"/>

    <!-- Editorial Synopsis Paragraph -->
    <text x="520" y="1160" font-family="'Courier New', monospace" font-size="14" fill="#e2e8f0" opacity="0.85" letter-spacing="2" text-anchor="middle">SURYA KENCANA MEADOW  •  MANDALAWANGI SADDLE</text>
    <text x="520" y="1190" font-family="'Courier New', monospace" font-size="13" fill="#94a3b8" opacity="0.75" letter-spacing="1.5" text-anchor="middle">FULL 1:1 GPS TOPOGRAPHIC TRAIL MAPPING VIA GUNUNG PUTRI</text>

    <!-- Bottom Technical Specs Block and Barcode -->
    <rect x="80" y="1280" width="880" height="180" fill="#050806" stroke="#d97706" stroke-width="1" opacity="0.75"/>
    
    <text x="110" y="1325" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#d97706" letter-spacing="3">NTSC-SP • MASTER REEL</text>
    <text x="110" y="1352" font-family="'Courier New', monospace" font-size="11" fill="#94a3b8" letter-spacing="1">AUDIO: HI-FI DOLBY SURROUND</text>
    <text x="110" y="1376" font-family="'Courier New', monospace" font-size="11" fill="#94a3b8" letter-spacing="1">EXPEDITION CODE: FRA_11 // 2024</text>
    <text x="110" y="1400" font-family="'Courier New', monospace" font-size="11" fill="#94a3b8" letter-spacing="1">PLATFORM: 3D TERRAIN MAPPING</text>

    <!-- Minimal Barcode -->
    ${svgBarcode(720, 1315, 210, 60, 4829, '#d97706')}
    <text x="825" y="1395" font-family="'Courier New', monospace" font-size="10" fill="#d97706" letter-spacing="2" text-anchor="middle">07719-2958-GG</text>

    <!-- Bottom Stamp -->
    <text x="520" y="1505" font-family="'Courier New', monospace" font-size="12" fill="#d97706" letter-spacing="5" text-anchor="middle">[ TAMAN NASIONAL GEDE PANGRANGO ARCHIVE ]</text>
  </svg>`;

  await sharp(Buffer.from(frontSvg))
    .webp({ quality: 96, effort: 6 })
    .toFile('public/tapes/gunung-gede-front.webp');

  await sharp(Buffer.from(frontSvg))
    .png()
    .toFile('public/projects/Gunung Gede Poster.png');

  // Gunung Gede Spine (240x1568)
  const spineSvg = `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#070a08"/>
    <rect x="0" y="0" width="240" height="260" fill="#141c14" stroke="#d97706" stroke-width="1.5"/>
    <text x="120" y="120" font-family="'Times New Roman', Times, serif" font-size="82" font-weight="bold" fill="#fef3c7" letter-spacing="-2" text-anchor="middle">11</text>
    <text x="120" y="170" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#d97706" letter-spacing="3" text-anchor="middle">EXPEDITION</text>
    <text x="120" y="210" font-family="'Courier New', monospace" font-size="15" font-weight="bold" fill="#94a3b8" letter-spacing="2" text-anchor="middle">FRA_11</text>

    <!-- Vertical Spine Title -->
    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="14" font-family="'Times New Roman', Times, serif" font-size="52" font-weight="bold" fill="#fef3c7" letter-spacing="8" text-anchor="middle">EKSPEDISI GUNUNG GEDE</text>
      <text x="0" y="60" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#d97706" letter-spacing="6" text-anchor="middle">2,958M ASL • 3D TRAIL GUIDE</text>
    </g>

    <!-- Bottom Badge and Barcode -->
    <rect x="18" y="1360" width="204" height="160" fill="#050806" stroke="#d97706" stroke-width="1" opacity="0.8"/>
    <text x="120" y="1395" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#d97706" letter-spacing="2" text-anchor="middle">HI-FI STEREO</text>
    ${svgBarcode(30, 1415, 180, 50, 4829, '#d97706')}
    <text x="120" y="1495" font-family="'Courier New', monospace" font-size="10" fill="#d97706" letter-spacing="2" text-anchor="middle">PAL-HQ</text>
  </svg>`;

  await sharp(Buffer.from(spineSvg))
    .webp({ quality: 96, effort: 6 })
    .toFile('public/tapes/gunung-gede-spine.webp');

  console.log('Gunung Gede front & spine built successfully!');
}

async function buildStudentLifeSpine() {
  const spineSvg = `<svg width="240" height="1568" viewBox="0 0 240 1568" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="1568" fill="#08090d"/>
    <rect x="0" y="0" width="240" height="260" fill="#081b33" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="120" y="120" font-family="'Times New Roman', Times, serif" font-size="82" font-weight="bold" fill="#ffffff" letter-spacing="-2" text-anchor="middle">08</text>
    <text x="120" y="170" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#38bdf8" letter-spacing="3" text-anchor="middle">PRODUCTIVITY</text>
    <text x="120" y="210" font-family="'Courier New', monospace" font-size="15" font-weight="bold" fill="#94a3b8" letter-spacing="2" text-anchor="middle">FRA_08</text>

    <!-- Vertical Spine Title -->
    <g transform="translate(120, 800) rotate(90)">
      <text x="0" y="14" font-family="'Times New Roman', Times, serif" font-size="52" font-weight="bold" fill="#ffffff" letter-spacing="8" text-anchor="middle">STUDENT LIFE</text>
      <text x="0" y="60" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#38bdf8" letter-spacing="6" text-anchor="middle">ACADEMIC COMPANION • PWA</text>
    </g>

    <!-- Bottom Badge and Barcode -->
    <rect x="18" y="1360" width="204" height="160" fill="#05060a" stroke="#38bdf8" stroke-width="1" opacity="0.8"/>
    <text x="120" y="1395" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#38bdf8" letter-spacing="2" text-anchor="middle">HI-FI STEREO</text>
    ${svgBarcode(30, 1415, 180, 50, 9382, '#38bdf8')}
    <text x="120" y="1495" font-family="'Courier New', monospace" font-size="10" fill="#38bdf8" letter-spacing="2" text-anchor="middle">NTSC-SP</text>
  </svg>`;

  await sharp(Buffer.from(spineSvg))
    .webp({ quality: 96, effort: 6 })
    .toFile('public/tapes/student-life-spine.webp');

  console.log('Student Life spine built successfully!');
}

async function main() {
  await Promise.all([buildGunungGede(), buildStudentLifeSpine()]);
}

main().catch(console.error);
