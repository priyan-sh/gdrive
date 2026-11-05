# Builds output/PCOD_Xpert_Assets.zip (logos, social media images, illustrations, booklet pages, QR).
import os, shutil, subprocess, glob
from PIL import Image, ImageDraw, ImageFont
import numpy as np
R = '/home/user/gdrive/pcod-booklet/'
P = '/tmp/claude-0/-home-user-gdrive/77bf09f0-d4a6-58ff-b27c-21e8fcffab6a/scratchpad/pack/'
PHONE = '+91 82230 87999'
shutil.rmtree(P, ignore_errors=True)
for d in ['01_Logos','02_Social_Media','03_Booklet_Illustrations_EN','04_Booklet_Illustrations_HI','05_Booklet_Pages_EN','06_Booklet_Pages_HI','07_Covers_and_QR']:
    os.makedirs(P + d)
logo = Image.open(R + 'assets/img/logo.png').convert('RGBA'); bfly = logo.crop((0, 0, 997, 787))
PUR = (166, 38, 131); LP = (98, 78, 136); PK = (242, 155, 170); PKT = (253, 235, 239); WH = (255, 255, 255)
def white(img):
    a = np.array(img); a[:, :, :3] = 255; return Image.fromarray(a)
logo_w = white(logo); bfly_w = white(bfly)
def fit(img, w=None, h=None):
    r = min((w or 1e9) / img.width, (h or 1e9) / img.height); return img.resize((int(img.width * r), int(img.height * r)), Image.LANCZOS)
def canvas(w, h, bg): return Image.new('RGBA', (w, h), bg + (255,))
def paste_c(c, img, cx, cy): c.alpha_composite(img, (int(cx - img.width / 2), int(cy - img.height / 2)))
FILES = {'Regular': '400Regular', 'SemiBold': '600SemiBold', 'Medium': '500Medium'}
F = lambda s, w='SemiBold': ImageFont.truetype(f'/root/.fonts/Poppins_{FILES[w]}.ttf', s)
def text_c(c, txt, cx, cy, size, fill, w='Medium'):
    d = ImageDraw.Draw(c); f = F(size, w); b = d.textbbox((0, 0), txt, font=f)
    d.text((cx - (b[2] - b[0]) / 2 - b[0], cy - (b[3] - b[1]) / 2 - b[1]), txt, font=f, fill=fill)
# logos
logo.save(P + '01_Logos/PCOD_Xpert_logo_full_transparent.png'); bfly.save(P + '01_Logos/PCOD_Xpert_butterfly_only_transparent.png')
c = canvas(2000, 787, WH); c.alpha_composite(logo); c.convert('RGB').save(P + '01_Logos/PCOD_Xpert_logo_full_white_bg.png')
logo_w.save(P + '01_Logos/PCOD_Xpert_logo_full_WHITE_for_dark_bg.png')
c = canvas(2000, 787, PUR); c.alpha_composite(logo_w); c.convert('RGB').save(P + '01_Logos/PCOD_Xpert_logo_white_on_purple.png')
S = P + '02_Social_Media/'
for size, name in [(1080, 'profile_picture_butterfly_1080'), (640, 'whatsapp_profile_butterfly_640')]:
    for bg, sfx in [(WH, 'white'), (PKT, 'pink')]:
        c = canvas(size, size, bg); paste_c(c, fit(bfly, size * 0.72, size * 0.72), size / 2, size / 2); c.convert('RGB').save(S + f'{name}_{sfx}.png')
    c = canvas(size, size, PUR); d = ImageDraw.Draw(c); r = int(size * 0.42); d.ellipse([size/2-r, size/2-r, size/2+r, size/2+r], fill=WH + (255,))
    paste_c(c, fit(bfly, size * 0.62, size * 0.62), size / 2, size / 2); c.convert('RGB').save(S + f'{name}_purple.png')
for bg, sfx, lg in [(WH, 'white', logo), (PKT, 'pink', logo), (PUR, 'purple', logo_w)]:
    c = canvas(1080, 1080, bg); paste_c(c, fit(lg, 940, None), 540, 540); c.convert('RGB').save(S + f'logo_square_post_1080_{sfx}.png')
def banner(w, h, name, bg, lg):
    c = canvas(w, h, bg); ImageDraw.Draw(c).rectangle([0, h - int(h * 0.035), w, h], fill=PK)
    paste_c(c, fit(lg, None, h * 0.58), w * 0.5, h * 0.5); c.convert('RGB').save(S + name)
for bg, sfx, lg in [(WH, 'white', logo), (PKT, 'pink', logo), (PUR, 'purple', logo_w)]:
    banner(1640, 624, f'facebook_cover_1640x624_{sfx}.png', bg, lg); banner(1500, 500, f'x_twitter_header_1500x500_{sfx}.png', bg, lg)
    banner(1584, 396, f'linkedin_banner_1584x396_{sfx}.png', bg, lg); banner(2560, 1440, f'youtube_banner_2560x1440_{sfx}.png', bg, lg)
for bg, sfx, lg, fg in [(WH, 'white', logo, LP), (PUR, 'purple', logo_w, WH)]:
    c = canvas(1080, 1920, bg); l = fit(lg, 900, None); paste_c(c, l, 540, 860)
    text_c(c, 'Hope Blooms from Within', 540, 860 + l.height / 2 + 80, 40, fg, 'Medium')
    text_c(c, PHONE, 540, 1700, 44, PUR if bg == WH else WH, 'SemiBold'); c.convert('RGB').save(S + f'instagram_story_1080x1920_{sfx}.png')
for lang, d in [('en', '03_Booklet_Illustrations_EN'), ('hi', '04_Booklet_Illustrations_HI')]:
    for f in glob.glob(R + f'assets/img/{lang}/*.png'):
        n = os.path.basename(f)
        if n in ('divider.png', 'backbg.png'): continue
        shutil.copy(f, P + (d if n != 'cover.png' else '07_Covers_and_QR') + '/' + (n if n != 'cover.png' else f'booklet_cover_{lang.upper()}.png'))
shutil.copy(R + 'assets/img/qr_whatsapp.png', P + '07_Covers_and_QR/QR_WhatsApp_918223087999.png')
for L, d in [('EN', '05_Booklet_Pages_EN'), ('HI', '06_Booklet_Pages_HI')]:
    subprocess.run(['pdftoppm', '-r', '150', '-png', R + f'output/PCOD_Xpert_Patient_Booklet_{L}.pdf', P + d + '/page'], check=True)
open(P + 'README.txt', 'w').write(f"""PCOD Xpert by Hope - Asset Pack
01_Logos            Full logo and butterfly-only (transparent PNG, white, white-on-purple)
02_Social_Media     Profile pictures (1080/640), square posts, Facebook/X/LinkedIn/YouTube banners, Instagram story
03/04 Illustrations Booklet graphics (English / Hindi), transparent PNG, high resolution
05/06 Booklet pages Every booklet page as a PNG (150 dpi) - use for carousel posts
07_Covers_and_QR    Booklet covers and WhatsApp QR code ({PHONE})
Brand colours: Purple #A62683, Light Purple #624E88, Pink #F29BAA. Font: Poppins.
""")
z = R + 'output/PCOD_Xpert_Assets.zip'
if os.path.exists(z): os.remove(z)
subprocess.run(['zip', '-rq', z, '.'], cwd=P, check=True)
print(sum(len(f) for _, _, f in os.walk(P)), 'files')
