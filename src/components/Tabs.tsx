import React, { useState, useRef } from 'react';

export interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (value: string) => void;
  className?: string;
  /** Accessible name for the tablist. */
  ariaLabel?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className, ariaLabel }) => {
  const [internalActive, setInternalActive] = useState(tabs[0]?.value ?? '');
  const current = activeTab ?? internalActive;
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (value: string) => {
    setInternalActive(value);
    onChange?.(value);
  };

  // Roving tabindex + arrow/Home/End navigation (WAI-ARIA tabs pattern).
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const count = tabs.length;
    let nextIndex: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % count;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + count) % count;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = count - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const next = tabs[nextIndex];
    select(next.value);
    btnRefs.current[next.value]?.focus();
  };

  return (
    <div className={`tabs ${className ?? ''}`}>
      <div className="tabs__container" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, index) => {
          const isActive = current === tab.value;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                btnRefs.current[tab.value] = el;
              }}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={`tabs__tab ${isActive ? 'tabs__tab--active' : ''}`}
              onClick={() => select(tab.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
