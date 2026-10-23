const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const characters = [
  { id: 'david', title: 'File:David Infobox CPEDGE.png' },
  { id: 'lucy', title: 'File:Lucy Infobox CPEDGE.png' },
  { id: 'rebecca', title: 'File:Rebecca Infobox CPEDGE.png' },
  { id: 'maine', title: 'File:Maine Infobox CPEDGE.png' },
  { id: 'kiwi', title: 'File:Kiwi Infobox CPEDGE.jpg' },
  { id: 'dorio', title: 'File:Dorio Infobox CPEDGE.png' },
  { id: 'pilar', title: 'File:Pilar Infobox CPEDGE.png' },
  { id: 'faraday', title: 'File:Faraday Infobox CPEDGE.png' },
  { id: 'adam-smasher', title: 'File:Adam Smasher Infobox CPEDGE.png' },
  { id: 'gloria', title: 'File:Gloria Infobox CPEDGE.png' },
  { id: 'falco', title: 'File:Falco Infobox CPEDGE.jpg' }
];

async function run() {
  const targetDir = path.join(__dirname, '../public/characters');
  fs.mkdirSync(targetDir, { recursive: true });

  const titles = characters.map(c => c.title).join('|');
  const apiUrl = `https://cyberpunk.fandom.com/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|size&format=json`;

  console.log('Fetching image URLs from Cyberpunk Wiki API...');
  const res = await fetch(apiUrl);
  const data = await res.json();
  const pages = Object.values(data.query.pages);

  for (const item of characters) {
    const page = pages.find(p => p.title.toLowerCase() === item.title.toLowerCase());
    if (!page || !page.imageinfo || !page.imageinfo[0]) {
      console.error(`FAILED to resolve: ${item.title}`);
      continue;
    }

    const imgUrl = page.imageinfo[0].url;
    console.log(`Downloading ${item.id} from ${imgUrl}...`);
    const imgRes = await fetch(imgUrl);
    if (!imgRes.ok) throw new Error(`HTTP error ${imgRes.status} for ${item.id}`);

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const destPath = path.join(targetDir, `${item.id}.webp`);

    // Standardize to crisp 2:3 vertical poster with dark cyber backdrop
    await sharp(buffer)
      .resize(600, 900, {
        fit: 'contain',
        background: { r: 12, g: 12, b: 15, alpha: 1 }
      })
      .webp({ quality: 95 })
      .toFile(destPath);

    console.log(`Saved ${destPath} (600x900)`);
  }

  console.log('ALL 11 CHARACTER PORTRAITS SUCCESSFULLY DOWNLOADED AND OPTIMIZED!');
}

run().catch(console.error);

