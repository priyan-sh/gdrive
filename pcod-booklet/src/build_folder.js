// PCOD Xpert patient FOLDER artwork (A3 sheet folding to A4: outside = back | front, inside = pages | pocket)
// outputs (in ../output):
//   PCOD_Xpert_Patient_Folder_PRINT_A3_bleed.pdf       2 pages, 426x303 mm (3 mm bleed), no marks
//   PCOD_Xpert_Patient_Folder_PREVIEW_with_guides.pdf  2 pages, trim/fold/die-cut guides + crop marks
//   PCOD_Xpert_Patient_Folder_4_panels_A4.pdf          4 pages, A4, one per panel (front, inside L, inside R, back)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'assets/img', f)).toString('base64');
const LOGO = b64('logo.png'), QR = b64('qr_whatsapp.png');
const FONT = (n) => 'data:font/ttf;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts', n)).toString('base64');

const C = { P: '#A62683', LP: '#624E88', PK: '#F29BAA', PKT: '#FDEBEF', PT: '#F7E4F0', LT: '#ECE8F3', INK: '#2A1F33', GREY: '#6B6275', D1: '#3D3260', MID: '#D8629E', R: '#D64545', RT: '#FBE3E3', G: '#3A9D6E' };

const CSS = `
@font-face{font-family:'PF';font-weight:400;src:url(${FONT('Poppins_400Regular.ttf')})}
@font-face{font-family:'PF';font-weight:500;src:url(${FONT('Poppins_500Medium.ttf')})}
@font-face{font-family:'PF';font-weight:600;src:url(${FONT('Poppins_600SemiBold.ttf')})}
@font-face{font-family:'PF';font-weight:700;src:url(${FONT('Poppins_700Bold.ttf')})}
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'PF',sans-serif;color:${C.INK};-webkit-print-color-adjust:exact;print-color-adjust:exact}
a{color:inherit}
.panel{position:relative;width:210mm;height:297mm}
.abs{position:absolute}
.pad{position:absolute;left:14mm;right:14mm;top:14mm}
/* title bar */
.tb{display:flex;height:16mm;border-radius:2mm;overflow:hidden}
.tb .n{width:14mm;background:${C.D1};color:#fff;font-weight:700;font-size:13pt;display:flex;align-items:center;justify-content:center}
.tb .t{flex:1;background:${C.P};color:#fff;padding:0 5mm;display:flex;flex-direction:column;justify-content:center}
.tb .t b{font-size:13pt;font-weight:700;line-height:1.15}
.tb .t span{font-size:7pt;color:#F5D6E8}
.tb .w{width:34mm;display:flex;align-items:center;justify-content:center;font-size:6.5pt;font-weight:700;letter-spacing:.25mm;color:#fff;background:${C.MID};text-align:center;padding:0 2mm}
h4{font-size:9.5pt;font-weight:700;color:${C.P};border-left:1.2mm solid ${C.PK};padding-left:2.5mm;margin:6mm 0 2.5mm;line-height:1.2}
.row{display:grid;align-items:center;border-bottom:.2mm solid ${C.PK};min-height:9.4mm;font-size:8.2pt}
.row.big{min-height:11.2mm;font-size:8.6pt}
.cbl.big{padding:3mm 2.5mm}
.row.hd{background:${C.D1};color:#fff;font-weight:700;font-size:7pt;min-height:7.5mm;border:none}
.row>div{padding:1.3mm 2.5mm}
.row.alt{background:${C.PKT}}
.cb{display:inline-block;width:4mm;height:4mm;border:.4mm solid ${C.P};border-radius:.8mm;background:#fff;vertical-align:middle}
.cbl{display:flex;align-items:center;gap:2.5mm;font-size:8.4pt;padding:1.6mm 2.5mm}
.fld{border-bottom:.3mm solid ${C.PK};height:10.5mm;position:relative}
.fld span{position:absolute;left:0;top:.6mm;font-size:6pt;font-weight:700;letter-spacing:.15mm;color:${C.GREY}}
.note{border-left:1.4mm solid ${C.LP};background:${C.LT};padding:3mm 4mm;font-size:7.8pt;line-height:1.5;border-radius:0 1.5mm 1.5mm 0}
.chip{display:inline-block;background:#fff;border-radius:99mm;padding:2mm 4.5mm;font-size:8pt;font-weight:600;box-shadow:0 .6mm 2mm rgba(166,38,131,.22)}
.chip i{display:inline-block;width:2mm;height:2mm;border-radius:50%;margin-right:2mm;vertical-align:middle}
`;

// ---------- shared pieces
const wave = (W, H = 40, y0 = 11) => `<svg width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="g${W}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.P}"/><stop offset="1" stop-color="${C.LP}"/></linearGradient></defs><path d="M0,${y0} C${W * 0.2},${y0 - 12} ${W * 0.4},${y0 + 8} ${W * 0.62},${y0 - 2} S${W * 0.86},${y0 - 10} ${W},${y0 - 3} L${W},${H} L0,${H} Z" fill="url(#g${W})"/></svg>`;
const ring = (cx, cy) => { let d = ''; const n = 22; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; d += `<circle cx="${(cx + 34 * Math.cos(a)).toFixed(1)}" cy="${(cy + 21 * Math.sin(a)).toFixed(1)}" r="${i % 3 ? 1.9 : 2.7}" fill="${C.PK}"/>`; } return d; };
const fld = (l, w) => `<div class="fld" ${w ? `style="grid-column:span ${w}"` : ''}><span>${l}</span></div>`;
const tb = (n, t, s, w) => `<div class="tb"><div class="n">${n}</div><div class="t"><b>${t}</b><span>${s}</span></div><div class="w">${w}</div></div>`;

// ---------- 1  FRONT COVER
const front = (band) => `<div class="panel">
 <svg class="abs" style="left:-10mm;top:-10mm" width="240mm" height="327mm" viewBox="-10 -10 240 327">
   <circle cx="200" cy="24" r="92" fill="${C.PKT}"/><circle cx="44" cy="214" r="46" fill="${C.PT}" opacity=".65"/>
   <ellipse cx="160" cy="48" rx="38" ry="24" fill="none" stroke="${C.PK}" stroke-width=".9" stroke-dasharray=".2 3" stroke-linecap="round"/>${ring(160, 48)}
 </svg>
 <img class="abs" src="${LOGO}" style="left:13mm;top:13mm;width:104mm">
 <div class="abs" style="left:16mm;top:76mm;background:${C.PK};color:#fff;font-weight:700;font-size:8.5pt;letter-spacing:.3mm;padding:2.2mm 6mm;border-radius:99mm">PATIENT FOLDER</div>
 <div class="abs" style="left:16mm;top:92mm;font-size:23pt;font-weight:600;color:${C.LP};line-height:1.2">My PCOD Xpert</div>
 <div class="abs" style="left:15mm;top:106mm;font-size:48pt;font-weight:700;color:${C.P};line-height:1.1;letter-spacing:-.4mm">Patient Folder</div>
 <div class="abs" style="left:16mm;top:132mm;width:150mm;font-size:10.5pt;color:${C.GREY};line-height:1.5">PCOD &nbsp;|&nbsp; PCOS &nbsp;|&nbsp; PMOS &nbsp;&middot;&nbsp; Care from a multidisciplinary team under one roof</div>
 <div class="abs" style="left:12mm;top:156mm;width:186mm;height:68mm;background:#fff;border:.5mm solid ${C.PK};border-radius:5mm;box-shadow:0 1.5mm 5mm rgba(166,38,131,.18);overflow:hidden">
   <div style="background:${C.P};color:#fff;font-weight:700;font-size:8pt;letter-spacing:.35mm;padding:3mm 6mm">THIS FOLDER BELONGS TO</div>
   <div style="padding:2mm 6mm 0;display:grid;grid-template-columns:1fr 1fr;column-gap:6mm;row-gap:.5mm">
     ${fld('PATIENT NAME', 2)}${fld('PATIENT ID')}${fld('DATE OF REGISTRATION')}${fld('PRIMARY DOCTOR')}${fld('PROGRAMME  (3-month / 6-month)')}${fld('MOBILE / WHATSAPP')}${fld('KNOWN ALLERGIES')}
   </div>
 </div>
 <div class="abs" style="left:12mm;top:236mm;width:186mm;display:flex;gap:3mm;flex-wrap:wrap">
   <span class="chip"><i style="background:${C.P}"></i>Hormones</span><span class="chip"><i style="background:${C.LP}"></i>Periods</span><span class="chip"><i style="background:${C.PK}"></i>Fertility</span><span class="chip"><i style="background:${C.P}"></i>Skin &amp; Hair</span><span class="chip"><i style="background:${C.LP}"></i>Metabolism</span>
 </div>
 ${band ? `<div class="abs" style="left:0;bottom:-3mm">${wave(210)}</div>` : ''}
 <div class="abs" style="left:0;width:210mm;top:282mm;text-align:center;color:#fff;font-style:italic;font-weight:500;font-size:12pt;z-index:3">Hope Blooms from Within</div>
</div>`;

// ---------- 4  BACK COVER
const back = (band) => `<div class="panel">
 <svg class="abs" style="left:-10mm;top:-10mm" width="240mm" height="327mm" viewBox="-10 -10 240 327"><circle cx="-4" cy="30" r="70" fill="${C.PKT}" opacity=".8"/><circle cx="212" cy="190" r="52" fill="${C.PT}" opacity=".6"/></svg>
 <div class="abs" style="left:0;width:210mm;top:14mm;text-align:center"><img src="${LOGO}" style="width:88mm"></div>
 <div class="abs" style="left:0;width:210mm;top:52mm;text-align:center;line-height:1.2"><div style="font-size:19pt;font-weight:700;color:${C.LP}">Don&rsquo;t ignore PCOD.</div><div style="font-size:24pt;font-weight:700;color:${C.P};margin-top:1mm">Connect with us.</div></div>
 <div class="abs" style="left:14mm;right:14mm;top:84mm;height:42mm;background:${C.P};border-radius:4mm;display:flex;align-items:center;justify-content:space-between;padding:0 9mm 0 10mm">
   <div><div style="color:#F9DDEC;font-size:9.5pt">Call or WhatsApp us</div>
     <a href="tel:+918223087999" style="display:block;color:#fff;font-weight:700;font-size:23pt;text-decoration:underline;margin:1mm 0 1.5mm">+91 82230 87999</a>
     <div style="font-size:8.5pt;font-weight:600;color:${C.PK}"><a href="https://wa.me/918223087999">WhatsApp</a> &nbsp;|&nbsp; <a href="tel:+918223087999">Call</a></div></div>
   <div style="text-align:center"><div style="background:#fff;padding:1.6mm;border-radius:2mm"><img src="${QR}" style="width:27mm;display:block"></div><div style="color:#fff;font-size:5.8pt;margin-top:1.4mm">Scan to chat on WhatsApp</div></div>
 </div>
 <div class="abs" style="left:14mm;right:14mm;top:132mm;border:.35mm solid ${C.PK};border-radius:3mm;padding:4mm 5mm;text-align:center;background:#fff">
   <div style="font-size:9.5pt;font-weight:700;color:${C.P}">PCOD, PCOS &amp; PMOS care under one roof</div>
   <div style="font-size:7.8pt;color:${C.LP};margin-top:1.5mm;line-height:1.6">Gynecology &nbsp;|&nbsp; Endocrinology &nbsp;|&nbsp; Dermatology &nbsp;|&nbsp; Diet &amp; Nutrition &nbsp;|&nbsp; Ayurveda &nbsp;|&nbsp; Lab &amp; Ultrasound</div>
 </div>
 <div class="abs" style="left:14mm;width:88mm;top:158mm;height:50mm;background:${C.PKT};border-radius:3mm;padding:5mm 6mm">
   <div style="font-size:9.5pt;font-weight:700;color:${C.P};margin-bottom:2mm">Visit us</div>
   <div style="font-size:8.6pt;font-weight:700;margin-bottom:1mm">PCOD Xpert by Hope</div>
   <div style="font-size:8.4pt;line-height:1.55">Sahaj Hospital Campus<br>15/2 South Tukoganj, Near Manas Bhavan,<br>Behind Hotel Surya, Indore,<br>Madhya Pradesh 452005</div>
 </div>
 <div class="abs" style="left:108mm;right:14mm;top:158mm;height:50mm;background:${C.RT};border-left:1.4mm solid ${C.R};border-radius:0 3mm 3mm 0;padding:5mm 5mm 4mm 6mm">
   <div style="font-size:9.5pt;font-weight:700;color:${C.R};margin-bottom:1.5mm">Get help urgently if you have</div>
   <div style="font-size:7.6pt;line-height:1.5">&bull; Severe lower tummy pain or fainting<br>&bull; Very heavy bleeding (pad soaked every hour for 2 hours)<br>&bull; Chest pain or breathlessness<br>&bull; Sudden deepening of voice, rapid hair growth<br>&bull; Thoughts of self-harm: Tele-MANAS 14416 (24x7)</div>
 </div>
 <div class="abs note" style="left:14mm;right:14mm;top:216mm;font-size:6.9pt;line-height:1.55"><b style="letter-spacing:.2mm;color:${C.LP}">CONFIDENTIALITY</b><br>This folder holds your private health information and belongs to you. PCOD Xpert by Hope uses it only to look after you and shares it only with your treating team. Please keep it safe. This folder and its pages are a record and a guide, not a substitute for professional medical advice. Individual results vary.</div>
 ${band ? `<div class="abs" style="left:0;bottom:-3mm">${wave(210)}</div>` : ''}
 <div class="abs" style="left:0;width:210mm;top:282mm;text-align:center;color:#fff;font-weight:600;font-size:9pt;letter-spacing:.3mm;z-index:3">PCOD Xpert by Hope</div>
</div>`;

// ---------- 2  INSIDE LEFT  (pages attach here; fastener strip on the fold side = right edge)
const insideLeft = () => {
  const pages = ['Registration, consent and patient details', 'Health history and symptoms', 'Doctor’s assessment and treatment plan', 'Investigations and lab reports', 'Ultrasound and scan reports', 'Prescriptions and medicine list', 'Eating roadmap, diet and exercise plan', 'Cycle diary and progress review', 'Visit and follow-up notes'];
  const rows = pages.map((p, i) => `<div class="row big ${i % 2 ? '' : 'alt'}" style="grid-template-columns:9mm 1fr 13mm 27mm"><div style="font-weight:700;color:${C.P};text-align:center">${i + 1}</div><div>${p}</div><div style="text-align:center"><i class="cb"></i></div><div></div></div>`).join('');
  const before = ['Bring this folder to every visit', 'Update your cycle diary and daily logs', 'Carry all medicines and supplements you take', 'Write down your questions for the doctor', 'Come fasting only if we have told you to'].map((t, i) => `<div class="cbl big" style="${i % 2 ? '' : `background:${C.PKT}`}"><i class="cb"></i>${t}</div>`).join('');
  return `<div class="panel">
   <div class="abs" style="right:0;top:0;width:24mm;height:297mm;background:${C.LT}"></div>
   <div class="abs" style="right:24mm;top:0;height:297mm;border-left:.35mm dashed ${C.PK}"></div>
   <div class="abs" style="right:0;top:0;width:24mm;height:297mm;display:flex;align-items:center;justify-content:center"><div style="transform:rotate(90deg);white-space:nowrap;font-size:6.5pt;font-weight:700;letter-spacing:.9mm;color:#B7A9CF">PAGES ATTACH HERE  &middot;  FASTENER</div></div>
   <div class="abs" style="left:14mm;right:32mm;top:14mm">
     ${tb('01', 'Pages in this folder', 'Attach in this order. Tick when added', 'ATTACH HERE')}
     <h4 style="margin-top:7mm">Contents, in order</h4>
     <div class="row hd" style="grid-template-columns:9mm 1fr 13mm 27mm"><div style="text-align:center">#</div><div>Page</div><div style="text-align:center">Added</div><div>Date</div></div>
     ${rows}
     <h4>Before every visit</h4>
     ${before}
     <div class="note" style="margin-top:6mm"><b style="color:${C.LP}">How to attach pages.</b> Punch two holes, slide the pages onto the fastener with the newest page on top, and press the clip shut. Loose papers go into the pocket on the right.</div>
   </div>
   <div class="abs" style="left:14mm;right:32mm;bottom:10mm;border-top:.25mm solid ${C.PK};padding-top:2mm;font-size:6.2pt;color:${C.GREY};display:flex;justify-content:space-between"><span>PCOD Xpert by Hope &nbsp;|&nbsp; +91 82230 87999</span><span>Confidential patient record</span></div>
 </div>`;
};

// ---------- 3  INSIDE RIGHT  (care team + pocket)
const insideRight = () => {
  const roles = ['Gynecologist', 'Endocrinologist', 'Dermatologist', 'Dietitian', 'Ayurveda physician', 'Counsellor', 'Programme coordinator'];
  const team = roles.map((r, i) => `<div class="row big ${i % 2 ? '' : 'alt'}" style="grid-template-columns:42mm 1fr 44mm"><div style="font-weight:700;color:${C.P}">${r}</div><div></div><div></div></div>`).join('');
  return `<div class="panel">
   <div class="abs" style="left:14mm;right:14mm;top:14mm">
     ${tb('02', 'Care team and pocket', 'Who is looking after you, and where papers live', 'KEEP UPDATED')}
     <h4 style="margin-top:6mm">My care team</h4>
     <div class="row hd" style="grid-template-columns:42mm 1fr 44mm"><div>Role</div><div>Name</div><div>Days / how to reach</div></div>
     ${team}
     <h4>My next appointment</h4>
     <div style="display:grid;grid-template-columns:1fr 1fr 1.6fr;column-gap:5mm">${fld('DATE')}${fld('TIME')}${fld('WITH')}</div>
     <h4 style="margin-top:4mm">My programme</h4>
     <div style="display:flex;gap:4mm"><div class="cbl"><i class="cb"></i>3-month</div><div class="cbl"><i class="cb"></i>6-month</div><div class="cbl"><i class="cb"></i>Consultation only</div><div class="cbl"><i class="cb"></i>Fertility plan</div></div>
   </div>
   <!-- pocket -->
   <div class="abs" style="left:0;top:182mm;width:210mm;height:115mm">
     <svg width="210mm" height="115mm" viewBox="0 0 210 115" style="position:absolute;left:0;top:0"><defs><linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.PT}"/><stop offset="1" stop-color="${C.PKT}"/></linearGradient></defs>
       <path d="M0,10 Q0,0 10,0 L200,0 Q210,0 210,10 L210,115 L0,115 Z" fill="url(#pk)"/><rect x="0" y="0" width="210" height="2.4" fill="${C.P}"/></svg>
     <div class="abs" style="left:14mm;right:14mm;top:9mm">
       <div style="display:flex;align-items:center;gap:4mm"><div style="width:11mm;height:11mm;border-radius:50%;background:${C.P};display:flex;align-items:center;justify-content:center"><svg width="6mm" height="6mm" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4"/></svg></div><div><div style="font-size:12pt;font-weight:700;color:${C.P}">Pocket for reports and papers</div><div style="font-size:7.6pt;color:${C.GREY}">Keep loose papers here until they are punched and attached</div></div></div>
       <div style="display:grid;grid-template-columns:1fr 1fr;margin-top:5mm;gap:0 6mm">${['Blood and hormone reports', 'Ultrasound reports and scan films', 'Prescriptions', 'Diet chart and exercise plan', 'Receipts and invoices', 'Insurance and outside records'].map((t) => `<div class="cbl" style="padding:2.4mm 0"><i class="cb"></i>${t}</div>`).join('')}</div>
     </div>
     <div class="abs" style="left:14mm;bottom:12mm;width:92mm;height:24mm;border:.4mm dashed ${C.MID};border-radius:2.5mm;background:#fff;display:flex;align-items:center;justify-content:center;font-size:7pt;font-weight:700;color:${C.MID};letter-spacing:.3mm">DOCTOR&rsquo;S BUSINESS CARD</div>
     <div class="abs" style="left:112mm;right:14mm;bottom:12mm;height:24mm;background:#fff;border-radius:2.5mm;padding:3.5mm 5mm;font-size:7.8pt;line-height:1.5"><b style="color:${C.P}">Questions between visits?</b><br>WhatsApp the programme coordinator on <a href="https://wa.me/918223087999" style="font-weight:700;color:${C.P}">+91 82230 87999</a> with your name and patient ID.</div>
   </div>
 </div>`;
};

// ---------- guides (preview only): trim, fold, die-cut pocket, fastener holes, crop marks
const guides = (OFF, inside) => {
  const T = OFF; let g = `<svg class="abs" style="left:0;top:0" width="${420 + 2 * OFF}mm" height="${297 + 2 * OFF}mm" viewBox="0 0 ${420 + 2 * OFF} ${297 + 2 * OFF}" fill="none">`;
  const m = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width=".18"/>`;
  // crop marks (start 4 mm beyond trim, 5 mm long)
  [[T, T, -1, -1], [T + 420, T, 1, -1], [T, T + 297, -1, 1], [T + 420, T + 297, 1, 1]].forEach(([x, y, sx, sy]) => { g += m(x + sx * 4, y, x + sx * 9, y) + m(x, y + sy * 4, x, y + sy * 9); });
  g += `<line x1="${T + 210}" y1="${T - 9}" x2="${T + 210}" y2="${T - 4}" stroke="#000" stroke-width=".18"/><line x1="${T + 210}" y1="${T + 297 + 4}" x2="${T + 210}" y2="${T + 297 + 9}" stroke="#000" stroke-width=".18"/>`;
  g += `<rect x="${T}" y="${T}" width="420" height="297" stroke="#00A0E0" stroke-width=".25" stroke-dasharray="1.5 1"/>`;                    // trim
  g += `<line x1="${T + 210}" y1="${T}" x2="${T + 210}" y2="${T + 297}" stroke="#00A0E0" stroke-width=".35" stroke-dasharray="4 2"/>`;      // fold
  g += `<text x="${T + 211.5}" y="${T + 6}" font-size="2.6" fill="#00A0E0" font-family="Poppins">FOLD</text><text x="${T + 3}" y="${T - 4.5}" font-size="2.4" fill="#444" font-family="Poppins">${inside ? 'INSIDE: pages (left) | pocket (right)' : 'OUTSIDE: back cover (left) | front cover (right)'}  -  trim 420 x 297 mm, bleed 3 mm</text>`;
  if (inside) {
    const px = T + 210;
    g += `<path d="M${px + 2},${T + 192} Q${px + 2},${T + 182} ${px + 12},${T + 182} L${px + 198},${T + 182} Q${px + 208},${T + 182} ${px + 208},${T + 192} L${px + 208},${T + 297} L${px + 2},${T + 297} Z" stroke="#E6007E" stroke-width=".4" stroke-dasharray="2 1.2"/>`;   // pocket die-cut
    g += `<text x="${px + 6}" y="${T + 180}" font-size="2.4" fill="#E6007E" font-family="Poppins">DIE-CUT POCKET (adjust to printer template)</text>`;
    g += `<rect x="${px + 14}" y="${T + 264}" width="92" height="24" rx="2.5" stroke="#E6007E" stroke-width=".35" stroke-dasharray="1.5 1"/><text x="${px + 14}" y="${T + 261.5}" font-size="2.2" fill="#E6007E" font-family="Poppins">CARD SLIT</text>`;
    g += `<circle cx="${T + 198}" cy="${T + 108.5}" r="3.2" stroke="#E6007E" stroke-width=".35"/><circle cx="${T + 198}" cy="${T + 188.5}" r="3.2" stroke="#E6007E" stroke-width=".35"/><text x="${T + 160}" y="${T + 150}" font-size="2.3" fill="#E6007E" font-family="Poppins">fastener holes (80 mm apart)</text>`;
  }
  return g + '</svg>';
};

// ---------- compose
const sheet = (which, OFF, withGuides) => {
  const PW = 420 + 2 * OFF, PH = 297 + 2 * OFF;
  const bleed = `<div class="abs" style="left:${OFF - 3}mm;top:${OFF - 3}mm;width:426mm;height:303mm;overflow:hidden;background:#fff">
     <div class="abs" style="left:3mm;top:3mm;width:420mm;height:297mm">
       <div class="abs" style="left:0;top:0">${which === 'out' ? back(false) : insideLeft()}</div>
       <div class="abs" style="left:210mm;top:0">${which === 'out' ? front(false) : insideRight()}</div>
     </div>
     ${which === 'out' ? `<div class="abs" style="left:0;bottom:0">${wave(426)}</div>` : ''}
     ${which === 'out' ? `<div class="abs" style="left:3mm;width:210mm;top:282mm;text-align:center;color:#fff;font-weight:600;font-size:9pt;letter-spacing:.3mm;z-index:3">PCOD Xpert by Hope</div><div class="abs" style="left:213mm;width:210mm;top:282mm;text-align:center;color:#fff;font-style:italic;font-weight:500;font-size:12pt;z-index:3">Hope Blooms from Within</div>` : ''}
   </div>`;
  return `<div style="position:relative;width:${PW}mm;height:${PH}mm;overflow:hidden;page-break-after:always;break-after:page">${bleed}${withGuides ? guides(OFF, which === 'in') : ''}</div>`;
};
// the single-panel tagline text is positioned in each panel; in sheet mode we draw it separately, so hide the panel copies
const stripPanelTags = (h) => h;

const html = (body, size) => `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:${size};margin:0}${CSS}</style></head><body>${body}</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const out = (n) => path.join(ROOT, 'output', n);
  const render = async (name, body, w, h) => {
    const page = await browser.newPage();
    await page.setContent(html(body, `${w}mm ${h}mm`), { waitUntil: 'load' }); await page.waitForTimeout(300);
    await page.pdf({ path: out(name), width: `${w}mm`, height: `${h}mm`, printBackground: true, preferCSSPageSize: true });
    await page.close(); console.log('wrote', name);
  };
  // sheet versions: panel-level tagline copies removed (drawn once on the sheet)
  const noTag = (s) => s.replace(/<div class="abs" style="left:0;width:210mm;top:282mm;[^"]*">[^<]*<\/div>/g, '');
  const sheetOut = (off, g) => noTag(sheet('out', off, g)) + sheet('in', off, g);
  await render('PCOD_Xpert_Patient_Folder_PRINT_A3_bleed.pdf', sheetOut(3, false), 426, 303);
  await render('PCOD_Xpert_Patient_Folder_PREVIEW_with_guides.pdf', sheetOut(11, true), 442, 319);
  const A4 = (p) => `<div style="position:relative;width:210mm;height:297mm;overflow:hidden;page-break-after:always;break-after:page">${p}</div>`;
  await render('PCOD_Xpert_Patient_Folder_4_panels_A4.pdf', A4(front(true)) + A4(insideLeft()) + A4(insideRight()) + A4(back(true)), 210, 297);
  await browser.close();
})();
