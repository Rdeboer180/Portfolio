"""Blend the crossfades capture-session.cjs marked (before-N.jpg into frames N..N+k)."""
import glob, json, os, re
from PIL import Image
D = os.path.join(os.path.dirname(__file__), 'session')
for f in glob.glob(os.path.join(D, 'fade-*.json')):
    m = json.load(open(f)); at, k = m['at'], m['frames']
    before = Image.open(os.path.join(D, f'before-{at}.jpg')).convert('RGB')
    for i in range(k):
        p = os.path.join(D, f'{at + i:04d}.jpg'); after = Image.open(p).convert('RGB')
        t = (i + 1) / (k + 1); t = t * t * (3 - 2 * t)
        Image.blend(before, after, t).save(p, quality=92)
    os.remove(f); os.remove(os.path.join(D, f'before-{at}.jpg'))
print('crossfades blended')
