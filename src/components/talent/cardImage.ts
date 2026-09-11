// ============================================
// Talent tree: the result card as a PNG
// Draws the card from Result.dc.html at a true 1200 × 630 on a 2x canvas
// with the Canvas 2D API alone (no html2canvas, no dependency), then hands
// the browser a download named "<name>-talent-tree.png". Loaded lazily by
// the page on the first click so the route chunk stays small.
//
// Fonts: Hubot Sans and Inter arrive through the site's stylesheet, and the
// canvas can only use a face the document has already loaded, so the three
// families are awaited through document.fonts before anything is drawn.
// Menlo is a system face; the load call resolves either way and the family
// list carries the same fallbacks the site uses.
// ============================================

import type { TalentResult } from '../../data/talent/types';
import type { CardData } from './cardData';
import { cardData, LEVEL_ALPHA } from './cardData';

export const CARD_W = 1200;
export const CARD_H = 630;
const SCALE = 2;
const PAD = 56;

const INK = '#1b1b1b';
const PAPER = '#f4f6f7';
const STEEL = '#8f9daf';
const ORANGE = '#f03d01';
const HAIRLINE = 'rgba(255,255,255,0.08)';

const HEADING = "'Hubot Sans', Inter, -apple-system, BlinkMacSystemFont, sans-serif";
const BODY = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const MONO = "Menlo, Monaco, Consolas, 'Courier New', monospace";

type Ctx = CanvasRenderingContext2D & { letterSpacing?: string };

async function loadFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts || !document.fonts.load) return;
  const faces = [
    `800 60px 'Hubot Sans'`,
    `400 17px Inter`,
    `500 15px Inter`,
    `400 16px Menlo`,
  ];
  await Promise.all(faces.map((f) => document.fonts.load(f).catch(() => [])));
}

/** Text with tracking, on canvases that lack ctx.letterSpacing. */
function drawTracked(ctx: Ctx, text: string, x: number, y: number, tracking: number, align: 'left' | 'right' = 'left') {
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${tracking}px`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.letterSpacing = '0px';
    ctx.textAlign = 'left';
    return;
  }
  const chars = text.split('');
  const width = chars.reduce((w, c) => w + ctx.measureText(c).width + tracking, 0) - tracking;
  let cx = align === 'right' ? x - width : x;
  ctx.textAlign = 'left';
  chars.forEach((c) => {
    ctx.fillText(c, cx, y);
    cx += ctx.measureText(c).width + tracking;
  });
}

function measureTracked(ctx: Ctx, text: string, tracking: number): number {
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${tracking}px`;
    const w = ctx.measureText(text).width;
    ctx.letterSpacing = '0px';
    return w;
  }
  return text.split('').reduce((w, c) => w + ctx.measureText(c).width + tracking, 0) - tracking;
}

function wrap(ctx: Ctx, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  words.forEach((word) => {
    const probe = line ? `${line} ${word}` : word;
    if (ctx.measureText(probe).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = probe;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function alpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function draw(ctx: Ctx, d: CardData) {
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // ── Left column ─────────────────────────────────────────────────────────
  let y = PAD + 18;
  const left = PAD;
  const leftW = CARD_W - PAD * 2 - 372 - 56;

  // Name, uppercase Menlo 18 with 0.16em tracking, then the level pill.
  ctx.fillStyle = PAPER;
  ctx.font = `400 18px ${MONO}`;
  const name = d.name.toUpperCase();
  drawTracked(ctx, name, left, y, 18 * 0.16);
  const nameW = measureTracked(ctx, name, 18 * 0.16);

  ctx.font = `400 12px ${MONO}`;
  const level = `Level ${d.level} Designer`;
  const levelW = measureTracked(ctx, level, 12 * 0.06);
  const pillX = left + nameW + 14;
  const pillH = 24;
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1;
  roundRect(ctx, pillX, y - 17, levelW + 20, pillH, 12);
  ctx.stroke();
  ctx.fillStyle = STEEL;
  drawTracked(ctx, level, pillX + 10, y - 1, 12 * 0.06);

  // Class: two lines of Hubot Sans 800 at 60, a steel slash after the first.
  y += 22 + 50;
  ctx.fillStyle = PAPER;
  ctx.font = `800 60px ${HEADING}`;
  drawTracked(ctx, d.primary, left, y, -60 * 0.02);
  const primaryW = measureTracked(ctx, d.primary, -60 * 0.02);
  ctx.strokeStyle = STEEL;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(left + primaryW + 14 + 21, y - 46);
  ctx.lineTo(left + primaryW + 14 + 5, y + 2);
  ctx.stroke();
  y += 61;
  drawTracked(ctx, d.secondary, left, y, -60 * 0.02);

  // Pair description, Inter 17/26 at 78% paper, up to 660 wide.
  y += 22 + 17;
  ctx.fillStyle = 'rgba(244,246,247,0.78)';
  ctx.font = `400 17px ${BODY}`;
  const descLines = wrap(ctx, d.description, Math.min(660, leftW));
  descLines.forEach((line) => {
    ctx.fillText(line, left, y);
    y += 26;
  });

  // Passive ability and current quest rows.
  y += 22 - 26 + 26;
  const rows: [string, string][] = [
    ['PASSIVE ABILITY', d.passive],
    ['CURRENT QUEST', d.quest],
  ];
  rows.forEach(([label, value], i) => {
    ctx.strokeStyle = HAIRLINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + leftW, y);
    ctx.stroke();
    const rowTop = y;
    ctx.fillStyle = STEEL;
    ctx.font = `400 11px ${MONO}`;
    drawTracked(ctx, label, left, rowTop + 12 + 16, 11 * 0.12);
    ctx.fillStyle = PAPER;
    ctx.font = `400 16px ${BODY}`;
    const valueLines = wrap(ctx, value, leftW - 128 - 16);
    valueLines.forEach((line, li) => {
      ctx.fillText(line, left + 128 + 16, rowTop + 12 + 16 + li * 24);
    });
    y = rowTop + 12 + valueLines.length * 24 + 12;
    if (i === rows.length - 1) {
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + leftW, y);
      ctx.stroke();
    }
  });

  // ── Right column: primary stats ─────────────────────────────────────────
  const rx = CARD_W - PAD - 372;
  const rw = 372;
  let ry = PAD + 4 + 12;
  ctx.fillStyle = STEEL;
  ctx.font = `400 11px ${MONO}`;
  drawTracked(ctx, 'PRIMARY STATS', rx, ry, 11 * 0.12);
  drawTracked(ctx, `COMPUTED FROM ${d.pointsSpent} POINTS`, rx + rw, ry, 11 * 0.12, 'right');
  ry += 16;

  d.stats.forEach((s) => {
    ry += 16;
    ctx.fillStyle = PAPER;
    ctx.font = `500 15px ${BODY}`;
    ctx.textAlign = 'left';
    ctx.fillText(s.label, rx, ry + 15);
    ctx.font = `400 24px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.fillText(String(s.score), rx + rw, ry + 20);
    ctx.textAlign = 'left';
    ry += 20 + 8;
    const gap = 3;
    const segW = (rw - gap * (s.segments.length - 1)) / s.segments.length;
    s.segments.forEach((fill, i) => {
      const sx = rx + i * (segW + gap);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      roundRect(ctx, sx, ry, segW, 6, 1);
      ctx.fill();
      if (fill > 0) {
        ctx.fillStyle = ORANGE;
        roundRect(ctx, sx, ry, segW * fill, 6, 1);
        ctx.fill();
      }
    });
    ry += 6;
  });

  // Axis.
  ry += 16 + 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rx, ry);
  ctx.lineTo(rx + rw, ry);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  [0, 0.5, 1].forEach((t) => {
    const tx = rx + rw * t;
    ctx.beginPath();
    ctx.moveTo(tx, ry - 1);
    ctx.lineTo(tx, ry + 4);
    ctx.stroke();
  });
  ry += 6 + 12;
  ctx.fillStyle = STEEL;
  ctx.font = `400 10px ${MONO}`;
  ctx.textAlign = 'left';
  ctx.fillText('0', rx, ry);
  ctx.textAlign = 'center';
  ctx.fillText('50', rx + rw / 2, ry);
  ctx.textAlign = 'right';
  ctx.fillText('100', rx + rw, ry);
  ctx.textAlign = 'left';

  ry += 16 + 12;
  ctx.font = `400 11px ${MONO}`;
  wrap(ctx, 'One segment is five points of trait score. Eight traits weighted per node, normalized to 100, top four shown.', rw)
    .forEach((line) => {
      ctx.fillText(line, rx, ry);
      ry += 16;
    });

  // ── Bottom: the three miniature trees and the URL ───────────────────────
  const by = CARD_H - PAD;
  const miniScale = 206 / 168;
  const xs = [4, 13, 22, 31, 40];
  ctx.save();
  ctx.translate(left, by - 54);
  ctx.scale(miniScale, miniScale);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  d.trees.forEach((tree, ti) => {
    ctx.save();
    ctx.translate(ti * 62, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(22, 38); ctx.lineTo(22, 26);
    ctx.moveTo(4, 26); ctx.lineTo(40, 26);
    xs.forEach((x) => { ctx.moveTo(x, 26); ctx.lineTo(x, 8); });
    ctx.stroke();
    const lit = tree.levels.map((lv, i) => ({ lv, x: xs[i] })).sort((a, b) => a.lv - b.lv);
    lit.forEach((b) => {
      if (b.lv <= 0) return;
      ctx.strokeStyle = alpha(ORANGE, LEVEL_ALPHA[b.lv]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(22, 38);
      if (b.x === 22) {
        ctx.lineTo(22, 8);
      } else {
        ctx.lineTo(22, 26);
        ctx.lineTo(b.x, 26);
        ctx.lineTo(b.x, 8);
      }
      ctx.stroke();
    });
    tree.levels.forEach((lv, i) => {
      ctx.beginPath();
      ctx.arc(xs[i], 8, 2.4, 0, Math.PI * 2);
      if (lv > 0) {
        ctx.fillStyle = alpha(ORANGE, LEVEL_ALPHA[lv]);
        ctx.fill();
      } else {
        ctx.fillStyle = INK;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    ctx.beginPath();
    ctx.arc(22, 38, 3, 0, Math.PI * 2);
    ctx.fillStyle = ORANGE;
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();

  ctx.fillStyle = STEEL;
  ctx.font = `400 11px ${MONO}`;
  drawTracked(
    ctx,
    `${d.trees.length} TREES · ${d.areaCount} AREAS · ${d.masteredCount} MASTERED`,
    left + 206 + 14,
    by - 4,
    11 * 0.08,
  );
  ctx.font = `400 12px ${MONO}`;
  drawTracked(ctx, d.url, CARD_W - PAD, by - 4, 12 * 0.04, 'right');
}

/** The card as a PNG blob at 2400 × 1260. */
export async function renderCardImage(result: TalentResult): Promise<Blob> {
  await loadFonts();
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W * SCALE;
  canvas.height = CARD_H * SCALE;
  const ctx = canvas.getContext('2d') as Ctx | null;
  if (!ctx) throw new Error('Canvas 2D is not available');
  ctx.scale(SCALE, SCALE);
  draw(ctx, cardData(result));
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

export function cardFileName(result: TalentResult): string {
  const slug = (result.intake.name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'designer'}-talent-tree.png`;
}

/** Render, then trigger the download. */
export async function downloadCard(result: TalentResult): Promise<void> {
  const blob = await renderCardImage(result);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = cardFileName(result);
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}
