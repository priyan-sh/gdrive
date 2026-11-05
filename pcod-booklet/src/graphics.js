// SVG illustration generators. Each takes the language dictionary `t` and returns {w,h,svg}.
const fs = require('fs');
const path = require('path');

const C = {
  P: '#A62683', LP: '#624E88', PK: '#F29BAA',
  PKT: '#FDEBEF', PT: '#F7E4F0', LT: '#ECE8F3',
  INK: '#2A1F33', GREY: '#6B6275', W: '#FFFFFF',
  G: '#3A9D6E', GT: '#E3F3EA', A: '#E9A23B', AT: '#FFF1D6', R: '#D64545', RT: '#FBE3E3',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const isDev = (s) => /[ऀ-ॿ]/.test(s);

// approximate text wrapping by pixel width
function wrap(str, size, maxPx) {
  const out = [];
  str.split('\n').forEach((para) => {
    const words = para.split(' ');
    let cur = '';
    words.forEach((w) => {
      const test = cur ? cur + ' ' + w : w;
      const cw = (isDev(test) ? 0.6 : 0.56) * size;
      if (test.length * cw > maxPx && cur) { out.push(cur); cur = w; } else cur = test;
    });
    if (cur) out.push(cur);
  });
  return out;
}

// multi-line text; `lines` array or string with \n
function T(s, x, y, o = {}) {
  const { size = 12, w = 400, fill = C.INK, anchor = 'middle', lh = 1.3, maxPx, italic } = o;
  const lines = Array.isArray(s) ? s : maxPx ? wrap(s, size, maxPx) : String(s).split('\n');
  const dev = lines.some(isDev);
  const LH = size * (dev ? lh + 0.12 : lh);
  return lines.map((ln, i) =>
    `<text x="${x}" y="${(y + i * LH).toFixed(1)}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}"${italic ? ' font-style="italic"' : ''}>${esc(ln)}</text>`
  ).join('');
}
const textH = (lines, size) => lines.length * size * 1.35;

const emo = (e, x, y, size) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" font-family="'Noto Color Emoji'">${e}</text>`;
const rr = (x, y, w, h, r, fill, stroke, sw = 1.5, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''} ${extra}/>`;

function svg(w, h, body, defs = '') {
  return {
    w, h,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs><g font-family="Poppins, sans-serif">${body}</g></svg>`,
  };
}
const arrowDef = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker>`;

// =====================================================================
const G = {};

// ---- ovary comparison (p3)
G.ovary = (t) => {
  const g = t.g; let b = '';
  const card = (x, title, sub) =>
    rr(x, 0, 225, 215, 18, C.W, C.PK, 2) + T(title, x + 112, 28, { size: 13, w: 600, fill: C.P }) + T(sub, x + 112, 46, { size: 9.5, fill: C.GREY });
  b += card(8, g.ovaryA, g.ovaryASub) + card(247, g.ovaryB, g.ovaryBSub);
  // typical ovary
  b += `<ellipse cx="120" cy="118" rx="78" ry="50" fill="${C.PK}"/>`;
  b += `<ellipse cx="120" cy="118" rx="62" ry="36" fill="#F7B8C4"/>`;
  [[90, 120, 5], [100, 136, 4], [128, 138, 5], [92, 102, 4], [112, 102, 4], [140, 128, 4]].forEach(([x, y, r]) => b += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF" opacity=".85"/>`);
  b += `<circle cx="150" cy="106" r="19" fill="#fff" stroke="${C.P}" stroke-width="2"/><circle cx="150" cy="106" r="7" fill="${C.PK}" stroke="${C.P}" stroke-width="1.5"/>`;
  // polycystic ovary
  b += `<ellipse cx="360" cy="118" rx="78" ry="50" fill="${C.PK}"/>`;
  b += `<ellipse cx="360" cy="118" rx="52" ry="26" fill="#F7B8C4"/>`;
  const n = 15;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    b += `<circle cx="${(360 + 66 * Math.cos(a)).toFixed(1)}" cy="${(118 + 37 * Math.sin(a)).toFixed(1)}" r="6.5" fill="#fff" stroke="${C.P}" stroke-width="1"/>`;
  }
  [[345, 118, 4], [362, 124, 4], [375, 112, 4], [352, 108, 3.5]].forEach(([x, y, r]) => b += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".8"/>`);
  // labels
  b += `<path d="M150,128 L150,176" stroke="${C.P}" stroke-width="1.5" fill="none"/>` + T(g.ovaryMature, 150, 192, { size: 10, w: 500, fill: C.P });
  b += `<path d="M392,150 L400,176" stroke="${C.P}" stroke-width="1.5" fill="none"/>` + T(g.ovaryStalled, 360, 192, { size: 10, w: 500, fill: C.P });
  return svg(480, 215, b);
};

// ---- hormone cycle chart (p4)
G.cycle = (t) => {
  const g = t.g; let b = '';
  const X = (d) => 30 + d * 15.36;
  const top = 62, base = 188;
  // phase strips
  const strip = (d0, d1, fill, label) => rr(X(d0), 28, X(d1) - X(d0) - 2, 22, 6, fill) + (label ? T(label, (X(d0) + X(d1)) / 2 - 1, 43, { size: 9, w: 600, fill: C.W }) : '');
  b += strip(0, 5, C.P, g.cycPeriod) + strip(5, 13, C.LP, g.cycGrow) + strip(13, 15, C.PK, '') + strip(15, 28, '#C45BA2', g.cycPrep);
  b += rr(X(14) - 40, 2, 80, 20, 10, C.PKT, C.PK, 1.5) + T(g.cycOvu, X(14), 16, { size: 9, w: 700, fill: C.P });
  b += `<path d="M${X(14)},22 L${X(14)},28" stroke="${C.PK}" stroke-width="2"/>`;
  // grid
  b += `<rect x="30" y="${top}" width="430" height="${base - top}" fill="#FCF7FA" rx="4"/>`;
  b += `<rect x="${X(13)}" y="${top}" width="${X(15) - X(13)}" height="${base - top}" fill="${C.PKT}"/>`;
  for (let d = 0; d <= 28; d += 7) b += `<line x1="${X(d)}" y1="${base}" x2="${X(d)}" y2="${base + 5}" stroke="${C.GREY}"/>` + T(d === 0 ? 1 : d, X(d), base + 17, { size: 9, fill: C.GREY });
  b += T(g.cycDay, 22, base + 17, { size: 8.5, fill: C.GREY, anchor: 'end' });
  b += `<line x1="30" y1="${base}" x2="460" y2="${base}" stroke="${C.GREY}" stroke-width="1"/>`;
  // curves
  b += `<path d="M30,178 C60,176 90,174 107,170 C150,150 190,96 226,80 C238,80 241,118 252,132 C278,120 328,100 352,104 C385,108 415,162 460,176" fill="none" stroke="${C.LP}" stroke-width="3" stroke-linecap="round"/>`;
  b += `<path d="M30,185 L247,184 C282,170 322,92 352,86 C392,96 424,168 460,184" fill="none" stroke="${C.PK}" stroke-width="3" stroke-linecap="round"/>`;
  b += `<path d="M30,186 L208,186 L228,172 L237,66 L247,170 L262,186 L460,186" fill="none" stroke="${C.P}" stroke-width="2.2" stroke-dasharray="5 3" stroke-linejoin="round"/>`;
  // legend
  const ly = 222;
  b += `<line x1="30" y1="${ly}" x2="52" y2="${ly}" stroke="${C.LP}" stroke-width="3"/>` + T(g.cycE, 58, ly + 4, { size: 10, anchor: 'start' });
  b += `<line x1="150" y1="${ly}" x2="172" y2="${ly}" stroke="${C.PK}" stroke-width="3"/>` + T(g.cycP, 178, ly + 4, { size: 10, anchor: 'start' });
  b += `<line x1="290" y1="${ly}" x2="312" y2="${ly}" stroke="${C.P}" stroke-width="2.2" stroke-dasharray="5 3"/>` + T(g.cycLH, 318, ly + 4, { size: 10, anchor: 'start' });
  // pcod note
  b += rr(30, 238, 430, 30, 10, C.PKT, C.PK, 1.5) + T(g.cycPcod, 245, 258, { size: 10.5, w: 600, fill: C.P });
  return svg(480, 276, b);
};

// ---- brain-ovary-womb axis (p5)
G.hpo = (t) => {
  const g = t.g; let b = '';
  const defs = arrowDef('a1', C.P) + arrowDef('a2', C.LP);
  const node = (cx) => `<circle cx="${cx}" cy="100" r="46" fill="${C.PT}" stroke="${C.P}" stroke-width="3"/>`;
  b += node(70) + node(240) + node(410);
  b += emo('🧠', 70, 116, 46);
  // ovaries
  b += `<ellipse cx="222" cy="106" rx="19" ry="13" fill="${C.PK}" stroke="${C.P}" stroke-width="1.5"/><ellipse cx="258" cy="106" rx="19" ry="13" fill="${C.PK}" stroke="${C.P}" stroke-width="1.5"/>`;
  [[215, 104], [225, 109], [252, 103], [262, 108]].forEach(([x, y]) => b += `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff"/>`);
  b += `<path d="M206,96 C220,82 232,92 240,96 C248,92 260,82 274,96" fill="none" stroke="${C.PK}" stroke-width="5" stroke-linecap="round"/>`;
  // womb
  b += `<path d="M410,126 C392,118 390,88 398,78 C404,70 416,70 422,78 C430,88 428,118 410,126 Z" fill="${C.PK}" stroke="${C.P}" stroke-width="2"/>`;
  b += `<path d="M392,88 C380,84 378,72 386,68 M428,88 C440,84 442,72 434,68" fill="none" stroke="${C.PK}" stroke-width="4" stroke-linecap="round"/>`;
  // arrows
  b += `<path d="M122,88 L186,88" stroke="${C.P}" stroke-width="2.5" fill="none" marker-end="url(#a1)"/>` + T(g.hpoDown, 154, 74, { size: 10, w: 600, fill: C.P });
  b += `<path d="M188,118 L124,118" stroke="${C.LP}" stroke-width="2" stroke-dasharray="5 3" fill="none" marker-end="url(#a2)"/>` + T(g.hpoFeed, 156, 136, { size: 9.5, fill: C.LP });
  b += `<path d="M292,100 L356,100" stroke="${C.P}" stroke-width="2.5" fill="none" marker-end="url(#a1)"/>`;
  const up = g.hpoUp.split(' + ');
  b += T(up.length > 1 ? [up[0] + ' +', up[1]] : up, 324, 76, { size: 9.5, w: 600, fill: C.P });
  // names
  b += T(g.hpoBrain, 70, 170, { size: 12, w: 700, fill: C.P }) + T(g.hpoBrainSub, 70, 186, { size: 8.5, fill: C.GREY });
  b += T(g.hpoOvary, 240, 170, { size: 12, w: 700, fill: C.P }) + T(g.hpoWomb, 410, 170, { size: 12, w: 700, fill: C.P });
  return svg(480, 200, b, defs);
};

// ---- vicious circle (p6)
G.loop = (t) => {
  const g = t.g; let b = '';
  const cx = 240, cy = 140, Rx = 158, Ry = 92;
  const defs = arrowDef('ar', C.PK);
  b += `<ellipse cx="${cx}" cy="${cy}" rx="${Rx}" ry="${Ry}" fill="${C.PKT}" stroke="${C.PK}" stroke-width="3" stroke-dasharray="3 7"/>`;
  const angs = [-90, -18, 54, 126, 198].map((a) => (a * Math.PI) / 180);
  // arrows at mid-angles (clockwise)
  angs.forEach((a, i) => {
    const m = a + Math.PI / 5;
    const x = cx + Rx * Math.cos(m), y = cy + Ry * Math.sin(m);
    const dx = -Rx * Math.sin(m), dy = Ry * Math.cos(m);
    const L = Math.hypot(dx, dy);
    b += `<path d="M${(x - (dx / L) * 7).toFixed(1)},${(y - (dy / L) * 7).toFixed(1)} L${(x + (dx / L) * 7).toFixed(1)},${(y + (dy / L) * 7).toFixed(1)}" stroke="${C.P}" stroke-width="3" fill="none" marker-end="url(#ar)"/>`;
  });
  angs.forEach((a, i) => {
    const x = cx + Rx * Math.cos(a), y = cy + Ry * Math.sin(a);
    b += rr(x - 54, y - 24, 108, 48, 14, i % 2 ? C.LP : C.P);
    b += T(g.loop[i], x, y - 3 - (g.loop[i].includes('\n') ? 6 : -4), { size: 11, w: 600, fill: C.W });
  });
  b += T(g.loopCenter, cx, cy - 4, { size: 14, w: 700, fill: C.P });
  return svg(480, 280, b, defs);
};

// ---- body silhouette (shared)
const BODY = 'M232,68 L228,82 C205,86 192,92 186,112 L170,196 L186,200 L204,140 C206,170 214,190 214,206 C200,220 192,245 198,262 L206,318 L232,318 L240,270 L248,318 L274,318 L282,262 C288,245 280,220 266,206 C266,190 274,170 276,140 L294,200 L310,196 L294,112 C288,92 275,86 252,82 L248,68 Z';
const bodyShape = (fill = C.PT, stroke = C.P) =>
  `<path d="${BODY}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>` +
  `<circle cx="240" cy="44" r="25" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>` +
  `<path d="M216,40 C216,14 264,14 264,40 C258,26 222,26 216,40 Z" fill="${C.LP}"/>`;

// ---- symptom body map (p7)
G.body = () => {
  let b = bodyShape();
  const mk = (n, x, y, tx, ty) =>
    `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${C.P}" stroke-width="1.5"/><circle cx="${tx}" cy="${ty}" r="3.5" fill="${C.P}"/>` +
    `<circle cx="${x}" cy="${y}" r="13" fill="${C.P}"/>` + T(n, x, y + 4.5, { size: 13, w: 700, fill: C.W });
  // highlights
  b += `<ellipse cx="240" cy="196" rx="30" ry="22" fill="${C.PK}" opacity=".7"/>`;
  b += `<path d="M240,232 C228,228 226,214 232,210 C238,206 242,206 248,210 C254,214 252,228 240,232 Z" fill="${C.P}" opacity=".85"/>`;
  [[230, 46], [236, 52], [250, 50], [246, 40]].forEach(([x, y]) => b += `<circle cx="${x}" cy="${y}" r="1.8" fill="${C.R}"/>`);
  b += `<rect x="228" y="68" width="24" height="9" rx="4" fill="${C.LP}" opacity=".7"/>`;
  b += mk(1, 345, 24, 255, 24) + mk(2, 140, 40, 226, 46) + mk(3, 345, 62, 250, 56) + mk(4, 120, 90, 228, 72) + mk(8, 360, 118, 262, 108) +
    mk(5, 120, 160, 214, 190) + mk(6, 345, 205, 242, 218) + mk(7, 120, 240, 232, 220);
  return svg(480, 330, b);
};

// ---- period strips (p8)
G.strips = (t) => {
  const g = t.g; let b = '';
  const X0 = 20, PX = 440 / 90;
  const rows = [
    { y: 8, label: g.stripA, col: C.G, days: [4, 31, 62] },
    { y: 78, label: g.stripB, col: C.A, days: [2, 46, 84] },
    { y: 148, label: g.stripC, col: C.R, days: [5] },
  ];
  rows.forEach((r) => {
    b += `<circle cx="28" cy="${r.y + 10}" r="7" fill="${r.col}"/>` + T(r.label, 42, r.y + 14, { size: 11.5, w: 600, fill: C.INK, anchor: 'start' });
    b += rr(X0, r.y + 26, 440, 24, 8, C.LT);
    r.days.forEach((d) => { if (d + 5 <= 90) b += rr(X0 + d * PX, r.y + 26, 5 * PX, 24, 6, C.P); });
  });
  [0, 1, 2].forEach((m) => {
    b += T(g.stripM[m], X0 + (m * 30 + 15) * PX, 222, { size: 9.5, fill: C.GREY });
    if (m) rows.forEach((r) => (b += `<line x1="${X0 + m * 30 * PX}" y1="${r.y + 26}" x2="${X0 + m * 30 * PX}" y2="${r.y + 50}" stroke="#fff" stroke-width="2"/>`));
  });
  return svg(480, 232, b);
};

// ---- hair zones (p9)
G.zones = (t) => {
  const g = t.g; let b = bodyShape();
  const zones = [
    [250, 62, 8, 5], [240, 70, 9, 5], [240, 105, 22, 14], [240, 140, 20, 13], [240, 180, 22, 14], [190, 135, 9, 20], [214, 262, 12, 22],
  ];
  zones.forEach(([x, y, rx, ry], i) => b += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.P}" opacity=".42"/>`);
  b += `<ellipse cx="290" cy="135" rx="9" ry="20" fill="${C.P}" opacity=".42"/><ellipse cx="266" cy="262" rx="12" ry="22" fill="${C.P}" opacity=".42"/>`;
  const lab = (txt, side, y, tx, ty) => {
    const x = side === 'L' ? 128 : 352, anchor = side === 'L' ? 'end' : 'start';
    const lx = side === 'L' ? 134 : 346;
    return T(txt, x, y + 4, { size: 11, w: 500, fill: C.INK, anchor }) +
      `<line x1="${lx}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${C.P}" stroke-width="1.3"/><circle cx="${tx}" cy="${ty}" r="3" fill="${C.P}"/>`;
  };
  const z = g.zones;
  b += lab(z[0], 'R', 30, 252, 61) + lab(z[1], 'L', 62, 236, 71) + lab(z[2], 'R', 100, 258, 105) + lab(z[3], 'L', 138, 222, 140) +
    lab(z[4], 'R', 178, 258, 180) + lab(z[5], 'L', 190, 188, 150) + lab(z[6], 'R', 255, 274, 262);
  b += T(g.zonesNote, 240, 330, { size: 10, fill: C.GREY });
  return svg(480, 340, b);
};

// ---- key & lock (p10)
G.lock = (t) => {
  const g = t.g; let b = '';
  const key = (x, y, c = C.P) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/><rect x="${x + 5}" y="${y - 2}" width="16" height="4" rx="2" fill="${c}"/><rect x="${x + 15}" y="${y}" width="3" height="6" fill="${c}"/>`;
  const sugar = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.A}"/>`;
  const scene = (x0, title, ok) => {
    let s = rr(x0, 0, 232, 125, 14, C.W, ok ? C.G : C.R, 2);
    s += rr(x0 + 118, 22, 102, 70, 12, C.PT, C.P, 2) + T(g.lockCell, x0 + 169, 62, { size: 11, w: 600, fill: C.P });
    s += `<rect x="${x0 + 112}" y="44" width="12" height="26" rx="3" fill="${ok ? C.G : C.R}"/>`;
    if (ok) {
      s += key(x0 + 62, 57); [[18, 28], [30, 70], [46, 90], [14, 52]].forEach(([dx, dy]) => (s += sugar(x0 + dx + 14, dy + 10)));
      s += `<path d="M${x0 + 60},95 L${x0 + 108},68" stroke="${C.A}" stroke-width="2" fill="none" stroke-dasharray="3 3"/>`;
    } else {
      s += key(x0 + 30, 36) + key(x0 + 52, 52) + key(x0 + 30, 68) + key(x0 + 52, 84);
      [[14, 30], [24, 96], [38, 106], [88, 90], [96, 40]].forEach(([dx, dy]) => (s += sugar(x0 + dx + 10, dy)));
      s += `<path d="M${x0 + 96},50 L${x0 + 108},62 M${x0 + 108},50 L${x0 + 96},62" stroke="${C.R}" stroke-width="3"/>`;
    }
    s += T(title, x0 + 116, 118, { size: 9.5, w: 600, fill: ok ? C.G : C.R });
    return s;
  };
  b += scene(0, g.lockOk, true) + scene(248, g.lockBad, false);
  b += T(g.lockSugar, 14, 20, { size: 8.5, fill: C.A, anchor: 'start', w: 600 });
  return svg(480, 130, b);
};

// ---- metabolic syndrome tiles (p10)
G.ms = (t) => {
  const g = t.g; let b = '';
  const em = ['📏', '🩺', '🍬', '🩸', '❤️'];
  for (let i = 0; i < 5; i++) {
    const x = i * 96;
    b += rr(x, 0, 88, 118, 14, C.W, C.P, 2) + `<circle cx="${x + 44}" cy="28" r="20" fill="${C.PT}"/>` + emo(em[i], x + 44, 36, 22);
    const tl = wrap(g.mTitle[i], 10, 78);
    b += T(tl, x + 44, 62, { size: 10, w: 600, fill: C.INK });
    const vl = wrap(g.mVal[i], 9.5, 78);
    b += T(vl, x + 44, 62 + tl.length * 13.5 + 6, { size: 9.5, w: 600, fill: C.P });
  }
  b += rr(40, 130, 400, 30, 15, C.P) + T(g.mAny, 240, 150, { size: 12, w: 600, fill: C.W });
  return svg(480, 168, b);
};

// ---- fertility journey (p11)
G.fert = (t) => {
  const g = t.g; let b = '';
  const xs = [60, 180, 300, 420], cy = 82;
  b += `<line x1="60" y1="${cy}" x2="420" y2="${cy}" stroke="${C.PK}" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>`;
  xs.forEach((x, i) => {
    b += `<circle cx="${x}" cy="${cy}" r="34" fill="${C.PT}" stroke="${C.P}" stroke-width="3"/>`;
    if (i === 0) b += `<circle cx="${x}" cy="${cy}" r="20" fill="#fff" stroke="${C.P}" stroke-width="2"/><circle cx="${x}" cy="${cy}" r="8" fill="${C.PK}" stroke="${C.P}" stroke-width="1.5"/>`;
    if (i === 1) b += `<circle cx="${x}" cy="${cy}" r="11" fill="${C.PK}" stroke="${C.P}" stroke-width="1.5"/>` + [0, 60, 120, 180, 240, 300].map((a) => `<line x1="${x + 16 * Math.cos((a * Math.PI) / 180)}" y1="${cy + 16 * Math.sin((a * Math.PI) / 180)}" x2="${x + 24 * Math.cos((a * Math.PI) / 180)}" y2="${cy + 24 * Math.sin((a * Math.PI) / 180)}" stroke="${C.P}" stroke-width="2.5" stroke-linecap="round"/>`).join('');
    if (i === 2) b += `<circle cx="${x + 4}" cy="${cy}" r="13" fill="${C.PK}" stroke="${C.P}" stroke-width="1.5"/>` + [[-22, -14], [-24, 8], [-14, 20]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${cy + dy}" r="3.5" fill="${C.LP}"/><path d="M${x + dx - 2},${cy + dy + 2} q-6,5 -10,2" stroke="${C.LP}" stroke-width="1.5" fill="none"/>`).join('');
    if (i === 3) b += `<path d="M${x - 24},${cy - 8} C${x - 24},${cy + 22} ${x + 24},${cy + 22} ${x + 24},${cy - 8}" fill="none" stroke="${C.P}" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${cy + 8}" r="9" fill="${C.PK}" stroke="${C.P}" stroke-width="1.5"/>`;
    b += T(g.fertSteps[i], x, cy + 56, { size: 11, w: 600, fill: C.P });
  });
  b += rr(200 - 66, 2, 132, 40, 12, C.AT, C.A, 1.5) + T(g.fertPause, 180 + 20 - 20, 19, { size: 9.5, w: 600, fill: '#9A6200', lh: 1.15 });
  b += `<path d="M180,42 L180,46" stroke="${C.A}" stroke-width="2"/>`;
  b += rr(10, 148, 460, 34, 12, C.P) + T(g.fertBar, 240, 169, { size: 10.5, w: 600, fill: C.W });
  return svg(480, 190, b);
};

// ---- Rotterdam venn (p12)
G.venn = (t) => {
  const g = t.g; let b = '';
  b += `<circle cx="170" cy="96" r="80" fill="${C.P}" opacity=".22" stroke="${C.P}" stroke-width="2"/>`;
  b += `<circle cx="310" cy="96" r="80" fill="${C.LP}" opacity=".26" stroke="${C.LP}" stroke-width="2"/>`;
  b += `<circle cx="240" cy="168" r="80" fill="${C.PK}" opacity=".5" stroke="${C.PK}" stroke-width="2"/>`;
  b += T(g.vennA, 134, 80, { size: 11, w: 600, fill: C.INK }) + T(g.vennB, 346, 80, { size: 11, w: 600, fill: C.INK }) + T(g.vennC, 240, 212, { size: 11, w: 600, fill: C.INK });
  b += `<circle cx="240" cy="124" r="29" fill="${C.P}"/>` + T(g.vennAny, 240, 129, { size: 12, w: 700, fill: C.W });
  return svg(480, 256, b);
};

// ---- plate (p14)
G.plate = (t) => {
  const g = t.g; let b = '';
  const cx = 130, cy = 140, r = 118;
  const sec = (a0, a1, fill) => {
    const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `<path d="M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z" fill="${fill}" stroke="#fff" stroke-width="3"/>`;
  };
  b += `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#fff" stroke="${C.LP}" stroke-width="5"/>`;
  b += sec(90, 270, C.GT) + sec(270, 360, C.PKT) + sec(0, 90, C.AT);
  b += emo('🥦', 62, 108, 30) + emo('🥕', 98, 142, 28) + emo('🍅', 56, 168, 28) + emo('🥒', 100, 90, 26) + emo('🥗', 80, 205, 30);
  b += emo('🥚', 150, 78, 24) + emo('🧀', 188, 56, 24) + emo('🐟', 214, 96, 24);
  b += emo('🌾', 168, 180, 28) + emo('🫓', 206, 212, 28);
  b += `<circle cx="${cx}" cy="${cy}" r="3" fill="#fff"/>`;
  // legend
  const row = (y, em, big, label, sub) =>
    emo(em, 288, y + 8, 22) + T(big, 314, y + 8, { size: 15, w: 700, fill: C.P, anchor: 'start' }) + T(label, 344, y + 4, { size: 10.5, w: 600, anchor: 'start' }) + (sub ? T(sub.replace('\n', ' '), 344, y + 19, { size: 9, fill: C.GREY, anchor: 'start' }) : '');
  b += row(50, '🥗', g.plateHalf, g.plateVeg.replace('\n', ' '), '');
  b += row(100, '🥚', g.plateQ, g.plateProt, g.plateProtEx);
  b += row(150, '🌾', g.plateQ, g.plateGrain.replace('\n', ' '), g.plateGrainEx);
  b += emo('🥜', 288, 220, 22) + T(wrap(g.plateFat, 10.5, 125), 314, 218, { size: 10.5, w: 600, anchor: 'start', fill: C.INK });
  b += emo('💧', 288, 262, 22) + T('2-3 L', 314, 266, { size: 12, w: 700, fill: C.LP, anchor: 'start' });
  return svg(480, 290, b);
};

// ---- week planner (p15)
G.week = (t) => {
  const g = t.g; let b = '';
  const em = ['🚶‍♀️', '🏋️‍♀️', '🧘‍♀️', '🚶‍♀️', '🏋️‍♀️', '💃', '😴'];
  for (let i = 0; i < 7; i++) {
    const x = i * 69;
    b += rr(x, 0, 64, 120, 12, i === 6 ? C.LT : C.PKT, i === 6 ? C.LP : C.PK, 1.5) + rr(x, 0, 64, 24, 12, i === 6 ? C.LP : C.P) + `<rect x="${x}" y="12" width="64" height="12" fill="${i === 6 ? C.LP : C.P}"/>`;
    b += T(g.week[i], x + 32, 17, { size: 10.5, w: 600, fill: C.W }) + emo(em[i], x + 32, 66, 28) + T(g.weekAct[i], x + 32, 100, { size: 9.5, w: 600, fill: C.INK });
  }
  b += rr(0, 134, 480, 30, 15, C.P) + emo('🚶‍♀️', 24, 155, 16) + T(g.weekNote, 250, 154, { size: 10.5, w: 600, fill: C.W });
  return svg(480, 170, b);
};

// ---- treatment ladder (p16)
G.ladder = (t) => {
  const g = t.g; let b = '';
  const fills = [C.PK, '#D8629E', C.P, C.LP];
  for (let i = 0; i < 4; i++) {
    const x = 6 + i * 118, h = 92 + i * 32, y = 218 - h;
    b += rr(x, y, 112, h, 10, fills[i]);
    b += `<circle cx="${x + 56}" cy="${y + 20}" r="12" fill="#fff"/>` + T(i + 1, x + 56, y + 25, { size: 13, w: 700, fill: fills[i] });
    const tl = wrap(g.ladder[i], 11.5, 100);
    b += T(tl, x + 56, y + 46, { size: 11.5, w: 600, fill: i === 0 ? C.INK : C.W });
    b += T(wrap(g.ladderSub[i], 8.8, 100), x + 56, y + 46 + tl.length * 15 + 4, { size: 8.8, fill: i === 0 ? C.INK : '#F4E4EF' });
  }
  b += T(g.ladderNote, 6, 12, { size: 10, w: 600, fill: C.P, anchor: 'start' });
  return svg(480, 228, b, arrowDef('ar2', C.P));
};

// ---- long-term risks (p17)
G.risks = (t) => {
  const g = t.g; let b = '';
  const em = ['🩸', '❤️', '🧈', '😴', '🌸', '💭'];
  const pos = [[8, 8], [8, 68], [8, 128], [316, 8], [316, 68], [316, 128]];
  pos.forEach(([x, y], i) => {
    const cxn = i < 3 ? x + 156 : x, cyn = y + 24;
    b += `<line x1="${cxn}" y1="${cyn}" x2="240" y2="95" stroke="${C.PK}" stroke-width="2.5"/>`;
  });
  pos.forEach(([x, y], i) => {
    b += rr(x, y, 156, 48, 14, C.PT, C.PK, 1.5) + emo(em[i], x + 24, y + 31, 22) + T(wrap(t.p17.risks[i], 10.5, 100), x + 98, y + 21, { size: 10.5, w: 600, fill: C.INK });
  });
  b += `<circle cx="240" cy="95" r="52" fill="${C.P}"/>` + T(g.riskCenter, 240, 91, { size: 11, w: 600, fill: C.W });
  return svg(480, 186, b);
};

// ---- services radial (p18)
G.svc = (t) => {
  const g = t.g; let b = '';
  const cx = 240, cy = 160, Rx = 176, Ry = 118;
  const em = ['👩‍⚕️', '🧬', '✨', '🥗', '💨', '☁️', '🌿', '🧪'];
  const dashed = [4, 5, 6];
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = ((-90 + i * 45) * Math.PI) / 180;
    pts.push([cx + Rx * Math.cos(a), cy + Ry * Math.sin(a)]);
  }
  pts.forEach(([x, y]) => (b += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${C.PK}" stroke-width="2.5"/>`));
  pts.forEach(([x, y], i) => {
    const d = dashed.includes(i);
    b += rr(x - 58, y - 22, 116, 44, 14, d ? C.LT : C.PT, d ? C.LP : C.P, 2, d ? 'stroke-dasharray="4 3"' : '');
    b += emo(em[i], x - 40, y + 8, 20) + T(wrap(g.svc[i], 10.5, 80), x + 10, y - (g.svc[i].includes('\n') ? 2 : -4), { size: 10.5, w: 600, fill: C.INK });
  });
  b += `<circle cx="${cx}" cy="${cy}" r="48" fill="${C.P}"/>` + T(g.svcCenter, cx, cy - 2, { size: 14, w: 700, fill: C.W });
  b += T(g.svcNote, 240, 318, { size: 9, fill: C.GREY });
  return svg(480, 326, b);
};

// ---- programme timeline (p19)
G.timeline = (t) => {
  const g = t.g; let b = '';
  const SW = 75, GAP = 4;
  const sx = (i) => 5 + i * (SW + GAP);
  for (let i = 0; i < 6; i++) b += T(g.tlM[i], sx(i) + SW / 2, 12, { size: 9, fill: C.GREY, w: 500 });
  const row = (y, label, n, cols) => {
    let s = T(label, 5, y, { size: 10, w: 700, fill: C.P, anchor: 'start' });
    for (let i = 0; i < 6; i++) {
      if (i < n) s += rr(sx(i), y + 8, SW, 48, 10, cols[i]) + T(wrap(g.tlA[i], 10.5, 66), sx(i) + SW / 2, y + 36 - (wrap(g.tlA[i], 10.5, 66).length - 1) * 6, { size: 10.5, w: 600, fill: C.W });
      else s += rr(sx(i), y + 8, SW, 48, 10, 'none', C.LT, 2, 'stroke-dasharray="4 4"');
    }
    return s;
  };
  b += row(34, g.tl3, 3, [C.P, C.P, C.P]) + row(104, g.tl6, 6, [C.P, C.P, C.P, C.LP, C.LP, C.LP]);
  return svg(480, 176, b);
};

// ---- COVER (full page 560 x 794)
G.cover = (t) => {
  const c = t.cover, dev = t.lang === 'hi';
  const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../assets/img/logo.png')).toString('base64');
  const defs = `
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.P}"/><stop offset="1" stop-color="${C.LP}"/></linearGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.P}"/><stop offset="1" stop-color="${C.LP}"/></linearGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#A62683" flood-opacity=".22"/></filter>`;
  let b = `<rect width="560" height="794" fill="#fff"/>`;
  b += `<circle cx="540" cy="30" r="190" fill="${C.PKT}"/><circle cx="20" cy="470" r="120" fill="${C.PT}" opacity=".7"/>`;
  b += `<image href="${logo}" x="26" y="28" width="330" height="130"/>`;
  b += rr(40, 196, dev ? 150 : 140, 30, 15, C.PK) + T(c.kicker, dev ? 115 : 110, 216, { size: 12, w: 700, fill: C.W });
  const w1 = dev ? 150 : 140, w2 = Math.round(c.kicker2.length * (dev ? 10.5 : 8.6) + 34);
  b += rr(40 + w1 + 10, 196, w2, 30, 15, '#fff', C.P, 2) + T(c.kicker2, 40 + w1 + 10 + w2 / 2, 216, { size: 12, w: 700, fill: C.P });
  b += T(c.title1, 40, 278, { size: dev ? 30 : 32, w: 600, fill: C.LP, anchor: 'start' });
  b += T(c.title2, 38, dev ? 346 : 352, { size: dev ? 56 : 66, w: 700, fill: C.P, anchor: 'start' });
  b += T(wrap(c.sub, 15, 400), 40, 392, { size: 15, w: 400, fill: C.GREY, anchor: 'start' });
  // hero
  b += `<circle cx="280" cy="570" r="124" fill="url(#hero)"/><circle cx="280" cy="570" r="140" fill="none" stroke="${C.PK}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
  b += `<ellipse cx="280" cy="570" rx="92" ry="64" fill="#fff"/><ellipse cx="280" cy="570" rx="92" ry="64" fill="none" stroke="${C.PK}" stroke-width="4"/>`;
  const n = 18;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; b += `<circle cx="${(280 + 70 * Math.cos(a)).toFixed(1)}" cy="${(570 + 44 * Math.sin(a)).toFixed(1)}" r="${i % 3 ? 6 : 8}" fill="${C.PK}"/>`; }
  [[266, 566, 5], [292, 574, 5], [280, 556, 4], [274, 582, 4]].forEach(([x, y, r]) => b += `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.PK}" opacity=".7"/>`);
  // chips
  const pos = [[30, 470], [392, 484], [18, 590], [400, 630], [196, 690]];
  c.chips.forEach((txt, i) => {
    const w = Math.max(98, txt.length * (dev ? 11 : 8.4) + 34), [x, y] = pos[i];
    b += `<g filter="url(#sh)">${rr(x, y, w, 34, 17, '#fff')}</g>` + `<circle cx="${x + 17}" cy="${y + 17}" r="5" fill="${[C.P, C.LP, C.PK, C.P, C.LP][i]}"/>` + T(txt, x + 28, y + 22, { size: 12, w: 600, fill: C.INK, anchor: 'start' });
  });
  // bottom band
  b += `<path d="M0,742 C140,718 300,758 560,724 L560,794 L0,794 Z" fill="url(#band)"/>`;
  b += T(t.tagline, 280, 772, { size: 17, w: 500, fill: C.W, italic: true });
  return svg(560, 794, b, defs);
};


// ---- spectrum PCOM -> PCOD -> PCOS = PMOS (new page)
G.spectrum = (t) => {
  const g = t.g.spec; let b = '';
  const fills = ['#F29BAA', '#D8629E', C.P, C.LP];
  const W = 108, GAP = 14, x0 = 6;
  const defs = `<linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.PK}"/><stop offset="1" stop-color="${C.LP}"/></linearGradient>`;
  for (let i = 0; i < 4; i++) {
    const x = x0 + i * (W + GAP), cx = x + W / 2, dark = i === 0 ? C.INK : '#fff';
    b += rr(x, 6, W, 92, 16, fills[i]);
    b += T(g.names[i], cx, 42, { size: 24, w: 700, fill: dark });
    b += T(g.sub[i], cx, 66, { size: 11.5, w: 500, fill: dark, lh: 1.2 });
  }
  const ex = x0 + 3 * (W + GAP) - GAP / 2;
  b += `<circle cx="${ex}" cy="52" r="13" fill="#fff" stroke="${C.P}" stroke-width="2"/>` + T('=', ex, 58, { size: 18, w: 700, fill: C.P });
  b += `<rect x="6" y="112" width="468" height="11" rx="5.5" fill="url(#sg)"/><path d="M468,106 L482,117.5 L468,129 Z" fill="${C.LP}"/>`;
  b += T(g.milder, 8, 146, { size: 11.5, w: 600, fill: C.GREY, anchor: 'start' }) + T(g.complex, 470, 146, { size: 11.5, w: 600, fill: C.GREY, anchor: 'end' });
  return svg(488, 154, b, defs);
};

// ---- 5-phase eating roadmap (new page): compact timeline
G.roadmap = (t) => {
  const g = t.g.road, tl = t.g; let b = '';
  const fills = ['#E5849A', '#D8629E', C.P, C.LP, '#4B3C70'];
  const W = 90, GAP = 7, x0 = 1;
  for (let i = 0; i < 5; i++) {
    const x = x0 + i * (W + GAP), cx = x + W / 2;
    b += rr(x, 0, W, 78, 14, fills[i]);
    b += T(g.phase + ' ' + (i + 1), cx, 17, { size: 10, w: 700, fill: '#FBDDEB' });
    const nm = g.names[i].split('\n');
    b += T(nm, cx, nm.length > 1 ? 36 : 42, { size: 13, w: 700, fill: '#fff', lh: 1.15 });
    b += T(g.times[i], cx, 68, { size: 10.5, w: 500, fill: '#fff' });
  }
  const px = (i) => x0 + i * (W + GAP);
  const bracket = (xa, xb, y, label, col) => `<path d="M${xa},${y - 6} L${xa},${y} L${xb},${y} L${xb},${y - 6}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round"/>` + T(label, (xa + xb) / 2, y + 17, { size: 11.5, w: 700, fill: col });
  b += bracket(px(0), px(2) + W, 96, tl.tl3, C.P);
  b += bracket(px(0), px(4) + W, 138, tl.tl6, C.LP);
  return svg(480, 164, b);
};

// ---- BACK page decoration (transparent, page-size)
G.backbg = (t) => {
  const defs = `<linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.P}"/><stop offset="1" stop-color="${C.LP}"/></linearGradient>`;
  let b = '';
  b += `<path d="M0,760 C140,738 300,774 560,744 L560,794 L0,794 Z" fill="url(#band)"/>`;
  b += T(t.tagline, 280, 782, { size: 14, w: 500, fill: C.W, italic: true });
  return svg(560, 794, b, defs);
};

// ---- small icons used on content pages
G.divider = () => svg(480, 6, `<rect width="480" height="6" rx="3" fill="${C.PK}"/>`);

module.exports = { G, C };
