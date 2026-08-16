import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { EMAIL_HREF } from '../data/site';

/**
 * The 404 the site never had.
 *
 * Every unknown URL used to hit `<Navigate to="/" replace />` — which returned
 * HTTP 200 and the homepage, told the visitor nothing, and (because the
 * prerendered shell was hydrated at the wrong URL) rendered the whole page
 * twice with a dead, half-animated copy on top.
 *
 * A person who mistypes a case-study slug wants three things: to know they are
 * lost, to know the site still works, and a way back to something real. Not a
 * silent teleport.
 */
const NotFoundPage: React.FC = () => {
  usePageMeta({
    title: 'Page not found — Ryan DeBoer',
    description: 'That page does not exist. Links to the work, the notes, and a way to get in touch.',
  });

  return (
    <div className="not-found">
      <p className="not-found__eyebrow">404</p>
      <h1 className="not-found__title">That page doesn&rsquo;t exist</h1>
      <p className="not-found__body">
        The link may be out of date, or the address may have a typo in it.
        Nothing is broken on your end.
      </p>

      <nav className="not-found__exits" aria-label="Where to go instead">
        <Link className="btn btn--primary btn--md" to="/#projects">
          See the work
        </Link>
        <Link className="btn btn--secondary btn--md" to="/notes">
          Read the notes
        </Link>
        <a className="not-found__contact" href={EMAIL_HREF}>
          Or email me
        </a>
      </nav>
    </div>
  );
};

export default NotFoundPage;
