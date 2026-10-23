const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const curatedShots = [
  // EP 01
  { ep: 1, file: "shot-01-incident.webp", title: "File:Gloria Martinez 01 EP1 CPEDGE.jpg" },
  { ep: 1, file: "shot-02-cyberware.webp", title: "File:Neuralport & Sandevistan CPEDGE.jpg" },
  { ep: 1, file: "shot-03-climax.webp", title: "File:Katsuo David 01 EP1 CPEDGE.jpg" },
  { ep: 1, file: "shot-04-panoramic.webp", title: "File:Arasaka Academy 01 EP1 CPEDGE.jpg" },

  // EP 02
  { ep: 2, file: "shot-01-incident.webp", title: "File:LikeABoy Infobox CPEDGE.png" },
  { ep: 2, file: "shot-02-character.webp", title: "File:Lucy Inside Look 2 ScreenCap CPEDGE.png" },
  { ep: 2, file: "shot-03-climax.webp", title: "File:David Lucy Moon CPEDGE.jpg" },
  { ep: 2, file: "shot-04-panoramic.webp", title: "File:David Lucy Moon 03 EP2 CPEDGE.jpg" },

  // EP 03
  { ep: 3, file: "shot-01-incident.webp", title: "File:SmoothCriminal Infobox CPEDGE.png" },
  { ep: 3, file: "shot-02-character.webp", title: "File:David and Maine at Freight Station CPEDGE.png" },
  { ep: 3, file: "shot-03-climax.webp", title: "File:Maine Inside Look 2 ScreenCap CPEDGE.png" },
  { ep: 3, file: "shot-04-panoramic.webp", title: "File:Pilar Inside Look 2 ScreenCap CPEDGE.png" },

  // EP 04
  { ep: 4, file: "shot-01-incident.webp", title: "File:LuckyYou Infobox CPEDGE.png" },
  { ep: 4, file: "shot-02-character.webp", title: "File:Cyberpunk Edgerunners Rebecca Guns 01 CPEDGE.jpg" },
  { ep: 4, file: "shot-03-climax.webp", title: "File:Rebecca David CPEDGE.jpg" },
  { ep: 4, file: "shot-04-panoramic.webp", title: "File:NCART EP4 CPEDGE.jpg" },

  // EP 05
  { ep: 5, file: "shot-01-incident.webp", title: "File:AllEyezOnMe Infobox CPEDGE.png" },
  { ep: 5, file: "shot-02-character.webp", title: "File:CPEDGE Faraday 1.jpg" },
  { ep: 5, file: "shot-03-climax.webp", title: "File:James Norris 01 CPEDGE.png" },
  { ep: 5, file: "shot-04-panoramic.webp", title: "File:James Norris 02 CPEDGE.png" },

  // EP 06
  { ep: 6, file: "shot-01-incident.webp", title: "File:GirlOnFire Infobox CPEDGE.png" },
  { ep: 6, file: "shot-02-character.webp", title: "File:Dorio Inside Look 2 ScreenCap CPEDGE.png" },
  { ep: 6, file: "shot-03-climax.webp", title: "File:Maine Inside Look 2 ScreenCap CPEDGE.png" },
  { ep: 6, file: "shot-04-panoramic.webp", title: "File:Kiwi Inside Look 2 ScreenCap CPEDGE.png" },

  // EP 07
  { ep: 7, file: "shot-01-incident.webp", title: "File:Stronger Infobox CPEDGE.png" },
  { ep: 7, file: "shot-02-character.webp", title: "File:Lucy 01 Stronger CPEDGE.png" },
  { ep: 7, file: "shot-03-climax.webp", title: "File:Child Lucy 01 Stronger CPEDGE.png" },
  { ep: 7, file: "shot-04-panoramic.webp", title: "File:David Inside Look 2 ScreenCap CPEDGE.png" },

  // EP 08
  { ep: 8, file: "shot-01-incident.webp", title: "File:Stay Infobox CPEDGE.png" },
  { ep: 8, file: "shot-02-character.webp", title: "File:CP Edge Cormac.png" },
  { ep: 8, file: "shot-03-climax.webp", title: "File:CPED time jump to 77.png" },
  { ep: 8, file: "shot-04-panoramic.webp", title: "File:David and Lucy arrive at Freight Station CPEDGE.png" },

  // EP 09
  { ep: 9, file: "shot-01-incident.webp", title: "File:Humanity Infobox CPEDGE.png" },
  { ep: 9, file: "shot-02-character.webp", title: "File:Prototype Cyberskeleton Infobox CPEDGE.png" },
  { ep: 9, file: "shot-03-climax.webp", title: "File:Falco EP09 CPEDGE.jpg" },
  { ep: 9, file: "shot-04-panoramic.webp", title: "File:Militech Mobile Missile System CPEDGE.png" },

  // EP 10
  { ep: 10, file: "shot-01-incident.webp", title: "File:David Martinez 01 My Moon My Man CPEDGE.png" },
  { ep: 10, file: "shot-02-character.webp", title: "File:Falco Rebecca EP10 CPEDGE.jpg" },
  { ep: 10, file: "shot-03-climax.webp", title: "File:Moon AV EP10 CPEDGE.jpg" },
  { ep: 10, file: "shot-04-panoramic.webp", title: "File:Lucy Moon 01 EP10 CPEDGE.jpg" }
];

async function run() {
  console.log(`Resolving URLs for ${curatedShots.length} curated 16:9 shots...`);
  const titles = Array.from(new Set(curatedShots.map(s => s.title))).join('|');
  const url = `https://cyberpunk.fandom.com/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|size&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = Object.values(data.query.pages);

  for (const item of curatedShots) {
    const page = pages.find(p => p.title.toLowerCase() === item.title.toLowerCase());
    if (!page || !page.imageinfo || !page.imageinfo[0]) {
      console.warn(`COULD NOT RESOLVE: ${item.title}`);
      continue;
    }
    const downloadUrl = page.imageinfo[0].url;
    const epDir = path.join(__dirname, `../public/edgerunners/ep-${String(item.ep).padStart(2, '0')}`);
    fs.mkdirSync(epDir, { recursive: true });
    const targetPath = path.join(epDir, item.file);

    console.log(`Processing EP ${item.ep} -> ${item.file} from ${item.title} (${page.imageinfo[0].width}x${page.imageinfo[0].height})...`);
    const imgRes = await fetch(downloadUrl);
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());

    await sharp(buf)
      .resize(1920, 1080, { fit: 'cover', position: 'center' })
      .webp({ quality: 92 })
      .toFile(targetPath);
    console.log(`Successfully saved ${targetPath}`);
  }
  console.log('ALL CURATED SHOTS SUCCESSFULLY SAVED!');
}

run().catch(console.error);

