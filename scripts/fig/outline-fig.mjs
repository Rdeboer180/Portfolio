import fs from 'node:fs';
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
const dir = process.argv[2];
const schemaBytes = new Uint8Array(fs.readFileSync(`${dir}/chunk0.bin`));
const schema = decodeBinarySchema(schemaBytes);
const compiled = compileSchema(schema);
const msg = compiled.decodeMessage(new Uint8Array(fs.readFileSync(`${dir}/chunk1.bin`)));
const nodes = msg.nodeChanges || [];
const key = g => `${g.sessionID}:${g.localID}`;
const byId = new Map(); const children = new Map();
for (const n of nodes) { byId.set(key(n.guid), n); }
for (const n of nodes) { const p = n.parentIndex?.guid ? key(n.parentIndex.guid) : 'ROOT'; if (!children.has(p)) children.set(p, []); children.get(p).push(n); }
for (const [, arr] of children) arr.sort((a,b)=> (a.parentIndex?.position||'').localeCompare(b.parentIndex?.position||''));
// blob text: characters can live in textData.characters
const textOf = n => n.textData?.characters ?? n.characters ?? '';
const imgOf = n => (n.fillPaints||[]).filter(p=>p.type==='IMAGE'&&p.image?.hash).map(p=>Buffer.from(p.image.hash).toString('hex'));
let out = [];
function walk(id, depth, maxDepth) {
  for (const n of children.get(id) || []) {
    const t = n.type; const name = n.name || '';
    const sz = n.size ? `${Math.round(n.size.x)}x${Math.round(n.size.y)}` : '';
    const txt = t === 'TEXT' ? ` "${textOf(n).replace(/\n/g,' / ')}"` : '';
    const img = imgOf(n); const imgs = img.length ? ` [img ${img.map(h=>h.slice(0,12)).join(',')}]` : '';
    const vis = n.visible === false ? ' (hidden)' : '';
    if (depth <= maxDepth || t === 'TEXT') out.push(`${'  '.repeat(depth)}${t} ${JSON.stringify(name)} ${sz}${txt}${imgs}${vis}`);
    if (t !== 'TEXT') walk(key(n.guid), depth+1, maxDepth);
  }
}
walk('ROOT', 0, Number(process.argv[3] || 3));
fs.writeFileSync(`${dir}/outline.txt`, out.join('\n'));
console.log('nodes', nodes.length, 'lines', out.length);
// summary of pages
for (const doc of children.get('ROOT')||[]) for (const page of children.get(key(doc.guid))||[]) {
  const kids = children.get(key(page.guid))||[];
  console.log('PAGE', JSON.stringify(page.name), 'top-level', kids.length, kids.slice(0,40).map(k=>`${k.type}:${k.name}${k.size?` ${Math.round(k.size.x)}x${Math.round(k.size.y)}`:''}`).join(' | '));
}
