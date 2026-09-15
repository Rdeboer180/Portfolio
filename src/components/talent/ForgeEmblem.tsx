import React, { useId } from 'react';
import type { ClassificationId } from '../../data/talent/mastery';

const CLASS_MARKS: Record<ClassificationId | 'maker', string> = {
  maker: 'M12 4v16M4 12h16M6 6l12 12M18 6 6 18',
  'craft-steward': 'M12 2 21 6v7c0 4-5 7-9 9-4-2-9-5-9-9V6l9-4ZM12 6l5 7-5 5-5-5 5-7Zm0 0v7M10 13h4',
  form: 'M4 18 12 4l8 14H4ZM8 18l4-7 4 7M7 13h10',
  meaning: 'M4 5h6l2 3 2-3h6v13h-6l-2 2-2-2H4V5Zm8 3v12M7 9h2M7 12h2M15 9h2M15 12h2',
  behavior: 'M4 7h8l4 5-4 5H4M8 7l4 5-4 5M16 7h4v10h-4',
  structure: 'M12 3 21 8v9l-9 5-9-5V8l9-5Zm0 10v9M3 8l9 5 9-5M7 6l10 5v8M17 6 7 11v8',
  realization: 'M3 17V7h6v10M15 17V7h6v10M3 12h18M8 9l4 3-4 3M16 9l-4 3 4 3',
  stewardship: 'M12 3 21 7v6c0 4-5 7-9 9-4-2-9-5-9-9V7l9-4ZM8 12l3 3 5-6',
};
// Each passive has its own mark; the enclosing medallion establishes the family.
const PASSIVE_MARKS: Record<string, string> = {
  'tree-technical': 'M12 3 20 15l-5 6H9l-5-6 8-12Zm0 0v10M10 15a2 2 0 1 0 4 0 2 2 0 1 0-4 0M8 21h8',
  'tree-code': 'M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3ZM3 8h18M6 5.5h4M13 5.5h2M8 12l-3 3 3 3M16 12l3 3-3 3M13 11l-2 8',
  'systems-mapping': 'M9 3h6v5H9V3ZM3 16h6v5H3v-5Zm12 0h6v5h-6v-5M12 8v4M6 16v-4h12v4',
  'validation': 'M5 3h14v18H5V3ZM9 7h6M8 13l3 3 5-6',
  'apis-integrations': 'M8 5H4v14h4M16 5h4v14h-4M7 10h10l-3-3M17 14H7l3 3',
  'testing-quality': 'M3 4h18v16H3V4ZM3 8h18M8 14l3 3 5-6',
  'system-clarity': 'M3 3h6v6H3V3Zm12 12h6v6h-6v-6M9 6h9v9M3 15h6v6H3v-6M6 9v6',
  'evidence-loop': 'M5 7a8 8 0 0 1 14 1M19 3v5h-5M19 17a8 8 0 0 1-14-1M5 21v-5h5M9 12l2 2 4-4',
  'connected-interfaces': 'M2 4h9v7H2V4Zm11 9h9v7h-9v-7M6 11v6h7M11 7h7v6',
  'reliable-components': 'M3 3h8v8H3V3Zm12 0h6v6h-6V3ZM3 15h6v6H3v-6M12 16l4 4 6-8',

  'figma-force':'M5 4h10v5H5V4Zm0 5h10v5H5V9Zm0 5h5v6H5v-6M15 9h4v5h-4',
  'pixel-prowess':'M3 4h18v16H3V4Zm0 12 6-6 4 4 3-3 5 5M16 7h1',
  'vector-velocity':'M12 3 19 14l-7 7-7-7 7-11Zm0 0v11M10 14h4M3 4h3M18 4h3',
  'token-tactics':'M4 6h16v12H4V6Zm4 4h8M8 14h4M8 3v3M16 18v3',
  'component-combo':'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7',
  'motion-momentum':'M3 6h6M3 12h4M3 18h6M10 5l10 7-10 7 3-7-3-7Z',
  'prototype-pulse':'M4 4h16v16H4V4Zm2 8h3l2-4 3 8 2-4h2',
  'state-sense':'M3 4h7v6H3V4Zm11 10h7v6h-7v-6M10 7h7v7M6 10v7h8',
  'accessibility-armor':'M12 3 20 7v7l-8 7-8-7V7l8-4Zm0 4v1M7 11h10M12 11v4l-3 3M12 15l3 3',
  'handoff-harmony':'M3 8h11l-3-3M14 8l-3 3M21 16H10l3-3M10 16l3 3',
  'cms-command':'M3 4h18v5H3V4Zm0 8h7v8H3v-8Zm11 0h7M14 16h7M14 20h5',
  'template-tactics':'M3 4h18v16H3V4Zm0 5h18M9 9v11M13 13h4M13 16h4',
  'front-end-flow':'M8 5 2 12l6 7M16 5l6 7-6 7M14 3l-4 18',
  'typescript-tempo':'M3 4h18v16H3V4Zm4 5h7M10 9v8M16 10h2M16 13h2M16 16h2',
  'agent-arsenal':'M6 7h12v12H6V7Zm6-4v4M3 11h3M18 11h3M9 11h1M14 11h1M9 15h6',
  'script-spark':'M8 5H4v14h4M16 5h4v14h-4M13 4l-5 9h5l-2 7 6-10h-5l1-6Z',
  'system-sight':'M3 12 12 5l9 7-9 7-9-7Zm6 0 3-3 3 3-3 3-3-3ZM3 5V3h4M17 3h4v2M3 19v2h4M17 21h4v-2',
  'brand-barrage':'M3 19 8 4l5 15M5 13h6M15 5h6v6h-6V5Zm0 10 3-2 3 2v5h-6v-5',
  'interface-instinct':'M3 4h18v16H3V4Zm0 5h18M7 12l8 3-4 2-1 4-3-9Z',
  'lossless-handoff':'M3 5h7v14H3V5Zm11 0h7v14h-7V5M7 12h10M11 9l3 3-3 3',
  'content-choreography':'M3 4h6v4H3V4Zm12 0h6v4h-6V4ZM9 16h6v5H9v-5M6 8v4h12V8M12 12v4',
  'front-end-mastery':'M7 6 2 12l5 6M17 6l5 6-5 6M12 3l3 5-3 3-3-3 3-5Zm0 10v8',
  'cross-platform-craft':'M2 5h13v11H2V5Zm4 15h5M8 16v4M17 8h5v13h-5V8',
  'automation-advantage':'M5 8a8 8 0 0 1 14-1l2 4M21 5v6h-6M19 16a8 8 0 0 1-14 1l-2-4M3 19v-6h6M12 8l-2 5h4l-2 4',
  'signal-sense':'M3 19V5M3 19h18M6 15l4-5 4 2 6-7M6 7h1M17 17h1',
  'design-diplomacy':'M3 4h13v9H9l-4 4v-4H3V4Zm7 12h5l4 4v-4h2V8h-3',
  'guardrail-architect':'M12 3 21 7v10l-9 5-9-5V7l9-4Zm-6 7h12M8 10v7M16 10v7M8 14h8M12 6v4',
  'prototype-alchemist':'M8 3h8M10 3v6l-6 10v2h16v-2L14 9V3M7 15h10M10 18h1M14 17h1',
  'systemsmith':CLASS_MARKS.structure,
  'system-memory':'M3 7l9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4M12 11v10',
  'shipwright':'M3 14h18l-4 6H7l-4-6Zm9-11v11M12 4l7 7h-7M9 8H5v6',
};
export const ForgeMark: React.FC<{ id: string; size?: number }> = ({ id, size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={PASSIVE_MARKS[id] || CLASS_MARKS[id as ClassificationId] || CLASS_MARKS.maker} /></svg>;

export const ClassificationEmblem: React.FC<{ domain?: ClassificationId; level: number }> = ({ domain, level }) => {
  const id = useId().replace(/:/g, '');
  return <svg className="forge-crest" viewBox="0 0 128 140" aria-hidden="true">
    <defs><linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffbc75"/><stop offset=".4" stopColor="#f03d01"/><stop offset="1" stopColor="#9c2909"/></linearGradient><linearGradient id={`${id}-ink`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#34434a"/><stop offset="1" stopColor="#141d22"/></linearGradient></defs>
    <path d="M64 5 118 35v65l-54 33-54-33V35Z" fill={`url(#${id}-rim)`}/>
    <path d="M64 12 111 39v57l-47 29-47-29V39Z" fill={`url(#${id}-ink)`} stroke="#ffac6d" strokeWidth="1.5"/>
    <path d="m22 42 42-24 42 24M22 42v50l42 26" fill="none" stroke="#ffffff" opacity=".22"/>
    <path d="m106 44-42 25-42-25M64 69v49" fill="none" stroke="#ffffff" opacity=".08"/>
    <path d={CLASS_MARKS[domain || 'maker']} transform="translate(34 34) scale(2.5)" fill="none" stroke="#fff4e5" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"/>
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`m${44 + i * 10} 106 3-3 3 3-3 3Z`} fill={i < level ? '#ffb56f' : '#607078'}/>)}
  </svg>;
};
