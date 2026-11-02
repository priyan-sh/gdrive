// Renders every SVG graphic to PNG (3x) for both languages.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const { G } = require('./graphics');
const content = require('./content');
(async () => {
  const browser = await chromium.launch();
  const only = process.argv[2] ? process.argv[2].split(',') : null;
  for (const lang of ['en', 'hi']) {
    const dir = path.join(__dirname, '../assets/img', lang); fs.mkdirSync(dir, { recursive: true });
    for (const [name, fn] of Object.entries(G)) {
      if (only && !only.includes(name)) continue;
      const { w, h, svg } = fn(content[lang]);
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 3 });
      await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(dir, name + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
      await page.close();
    }
  }
  await browser.close();
  console.log('rendered');
})();
