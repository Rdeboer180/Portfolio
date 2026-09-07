// ============================================
// ProcessStrengths — the homepage Strengths list, relocated and re-evidenced
// Skills.tsx asserted 22 phrases on the homepage with no link, number, or
// verification path — 966px of claim. Reproducing it here would only move
// that problem. So the surviving phrases are grouped by who the work was with
// and set as the mono meta of that relationship, and each row carries the
// person who said so: a verbatim fragment of a recommendation that appears
// in full in the homepage Testimonials section and on LinkedIn. The writing
// row cites the artifact instead. Which phrases were dropped, merged, or
// deduplicated against the Technical section — and why — is recorded with
// the data in data/about.tsx.
//
// Sits directly under the circuit in the About page's approach tab, on the
// same paper, separated by a hairline. Rows are a <dl>: the relationship is
// the term; the phrases and the voucher are its descriptions.
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { strengthRows, StrengthVoucher } from '../data/about';
import { SITE } from '../data/site';
import { getHomeHref } from '../utils/homeSession';
import { useReveal } from '../hooks/useReveal';

const d = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

const Voucher: React.FC<{ voucher: StrengthVoucher }> = ({ voucher }) =>
  voucher.kind === 'person' ? (
    <p className="process-strengths__voucher">
      <q className="process-strengths__quote">{voucher.quote}</q>{' '}
      <span className="process-strengths__source">
        <span className="process-strengths__name">{voucher.name}</span>
        {/* The dot is for the eye; the comma is for the reading order. */}
        <span aria-hidden="true"> · </span>
        <span className="sr-only">, </span>
        <span className="process-strengths__role">{voucher.role}</span>
      </span>
    </p>
  ) : (
    <p className="process-strengths__voucher">
      <Link to={voucher.to} className="process-strengths__artifact">
        <span>{voucher.label}</span>{' '}
        <small>{voucher.to}</small>
      </Link>
    </p>
  );

const ProcessStrengths: React.FC = () => {
  const [ref, visible] = useReveal<HTMLDListElement>(0.15);

  return (
    <section className="process-strengths" aria-labelledby="process-strengths-heading">
      <div className="process-strengths__inner">
        <div className="process-strengths__head">
          <p className="process-strengths__label">[ Strengths ]</p>
          <h2 id="process-strengths-heading" className="process-strengths__title">
            In other people’s words
          </h2>
          <p className="process-strengths__intro">
            A list of strengths is a claim. These are the ones the people I worked with have put in
            writing, grouped by who I was working with at the time. Each line is theirs, not mine.
          </p>
        </div>

        <dl ref={ref} className={`process-strengths__rows${visible ? ' is-visible' : ''}`}>
          {strengthRows.map((row, i) => (
            <div key={row.with} className="process-strengths__row reveal-fade" style={d(i * 70)}>
              <dt className="process-strengths__with">{row.with}</dt>
              {/* A real list, so a screen reader gets item boundaries; the dots
                  between items are drawn by the CSS. */}
              <dd className="process-strengths__phrases">
                <ul className="process-strengths__phrase-list">
                  {row.phrases.map((phrase) => (
                    <li key={phrase} className="process-strengths__phrase">{phrase}</li>
                  ))}
                </ul>
              </dd>
              <dd className="process-strengths__vouchers">
                {row.vouchers.map((voucher) => (
                  <Voucher
                    key={voucher.kind === 'person' ? voucher.name : voucher.to}
                    voucher={voucher}
                  />
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <p className="process-strengths__foot">
          The six recommendations these come from, in full:{' '}
          <Link to={`${getHomeHref()}#testimonials`} className="process-strengths__link">
            on the homepage
          </Link>{' '}
          or{' '}
          <a
            href={SITE.linkedinRecommendationsUrl}
            className="process-strengths__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            on LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default ProcessStrengths;
