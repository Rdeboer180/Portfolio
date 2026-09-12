// ============================================
// The Forge rail: abilities unlock from combinations
// A fourth rail on the console, between the legend and the closing rail.
// Twelve chips, one per recipe in src/data/talent/forge.ts, ordered unlocked
// first, then the locked ones by how few points they are away. Nothing here
// is measured and nothing is read from the window: the chips are pure from
// the ability states the result already carries, so the prerendered rail and
// the first client render are the same tree.
//
// Hover, focus, or a click (which pins) hands the recipe up to the console,
// which lights those nodes and their paths. Rank badges stay stable; recipe
// requirements live in the persistent inspector alongside the catalog.
//
// On the phone the rail is a vertical list: the unlocked and the next chip
// stay open and the rest collapse behind one "7 locked" row. That row is a
// <details> with no `open` attribute, so the server and the client agree.
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import type { AbilityState } from '../../data/talent/types';
import { ARCHETYPES } from '../../data/talent/archetypes';
import { NODES, TREES } from '../../data/talent/trees';
import Glyph from './Glyph';

export interface TalentForgeProps {
  abilities: AbilityState[];
  /** The recipe currently up: hovered, focused, or pinned. */
  activeId: string | null;
  /** True while the id above came from a click rather than a hover. */
  pinnedId: string | null;
  onHover: (id: string | null) => void;
  onPin: (id: string) => void;
  /** The phone list rather than the wrapping grid. */
  phone: boolean;
  onInspect: (nodeId: string) => void;
}

function abilityLine(state: AbilityState): string {
  return state.ability.line || ARCHETYPES.find((a) => a.id === state.ability.archetypeId)?.line || '';
}

/** The chip's mark: the glyph of the first node in the recipe. */
export function abilityGlyph(state: AbilityState): string {
  const first = state.ability.formula[0];
  const node = first ? NODES[first.nodeId] : undefined;
  return node ? node.glyph : 'branch';
}

export type ChipState = 'unlocked' | 'next' | 'locked';

/** Unlocked, then the nearest locked one as "next", then the rest. */
export function chipStates(abilities: AbilityState[]): { state: AbilityState; kind: ChipState }[] {
  let nextTaken = false;
  return abilities.map((state) => {
    if (state.unlocked) return { state, kind: 'unlocked' as ChipState };
    if (!nextTaken) {
      nextTaken = true;
      return { state, kind: 'next' as ChipState };
    }
    return { state, kind: 'locked' as ChipState };
  });
}

/** "UNLOCKED", "NEXT · 2 POINTS AWAY", "LOCKED". */
export function chipTag(kind: ChipState, missing: number): string {
  if (kind === 'unlocked') return 'Unlocked';
  if (kind === 'next') return `Next · ${missing} ${missing === 1 ? 'point' : 'points'} away`;
  return 'Locked';
}

/** "Guardrail Architect, unlocked" / ", next, 2 points away" / ", locked". */
export function chipLabel(name: string, kind: ChipState, missing: number): string {
  if (kind === 'unlocked') return `${name}, unlocked`;
  if (kind === 'next') return `${name}, next, ${missing} ${missing === 1 ? 'point' : 'points'} away`;
  return `${name}, locked`;
}

const Chip: React.FC<{
  state: AbilityState;
  kind: ChipState;
  active: boolean;
  pinned: boolean;
  onHover: (id: string | null) => void;
  onPin: (id: string) => void;
  bloom?: boolean;
}> = ({ state, kind, active, pinned, onHover, onPin, bloom }) => {
  const id = state.ability.id;
  return (
    <li className="tt-forge__cell">
      <button
        type="button"
        id={`tt-ability-${id}`}
        className={`tt-chip tt-chip--${kind}${active ? ' is-active' : ''}${bloom ? ' is-bloom' : ''}`}
        aria-pressed={pinned}
        aria-label={chipLabel(state.ability.name, kind, state.missing)}
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(id)}
        onBlur={() => onHover(null)}
        onClick={() => onPin(id)}
      >
        <span className="tt-chip__glyph" aria-hidden="true"><Glyph name={abilityGlyph(state)} size={20} /></span>
        <span className="tt-chip__body">
          <span className="tt-chip__row">
            <span className="tt-chip__name">{state.ability.name}</span>
            <span className="tt-chip__tag">{chipTag(kind, state.missing)}</span>
          </span>
          <span className="tt-chip__description">{abilityLine(state)}</span>
        </span>
      </button>
    </li>
  );
};

/** How long the mastery bloom runs, per _talent-tree.scss. */
const BLOOM_MS = 300;

/**
 * The ids that have just crossed into unlocked. Client only: the ref starts
 * empty, so the first render after mount blooms nothing and the prerendered
 * markup carries no bloom class.
 */
function useJustUnlocked(abilities: AbilityState[]): Record<string, boolean> {
  const seen = useRef<Set<string> | null>(null);
  const [bloom, setBloom] = useState<Record<string, boolean>>({});
  const ids = abilities.filter((a) => a.unlocked).map((a) => a.ability.id).join(',');
  useEffect(() => {
    const now = new Set(ids ? ids.split(',') : []);
    const before = seen.current;
    seen.current = now;
    if (!before) return;
    const fresh: Record<string, boolean> = {};
    now.forEach((id) => { if (!before.has(id)) fresh[id] = true; });
    if (!Object.keys(fresh).length) return;
    setBloom(fresh);
    const t = window.setTimeout(() => setBloom({}), BLOOM_MS);
    return () => window.clearTimeout(t);
  }, [ids]);
  return bloom;
}

const TalentForge: React.FC<TalentForgeProps> = ({ abilities, activeId, pinnedId, onHover, onPin, phone, onInspect }) => {
  const bloom = useJustUnlocked(abilities);
  const chips = chipStates(abilities);
  const unlocked = abilities.filter((a) => a.unlocked).length;
  const active = abilities.find((a) => a.ability.id === activeId) || null;
  const inspected = abilities.find((a) => a.ability.id === pinnedId) || abilities[0];
  const open = chips.filter((c) => c.kind !== 'locked');
  const hidden = chips.filter((c) => c.kind === 'locked');

  const render = (c: { state: AbilityState; kind: ChipState }) => (
    <Chip
      key={c.state.ability.id}
      state={c.state}
      kind={c.kind}
      active={activeId === c.state.ability.id}
      pinned={pinnedId === c.state.ability.id}
      onHover={onHover}
      onPin={onPin}
      bloom={bloom[c.state.ability.id]}
    />
  );

  return (
    <div className="tt-forge" role="group" aria-label="The Forge">
      <div className="tt-forge__head">
        <span className="tt-forge__caret" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M6 9l6 6 6-6" /></svg>
        </span>
        <span className="tt-forge__key">The Forge</span>
        <span className="tt-forge__sub">
          {'Abilities unlock from combinations · '}
          <span className="tt-forge__n">{`${unlocked} of ${abilities.length}`}</span>
        </span>
        <span className="tt-forge__hover">
          {active
            ? `${pinnedId ? 'Selected' : 'Preview'} · ${active.ability.name} · recipe lit on the trees`
            : 'Select an ability to inspect its recipe'}
        </span>
      </div>
      <div className="tt-forge__workspace">
      <div className="tt-forge__catalog">
      {phone ? (
        <>
          <ul className="tt-forge__list">{open.map(render)}</ul>
          {hidden.length > 0 && (
            <details className="tt-forge__more">
              <summary className="tt-forge__more-head">
                <span className="tt-forge__more-key">{`${hidden.length} locked`}</span>
                <span className="tt-forge__more-names">{hidden.map((c) => c.state.ability.name).join(', ')}</span>
              </summary>
              <ul className="tt-forge__list">{hidden.map(render)}</ul>
            </details>
          )}
        </>
      ) : (
        <ul className="tt-forge__grid">{chips.map(render)}</ul>
      )}
      </div>
      {inspected && (
        <section className="tt-recipe" id="tt-recipe-inspector" aria-label="Ability recipe">
          <div className="tt-recipe__eyebrow">
            <span>{pinnedId ? 'Selected ability' : 'Featured ability'}</span>
            {pinnedId && <button type="button" onClick={() => {
              onPin(pinnedId);
              document.getElementById(`tt-ability-${pinnedId}`)?.focus();
            }}>Clear selection</button>}
          </div>
          <h3>{inspected.ability.name}</h3>
          <p className="tt-recipe__description">{abilityLine(inspected)}</p>
          <p className="tt-recipe__status">{inspected.unlocked ? 'Unlocked · all requirements met' : `${inspected.missing} ${inspected.missing === 1 ? 'point' : 'points'} from unlocking`}</p>
          <ul className="tt-recipe__requirements">
            {inspected.levels.map((requirement) => {
              const tree = TREES.find((t) => t.areas.some((area) => area.nodes.some((n) => n.id === requirement.nodeId)));
              const met = requirement.level >= requirement.min;
              return (
                <li key={requirement.nodeId}>
                  <button type="button" onClick={() => {
                    if (pinnedId !== inspected.ability.id) onPin(inspected.ability.id);
                    onInspect(requirement.nodeId);
                  }} aria-label={`Inspect ${NODES[requirement.nodeId].name} in ${tree?.name}: requires ${requirement.min}, invested ${requirement.level}, ${met ? 'met' : 'not met'}`}>
                    <span className="tt-recipe__skill">{NODES[requirement.nodeId].name}<small>{tree?.name}</small></span>
                    <span className="tt-recipe__numbers">Requires {requirement.min} · You have {requirement.level}<small className={met ? 'is-met' : ''}>{met ? '✓ Met' : `${requirement.min - requirement.level} more needed`} <span aria-hidden="true">↗</span></small></span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="tt-recipe__hint">Choose a skill to find it on the tree. Points stay invested in skills.</p>
        </section>
      )}
      </div>
    </div>
  );
};

export default TalentForge;
