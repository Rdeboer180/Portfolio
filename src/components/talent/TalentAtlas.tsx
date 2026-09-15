import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ATLAS_RANK_LABELS, ATLAS_SKILLS, ATLAS_SKILL_BY_ID, atlasPoints, evaluateAtlas } from '../../data/talent/atlas';
import { AtlasBuild, RYAN_ATLAS, FORGE_POINTS_PER_YEAR, atlasPools, atlasSpent, changeAtlasPoint, clampAtlas, decodeAtlas, encodeAtlas } from '../../data/talent/atlasState';
import { CLASS_LEVELS, proficiencyName, rankProficiencies, resolveMastery } from '../../data/talent/mastery';
import type { Intake, TreeId } from '../../data/talent/types';
import { scrollBehavior } from '../../utils/motion';
import Glyph from './Glyph';
import { ClassificationEmblem, ForgeMark } from './ForgeEmblem';
import TalentIntakeStrip, { ALL_ANSWERED, NOTHING_ANSWERED, effectiveIntake, intakeComplete } from './TalentIntakeStrip';
import type { Answered, IntakeQuestion } from './TalentIntakeStrip';

const EMPTY_BUILD: AtlasBuild = { intake: { name: '', degree: 'bachelors', major: 'graphic', minor: 'none', years: 5, hours: 0 }, allocation: {}, craftCredit: 0, discovered: [] };
const TREES: { id: TreeId; name: string; line: string; mark: string }[] = [
  { id: 'design', name: 'Design & Systems', line: 'People · structure · form', mark: 'structure' },
  { id: 'technical', name: 'Technical', line: 'Tools · process · production', mark: 'tree-technical' },
  { id: 'code', name: 'Code', line: 'Logic · behavior · delivery', mark: 'tree-code' },
];
export const RankRing: React.FC<{ points: number }> = ({ points }) => <svg className="atlas-rank" viewBox="0 0 64 64" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <circle key={i} cx="32" cy="32" r="29" pathLength="100" strokeDasharray="16 84" transform={`rotate(${i * 72 - 87} 32 32)`} className={i < points ? 'is-earned' : ''} />)}</svg>;
export const SkillMark: React.FC<{ id: string }> = ({ id }) => id === 'raster-craft' ? <ForgeMark id="pixel-prowess" /> : id === 'vector-design' ? <ForgeMark id="vector-velocity" /> : ['systems-mapping', 'validation', 'apis-integrations', 'testing-quality'].includes(id) ? <ForgeMark id={id}/> : <Glyph name={ATLAS_SKILL_BY_ID[id].glyph} />;

const TalentAtlas: React.FC<{ own?: boolean; baseRoute?: string }> = ({ own = false, baseRoute = '/talent-tree/atlas' }) => {
  const [build, setBuild] = useState<AtlasBuild>(own ? EMPTY_BUILD : RYAN_ATLAS);
  const [answered, setAnswered] = useState<Answered>(own ? NOTHING_ANSWERED : ALL_ANSWERED);
  const [abilityId, setAbilityId] = useState('guardrail-architect');
  const [skillId, setSkillId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [lane, setLane] = useState<TreeId>('design');
  const [proficienciesOpen, setProficienciesOpen] = useState(false);
  const [showAllProficiencies, setShowAllProficiencies] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [copied, setCopied] = useState(false);
  const [dirty, setDirty] = useState(false);
  const inspectorRef = useRef<HTMLElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const live = !own || intakeComplete(answered);
  const pools = atlasPools(own ? effectiveIntake(build.intake, answered) : build.intake, build.craftCredit);
  const states = useMemo(() => evaluateAtlas(build.allocation, new Set(build.discovered)), [build.allocation, build.discovered]);
  const selected = states.find(s => s.ability.id === abilityId)!;
  const known = selected.visibility === 'discovered';
  const mastery = useMemo(() => resolveMastery(states), [states]);
  const spentByTree = atlasSpent(build.allocation);
  const spent = Object.values(spentByTree).reduce((sum, n) => sum + n, 0);
  const earned = rankProficiencies(states.filter(s => s.rank > 0));
  const collection = showAllProficiencies ? [...earned, ...states.filter(s => s.rank === 0)] : earned.slice(0, 6);
  const recipe = known ? selected.ability.ingredients : [];
  const visibleSkills = new Set(recipe.flatMap(id => [id, ATLAS_SKILL_BY_ID[id].prerequisite?.skillId || id]));
  const ryanMastery = useMemo(() => resolveMastery(evaluateAtlas(RYAN_ATLAS.allocation)), []);

  useEffect(() => {
    if (!own) return;
    const raw = new URLSearchParams(window.location.hash.slice(1)).get('s');
    if (!raw) return;
    const shared = decodeAtlas(raw);
    if (shared) { setBuild(shared); setAnswered(ALL_ANSWERED); }
    else setAnnouncement('This shared build could not be read. Start a new one below.');
  }, [own]);
  useEffect(() => {
    if (!own || !dirty) return;
    const url = new URL(window.location.href);
    url.hash = new URLSearchParams({ s: encodeAtlas(build) }).toString();
    window.history.replaceState(null, '', url.toString());
  }, [build, dirty, own]);

  const changePoint = (id: string, delta: 1 | -1) => {
    if (!own || !live) return;
    const allocation = changeAtlasPoint(build.allocation, id, delta, pools);
    if (allocation === build.allocation) return;
    const after = evaluateAtlas(allocation, new Set(build.discovered));
    const changed = after.filter((s, i) => s.rank > states[i].rank);
    const nextClass = resolveMastery(after);
    setBuild({ ...build, allocation }); setDirty(true); setCopied(false);
    setAnnouncement(`${ATLAS_SKILL_BY_ID[id].name}: ${atlasPoints(allocation, id)} of 5. ${changed.map(s => `${proficiencyName(s)}: ${s.rankLabel}.`).join(' ')}${nextClass.title !== mastery.title ? ` Class: ${nextClass.title}.` : ''}`);
  };
  const changeIntake = (patch: Partial<Intake>, answer?: IntakeQuestion) => {
    const intake = { ...build.intake, ...patch };
    if (intake.minor === intake.major) intake.minor = 'none';
    const nextAnswered = answer ? { ...answered, [answer]: true } : answered;
    setBuild({ ...build, intake, allocation: clampAtlas(build.allocation, atlasPools(effectiveIntake(intake, nextAnswered), build.craftCredit)) });
    setAnswered(nextAnswered); setDirty(true); setCopied(false);
  };
  const inspect = (id: string) => {
    setAbilityId(id); setSkillId(null); setShowAll(false);
    const state = states.find(s => s.ability.id === id)!;
    if (state.visibility === 'discovered') setLane(ATLAS_SKILL_BY_ID[state.ability.ingredients[0]].territory);
    inspectorRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    inspectorRef.current?.focus({ preventScroll: true });
  };
  const shareUrl = () => { const url = new URL(`${baseRoute}/build/`, window.location.origin); url.hash = new URLSearchParams({ s: encodeAtlas(build) }).toString(); return url.toString(); };
  const copyLink = async () => { try { await navigator.clipboard.writeText(shareUrl()); setCopied(true); } catch { setAnnouncement('Copy was unavailable. Copy your build from the page address.'); } };
  const exportCard = async () => {
    try {
      const { exportForgeCard } = await import('./forgeCard');
      await exportForgeCard(build, mastery, earned, crestRef.current?.querySelector('svg')?.outerHTML || '', shareUrl());
      setAnnouncement('Your build card has been downloaded.');
    } catch { setAnnouncement('The card could not be downloaded. Your build link is still available.'); }
  };
  const reset = () => { setBuild(EMPTY_BUILD); setAnswered(NOTHING_ANSWERED); setDirty(false); setCopied(false); setShowAll(true); setSkillId(null); setShowAllProficiencies(false); setProficienciesOpen(false); const url = new URL(window.location.href); url.hash = ''; window.history.replaceState(null, '', url.toString()); setAnnouncement('Build reset. Your class is Initiate Maker.'); };

  return <main className="atlas forge" id="main-content">
    <header className="forge-heading"><div><p className="atlas-eyebrow">The Forge</p><h1>More than a job title.</h1><p>Allocate points to the talents you use. They unlock proficiencies that determine your class.</p></div><Link className="forge-link" to={own ? `${baseRoute}/` : `${baseRoute}/build/`}>{own ? 'Explore Ryan’s build' : 'Forge your own build'} <span aria-hidden="true">↗</span></Link></header>
    {own && <div className="atlas-intake tt-console"><TalentIntakeStrip headingLevel="h2" annualRate={FORGE_POINTS_PER_YEAR} intake={build.intake} answered={answered} total={pools.total} level={pools.level} onChange={changeIntake} /></div>}
    <section className="forge-declaration" aria-label="Your classification">
      <div className="forge-declaration__main"><div ref={crestRef}><ClassificationEmblem domain={mastery.primary?.id} level={mastery.primary?.level || 1}/></div><div><p className="atlas-eyebrow">{own ? build.intake.name || 'Your build' : 'Ryan’s build'} · classification</p><h2>{mastery.title}</h2><p className="forge-domain">{mastery.primary ? `Mastery of ${mastery.primary.name.toLowerCase()}` : 'A practice waiting to take shape'}</p><p>{mastery.primary?.description || 'Start with the talents you use. Your first proficiencies will reveal where your strengths connect.'}</p><div className="forge-class-ranks" aria-label={`Class level ${mastery.primary?.level || 1} of 5`}>{CLASS_LEVELS.map((label, i) => <span key={label} className={i < (mastery.primary?.level || 1) ? 'is-earned' : ''} title={label}/>)}</div></div></div>
      <dl className="forge-totals"><div><dt>Points invested</dt><dd>{spent}<small> / {pools.total}</small></dd></div><div><dt>Proficiencies active</dt><dd>{earned.length}<small> / {states.length}</small></dd></div><div><dt>Talents mastered</dt><dd>{ATLAS_SKILLS.filter(s => atlasPoints(build.allocation, s.id) === 5).length}<small> / {ATLAS_SKILLS.length}</small></dd></div></dl>

    </section>
    <section className="forge-support" aria-label="Build proficiencies">
      <button className="forge-support__toggle" aria-expanded={proficienciesOpen} aria-controls="forge-proficiency-panel" onClick={() => setProficienciesOpen(!proficienciesOpen)}><span>Your proficiencies<small>{earned.length} active · Supporting your classification</small></span><span aria-hidden="true">{proficienciesOpen ? '−' : '+'}</span></button>
      <div id="forge-proficiency-panel" hidden={!proficienciesOpen}>{proficienciesOpen && <>
      <div className="forge-passives"><p className="atlas-eyebrow">Proficiencies shaping your class</p>{mastery.primary ? <div>{mastery.primary.facets.map(facet => <div key={facet.name}><span>{facet.name}</span>{facet.strongest ? <button onClick={() => inspect(facet.strongest!.ability.id)}><ForgeMark id={facet.strongest.ability.id} size={20}/>{proficiencyName(facet.strongest)}<small>{facet.rank}/5</small></button> : <p>Still developing</p>}</div>)}</div> : <p>Passives unlock when every talent in their recipe has at least one point.</p>}</div>
    <section className="forge-collection" aria-label="Proficiency collection"><div className="forge-section-heading"><div><h2>{showAllProficiencies ? 'All your proficiencies' : 'Your top proficiencies'}</h2><p>{showAllProficiencies ? `${earned.length} active · ${states.length - earned.length} still to unlock` : 'Your strongest passives, ranked by level, then recipe progress.'}</p></div><button className="forge-secondary" onClick={() => setShowAllProficiencies(!showAllProficiencies)}>{showAllProficiencies ? 'Show top proficiencies' : `Show all ${states.length} proficiencies`}</button></div><div className="forge-collection__grid">{collection.map((s, i) => <button key={s.ability.id} aria-pressed={s.ability.id === abilityId} aria-label={s.visibility === 'discovered' ? `${proficiencyName(s)}. ${s.rankLabel}.` : `Undiscovered proficiency ${i + 1}. ${s.activeConnections} connections detected.`} className={s.visibility !== 'discovered' ? 'is-unknown' : ''} onClick={() => inspect(s.ability.id)}><span className="forge-medallion">{s.visibility === 'discovered' ? <ForgeMark id={s.ability.id}/> : '?'}</span><strong>{s.visibility === 'discovered' ? proficiencyName(s) : '???'}</strong><small>{s.visibility === 'discovered' ? `${s.rankLabel} · ${s.rank}/5` : s.visibility === 'resonating' ? 'Resonating' : 'Undiscovered'}</small></button>)}</div>{!showAllProficiencies && !earned.length && <p>No active proficiencies yet. Invest in talents to discover your first connection.</p>}</section>
    <section className="forge-inspector" ref={inspectorRef} tabIndex={-1} aria-label="Proficiency details">
      <div className="forge-inspector__heading"><span className="forge-medallion">{known ? <ForgeMark id={abilityId} size={28}/> : '?'}</span><div><p className="atlas-eyebrow">Passive proficiency · {known ? selected.rankLabel : 'Undiscovered'}</p><h3>{known ? proficiencyName(selected) : 'An undiscovered connection'}</h3><p>{known ? selected.ability.description : selected.visibility === 'resonating' ? selected.ability.hint : 'Explore your talents to discover the capabilities they unlock together.'}</p></div>{known && <strong className="forge-proficiency-rank">{selected.rank}<span>/ 5</span></strong>}</div>
      {known ? <><div className="forge-recipe-heading"><span className="atlas-eyebrow">Talent recipe</span><span>{selected.activeConnections}/{recipe.length} ingredients active</span></div><div className="forge-ingredients">{selected.requirements.map(req => <button key={req.skillId} className={`atlas-territory--${ATLAS_SKILL_BY_ID[req.skillId].territory}`} onClick={() => { setSkillId(req.skillId); setLane(ATLAS_SKILL_BY_ID[req.skillId].territory); }}><span className="forge-orb"><RankRing points={req.points}/><SkillMark id={req.skillId}/></span><span><strong>{ATLAS_SKILL_BY_ID[req.skillId].name}</strong><small>{req.points}/5</small></span></button>)}</div><p className="forge-next"><strong>{selected.nextRank ? `Next: ${ATLAS_RANK_LABELS[selected.nextRank]}` : 'Master proficiency'}</strong> {selected.nextRank ? selected.requirements.filter(r => r.nextRankMissing > 0).map(r => `${ATLAS_SKILL_BY_ID[r.skillId].name} +${r.nextRankMissing}`).join(' · ') : 'Every ingredient is fully invested.'}</p></> : <p className="forge-next">{selected.activeConnections} connections detected. The name and recipe appear once every ingredient is active.</p>}
    </section>
      </>}</div>
    </section>
    <div className="forge-workbench-controls"><p>{own ? `${pools.total - spent} points available${!live ? ' · Complete your experience above to invest' : ''}` : showAll ? 'Your talent allocation' : `Talents behind ${known ? proficiencyName(selected) : 'this proficiency'}`}</p><button aria-pressed={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? 'Focus recipe' : `Show all ${ATLAS_SKILLS.length} talents`}</button></div>
    <div className="forge-tree-switch" aria-label="Choose talent tree">{TREES.map(tree => <button key={tree.id} className={`atlas-territory--${tree.id}`} aria-pressed={lane === tree.id} onClick={() => setLane(tree.id)}>{tree.name}<small>{recipe.filter(id => ATLAS_SKILL_BY_ID[id].territory === tree.id).length} ingredients</small></button>)}</div>
    <div className="forge-lanes">{TREES.map(tree => {
      const talents = ATLAS_SKILLS.filter(s => s.territory === tree.id && (showAll || !known || visibleSkills.has(s.id)));
      const contributes = recipe.some(id => ATLAS_SKILL_BY_ID[id].territory === tree.id);
      return <section key={tree.id} className={`forge-lane atlas-territory--${tree.id}${lane === tree.id ? ' is-current' : ''}${contributes ? ' has-recipe' : ''}`} aria-label={`${tree.name} talents`}><header><span className="forge-tree-mark"><ForgeMark id={tree.mark}/></span><h3>{tree.name}</h3><p>{tree.line}</p><small>{spentByTree[tree.id]} points invested</small></header><div className="forge-talent-list">{talents.map(skill => {
        const points = atlasPoints(build.allocation, skill.id);
        const locked = skill.prerequisite && atlasPoints(build.allocation, skill.prerequisite.skillId) < skill.prerequisite.points;
        return <div key={skill.id} className={`forge-talent${recipe.includes(skill.id) ? ' is-ingredient' : ''}${points === 5 ? ' is-mastered' : ''}${skillId === skill.id ? ' is-selected' : ''}`}><button className="forge-talent__select" aria-pressed={skillId === skill.id} aria-label={`${skill.name}. ${points} of 5 talent points invested.${locked ? ` Locked: requires ${ATLAS_SKILL_BY_ID[skill.prerequisite!.skillId].name} at ${skill.prerequisite!.points}.` : ''}`} onClick={() => setSkillId(skillId === skill.id ? null : skill.id)}><span className="forge-orb"><RankRing points={points}/><SkillMark id={skill.id}/></span><span><strong>{skill.name}</strong><small>{points}/5 {locked ? '· Locked' : points === 5 ? '· Mastered' : recipe.includes(skill.id) ? '· Recipe ingredient' : !showAll && known ? '· Prerequisite' : '· Talent'}</small></span></button>{skillId === skill.id && <div className="forge-talent__details"><p>{skill.meaning}</p>{skill.prerequisite && <p>Requires {ATLAS_SKILL_BY_ID[skill.prerequisite.skillId].name} at {skill.prerequisite.points}/5.</p>}{own && <div className="forge-spend"><button aria-label={`Remove a point from ${skill.name}`} disabled={!live || changeAtlasPoint(build.allocation, skill.id, -1, pools) === build.allocation} onClick={() => changePoint(skill.id, -1)}>−</button><span>{points}/5</span><button aria-label={`Add a point to ${skill.name}`} disabled={!live || changeAtlasPoint(build.allocation, skill.id, 1, pools) === build.allocation} onClick={() => changePoint(skill.id, 1)}>+</button></div>}</div>}</div>;
      })}{!talents.length && <p className="forge-empty-lane">This recipe doesn’t use {tree.name} talents.<button onClick={() => setShowAll(true)}>Explore this tree</button></p>}</div></section>;
    })}</div>
    <p className="forge-announcement" role="status" aria-live="polite">{announcement}</p>
    <details className="forge-rules"><summary>How your class takes shape</summary><p>Your talents unlock passive proficiencies. These shape six mastery domains: Form, Meaning, Behavior, Structure, Realization, and Stewardship. Your strongest domain determines your class. Browsing never changes it.</p><p>Each domain has three facets. Only the strongest active proficiency in each facet counts, up to five points each. Total strength decides your class; broader coverage breaks ties, followed by the fixed domain order shown below.</p><p>Class ranks follow average facet strength, with Initiate for a single facet, at most Apprentice for two, and Expert until all three reach five for Master. These are build ranks, not professional certifications. A proficiency’s own rank follows its weakest ingredient.</p><div className="forge-domain-list">{mastery.domains.map(domain => <div key={domain.id}><ForgeMark id={domain.id}/><strong>{domain.name}</strong><span>{domain.strength}/15</span><p>{domain.facets.map(f => `${f.name}: ${f.rank}/5`).join(' · ')}</p></div>)}</div></details>
    <details className="forge-rules"><summary>Your point receipt</summary><p>Professional experience earns {FORGE_POINTS_PER_YEAR} points per year, plus education and recent practice. Each talent accepts up to five points. Prerequisites unlock at 2/5; Automation is independent. Removing a prerequisite also removes investments that depend on it.</p><ul>{pools.receipt.map((line, i) => <li key={i}>{line.label}</li>)}</ul><p>{spent} of {pools.total} points invested. Some education points are reserved for their corresponding tree.</p></details>
    {own && <details className="forge-rules"><summary>Compare with Ryan’s build</summary><p>Your build: {mastery.title}. Ryan’s build: {ryanMastery.title}. Different strengths, no overall winner.</p><table><thead><tr><th>Mastery domain</th><th>You</th><th>Ryan</th></tr></thead><tbody>{mastery.domains.map((domain, i) => <tr key={domain.id}><th scope="row">{domain.name}</th><td>{domain.strength}/15</td><td>{ryanMastery.domains[i].strength}/15</td></tr>)}</tbody></table></details>}
    <div className="forge-share">{own && <label>Your name<input maxLength={60} value={build.intake.name} onChange={e => changeIntake({ name: e.target.value })}/></label>}<button className="atlas-cta" disabled={!live} onClick={copyLink}>{copied ? 'Link copied' : 'Copy build link'}</button><button className="forge-secondary" disabled={!live} onClick={exportCard}>Export build card</button>{!own && <Link className="forge-link" to={`${baseRoute}/build/#${new URLSearchParams({ s: encodeAtlas(build) })}`}>Adjust this build ↗</Link>}{own && <button className="forge-link" onClick={reset}>Reset build</button>}</div>
    {!own && <div className="forge-invitation"><h2>Where would you put your points?</h2><p>Start with your experience, then spend your points across design, technical practice, and code.</p><Link className="atlas-cta" to={`${baseRoute}/build/`}>Forge your own build ↗</Link></div>}
  </main>;
};
export default TalentAtlas;
