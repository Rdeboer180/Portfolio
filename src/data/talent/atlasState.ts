import type { Allocation, Intake, Pools, TreeId } from './types';
import { computePools } from './economy';
import { decodeState } from './score';
import { RYAN_ALLOCATION, RYAN_INTAKE } from './ryan';
import { ATLAS_ABILITIES, ATLAS_SKILLS, ATLAS_SKILL_BY_ID, atlasPoints } from './atlas';

export interface AtlasBuild {
  intake: Intake;
  allocation: Allocation;
  /** Explicit credit approved by Ryan; separate from degree, years, and recent-hours awards. */
  craftCredit: number;
  discovered: string[];
}

export const RYAN_ATLAS: AtlasBuild = {
  intake: RYAN_INTAKE,
  allocation: { ...RYAN_ALLOCATION, 'raster-craft': 3, 'vector-design': 5, governance: 4, prototyping: 3, 'state-modeling': 3, handoff: 4, html: 3, css: 5, git: 2, automation: 2, 'agent-context': 4 },
  craftCredit: 0,
  discovered: [],
};

export const FORGE_POINTS_PER_YEAR = 4;

export function atlasPools(intake: Intake, craftCredit = 0): Pools {
  const pools = computePools(intake, FORGE_POINTS_PER_YEAR);
  const credit = Number.isFinite(craftCredit) ? Math.max(0, Math.min(10, Math.floor(craftCredit))) : 0;
  return { ...pools, total: pools.total + credit, designLocked: pools.designLocked + credit,
    receipt: credit ? [...pools.receipt, { points: credit, label: `+${credit} · prior visual craft credit`, note: 'Additional credit allocated to visual craft; separate from the time-based awards.', pool: 'points', lockedTo: 'design' }] : pools.receipt };
}

export function normalizeAtlas(allocation: Allocation): Allocation {
  const clean: Allocation = {};
  ATLAS_SKILLS.forEach((skill) => { const points = atlasPoints(allocation, skill.id); if (points) clean[skill.id] = points; });
  ATLAS_SKILLS.forEach((skill) => {
    if (skill.prerequisite && atlasPoints(clean, skill.prerequisite.skillId) < skill.prerequisite.points) delete clean[skill.id];
  });
  return clean;
}

export function atlasSpent(allocation: Allocation): Record<TreeId, number> {
  const spent = { design: 0, technical: 0, code: 0 };
  ATLAS_SKILLS.forEach((skill) => { spent[skill.territory] += atlasPoints(allocation, skill.id); });
  return spent;
}

export function atlasWithinBudget(allocation: Allocation, pools: Pools): boolean {
  const spent = atlasSpent(allocation);
  return Math.max(0, spent.design - pools.designLocked) + Math.max(0, spent.code - pools.codeLocked) + spent.technical <= pools.free;
}

export function changeAtlasPoint(allocation: Allocation, id: string, delta: 1 | -1, pools: Pools): Allocation {
  const skill = ATLAS_SKILL_BY_ID[id];
  if (!skill) return allocation;
  const current = atlasPoints(allocation, id);
  if ((delta === 1 && current === 5) || (delta === -1 && current === 0)) return allocation;
  if (delta === 1 && skill.prerequisite && atlasPoints(allocation, skill.prerequisite.skillId) < skill.prerequisite.points) return allocation;
  const next = normalizeAtlas({ ...allocation, [id]: current + delta });
  return atlasWithinBudget(next, pools) ? next : allocation;
}

/** Reapply legal investments deterministically when an experience answer reduces the budget. */
export function clampAtlas(allocation: Allocation, pools: Pools): Allocation {
  let clean: Allocation = {};
  ATLAS_SKILLS.forEach((skill) => {
    for (let point = 0; point < atlasPoints(allocation, skill.id); point += 1) clean = changeAtlasPoint(clean, skill.id, 1, pools);
  });
  return clean;
}

/** v6 uses stable skill ids; adding nodes never shifts somebody's old allocation. */
export function encodeAtlas(build: AtlasBuild): string {
  return `v6.${encodeURIComponent(JSON.stringify({ ...build, intake: { ...build.intake, name: build.intake.name.trim().slice(0, 60) }, allocation: normalizeAtlas(build.allocation) }))}`;
}

export function decodeAtlas(raw: string): AtlasBuild | null {
  if (!raw.startsWith('v6.')) {
    const legacy = decodeState(raw);
    return legacy ? { ...legacy, craftCredit: 0, discovered: [] } : null;
  }
  if (raw.length > 12000) return null;
  try {
    const build = JSON.parse(decodeURIComponent(raw.slice(3))) as AtlasBuild;
    const intake = build.intake;
    if (!intake || !['none', 'self-taught', 'associate', 'bachelors', 'masters'].includes(intake.degree) ||
      !['graphic', 'web', 'other'].includes(intake.major) || !['none', 'graphic', 'web'].includes(intake.minor) ||
      typeof intake.name !== 'string' || intake.name.length > 60 || !Number.isInteger(intake.years) || intake.years < 0 || intake.years > 99 ||
      !Number.isInteger(intake.hours) || intake.hours < 0 || intake.hours > 5 ||
      (intake.split !== undefined && (!Number.isInteger(intake.split) || intake.split < 0 || intake.split > 100 || intake.split % 10 !== 0)) ||
      !Number.isInteger(build.craftCredit) || build.craftCredit < 0 || build.craftCredit > 10 ||
      !build.allocation || typeof build.allocation !== 'object' || Array.isArray(build.allocation) ||
      !Array.isArray(build.discovered) || build.discovered.some((id) => !ATLAS_ABILITIES.some((a) => a.id === id))) return null;
    const clean = normalizeAtlas(build.allocation);
    if (Object.keys(build.allocation).some((id) => !ATLAS_SKILL_BY_ID[id] || !Number.isInteger(build.allocation[id]) || build.allocation[id] < 0 || build.allocation[id] > 5 || (clean[id] || 0) !== build.allocation[id])) return null;
    return atlasWithinBudget(clean, atlasPools(intake, build.craftCredit)) ? { intake, allocation: clean, craftCredit: build.craftCredit, discovered: Array.from(new Set(build.discovered)) } : null;
  } catch { return null; }
}
