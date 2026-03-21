import React, { useState } from 'react';

export interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  const [internalActive, setInternalActive] = useState(tabs[0]?.value ?? '');
  const current = activeTab ?? internalActive;

  const handleClick = (value: string) => {
    setInternalActive(value);
    onChange?.(value);
  };

  return (
    <div className={`tabs ${className ?? ''}`}>
      <div className="tabs__container">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`tabs__tab ${current === tab.value ? 'tabs__tab--active' : ''}`}
            onClick={() => handleClick(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
