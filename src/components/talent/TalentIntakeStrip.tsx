// ============================================
// Talent console: the intake strip
// Three questions in the console's header rail, build mode only. Nobody
// rates themselves: the answers report where the time went and economy.ts
// turns them into points, so each answer prints a Menlo receipt chip and the
// tally counts up beside them. The trees stay dormant until the degree, the
// years, and the hours are all answered; the name waits for the card.
//
// Every option, label, and rule comes from the economy module; this file
// lays them out and decides what counts as "answered" (the visitor touched
// the control), which is state the economy has no reason to know about.
// ============================================

import React from 'react';
import type { Degree, HoursBand, Intake, Major, Minor, TreeId } from '../../data/talent/types';
import {
  CORE_NOTE,
  DEGREE_OPTIONS,
  HOURS_NOTE,
  HOURS_OPTIONS,
  MAJOR_OPTIONS,
  MINOR_OPTIONS,
  SPLIT_OPTIONS,
  YEARS_NOTE,
  corePoints,
  degreeOption,
  degreePoints,
  degreeTakesMajor,
  hoursPoints,
  majorOption,
  minorOption,
  minorPoints,
  sanitizeSplit,
  yearsPoints,
  yearsSplit,
} from '../../data/talent/economy';
import { countWord } from './consoleData';

export const YEARS_MAX = 60;

export type IntakeQuestion = 'degree' | 'years' | 'hours';
export type Answered = Record<IntakeQuestion, boolean>;

export const NOTHING_ANSWERED: Answered = { degree: false, years: false, hours: false };
export const ALL_ANSWERED: Answered = { degree: true, years: true, hours: true };

/** True once the three questions that gate the trees are answered. */
export function intakeComplete(answered: Answered): boolean {
  return answered.degree && answered.years && answered.hours;
}

/**
 * The intake as the economy should read it while questions are still open:
 * an unanswered question contributes nothing, so the tally only ever counts
 * what the visitor has actually said.
 */
export function effectiveIntake(intake: Intake, answered: Answered): Intake {
  const out: Intake = { ...intake };
  if (!answered.degree) {
    out.degree = 'none';
    out.minor = 'none';
  }
  if (!answered.years) {
    out.years = 0;
    delete out.split;
  }
  if (!answered.hours) out.hours = 0;
  return out;
}

export interface ReceiptChip {
  key: string;
  /** "+16 craft, locked · Bachelor's, graphic design" */
  text: string;
  /** Which question printed it, for the stagger. */
  question: IntakeQuestion;
}

const TREE_SHORT: Record<TreeId, string> = { craft: 'craft', systems: 'systems', core: 'core' };

/** The receipt chips the strip prints, one per answered rule. */
export function intakeChips(intake: Intake, answered: Answered): ReceiptChip[] {
  const chips: ReceiptChip[] = [];
  if (answered.degree) {
    const degree = degreeOption(intake.degree);
    const takesMajor = degreeTakesMajor(intake.degree);
    const major = majorOption(intake.major);
    const dp = degreePoints(intake.degree, takesMajor ? intake.major : undefined);
    if (takesMajor && major.lockedTo) {
      chips.push({ key: 'degree', question: 'degree', text: `+${dp} ${TREE_SHORT[major.lockedTo]}, locked · ${degree.short}, ${major.short}` });
    } else if (takesMajor) {
      chips.push({ key: 'degree', question: 'degree', text: `+${dp} · ${degree.short}, ${major.short}` });
    } else {
      chips.push({ key: 'degree', question: 'degree', text: `+${dp} · ${degree.short}` });
    }
    const minor = minorOption(intake.minor);
    const mp = minorPoints(intake.degree, intake.minor);
    if (takesMajor && minor.lockedTo && mp > 0) {
      chips.push({ key: 'minor', question: 'degree', text: `+${mp} ${TREE_SHORT[minor.lockedTo]}, locked · minor, ${minor.short}` });
    }
  }
  if (answered.years) {
    const years = intake.years;
    const label = `${years} ${years === 1 ? 'year' : 'years'}`;
    const split = typeof intake.split === 'number' && isFinite(intake.split) ? sanitizeSplit(intake.split) : undefined;
    if (split === undefined) {
      chips.push({ key: 'years', question: 'years', text: `+${yearsPoints(years)} · ${label}` });
    } else {
      const ys = yearsSplit(years, split);
      chips.push({ key: 'years-design', question: 'years', text: `+${ys.craft} craft, locked · ${label}, design` });
      chips.push({ key: 'years-code', question: 'years', text: `+${ys.systems} systems, locked · ${label}, code` });
    }
    chips.push({ key: 'core', question: 'years', text: `+${corePoints(years)} core` });
  }
  if (answered.hours) {
    const hours = HOURS_OPTIONS[intake.hours] || HOURS_OPTIONS[0];
    chips.push({ key: 'hours', question: 'hours', text: `+${hoursPoints(intake.hours)} · ${hours.short}` });
  }
  return chips;
}

export interface TalentIntakeStripProps {
  intake: Intake;
  answered: Answered;
  /** The pools the effective intake earns, for the tally. */
  craft: number;
  core: number;
  level: number;
  onChange: (patch: Partial<Intake>, answers?: IntakeQuestion) => void;
}

const NO_SPLIT = -1;

const HOURS_SHORT = ['< 40', '40+', '80+', '120+', '160+', '200+'];

const TalentIntakeStrip: React.FC<TalentIntakeStripProps> = ({
  intake, answered, craft, core, level, onChange,
}) => {
  const takesMajor = answered.degree && degreeTakesMajor(intake.degree);
  const years = intake.years;
  const split = typeof intake.split === 'number' && isFinite(intake.split) ? sanitizeSplit(intake.split) : undefined;
  const chips = intakeChips(intake, answered);
  const complete = intakeComplete(answered);
  const answeredCount = [answered.degree, answered.years, answered.hours].filter(Boolean).length;

  const setYears = (n: number) => {
    const y = Math.max(0, Math.min(YEARS_MAX, Math.floor(isFinite(n) ? n : 0)));
    onChange({ years: y }, 'years');
  };

  return (
    <div className={`tt-intake${complete ? ' is-complete' : ''}`} data-answered={answeredCount}>
      <div className="tt-intake__head">
        <h1 className="tt-intake__title">Build your talent tree</h1>
        <p className="tt-intake__lede">
          Not a self-rating: you report where your time went. The tally counts up as each answer lands. The name waits for the card.
        </p>
      </div>

      <div className="tt-intake__steps">
        {/* ── 01 · Degree ─────────────────────────────────────────────────── */}
        <fieldset className="tt-step tt-step--degree">
          <legend className="tt-step__legend">
            <span className="tt-step__index">01</span>
            <span className="tt-step__name">Degree</span>
          </legend>
          <div className="tt-step__controls">
            <label className="tt-select">
              <span className="sr-only">Degree</span>
              <select
                className="tt-select__input"
                value={answered.degree ? intake.degree : ''}
                onChange={(e) => onChange({ degree: e.target.value as Degree }, 'degree')}
              >
                <option value="" disabled>Choose a degree</option>
                {DEGREE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {`${o.label}${o.assumed ? ' *' : ''} · ${o.points > 0 ? `+${o.points}` : '0'}`}
                  </option>
                ))}
              </select>
              <span className="tt-select__caret" aria-hidden="true" />
            </label>
            {takesMajor && (
              <label className="tt-select">
                <span className="tt-select__key">Major</span>
                <select
                  className="tt-select__input"
                  value={intake.major}
                  onChange={(e) => onChange({ major: e.target.value as Major })}
                >
                  {MAJOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{`${o.label}${o.assumed ? ' *' : ''}`}</option>
                  ))}
                </select>
                <span className="tt-select__caret" aria-hidden="true" />
              </label>
            )}
            {takesMajor && (
              <label className="tt-select">
                <span className="tt-select__key">Minor</span>
                <select
                  className="tt-select__input"
                  value={intake.minor}
                  onChange={(e) => onChange({ minor: e.target.value as Minor })}
                >
                  {MINOR_OPTIONS.filter((o) => o.value === 'none' || o.value !== intake.major).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="tt-select__caret" aria-hidden="true" />
              </label>
            )}
          </div>
          <p className="tt-step__note">
            4 per year of degree, locked to the tree of the major · a minor adds a quarter · self-taught 8, free · * assumed
          </p>
        </fieldset>

        {/* ── 02 · Years ──────────────────────────────────────────────────── */}
        <fieldset className="tt-step tt-step--years">
          <legend className="tt-step__legend">
            <span className="tt-step__index">02</span>
            <span className="tt-step__name">Years in the field</span>
          </legend>
          <div className="tt-step__controls">
            <div className="tt-stepper">
              <button
                type="button"
                className="tt-stepper__btn"
                aria-label="One year fewer"
                onClick={() => setYears(years - 1)}
                disabled={years <= 0}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M6 12h12" /></svg>
              </button>
              <label htmlFor="tt-years" className="sr-only">Years of professional experience</label>
              <input
                id="tt-years"
                type="number"
                inputMode="numeric"
                min={0}
                max={YEARS_MAX}
                step={1}
                className="tt-stepper__value"
                value={answered.years ? years : ''}
                placeholder={String(years)}
                onChange={(e) => setYears(parseInt(e.target.value, 10))}
              />
              <button
                type="button"
                className="tt-stepper__btn"
                aria-label="One year more"
                onClick={() => setYears(years + 1)}
                disabled={years >= YEARS_MAX}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M12 6v12M6 12h12" /></svg>
              </button>
              <span className="tt-stepper__unit" aria-hidden="true">years</span>
            </div>
          </div>
          <p className="tt-step__note">{`${YEARS_NOTE} · core ${CORE_NOTE} · level = years`}</p>
        </fieldset>

        {/* ── 03 · Hours ──────────────────────────────────────────────────── */}
        <fieldset className="tt-step tt-step--hours">
          <legend className="tt-step__legend">
            <span className="tt-step__index">03</span>
            <span className="tt-step__name">Hours outside the job, last 12 months</span>
          </legend>
          <div className="tt-step__controls">
            <div className="tt-seg tt-seg--hours" role="radiogroup" aria-label="Hours outside the day job in the last 12 months">
              {HOURS_OPTIONS.map((o) => {
                const selected = answered.hours && intake.hours === o.band;
                return (
                  <label key={o.band} className={`tt-seg__item${selected ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="tt-hours"
                      className="tt-seg__input"
                      checked={selected}
                      aria-label={`${o.label}, ${o.band > 0 ? `plus ${o.band}` : 'no points'}`}
                      onChange={() => onChange({ hours: o.band as HoursBand }, 'hours')}
                    />
                    <span className="tt-seg__label">{HOURS_SHORT[o.band]}</span>
                    <span className="tt-seg__meta">{o.band > 0 ? `+${o.band}` : '0'}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <p className="tt-step__note">{`${HOURS_NOTE} · learning, building, designing`}</p>
        </fieldset>

        {/* ── Of those years, design versus code (optional) ────────────────── */}
        {answered.years && (
          <fieldset className="tt-step tt-step--split">
            <legend className="tt-step__legend">
              <span className="tt-step__index">02 ·</span>
              <span className="tt-step__name">Of those years, the share that was design rather than code</span>
            </legend>
            <div className="tt-step__controls">
              <div className="tt-seg tt-seg--split" role="radiogroup" aria-label="Of those years, how much was design versus code">
                {[{ value: NO_SPLIT, label: 'Not split', meta: '', aria: 'Not split, the years stay free on either tree' },
                  ...SPLIT_OPTIONS.map((o) => ({ value: o.value, label: String(o.value), meta: '%', aria: o.label })),
                ].map((o) => {
                  const selected = (split === undefined ? NO_SPLIT : split) === o.value;
                  return (
                    <label key={o.value} className={`tt-seg__item${selected ? ' is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="tt-split"
                        className="tt-seg__input"
                        checked={selected}
                        aria-label={o.aria}
                        onChange={() => onChange({ split: o.value === NO_SPLIT ? undefined : o.value })}
                      />
                      <span className="tt-seg__label">{o.label}</span>
                      {o.meta && <span className="tt-seg__meta">{o.meta}</span>}
                    </label>
                  );
                })}
              </div>
            </div>
            <p className="tt-step__note">Percent design · the rest is code · a split locks the years points to the two trees by that share · not split leaves them free</p>
          </fieldset>
        )}
      </div>

      <div className="tt-intake__tally" aria-live="polite">
        <ul className="tt-receipt" aria-label="Receipt">
          {chips.map((c, i) => (
            <li key={c.key + c.text} className="tt-receipt__chip" style={{ '--tt-i': i } as React.CSSProperties}>
              {c.text}
            </li>
          ))}
        </ul>
        <p className="tt-intake__total">
          {complete ? (
            <>
              <span className="tt-intake__big">{craft}</span>
              <span className="tt-intake__unit">craft</span>
              <span className="tt-intake__dot" aria-hidden="true">·</span>
              <span className="tt-intake__big">{core}</span>
              <span className="tt-intake__unit">core</span>
              <span className="tt-intake__dot" aria-hidden="true">·</span>
              <span className="tt-intake__level">{`Level ${level}`}</span>
            </>
          ) : (
            <span className="tt-intake__waiting">
              {`${countWord(3 - answeredCount, true)} of three to answer · the trees power up on the third`}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default TalentIntakeStrip;
