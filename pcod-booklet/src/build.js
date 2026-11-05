// Builds the PCOD Xpert patient booklet (A5, 24 pages) as .docx for a given language.
// usage: node build.js en|hi
const fs = require('fs');
const path = require('path');
const D = require('docx');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, WidthType, ShadingType,
  BorderStyle, AlignmentType, VerticalAlign, Footer, PageNumber, LevelFormat, ExternalHyperlink,
  TabStopType, HeightRule, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType,
} = D;

const lang = process.argv[2] || 'en';
const t = require('./content')[lang];
const ROOT = path.join(__dirname, '..');
const IMG = (n) => path.join(ROOT, 'assets/img', lang, n + '.png');

// ------------------------------------------------------------------ constants
const PAGE_W = 8391, PAGE_H = 11906;           // A5 in DXA
const MX = 640, MT = 560, MB = 760;
const CW = PAGE_W - 2 * MX;                     // content width 7111
const PX = (d) => Math.round(d / 15);           // dxa -> css px (96dpi)
const col = {
  P: 'A62683', LP: '624E88', PK: 'F29BAA', PKT: 'FDEBEF', PT: 'F7E4F0', LT: 'ECE8F3', INK: '2A1F33', GREY: '6B6275', W: 'FFFFFF',
  G: '3A9D6E', GT: 'E3F3EA', A: 'E9A23B', AT: 'FFF1D6', R: 'D64545', RT: 'FBE3E3',
};
const REG = 'Poppins', SEMI = 'Poppins SemiBold';
const F = (bold) => { const n = bold ? SEMI : REG; return { ascii: n, hAnsi: n, cs: n, eastAsia: n }; };
const HI = lang === 'hi';
const HS = 1.07;                                // Hindi text size scale (Devanagari reads smaller than Latin at the same pt)
const LF = 0.80;                                // Hindi line-height scale (Poppins Devanagari is already tall)
const LINE = HI ? 336 : 292;                    // paragraph line spacing

// ------------------------------------------------------------------ text helpers
function runs(text, o = {}) {
  const { size = 9, color = col.INK, bold = false, italics = false, spacing } = o;
  return String(text).split('**').map((p, i) => (p === '' ? null : new TextRun({
    text: p, font: F(bold || i % 2 === 1), size: Math.round(size * 2 * (HI ? HS : 1)), sizeComplexScript: Math.round(size * 2 * (HI ? HS : 1)),
    color: i % 2 === 1 && o.boldColor ? o.boldColor : color, italics, characterSpacing: HI ? undefined : spacing,
  }))).filter(Boolean);
}
function P(text, o = {}) {
  const { align = AlignmentType.LEFT, after = 70, before = 0, size = 9, keepNext, line: line0 = LINE, indent, border, pageBreakBefore, shading } = o;
  const line = HI ? Math.round(line0 * LF) : line0;
  return new Paragraph({
    alignment: align, keepNext, pageBreakBefore, border, shading, indent,
    spacing: { after, before, line, lineRule: 'auto' },
    children: runs(text, o),
  });
}
const sp = (n = 80) => new Paragraph({ spacing: { after: 0, before: 0, line: Math.max(n, 20), lineRule: 'exact' }, children: [new TextRun({ text: '', size: 2 })] });
const bullet = (text, o = {}) => new Paragraph({
  numbering: { reference: o.ref || 'bul', level: 0 },
  spacing: { after: o.after ?? 50, line: HI ? Math.round(LINE * LF) : LINE, lineRule: 'auto' },
  children: runs(text, { size: o.size || 9, color: o.color || col.INK, boldColor: o.boldColor }),
});

// ------------------------------------------------------------------ images
function pngSize(file) { const b = fs.readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }
function img(name, widthPx, o = {}) {
  const f = IMG(name); const [w, h] = pngSize(f);
  const hPx = Math.round((widthPx * h) / w);
  return new Paragraph({
    alignment: o.align || AlignmentType.CENTER, spacing: { after: o.after ?? 80, before: o.before ?? 0 },
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(f), transformation: { width: widthPx, height: hPx }, altText: { title: name, description: name, name } })],
  });
}
function imgFile(file, widthPx, o = {}) {
  const [w, h] = pngSize(file); const hPx = Math.round((widthPx * h) / w);
  return new Paragraph({
    alignment: o.align || AlignmentType.CENTER, spacing: { after: o.after ?? 0, before: 0 },
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(file), transformation: { width: widthPx, height: hPx }, altText: { title: 'img', description: 'img', name: 'img' } })],
  });
}

// ------------------------------------------------------------------ table helpers
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NB = { top: none, bottom: none, left: none, right: none };
const TBL_NB = { ...NB, insideHorizontal: none, insideVertical: none };
const gap = (c = 'FFFFFF', s = 24) => { const b = { style: BorderStyle.SINGLE, size: s, color: c }; return { top: b, bottom: b, left: b, right: b }; };
const MARG = { top: 70, bottom: 70, left: 120, right: 120 };

function cell(children, o = {}) {
  return new TableCell({
    children: Array.isArray(children) ? children : [children],
    width: { size: o.w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    borders: o.borders || NB, margins: o.margins || MARG, verticalAlign: o.v || VerticalAlign.CENTER,
    columnSpan: o.span,
  });
}
function table(rows, widths, o = {}) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, borders: TBL_NB,
    alignment: AlignmentType.CENTER,
    rows: rows.map((r) => new TableRow({ children: r, cantSplit: true, height: o.rowH ? { value: o.rowH, rule: HeightRule.ATLEAST } : undefined })),
  });
}

// page start marker (tiny paragraph forcing a new page)
const pageStart = () => new Paragraph({ pageBreakBefore: true, spacing: { after: 0, before: 0, line: 20, lineRule: 'exact' }, children: [new TextRun({ text: '', size: 2 })] });

function titleBar(c) {
  return table([[cell([
    P(c.kicker, { size: 7, color: col.PK, bold: true, after: 20, line: 240, spacing: 30 }),
    P(c.title, { size: HI ? 16 : 16.5, color: col.W, bold: true, after: 0, line: HI ? 330 : 280 }),
  ], { w: CW, fill: col.P, margins: { top: 130, bottom: 130, left: 220, right: 220 } })]], [CW]);
}

function callout(title, body, o = {}) {
  const c = o.color || col.P, fill = o.fill || col.PKT;
  const kids = [];
  if (title) kids.push(P(title, { size: 9.5, bold: true, color: c, after: 30, line: HI ? 320 : 270 }));
  (Array.isArray(body) ? body : [body]).forEach((b) => kids.push(typeof b === 'string' ? P(b, { size: o.size || 8.8, after: 20, boldColor: c }) : b));
  const lb = { style: BorderStyle.SINGLE, size: 36, color: c };
  return table([[cell(kids, { w: CW, fill, borders: { top: none, bottom: none, right: none, left: lb }, margins: { top: 100, bottom: 100, left: 200, right: 160 } })]], [CW]);
}

const H = (text, o = {}) => P(text, { size: o.size || 11, bold: true, color: o.color || col.P, after: o.after ?? 50, before: o.before ?? 0, keepNext: true, line: HI ? 320 : 280 });

// =====================================================================  PAGES
const pages = [];

// ---- 2 Welcome
{
  const c = t.p2; const w = [430, 3126, 430, 3125];
  const rows = [];
  for (let i = 0; i < c.toc.length; i += 2) {
    const r = [];
    [c.toc[i], c.toc[i + 1]].forEach((e, j) => {
      const fill = (i / 2) % 2 ? col.W : col.PKT;
      r.push(cell(P(e[0], { size: 9, bold: true, color: col.P, after: 0, align: AlignmentType.CENTER, line: 260 }), { w: w[j * 2], fill, margins: { top: 28, bottom: 28, left: 40, right: 40 } }));
      r.push(cell(P(e[1], { size: 8.1, after: 0, line: HI ? 290 : 240 }), { w: w[j * 2 + 1], fill, margins: { top: 28, bottom: 28, left: 60, right: 80 } }));
    });
    rows.push(r);
  }
  pages.push([
    titleBar(c), sp(90),
    P(c.lead, { size: 9.2, after: 60, boldColor: col.P }),
    H(c.howTitle, { size: 10.5 }),
    ...c.how.map((x) => bullet(x, { boldColor: col.P })),
    sp(50),
    callout(c.teenTitle, c.teen, { color: col.LP, fill: col.LT, size: 8.3 }),
    sp(70),
    H(c.tocTitle, { size: 10, after: 30 }),
    table(rows, w),
  ]);
}

// ---- 3 What is PCOD
{
  const c = t.p3;
  const cmp = table(c.cmpRows.map((r, i) => [
    cell(P(r[0], { size: 10, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0 }), { w: 1000, fill: ['E5849A', 'D8629E', col.P, col.LP][i], borders: gap(), margins: { top: 55, bottom: 55, left: 50, right: 50 } }),
    cell(P(r[1], { size: 8.3, after: 0, line: HI ? 300 : 250 }), { w: CW - 1000, fill: i % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 55, bottom: 55, left: 120, right: 100 } }),
  ]), [1000, CW - 1000]);
  pages.push([
    titleBar(c), sp(90), img('ovary', 310, { after: 10 }),
    P(c.intro, { size: 9, boldColor: col.P, after: 80 }),
    callout(c.callTitle, c.call),
    sp(50), H(c.cmpTitle, { size: 10 }), cmp,
    H(c.factsTitle, { size: 10, before: 30 }),
    ...c.facts.map((x) => bullet(x, { boldColor: col.P })),
  ]);
}

// ---- Spectrum & new name
{
  const c = t.pSpec; const w = [800, 3811, 2500];
  const fills = ['E5849A', 'D8629E', col.P, col.LP];
  const head = c.heads.map((h, i) => cell(P(h, { size: 8.4, bold: true, color: col.W, after: 0, line: 250 }), { w: w[i], fill: '3D3260', borders: gap(), margins: { top: 65, bottom: 65, left: 100, right: 80 } }));
  const rows = c.rows.map((r, k) => [
    cell(P(r[0], { size: 9, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, line: 260 }), { w: w[0], fill: fills[k], borders: gap(), margins: { top: 60, bottom: 60, left: 30, right: 30 } }),
    cell(P(r[1], { size: 7.9, after: 0, line: HI ? 285 : 238 }), { w: w[1], fill: k % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 60, bottom: 60, left: 100, right: 90 } }),
    cell(P(r[2], { size: 7.9, bold: true, color: col.P, after: 0, line: HI ? 285 : 238 }), { w: w[2], fill: k % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 60, bottom: 60, left: 100, right: 90 } }),
  ]);
  pages.push([
    titleBar(c), sp(90),
    P(c.intro, { size: 9, after: 40, boldColor: col.P }),
    img('spectrum', 400, { after: 40 }),
    table([head, ...rows], w), sp(70),
    callout(c.callTitle, c.call, { size: 8.2 }),
  ]);
}

// ---- 4 Cycle
{
  const c = t.p4; const fills = [col.P, col.LP, 'D8629E', 'C45BA2']; const w4 = [1778, 1778, 1777, 1778];
  const cards = table([c.phases.map((p, i) => cell([
    P(p[0], { size: 9.2, bold: true, color: col.W, after: 0, line: 260 }),
    P(p[1], { size: 7.5, color: 'F9DDEC', after: 40, line: 240 }),
    P(p[2], { size: 7.8, color: col.W, after: 0, line: HI ? 290 : 250 }),
  ], { w: w4[i], fill: fills[i], borders: gap(), v: VerticalAlign.TOP, margins: { top: 90, bottom: 90, left: 110, right: 90 } }))], w4);
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, boldColor: col.P, after: 70 }),
    img('cycle', 450, { after: 80 }),
    cards, sp(110),
    callout(c.callTitle, c.call),
  ]);
}

// ---- 5 Hormones
{
  const c = t.p5; const w3 = [2370, 2370, 2371];
  const fill = [col.PT, col.LT, col.PKT, col.PKT, col.PT, col.LT];
  const mk = (x, i) => cell([
    P(x[0], { size: 10, bold: true, color: i % 2 ? col.LP : col.P, after: 20, line: 270 }),
    P(x[1], { size: 8.2, after: 0, line: HI ? 300 : 255 }),
  ], { w: w3[i % 3], fill: fill[i], borders: gap(), v: VerticalAlign.TOP, margins: { top: 100, bottom: 100, left: 130, right: 110 } });
  const grid = table([c.cards.slice(0, 3).map((x, i) => mk(x, i)), c.cards.slice(3).map((x, i) => mk(x, i + 3))], w3);
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 70 }),
    img('hpo', 450, { after: 90 }),
    grid, sp(110),
    callout(null, c.note, { color: col.LP, fill: col.LT }),
  ]);
}

// ---- 6 Why
{
  const c = t.p6;
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 40 }),
    img('loop', 440, { after: 50 }),
    H(c.causesTitle, { size: 10 }),
    ...c.causes.map((x) => bullet(x, { boldColor: col.P })),
    sp(90),
    callout(c.callTitle, c.call, { color: col.G, fill: col.GT }),
  ]);
}

// ---- 7 Symptoms body map
{
  const c = t.p7; const w = [400, 3156, 400, 3155];
  const rows = [];
  for (let i = 0; i < 8; i += 2) {
    const r = [];
    [i, i + 1].forEach((k, j) => {
      const num = [1, 2, 3, 4, 5, 6, 7, 8][k];
      r.push(cell(P(String(num), { size: 9.5, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, line: 260 }), { w: w[j * 2], fill: col.P, borders: gap('FFFFFF', 24), margins: { top: 60, bottom: 60, left: 20, right: 20 } }));
      r.push(cell(P(c.items[k], { size: 8.4, after: 0, line: HI ? 300 : 250 }), { w: w[j * 2 + 1], fill: col.PKT, borders: gap('FFFFFF', 24), margins: { top: 60, bottom: 60, left: 110, right: 80 } }));
    });
    rows.push(r);
  }
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 40 }),
    img('body', 400, { after: 60 }),
    table(rows, w), sp(90),
    callout(null, c.note, { color: col.LP, fill: col.LT }),
  ]);
}

// ---- 8 Periods
{
  const c = t.p8; const fills = { green: [col.G, col.GT], amber: [col.A, col.AT], red: [col.R, col.RT] };
  const wl = 1750;
  const rows = c.rows.map((r) => [
    cell(P(r[1], { size: 9, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, line: HI ? 300 : 250 }), { w: wl, fill: fills[r[0]][0], borders: gap(), margins: { top: 80, bottom: 80, left: 70, right: 70 } }),
    cell(P(r[2], { size: 8.5, after: 0, boldColor: fills[r[0]][0] === col.A ? '9A6200' : fills[r[0]][0] }), { w: CW - wl, fill: fills[r[0]][1], borders: gap(), margins: { top: 80, bottom: 80, left: 130, right: 110 } }),
  ]);
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 40 }),
    img('strips', 400, { after: 70 }),
    table(rows, [wl, CW - wl]), sp(100),
    callout(c.whyTitle, c.why),
    sp(70),
    callout(c.teenTitle, c.teen, { color: col.LP, fill: col.LT }),
  ]);
}

// ---- 9 Hair / acne / hair fall
{
  const c = t.p9; const w3 = [2370, 2370, 2371]; const fills = [col.PT, col.PKT, col.LT]; const hc = [col.P, 'D8629E', col.LP];
  const cards = table([c.cols.map((x, i) => cell([
    P(x[0], { size: 10, bold: true, color: hc[i], after: x[1] ? 0 : 30, line: 270 }),
    x[1] ? P(x[1], { size: 7.5, color: col.GREY, after: 30, line: 240, italics: true }) : sp(0),
    P(x[2], { size: 8, after: 0, line: HI ? 300 : 250 }),
  ].filter(Boolean), { w: w3[i], fill: fills[i], borders: gap(), v: VerticalAlign.TOP, margins: { top: 100, bottom: 100, left: 120, right: 100 } }))], w3);
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 30 }),
    img('zones', 380, { after: 60 }),
    cards, sp(90),
    H(c.tipsTitle, { size: 10 }),
    ...c.tips.map((x) => bullet(x, { boldColor: col.P })),
  ]);
}

// ---- 10 Insulin / metabolic
{
  const c = t.p10;
  pages.push([
    titleBar(c), sp(90),
    H(c.keyTitle, { size: 10.5, after: 30 }),
    P(c.key, { size: 8.8, after: 40, boldColor: col.P }),
    img('lock', 440, { after: 40 }),
    P(c.signs, { size: 8.5, after: 80, boldColor: col.P }),
    H(c.msTitle, { size: 10.5, after: 30 }),
    P(c.msIntro, { size: 8.8, after: 50, boldColor: col.P }),
    img('ms', 440, { after: 70 }),
    callout(null, c.msNote, { color: col.G, fill: col.GT }),
  ]);
}

// ---- 11 Fertility
{
  const c = t.p11; const w2 = [3555, 3556];
  const left = cell([H(c.whyTitle, { size: 9.5, after: 30 }), ...c.why.map((x) => bullet(x, { size: 8.4, boldColor: col.P }))], { w: w2[0], fill: col.PT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 100, bottom: 80, left: 140, right: 110 } });
  const right = cell([H(c.whenTitle, { size: 9.5, after: 30, color: col.LP }), ...c.when.map((x) => bullet(x, { size: 8.4, boldColor: col.LP }))], { w: w2[1], fill: col.LT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 100, bottom: 80, left: 140, right: 110 } });
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 60, boldColor: col.P }),
    img('fert', 440, { after: 80 }),
    table([[left, right]], w2), sp(100),
    callout(c.tipsTitle, c.tips),
  ]);
}

// ---- 12 Diagnosis
{
  const c = t.p12; const w = [1100, 2455, 1100, 2456];
  const rows = [];
  for (let i = 0; i < 6; i += 2) {
    const r = [];
    [i, i + 1].forEach((k, j) => {
      r.push(cell(P(c.tests[k][0], { size: 8.4, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, line: 250 }), { w: w[j * 2], fill: k % 2 ? col.LP : col.P, borders: gap(), margins: { top: 60, bottom: 60, left: 40, right: 40 } }));
      r.push(cell(P(c.tests[k][1], { size: 8, after: 0, line: HI ? 290 : 245 }), { w: w[j * 2 + 1], fill: k % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 60, bottom: 60, left: 100, right: 80 } }));
    });
    rows.push(r);
  }
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 30, boldColor: col.P }),
    img('venn', 370, { after: 70 }),
    H(c.testsTitle, { size: 10 }),
    table(rows, w), sp(90),
    callout(null, c.teen, { color: col.LP, fill: col.LT }),
  ]);
}

// ---- 13 Symptom decoder
{
  const c = t.p13; const w = [2700, 2411, 2000];
  const head = c.heads.map((h, i) => cell(P(h, { size: 8.5, bold: true, color: col.W, after: 0, line: 250 }), { w: w[i], fill: col.P, borders: gap(), margins: { top: 80, bottom: 80, left: 110, right: 90 } }));
  const rows = c.rows.map((r, k) => r.map((x, i) => cell(P(x, { size: 7.9, bold: i === 2, color: i === 2 ? col.P : col.INK, after: 0, line: HI ? 290 : 240 }), { w: w[i], fill: k % 2 ? col.W : col.PKT, borders: gap(k % 2 ? col.W : col.PKT, 6), margins: { top: 65, bottom: 65, left: 110, right: 90 } })));
  pages.push([
    titleBar(c), sp(110),
    table([head, ...rows], w), sp(110),
    callout(c.redTitle, c.red, { color: col.R, fill: col.RT }),
  ]);
}

// ---- 14 Diet
{
  const c = t.p14; const w2 = [3555, 3556];
  const mk = (title, items, tc, fill, bc, wi) => cell([H(title, { size: 9.5, after: 30, color: tc }), ...items.map((x) => bullet(x, { size: 8.2, after: 30, boldColor: tc, ref: bc }))], { w: w2[wi], fill, borders: gap(), v: VerticalAlign.TOP, margins: { top: 100, bottom: 70, left: 130, right: 100 } });
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 30 }),
    img('plate', 400, { after: 60 }),
    table([[mk(c.moreTitle, c.more, col.G, col.GT, 'bulg', 0), mk(c.lessTitle, c.less, col.R, col.RT, 'bulr', 1)]], w2), sp(90),
    H(c.habitsTitle, { size: 10 }),
    ...c.habits.map((x) => bullet(x, { size: 8.6, after: 30 })),
  ]);
}

// ---- 5-phase eating roadmap
{
  const c = t.pRoad; const w = [900, CW - 900 - 780, 780];
  const fills = ['E5849A', 'D8629E', col.P, col.LP, '4B3C70'];
  const head = c.heads.map((h, i) => cell(P(h, { size: 7.6, bold: true, color: col.W, after: 0, line: 240, align: i === 1 ? AlignmentType.LEFT : AlignmentType.CENTER }), { w: w[i], fill: '3D3260', borders: gap(), margins: { top: 55, bottom: 55, left: 80, right: 80 } }));
  const rows = c.rows.map((r, k) => [
    cell([P(r[0], { size: 8.4, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, line: 240 }), P(r[1], { size: 7.3, color: 'FBEAF3', align: AlignmentType.CENTER, after: 0, line: 230 })], { w: w[0], fill: fills[k], borders: gap(), margins: { top: 50, bottom: 50, left: 30, right: 30 } }),
    cell(P(`**${r[2]}.** ${r[3]}`, { size: 7.8, after: 0, boldColor: fills[k], line: HI ? 280 : 232 }), { w: w[1], fill: k % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 40, bottom: 40, left: 100, right: 90 } }),
    cell(P(r[4], { size: 8, bold: true, color: col.P, align: AlignmentType.CENTER, after: 0, line: 240 }), { w: w[2], fill: k % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 50, bottom: 50, left: 40, right: 40 } }),
  ]);
  pages.push([
    titleBar(c), sp(80),
    P(c.intro, { size: 8.4, after: 30 }),
    img('roadmap', 340, { after: 16 }),
    table([head, ...rows], w), sp(40),
    callout(null, `**${c.seedTitle}:** ${c.seed}`, { color: col.LP, fill: col.LT, size: 7.7 }),
  ]);
}

// ---- 15 Move sleep calm
{
  const c = t.p15; const w3 = [2370, 2370, 2371]; const fills = [col.PT, col.LT, col.PKT]; const hc = [col.P, col.LP, 'D8629E'];
  const cards = table([c.cols.map((x, i) => cell([
    P(x[0], { size: 11, bold: true, color: hc[i], after: 30, line: 280 }),
    P(x[1], { size: 8.2, after: 0, boldColor: hc[i], line: HI ? 300 : 255 }),
  ], { w: w3[i], fill: fills[i], borders: gap(), v: VerticalAlign.TOP, margins: { top: 110, bottom: 110, left: 130, right: 110 } }))], w3);
  const goals = HI ? ['इस हफ़्ते मैं करूँगी:', '1.', '2.', '3.'] : ['This week I will:', '1.', '2.', '3.'];
  const line = (txt, first) => new Paragraph({ spacing: { before: 140, after: 0, line: 300 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: col.PK, space: 2 } }, children: runs(txt, { size: 9, bold: first, color: first ? col.P : col.GREY }) });
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 60 }),
    img('week', 450, { after: 90 }),
    cards, sp(110),
    callout(null, c.note, { color: col.G, fill: col.GT }),
    sp(120),
    table([[cell(goals.map((g, i) => line(g, i === 0)), { w: CW, fill: col.W, borders: gap(col.PK, 8), margins: { top: 60, bottom: 160, left: 200, right: 200 } })]], [CW]),
  ]);
}

// ---- 16 Treatment
{
  const c = t.p16; const w = [2450, CW - 2450];
  const head = c.heads.map((h, i) => cell(P(h, { size: 8.6, bold: true, color: col.W, after: 0 }), { w: w[i], fill: col.LP, borders: gap(), margins: { top: 80, bottom: 80, left: 120, right: 100 } }));
  const rows = c.rows.map((r, k) => r.map((x, i) => cell(P(x, { size: 8.3, bold: i === 0, color: i === 0 ? col.P : col.INK, after: 0, line: HI ? 300 : 250 }), { w: w[i], fill: k % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 45, bottom: 45, left: 120, right: 100 } })));
  const wf = [1650, CW - 1650];
  const fertRows = c.fertRows.map((r, k) => [
    cell(P(r[0], { size: 8.4, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, line: HI ? 290 : 240 }), { w: wf[0], fill: k % 2 ? col.LP : col.P, borders: gap(), margins: { top: 60, bottom: 60, left: 50, right: 50 } }),
    cell(P(r[1], { size: 8, after: 0, line: HI ? 290 : 240 }), { w: wf[1], fill: k % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 60, bottom: 60, left: 120, right: 100 } }),
  ]);
  pages.push([
    titleBar(c), sp(90),
    P(c.intro, { size: 9, after: 40, boldColor: col.P }),
    img('ladder', 340, { after: 30 }),
    ...c.rows.map((r) => bullet(`**${r[0]}:** ${r[1]}`, { size: 8.4, after: 35, boldColor: col.P })), sp(60),
    H(c.fertTitle, { size: 10, after: 40 }),
    table(fertRows, wf), sp(70),
    callout(null, c.note, { color: col.LP, fill: col.LT }),
  ]);
}

// ---- How we treat each symptom (2 pages)
function howCard(g, labels, color, tint) {
  const wl = 1250, w = [wl, CW - wl];
  const rows = [[cell(P(g.title, { size: 8.8, bold: true, color: col.W, after: 0, line: HI ? 290 : 255 }), { w: CW, span: 2, fill: color, borders: gap(), margins: { top: 70, bottom: 70, left: 130, right: 100 } })]];
  g.rows.forEach(([k, txt]) => rows.push([
    cell(P(labels[k], { size: 7.6, bold: true, color, after: 0, line: 235 }), { w: wl, fill: tint, borders: gap(), margins: { top: 45, bottom: 45, left: 110, right: 60 } }),
    cell(P(txt, { size: 7.7, after: 0, line: HI ? 280 : 232 }), { w: w[1], fill: col.W, borders: gap(tint, 12), margins: { top: 45, bottom: 45, left: 110, right: 90 } }),
  ]));
  return table(rows, w);
}
{
  const c = t.pHow1; const hc = [col.P, col.LP, 'D8629E', col.P, col.LP];
  pages.push([
    titleBar(c), sp(90),
    P(c.intro, { size: 9, after: 70, boldColor: col.P }),
    howCard(c.groups[0], c.labels, hc[0], col.PT), sp(110),
    howCard(c.groups[1], c.labels, hc[1], col.LT), sp(110),
    callout(null, c.note, { color: col.LP, fill: col.LT }),
  ]);
  const d = t.pHow2;
  pages.push([
    titleBar(d), sp(90),
    howCard(d.groups[0], c.labels, 'D8629E', col.PKT), sp(90),
    howCard(d.groups[1], c.labels, col.LP, col.LT), sp(90),
    howCard(d.groups[2], c.labels, col.P, col.PT), sp(70),
    P(d.note, { size: 7.8, color: col.GREY, italics: true, align: AlignmentType.CENTER, after: 0 }),
  ]);
}

// ---- 17 Mind + long-term
{
  const c = t.p17;
  pages.push([
    titleBar(c), sp(100),
    callout(c.mindTitle, c.mind),
    sp(70),
    callout(c.helpTitle, c.help, { color: col.LP, fill: col.LT }),
    sp(100), H(c.riskTitle, { size: 10.5 }),
    img('risks', 450, { after: 80 }),
    callout(c.goodTitle, c.good.map((x) => bullet(x, { size: 8.6, after: 35, boldColor: col.G, ref: 'bulg' })), { color: col.G, fill: col.GT }),
  ]);
}

// ---- 18 Our team
{
  const c = t.p18;
  pages.push([
    titleBar(c), sp(110),
    P(c.intro, { size: 9, after: 70, boldColor: col.P }),
    img('svc', 450, { after: 80 }),
    H(c.whyTitle, { size: 10.5 }),
    ...c.why.map((x) => bullet(x, { boldColor: col.P })),
    sp(80),
    callout(c.callTitle, c.call, { color: col.LP, fill: col.LT }),
  ]);
}

// ---- 19 Programmes
{
  const c = t.p19; const w = [1250, CW - 1250];
  const rows = c.m3.map((r, k) => [
    cell(P(r[0], { size: 8.6, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, line: 250 }), { w: w[0], fill: col.P, borders: gap(), margins: { top: 80, bottom: 80, left: 50, right: 50 } }),
    cell([P(r[1], { size: 9, bold: true, color: col.P, after: 10, line: 260 }), P(r[2], { size: 8.2, after: 0, line: HI ? 300 : 250 })], { w: w[1], fill: k % 2 ? col.PKT : col.PT, borders: gap(), margins: { top: 80, bottom: 80, left: 140, right: 110 } }),
  ]);
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 50 }),
    img('timeline', 450, { after: 90 }),
    H(c.m3Title, { size: 9.5, after: 40 }),
    table(rows, w), sp(100),
    callout(c.m6Title, c.m6, { color: col.LP, fill: col.LT }),
    P(c.note, { size: 8, color: col.GREY, before: 70, after: 0, italics: true, align: AlignmentType.CENTER }),
  ]);
}

// ---- 20 Myths
{
  const c = t.p20; const wl = 3500;
  const head = [
    cell(P(c.mythLabel, { size: 9, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, spacing: 40 }), { w: wl, fill: col.R, borders: gap(), margins: { top: 70, bottom: 70, left: 90, right: 90 } }),
    cell(P(c.factLabel, { size: 9, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, spacing: 40 }), { w: CW - wl, fill: col.G, borders: gap(), margins: { top: 70, bottom: 70, left: 90, right: 90 } }),
  ];
  const rows = c.rows.map((r) => [
    cell(P(r[0], { size: 9.4, bold: true, color: '8E2A2A', after: 0, line: HI ? 330 : 280 }), { w: wl, fill: col.RT, borders: gap(), margins: { top: HI ? 120 : 170, bottom: HI ? 120 : 170, left: 150, right: 120 } }),
    cell(P(r[1], { size: 9.4, after: 0, color: '1F5E40', line: HI ? 330 : 280 }), { w: CW - wl, fill: col.GT, borders: gap(), margins: { top: HI ? 120 : 170, bottom: HI ? 120 : 170, left: 150, right: 120 } }),
  ]);
  pages.push([titleBar(c), sp(110), table([head, ...rows], [wl, CW - wl])]);
}

// ---- 21 Q&A
{
  const c = t.p21; const w2 = [3555, 3556];
  const qa = (x, i) => cell([P(x[0], { size: 9, bold: true, color: col.P, after: 40, line: HI ? 310 : 270 }), P(x[1], { size: 8.4, after: 0, line: HI ? 310 : 262 })], { w: w2[i % 2], fill: i % 2 ? col.LT : col.PT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 120, bottom: 120, left: 140, right: 120 } });
  const grid = table([[qa(c.qa[0], 0), qa(c.qa[1], 1)], [qa(c.qa[2], 2), qa(c.qa[3], 3)], [qa(c.qa[4], 4), qa(c.qa[5], 5)]], w2);
  const box = (txt) => table([[
    cell(sp(0), { w: 260, fill: col.W, borders: gap(col.P, 8), margins: { top: 20, bottom: 20, left: 20, right: 20 } }),
    cell(P(txt, { size: 9.2, after: 0 }), { w: CW - 260 - 120, margins: { top: 70, bottom: 70, left: 140, right: 60 } }),
  ]], [260, CW - 260 - 120]);
  pages.push([
    titleBar(c), sp(110), grid, sp(140),
    H(c.askTitle, { size: 10.5, after: 70 }),
    ...c.ask.flatMap((x) => [box(x), sp(30)]),
  ]);
}

// ---- 22 Tracker
{
  const c = t.p22; const w = [1500, 700, 1500, 1000, 1000, 1411];
  const head = c.heads.map((h, i) => cell(P(h, { size: 7.4, bold: true, color: col.W, after: 0, align: AlignmentType.CENTER, line: HI ? 270 : 230 }), { w: w[i], fill: col.P, borders: gap(col.W, 8), margins: { top: 70, bottom: 70, left: 40, right: 40 } }));
  const rows = [];
  for (let r = 0; r < 15; r++) rows.push(w.map((wi, i) => cell(P('', { after: 0 }), { w: wi, fill: r % 2 ? col.W : col.PKT, borders: gap(col.PK, 4), margins: { top: 20, bottom: 20, left: 40, right: 40 } })));
  const line = (txt) => new Paragraph({ spacing: { before: 200, after: 0, line: 300 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: col.PK, space: 2 } }, children: runs(txt, { size: 9, bold: true, color: col.P }) });
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9, after: 70, boldColor: col.P }),
    table([head, ...rows], w, { rowH: 420 }),
    line(c.myMeds), line(c.nextVisit),
  ]);
}

// ---- 23 Patient stories
{
  const c = t.p23; const wp = 1500;
  const card = (x, i) => table([[
    cell([P(c.photo, { size: 9, bold: true, color: col.GREY, align: AlignmentType.CENTER, after: 0 })], { w: wp, fill: col.LT, borders: gap(), margins: { top: 650, bottom: 650, left: 40, right: 40 } }),
    cell([
      P('“', { size: 26, bold: true, color: col.PK, after: 0, line: 260 }),
      P(x.quote, { size: 9, color: col.GREY, italics: true, after: 70, line: HI ? 330 : 300 }),
      P(x.name, { size: 9.5, bold: true, color: col.P, after: 10, line: 260 }),
      P(x.detail, { size: 8, color: col.GREY, after: 0, line: 250 }),
    ], { w: CW - wp, fill: i ? col.LT : col.PKT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 110, bottom: 130, left: 200, right: 160 } }),
  ]], [wp, CW - wp]);
  pages.push([
    titleBar(c), sp(100),
    P(c.intro, { size: 9.5, after: 120 }),
    card(c.cards[0], 0), sp(140), card(c.cards[1], 1),
  ]);
}

// ---- COVER + BACK
const coverImg = new Paragraph({
  spacing: { after: 0, before: 0, line: 20, lineRule: 'exact' },
  children: [new ImageRun({
    type: 'png', data: fs.readFileSync(IMG('cover')),
    transformation: { width: 559.37, height: 793.7 },
    altText: { title: 'Cover', description: 'PCOD Xpert booklet cover', name: 'cover' },
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
      verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
      behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE },
    },
  })],
});

function back() {
  const b = t.back;
  const link = (text, url, size, color) => new Paragraph({
    spacing: { after: 30, line: 380 },
    children: [new ExternalHyperlink({ link: url, children: [new TextRun({ text, font: F(true), size: size * 2, sizeComplexScript: size * 2, color, underline: {} })] })],
  });
  const wL = 4300, wR = CW - wL;
  const cta = table([[
    cell([
      P(b.waLine, { size: 10, color: 'F9DDEC', after: 50, line: 280 }),
      link(t.phoneDisplay, t.phoneTel, 21, col.W),
      new Paragraph({ spacing: { after: 0, line: 260 }, children: [
        new ExternalHyperlink({ link: t.wa, children: [new TextRun({ text: 'WhatsApp', font: F(true), size: 18, sizeComplexScript: 18, color: col.PK, underline: {} })] }),
        new TextRun({ text: '  |  ', font: F(true), size: 18, sizeComplexScript: 18, color: col.PK }),
        new ExternalHyperlink({ link: t.phoneTel, children: [new TextRun({ text: HI ? 'कॉल' : 'Call', font: F(true), size: 18, sizeComplexScript: 18, color: col.PK, underline: {} })] }),
      ] }),
    ], { w: wL, fill: col.P, borders: NB, margins: { top: 240, bottom: 240, left: 300, right: 100 } }),
    cell([imgFile(path.join(ROOT, 'assets/img/qr_whatsapp.png'), 96), P(b.scan, { size: 6.8, color: col.W, align: AlignmentType.CENTER, after: 0, before: 40, line: 220 })], { w: wR, fill: col.P, borders: NB, margins: { top: 180, bottom: 160, left: 60, right: 200 } }),
  ]], [wL, wR]);
  const svc = table([[cell([
    P(b.svcHead, { size: 9.5, bold: true, color: col.P, align: AlignmentType.CENTER, after: 30, line: 270 }),
    P(b.svcLine, { size: 7.6, color: col.LP, align: AlignmentType.CENTER, after: 0, line: HI ? 290 : 250 }),
  ], { w: CW, fill: col.W, borders: gap(col.PK, 10), margins: { top: 110, bottom: 110, left: 160, right: 160 } })]], [CW]);
  const addr = table([[cell([
    P(b.addrTitle, { size: 10, bold: true, color: col.P, after: 40, line: 280 }),
    ...t.address.map((l, i) => P(l, { size: 9, after: 0, bold: i === 0, line: HI ? 320 : 280 })),
  ], { w: CW, fill: col.PKT, borders: NB, margins: { top: 160, bottom: 160, left: 300, right: 200 } })]], [CW]);
  const disc = table([[cell([
    P(b.disclaimerTitle, { size: 7.5, bold: true, color: col.LP, after: 30, line: 240, spacing: 30 }),
    P(b.disclaimer, { size: 7, color: col.GREY, after: 0, line: HI ? 280 : 240 }),
  ], { w: CW, fill: col.LT, borders: NB, margins: { top: 110, bottom: 110, left: 220, right: 200 } })]], [CW]);
  const bg = new Paragraph({
    spacing: { after: 0, before: 0, line: 20, lineRule: 'exact' },
    children: [new ImageRun({
      type: 'png', data: fs.readFileSync(IMG('backbg')), transformation: { width: 559.37, height: 793.7 },
      altText: { title: 'Back', description: 'decorative background', name: 'backbg' },
      floating: {
        horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
        verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
        behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE },
      },
    })],
  });
  return [
    bg,
    imgFile(path.join(ROOT, 'assets/img/logo.png'), 240, { after: 90 }),
    P(b.head1, { size: HI ? 20 : 22, bold: true, color: col.LP, align: AlignmentType.CENTER, after: 0, line: HI ? 400 : 340 }),
    P(b.head2, { size: HI ? 25 : 27, bold: true, color: col.P, align: AlignmentType.CENTER, after: 130, line: HI ? 440 : 380 }),
    cta, sp(100), svc, sp(90), addr, sp(90), disc,
  ];
}

// =====================================================================  DOCUMENT
const bulletLvl = (color) => ({
  reference: null, levels: [{
    level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 300, hanging: 210 } }, run: { color, font: F(true), size: 20 } },
  }],
});
const numbering = { config: [
  { ...bulletLvl(col.P), reference: 'bul' }, { ...bulletLvl(col.G), reference: 'bulg' }, { ...bulletLvl(col.R), reference: 'bulr' },
] };

const footer = new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: CW }],
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: col.PK, space: 6 } },
  spacing: { before: 0, after: 0 },
  children: [
    new TextRun({ text: t.footer, font: F(false), size: 14, sizeComplexScript: 14, color: col.GREY }),
    new TextRun({ children: ['\t', PageNumber.CURRENT], font: F(true), size: 16, sizeComplexScript: 16, color: col.P }),
  ],
})] });

const pageProps = (m) => ({ page: { size: { width: PAGE_W, height: PAGE_H }, margin: m } });
const body = [];
pages.forEach((pg, i) => { if (i) body.push(pageStart()); body.push(...pg); });

const doc = new Document({
  creator: 'PCOD Xpert by Hope', title: HI ? 'PCOD, PCOS और PMOS के बारे में सब कुछ' : 'Everything About PCOD, PCOS & PMOS', description: 'Patient education booklet',
  fonts: [
    { name: REG, data: fs.readFileSync(path.join(ROOT, 'assets/fonts/Poppins_400Regular.ttf')) },
    { name: SEMI, data: fs.readFileSync(path.join(ROOT, 'assets/fonts/Poppins_600SemiBold.ttf')) },
  ],
  styles: { default: { document: { run: { font: F(false), size: 18, sizeComplexScript: 18, color: col.INK, language: { value: 'en-IN', bidirectional: 'hi-IN' } } } } },
  numbering,
  sections: [
    { properties: pageProps({ top: 0, right: 0, bottom: 0, left: 0, header: 0, footer: 0 }), children: [coverImg] },
    { properties: pageProps({ top: MT, right: MX, bottom: MB, left: MX, header: 300, footer: 330 }), footers: { default: footer }, children: body },
    { properties: pageProps({ top: 640, right: MX, bottom: 500, left: MX, header: 300, footer: 300 }), footers: { default: new Footer({ children: [new Paragraph({ children: [] })] }) }, children: back() },
  ],
});

const out = path.join(ROOT, 'output', `PCOD_Xpert_Patient_Booklet_${lang === 'en' ? 'EN' : 'HI'}.docx`);
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('wrote', out, (buf.length / 1e6).toFixed(1) + ' MB'); });
