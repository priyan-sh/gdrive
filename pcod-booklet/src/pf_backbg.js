const { chromium } = require('playwright'); const path = require('path');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" viewBox="0 0 595 842" font-family="Poppins, sans-serif">
<defs><linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A62683"/><stop offset="1" stop-color="#624E88"/></linearGradient></defs>
<path d="M0,790 C150,764 320,808 595,772 L595,842 L0,842 Z" fill="url(#band)"/>
<text x="297" y="824" font-size="13" font-weight="500" fill="#fff" font-style="italic" text-anchor="middle">Hope Blooms from Within</text></svg>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 595, height: 842 }, deviceScaleFactor: 3 });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`); await p.waitForTimeout(150);
  await p.screenshot({ path: path.join(__dirname, '../assets/img/pf_backbg.png'), omitBackground: true, clip: { x: 0, y: 0, width: 595, height: 842 } }); await b.close(); console.log('ok'); })();
