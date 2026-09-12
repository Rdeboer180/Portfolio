// ============================================
// Talent console: the points ledger
// One tick per point in the console's header rail, build mode only, once the
// intake is complete. Three groups, from computePools and remaining(): design
// locked, code locked, free. A tick lights Signal Orange as its
// point is spent; unspent ticks sit at white 14%. Pure DOM, no canvas; the
// groups are keyed to the pool sizes so a change to the intake rebuilds the
// row rather than reflowing it (ConsoleBuildDone.dc.html is the spec).
// ============================================

import React from 'react';
import type { Remaining } from '../../data/talent/economy';
import type { Pools } from '../../data/talent/types';

export interface TalentLedgerProps {
  pools: Pools;
  left: Remaining;
}

interface LedgerGroup {
  key: keyof Remaining;
  label: string;
  total: number;
  spent: number;
}

/** The three groups, in the order the rail prints them; a group with no points is left out. */
export function ledgerGroups(pools: Pools, left: Remaining): LedgerGroup[] {
  const groups: LedgerGroup[] = [
    { key: 'designLocked', label: 'Design locked', total: pools.designLocked, spent: pools.designLocked - left.designLocked },
    { key: 'codeLocked', label: 'Code locked', total: pools.codeLocked, spent: pools.codeLocked - left.codeLocked },
    { key: 'free', label: 'Free', total: pools.free, spent: pools.free - left.free },
  ];
  return groups
    .filter((g) => g.total > 0)
    .map((g) => ({ ...g, spent: Math.max(0, Math.min(g.total, g.spent)) }));
}

const TalentLedger: React.FC<TalentLedgerProps> = ({ pools, left }) => {
  const groups = ledgerGroups(pools, left);
  if (!groups.length) return null;
  const spent = groups.reduce((s, g) => s + g.spent, 0);
  const total = groups.reduce((s, g) => s + g.total, 0);
  return (
    <div className="tt-ledger" role="group" aria-label={`Points ledger, ${spent} of ${total} spent`}>
      <p className="tt-ledger__head">Points ledger · one tick per point · lit when spent</p>
      <div className="tt-ledger__groups">
        {groups.map((g) => (
          <div key={`${g.key}-${g.total}`} className="tt-ledger__group">
            <span className="tt-ledger__ticks" aria-hidden="true">
              {Array.from({ length: g.total }, (_, i) => (
                <span key={i} className={`tt-ledger__tick${i < g.spent ? ' is-lit' : ''}`} />
              ))}
            </span>
            <span className="tt-ledger__label">
              {`${g.label} `}
              <span className="tt-ledger__n">{g.spent}</span>
              {` / ${g.total}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentLedger;
