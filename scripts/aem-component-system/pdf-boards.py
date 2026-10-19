"""Cut the gated AEM study boards and the cover-loop plates from Ryan's Figma PDF exports.

Usage: python3 scripts/aem-component-system/pdf-boards.py "<Homepage Testing and iteration.pdf>" "<reDesign (Untitled).pdf>"
Names, project numbers, and competitor comparisons are redacted (white) before rendering;
pages that carry only a project number are never exported.
"""
import re, sys
import fitz
from PIL import Image, ImageChops
Image.MAX_IMAGE_PIXELS = None
HOME, REDESIGN = sys.argv[1], sys.argv[2]
OUT = 'public/images/work/aem-component-system/homepage-boards'
LOOP = 'scripts/aem-component-system/cover-loop'
# The names and terms to redact live in redact.local.json beside this script
# (git-ignored: the repository is public, so the list itself must stay local).
import json, os
_REDACT = json.load(open(os.path.join(os.path.dirname(__file__), 'redact.local.json')))
NAMES, TERMS = _REDACT['names'], _REDACT['terms']
PN = re.compile(r'PN\s?\d{5,}')

NAME_SET = {n.lower() for n in NAMES}
def redact(page):
    # Names match whole words only (search_for is a substring match and would
    # take "time" for Tim); competitor comparisons and project numbers match as written.
    rects = []
    for term in TERMS:
        rects += page.search_for(term)
    words = page.get_text('words')
    is_name = lambda w: w[4].strip('.,:;()?!').lower() in NAME_SET
    for i, w in enumerate(words):
        token = w[4].strip('.,:;()?!').lower()
        if token in NAME_SET or PN.search(w[4]): rects.append(fitz.Rect(w[:4]))
        # a separator between two names on a tag ("Name / Name?") goes with them
        if token in ('/', '?', '') and ((i and is_name(words[i - 1])) or (i + 1 < len(words) and is_name(words[i + 1]))):
            rects.append(fitz.Rect(w[:4]))
        if token == 'ryan' and i + 1 < len(words) and words[i + 1][4].strip('.,').lower() == 'k':
            rects.append(fitz.Rect(w[:4]) | fitz.Rect(words[i + 1][:4]))
    for r in rects:
        page.add_redact_annot(r + (-12, -14, 12, 14), fill=(1, 1, 1))
    if rects: page.apply_redactions()
    return len(rects)

def render(page, scale, clip=None):
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), clip=clip, alpha=False)
    return Image.frombytes('RGB', (pix.width, pix.height), pix.samples)

def trim(im, pad=40):
    bg = Image.new(im.mode, im.size, im.getpixel((0, 0))); bbox = ImageChops.difference(im, bg).getbbox()
    if not bbox: return im
    x0, y0, x1, y1 = bbox; return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))

def save(im, name, maxw=2400, q=88):
    if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(f'{OUT}/{name}.jpg', quality=q, optimize=True); print(name, im.size)

home = fitz.open(HOME)
pages = {}
def pg(n):
    if n not in pages:
        p = home[n - 1]; redacted = redact(p); pages[n] = p
        if redacted: print(f'p{n}: redacted {redacted}')
    return pages[n]

# Testing notes
save(trim(render(pg(4), 1.3)), 'test-plan')
save(trim(render(pg(20), 1.6)), 'test-notes-how-it-works')
save(trim(render(pg(18), 1.6)), 'test-notes-promo')
save(trim(render(pg(22), 1.6)), 'test-notes-survey')
save(trim(render(pg(28), 1.3)), 'test-notes-topics')
# Concept pages and section-focus boards
for n, name in [(1, 'concept-a'), (14, 'concept-b'), (23, 'concept-c')]:
    save(render(pg(n), 1.2), name, maxw=1700)
for n, name in [(36, 'focus-new-tires'), (37, 'focus-brands'), (38, 'focus-test-track'), (39, 'focus-reviews'), (40, 'focus-pledge'), (41, 'focus-articles')]:
    save(render(pg(n), 1.0), name, maxw=1401)
# Three concepts side by side
cols = [render(pg(n), 0.6) for n in (1, 14, 23)]
gap = 40; H = max(c.height for c in cols)
sheet = Image.new('RGB', (sum(c.width for c in cols) + gap * 4, H + gap * 2), (245, 245, 245)); x = gap
for c in cols: sheet.paste(c, (x, gap)); x += c.width + gap
save(sheet, 'component-order')
# The refined UI
r = fitz.open(REDESIGN)[0]
save(trim(render(r, 0.42)), 'end-state')
save(render(r, 1.5, clip=fitz.Rect(912, 667, 2313, 5552)), 'refined-desktop', maxw=2102)
save(render(r, 1.5, clip=fitz.Rect(2448, 669, 3849, 6504)), 'refined-selector-open', maxw=2102)
save(render(r, 2.0, clip=fitz.Rect(3984, 657, 4412, 7402)), 'refined-phone', maxw=856)
render(r, 2.0, clip=fitz.Rect(912, 667, 2313, 1537)).save(f'{LOOP}/plate-desktop.jpg', quality=92)
render(r, 2.0, clip=fitz.Rect(3984, 657, 4412, 1357)).save(f'{LOOP}/plate-phone.jpg', quality=92)
print('loop plates written')
