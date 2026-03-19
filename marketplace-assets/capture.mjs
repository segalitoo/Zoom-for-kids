import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function capture() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 780, deviceScaleFactor: 2 });

  for (const name of ['mockup1', 'mockup2', 'mockup3']) {
    const htmlPath = path.join(__dirname, `${name}.html`);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 15000 });
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(__dirname, `${name}.png`),
      clip: { x: 0, y: 0, width: 1200, height: 780 },
    });
    console.log(`Captured ${name}.png`);
  }

  await browser.close();
  console.log('Done!');
}

capture().catch(console.error);
