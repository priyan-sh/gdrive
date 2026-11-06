// PCOD Xpert "My Patient File": A4, 16 pages, fillable forms. usage: node build_patientfile.js
const fs = require('fs');
const path = require('path');
const D = require('docx');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, WidthType, ShadingType, BorderStyle,
  AlignmentType, VerticalAlign, Footer, Header, PageNumber, LevelFormat, ExternalHyperlink, TabStopType, HeightRule,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType,
} = D;

const ROOT = path.join(__dirname, '..');
const IMGD = (n) => path.join(ROOT, 'assets/img/en', n + '.png');
const PAGE_W = 11906, PAGE_H = 16838, MX = 700, MT = 1050, MB = 850;
const CW = PAGE_W - 2 * MX;                           // 10506
const col = {
  P: 'A62683', LP: '624E88', PK: 'F29BAA', PKT: 'FDEBEF', PT: 'F7E4F0', LT: 'ECE8F3', INK: '2A1F33', GREY: '6B6275', W: 'FFFFFF',
  G: '3A9D6E', GT: 'E3F3EA', A: 'E9A23B', AT: 'FFF1D6', R: 'D64545', RT: 'FBE3E3', D1: '3D3260', MID: 'D8629E',
};
const REG = 'Poppins', SEMI = 'Poppins SemiBold', SYM = 'Segoe UI Symbol';
const F = (bold) => { const n = bold ? SEMI : REG; return { ascii: n, hAnsi: n, cs: n, eastAsia: n }; };

// ------------------------------------------------------------------ text
function runs(text, o = {}) {
  const { size = 9, color = col.INK, bold = false, italics = false, spacing } = o;
  return String(text).split('**').map((p, i) => (p === '' ? null : new TextRun({
    text: p, font: F(bold || i % 2 === 1), size: Math.round(size * 2), color: i % 2 === 1 && o.boldColor ? o.boldColor : color, italics, characterSpacing: spacing,
  }))).filter(Boolean);
}
function P(text, o = {}) {
  const { align = AlignmentType.LEFT, after = 60, before = 0, size = 9, line = 276, keepNext, border, indent } = o;
  return new Paragraph({ alignment: align, keepNext, border, indent, spacing: { after, before, line, lineRule: 'auto' }, children: runs(text, o) });
}
const sp = (n = 100) => new Paragraph({ spacing: { after: 0, before: 0, line: Math.max(n, 20), lineRule: 'exact' }, children: [new TextRun({ text: '', size: 2 })] });
const pageStart = () => new Paragraph({ pageBreakBefore: true, spacing: { after: 0, before: 0, line: 20, lineRule: 'exact' }, children: [new TextRun({ text: '', size: 2 })] });
const box = (txt, o = {}) => new Paragraph({ spacing: { after: 0, line: 270 }, children: [new TextRun({ text: '☐', font: SYM, size: (o.size || 11) * 2, color: o.color || col.P }), new TextRun({ text: '  ' + txt, font: F(false), size: (o.tsize || 8.8) * 2, color: col.INK })] });

function pngSize(f) { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }
function img(file, wPx, o = {}) {
  const [w, h] = pngSize(file);
  return new Paragraph({ alignment: o.align || AlignmentType.CENTER, spacing: { after: o.after ?? 80, before: o.before ?? 0 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(file), transformation: { width: wPx, height: Math.round((wPx * h) / w) }, altText: { title: 'img', description: 'img', name: 'img' } })] });
}

// ------------------------------------------------------------------ tables
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NB = { top: none, bottom: none, left: none, right: none };
const TBL = { ...NB, insideHorizontal: none, insideVertical: none };
const gap = (c = 'FFFFFF', s = 18) => { const b = { style: BorderStyle.SINGLE, size: s, color: c }; return { top: b, bottom: b, left: b, right: b }; };
const MARG = { top: 70, bottom: 70, left: 120, right: 120 };
function cell(children, o = {}) {
  return new TableCell({
    children: Array.isArray(children) ? children : [children], width: { size: o.w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    borders: o.borders || NB, margins: o.margins || MARG, verticalAlign: o.v || VerticalAlign.CENTER, columnSpan: o.span,
  });
}
function table(rows, widths, o = {}) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, borders: TBL, alignment: AlignmentType.CENTER,
    rows: rows.map((r, i) => new TableRow({ children: r, cantSplit: true, tableHeader: o.header && i === 0, height: o.rowH ? { value: o.rowH, rule: HeightRule.ATLEAST } : undefined })),
  });
}

// section title bar:  [number] Title ............ [WHO FILLS]
function titleBar(num, title, sub, who) {
  const whoCol = who === 'DOCTOR FILLS' ? col.LP : who === 'PATIENT FILLS' ? col.PK : col.MID;
  const wn = 900, wt = 2300;
  return table([[
    cell(P(num, { size: 20, bold: true, color: col.W, align: AlignmentType.CENTER, after: 0, line: 300 }), { w: wn, fill: col.D1, margins: { top: 140, bottom: 140, left: 60, right: 60 } }),
    cell([P(title, { size: 17, bold: true, color: col.W, after: 0, line: 300 }), sub ? P(sub, { size: 8, color: 'F5D6E8', after: 0, line: 250 }) : sp(0)].filter(Boolean), { w: CW - wn - wt, fill: col.P, margins: { top: 120, bottom: 120, left: 240, right: 120 } }),
    cell(P(who || 'BOTH', { size: 7.5, bold: true, color: who === 'PATIENT FILLS' ? col.INK : col.W, align: AlignmentType.CENTER, after: 0, line: 240, spacing: 20 }), { w: wt, fill: whoCol, margins: { top: 60, bottom: 60, left: 80, right: 80 } }),
  ]], [wn, CW - wn - wt, wt]);
}
const H = (text, o = {}) => new Paragraph({
  keepNext: true, spacing: { before: o.before ?? 200, after: o.after ?? 80, line: 280 },
  border: { left: { style: BorderStyle.SINGLE, size: 24, color: col.PK, space: 8 } }, indent: { left: 140 },
  children: runs(text, { size: 10.5, bold: true, color: col.P }),
});
function callout(title, body, o = {}) {
  const c = o.color || col.P, fill = o.fill || col.PKT;
  const kids = []; if (title) kids.push(P(title, { size: 9.5, bold: true, color: c, after: 30 }));
  (Array.isArray(body) ? body : [body]).forEach((b) => kids.push(typeof b === 'string' ? P(b, { size: o.size || 8.6, after: 20, boldColor: c }) : b));
  return table([[cell(kids, { w: CW, fill, borders: { top: none, bottom: none, right: none, left: { style: BorderStyle.SINGLE, size: 36, color: c } }, margins: { top: 110, bottom: 110, left: 220, right: 180 } })]], [CW]);
}

// fill-in fields: [{l:'Full name', w:3}, ...] on one row
function fields(list, o = {}) {
  const tot = list.reduce((a, b) => a + (b.w || 1), 0); let acc = 0;
  const widths = list.map((f, i) => { const w = i === list.length - 1 ? CW - acc : Math.round((CW * (f.w || 1)) / tot); acc += w; return w; });
  const line = { style: BorderStyle.SINGLE, size: 6, color: col.PK };
  return table([list.map((f, i) => cell([
    P(f.l, { size: 7, bold: true, color: col.GREY, after: 0, line: 220, spacing: 10 }), sp(o.h || 400),
  ], { w: widths[i], borders: { top: none, left: none, right: { style: BorderStyle.SINGLE, size: 24, color: col.W }, bottom: line }, margins: { top: 30, bottom: 20, left: 100, right: 40 }, v: VerticalAlign.TOP }))], widths);
}
// tick-box grid
function checks(items, cols = 3, o = {}) {
  const w = Math.floor(CW / cols); const widths = Array(cols).fill(w); widths[cols - 1] = CW - w * (cols - 1);
  const rows = [];
  for (let i = 0; i < items.length; i += cols) {
    rows.push(Array.from({ length: cols }, (_, j) => { const it = items[i + j]; return cell(it ? box(it, o) : sp(0), { w: widths[j], fill: (i / cols) % 2 ? col.W : col.PKT, margins: { top: 60, bottom: 60, left: 140, right: 80 } }); }));
  }
  return table(rows, widths);
}
// blank table with header + rows. first = optional array of prefilled first-column labels
function grid(heads, widths, nRows, o = {}) {
  const head = heads.map((h, i) => cell(P(h, { size: 7.8, bold: true, color: col.W, after: 0, line: 240, align: i === 0 && !o.centerFirst ? AlignmentType.LEFT : AlignmentType.CENTER }), { w: widths[i], fill: col.D1, borders: gap(col.W, 8), margins: { top: 70, bottom: 70, left: 90, right: 60 } }));
  const rows = [head];
  for (let r = 0; r < nRows; r++) {
    const lab = o.labels && o.labels[r];
    if (lab && lab.group) { rows.push([cell(P(lab.group, { size: 8.4, bold: true, color: col.W, after: 0, line: 250 }), { w: widths.reduce((a, b) => a + b, 0), span: widths.length, fill: lab.color || col.P, borders: gap(col.W, 8), margins: { top: 50, bottom: 50, left: 120, right: 60 } })]); continue; }
    rows.push(widths.map((w, i) => cell(i === 0 && lab ? P(lab, { size: 8.2, bold: o.boldFirst, color: o.boldFirst ? col.P : col.INK, after: 0, line: 240 }) : P('', { after: 0 }), { w, fill: r % 2 ? col.W : col.PKT, borders: gap(col.PK, 4), margins: { top: 30, bottom: 30, left: 90, right: 50 } })));
  }
  return table(rows, widths, { header: true, rowH: o.rowH || 400 });
}

// ======================================================================  PAGES
const pages = [];

// ---- 2  Welcome / contents / team
{
  const toc = [['3', 'Patient details'], ['4', 'Health history'], ['5', 'Symptoms and goals'], ['6', 'Doctor’s assessment'], ['7', 'Investigations tracker'], ['8', 'My treatment plan'], ['9', 'Medicines and supplements'], ['10', 'Eating roadmap'], ['11', 'Move, sleep, calm log'], ['12', 'Cycle and symptom diary'], ['13', 'Visit and follow-up log'], ['14', 'Progress review'], ['15', 'Consents and documents'], ['16', 'Contacts and warning signs']];
  const wt = [560, CW / 2 - 560, 560, CW / 2 - 560].map(Math.round); wt[3] = CW - wt[0] - wt[1] - wt[2];
  const tocRows = [];
  for (let i = 0; i < toc.length; i += 2) {
    const r = []; [toc[i], toc[i + 1]].forEach((e, j) => { const fill = (i / 2) % 2 ? col.W : col.PKT;
      r.push(cell(P(e[0], { size: 9.5, bold: true, color: col.P, align: AlignmentType.CENTER, after: 0 }), { w: wt[j * 2], fill, margins: { top: 60, bottom: 60, left: 30, right: 30 } }));
      r.push(cell(P(e[1], { size: 9, after: 0 }), { w: wt[j * 2 + 1], fill, margins: { top: 60, bottom: 60, left: 100, right: 80 } })); });
    tocRows.push(r);
  }
  const roles = ['Gynecologist', 'Endocrinologist', 'Dermatologist', 'Dietitian', 'Ayurveda physician', 'Counsellor', 'Programme coordinator'];
  const wr = [2600, 3500, CW - 6100];
  const team = [[...['Role', 'Name', 'Days / how to reach'].map((h, i) => cell(P(h, { size: 7.8, bold: true, color: col.W, after: 0 }), { w: wr[i], fill: col.D1, borders: gap(col.W, 8) }))],
    ...roles.map((r, k) => [cell(P(r, { size: 8.6, bold: true, color: col.P, after: 0 }), { w: wr[0], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4), margins: { top: 130, bottom: 130, left: 120, right: 80 } }), cell(P('', { after: 0 }), { w: wr[1], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) }), cell(P('', { after: 0 }), { w: wr[2], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) })])];
  pages.push([
    titleBar('01', 'Welcome to your file', 'One place for your history, tests, plan and progress', 'BOTH'), sp(160),
    P('This file is **yours**. It travels with you to every visit, so every doctor on your team sees the same full picture. The more completely it is filled in, the better your plan can be.', { size: 10, after: 120, boldColor: col.P }),
    H('How to use this file', { before: 60 }),
    table([[
      cell([P('1', { size: 16, bold: true, color: col.P, after: 0 }), P('**Fill in** the pink-tagged pages at home before your first visit.', { size: 8.6, after: 0 })], { w: Math.round(CW / 3), fill: col.PKT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 110, bottom: 110, left: 160, right: 120 } }),
      cell([P('2', { size: 16, bold: true, color: col.LP, after: 0 }), P('**Your doctors** complete the purple-tagged pages during visits.', { size: 8.6, after: 0 })], { w: Math.round(CW / 3), fill: col.LT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 110, bottom: 110, left: 160, right: 120 } }),
      cell([P('3', { size: 16, bold: true, color: col.MID, after: 0 }), P('**Bring it back** to every visit and update the logs and diary.', { size: 8.6, after: 0 })], { w: CW - 2 * Math.round(CW / 3), fill: col.PT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 110, bottom: 110, left: 160, right: 120 } }),
    ]], [Math.round(CW / 3), Math.round(CW / 3), CW - 2 * Math.round(CW / 3)]),
    H('What is inside'), table(tocRows, wt),
    H('My care team'), table(team, wr), sp(120),
    callout('Keep it safe', 'This file holds private health information. Share it only with your care team. Keep a photo or scan of it on your phone, in case the paper copy is lost.', { color: col.LP, fill: col.LT, size: 8.4 }),
  ]);
}

// ---- 3  Patient details
pages.push([
  titleBar('02', 'Patient details', 'Registration and contact information', 'PATIENT FILLS'), sp(140),
  H('About me', { before: 40 }),
  fields([{ l: 'FULL NAME', w: 4 }, { l: 'PATIENT ID', w: 2 }, { l: 'DATE', w: 1.6 }]),
  fields([{ l: 'DATE OF BIRTH', w: 2 }, { l: 'AGE', w: 1 }, { l: 'HEIGHT (cm)', w: 1.4 }, { l: 'WEIGHT (kg)', w: 1.4 }, { l: 'BLOOD GROUP', w: 1.4 }]),
  fields([{ l: 'OCCUPATION', w: 3 }, { l: 'MARITAL STATUS', w: 2 }, { l: 'LANGUAGE I PREFER', w: 2 }]),
  H('How to reach me'),
  fields([{ l: 'MOBILE / WHATSAPP', w: 3 }, { l: 'ALTERNATE NUMBER', w: 3 }, { l: 'EMAIL', w: 4 }]),
  fields([{ l: 'ADDRESS', w: 1 }], { h: 420 }), fields([{ l: 'CITY / PIN CODE', w: 3 }, { l: 'BEST TIME TO CALL', w: 2 }, { l: 'ID PROOF TYPE / NUMBER', w: 3 }]),
  H('Emergency contact'),
  fields([{ l: 'NAME', w: 3 }, { l: 'RELATIONSHIP', w: 2 }, { l: 'PHONE', w: 3 }]),
  H('Referral'),
  checks(['Self / walk-in', 'Doctor referral', 'Family or friend', 'Social media', 'Online search', 'Other hospital'], 3),
  fields([{ l: 'REFERRED BY / NOTES', w: 1 }]),
  H('How we may contact me'),
  checks(['Phone call', 'WhatsApp message', 'SMS', 'Email', 'Reports may be sent on WhatsApp', 'Reminders for appointments'], 3),
  sp(140),
  callout('For teens (under 18)', 'A parent or guardian fills in and signs the consent page. Add their name and phone number above as emergency contact.', { color: col.LP, fill: col.LT }),
]);

// ---- 4  Health history
pages.push([
  titleBar('03', 'Health history', 'Your story, in your own words. Tick what applies', 'PATIENT FILLS'), sp(120),
  H('Periods', { before: 20 }),
  fields([{ l: 'AGE AT FIRST PERIOD', w: 2 }, { l: 'USUAL CYCLE LENGTH (days)', w: 2 }, { l: 'BLEEDING DAYS', w: 2 }, { l: 'LAST PERIOD (LMP)', w: 2 }]),
  checks(['Regular', 'Irregular', 'Missed for 3 months or more', 'Heavy bleeding', 'Painful periods', 'Spotting between periods'], 3),
  H('Pregnancy and fertility'),
  fields([{ l: 'PREGNANCIES', w: 1 }, { l: 'LIVE BIRTHS', w: 1 }, { l: 'MISCARRIAGES', w: 1 }, { l: 'TRYING TO CONCEIVE SINCE', w: 2 }, { l: 'CONTRACEPTION USED', w: 2 }]),
  checks(['I want to get pregnant now', 'Pregnancy later', 'Not planning pregnancy', 'Earlier fertility treatment taken'], 2),
  H('Medical conditions (me)'),
  checks(['Thyroid problem', 'Diabetes / high sugar', 'High blood pressure', 'High cholesterol', 'Fatty liver', 'Sleep apnoea / snoring', 'Depression / anxiety', 'Anaemia', 'Asthma / allergies'], 3),
  fields([{ l: 'OTHER CONDITIONS, SURGERIES, HOSPITAL STAYS', w: 1 }]),
  H('Family history'),
  checks(['PCOD / PCOS', 'Diabetes', 'Thyroid problem', 'High blood pressure', 'Heart disease', 'Cancer (type: ______)'], 3),
  H('Allergies and current medicines'),
  fields([{ l: 'ALLERGIES (medicines, food, other)', w: 1 }]),
  fields([{ l: 'MEDICINES AND SUPPLEMENTS I TAKE NOW', w: 1 }]),
  H('Daily life'),
  fields([{ l: 'DIET (veg / non-veg / egg / other)', w: 3 }, { l: 'MEALS PER DAY', w: 1.2 }, { l: 'EXERCISE (type, minutes per week)', w: 3 }]),
  fields([{ l: 'SLEEP (hours per night)', w: 2 }, { l: 'WATER (glasses per day)', w: 2 }, { l: 'STRESS LEVEL (0-10)', w: 2 }, { l: 'SMOKING / ALCOHOL / TOBACCO', w: 3 }]),
]);

// ---- 5  Symptoms and goals
{
  const sy = ['Irregular or missed periods', 'Painful or heavy periods', 'Acne or oily skin', 'Extra hair on face or body', 'Hair thinning or hair fall', 'Dark velvety skin patches (neck, underarms)', 'Weight gain, hard to lose weight', 'Sugar cravings, tired after meals', 'Tiredness, poor sleep, snoring', 'Low mood, anxiety, mood swings', 'Trouble getting pregnant'];
  const w = [5000, 1376, 1376, 1377, 1377];
  const head = ['Symptom', 'None', 'Mild', 'Moderate', 'Severe'].map((h, i) => cell(P(h, { size: 7.8, bold: true, color: col.W, after: 0, align: i ? AlignmentType.CENTER : AlignmentType.LEFT }), { w: w[i], fill: col.D1, borders: gap(col.W, 8), margins: { top: 70, bottom: 70, left: 100, right: 60 } }));
  const rows = sy.map((s, k) => [cell(P(s, { size: 8.6, after: 0 }), { w: w[0], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4), margins: { top: 90, bottom: 90, left: 110, right: 60 } }),
    ...[1, 2, 3, 4].map((x) => cell(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: '○', font: SYM, size: 22, color: col.PK })] }), { w: w[x], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) }))]);
  pages.push([
    titleBar('04', 'My symptoms and goals', 'Tick one circle for each line. Be honest, there are no wrong answers', 'PATIENT FILLS'), sp(140),
    H('How much does it bother me?', { before: 20 }), table([head, ...rows], w), sp(60),
    fields([{ l: 'SINCE WHEN HAVE I HAD THESE SYMPTOMS?', w: 3 }, { l: 'WHAT MAKES IT BETTER / WORSE?', w: 3 }]),
    H('What I want from treatment'),
    checks(['Regular periods', 'Clearer skin', 'Less unwanted hair', 'Stop hair fall', 'Lose weight', 'Steady energy and mood', 'Better sleep', 'Plan a pregnancy', 'Protect my long-term health'], 3),
    H('What matters most to me'),
    fields([{ l: 'MY TOP 3 GOALS (in my own words)', w: 1 }], { h: 340 }), fields([{ l: '1.', w: 1 }], { h: 120 }), fields([{ l: '2.', w: 1 }], { h: 120 }), fields([{ l: '3.', w: 1 }], { h: 120 }),
    H('My worries and questions for the doctor'),
    fields([{ l: '', w: 1 }], { h: 340 }), fields([{ l: '', w: 1 }], { h: 340 }),
  ]);
}

// ---- 6  Doctor's assessment
{
  const meas = ['Weight (kg)', 'BMI', 'Waist (cm)', 'Hip (cm)', 'Blood pressure', 'Pulse', 'Hirsutism score (mFG)', 'Acne grade', 'Skin and hair analysis', 'Body composition (fat %, muscle)'];
  pages.push([
    titleBar('05', 'Doctor’s assessment', 'Measurements, diagnosis and classification', 'DOCTOR FILLS'), sp(120),
    H('Measurements', { before: 20 }),
    grid(['Measure', 'Baseline', 'Month 1', 'Month 3', 'Month 6', 'Target'], [3000, 1500, 1500, 1500, 1500, CW - 9000], meas.length, { labels: meas, rowH: 380 }),
    H('Rotterdam criteria: any 2 of 3'),
    checks(['Irregular or no ovulation', 'High androgens (signs or blood tests)', 'Polycystic ovaries on ultrasound'], 3),
    H('Other causes ruled out'),
    checks(['Thyroid disorder', 'High prolactin', 'Non-classic CAH (17-OHP)', 'Cushing’s / adrenal cause', 'Other: ____________'], 3),
    H('Classification'),
    img(IMGD('spectrum'), 330, { after: 40 }),
    checks(['PCOM (scan finding only)', 'PCOD (mild imbalance)', 'PCOS / PMOS (whole-body condition)'], 3),
    H('Doctor’s notes'),
    fields([{ l: 'DIAGNOSIS AND KEY FINDINGS', w: 1 }], { h: 340 }), fields([{ l: '', w: 1 }], { h: 340 }),
    fields([{ l: 'DOCTOR NAME AND SIGNATURE', w: 3 }, { l: 'DATE', w: 1 }]),
  ]);
}

// ---- 7  Investigations
{
  const L = [
    { group: 'HORMONES', color: col.P }, 'LH and FSH (LH-FSH ratio)', 'AMH', 'TSH', 'Prolactin', 'Free / total testosterone', 'SHBG and FAI', 'DHEA-S', '17-OH progesterone / androstenedione', 'Cortisol (if advised)',
    { group: 'SUGAR, FATS AND INFLAMMATION', color: col.MID }, 'Fasting glucose and insulin', 'HbA1c', 'OGTT (2-hour) / HOMA-IR', 'Cholesterol: total, LDL, HDL', 'Triglycerides', 'hs-CRP',
    { group: 'VITAMINS, IRON AND ORGANS', color: col.LP }, 'Vitamin D3', 'Vitamin B12 and folate', 'Ferritin / iron panel', 'Liver tests (SGOT, SGPT)',
    { group: 'SCANS AND OTHER TESTS', color: col.D1 }, 'Pelvic ultrasound (ovaries, lining)', 'ECG / ECHO (if needed)', 'Sleep apnoea screening',
  ];
  pages.push([
    titleBar('06', 'Investigations tracker', 'Write the date and the result. Compare at each review', 'DOCTOR FILLS'), sp(110),
    grid(['Test', 'Date', 'Result', 'Date (review)', 'Result (review)', 'Remarks'], [3300, 1100, 1300, 1100, 1300, CW - 8100], L.length, { labels: L, rowH: 395 }),
    sp(70), P('Lab reference ranges differ between labs. Your doctor will explain each result and mark it against the range printed on your report.', { size: 7.6, color: col.GREY, italics: true, after: 0 }),
  ]);
}

// ---- 8  Treatment plan
{
  const wr = [2500, 3600, CW - 6100];
  const teamRows = [['Gynecology', 'Periods, fertility, womb'], ['Endocrinology', 'Hormones, insulin, thyroid'], ['Dermatology', 'Skin, hair, acne'], ['Diet and nutrition', 'Eating roadmap'], ['Ayurveda (supportive)', 'As advised'], ['Counselling', 'Mood, stress, sleep']];
  const tr = [[...['Specialty', 'Focus', 'Doctor / start date'].map((h, i) => cell(P(h, { size: 7.8, bold: true, color: col.W, after: 0 }), { w: wr[i], fill: col.D1, borders: gap(col.W, 8) }))],
    ...teamRows.map((r, k) => [cell(P(r[0], { size: 8.6, bold: true, color: col.P, after: 0 }), { w: wr[0], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4), margins: { top: 90, bottom: 90, left: 110, right: 60 } }), cell(P(r[1], { size: 8.4, after: 0, color: col.GREY }), { w: wr[1], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) }), cell(P('', { after: 0 }), { w: wr[2], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) })])];
  pages.push([
    titleBar('07', 'My treatment plan', 'Chosen together by you and your doctors', 'DOCTOR FILLS'), sp(120),
    H('Programme', { before: 20 }),
    checks(['3-month programme', '6-month programme', 'Consultation only', 'Fertility plan'], 4),
    fields([{ l: 'START DATE', w: 2 }, { l: 'REVIEW DATES', w: 4 }, { l: 'PROGRAMME COORDINATOR', w: 3 }]),
    H('My care team'), table(tr, wr),
    H('Treatment components'),
    P('**Lifestyle**', { size: 8.6, color: col.P, after: 20 }),
    checks(['Eating roadmap (5 phases)', 'Exercise plan', 'Sleep and stress plan', 'Weight target'], 4),
    P('**Medical**', { size: 8.6, color: col.P, after: 20, before: 80 }),
    checks(['Hormonal pills / progestin', 'Metformin / insulin sensitiser', 'Anti-androgen medicines', 'Ovulation induction', 'Weight-loss medicine', 'Vitamins and supplements', 'Skin treatment (topical)', 'Other: ________'], 4),
    P('**Advanced and supportive (only as advised)**', { size: 8.6, color: col.P, after: 20, before: 80 }),
    checks(['HBOT', 'Ozone therapy', 'Laser hair reduction', 'Chemical peel / facials', 'Microneedling / PRP', 'Body contouring', 'Pelvic chair', 'Ayurveda therapies'], 4),
    P('**Fertility**', { size: 8.6, color: col.P, after: 20, before: 80 }),
    checks(['Cycle and ovulation tracking', 'IUI', 'IVF / ICSI', 'LOD'], 4),
    H('Plan notes and special instructions'),
    fields([{ l: '', w: 1 }], { h: 340 }), fields([{ l: '', w: 1 }], { h: 340 }),
  ]);
}

// ---- 9  Medicines
pages.push([
  titleBar('08', 'Medicines and supplements', 'Doctor writes the dose. I tick when I take it as advised', 'BOTH'), sp(120),
  grid(['Medicine / supplement', 'Dose and timing', 'Why', 'Start', 'Stop', 'Prescribed by'], [2700, 2100, 1800, 1000, 1000, CW - 8600], 18, { rowH: 640 }),
  sp(110),
  callout('Remember', 'Take medicines and supplements only as your doctor advises. Do not start, stop or change anything without asking. Tell your doctor about any other medicine you take, including Ayurvedic and over-the-counter ones.', { color: col.LP, fill: col.LT, size: 8.4 }),
]);

// ---- 10  Eating roadmap
{
  const ph = [['Phase 1', 'Reset', 'Cut refined sugar, sweeteners, packaged food, extra seed oils. Add cruciferous vegetables. Fibre 30 g/day. Night gap 9-10 h.'], ['Phase 2', 'Calm inflammation', 'Mediterranean style: olive oil, fatty fish or flaxseed, berries, turmeric, cinnamon. Night gap 11-12 h.'], ['Phase 3', 'Gut health', 'Fibre 35 g or more: dals, chana, seeds. Gut-healing drinks. Review at end of month 3.'], ['Phase 4', 'Fine-tune', 'Vegetables first, then protein, carbs last. No late-night eating. Ancient grains. Night gap 12-14 h.'], ['Phase 5', 'Keep going', '80/20 rule. Re-introduce foods one at a time. 25-30 g protein per meal.']];
  const wr = [1100, 1800, 4300, 1700, CW - 8900]; const fills = ['E5849A', col.MID, col.P, col.LP, '4B3C70'];
  const head = ['Phase', 'Focus', 'What I do', 'Planned dates', 'Done'].map((h, i) => cell(P(h, { size: 7.8, bold: true, color: col.W, after: 0, align: i === 2 ? AlignmentType.LEFT : AlignmentType.CENTER }), { w: wr[i], fill: col.D1, borders: gap(col.W, 8) }));
  const rows = ph.map((r, k) => [
    cell(P(r[0], { size: 8.6, bold: true, color: col.W, after: 0, align: AlignmentType.CENTER }), { w: wr[0], fill: fills[k], borders: gap() }),
    cell(P(r[1], { size: 8.6, bold: true, color: col.D1, after: 0, align: AlignmentType.CENTER }), { w: wr[1], fill: k % 2 ? col.LT : col.PT, borders: gap() }),
    cell(P(r[2], { size: 8, after: 0, line: 255 }), { w: wr[2], fill: k % 2 ? col.LT : col.PT, borders: gap(), margins: { top: 90, bottom: 90, left: 110, right: 80 } }),
    cell(P('', { after: 0 }), { w: wr[3], fill: col.W, borders: gap(col.PK, 6) }),
    cell(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: '☐', font: SYM, size: 26, color: col.P })] }), { w: wr[4], fill: col.W, borders: gap(col.PK, 6) }),
  ]);
  const wm = [2300, 1300, 4400, CW - 8000];
  const meals = ['Early morning', 'Breakfast', 'Mid-morning', 'Lunch', 'Evening snack', 'Dinner', 'Water (glasses)'];
  pages.push([
    titleBar('09', 'Eating roadmap', 'Track your 5 phases. Your dietitian guides each step', 'BOTH'), sp(110),
    img(IMGD('roadmap'), 380, { after: 60 }),
    table([head, ...rows], wr),
    H('A day on my plate'),
    table([wm.map((_, i) => 0), ].length ? [[...['Meal', 'Time', 'What I plan to eat', 'Notes'].map((h, i) => cell(P(h, { size: 7.8, bold: true, color: col.W, after: 0 }), { w: wm[i], fill: col.D1, borders: gap(col.W, 8) }))], ...meals.map((m, k) => [cell(P(m, { size: 8.4, bold: true, color: col.P, after: 0 }), { w: wm[0], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) }), ...wm.slice(1).map((w) => cell(P('', { after: 0 }), { w, fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) }))])] : [], wm, { rowH: 440 }),
    sp(90), P('Plate reminder: half vegetables and salad, a quarter protein, a quarter whole grains, plus a spoon of healthy fat.', { size: 8, color: col.GREY, italics: true, after: 0 }),
  ]);
}

// ---- 11  Move, sleep, calm
{
  const wd = [1100, 3000, 1100, 1100, 1300, 1300, CW - 8900];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const wk = (n) => [P(`Week ${n}`, { size: 9, bold: true, color: col.P, after: 40, before: 60 }), grid(['Day', 'Activity and minutes', 'Steps', 'Strength (Y/N)', 'Sleep (hours)', 'Stress (0-10)', 'Mood / notes'], wd, 7, { labels: days, boldFirst: true, rowH: 340 })];
  pages.push([
    titleBar('10', 'Move, sleep, calm log', 'Small steps, written down. Aim: 150 minutes a week plus 2 strength days', 'PATIENT FILLS'), sp(100),
    img(IMGD('week'), 360, { after: 30 }),
    ...wk(1), ...wk(2), ...wk(3),
    sp(70), P('Tip: a 10-minute walk after meals helps sugar levels. Sleep 7 to 9 hours at the same time each night.', { size: 8, color: col.GREY, italics: true, after: 0 }),
  ]);
}

// ---- 12  Cycle diary
{
  const w = [700, 1350, 1350, 900, 1000, 800, 800, 700, 700, 700, CW - 9000];
  pages.push([
    titleBar('11', 'Cycle and symptom diary', 'Write the first day of every period. Rate symptoms 0 (none) to 3 (severe)', 'PATIENT FILLS'), sp(100),
    img(IMGD('strips'), 400, { after: 50 }),
    grid(['#', 'Start date', 'End date', 'Cycle days', 'Flow L / M / H', 'Pain 0-10', 'Clots Y/N', 'Acne', 'Hair', 'Mood', 'Weight / notes'], w, 15, { rowH: 560, centerFirst: true }),
    sp(70), P('Typical: a period every 21 to 35 days, lasting 2 to 7 days. See a doctor if there is no period for 3 months, or bleeding soaks a pad every hour for 2 hours.', { size: 8, color: col.GREY, italics: true, after: 0 }),
  ]);
}

// ---- 13  Visit log
pages.push([
  titleBar('12', 'Visit and follow-up log', 'One line for every visit, call or message', 'DOCTOR FILLS'), sp(110),
  grid(['Date', 'With (doctor / team)', 'What we discussed', 'Changes to my plan', 'Next visit'], [1200, 2000, 3500, 2500, CW - 9200], 14, { rowH: 780 }),
]);

// ---- 14  Progress review
{
  const scale = ['Regularity of periods', 'Acne', 'Unwanted hair growth', 'Hair fall', 'Energy', 'Mood', 'Sleep quality', 'Sugar cravings and appetite', 'Confidence'];
  const sc = [{ group: 'HOW I FEEL (0 = very bad, 10 = very good)', color: col.P }, ...scale, { group: 'NUMBERS', color: col.LP }, 'Weight (kg)', 'Waist (cm)', 'Blood pressure'];
  const wp = Math.round(CW / 3);
  const photo = (t) => cell([P(t, { size: 8, bold: true, color: col.P, align: AlignmentType.CENTER, after: 0, line: 260 }), P('Attach photo (with consent)', { size: 7, color: col.GREY, align: AlignmentType.CENTER, after: 0 }), sp(1500)], { w: wp, fill: col.LT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 90, bottom: 60, left: 80, right: 80 } });
  pages.push([
    titleBar('13', 'Progress review', 'Compare yourself with where you started', 'BOTH'), sp(110),
    grid(['Measure', 'Baseline', 'Month 1', 'Month 3', 'Month 6'], [3800, 1700, 1700, 1700, CW - 8900], sc.length, { labels: sc, rowH: 380 }),
    H('Progress photos (optional)'),
    table([[photo('Baseline'), photo('Month 3'), cell([P('Month 6', { size: 8, bold: true, color: col.P, align: AlignmentType.CENTER, after: 0, line: 260 }), P('Attach photo (with consent)', { size: 7, color: col.GREY, align: AlignmentType.CENTER, after: 0 }), sp(1500)], { w: CW - 2 * wp, fill: col.LT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 90, bottom: 60, left: 80, right: 80 } })]], [wp, wp, CW - 2 * wp]),
    H('My wins so far'), fields([{ l: '', w: 1 }], { h: 300 }), fields([{ l: '', w: 1 }], { h: 300 }),
    H('My goals for the next 3 months'), fields([{ l: '', w: 1 }], { h: 300 }), fields([{ l: '', w: 1 }], { h: 300 }),
  ]);
}

// ---- 15  Consents and documents
{
  const w = [4600, 1200, 1700, CW - 7500];
  const docs = ['Consent for treatment and programme', 'Consent for progress photographs', 'Consent for advanced / supportive therapies (HBOT, ozone, laser)', 'Consent to share reports by WhatsApp or email', 'Privacy and confidentiality notice read', 'Programme enrolment form'];
  const head = ['Consent / form', 'Done', 'Date', 'Patient or guardian signature'].map((h, i) => cell(P(h, { size: 7.8, bold: true, color: col.W, after: 0, align: i ? AlignmentType.CENTER : AlignmentType.LEFT }), { w: w[i], fill: col.D1, borders: gap(col.W, 8) }));
  const rows = docs.map((d, k) => [cell(P(d, { size: 8.4, after: 0, line: 250 }), { w: w[0], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4), margins: { top: 100, bottom: 100, left: 110, right: 80 } }),
    cell(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: '☐', font: SYM, size: 26, color: col.P })] }), { w: w[1], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) }),
    cell(P('', { after: 0 }), { w: w[2], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) }), cell(P('', { after: 0 }), { w: w[3], fill: k % 2 ? col.W : col.PKT, borders: gap(col.PK, 4) })]);
  pages.push([
    titleBar('14', 'Consents and documents', 'Keep every paper in one place', 'BOTH'), sp(120),
    table([head, ...rows], w),
    H('Reports and papers in my file'),
    checks(['Blood reports', 'Ultrasound reports', 'Prescriptions', 'Diet chart', 'Exercise plan', 'Receipts and invoices', 'Other hospital records', 'Insurance papers', 'Discharge summaries'], 3),
    H('Signatures'),
    fields([{ l: 'PATIENT / GUARDIAN NAME AND SIGNATURE', w: 3 }, { l: 'DATE', w: 1 }], { h: 560 }),
    fields([{ l: 'TREATING DOCTOR NAME AND SIGNATURE', w: 3 }, { l: 'DATE', w: 1 }], { h: 560 }),
    sp(120),
    callout('Pocket for loose papers', 'Slip printed reports, prescriptions and receipts behind this page, or take a clear photo and save it on your phone in a folder named "My PCOD file".', { color: col.LP, fill: col.LT, size: 8.4 }),
  ]);
}

// ---- 16  Back: contacts + warning signs
function back() {
  const link = (text, url, size, color) => new Paragraph({ spacing: { after: 30, line: 380 }, children: [new ExternalHyperlink({ link: url, children: [new TextRun({ text, font: F(true), size: size * 2, color, underline: {} })] })] });
  const wL = 6200, wR = CW - wL;
  const cta = table([[
    cell([P('Call or WhatsApp us', { size: 10, color: 'F9DDEC', after: 50 }), link('+91 82230 87999', 'tel:+918223087999', 22, col.W),
      new Paragraph({ spacing: { after: 0 }, children: [new ExternalHyperlink({ link: 'https://wa.me/918223087999', children: [new TextRun({ text: 'WhatsApp', font: F(true), size: 18, color: col.PK, underline: {} })] }), new TextRun({ text: '  |  ', font: F(true), size: 18, color: col.PK }), new ExternalHyperlink({ link: 'tel:+918223087999', children: [new TextRun({ text: 'Call', font: F(true), size: 18, color: col.PK, underline: {} })] })] })], { w: wL, fill: col.P, margins: { top: 260, bottom: 260, left: 320, right: 100 } }),
    cell([img(path.join(ROOT, 'assets/img/qr_whatsapp.png'), 100, { after: 0 }), P('Scan to chat on WhatsApp', { size: 7, color: col.W, align: AlignmentType.CENTER, after: 0, before: 40 })], { w: wR, fill: col.P, margins: { top: 180, bottom: 160, left: 60, right: 240 } }),
  ]], [wL, wR]);
  const w2 = Math.round(CW / 2);
  const urgent = cell([P('Get help urgently if you have', { size: 10, bold: true, color: col.R, after: 40 }),
    ...['Severe lower tummy pain or fainting', 'Very heavy bleeding (a pad soaked every hour for 2 hours)', 'Chest pain or breathlessness', 'Sudden deepening of voice with rapid hair growth', 'Thoughts of harming yourself (Tele-MANAS 14416, 24x7)'].map((t) => new Paragraph({ numbering: { reference: 'bulr', level: 0 }, spacing: { after: 40, line: 270 }, children: runs(t, { size: 8.6 }) }))], { w: w2, fill: col.RT, borders: { top: none, bottom: none, right: none, left: { style: BorderStyle.SINGLE, size: 36, color: col.R } }, v: VerticalAlign.TOP, margins: { top: 140, bottom: 120, left: 220, right: 140 } });
  const visit = cell([P('Visit us', { size: 10, bold: true, color: col.P, after: 40 }), P('**PCOD Xpert by Hope**', { size: 9, after: 20 }), ...['Sahaj Hospital Campus', '15/2 South Tukoganj, Near Manas Bhavan,', 'Behind Hotel Surya, Indore,', 'Madhya Pradesh 452005'].map((l) => P(l, { size: 8.8, after: 10 }))], { w: CW - w2, fill: col.PKT, borders: NB, v: VerticalAlign.TOP, margins: { top: 140, bottom: 120, left: 240, right: 140 } });
  const bg = new Paragraph({ spacing: { after: 0, line: 20, lineRule: 'exact' }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(path.join(ROOT, 'assets/img/pf_backbg.png')), transformation: { width: 793.7, height: 1122.5 }, altText: { title: 'bg', description: 'bg', name: 'bg' }, floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 }, behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } })] });
  return [
    bg,
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(path.join(ROOT, 'assets/img/logo.png')), transformation: { width: 250, height: 98 }, altText: { title: 'logo', description: 'PCOD Xpert logo', name: 'logo' } })] }),
    titleBar('15', 'Contacts and warning signs', 'Keep this page easy to find', 'BOTH'), sp(160),
    cta, sp(160), table([[urgent, visit]], [w2, CW - w2]), sp(160),
    H('Between visits', { before: 40 }),
    table([[
      cell([P('**Questions about your plan?** Message the programme coordinator on WhatsApp. Include your name and patient ID.', { size: 8.6, after: 0 })], { w: Math.round(CW / 3), fill: col.PT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 110, bottom: 110, left: 160, right: 120 } }),
      cell([P('**Before every visit:** update your diary, log and medicine list, and bring this file with all your reports.', { size: 8.6, after: 0 })], { w: Math.round(CW / 3), fill: col.LT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 110, bottom: 110, left: 160, right: 120 } }),
      cell([P('**Running low on medicines?** Call before they finish, not after. Never stop a medicine suddenly on your own.', { size: 8.6, after: 0 })], { w: CW - 2 * Math.round(CW / 3), fill: col.PKT, borders: gap(), v: VerticalAlign.TOP, margins: { top: 110, bottom: 110, left: 160, right: 120 } }),
    ]], [Math.round(CW / 3), Math.round(CW / 3), CW - 2 * Math.round(CW / 3)]),
    sp(200),
    table([[cell([P('CONFIDENTIALITY', { size: 7.5, bold: true, color: col.LP, after: 30, spacing: 30 }), P('This file contains your private health information and belongs to you. PCOD Xpert by Hope uses it only to look after you and shares it only with your treating team. Please keep it safe and share it only with people you trust. This file is a record and a guide. It is not a substitute for professional medical advice. Individual results vary.', { size: 7.4, color: col.GREY, after: 0, line: 250 })], { w: CW, fill: col.LT, margins: { top: 130, bottom: 130, left: 240, right: 220 } })]], [CW]),
  ];
}

// ======================================================================  DOCUMENT
const cover = (() => {
  const wA = 4750, wB = 4756;
  const f = (l, w) => cell([P(l, { size: 7, bold: true, color: col.GREY, after: 0, line: 220, spacing: 10 }), sp(330)], { w, borders: { top: none, left: none, right: { style: BorderStyle.SINGLE, size: 24, color: col.W }, bottom: { style: BorderStyle.SINGLE, size: 6, color: col.PK } }, v: VerticalAlign.TOP, margins: { top: 40, bottom: 20, left: 100, right: 40 } });
  const t = table([
    [f('PATIENT NAME', wA), f('PATIENT ID', wB)],
    [f('DATE OF BIRTH / AGE', wA), f('MOBILE / WHATSAPP', wB)],
    [f('PRIMARY DOCTOR', wA), f('PROGRAMME  (3-month / 6-month)  AND START DATE', wB)],
    [f('EMERGENCY CONTACT (NAME AND PHONE)', wA), f('KNOWN ALLERGIES / CONDITIONS', wB)],
  ], [wA, wB]);
  const bg = new Paragraph({ spacing: { after: 0, line: 20, lineRule: 'exact' }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(path.join(ROOT, 'assets/img/pf_cover.png')), transformation: { width: 793.7, height: 1122.5 }, altText: { title: 'Cover', description: 'My PCOD Xpert Patient File cover', name: 'cover' }, floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 }, behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } })] });
  return [bg, new Paragraph({ spacing: { before: 0, after: 0, line: 10000, lineRule: 'exact' }, children: [new TextRun({ text: '', size: 2 })] }), t];
})();

const bul = (c) => ({ levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 210 } }, run: { color: c, font: F(true), size: 20 } } }] });
const header = new Header({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: CW }], spacing: { after: 0 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: col.PK, space: 6 } },
  children: [new ImageRun({ type: 'png', data: fs.readFileSync(path.join(ROOT, 'assets/img/logo.png')), transformation: { width: 96, height: 38 }, altText: { title: 'logo', description: 'logo', name: 'logo' } }),
    new TextRun({ children: ['\t', 'My Patient File'], font: F(true), size: 16, color: col.GREY })],
})] });
const footer = new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: CW }], spacing: { before: 0, after: 0 }, border: { top: { style: BorderStyle.SINGLE, size: 6, color: col.PK, space: 6 } },
  children: [new TextRun({ text: 'PCOD Xpert by Hope  |  +91 82230 87999  |  Confidential patient record', font: F(false), size: 14, color: col.GREY }), new TextRun({ children: ['\t', PageNumber.CURRENT], font: F(true), size: 16, color: col.P })],
})] });
const emptyFooter = new Footer({ children: [new Paragraph({ children: [] })] });
const pp = (m) => ({ page: { size: { width: PAGE_W, height: PAGE_H }, margin: m } });
const body = [];
pages.forEach((pg, i) => { if (i) body.push(pageStart()); body.push(...pg); });

const doc = new Document({
  creator: 'PCOD Xpert by Hope', title: 'My PCOD Xpert Patient File', description: 'Patient file',
  fonts: [{ name: REG, data: fs.readFileSync(path.join(ROOT, 'assets/fonts/Poppins_400Regular.ttf')) }, { name: SEMI, data: fs.readFileSync(path.join(ROOT, 'assets/fonts/Poppins_600SemiBold.ttf')) }],
  styles: { default: { document: { run: { font: F(false), size: 18, color: col.INK } } } },
  numbering: { config: [{ ...bul(col.R), reference: 'bulr' }] },
  sections: [
    { properties: pp({ top: 0, right: 1200, bottom: 0, left: 1200, header: 0, footer: 0 }), footers: { default: emptyFooter }, children: cover },
    { properties: pp({ top: MT, right: MX, bottom: MB, left: MX, header: 420, footer: 380 }), headers: { default: header }, footers: { default: footer }, children: body },
    { properties: pp({ top: 900, right: MX, bottom: 500, left: MX, header: 0, footer: 0 }), headers: { default: new Header({ children: [new Paragraph({ children: [] })] }) }, footers: { default: emptyFooter }, children: back() },
  ],
});
const out = path.join(ROOT, 'output', 'PCOD_Xpert_Patient_File.docx');
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('wrote', out, (buf.length / 1e6).toFixed(1) + ' MB'); });
