/**
 * Render top-level frames of an exported .fig file to PNG, with internal
 * material scrubbed, so an exploration board can be shown behind the unlock
 * without stakeholder names, project numbers, or meeting notes.
 *
 * Usage:  node scripts/fig/render-fig-frames.mjs <unzipped-fig-dir> <out-dir> "Page::Frame" ...
 * The dir holds chunk0.bin (kiwi schema) and chunk1.bin (message), split from
 * canvas.fig with scripts/fig/split-fig.py, plus the images/ folder from the zip.
 * Env: MAXW (px, default 2400), SCRUB=0 to disable scrubbing, KIWI=<path to kiwi-schema>.
 * Rendering is approximate (no vector paths, system fonts); use it for study and
 * for gated evidence, and re-export from Figma where fidelity matters.
 */
import fs from 'node:fs'; import path from 'node:path';
import { createRequire as _cr } from 'node:module';
const { decodeBinarySchema, compileSchema } = _cr(import.meta.url)(process.env.KIWI || 'kiwi-schema');
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [,, dir, outDir, ...targets] = process.argv; // targets: "Page::FrameName" or "Page::*"
fs.mkdirSync(outDir, { recursive: true });
const schema = decodeBinarySchema(new Uint8Array(fs.readFileSync(`${dir}/chunk0.bin`)));
const msg = compileSchema(schema).decodeMessage(new Uint8Array(fs.readFileSync(`${dir}/chunk1.bin`)));
const nodes = msg.nodeChanges||[]; const key=g=>`${g.sessionID}:${g.localID}`;
const byId=new Map(), children=new Map();
for(const n of nodes){byId.set(key(n.guid),n);}
for(const n of nodes){const p=n.parentIndex?.guid?key(n.parentIndex.guid):'ROOT';(children.get(p)||children.set(p,[]).get(p)).push(n);}
for(const [,a] of children) a.sort((x,y)=>(x.parentIndex?.position||'').localeCompare(y.parentIndex?.position||''));

// ── Scrub ───────────────────────────────────────────────────────────────────
// Lines naming a colleague, a project number, a meeting, or a competitor
// comparison are dropped from text; a note instance, a plan board, and any
// small tag whose only text was dropped are hidden outright.
const SCRUB = process.env.SCRUB !== '0';
// Names and competitor terms come from a git-ignored local list (the repo is public).
const REDACT = JSON.parse(fs.readFileSync(new URL('../aem-component-system/redact.local.json', import.meta.url), 'utf8'));
const esc_ = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const DROP_LINE = new RegExp(`\\b(${REDACT.names.map(esc_).join('|')})\\b|PN\\s?\\d{5,}|QBR|${REDACT.terms.map(esc_).join('|')}`, 'i');
const HIDE_NODE = /^(note|project plan|talking points|qbr)/i;
const scrubbed = new Set();
function scrubText(n) {
  if (!SCRUB || n.type !== 'TEXT' || !n.textData?.characters) return;
  const lines = n.textData.characters.split('\n');
  const kept = lines.filter(l => !DROP_LINE.test(l));
  if (kept.length === lines.length) return;
  if (!kept.join('').trim()) { n.visible = false; scrubbed.add(key(n.guid)); return; }
  n.textData = { ...n.textData, characters: kept.join('\n') };
  scrubbed.add(key(n.guid));
}
if (SCRUB) {
  for (const n of nodes) { if (HIDE_NODE.test(n.name || '')) n.visible = false; scrubText(n); }
  // A tag whose text was scrubbed away is a coloured pill with nothing on it: hide it too.
  for (const n of nodes) {
    if (!n.size || n.size.x > 260 || n.size.y > 80) continue;
    const kids = children.get(key(n.guid)) || [];
    const texts = kids.filter(k => k.type === 'TEXT');
    if (texts.length && texts.every(t => scrubbed.has(key(t.guid)) && t.visible === false)) n.visible = false;
  }
}
let imgCount=0, imgMiss=0;
const hex=b=>Buffer.from(b).toString('hex');
const col=c=>c?`rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${c.a??1})`:'transparent';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function paintCss(paints, w, h){ let bg=[]; for(const p of paints||[]){ if(p.visible===false) continue; const op=p.opacity??1;
  if(p.type==='SOLID'){const c={...p.color,a:(p.color.a??1)*op}; bg.push(`linear-gradient(${col(c)},${col(c)})`);}
  else if(p.type==='IMAGE'&&p.image?.hash){const f=path.resolve(`${dir}/images/${hex(p.image.hash)}`); if(fs.existsSync(f)) { imgCount++; bg.push(`url('file://${f}') center/${p.imageScaleMode==='FIT'?'contain':'cover'} no-repeat`);} else imgMiss++;}
  else if(p.type&&p.type.startsWith('GRADIENT')){const stops=(p.stops||[]).map(s=>`${col({...s.color,a:(s.color.a??1)*op})} ${Math.round(s.position*100)}%`).join(','); if(stops) bg.push(`linear-gradient(180deg,${stops})`);}
 } return bg.length?`background:${bg.reverse().join(',')};`:''; }
function radius(n){ if(n.rectangleCornerRadiiIndependent&&n.rectangleCornerRadii){const r=n.rectangleCornerRadii;return `border-radius:${r.topLeft||0}px ${r.topRight||0}px ${r.bottomRight||0}px ${r.bottomLeft||0}px;`;} return n.cornerRadius?`border-radius:${n.cornerRadius}px;`:''; }
function render(n, overrides, depth){
  if(n.visible===false) return ''; if(depth>60) return '';
  const o = overrides?.get(key(n.guid)); const m = o? {...n, ...o} : n; if (SCRUB && o?.textData?.characters) { const kept = o.textData.characters.split('\n').filter(l => !DROP_LINE.test(l)); if (!kept.join('').trim()) return ''; m.textData = { ...o.textData, characters: kept.join('\n') }; }
  const t=m.transform||{m00:1,m01:0,m02:0,m10:0,m11:1,m12:0}; const w=m.size?.x??0, h=m.size?.y??0;
  const base=`position:absolute;left:0;top:0;width:${w}px;height:${h}px;transform:matrix(${t.m00},${t.m10},${t.m01},${t.m11},${t.m02},${t.m12});transform-origin:0 0;opacity:${m.opacity??1};`;
  let inner='', style=base;
  const type=n.type;
  if(type==='TEXT'){ const td=m.textData||n.textData; const txt=td?.characters??''; const fs_=m.fontSize??n.fontSize??12; const FONT_MAP={Gibson:'Avenir Next',Aleo:'Georgia',Lato:'Helvetica Neue',Ubuntu:'Helvetica Neue',Bariol:'Helvetica Neue'}; const fam0=(m.fontName||n.fontName)?.family||'sans-serif'; const fam=FONT_MAP[fam0]||fam0; const st=(m.fontName||n.fontName)?.style||''; const bold=/bold|semi|black|heavy|medium/i.test(st)?(/semi/i.test(st)?600:700):400; const fill=(m.fillPaints||n.fillPaints||[]).find(p=>p.type==='SOLID'); const lh=m.lineHeight?.units==='PIXELS'?`${m.lineHeight.value}px`:(m.lineHeight?.units==='PERCENT'&&m.lineHeight.value?`${m.lineHeight.value/100}`:'1.2'); const al=(m.textAlignHorizontal||'LEFT').toLowerCase(); const ls=m.letterSpacing?.value?`letter-spacing:${m.letterSpacing.units==='PIXELS'?m.letterSpacing.value+'px':m.letterSpacing.value/100+'em'};`:''; const tc=m.textCase==='UPPER'?'text-transform:uppercase;':'';
    style+=`font:${bold} ${fs_}px/${lh} '${fam}','Helvetica Neue',Helvetica,Arial,sans-serif;color:${col(fill?.color)};text-align:${al};white-space:pre-wrap;word-wrap:break-word;${ls}${tc}overflow:visible;`; inner=esc(txt); return `<div style="${style}">${inner}</div>`; }
  let fillsrc=m.fillPaints||n.fillPaints; if(type==='INSTANCE'&&(!fillsrc||!fillsrc.length)&&n.symbolData?.symbolID){const sym0=byId.get(key(n.symbolData.symbolID)); if(sym0) fillsrc=sym0.fillPaints;} style+=paintCss(fillsrc,w,h)+radius(m);
  const stroke=(m.strokePaints||n.strokePaints||[]).find(p=>p.visible!==false&&p.type==='SOLID'); if(stroke&&(m.strokeWeight??n.strokeWeight)) style+=`box-shadow:inset 0 0 0 ${m.strokeWeight??n.strokeWeight}px ${col({...stroke.color,a:(stroke.color.a??1)*(stroke.opacity??1)})};`;
  if(type==='ELLIPSE') style+='border-radius:50%;';
  if((type==='FRAME'||type==='SYMBOL'||type==='INSTANCE'||type==='SECTION') && !n.frameMaskDisabled && type!=='SECTION') style+='overflow:hidden;';
  if(type==='VECTOR'||type==='BOOLEAN_OPERATION'||type==='STAR'||type==='REGULAR_POLYGON'){ const f=(m.fillPaints||[]).find(p=>p.type==='SOLID'&&p.visible!==false); if(!f) return ''; style+='border-radius:20%;opacity:'+((m.opacity??1)*0.8)+';'; }
  let kids=''; 
  if(type==='INSTANCE'&&n.symbolData?.symbolID){ const sym=byId.get(key(n.symbolData.symbolID)); if(sym){ const ov=new Map(overrides||[]); for(const so of n.symbolData.symbolOverrides||[]){ const g=so.guidPath?.guids; if(g&&g.length){ const k=key(g[g.length-1]); ov.set(k,{...(ov.get(k)||{}),...so}); } } const sc = sym.size&&w&&h?`transform:scale(${w/sym.size.x},${h/sym.size.y});transform-origin:0 0;`:''; kids=`<div style="position:absolute;left:0;top:0;${sc}">`+(children.get(key(sym.guid))||[]).map(c=>render(c,ov,depth+1)).join('')+'</div>'; } }
  else kids=(children.get(key(n.guid))||[]).map(c=>render(c,overrides,depth+1)).join('');
  return `<div style="${style}">${kids}</div>`;
}
const browser=await chromium.launch(); const page=await browser.newPage(); page.on('requestfailed',r=>console.log('request failed',r.url().slice(0,90),r.failure()?.errorText));
for(const doc of children.get('ROOT')||[]) for(const pg of children.get(key(doc.guid))||[]){
  for(const f of children.get(key(pg.guid))||[]){
    const want=targets.some(t=>{const [p,n]=t.split('::'); return (p==='*'||p===pg.name)&&(n==='*'||n===f.name||(n.endsWith('*')&&f.name.startsWith(n.slice(0,-1))));});
    if(!want||!f.size) continue;
    const W=f.size.x,H=f.size.y; const maxW=Number(process.env.MAXW||2400); const scale=Math.min(1,maxW/W, 12000/H);
    const inner=render({...f, transform:{m00:1,m01:0,m02:0,m10:0,m11:1,m12:0}}, null, 0);
    const html=`<!doctype html><html><body style="margin:0;background:#f5f5f5"><div style="position:relative;width:${W*scale}px;height:${H*scale}px;overflow:hidden"><div style="position:absolute;left:0;top:0;transform:scale(${scale});transform-origin:0 0;width:${W}px;height:${H}px">${inner}</div></div></body></html>`;
    await page.setViewportSize({width:Math.ceil(W*scale),height:Math.min(Math.ceil(H*scale),16000)});
    const hp=`${outDir}/__tmp.html`; fs.writeFileSync(hp,html); await page.goto('file://'+path.resolve(hp),{waitUntil:'load'}); await page.waitForTimeout(600);
    const safe=`${pg.name}__${f.name}__${Math.round(W)}x${Math.round(H)}`.replace(/[^\w.-]+/g,'_').slice(0,90);
    let name=safe, i=1; while(fs.existsSync(`${outDir}/${name}.png`)) name=`${safe}_${i++}`;
    await page.screenshot({path:`${outDir}/${name}.png`, fullPage:true});
    console.log('rendered', name, 'scale', scale.toFixed(2), 'images', imgCount, 'missing', imgMiss); imgCount=0; imgMiss=0;
  }
}
await browser.close();
