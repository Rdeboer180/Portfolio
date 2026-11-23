// ============================================
// TrainingToSentences — the figure in "My training didn't go anywhere": the
// same judgment on two surfaces. Left, what the hands did on a canvas; right,
// the sentence it becomes in a prompt window. Paper rows on hairlines, Menlo
// tags, Signal Orange only on the prompt side. Rows stack on phones.
// ============================================

import React from 'react';

const ROWS: { canvas: string; prompt: string }[] = [
  { canvas: 'Smoothing a path with the pen tool', prompt: 'The curve is lumpy.' },
  { canvas: 'Nudging a layer back onto the grid', prompt: 'The spacing is off the grid.' },
  { canvas: 'Fixing wrap in the inspector', prompt: 'The flex-wrap is breaking the content at our breakpoint.' },
  { canvas: 'Scrubbing a hover’s timing', prompt: 'The hover is too slow.' },
];

export const TrainingToSentences: React.FC = () => (
  <figure className="note-embed tts">
    <div className="tts__head" aria-hidden="true">
      <span className="tts__tag">[ on the canvas ]</span>
      <span />
      <span className="tts__tag tts__tag--mine">[ in the prompt ]</span>
    </div>
    <ul className="tts__rows">
      {ROWS.map((row) => (
        <li key={row.prompt} className="tts__row">
          <span className="tts__canvas">{row.canvas}</span>
          <span className="tts__arrow" aria-hidden="true">→</span>
          <span className="tts__prompt">&ldquo;{row.prompt}&rdquo;</span>
        </li>
      ))}
    </ul>
    <figcaption>Same judgment, new surface. The years went into the left column. The work happens in the right one now.</figcaption>
  </figure>
);

export default TrainingToSentences;
