#!/bin/bash
# builds output/PCOD_Xpert_Patient_File.docx + .pdf and a preview sheet
set -e
cd /home/user/gdrive/pcod-booklet
export NODE_PATH=$(npm root -g):/node-tools/node_modules
node src/build_patientfile.js
python3 - <<'PY'
import zipfile,re,shutil
f='/home/user/gdrive/pcod-booklet/output/PCOD_Xpert_Patient_File.docx'
zin=zipfile.ZipFile(f); tmp=f+'.tmp'; zout=zipfile.ZipFile(tmp,'w',zipfile.ZIP_DEFLATED)
for i in zin.infolist():
    d=zin.read(i.filename)
    if i.filename=='word/fontTable.xml': d=re.sub(rb'w:fontKey="(\{[^}]*\})"',lambda m:b'w:fontKey="'+m.group(1).upper()+b'"',d)
    zout.writestr(i,d)
zout.close(); zin.close(); shutil.move(tmp,f)
PY
cd output
SK=$(ls -d /root/.claude/skills/synced/*/docx)
python3 $SK/scripts/office/soffice.py --headless --convert-to pdf PCOD_Xpert_Patient_File.docx >/dev/null 2>&1
pdfinfo PCOD_Xpert_Patient_File.pdf | grep -E "Pages|Page size"
S=/tmp/claude-0/-home-user-gdrive/77bf09f0-d4a6-58ff-b27c-21e8fcffab6a/scratchpad
rm -rf $S/pf && mkdir -p $S/pf && pdftoppm -r 50 -png PCOD_Xpert_Patient_File.pdf $S/pf/p
python3 -I - $S/pf <<'PY'
import sys,glob
from PIL import Image
d=sys.argv[1]; fs=sorted(glob.glob(d+'/p-*.png')); ims=[Image.open(f) for f in fs]; w,h=ims[0].size
for k in range(0,len(ims),8):
    sub=ims[k:k+8]; sh=Image.new('RGB',(w*4+30,h*2+10),'#999')
    for i,im in enumerate(sub): sh.paste(im,((i%4)*(w+10),(i//4)*(h+10)))
    sh.save(d+f'/sheet{k//8}.png')
PY
