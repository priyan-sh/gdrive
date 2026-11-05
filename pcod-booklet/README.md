# PCOD Xpert Patient Booklet

A5, 28-page patient education booklet in English and Hindi.

## Files (in `output/`)
- `PCOD_Xpert_Patient_Booklet_EN.docx` / `.pdf`
- `PCOD_Xpert_Patient_Booklet_HI.docx` / `.pdf`

Install the **Poppins** font (`assets/fonts/`) if Word shows a substitute font. It is also embedded in the .docx files.

## Editing text
All wording for both languages is in `src/content.js` (matching `en` and `hi` keys). Illustration labels are in the `g` section.

## Rebuilding
```bash
export NODE_PATH=$(npm root -g)
node src/render.js        # redraw illustrations (needs playwright + Poppins installed)
src/make.sh en            # builds EN docx + PDF
src/make.sh hi            # builds HI docx + PDF
```

Placeholders to fill before printing: the patient stories page (page 27).
