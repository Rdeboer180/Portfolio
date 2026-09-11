// ============================================
// Talent tree: the result
// "Here is where the points ended up." The card on the left with the receipt
// beneath it; on the right, why the two archetypes fit (the pair description
// from data, then the nodes that argued for each one), the two class rows,
// and the actions: save the card as an image, copy the link that carries the
// points, and the door back to the portfolio. "See Ryan's tree" is always
// here so the page still works as a portfolio artifact after a visitor has
// built their own.
// ============================================

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Pools, TalentResult as TalentResultData } from '../../data/talent/types';
import { FAMILY_LABEL, TRAIT_LABEL } from '../../data/talent/types';
import { getProjectsHref } from '../../utils/homeSession';
import TalentCard from './TalentCard';
import { cardData, explainArchetype, leadTrait } from './cardData';

export type CopyState = 'idle' | 'copied' | 'failed';

export interface TalentResultProps {
  result: TalentResultData;
  pools: Pools;
  /** True while Ryan's tree is showing; the restore button then only scrolls. */
  isRyan: boolean;
  shareUrl: string;
  saving: boolean;
  onSave: () => void;
  copyState: CopyState;
  onCopy: () => void;
  onSeeRyan: () => void;
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 12.5l2.5 2.5 5.5-5.5" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M3 21l9-9" />
    <path d="M16.5 3c0 2.5 2 4.5 4.5 4.5-2.5 0-4.5 2-4.5 4.5 0-2.5-2-4.5-4.5-4.5 2.5 0 4.5-2 4.5-4.5z" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="M21 15.5l-4.5-4.5L8 19.5" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1" />
    <path d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1-1" />
  </svg>
);

const BranchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="18.6" r="2.2" />
    <path d="M12 16.4V11.6M12 11.6L6.6 6.8M12 11.6L17.4 6.8" />
    <circle cx="5.6" cy="5.6" r="2.2" fill="currentColor" />
    <circle cx="18.4" cy="5.6" r="2.2" fill="currentColor" />
  </svg>
);

const TalentResult: React.FC<TalentResultProps> = ({
  result, pools, isRyan, shareUrl, saving, onSave, copyState, onCopy, onSeeRyan,
}) => {
  const data = cardData(result);
  const total = pools.craft + pools.core;
  const craftLines = pools.receipt.filter((r) => r.pool === 'craft');
  const coreLines = pools.receipt.filter((r) => r.pool === 'core');
  const primaryTrait = leadTrait(result.primary);
  const secondaryTrait = leadTrait(result.secondary);
  const urlRef = useRef<HTMLInputElement>(null);

  // When the clipboard is unavailable the URL is shown instead, selected, so
  // one keystroke still copies it.
  useEffect(() => {
    if (copyState === 'failed' && urlRef.current) {
      urlRef.current.focus();
      urlRef.current.select();
    }
  }, [copyState]);

  const copyLabel = copyState === 'copied' ? 'Link copied' : copyState === 'failed' ? 'Copy the link below' : 'Copy link';

  return (
    <div className="tt-result">
      <div className="tt-result__head">
        <p className="tt-eyebrow">Result</p>
        <h2 className="tt-result__title" id="tt-result-title" data-tt-focus tabIndex={-1}>
          Here is where the points ended up.
        </h2>
        <p className="tt-result__lede">
          {`${total} points, three trees, eight traits. The two strongest traits from different families pick the class. The numbers are computed from where the points went, never hand-set.`}
        </p>
      </div>

      <div className="tt-result__card-frame">
        <TalentCard data={data} />
      </div>

      <div className="tt-result__receipt">
        <p className="tt-eyebrow">{`Where the ${total} points came from`}</p>
        <ul className="tt-result__chips">
          {craftLines.map((r) => (
            <li key={r.label} className="tt-result__chip">{r.label}</li>
          ))}
          <li className="tt-result__chip tt-result__chip--sum">{`= ${pools.craft} craft`}</li>
          {coreLines.map((r) => (
            <li key={r.label} className="tt-result__chip">{`${r.label} · ${r.note}`}</li>
          ))}
          <li className="tt-result__chip tt-result__chip--sum">{`= ${total} points · Level ${pools.level}`}</li>
        </ul>
      </div>

      <div className="tt-result__grid">
        <div className="tt-result__main">
          <p className="tt-eyebrow">The class</p>
          <h3 className="tt-result__why" id="tt-result-why">Why this combination</h3>
          <p className="tt-result__body">{result.description}</p>
          <p className="tt-result__body">
            {`${explainArchetype(result.primary, result.allocation)} ${explainArchetype(result.secondary, result.allocation)}`}
          </p>
          <ul className="tt-result__classes">
            {[
              { a: result.primary, trait: primaryTrait, icon: <CheckIcon /> },
              { a: result.secondary, trait: secondaryTrait, icon: <SparkIcon /> },
            ].map(({ a, trait, icon }) => (
              <li key={a.id} className="tt-result__class">
                <span className="tt-result__class-icon" aria-hidden="true">{icon}</span>
                <span className="tt-result__class-text">
                  <span className="tt-result__class-name">{a.name}</span>
                  <span className="tt-result__class-line">{a.line}</span>
                </span>
                <span className="tt-result__class-meta">
                  <span className="tt-result__class-family">{FAMILY_LABEL[a.family]}</span>
                  <span className="tt-result__class-led">{`led by ${TRAIT_LABEL[trait]} ${result.traits[trait]}`}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="tt-result__side" aria-label="Share and return">
          <p className="tt-eyebrow">Share</p>
          <div className="tt-result__actions">
            <button
              type="button"
              className="btn btn--primary btn--lg tt-result__btn"
              onClick={onSave}
              disabled={saving}
            >
              <ImageIcon />
              <span>{saving ? 'Rendering' : 'Save as image'}</span>
            </button>
            <button type="button" className="btn btn--secondary btn--lg tt-result__btn" onClick={onCopy}>
              <LinkIcon />
              <span>{copyLabel}</span>
            </button>
          </div>
          <p className="tt-result__note" aria-live="polite">
            {copyState === 'copied' ? 'Copied. The link carries your points. Nothing is stored.' : 'The link carries your points. Nothing is stored.'}
          </p>
          {copyState === 'failed' && (
            <input
              ref={urlRef}
              readOnly
              className="tt-result__url"
              value={shareUrl}
              aria-label="Share link"
              onFocus={(e) => e.currentTarget.select()}
            />
          )}

          <hr className="tt-rule" />

          <p className="tt-eyebrow">Back to the portfolio</p>
          <div className="tt-result__back">
            <button type="button" className="btn btn--secondary btn--lg tt-result__btn" onClick={onSeeRyan}>
              <BranchIcon />
              <span>See Ryan's tree</span>
            </button>
            <Link to={getProjectsHref()} className="tt-result__work">
              {`Explore Ryan's work →`}
            </Link>
          </div>
          <p className="tt-result__hint">
            {isRyan
              ? "This is Ryan's allocation, scored by the same rules as everyone else."
              : "Restores Ryan's allocation after you have built your own, so the page still works as a portfolio artifact."}
          </p>
        </aside>
      </div>
    </div>
  );
};

export default TalentResult;
