import React from 'react';
import { Link } from 'react-router-dom';
import { getNote, KIND_LABEL } from '../data/notes';

const selectedSlugs = [
  'exploring-my-portfolio-in-paper',
  'systems-that-make-better-decisions-easier',
  'eight-wrong-first-drafts',
];

const SelectedWriting: React.FC = () => (
  <section className="selected-writing" aria-labelledby="selected-writing-title">
    <div className="selected-writing__container">
      <div className="selected-writing__header">
        <h2 id="selected-writing-title">Writing from the work</h2>
        <Link to="/notes/" className="about__inline-link">All notes</Link>
      </div>
      <ul className="selected-writing__list">
        {selectedSlugs.map(slug => {
          const note = getNote(slug);
          if (!note) return null;
          return (
            <li key={slug}>
              <Link to={`/notes/${slug}/`} className="selected-writing__row">
                <span className="selected-writing__meta">{KIND_LABEL[note.kind]} · {note.read}</span>
                <span className="selected-writing__title">{note.title}</span>
                <span className="selected-writing__arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default SelectedWriting;
