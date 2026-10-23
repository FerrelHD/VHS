const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const episodes = [
  {
    ep: 1,
    id: "ep-01",
    title: "LET YOU DOWN",
    poster: "Cyberpunk Edgerunners_ Let You Down.png",
    bg: "#0a0414",
    stroke: "#a855f7",
    textColor: "#c084fc",
    accentColor: "#facc15",
    subtext: "SANTO DOMINGO",
    year: "2076"
  },
  {
    ep: 2,
    id: "ep-02",
    title: "LIKE A BOY",
    poster: "Vintage Cyberpunk Edgerunners VHS Poster.png",
    bg: "#0f0e0a",
    stroke: "#f5eed2",
    textColor: "#f5eed2",
    accentColor: "#c4b998",
    subtext: "NIGHT CITY",
    year: "2022"
  },
  {
    ep: 3,
    id: "ep-03",
    title: "SMOOTH CRIMINAL",
    poster: "Cyberpunk Edgerunners_ Smooth Criminal.png",
    bg: "#140507",
    stroke: "#ef4444",
    textColor: "#f87171",
    accentColor: "#fee2e2",
    subtext: "MAINE CREW",
    year: "2076"
  },
  {
    ep: 4,
    id: "ep-04",
    title: "LUCKY YOU",
    poster: "Lucky You Edgerunners VHS Poster.png",
    bg: "#0e1307",
    stroke: "#84cc16",
    textColor: "#a3e635",
    accentColor: "#fef08a",
    subtext: "MAELSTROM HEIST",
    year: "2076"
  },
  {
    ep: 5,
    id: "ep-05",
    title: "ALL EYEZ ON ME",
    poster: "Cyberpunk Edgerunners_ All Eyez on Me.png",
    bg: "#150503",
    stroke: "#f97316",
    textColor: "#fb923c",
    accentColor: "#ffedd5",
    subtext: "JK BRAINDANCE",
    year: "2076"
  },
  {
    ep: 6,
    id: "ep-06",
    title: "GIRL ON FIRE",
    poster: "Cyberpunk Girl on Fire VHS Poster.png",
    bg: "#190510",
    stroke: "#ec4899",
    textColor: "#f472b6",
    accentColor: "#fdf2f8",
    subtext: "OVERDRIVE",
    year: "2076"
  },
  {
    ep: 7,
    id: "ep-07",
    title: "STRONGER",
    poster: "Cyberpunk Edgerunners_ Stronger Episode 07.png",
    bg: "#0c1409",
    stroke: "#22c55e",
    textColor: "#4ade80",
    accentColor: "#fef08a",
    subtext: "FULL CHROME",
    year: "2076"
  },
  {
    ep: 8,
    id: "ep-08",
    title: "STAY",
    poster: "Cyberpunk Edgerunners_ Stay Orange.png",
    bg: "#1a0a03",
    stroke: "#f97316",
    textColor: "#fb923c",
    accentColor: "#fef3c7",
    subtext: "DEEP NET ICE",
    year: "2076"
  },
  {
    ep: 9,
    id: "ep-09",
    title: "HUMANITY",
    poster: "Distressed Cyberpunk Humanity VHS Cover.png",
    bg: "#04091a",
    stroke: "#3b82f6",
    textColor: "#60a5fa",
    accentColor: "#e0f2fe",
    subtext: "CYBERSKELETON",
    year: "2076"
  },
  {
    ep: 10,
    id: "ep-10",
    title: "MY MOON MY MAN",
    poster: "My Moon My Man VHS Poster.png",
    bg: "#100e08",
    stroke: "#eab308",
    textColor: "#fde047",
    accentColor: "#fefce8",
    subtext: "THE MOON",
    year: "2076"
  }
];

async function processAll() {
  const tapesDir = path.join(__dirname, '../public/tapes');
  fs.mkdirSync(tapesDir, { recursive: true });

  for (const item of episodes) {
    const posterPath = path.join(__dirname, '../public/projects', item.poster);
    const frontOut = path.join(tapesDir, `${item.id}-front.webp`);
    const spineOut = path.join(tapesDir, `${item.id}-spine.webp`);

    console.log(`Processing EP ${item.ep}: ${item.title}...`);

    // 1. Front sleeve (1040 x 1568)
    await sharp(posterPath)
      .resize(1040, 1568, { fit: 'fill' })
      .webp({ quality: 96 })
      .toFile(frontOut);
    console.log(`Saved front: ${frontOut}`);

    // 2. Spine sleeve (112 x 1568 SVG)
    // Adjust font size if title is long
    const titleLength = item.title.length;
    const fontSize = titleLength > 12 ? 32 : (titleLength > 8 ? 38 : 42);
    const letterSpacing = titleLength > 12 ? 6 : (titleLength > 8 ? 9 : 12);

    const spineSvg = Buffer.from(`
      <svg width="112" height="1568" xmlns="http://www.w3.org/2000/svg">
        <rect width="112" height="1568" fill="${item.bg}" />
        <rect x="8" y="16" width="96" height="1536" fill="none" stroke="${item.stroke}" stroke-opacity="0.35" stroke-width="1.5" />
        
        <!-- Top Badges -->
        <text x="56" y="70" font-family="monospace" font-size="16" font-weight="bold" fill="${item.textColor}" text-anchor="middle">[VHS]</text>
        <text x="56" y="110" font-family="monospace" font-size="14" font-weight="bold" fill="${item.stroke}" text-anchor="middle">HI-FI</text>
        <text x="56" y="150" font-family="monospace" font-size="20" font-weight="900" fill="${item.accentColor}" text-anchor="middle">EP.${String(item.ep).padStart(2, '0')}</text>
        
        <line x1="20" y1="180" x2="92" y2="180" stroke="${item.stroke}" stroke-opacity="0.4" stroke-width="1.5" />

        <!-- Vertical Title -->
        <g transform="rotate(90, 56, 784)">
          <text x="56" y="794" font-family="serif" font-size="${fontSize}" font-weight="900" fill="${item.textColor}" text-anchor="middle" letter-spacing="${letterSpacing}">${item.title}</text>
        </g>

        <!-- Bottom Badges -->
        <line x1="20" y1="1380" x2="92" y2="1380" stroke="${item.stroke}" stroke-opacity="0.4" stroke-width="1.5" />
        <text x="56" y="1420" font-family="monospace" font-size="15" font-weight="bold" fill="${item.accentColor}" text-anchor="middle">TRIGGER</text>
        <text x="56" y="1460" font-family="monospace" font-size="14" fill="${item.stroke}" text-anchor="middle">${item.subtext}</text>
        <text x="56" y="1500" font-family="monospace" font-size="14" fill="#888888" text-anchor="middle">${item.year}</text>
      </svg>
    `);

    await sharp(spineSvg)
      .webp({ quality: 96 })
      .toFile(spineOut);
    console.log(`Saved spine: ${spineOut}`);
  }

  console.log('ALL 10 TAPES PROCESSED SUCCESSFULLY!');
}

processAll().catch(console.error);

