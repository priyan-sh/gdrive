// Renders the Patient File cover (A4, 595 x 842 pt) to assets/img/pf_cover.png
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../assets/img/logo.png')).toString('base64');
const P = '#A62683', LP = '#624E88', PK = '#F29BAA', PKT = '#FDEBEF', PT = '#F7E4F0';
let dots = '';
const n = 20;
for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; dots += `<circle cx="${(470 + 78 * Math.cos(a)).toFixed(1)}" cy="${(150 + 48 * Math.sin(a)).toFixed(1)}" r="${i % 3 ? 5 : 7}" fill="${PK}"/>`; }
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" viewBox="0 0 595 842" font-family="Poppins, sans-serif">
<defs>
 <linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P}"/><stop offset="1" stop-color="${LP}"/></linearGradient>
 <filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="${P}" flood-opacity=".18"/></filter>
</defs>
<rect width="595" height="842" fill="#fff"/>
<circle cx="560" cy="60" r="230" fill="${PKT}"/><circle cx="20" cy="520" r="150" fill="${PT}" opacity=".6"/>
<ellipse cx="470" cy="150" rx="104" ry="68" fill="none" stroke="${PK}" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>${dots}
<image href="${logo}" x="34" y="34" width="300" height="118"/>
<rect x="44" y="214" width="132" height="28" rx="14" fill="${PK}"/><text x="110" y="233" font-size="11.5" font-weight="700" fill="#fff" text-anchor="middle">PATIENT FILE</text>
<text x="44" y="296" font-size="30" font-weight="600" fill="${LP}">My PCOD Xpert</text>
<text x="42" y="362" font-size="64" font-weight="700" fill="${P}">Patient File</text>
<text x="44" y="400" font-size="13.5" fill="#6B6275">PCOD  |  PCOS  |  PMOS  ·  Care from a multidisciplinary team</text>
<text x="44" y="420" font-size="13.5" fill="#6B6275">under one roof</text>
<g filter="url(#sh)"><rect x="34" y="468" width="527" height="232" rx="22" fill="#fff"/></g>
<rect x="34" y="468" width="527" height="232" rx="22" fill="none" stroke="${PK}" stroke-width="2"/>
<rect x="34" y="468" width="527" height="34" rx="0" fill="${P}" clip-path="inset(0 round 22px 22px 0 0)"/>
<path d="M34,490 a22,22 0 0 1 22,-22 h483 a22,22 0 0 1 22,22 v12 h-527 z" fill="${P}"/>
<text x="56" y="491" font-size="11" font-weight="700" fill="#fff" letter-spacing="1.5">THIS FILE BELONGS TO</text>
<path d="M0,770 C150,744 320,788 595,752 L595,842 L0,842 Z" fill="url(#band)"/>
<text x="297" y="812" font-size="15" font-weight="500" fill="#fff" font-style="italic" text-anchor="middle">Hope Blooms from Within</text>
</svg>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 595, height: 842 }, deviceScaleFactor: 3 });
  await p.setContent(`<html><body style="margin:0">${svg}</body></html>`); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(__dirname, '../assets/img/pf_cover.png'), clip: { x: 0, y: 0, width: 595, height: 842 } });
  await b.close(); console.log('cover ok');
})();
