import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { NOTES_BY_DATE, KIND_LABEL, NoteKind } from '../data/notes';

// Homepage writing as a quiet list (canvas L2, Ryan's pick, 10 Nov 2026):
// the newest three notes, or three of one kind, as plain rows. Every row
// carries its date and dek in the markup, so touch and screen readers get
// all three; with a mouse or keyboard (hover-capable, fine pointer) only the
// open row shows them, and pointer, focus and the arrow keys move it. No
// tint, no brackets, no key hint: hairlines and type carry the list. It stays
// a list of links (never a listbox), so every row opens the same way with or
// without the keys.

const SHOWN = 3;
const KIND_ORDER: NoteKind[] = ['practice', 'exploration', 'reflection', 'system', 'skill'];
const countOf = (kind: NoteKind) => NOTES_BY_DATE.filter((note) => note.kind === kind).length;
type Show = NoteKind | 'all';

const Arrow = () => (
  <svg className="selected-writing__arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const SelectedWriting: React.FC = () => {
  const [kind, setKind] = useState<Show>('all');
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const matching = kind === 'all' ? NOTES_BY_DATE : NOTES_BY_DATE.filter((note) => note.kind === kind);
  const notes = matching.slice(0, SHOWN);
  const noun = `${kind === 'all' ? '' : `${KIND_LABEL[kind].toLowerCase()} `}note${matching.length === 1 ? '' : 's'}`;
  const countLine = matching.length > SHOWN
    ? `Newest ${notes.length} of ${matching.length} ${noun}`
    : `${matching.length === 1 ? 'The only' : `All ${matching.length}`} ${noun}`;

  // Up and down move between rows. At either end the key is left alone, so
  // it scrolls the page as it would on any other link.
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const to = event.key === 'ArrowDown' ? index + 1 : event.key === 'ArrowUp' ? index - 1 : null;
    if (to === null || to < 0 || to >= notes.length) return;
    event.preventDefault();
    rowRefs.current[to]?.focus();
  };

  return (
    <section id="writing" className="selected-writing" aria-labelledby="selected-writing-title">
      <div className="selected-writing__container">
        <div className="selected-writing__header">
          <div>
            <p className="selected-writing__eyebrow">Notes</p>
            <h2 id="selected-writing-title">Writing from the work</h2>
          </div>
          <div className="selected-writing__tools">
            <label className="selected-writing__filter">
              Kind
              <span className="selected-writing__select">
                <select value={kind} onChange={(event) => { setKind(event.target.value as Show); setActive(0); }}>
                  <option value="all">All kinds · {NOTES_BY_DATE.length}</option>
                  {KIND_ORDER.filter(countOf).map((k) => (
                    <option key={k} value={k}>{KIND_LABEL[k]} · {countOf(k)}</option>
                  ))}
                </select>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </label>
            <Link to="/notes/" className="selected-writing__all">All notes</Link>
          </div>
        </div>

        <ol className="selected-writing__list">
          {notes.map((note, index) => {
            const isActive = index === active;
            const status = note.status === 'draft' ? 'draft' : note.inProgress ? 'in progress' : null;
            return (
              <li
                key={note.slug}
                className={`selected-writing__item${isActive ? ' is-active' : ''}`}
                onPointerMove={(event) => {
                  // A real mouse move only, so a page scrolling under a still pointer never opens rows.
                  if (event.pointerType === 'mouse' && (event.movementX || event.movementY)) setActive(index);
                }}
              >
                <p className="selected-writing__kind">
                  {KIND_LABEL[note.kind]}
                  <time className="selected-writing__date" dateTime={note.dateISO}>{note.date}</time>
                </p>
                <div className="selected-writing__main">
                  <p className="selected-writing__name">
                    <Link
                      ref={(node) => { rowRefs.current[index] = node; }}
                      to={`/notes/${note.slug}/`}
                      className="selected-writing__title"
                      aria-describedby={`writing-dek-${note.slug}`}
                      onFocus={() => setActive(index)}
                      onKeyDown={(event) => onKeyDown(event, index)}
                    >
                      {note.title}
                    </Link>
                    {status && <span className="selected-writing__status">{status}</span>}
                  </p>
                  <p id={`writing-dek-${note.slug}`} className="selected-writing__dek">{note.dek}</p>
                </div>
                <p className="selected-writing__read">{note.read}</p>
                <Arrow />
              </li>
            );
          })}
        </ol>
        <p className="selected-writing__count" aria-live="polite">{countLine}</p>
      </div>
    </section>
  );
};

export default SelectedWriting;
