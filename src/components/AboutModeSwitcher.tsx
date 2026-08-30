import React, { useRef } from 'react';

export type AboutMode = 'approach' | 'studio';

interface AboutModeSwitcherProps {
  activeMode: AboutMode;
  onChange: (mode: AboutMode) => void;
}

const MODES: Array<{ value: AboutMode; index: string; label: string; note: string }> = [
  { value: 'approach', index: '01', label: 'My approach', note: 'The thinking' },
  { value: 'studio', index: '02', label: 'Step into the studio', note: 'Where it happens' },
];

const AboutModeSwitcher: React.FC<AboutModeSwitcherProps> = ({ activeMode, onChange }) => {
  const tabRefs = useRef<Record<AboutMode, HTMLButtonElement | null>>({
    approach: null,
    studio: null,
  });

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? MODES.length - 1
        : event.key === 'ArrowRight'
          ? (index + 1) % MODES.length
          : (index - 1 + MODES.length) % MODES.length;
    const nextMode = MODES[nextIndex].value;
    onChange(nextMode);
    tabRefs.current[nextMode]?.focus();
  };

  return (
    <div className="about-mode-switcher">
      <div className="about-mode-switcher__inner">
        <p className="about-mode-switcher__prompt">Choose a side of the story</p>
        <div className="about-mode-switcher__tabs" role="tablist" aria-label="About page views">
          {MODES.map((mode, index) => {
            const isActive = activeMode === mode.value;
            return (
              <button
                key={mode.value}
                ref={(element) => {
                  tabRefs.current[mode.value] = element;
                }}
                id={`about-mode-tab-${mode.value}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`about-mode-panel-${mode.value}`}
                tabIndex={isActive ? 0 : -1}
                className={`about-mode-switcher__tab${isActive ? ' is-active' : ''}`}
                onClick={() => onChange(mode.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="about-mode-switcher__index">{mode.index}</span>
                <span className="about-mode-switcher__label">{mode.label}</span>
                <span className="about-mode-switcher__note">{mode.note}</span>
                <span className="about-mode-switcher__arrow" aria-hidden="true">&rarr;</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutModeSwitcher;
