import React, { useState } from 'react';

const ARTBOARDS = [
  ['direction', 'Direction and foundations', 1200, 1068],
  ['type', 'Type, scale, and geometry', 1200, 1221],
  ['surfaces', 'Surfaces, shields, and identity', 1200, 1368],
  ['controls', 'Actions and field states', 1200, 1206],
  ['patterns', 'Turn, tickets, and history', 1200, 1367],
  ['home', 'Home, Drafts, and Packs', 1380, 1088],
  ['account', 'Custom, Account, and Welcome', 1380, 1032],
  ['journey', 'Setup, Lobby, and Recap', 1380, 1284],
  ['states', 'States, review, and promotion', 1200, 956],
] as const;

type GalleryProps = {
  boards?: ReadonlyArray<readonly [string, string, number, number]>;
  conversation?: boolean;
};

export default function PaperArtboardGallery({ boards = ARTBOARDS, conversation = false }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const [key, label, width, height] = boards[index];
  const itemName = conversation ? 'capture' : 'artboard';
  const move = (step: number) => setIndex(current => (current + step + boards.length) % boards.length);

  return (
    <section className={`notes__artboard-gallery${conversation ? ' notes__artboard-gallery--chat' : ''}`} aria-label={conversation ? 'PlayDraft LLM conversation captures' : 'PlayDraft Paper artboards'}>
      <div className="notes__artboard-toolbar">
        <label>
          <span className="sr-only">{conversation ? 'Choose a capture' : 'Choose an artboard'}</span>
          <select value={index} onChange={event => setIndex(Number(event.target.value))}>
            {boards.map((board, i) => <option key={board[0]} value={i}>{board[1]}</option>)}
          </select>
        </label>
        <span className="notes__artboard-count" aria-live="polite" aria-atomic="true">{index + 1} / {boards.length}</span>
      </div>
      <div className="notes__artboard-canvas">
        <img src={`/images/notes/playdraft-system/${key}.png`} alt={conversation ? label : `PlayDraft design system: ${label}. Full Paper artboard.`} width={width} height={height} loading="lazy" />
      </div>
      <div className="notes__artboard-controls">
        <button type="button" onClick={() => move(-1)} aria-label={`Previous ${itemName}`}>← Previous</button>
        <a href={`/images/notes/playdraft-system/${key}.png`} target="_blank" rel="noopener noreferrer">Open full size<span className="sr-only">: {label}, opens in a new tab</span></a>
        <button type="button" onClick={() => move(1)} aria-label={`Next ${itemName}`}>Next →</button>
      </div>
      <p className="notes__artboard-caption">{conversation ? `${label}. Original conversation capture.` : 'All nine artboards from the Paper review. Flip through the system, or choose a board above.'}</p>
    </section>
  );
}
