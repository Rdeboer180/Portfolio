// ============================================
// Talent tree: the board
// Three trees on one Ink panel. On a desktop they sit side by side in the
// column layout; from 768 to 1023 they stack in the row layout; under 768 the
// panel shows one tree at a time behind a tablist. Every layout is decided by
// the SCSS from the same markup, so the three trees are always in the DOM and
// the prerender carries all thirty nodes.
//
// Nothing here is measured. Node positions and wire paths come from
// geometry.ts as data, written as custom properties and path attributes in
// the render itself, which is why this file has no layout effect.
// ============================================

import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { Allocation, Pools, TalentNode, TalentTree, Tier } from '../../data/talent/types';
import { TREES } from '../../data/talent/trees';
import type { Remaining } from '../../data/talent/economy';
import { CROWN_UNLOCK_AT, MAX_POINTS_PER_NODE, isLocked } from '../../data/talent/economy';
import Glyph from './Glyph';
import TalentNodeButton from './TalentNodeButton';
import { COLUMN, ROW, edgeOf, nodeVars } from './geometry';

export interface TalentBoardProps {
  allocation: Allocation;
  pools: Pools;
  /** What is left in each part of the pools (economy.remaining). */
  left: Remaining;
  /** False on Ryan's tree. */
  editable: boolean;
  onAdd: (nodeId: string) => void;
  onRemove: (nodeId: string) => void;
  /** Points spent per tree id and mastered count per tree id, for the tree headers. */
  perTree: Record<string, { spent: number; mastered: number }>;
  /** Unspent points across both pools, for the panel's own line. */
  unspent: number;
}

function pointsAt(allocation: Allocation, id: string): number {
  const v = allocation[id];
  return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(MAX_POINTS_PER_NODE, Math.floor(v))) : 0;
}

interface ActiveNode {
  id: string;
  /** Pinned by a click or a tap; hover and focus leaving do not clear it. */
  pinned: boolean;
}

/** The lit level a wire takes: the node it leads to, 0 when that node is locked. */
function wireLevel(allocation: Allocation, node: TalentNode): number {
  return isLocked(allocation, node.id) ? 0 : pointsAt(allocation, node.id);
}

const Wires: React.FC<{
  tree: TalentTree;
  allocation: Allocation;
  layout: 'column' | 'row';
}> = ({ tree, allocation, layout }) => {
  const spec = layout === 'column' ? COLUMN : ROW;
  // One entry per path, then drawn dimmest first so a brighter branch is never
  // painted under a duller one where two share a stretch of the bus.
  const paths = tree.areas.reduce<{ key: string; d: string; level: number }[]>((acc, area, i) => {
    acc.push({ key: `${area.id}:root`, d: spec.rootPath(i), level: wireLevel(allocation, area.nodes[0]) });
    acc.push({ key: `${area.id}:crown`, d: spec.crownPath(i), level: wireLevel(allocation, area.nodes[1]) });
    return acc;
  }, []);
  paths.sort((a, b) => a.level - b.level);
  return (
    <svg
      className={`tt-wires tt-wires--${layout}`}
      viewBox={`0 0 ${spec.width} ${spec.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((p) => (
        <path
          key={p.key}
          className={`tt-wire tt-wire--l${p.level}`}
          d={p.d}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
};

interface DetailProps {
  tree: TalentTree;
  node: TalentNode;
  index: number;
  tier: Tier;
  points: number;
  /** The branch's foundation points, for a crown's lock line. */
  foundationPoints: number;
  locked: boolean;
  editable: boolean;
  canAdd: boolean;
  onAdd: (nodeId: string) => void;
  onRemove: (nodeId: string) => void;
}

/**
 * The node's detail: a tooltip 8px above the node for pointer and keyboard
 * users, and a block under the tree on a phone, where it also carries the
 * full-size add and remove controls a thumb needs. Same element, placed by
 * the SCSS. The button already describes itself to AT (name, tier, points,
 * meaning), so this is the sighted reader's copy of the same facts.
 */
const Detail: React.FC<DetailProps> = ({
  tree, node, index, tier, points, foundationPoints, locked, editable, canAdd, onAdd, onRemove,
}) => {
  const crown = tree.areas[index].nodes[1];
  let foot: string;
  if (tier === 'crown') {
    foot = locked
      ? `Locked · foundation holds ${foundationPoints} of ${CROWN_UNLOCK_AT}`
      : `Unlocked at foundation ${CROWN_UNLOCK_AT} · foundation holds ${foundationPoints}`;
  } else {
    foot = points >= CROWN_UNLOCK_AT
      ? `Unlocks ${crown.name}`
      : `${crown.name} unlocks at ${CROWN_UNLOCK_AT}`;
  }
  return (
    <div className="tt-detail" style={nodeVars(tier, index)} data-edge={edgeOf(index, tree)}>
      <div className="tt-detail__head">
        <span className="tt-detail__name">{node.name}</span>
        <span className="tt-detail__level">{`${points} / ${MAX_POINTS_PER_NODE} · ${tier}`}</span>
      </div>
      <p className="tt-detail__meaning">{node.meaning}</p>
      <p className="tt-detail__foot">{foot}</p>
      {editable && (
        <div className="tt-detail__actions">
          <button
            type="button"
            className="tt-detail__btn"
            onClick={() => onRemove(node.id)}
            disabled={points <= 0}
          >
            Remove a point
          </button>
          <button
            type="button"
            className="tt-detail__btn tt-detail__btn--add"
            onClick={() => onAdd(node.id)}
            disabled={locked || !canAdd}
          >
            Add a point
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * "Craft tree 16 locked · Systems 4 locked · 43 free · 21 core", each part
 * counting down. The locked parts only appear when the degree put them there.
 */
export function poolsLine(left: Remaining, pools: Pools): string {
  const parts: string[] = [];
  if (pools.craftLocked > 0) parts.push(`Craft tree ${left.craftLocked} locked`);
  if (pools.systemsLocked > 0) parts.push(`Systems ${left.systemsLocked} locked`);
  parts.push(`${left.free} free`);
  parts.push(`${left.core} core`);
  return parts.join(' · ');
}

const TalentBoard: React.FC<TalentBoardProps & { canAdd: (nodeId: string) => boolean }> = ({
  allocation,
  pools,
  left,
  editable,
  onAdd,
  onRemove,
  perTree,
  unspent,
  canAdd,
}) => {
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState<ActiveNode | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activate = useCallback((id: string, pinned: boolean) => {
    setActive((cur) => {
      // A second pin on the same node releases it.
      if (pinned && cur && cur.id === id && cur.pinned) return null;
      if (cur && cur.id === id) return { id, pinned: pinned || cur.pinned };
      return { id, pinned };
    });
  }, []);
  const deactivate = useCallback((id: string) => {
    setActive((cur) => (cur && cur.id === id && !cur.pinned ? null : cur));
  }, []);

  const onKeyDownCapture = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setActive(null);
  }, []);

  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === 'ArrowRight') next = (i + 1) % TREES.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + TREES.length) % TREES.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TREES.length - 1;
    else return;
    e.preventDefault();
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  const capacity = useMemo(
    () => TREES.map((t) => t.areas.length * 2 * MAX_POINTS_PER_NODE),
    [],
  );

  return (
    <div className="tt-panel" onKeyDownCapture={onKeyDownCapture}>
      <div className="tt-panel__top">
        <div className="tt-panel__title-row">
          <h3 className="tt-panel__title">{editable ? 'Spend your points' : 'Where the points went'}</h3>
          <span className="tt-panel__index" aria-hidden="true">Three trees</span>
        </div>
        <p className="tt-panel__line">
          {`${pools.craft} craft on two trees · ${pools.core} core on one · ${unspent} unspent`}
        </p>
        {editable && (
          <p className="tt-panel__line tt-panel__line--left">
            {`Left to spend · ${poolsLine(left, pools)}`}
          </p>
        )}
      </div>

      <div className="tt-tabs" role="tablist" aria-label="Trees">
        {TREES.map((tree, i) => (
          <button
            key={tree.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            id={`tt-tab-${tree.id}`}
            className={`tt-tabs__tab${tab === i ? ' is-selected' : ''}`}
            aria-selected={tab === i}
            aria-controls={`tt-tree-${tree.id}`}
            tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            <span className="tt-tabs__name">{tree.name}</span>
            <span className="tt-tabs__count">{`${perTree[tree.id].spent} / ${capacity[i]}`}</span>
          </button>
        ))}
      </div>

      <div className="tt-trees">
        {TREES.map((tree, ti) => {
          const stats = perTree[tree.id];
          const activeArea = active
            ? tree.areas.findIndex((a) => a.nodes.some((n) => n.id === active.id))
            : -1;
          const activeNode = activeArea >= 0 && active
            ? tree.areas[activeArea].nodes.find((n) => n.id === active.id)
            : undefined;
          return (
            <div
              key={tree.id}
              id={`tt-tree-${tree.id}`}
              role="tabpanel"
              aria-labelledby={`tt-tab-${tree.id}`}
              className={`tt-tree-panel${tab === ti ? '' : ' is-inactive'}`}
            >
              <div className="tt-tree-head">
                <h4 className="tt-tree-head__name">{tree.name}</h4>
                <p className="tt-tree-head__meta">
                  {`Root ${tree.root.name} · ${stats.spent} ${tree.pool === 'core' ? 'core points' : 'points'} · ${stats.mastered} mastered`}
                </p>
              </div>
              <div className="tt-tree-wrap">
                <div className="tt-tree">
                  <Wires tree={tree} allocation={allocation} layout="column" />
                  <Wires tree={tree} allocation={allocation} layout="row" />
                  {tree.areas.map((area, i) => {
                    const [foundation, crown] = area.nodes;
                    const fp = pointsAt(allocation, foundation.id);
                    const crownLocked = isLocked(allocation, crown.id);
                    return (
                      <React.Fragment key={area.id}>
                        <TalentNodeButton
                          node={foundation}
                          index={i}
                          points={fp}
                          locked={false}
                          editable={editable}
                          active={!!active && active.id === foundation.id}
                          onAdd={onAdd}
                          onRemove={onRemove}
                          onActivate={activate}
                          onDeactivate={deactivate}
                        />
                        <TalentNodeButton
                          node={crown}
                          index={i}
                          points={pointsAt(allocation, crown.id)}
                          locked={crownLocked}
                          foundationName={foundation.name}
                          editable={editable}
                          active={!!active && active.id === crown.id}
                          onAdd={onAdd}
                          onRemove={onRemove}
                          onActivate={activate}
                          onDeactivate={deactivate}
                        />
                      </React.Fragment>
                    );
                  })}
                  <div className="tt-root" style={nodeVars('root', 0)}>
                    <span className="tt-root__circle">
                      <Glyph name={tree.root.glyph} size={24} />
                    </span>
                    <span className="tt-root__text">
                      <span className="tt-root__label">{tree.root.name}</span>
                      <span className="tt-root__tag">Root</span>
                    </span>
                  </div>
                </div>
                {activeNode && active && (
                  <Detail
                    tree={tree}
                    node={activeNode}
                    index={activeArea}
                    tier={activeNode.tier}
                    points={pointsAt(allocation, activeNode.id)}
                    foundationPoints={pointsAt(allocation, tree.areas[activeArea].nodes[0].id)}
                    locked={isLocked(allocation, activeNode.id)}
                    editable={editable}
                    canAdd={canAdd(activeNode.id)}
                    onAdd={onAdd}
                    onRemove={onRemove}
                  />
                )}
              </div>
              <div className="tt-tree-nav">
                {ti > 0 && (
                  <button type="button" className="tt-tree-nav__btn" onClick={() => { setTab(ti - 1); tabRefs.current[ti - 1]?.focus(); }}>
                    {`← ${TREES[ti - 1].name}`}
                  </button>
                )}
                {ti < TREES.length - 1 && (
                  <button type="button" className="tt-tree-nav__btn tt-tree-nav__btn--next" onClick={() => { setTab(ti + 1); tabRefs.current[ti + 1]?.focus(); }}>
                    {`${TREES[ti + 1].name} →`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="tt-legend">
        <ul className="tt-legend__scale" aria-label="Node scale">
          {['unspent', 'locked', '1', '2', '3', '4', 'mastered'].map((k) => (
            <li key={k} className={`tt-legend__item tt-legend__item--${k}`}>
              <span className="tt-legend__swatch" aria-hidden="true" />
              <span className="tt-legend__text">{k}</span>
            </li>
          ))}
        </ul>
        <p className="tt-legend__note">
          {editable
            ? `Crown unlocks at foundation ${CROWN_UNLOCK_AT} · Shift-click or Backspace removes a point · Earned by time, not self-rated`
            : `Crown unlocks at foundation ${CROWN_UNLOCK_AT} · Level mark on hover · Earned by time, not self-rated`}
        </p>
      </div>
    </div>
  );
};

export default TalentBoard;
