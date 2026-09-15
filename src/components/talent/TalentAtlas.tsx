import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ATLAS_RANK_LABELS, ATLAS_SKILLS, ATLAS_SKILL_BY_ID, atlasPoints, evaluateAtlas, pickAtlasClass } from '../../data/talent/atlas';
import { ATLAS_ABILITY_POSITIONS, ATLAS_SIZE, ATLAS_SKILL_POSITIONS, atlasCurve } from '../../data/talent/atlasLayout';
import { AtlasBuild, RYAN_ATLAS, atlasPools, atlasSpent, changeAtlasPoint, clampAtlas, decodeAtlas, encodeAtlas } from '../../data/talent/atlasState';
import type { Intake, TreeId } from '../../data/talent/types';
import { scrollBehavior } from '../../utils/motion';
import Glyph from './Glyph';
import TalentIntakeStrip, { ALL_ANSWERED, NOTHING_ANSWERED, effectiveIntake, intakeComplete } from './TalentIntakeStrip';
import type { Answered, IntakeQuestion } from './TalentIntakeStrip';

const EMPTY_BUILD: AtlasBuild = { intake: { name: '', degree: 'bachelors', major: 'graphic', minor: 'none', years: 5, hours: 0 }, allocation: {}, craftCredit: 0, discovered: [] };
const TERRITORIES: { id: TreeId; name: string; line: string; x: number }[] = [
  { id: 'design', name: 'Design & Systems', line: 'People × structure × craft', x: 240 },
  { id: 'technical', name: 'Technical', line: 'Tools × production × translation', x: 600 },
  { id: 'code', name: 'Code', line: 'Logic × extensibility × shipping', x: 960 },
];

export const RankRing: React.FC<{ points: number }> = ({ points }) => (
  <svg className="atlas-rank" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    {[0, 1, 2, 3, 4].map((index) => <circle key={index} cx="32" cy="32" r="29" pathLength="100" strokeDasharray="16 84" transform={`rotate(${index * 72 - 87} 32 32)`} className={index < points ? 'is-earned' : ''} />)}
  </svg>
);

const TalentAtlas: React.FC<{ own?: boolean }> = ({ own = false }) => {
  const [build, setBuild] = useState<AtlasBuild>(own ? EMPTY_BUILD : RYAN_ATLAS);
  const [answered, setAnswered] = useState<Answered>(own ? NOTHING_ANSWERED : ALL_ANSWERED);
  const [abilityId, setAbilityId] = useState('guardrail-architect');
  const [skillId, setSkillId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [announcement, setAnnouncement] = useState('');
  const [copied, setCopied] = useState(false);
  const [dirty, setDirty] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const pendingFocus = useRef<string | null>(null);
  const live = !own || intakeComplete(answered);
  const effective = own ? effectiveIntake(build.intake, answered) : build.intake;
  const pools = atlasPools(effective, build.craftCredit);
  const states = useMemo(() => evaluateAtlas(build.allocation, new Set(build.discovered)), [build.allocation, build.discovered]);
  const selected = states.find((state) => state.ability.id === abilityId) || states[0];
  const selectedSkill = skillId ? ATLAS_SKILL_BY_ID[skillId] : null;
  const classPair = useMemo(() => pickAtlasClass(states), [states]);
  const spentByTerritory = atlasSpent(build.allocation);
  const spent = Object.values(spentByTerritory).reduce((sum, value) => sum + value, 0);
  const discovered = states.filter((state) => state.visibility === 'discovered');
  const mastered = ATLAS_SKILLS.filter((skill) => atlasPoints(build.allocation, skill.id) === 5).length;
  const className = [classPair.primary?.ability.name, classPair.secondary?.ability.name].filter(Boolean).join(' / ') || 'Your class is taking shape';
  const visibleRecipe = !skillId && selected.visibility === 'discovered' ? selected.ability.ingredients : [];
  const contributions = skillId ? states.filter((state) => state.ability.ingredients.includes(skillId)) : [];

  useEffect(() => {
    if (!own) return;
    const raw = new URLSearchParams(window.location.hash.slice(1)).get('s');
    if (!raw) return;
    const shared = decodeAtlas(raw);
    if (shared) { setBuild(shared); setAnswered(ALL_ANSWERED); }
    else setAnnouncement('This shared build could not be read. You can start a new one below.');
  }, [own]);

  useEffect(() => {
    if (!own || !dirty) return;
    const url = new URL(window.location.href);
    url.hash = new URLSearchParams({ s: encodeAtlas(build) }).toString();
    window.history.replaceState(null, '', url.toString());
  }, [build, dirty, own]);

  useEffect(() => {
    if (!pendingFocus.current) return;
    const element = buttons.current[pendingFocus.current];
    pendingFocus.current = null;
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ behavior: scrollBehavior(), block: 'center', inline: 'center' });
  }, [zoom]);

  const inspectAbility = (id: string) => { setAbilityId(id); setSkillId(null); };
  const goToNode = (id: string) => {
    const element = buttons.current[id];
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ behavior: scrollBehavior(), block: 'center', inline: 'center' });
  };
  const inspectSkill = (id: string) => setSkillId(id);

  const changePoint = (id: string, delta: 1 | -1) => {
    if (!own || !live) return;
    const allocation = changeAtlasPoint(build.allocation, id, delta, pools);
    if (allocation === build.allocation) return;
    const after = evaluateAtlas(allocation, new Set(build.discovered));
    const changed = after.filter((state, index) => state.rank > states[index].rank);
    setBuild({ ...build, allocation });
    setDirty(true);
    setCopied(false);
    const message = changed.map((state) => `${state.ability.name}: ${state.rankLabel}`).join('. ');
    setAnnouncement(message || `${ATLAS_SKILL_BY_ID[id].name}: ${atlasPoints(allocation, id)} of 5 points. Connected ability charge updated.`);
  };

  const changeIntake = (patch: Partial<Intake>, answer?: IntakeQuestion) => {
    const intake = { ...build.intake, ...patch };
    if (intake.minor === intake.major) intake.minor = 'none';
    const nextAnswered = answer ? { ...answered, [answer]: true } : answered;
    const nextPools = atlasPools(effectiveIntake(intake, nextAnswered), build.craftCredit);
    setBuild({ ...build, intake, allocation: clampAtlas(build.allocation, nextPools) });
    setAnswered(nextAnswered); setDirty(true); setCopied(false);
  };

  const copyLink = async () => {
    try {
      const url = new URL('/talent-tree/atlas/build/', window.location.origin);
      url.hash = new URLSearchParams({ s: encodeAtlas(build) }).toString();
      await navigator.clipboard.writeText(url.toString()); setCopied(true);
    } catch { setAnnouncement('Copy was unavailable. Your build is saved in this page’s address; copy it from the address bar.'); }
  };

  const moveFocus = (event: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!direction) return;
    event.preventDefault();
    const positions = { ...ATLAS_SKILL_POSITIONS, ...ATLAS_ABILITY_POSITIONS };
    const current = positions[id];
    const nearest = Object.entries(positions).filter(([key, point]) => key !== id && (point.x - current.x) * direction[0] + (point.y - current.y) * direction[1] > 0)
      .sort(([, a], [, b]) => {
        const distance = (point: { x: number; y: number }) => Math.hypot(point.x - current.x, point.y - current.y) + Math.abs((point.x - current.x) * direction[1] - (point.y - current.y) * direction[0]) * 2;
        return distance(a) - distance(b);
      })[0];
    if (nearest) goToNode(nearest[0]);
  };

  return (
    <main className="atlas" id="main-content">
      <div className="atlas-intro">
        <div><p className="atlas-eyebrow">Talent Atlas · work in progress</p><h1>{own ? 'Find your intersections.' : 'One career. Many connections.'}</h1></div>
        <div><p>I’ve never been sure what to call myself. Product Designer, Design Engineer, Systems Designer. Instead of picking one, I mapped where my experience connects.</p>
          <Link className="atlas-cta" to={own ? '/talent-tree/atlas/' : '/talent-tree/atlas/build/'}>{own ? 'View Ryan’s Atlas' : 'Build your own Atlas'} <span aria-hidden="true">↗</span></Link></div>
      </div>
      {own && <div className="atlas-intake tt-console"><TalentIntakeStrip headingLevel="h2" intake={build.intake} answered={answered} total={pools.total} level={pools.level} onChange={changeIntake} /></div>}
      <dl className="atlas-stats">
        <div><dt>Level</dt><dd>{pools.level}</dd></div><div><dt>Points invested</dt><dd>{spent}<small> / {pools.total}</small></dd></div>
        <div><dt>Mastered skills</dt><dd>{mastered}<small> / 32</small></dd></div><div><dt>Abilities discovered</dt><dd>{discovered.length}<small> / 31</small></dd></div>
        <div className="atlas-stats__class"><dt>Current class</dt><dd>{className}</dd></div>
      </dl>
      <div className="atlas-inspector" ref={inspectorRef} id="atlas-inspector" tabIndex={-1} aria-label={selectedSkill ? 'Skill details' : 'Ability details'} role="region">
        {selectedSkill ? <>
          <div className="atlas-inspector__identity"><span className={`atlas-emblem atlas-territory--${selectedSkill.territory}`}><Glyph name={selectedSkill.glyph} size={28} /></span>
            <div><p className="atlas-eyebrow">Skill · {atlasPoints(build.allocation, skillId!)} / 5 invested</p><h2>{selectedSkill.name}</h2><p>{selectedSkill.meaning}</p></div>
          </div>
          <div className="atlas-inspector__body">
            {own && <div className="atlas-spend"><button type="button" aria-label={`Remove a point from ${selectedSkill.name}`} disabled={!live || changeAtlasPoint(build.allocation, selectedSkill.id, -1, pools) === build.allocation} onClick={() => changePoint(selectedSkill.id, -1)}>−</button><strong>{atlasPoints(build.allocation, selectedSkill.id)} / 5</strong><button type="button" aria-label={`Add a point to ${selectedSkill.name}`} disabled={!live || changeAtlasPoint(build.allocation, selectedSkill.id, 1, pools) === build.allocation} onClick={() => changePoint(selectedSkill.id, 1)}>+</button><span>{pools.total - spent} points unspent</span></div>}
            {selectedSkill.prerequisite && <p className="atlas-meta">Requires {ATLAS_SKILL_BY_ID[selectedSkill.prerequisite.skillId].name} at {selectedSkill.prerequisite.points}. You have {atlasPoints(build.allocation, selectedSkill.prerequisite.skillId)}.</p>}
            <p className="atlas-eyebrow">Contributes to</p><div className="atlas-contributions">{contributions.filter((state) => state.visibility === 'discovered').map((state) => <button key={state.ability.id} type="button" onClick={() => inspectAbility(state.ability.id)}>{state.ability.name} <span>{state.rankLabel}</span></button>)}</div>
            {contributions.some((state) => state.visibility !== 'discovered') && <p className="atlas-meta">{contributions.filter((state) => state.visibility !== 'discovered').length} undiscovered connections</p>}
          </div>
        </> : <>
          <div className="atlas-inspector__identity"><span className="atlas-emblem"><Glyph name={selected.visibility === 'discovered' ? ATLAS_SKILL_BY_ID[selected.ability.ingredients[0]].glyph : 'branch'} size={28} /></span><div>
            <p className="atlas-eyebrow">{selected.visibility === 'discovered' ? `${selected.rankLabel} · ability` : 'Undiscovered ability'}</p>
            <h2>{selected.visibility === 'discovered' ? selected.ability.name : 'An intersection is forming.'}</h2>
            <p>{selected.visibility === 'discovered' ? selected.ability.description : selected.visibility === 'resonating' ? selected.ability.hint : 'Invest across your skills to discover what they can do together.'}</p>
            {selected.visibility === 'discovered' ? <><div className="atlas-charge" role="meter" aria-label="Ability charge" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(selected.charge * 100)}><span style={{ width: `${selected.charge * 100}%` }} /></div><p className="atlas-meta">{selected.invested} / {selected.capacity} recipe points · {Math.round(selected.charge * 100)}% charged</p></> : <p className="atlas-meta">{selected.activeConnections} connections detected · recipe still hidden</p>}
          </div></div>
          <div className="atlas-inspector__body">{selected.visibility === 'discovered' ? <>
            <p className="atlas-eyebrow">Recipe connections</p><div className="atlas-ingredients">{selected.requirements.map((requirement) => <button key={requirement.skillId} type="button" onClick={() => goToNode(requirement.skillId)}><span className={`atlas-mini atlas-territory--${ATLAS_SKILL_BY_ID[requirement.skillId].territory}`}><RankRing points={requirement.points} /><Glyph name={ATLAS_SKILL_BY_ID[requirement.skillId].glyph} size={16} /></span><strong>{ATLAS_SKILL_BY_ID[requirement.skillId].name}</strong><span>{requirement.points} / 5</span></button>)}</div>
            <p className="atlas-next"><strong>{selected.nextRank ? `Next: ${ATLAS_RANK_LABELS[selected.nextRank]}` : 'Master rank reached'}</strong>{selected.nextRank && <span>{selected.requirements.filter((requirement) => requirement.nextRankMissing > 0).map((requirement) => `${ATLAS_SKILL_BY_ID[requirement.skillId].name} +${requirement.nextRankMissing}`).join(' · ')}</span>}</p>
          </> : <p className="atlas-meta">The name and recipe appear when every ingredient has at least one point. Every invested point still contributes to its charge.</p>}</div>
        </>}
      </div>
      <div className="atlas-mapbar"><div><p className="atlas-eyebrow">Explore the Atlas</p><p>32 skills. 31 combinations. Follow the connections.</p></div><div className="atlas-zoom"><button type="button" aria-label="Zoom out" disabled={zoom <= 0.85} onClick={() => { pendingFocus.current = skillId || abilityId; setZoom(Math.max(0.85, zoom - 0.15)); }}>−</button><span>{Math.round(zoom * 100)}%</span><button type="button" aria-label="Zoom in" disabled={zoom >= 1.3} onClick={() => { pendingFocus.current = skillId || abilityId; setZoom(Math.min(1.3, zoom + 0.15)); }}>+</button></div></div>
      <div className="atlas-territory-nav" aria-label="Jump to territory">{TERRITORIES.map((territory) => <button type="button" key={territory.id} onClick={() => mapRef.current?.scrollTo({ left: territory.x * zoom - mapRef.current.clientWidth / 2, behavior: scrollBehavior() })}>{territory.name}<span>{spentByTerritory[territory.id]} pts</span></button>)}</div>
      <div className="atlas-map" ref={mapRef} tabIndex={0} role="region" aria-label="Talent Atlas map. Scroll horizontally to explore territories. Use arrow keys on nodes to follow the map.">
        <div style={{ width: ATLAS_SIZE.width * zoom, height: ATLAS_SIZE.height * zoom }} className="atlas-map__sizer">
          <div className="atlas-map__canvas" style={{ width: ATLAS_SIZE.width, height: ATLAS_SIZE.height, transform: `scale(${zoom})` }}>
            <div className="atlas-terrain" aria-hidden="true"><span className="atlas-terrain__design" /><span className="atlas-terrain__technical" /><span className="atlas-terrain__code" /></div>
            {TERRITORIES.map((territory) => <div className={`atlas-territory-label atlas-territory--${territory.id}`} key={territory.id} style={{ left: territory.x }}><strong>{territory.name}</strong><span>{territory.line}</span></div>)}
            {[['Core essentials', 70], ['Expanded practice', 580], ['Specialization', 1020], ['Mastery & intersections', 1550], ['Hidden horizons', 2360]].map(([label, y], i) => <div className="atlas-depth" key={label} style={{ top: Number(y) }}><span>0{i + 1}</span>{label}</div>)}
            <svg className="atlas-wires" width={ATLAS_SIZE.width} height={ATLAS_SIZE.height} aria-hidden="true">
              {ATLAS_SKILLS.filter((skill) => skill.prerequisite).map((skill) => <path key={skill.id} className={`atlas-territory--${skill.territory} atlas-wire${visibleRecipe.length ? ' is-muted' : ''}`} d={atlasCurve(ATLAS_SKILL_POSITIONS[skill.prerequisite!.skillId], ATLAS_SKILL_POSITIONS[skill.id])} />)}
              {states.filter((state) => state.visibility !== 'hidden').flatMap((state) => state.ability.ingredients.filter((id) => state.visibility === 'discovered' || atlasPoints(build.allocation, id) > 0).map((id) => <path key={`${state.ability.id}-${id}`} className={`atlas-wire atlas-wire--ability atlas-territory--${ATLAS_SKILL_BY_ID[id].territory}${visibleRecipe.length && state.ability.id === abilityId ? ' is-selected' : visibleRecipe.length ? ' is-muted' : ''}`} d={atlasCurve(ATLAS_SKILL_POSITIONS[id], ATLAS_ABILITY_POSITIONS[state.ability.id])} pathLength={1} />))}
            </svg>
            {ATLAS_SKILLS.map((skill) => {
              const points = atlasPoints(build.allocation, skill.id);
              const position = ATLAS_SKILL_POSITIONS[skill.id];
              const locked = skill.prerequisite && atlasPoints(build.allocation, skill.prerequisite.skillId) < skill.prerequisite.points;
              return <button type="button" key={skill.id} ref={(element) => { buttons.current[skill.id] = element; }} className={`atlas-node atlas-territory--${skill.territory}${points === 5 ? ' is-mastered' : ''}${visibleRecipe.includes(skill.id) || skillId === skill.id ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`} style={{ left: position.x, top: position.y }} aria-label={`${skill.name}. ${points} of 5 talent points invested.${locked ? ` Locked: requires ${ATLAS_SKILL_BY_ID[skill.prerequisite!.skillId].name} at ${skill.prerequisite!.points}.` : ''}`} aria-pressed={skillId === skill.id} title={skill.meaning} onClick={() => inspectSkill(skill.id)} onKeyDown={(event) => moveFocus(event, skill.id)}>
                <span className="atlas-node__orb"><RankRing points={points} /><Glyph name={skill.glyph} />{points === 5 && <span className="atlas-node__mastery" aria-hidden="true">◆</span>}</span><strong>{skill.name}</strong><small>{locked ? 'Locked' : `${points} / 5`}</small>
              </button>;
            })}
            {states.map((state, index) => {
              const position = ATLAS_ABILITY_POSITIONS[state.ability.id];
              const known = state.visibility === 'discovered';
              const glyph = known ? ATLAS_SKILL_BY_ID[state.ability.ingredients[0]].glyph : 'branch';
              return <button type="button" key={state.ability.id} ref={(element) => { buttons.current[state.ability.id] = element; }} className={`atlas-node atlas-node--ability atlas-node--${state.ability.kind} atlas-territory--${state.territories[0]} is-${state.visibility}${!skillId && abilityId === state.ability.id ? ' is-selected' : ''}`} style={{ left: position.x, top: position.y }} aria-label={known ? `${state.ability.name}. ${state.rankLabel}. ${Math.round(state.charge * 100)} percent charged.` : `Undiscovered ability ${index + 1}. ${state.activeConnections} connections detected.`} aria-pressed={!skillId && abilityId === state.ability.id} onClick={() => inspectAbility(state.ability.id)} onKeyDown={(event) => moveFocus(event, state.ability.id)}>
                <span className="atlas-node__orb"><svg className="atlas-rank atlas-rank--charge" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" /><circle cx="32" cy="32" r="29" pathLength="100" strokeDasharray={`${known ? state.charge * 100 : 0} 100`} transform="rotate(-90 32 32)" className="is-earned" /></svg>{known ? <Glyph name={glyph} /> : <span aria-hidden="true">?</span>}</span><strong>{known ? state.ability.name : '???'}</strong><small>{known ? state.rankLabel : state.visibility === 'resonating' ? `${state.activeConnections} connections` : 'Undiscovered'}</small>
              </button>;
            })}
          </div>
        </div>
      </div>
      <div className="atlas-selection-bar"><span>{selectedSkill ? `${selectedSkill.name} · ${atlasPoints(build.allocation, selectedSkill.id)} / 5` : selected.visibility === 'discovered' ? `${selected.ability.name} · ${selected.rankLabel}` : 'Undiscovered connection'}</span><button type="button" onClick={() => { inspectorRef.current?.focus({ preventScroll: true }); inspectorRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }); }}>Inspect selection ↑</button></div>
      <p className="atlas-announcement" role="status" aria-live="polite">{announcement}</p>
      <details className="atlas-rules"><summary>How the points and ranks work</summary><p>Experience creates your budget. Each skill accepts up to five points. Existing advanced-skill gates still apply. Abilities appear when every ingredient has at least one point; their rank follows the weakest ingredient.</p><ul>{pools.receipt.map((line, index) => <li key={index}>{line.label}</li>)}</ul><p>Charge measures invested recipe points, not professional competence. A class reflects your strongest combinations, with extra weight for finishers and connections between territories.</p></details>
      {own ? <div className="atlas-share"><label>Your name<input value={build.intake.name} maxLength={60} onChange={(event) => changeIntake({ name: event.target.value })} /></label><button type="button" className="atlas-cta" disabled={!live} onClick={copyLink}>{copied ? 'Link copied' : 'Copy build link'}</button><button type="button" onClick={() => { setBuild(EMPTY_BUILD); setAnswered(NOTHING_ANSWERED); setDirty(false); setCopied(false); const url = new URL(window.location.href); url.hash = ''; window.history.replaceState(null, '', url.toString()); setAnnouncement('Your build has been reset.'); }}>Reset build</button></div> : <div className="atlas-invitation"><h2>Think your title doesn’t quite fit either?</h2><p>Spend points based on your experience and see what your intersections unlock.</p><Link className="atlas-cta" to="/talent-tree/atlas/build/">Build your own Atlas ↗</Link></div>}
    </main>
  );
};

export default TalentAtlas;
