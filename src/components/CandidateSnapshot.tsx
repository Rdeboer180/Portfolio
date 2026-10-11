import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { EMAIL_HREF } from '../data/site';
import LinkedInLink from './LinkedInLink';

// Factual candidate snapshot for recruiters + AI.
// - `full` (About page): always-open bordered card with summary + stack chips.
// - `compact` (homepage): a disclosure — the role heading stays visible, the
//   facts/links collapse behind a toggle. Content stays in the DOM (animated via
//   max-height, not display:none) so it's still crawlable; the collapsed panel is
//   `inert` so keyboard users don't tab into hidden links.
interface CandidateSnapshotProps {
  variant?: 'full' | 'compact';
}

const FACTS = [
  { label: 'Location', value: 'South Bend, Indiana' },
  { label: 'Availability', value: 'Open to remote roles (US)' },
  { label: 'Experience', value: '16+ years' },
];

const STACK = ['Adobe Experience Manager', 'Figma', 'Production Sass', 'Storybook', 'React systems', 'Agent-assisted React Native / Expo'];

const Facts: React.FC = () => (
  <dl className="candidate-snapshot__facts">
    {FACTS.map((f) => (
      <div key={f.label} className="candidate-snapshot__fact">
        <dt>{f.label}</dt>
        <dd>{f.value}</dd>
      </div>
    ))}
  </dl>
);

const Links: React.FC = () => (
  <div className="candidate-snapshot__links">
    <a href={EMAIL_HREF} className="candidate-snapshot__link">Email</a>
    <Link to="/resume" className="candidate-snapshot__link">Résumé</Link>
    <LinkedInLink label="LinkedIn" surface="candidate_snapshot" className="candidate-snapshot__link" />
  </div>
);

const CandidateSnapshot: React.FC<CandidateSnapshotProps> = ({ variant = 'full' }) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const headingId = `candidate-snapshot-heading-${variant}`;

  // ── Homepage: collapsible disclosure ──────────────────────────────────
  if (variant === 'compact') {
    return (
      <section className="candidate-snapshot candidate-snapshot--compact" aria-labelledby={headingId}>
        <div className="candidate-snapshot__inner">
          <h2 id={headingId} className="candidate-snapshot__name">
            <button
              type="button"
              className="candidate-snapshot__toggle"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((o) => !o)}
            >
              <span>Ryan DeBoer, Design Systems &amp; AEM</span>
              <svg
                className="candidate-snapshot__chevron"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </h2>
          <div
            id={panelId}
            className="candidate-snapshot__panel"
            data-open={open}
            inert={!open ? true : undefined}
          >
            <div className="candidate-snapshot__panel-inner">
              <Facts />
              <Links />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── About page: always-open full card ─────────────────────────────────
  return (
    <section className="candidate-snapshot candidate-snapshot--full" aria-labelledby={headingId}>
      <div className="candidate-snapshot__inner">
        <p className="candidate-snapshot__eyebrow">At a glance</p>
        <h2 id={headingId} className="candidate-snapshot__name">
          Ryan DeBoer, Design Systems &amp; AEM
        </h2>
        <Facts />
        <p className="candidate-snapshot__summary">
          I design and build governed component systems in Adobe Experience Manager (AEM).
          Across 12+ years at Tire Rack, my work connects Figma, production Sass, content
          authoring, and collaboration with engineering, SEO, and design teams. I am open to
          remote US roles focused on design systems, AEM, and product design, with hands-on
          UX/UI experience.
        </p>
        <ul className="candidate-snapshot__evidence" aria-label="Selected project evidence">
          <li><Link to="/work/aem-component-system/">AEM component system</Link>: core-component variants, production Sass, and authoring defaults.</li>
          <li><Link to="/work/landing-pages/">Landing page system</Link>: reusable templates and governance for content authors.</li>
          <li><Link to="/work/wheelrack/">WheelRack</Link>: enterprise design systems, tokens, and Storybook components.</li>
          <li><Link to="/notes/aem-meeting-authors-where-they-work/">Agentic AEM authoring</Link>: current experiments with Claude, MCP, and governed components.</li>
        </ul>
        <div className="candidate-snapshot__stack">
          <span className="candidate-snapshot__stack-label">Current working stack</span>
          <ul className="candidate-snapshot__chips">
            {STACK.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <Links />
      </div>
    </section>
  );
};

export default CandidateSnapshot;
