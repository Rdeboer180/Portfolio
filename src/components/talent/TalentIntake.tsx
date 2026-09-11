// ============================================
// Talent tree: the intake
// Three answers and a name. Nobody rates themselves: the answers report where
// the time went and economy.ts turns them into points, so the tally on the
// right is a receipt rather than a score. Every option, label, note, and
// receipt line comes from the economy module; this file only lays them out.
//
// The questions render through one Choice control, so the degree question's
// major and minor (each locking a share of the degree's points to one tree)
// are two more Choices that appear once a degree that takes them is picked.
//
// On Ryan's tree the form shows his answers, disabled, as the worked example;
// "Build your own" starts a fresh session with the defaults.
// ============================================

import React from 'react';
import type { Degree, HoursBand, Intake, Major, Minor, Pools, TreeId } from '../../data/talent/types';
import { TREES } from '../../data/talent/trees';
import {
  CORE_NOTE,
  DEGREE_OPTIONS,
  HOURS_NOTE,
  HOURS_OPTIONS,
  MAJOR_OPTIONS,
  MINOR_OPTIONS,
  OTHER_FIELD_NOTE,
  SPLIT_NOTE,
  SPLIT_OPTIONS,
  YEARS_NOTE,
  corePoints,
  degreeOption,
  degreePoints,
  degreeTakesMajor,
  majorOption,
  minorOption,
  minorPoints,
  sanitizeSplit,
  splitOption,
  yearsPoints,
  yearsSplit,
} from '../../data/talent/economy';

export const YEARS_MAX = 60;

export interface TalentIntakeProps {
  intake: Intake;
  pools: Pools;
  /** False on Ryan's tree: the fields show his answers and are disabled. */
  editable: boolean;
  onChange: (patch: Partial<Intake>) => void;
  /** "Spend your points": scroll to the board. */
  onSpend: () => void;
  /** "Build your own": start a fresh session (read-only mode only). */
  onBuildOwn: () => void;
}

interface ChoiceOption<V extends string | number> {
  value: V;
  label: string;
  /** The Menlo points mark beside the label ("+16", "0"). */
  meta: string;
  /** Marks an assumed value; the note under the control explains the asterisk. */
  assumed?: boolean;
  /** An option that cannot be taken right now (a minor equal to the major). */
  disabled?: boolean;
  /** The accessible name when the visible label is a compact form ("70 / 30"). */
  ariaLabel?: string;
}

interface ChoiceProps<V extends string | number> {
  name: string;
  legend: string;
  /** Right-aligned Menlo summary of the current answer. */
  summary: string;
  note?: string;
  options: ChoiceOption<V>[];
  value: V;
  disabled?: boolean;
  onChange: (value: V) => void;
}

/** A radio group drawn as a row of chips. Real inputs, so arrow keys and labels come for free. */
function Choice<V extends string | number>({
  name, legend, summary, note, options, value, disabled, onChange,
}: ChoiceProps<V>) {
  return (
    <fieldset className="tt-field" disabled={disabled}>
      {/* The legend names the group for AT; the visible title sits in the
          head row so the summary can share its line. */}
      <legend className="sr-only">{legend}</legend>
      <div className="tt-field__head">
        <span className="tt-field__legend" aria-hidden="true">{legend}</span>
        <span className="tt-field__summary">{summary}</span>
      </div>
      <div className="tt-chips">
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          const selected = o.value === value;
          return (
            <label
              key={id}
              htmlFor={id}
              className={`tt-chip${selected ? ' is-selected' : ''}${o.disabled ? ' is-disabled' : ''}`}
            >
              <input
                type="radio"
                id={id}
                name={name}
                className="tt-chip__input"
                checked={selected}
                disabled={o.disabled}
                aria-label={o.ariaLabel}
                onChange={() => onChange(o.value)}
              />
              <span className="tt-chip__label">{o.assumed ? `${o.label} *` : o.label}</span>
              {o.meta && <span className="tt-chip__meta">{o.meta}</span>}
            </label>
          );
        })}
      </div>
      {note && <p className="tt-field__note">{note}</p>}
    </fieldset>
  );
}

const plus = (n: number) => (n > 0 ? `+${n}` : '0');

/** One receipt line: "+16 · Bachelor's" with the points set in Orange Deep, the rule beneath. */
const ReceiptLine: React.FC<{ label: string; note: string }> = ({ label, note }) => {
  const sep = label.indexOf(' · ');
  const head = sep > 0 ? label.slice(0, sep) : label;
  const rest = sep > 0 ? label.slice(sep + 3) : '';
  return (
    <li className="tt-tally__line">
      <span className="tt-tally__points">{head}</span>
      <span className="tt-tally__dot" aria-hidden="true">{' · '}</span>
      <span className="tt-tally__what">
        <span className="tt-tally__label">{rest}</span>
        <span className="tt-tally__note">{note}</span>
      </span>
    </li>
  );
};

const TalentIntake: React.FC<TalentIntakeProps> = ({
  intake, pools, editable, onChange, onSpend, onBuildOwn,
}) => {
  const nameId = 'tt-name';
  const yearsId = 'tt-years';
  const degree = degreeOption(intake.degree);
  const takesMajor = degreeTakesMajor(intake.degree);
  const major = majorOption(intake.major);
  const minor = minorOption(intake.minor);
  const dp = degreePoints(intake.degree, takesMajor ? intake.major : undefined);
  const mp = minorPoints(intake.degree, intake.minor);
  const hours = HOURS_OPTIONS[intake.hours] || HOURS_OPTIONS[0];
  const years = intake.years;
  const yearsLabel = `${years} ${years === 1 ? 'year' : 'years'}`;
  const split = typeof intake.split === 'number' ? sanitizeSplit(intake.split) : undefined;
  const splitShare = split === undefined ? undefined : yearsSplit(years, split);
  const NO_SPLIT = -1;
  const treeName = (id: TreeId | undefined) => {
    const tree = id ? TREES.find((t) => t.id === id) : undefined;
    return tree ? tree.name : 'either tree';
  };

  const setYears = (n: number) => {
    const y = Math.max(0, Math.min(YEARS_MAX, Math.floor(isFinite(n) ? n : 0)));
    onChange({ years: y });
  };

  const craftLines = pools.receipt.filter((r) => r.pool === 'craft');
  const coreLines = pools.receipt.filter((r) => r.pool === 'core');

  return (
    <div className="tt-intake">
      <div className="tt-intake__form">
        <div className="tt-intake__head">
          <p className="tt-eyebrow">Intake · three answers and a name · no self-rating</p>
          <h2 className="tt-intake__title" id="tt-intake-title" data-tt-focus tabIndex={-1}>
            Where did the time go?
          </h2>
          <p className="tt-intake__lede">
            Earned by time, not self-rated. Answer three questions and watch the tally build.
          </p>
          {!editable && (
            <p className="tt-intake__readonly">
              {`Showing Ryan's answers. Build your own to start with a fresh sheet.`}
            </p>
          )}
        </div>

        <Choice<Degree>
          name="tt-degree"
          legend="Degree"
          summary={takesMajor ? `${degree.short}, ${major.short} · ${plus(dp)}` : `${degree.short} · ${plus(dp)}`}
          note="4 per year of degree, locked to the tree of the major · self-taught 8, free on either tree · * assumed values, not yet confirmed"
          options={DEGREE_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
            meta: plus(degreePoints(o.value)),
            assumed: o.assumed,
          }))}
          value={intake.degree}
          disabled={!editable}
          onChange={(v) => onChange({ degree: v })}
        />

        {takesMajor && (
          <Choice<Major>
            name="tt-major"
            legend="Major"
            summary={`${degree.short} points to ${treeName(major.lockedTo)}`}
            note={`${OTHER_FIELD_NOTE} · * assumed`}
            options={MAJOR_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
              meta: o.lockedTo ? `${degreePoints(intake.degree, o.value)} to ${treeName(o.lockedTo)}` : `${degreePoints(intake.degree, o.value)} free`,
              assumed: o.assumed,
            }))}
            value={intake.major}
            disabled={!editable}
            onChange={(v) => onChange({ major: v })}
          />
        )}

        {takesMajor && (
          <Choice<Minor>
            name="tt-minor"
            legend="Minor"
            summary={minor.lockedTo ? `${minor.short} · +${mp} to ${treeName(minor.lockedTo)}` : 'None · 0'}
            note="A quarter of the degree's points, added on top and locked to the minor's tree"
            options={MINOR_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
              meta: o.lockedTo ? `+${minorPoints(intake.degree, o.value)} to ${treeName(o.lockedTo)}` : '0',
              // The minor cannot repeat the major.
              disabled: o.value !== 'none' && o.value === intake.major,
            }))}
            value={intake.minor}
            disabled={!editable}
            onChange={(v) => onChange({ minor: v })}
          />
        )}

        <fieldset className="tt-field" disabled={!editable}>
          <legend className="sr-only">Years of professional experience</legend>
          <div className="tt-field__head">
            <span className="tt-field__legend" aria-hidden="true">Years of professional experience</span>
            <span className="tt-field__summary">
              {`${yearsLabel} · +${yearsPoints(years)} craft · +${corePoints(years)} core · Level ${years}`}
            </span>
          </div>
          <div className="tt-stepper-row">
            <div className="tt-stepper">
              <button
                type="button"
                className="tt-stepper__btn"
                aria-label="One year fewer"
                onClick={() => setYears(years - 1)}
                disabled={!editable || years <= 0}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M6 12h12" /></svg>
              </button>
              <label htmlFor={yearsId} className="sr-only">Years of professional experience</label>
              <input
                id={yearsId}
                type="number"
                inputMode="numeric"
                min={0}
                max={YEARS_MAX}
                step={1}
                className="tt-stepper__value"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value, 10))}
              />
              <button
                type="button"
                className="tt-stepper__btn"
                aria-label="One year more"
                onClick={() => setYears(years + 1)}
                disabled={!editable || years >= YEARS_MAX}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M12 6v12M6 12h12" /></svg>
              </button>
            </div>
            <p className="tt-field__note tt-field__note--inline">{`${YEARS_NOTE} · core ${CORE_NOTE}`}</p>
          </div>
        </fieldset>

        <Choice<number>
          name="tt-split"
          legend="Of those years, how much was design versus code?"
          summary={splitShare && split !== undefined
            ? `${splitOption(split).label} · ${splitShare.craft} to Craft · ${splitShare.systems} to Systems and build`
            : `Not split · ${yearsPoints(years)} free on either tree`}
          note={SPLIT_NOTE}
          options={[
            { value: NO_SPLIT, label: 'Not split', meta: 'free' },
            ...SPLIT_OPTIONS.map((o) => ({ value: o.value, label: o.short, meta: '', ariaLabel: o.label })),
          ]}
          value={split === undefined ? NO_SPLIT : split}
          disabled={!editable}
          onChange={(v) => onChange({ split: v === NO_SPLIT ? undefined : v })}
        />

        <Choice<HoursBand>
          name="tt-hours"
          legend="Hours outside the day job in the last 12 months"
          summary={`Learning, building, designing · ${hours.short} · ${plus(intake.hours)}`}
          note={HOURS_NOTE}
          options={HOURS_OPTIONS.map((o) => ({ value: o.band, label: o.label, meta: plus(o.band) }))}
          value={intake.hours}
          disabled={!editable}
          onChange={(v) => onChange({ hours: v })}
        />

        <div className="tt-field">
          <div className="tt-field__head">
            <label htmlFor={nameId} className="tt-field__legend">Your name</label>
            <span className="tt-field__summary">Shows on your result card</span>
          </div>
          <input
            id={nameId}
            type="text"
            className="tt-input"
            value={intake.name}
            maxLength={60}
            autoComplete="name"
            placeholder="First and last, or a handle"
            disabled={!editable}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>
      </div>

      <aside className="tt-tally" aria-label="Tally">
        <div className="tt-tally__head">
          <span className="tt-eyebrow">Tally · running</span>
          <span className="tt-eyebrow tt-eyebrow--orange">Earned by time</span>
        </div>
        <ul className="tt-tally__lines">
          {craftLines.map((r) => (
            <ReceiptLine key={r.label} label={r.label} note={r.note} />
          ))}
        </ul>
        <hr className="tt-tally__rule" />
        <dl className="tt-tally__totals">
          <div className="tt-tally__total" key={`craft-${pools.craft}-${pools.craftLocked}-${pools.systemsLocked}`}>
            <dt className="tt-tally__total-row">
              <span className="tt-tally__big">{pools.craft}</span>
              <span className="tt-tally__unit">craft points</span>
            </dt>
            <dd className="tt-tally__note">
              {pools.craftLocked > 0 || pools.systemsLocked > 0
                ? [
                    pools.craftLocked > 0 ? `${pools.craftLocked} locked to Craft` : '',
                    pools.systemsLocked > 0 ? `${pools.systemsLocked} locked to Systems and build` : '',
                    `${pools.free} free on either`,
                  ].filter(Boolean).join(' · ')
                : 'spend across Craft and Systems and build'}
            </dd>
          </div>
          <div className="tt-tally__total" key={`core-${pools.core}`}>
            <dt className="tt-tally__total-row">
              <span className="tt-tally__big">{pools.core}</span>
              <span className="tt-tally__unit">core points</span>
            </dt>
            <dd className="tt-tally__note">
              {coreLines.length ? `${coreLines[0].note} · spend on Core only` : 'spend on Core only'}
            </dd>
          </div>
        </dl>
        <hr className="tt-tally__rule" />
        <div className="tt-tally__level">
          <span className="tt-tally__level-text">{`Level ${pools.level} Designer`}</span>
          <span className="tt-tally__note">level = years</span>
        </div>
        {editable ? (
          <button type="button" className="btn btn--primary btn--lg tt-tally__cta" onClick={onSpend}>
            Spend your points ↓
          </button>
        ) : (
          <button type="button" className="btn btn--secondary btn--lg tt-tally__cta" onClick={onBuildOwn}>
            Build your own
          </button>
        )}
      </aside>
    </div>
  );
};

export default TalentIntake;
