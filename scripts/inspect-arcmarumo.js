const { chromium } = require('playwright');
const path = require('path');

async function inspectArcmarumo() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to https://www.arcmarumo.com/profile ...');
  try {
    await page.goto('https://www.arcmarumo.com/profile', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(__dirname, '../public/arcmarumo-profile.png') });
    console.log('Captured arcmarumo-profile.png');

    const profileData = await page.evaluate(() => {
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim()).filter(Boolean),
        sections: Array.from(document.querySelectorAll('section, main, article')).map(s => ({
          tag: s.tagName,
          classes: s.className,
          textSample: s.innerText.slice(0, 200).replace(/\n+/g, ' ')
        })),
        structure: document.body.innerText.slice(0, 1500)
      };
    });
    console.log('PROFILE DATA:', JSON.stringify(profileData, null, 2));
  } catch (err) {
    console.error('Error fetching profile:', err.message);
  }

  console.log('Navigating to https://www.arcmarumo.com/news-watch ...');
  try {
    await page.goto('https://www.arcmarumo.com/news-watch', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(__dirname, '../public/arcmarumo-newswatch.png') });
    console.log('Captured arcmarumo-newswatch.png');

    const newsData = await page.evaluate(() => {
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim()).filter(Boolean),
        structure: document.body.innerText.slice(0, 1500)
      };
    });
    console.log('NEWS WATCH DATA:', JSON.stringify(newsData, null, 2));
  } catch (err) {
    console.error('Error fetching news-watch:', err.message);
  }

  await browser.close();
}

inspectArcmarumo().catch(console.error);

