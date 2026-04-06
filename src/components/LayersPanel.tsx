import React, { forwardRef } from 'react';

const roles = ['Design Strategist', 'Product Designer', 'UX Engineer'];

interface LayersPanelProps {
  activeIndex: number;
  onLayerClick?: (index: number) => void;
}

const EyeIcon = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 18C18 18 8.86 31.26 8.48 31.82a1 1 0 000 1.36C8.86 33.74 18 47 32 47s23.14-13.26 23.52-13.82a1 1 0 000-1.36C55.14 31.26 46 18 32 18zm0 27c-11.91 0-20.15-10.18-21.43-12C11.85 31.18 20.09 21 32 21s20.15 10.18 21.43 12C52.15 34.82 43.91 45 32 45zm0-20a8 8 0 108 8 8 8 0 00-8-8zm0 14a6 6 0 116-6 6 6 0 01-6 6z"/>
  </svg>
);

const LayersPanel = forwardRef<HTMLDivElement, LayersPanelProps>(
  ({ activeIndex, onLayerClick }, ref) => {
    return (
      <div className="layers-panel" ref={ref} aria-label="Photoshop layers panel mockup">
        <div className="layers-panel__top">
          <span>&times;</span>
          <span>&laquo;</span>
        </div>

        <div className="layers-panel__titlebar">
          <div className="layers-panel__title">Layers</div>
          <div className="layers-panel__menu">&equiv;</div>
        </div>

        <div className="layers-panel__toolbar">
          <div className="layers-panel__search">&lceil; <span>Kind</span></div>
          <div className="layers-panel__dropdown">&darr;</div>
          <div className="layers-panel__icon-btn">◐</div>
          <div className="layers-panel__icon-btn">T</div>
          <div className="layers-panel__icon-btn">▭</div>
          <div className="layers-panel__icon-btn">▢</div>
          <div className="layers-panel__icon-btn">●</div>
        </div>

        <div className="layers-panel__modebar">
          <div className="layers-panel__mode-select"><span>Normal</span><span>&darr;</span></div>
          <div className="layers-panel__stat"><span>Opacity:</span><span className="layers-panel__stat-field">100%</span></div>
        </div>

        <div className="layers-panel__lockbar">
          <div className="layers-panel__lockbar-left">
            <span>Lock:</span>
            <div className="layers-panel__lockbar-icons">
              <span>&#9641;</span>
              <span>&#9672;</span>
              <span>&#10011;</span>
              <span>&#9707;</span>
              <span>&#128274;</span>
            </div>
          </div>
          <div className="layers-panel__stat"><span>Fill:</span><span className="layers-panel__stat-field">100%</span></div>
        </div>

        <div className="layers-panel__layers">
          {roles.map((name, i) => (
            <div
              key={i}
              data-layer-index={i}
              className={`layers-panel__layer${i === activeIndex ? ' layers-panel__layer--selected layers-panel__layer--active' : ''}`}
              onClick={() => onLayerClick?.(i)}
            >
              <div className="layers-panel__eye">
                <EyeIcon />
              </div>
              <div className="layers-panel__thumb layers-panel__thumb--text">T</div>
              <div className="layers-panel__name">{name}</div>
              <div className="layers-panel__lock"></div>
            </div>
          ))}
        </div>

        <div className="layers-panel__footer">
          <div className="layers-panel__footer-left">
            <span className="layers-panel__footer-icon" title="Link layers">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1-1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="layers-panel__footer-icon" title="Layer styles">fx</span>
            <span className="layers-panel__footer-icon" title="Add mask">◐</span>
            <span className="layers-panel__footer-icon" title="Adjustment layer">◑</span>
            <span className="layers-panel__footer-icon" title="Create group">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H3V7z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
                <path d="M3 10h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          <div className="layers-panel__footer-right">
            <span className="layers-panel__footer-icon" title="Create new layer">+</span>
            <span className="layers-panel__footer-icon layers-panel__footer-icon--danger" title="Delete layer">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
                <path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    );
  }
);

LayersPanel.displayName = 'LayersPanel';

export default LayersPanel;
