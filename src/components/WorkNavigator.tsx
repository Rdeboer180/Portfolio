import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useWorkNavigator } from '../context/WorkNavigatorContext';
import { useUnlock } from '../context/UnlockContext';
import { Project, cardTitleFor, clientLabelFor, yearSpanFor } from '../data/projects';
import { WORK_GROUPS, NavigatorGroupId, clientGroups, studiesInGroup } from '../data/workGroups';
import { coinVariants, coinVariantsReduced } from '../data/toolCoins';

const LockGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FolderGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H3V7z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M3 10h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
  </svg>
);

/** The same still the card shows: a loop's poster, else the featured image. */
const posterFor = (project: Project) =>
  project.featuredVideo ? project.featuredVideo.split('?')[0].replace(/\.mp4$/, '-poster.jpg') : project.featured;

/**
 * One study row. The thumbnail drops into place with the card tray's coin
 * physics when its group opens, so picking a group reads as the studies
 * landing in the rail rather than a list repainting. `index` staggers the
 * landing left to right the way the coins stagger by x.
 */
const StudyRow: React.FC<{ project: Project; index: number; locked: boolean }> = ({ project, index, locked }) => {
  const { point, pointedSlug } = useWorkNavigator();
  const reduceMotion = useReducedMotion();
  const mediaLocked = locked && !(project.featuredVideo && project.featuredVideoPublic);
  const poster = posterFor(project);
  const variants = reduceMotion ? coinVariantsReduced : coinVariants;
  // A coin's `x` only sets its landing delay here; rows keep a square set.
  const coin = { icon: '', name: '', x: index * 16, rot: 0, lift: 0, z: 1 };
  return (
    <li>
      <a
        className={`dam__item work-nav__study${locked ? ' dam__item--locked' : ''}${pointedSlug === project.slug ? ' work-nav__study--pointed' : ''}`}
        href={`/work/${project.slug}/`}
        onMouseEnter={() => point(project.slug)}
        onMouseLeave={() => point(null)}
        onFocus={() => point(project.slug)}
        onBlur={() => point(null)}
      >
        <motion.span
          className={`dam__thumb${mediaLocked || !poster ? ' dam__thumb--glyph dam__thumb--locked' : ''}`}
          custom={coin}
          variants={variants}
          initial="idle"
          animate="in"
        >
          {mediaLocked || !poster ? <LockGlyph /> : <img src={poster} alt="" loading="lazy" />}
        </motion.span>
        <span className="dam__name">{cardTitleFor(project)}</span>
        <span className="dam__meta">{yearSpanFor(project)} · {clientLabelFor(project, locked)}</span>
      </a>
    </li>
  );
};

/**
 * The work navigator's folders: the case studies filed by discipline and by
 * client, in the one WORK_ORDER, the way AEM Assets files them. It lives in
 * the Asset Panel under the Case studies filter, because filing by client and
 * pointing a row at its card are authoring affordances; a visitor filters by
 * discipline with the chips in the section itself. Picking a folder changes
 * which studies the work section shows; the rows themselves open a study.
 */
const WorkNavigator: React.FC = () => {
  const nav = useWorkNavigator();
  const { unlocked } = useUnlock();

  const isLocked = (project: Project) => !unlocked && project.stream === 'professional';
  const countFor = (id: NavigatorGroupId) => (id === 'client' ? clientGroups(!unlocked).length : studiesInGroup(id).length);

  return (
    <div className="work-nav">
      <ul className="work-nav__groups" aria-label="Case study folders">
        {WORK_GROUPS.map((group) => {
          const selected = nav.group === group.id;
          return (
            <li key={group.id}>
              <button
                type="button"
                className="work-nav__group"
                aria-pressed={selected}
                aria-expanded={selected}
                onClick={() => nav.selectGroup(selected ? null : group.id)}
              >
                <span className="work-nav__folder"><FolderGlyph /></span>
                <span className="work-nav__group-label">{group.label}</span>
                <span className="work-nav__count">{countFor(group.id)}</span>
              </button>
              {selected && group.id !== 'client' && (
                <ul className="dam__list work-nav__studies" key={group.id}>
                  {studiesInGroup(group.id).map((project, index) => (
                    <StudyRow key={project.slug} project={project} index={index} locked={isLocked(project)} />
                  ))}
                </ul>
              )}
              {selected && group.id === 'client' && (
                <ul className="work-nav__clients">
                  {clientGroups(!unlocked).map((client) => {
                    const current = nav.clientKey === client.key;
                    return (
                      <li key={client.key}>
                        <button
                          type="button"
                          className="work-nav__client"
                          aria-pressed={current}
                          onClick={() => nav.selectClient(current ? null : client.key)}
                        >
                          <span className="work-nav__group-label">{client.label}</span>
                          <span className="work-nav__count">{client.studies.length}</span>
                        </button>
                        {(current || !nav.clientKey) && (
                          <ul className="dam__list work-nav__studies" key={`${client.key}-${nav.clientKey ?? 'all'}`}>
                            {client.studies.map((project, index) => (
                              <StudyRow key={project.slug} project={project} index={index} locked={isLocked(project)} />
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      {nav.group && (
        <button type="button" className="work-nav__clear" onClick={() => nav.selectGroup(null)}>
          Show all work
        </button>
      )}
    </div>
  );
};

export default WorkNavigator;
