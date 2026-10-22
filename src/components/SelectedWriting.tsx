import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { NOTES_BY_DATE, KIND_LABEL, NoteKind } from '../data/notes';

// Homepage writing as a quick-open list: the three newest notes, one of
// them highlighted with its dek open, arrows to move and Enter to open.
// It stays a plain list of links (never a listbox), so every row reads and
// opens the same way with or without the keys. The mechanism follows the
// launcher on Marco Cornacchia's portfolio (marco.fyi); concept 05 on the
// sections canvas.

const SHOWN = 3;
const KIND_ORDER: NoteKind[] = ['practice', 'exploration', 'reflection', 'system', 'skill'];
const kindName = (kind: NoteKind) => KIND_LABEL[kind].replace(/[[\]]/g, '').trim();
const countOf = (kind: NoteKind) => NOTES_BY_DATE.filter((note) => note.kind === kind).length;

const SelectedWriting: React.FC = () => {
  const [kind, setKind] = useState<NoteKind | 'all'>('all');
  const [active, setActive] = useState(0);
  const [mark, setMark] = useState<{ y: number; h: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const matching = kind === 'all' ? NOTES_BY_DATE : NOTES_BY_DATE.filter((note) => note.kind === kind);
  const notes = matching.slice(0, SHOWN);
  const noun = `${kind === 'all' ? '' : `${kindName(kind)} `}note${matching.length === 1 ? '' : 's'}`;
  const countLine = matching.length > SHOWN
    ? `Newest ${notes.length} of ${matching.length} ${noun}`
    : `${matching.length === 1 ? 'The only' : `All ${matching.length}`} ${noun}`;

  // One shared highlight slides to the active row. Until it has measured,
  // the active row paints its own tint, so the prerendered page is right.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const place = () => {
      const item = list.querySelectorAll<HTMLElement>('.selected-writing__item')[active];
      if (item) setMark({ y: item.offsetTop - 1, h: item.offsetHeight + 1 });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active, kind]);

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(notes.length - 1, index));
    rowRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: notes.length - 1 };
    const to = keys[event.key];
    if (to === undefined) return;
    event.preventDefault();
    moveTo(to);
  };

  return (
    <section id="writing" className="selected-writing" aria-labelledby="selected-writing-title">
      <div className="selected-writing__container">
        <div className="selected-writing__header">
          <h2 id="selected-writing-title">Writing from the work</h2>
          <div className="selected-writing__tools">
            <label className="selected-writing__filter">
              Kind
              <span className="selected-writing__select">
                <select
                  value={kind}
                  onChange={(event) => { setKind(event.target.value as NoteKind | 'all'); setActive(0); }}
                >
                  <option value="all">All kinds · {NOTES_BY_DATE.length}</option>
                  {KIND_ORDER.filter(countOf).map((k) => (
                    <option key={k} value={k}>{kindName(k)} · {countOf(k)}</option>
                  ))}
                </select>
                <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
              </span>
            </label>
            <Link to="/notes/" className="about__inline-link">All notes</Link>
          </div>
        </div>

        <div ref={listRef} className={`selected-writing__results${mark ? ' is-measured' : ''}`}>
          <span
            className="selected-writing__highlight"
            aria-hidden="true"
            style={mark ? { transform: `translateY(${mark.y}px)`, height: mark.h } : undefined}
          />
          <ul className="selected-writing__list" aria-label="Newest notes">
            {notes.map((note, index) => {
              const isActive = index === active;
              const status = note.status === 'draft' ? 'draft' : note.inProgress ? 'in progress' : null;
              return (
                <li
                  key={note.slug}
                  className={`selected-writing__item${isActive ? ' is-active' : ''}`}
                  onPointerMove={(event) => {
                    // A real mouse move only: the page scrolling under a still
                    // pointer must not open and close deks.
                    if (event.pointerType === 'mouse' && (event.movementX || event.movementY)) setActive(index);
                  }}
                >
                  <Link
                    ref={(node) => { rowRefs.current[index] = node; }}
                    to={`/notes/${note.slug}/`}
                    className="selected-writing__row"
                    aria-describedby={isActive ? `writing-dek-${note.slug}` : undefined}
                    onFocus={() => setActive(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                  >
                    <span className="selected-writing__kind">
                      <span className={`selected-writing__dot selected-writing__dot--${note.kind}`} aria-hidden="true" />
                      {KIND_LABEL[note.kind]}
                    </span>
                    <span className="selected-writing__name">
                      <span className="selected-writing__title">{note.title}</span>
                      {status && <span className="selected-writing__status">{status}</span>}
                    </span>
                    <span className="selected-writing__read">{note.read}</span>
                    <span className="selected-writing__go" aria-hidden="true">
                      <kbd className="selected-writing__key">Enter</kbd>
                      <svg className="selected-writing__arrow" viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                    </span>
                  </Link>
                  {isActive && (
                    <div className="selected-writing__detail">
                      <p className="selected-writing__when">
                        <time dateTime={note.dateISO}>{note.date}</time>
                        {note.relatedProject === 'playdraft' && (
                          <> <br />Related: <Link to="/work/playdraft/" className="about__inline-link">PlayDraft ↗</Link></>
                        )}
                      </p>
                      <p id={`writing-dek-${note.slug}`} className="selected-writing__dek">{note.dek}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="selected-writing__foot">
          <span className="selected-writing__hint" aria-hidden="true">
            <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Enter</kbd> to open
          </span>
          <span aria-live="polite">{countLine}</span>
        </div>
      </div>
    </section>
  );
};

export default SelectedWriting;
