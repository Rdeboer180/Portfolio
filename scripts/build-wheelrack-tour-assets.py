"""Create display-sized tour crops from original evidence; never modify originals."""
from pathlib import Path
import hashlib, json, re
from PIL import Image
root = Path(__file__).resolve().parents[1]
source = (root / 'src/components/WheelRackLibraryTour.tsx').read_text()
sources = {key: file for key, file in re.findall(r"(\w+): \['([^']+)', \d+, \d+\]", source)}
views = re.findall(r"label: '([^']+)', source: '(\w+)', crop: \[([^\]]+)\]", source)
dest = root / 'public/images/work/wheelrack/tour-samples'
dest.mkdir(exist_ok=True)
manifest = []
for i, (label, key, coordinates) in enumerate(views):
    path = root / 'public/images/work/wheelrack' / sources[key]
    x, y, w, h = map(int, coordinates.split(','))
    with Image.open(path) as original:
        sample = original.crop((x, y, x+w, y+h)).convert('RGB')
        sample.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
        name = f'{i+1:02}.webp'
        sample.save(dest / name, 'WEBP', quality=92, method=6)
        manifest.append({'file': name, 'label': label, 'source': sources[key], 'sourceSha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'crop': [x,y,w,h], 'size': list(sample.size)})
(root / 'scripts/wheelrack-tour-provenance.json').write_text(json.dumps(manifest, indent=2)+'\n')
print(f'Generated {len(manifest)} original-evidence crops, {sum((dest/x["file"]).stat().st_size for x in manifest):,} bytes total')
