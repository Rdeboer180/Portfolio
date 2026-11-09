import React from 'react';
import { Link } from 'react-router-dom';

// A class name as text, except the ones that have a note behind them: those
// read as a link to it. Visual Problem Solver is Ryan's title, and the note
// says what he means by it.
export const CLASS_NOTES: Record<string, string> = {
  'Visual Problem Solver': '/notes/visual-problem-solver/',
};

const ClassName: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const to = CLASS_NOTES[name];
  return to ? <Link to={to} className={className}>{name}</Link> : <>{name}</>;
};

/** "Primary / Secondary", with the primary linked when it has a note. */
export const ClassLabel: React.FC<{ primary: string; secondary: string; linkClassName?: string }> = ({ primary, secondary, linkClassName }) => (
  <>
    <ClassName name={primary} className={linkClassName} />
    {` / ${secondary}`}
  </>
);

export default ClassName;
