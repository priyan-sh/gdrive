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

## Patient folder (physical file folder)
`node src/build_folder.js` builds three PDFs in `output/`:
- `PCOD_Xpert_Patient_Folder_PRINT_A3_bleed.pdf`: 2 pages, A3 sheet (426 x 303 mm with 3 mm bleed). Page 1 = outside (back | front), page 2 = inside (pages | pocket). Folds to A4.
- `PCOD_Xpert_Patient_Folder_PREVIEW_with_guides.pdf`: same with trim, fold, fastener-hole and pocket die-cut guides and crop marks (not for printing).
- `PCOD_Xpert_Patient_Folder_4_panels_A4.pdf`: front, inside left, inside right, back as separate A4 pages for sharing.
