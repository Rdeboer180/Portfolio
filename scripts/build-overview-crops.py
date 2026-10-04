"""Optimize display crops only. Every preview links to its untouched source artifact."""
from pathlib import Path
import hashlib, json, subprocess
from PIL import Image
root = Path(__file__).resolve().parents[1]
code = """const fs=require('fs'),ts=require('typescript'),m={exports:{}};
new Function('module','exports',ts.transpileModule(fs.readFileSync('src/data/projects.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports);
console.log(JSON.stringify(m.exports.default.flatMap(p=>[p.overview?.opening,...(p.overview?.decisions.map(d=>d.image)??[])].filter(i=>i?.displaySrc))));"""
images = json.loads(subprocess.check_output(['node', '-e', code], cwd=root))
manifest = []
seen = set()
for image in images:
    if image['displaySrc'] in seen: continue
    seen.add(image['displaySrc'])
    src = root / 'public' / image['src'].lstrip('/')
    dst = root / 'public' / image['displaySrc'].lstrip('/')
    c = image['crop']
    with Image.open(src) as original:
        assert original.size == (c['sourceWidth'], c['sourceHeight']), str(src)
        crop = original.crop((c['x'], c['y'], c['x']+c['width'], c['y']+c['height'])).convert('RGB')
        crop.thumbnail((1280,1280), Image.Resampling.LANCZOS)
        dst.parent.mkdir(parents=True, exist_ok=True)
        crop.save(dst, 'WEBP', quality=94, method=6)
        manifest.append({'source': image['src'], 'display': image['displaySrc'], 'sourceSha256': hashlib.sha256(src.read_bytes()).hexdigest(), 'crop': c, 'size': list(crop.size)})
(root/'scripts/overview-crop-provenance.json').write_text(json.dumps(manifest, indent=2)+'\n')
print(f'Generated {len(manifest)} display crops from unchanged originals')
