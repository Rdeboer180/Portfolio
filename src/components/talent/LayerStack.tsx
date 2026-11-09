// ============================================
// LayerStack — the thread (the Abilities layer of /talent-tree/)
// The three lanes drawn as three sheets pulled apart, the way a file's layers
// stack, with one thread stitched through the exact skills an ability reads.
// It is the page's argument in one picture: the class is not a skill, it is
// what connects them.
//
// Each chip is an app tile: the skill's glyph a tone off its heat, and a side
// wall as tall as its points, so a sheet reads as a shelf of installed skills
// and a 5 stands taller than a 1.
//
// A sheet is a flat 5 × 2 grid of heat chips placed by one affine matrix
// (skillTreeData's STACK_ISO), so every knot's position is arithmetic and the
// markup prerenders whole. On a phone the same data draws as three flat bands
// (STACK_FLAT). Motion is transform and opacity only: the sheets lift apart
// once, then the thread draws edge by edge; reduced motion shows it finished.
// ============================================

import React, { useRef } from 'react';
import type { AbilityState, Allocation, TreeId } from '../../data/talent/types';
import { NODES } from '../../data/talent/trees';
import Glyph from './Glyph';
import { pointsAt } from './consoleData';
import type { TreeStats } from './consoleData';
import { LANE_NAME, LANE_SHORT, STACK_FLAT, STACK_ISO, STACK_ORDER, stackChips, stackPoint, threadEdges } from './skillTreeData';

interface Props {
  flat?: boolean;
  allocation: Allocation;
  stats: Record<TreeId, TreeStats>;
  /** The ability whose recipe the thread runs through. */
  state: AbilityState;
  onOpenLane: (lane: TreeId) => void;
}

/** The sheets take this long to lift apart before the first thread draws. */
const LIFT_MS = 620;
const EDGE_STEP_MS = 140;

const LayerStack: React.FC<Props> = ({ flat = false, allocation, stats, state, onOpenLane }) => {
  const geo = flat ? STACK_FLAT : STACK_ISO;
  const { ability } = state;
  const ids = ability.formula.map((s) => s.nodeId);
  const inRecipe = new Set(ids);

  // Only the first thread waits for the sheets; a thread picked later draws at once.
  const first = useRef(ability.id);
  const moved = useRef(false);
  if (ability.id !== first.current) moved.current = true;
  const base = moved.current ? 0 : LIFT_MS;

  const edges = threadEdges(geo, ids);
  // A knot lands when the edge that reaches it finishes; the first is the anchor.
  const landsAt: Record<string, number> = { [ids[0]]: base };
  edges.forEach((e, i) => { landsAt[e.to] = base + (i + 1) * EDGE_STEP_MS; });

  const knots = state.levels.map((l) => {
    const p = stackPoint(geo, l.nodeId);
    return p ? { ...l, ...p, met: l.level >= l.min, name: NODES[l.nodeId] ? NODES[l.nodeId].name : l.nodeId } : null;
  }).filter((k): k is NonNullable<typeof k> => !!k);

  const matrix = `matrix(${geo.matrix.join(', ')}, 0, 0)`;

  return (
    <div className={`fc-stack${flat ? ' fc-stack--flat' : ''}${state.unlocked ? '' : ' is-locked'}`} style={{ width: geo.width, height: geo.height }}>
      {STACK_ORDER.map((lane, i) => (
        <button
          key={lane}
          type="button"
          className="fc-stack__sheet"
          aria-label={`Open ${LANE_NAME[lane]}, ${stats[lane].spent} points`}
          style={{
            left: geo.cx,
            top: geo.cy,
            width: geo.sheetW,
            height: geo.sheetH,
            '--dy': `${(i - 1) * geo.gap}px`,
            '--m': matrix,
            animationDelay: `${i * 60}ms`,
          } as React.CSSProperties}
          onClick={() => onOpenLane(lane)}
        >
          {flat && (
            <span className="fc-stack__band">
              <span>{LANE_SHORT[lane]}</span>
              <span>{stats[lane].spent}</span>
            </span>
          )}
          {stackChips(geo, lane).map((c) => (
            <span
              key={c.node.id}
              className={`fc-stack__chip fc-heat--${pointsAt(allocation, c.node.id)}${inRecipe.has(c.node.id) ? ' is-on' : ''}`}
              style={{ left: c.left - geo.chip / 2, top: c.top - geo.chip / 2, width: geo.chip, height: geo.chip }}
              aria-hidden="true"
            >
              <Glyph name={c.node.glyph} size={flat ? 12 : 18} />
            </span>
          ))}
        </button>
      ))}

      {!flat && STACK_ORDER.map((lane, i) => (
        <span key={lane} className="fc-stack__lane" style={{ top: geo.cy + (i - 1) * geo.gap - 92 }} aria-hidden="true">
          {`${LANE_SHORT[lane]} · ${stats[lane].spent}`}
        </span>
      ))}

      {/* Keyed by ability so a new pick redraws the thread from its first knot. */}
      <div className="fc-thread" key={ability.id} aria-hidden="true">
        {edges.map((e, i) => (
          <span
            key={`${e.from}-${e.to}`}
            className="fc-thread__edge"
            style={{ left: e.x, top: e.y, width: e.length, '--a': `${e.angle}deg`, animationDelay: `${base + i * EDGE_STEP_MS}ms` } as React.CSSProperties}
          />
        ))}
        {knots.map((k) => (
          <span
            key={k.nodeId}
            className={`fc-thread__knot${k.met ? '' : ' is-short'}`}
            style={{ left: k.x, top: k.y, animationDelay: `${landsAt[k.nodeId] ?? base}ms` }}
          >
            {!flat && (
              <span className="fc-thread__tag">
                {k.name}
                <span className="fc-thread__n">{k.met ? k.level : `${k.level} of ${k.min}`}</span>
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LayerStack;
