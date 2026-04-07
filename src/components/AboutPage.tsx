import React, { useState, useRef, useEffect, useCallback } from 'react';
import Footer from './Footer';
import { getHomeHref } from '../utils/homeSession';
import '../styles/styles.scss';

interface Topic {
  id: string;
  label: string;
  title: string;
  content: React.ReactNode;
}

const topics: Topic[] = [
  {
    id: 'history',
    label: 'My path into design',
    title: 'My path into design',
    content: (
      <>
        <p>I'm a Front-End Developer and UX Engineer with 16+ years of professional experience&mdash;and a design obsession that started well before that. I built my foundation intentionally: I focused every high school elective on visual communication, interned at a local broadcast station, took early college courses while still in high school, and entered <strong>Kendall College of Art and Design's</strong> advanced track, where I majored in Graphic Design and minored in Web Animation.</p>
        <p>Summers in college meant real client work&mdash;Notre Dame, the South Bend Tribune, a fitness startup&mdash;before moving into digital product work full-time. That path led to 10+ years at <strong>Tire Rack</strong>, where my role grew well beyond design into UX strategy, design systems, A/B testing, and hands-on front-end development.</p>
        <p>I came in fresh out of college into a design role that leaned on my strengths but quickly exposed the gaps. Conversations around HTML tables, CSS variables, and flexbox felt like a different language. I wasn't at the level of the people around me yet. So I closed that gap the only way I knew how&mdash;<strong>by putting in the reps</strong>. Conferences, certifications, side projects, asking questions, and constantly refining.</p>
        <p>That process built something most designers don't have: the instinct to recognize when something is off, and the technical depth to actually fix it. I became the lead on our team for building and maintaining AEM component templates and their styles&mdash;owning the pattern documentation that let the rest of the team ship consistently.</p>
      </>
    ),
  },
  {
    id: 'personal',
    label: 'Outside of work',
    title: 'Who I am outside of work',
    content: (
      <>
        <p>Outside of work, I'm pretty intentional about how I spend my time&mdash;and who I spend it with. Every Wednesday night is Survivor night: my mom, my best friend from childhood, and I run our own fantasy draft every season, and the winner gets a tiki idol that stays in their possession until the next one.</p>
        <p>Sundays are family dinners at my aunt's house&mdash;a tradition that's stayed intact through everything. My wife, kids, cousins, aunts, and uncles all get together, eat, and usually end up deep into games like Catan, 7 Wonders, or Sequence.</p>
        <p>That consistency matters to me. It's the same mindset I bring into my work&mdash;show up, invest in the people around you, and build something that lasts.</p>
        <p>I've also been running the same dynasty fantasy football league for over a decade, which has turned into something bigger than just a hobby. It's a long-term system&mdash;tracking trends, analyzing data, making calculated bets, and constantly refining strategy over time. What I enjoy most isn't just the competition, it's the process behind it: understanding patterns, adjusting based on outcomes, and building something that holds up season after season. That mindset&mdash;thinking long-term, iterating, and learning from what works and what doesn't&mdash;shows up in how I approach my work just as much as it does on Sundays.</p>
      </>
    ),
  },
  {
    id: 'ai',
    label: 'AI in my workflow',
    title: 'How AI is changing how I work',
    content: (
      <>
        <p>I was an early adopter of AI-augmented design and development workflows. Right now that means getting the most out of tools like <strong>Claude</strong>, <strong>Figma Make</strong>, and AI-assisted code generation&mdash;not as a replacement for skill, but as a multiplier for speed and consistency.</p>
        <p>The real value isn't in prompting. It's in <strong>knowing how to build the guardrails before you start</strong>, reviewing what comes out, and refining it against brand standards, accessibility guidelines, and the actual framework your site runs on. Most designers can't do that. I can&mdash;because I understand both sides of the handoff.</p>
        <p>AI hasn't changed what I value in design&mdash;clarity, craft, and systems thinking. But it has changed how fast I can explore ideas, validate assumptions, and move from concept to production-ready code. The designers who will thrive aren't the ones who resist the tooling. They're the ones who know enough about the fundamentals to direct it.</p>
      </>
    ),
  },
  {
    id: 'future',
    label: 'What I want to build',
    title: 'What I want to build',
    content: (
      <>
        <p>I want to work on products in spaces I actually care about&mdash;<strong>health, wellness, self-care, financial literacy</strong>, and anything tied to helping people improve their lives. Those aren't just market categories to me. They're areas I'm already invested in for myself and for my kids.</p>
        <p>More than a specific app, I want to build purposeful solutions with the tools that are changing the industry. If I leave a 12-year career at Tire Rack, it'll be to do work that feels more aligned with my values and gives me the chance to go deeper into design systems, product thinking, and AI. I think that intersection is where I'll do the best work of my career.</p>
      </>
    ),
  },
  {
    id: 'environment',
    label: 'My ideal work environment',
    title: 'My ideal work environment',
    content: (
      <>
        <p>Between in person, hybrid, and remote&mdash;I'll be direct: <strong>remote work has been a dream come true</strong>.  I'm a team-first designer and I put real effort into building alignment, camaraderie, and systems that keep teams working effectively. But there's no more important team to me than my family.</p>
        <p>Getting to spend an extra hour or two each day with my kids—seeing them during breaks, eating lunch together, getting them ready for daycare—that's not a convenience, <strong>it's a core value.</strong></p>
        <p>I keep work and home life separate, and I will always show up professionally, but family comes first. <strong>I want my next employer to share that sentiment.</strong></p>
        <p>I treat my career the way an athlete treats performance&mdash;<strong>deliberately</strong>. That means ongoing learning, refining how I communicate, and staying curious about what's next. The same intensity I bring to a design system, I bring to everything else. I want to be somewhere that rewards that kind of investment&mdash;where showing up with intention isn't the exception, it's the baseline.</p>
      </>
    ),
  },
  {
    id: 'values',
    label: 'What I value',
    title: 'What I value most',
    content: (
      <>
        <p>I value <strong>craft, clarity, and ownership</strong>&mdash;in that order. Craft means the work holds up under scrutiny. Clarity means the team can extend it without me in the room. Ownership means I don't wait to be told what needs doing.</p>
        <p>I value feedback the same way. I learned early that the best designers are the ones who <strong>seek critique, not avoid it</strong>. If something isn't working, I want to know&mdash;and I want to know why, so I can fix the root cause and not just the symptom. I give feedback the same way: honest, specific, and framed around the goal&mdash;never personal.</p>
        <p>I value teams that move with intention. High standards and real collaboration&mdash;not process for the sake of process, but an environment where thoughtful work can move quickly and actually make it into production. I want to be somewhere the gap between "what we designed" and "what actually shipped" is as small as possible.</p>
        <p>I also value leaders and teammates who care about the people behind the work. The strongest teams I've been part of weren't just talented&mdash;they were aligned, honest, and committed to making each other better.</p>
        <p>And I value family above all of it. Everything I build professionally is in service of the life I'm building at home.</p>
      </>
    ),
  },
  {
    id: 'influences',
    label: 'How I stay sharp',
    title: 'How I stay on top of my game',
    content: (
      <>
        <p>I treat growth the same way I treat design work&mdash;deliberately. I don't wait around for the industry to settle before deciding what matters. I try to stay close to the people who are actually shaping how design, systems, and AI workflows are evolving in real time.</p>
        <p>I've been following <strong>UI Collective Design</strong> pretty closely. Their weekly videos cut through a lot of the noise around AI and have helped me stay grounded in how LLMs actually fit into real design systems and workflows.</p>
        <p>I subscribe to and regularly listen to <strong>Tommy Geoco</strong>, especially his interviews with leading designers and how they work. His breakdowns of product thinking, modern workflows, and how strong designers operate have been a real influence on how I approach systems and iteration.</p>
        <p>I keep up with <strong>Michael Riddering (Rid)</strong> regularly. His perspective on design systems and practical execution has helped shape how I think about scalable UI and the gap between a good idea and a usable system.</p>
        <p><strong>Jenny Wen</strong>'s work has been a key influence in how I think about clarity, structure, and thoughtful interaction design within complex systems.</p>
        <p><strong>Brad Frost</strong>'s writing, talks, and especially <strong>Atomic Design</strong> have been foundational to how I think about resilient systems, reusable patterns, and building things teams can actually use and extend over time.</p>
        <p>For me, staying sharp is part discipline, part curiosity. The tools are changing fast, but the people I keep learning from help me stay focused on what actually matters beneath the hype.</p>
      </>
    ),
  },
];

// ============================================
// Typing sequence strings
// ============================================
const USER_PROMPT = "There's more to me than what fits on the homepage. Pull from the work, the systems, the process, and the personal details\u2014what should someone know if they really want to understand how I think?";
const AI_RESPONSE = "I've scanned case studies, systems, and process notes. What do you want to explore?";

// Typing speeds (ms per character)
const USER_SPEED = 8;    // 1.5x speed
const AI_SPEED = 9;      // 2x speed

// ============================================
// Intro sequence phases
// ============================================
type IntroPhase =
  | 'idle'           // Before panel is in view
  | 'typing-user'    // User message typing in
  | 'pause-1'        // Brief pause before AI responds
  | 'typing-ai'      // AI response typing in
  | 'pause-2'        // Brief pause before chips
  | 'chips'          // Chips populating one by one
  | 'ready';         // Sequence complete, interactive

const AboutPage: React.FC = () => {
  // Intro sequence
  const [introPhase, setIntroPhase] = useState<IntroPhase>('idle');
  const [userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');
  const [visibleChips, setVisibleChips] = useState(0);
  const introStarted = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Topic interaction
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const activeTopic = activeId ? topics.find(t => t.id === activeId) || null : null;
  const exploredCount = exploredIds.size;

  // ===== Start intro when panel scrolls into view =====
  useEffect(() => {
    const el = panelRef.current;
    if (!el || introStarted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !introStarted.current) {
          introStarted.current = true;
          setIntroPhase('typing-user');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ===== User typing =====
  useEffect(() => {
    if (introPhase !== 'typing-user') return;
    if (userText.length === USER_PROMPT.length) {
      const id = setTimeout(() => setIntroPhase('pause-1'), 300);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setUserText(USER_PROMPT.substring(0, userText.length + 1));
    }, USER_SPEED);
    return () => clearTimeout(id);
  }, [introPhase, userText]);

  // ===== Pause before AI =====
  useEffect(() => {
    if (introPhase !== 'pause-1') return;
    const id = setTimeout(() => setIntroPhase('typing-ai'), 600);
    return () => clearTimeout(id);
  }, [introPhase]);

  // ===== AI typing =====
  useEffect(() => {
    if (introPhase !== 'typing-ai') return;
    if (aiText.length === AI_RESPONSE.length) {
      const id = setTimeout(() => setIntroPhase('pause-2'), 400);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setAiText(AI_RESPONSE.substring(0, aiText.length + 1));
    }, AI_SPEED);
    return () => clearTimeout(id);
  }, [introPhase, aiText]);

  // ===== Pause before chips =====
  useEffect(() => {
    if (introPhase !== 'pause-2') return;
    const id = setTimeout(() => setIntroPhase('chips'), 300);
    return () => clearTimeout(id);
  }, [introPhase]);

  // ===== Chips appearing one by one =====
  useEffect(() => {
    if (introPhase !== 'chips') return;
    if (visibleChips >= topics.length) {
      const id = setTimeout(() => setIntroPhase('ready'), 200);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setVisibleChips(v => v + 1);
    }, 100);
    return () => clearTimeout(id);
  }, [introPhase, visibleChips]);

  // ===== Topic interaction =====
  const handleTopicClick = useCallback((id: string) => {
    if (introPhase !== 'ready' || id === activeId || isErasing) return;

    if (activeId === null) {
      // First selection — no erase needed, just show
      setActiveId(id);
      setExploredIds(prev => new Set(prev).add(id));
      setTimeout(() => {
        const el = contentRef.current;
        if (!el) return;
        const navOffset = 100;
        const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    } else {
      setPendingId(id);
      setIsErasing(true);
    }
  }, [introPhase, activeId, isErasing]);

  useEffect(() => {
    if (!isErasing || !pendingId) return;

    const timer = setTimeout(() => {
      setActiveId(pendingId);
      setExploredIds(prev => new Set(prev).add(pendingId));
      setPendingId(null);
      setIsErasing(false);

      setTimeout(() => {
        const el = contentRef.current;
        if (!el) return;
        const navOffset = 100;
        const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 50);
    }, 350);

    return () => clearTimeout(timer);
  }, [isErasing, pendingId]);

  // Session feedback
  const getSessionNote = () => {
    if (exploredCount >= topics.length) {
      return 'You\'ve explored everything. Not many people get this far.';
    }
    if (exploredCount >= 4) {
      return `${exploredCount} of ${topics.length} explored \u2014 keep going, there's more.`;
    }
    if (exploredCount >= 2) {
      return `${exploredCount} of ${topics.length} topics explored`;
    }
    return null;
  };

  const sessionNote = getSessionNote();
  const showUserMsg = introPhase !== 'idle';
  const showAiMsg = introPhase === 'typing-ai' || introPhase === 'pause-2' || introPhase === 'chips' || introPhase === 'ready';
  const isTypingUser = introPhase === 'typing-user';
  const isTypingAi = introPhase === 'typing-ai';

  return (
    <article className="about-page">
      <nav className="about-page__nav">
        <a href={getHomeHref()} className="about-page__nav-logo">Ryan DeBoer</a>
        <a href={getHomeHref()} className="about-page__nav-back">&larr; Back to Home</a>
      </nav>

      {/* Hero */}
      <div className="about-page__hero">
        <div className="about-page__hero-inner">
          <h1 className="about-page__hero-title">Who is Ryan?</h1>
          <p className="about-page__hero-role">Senior Web Designer / UX Engineer</p>
          <p className="about-page__hero-body">
            I'm a designer and developer who leads with family first&mdash;my wife Stephanie, our two kids, and a life outside of work that keeps me grounded. I've always believed the best work comes from people who have something real to come back to.
          </p>
          <p className="about-page__hero-body">
            I approach design grounded in fundamentals, shaped by real-world constraints, and constantly refined through iteration. Over time, that evolved into systems thinking&mdash;understanding not just what to design, but how it holds up in production, scales across teams, and adapts over time.
          </p>
          <p className="about-page__hero-body">
            What excites me most about where things are now is the speed. AI has changed how quickly ideas can be built and tested&mdash;but it hasn't replaced the need for direction. If anything, it's made direction more important. I see it as a multiplier&mdash;a way to explore more, test faster, and refine better&mdash;as long as you know what you're aiming for.
          </p>
          <p className="about-page__hero-body">
            I do my best work where high standards, real collaboration, and thoughtful execution all matter at the same time&mdash;and where the gap between what's designed and what actually ships is as small as possible.
          </p>
        </div>
      </div>

      {/* AI Panel — always present, types in on scroll */}
      <div className="about-page__panel" ref={panelRef}>
        <div className="about-page__panel-container">

          {/* System header */}
          <div className="about-page__system-bar">
            <span className="about-page__system-dot" />
            <span className="about-page__system-label">RYAN AI &middot; Context Loaded</span>
          </div>

          {/* Prompt exchange */}
          <div className="about-page__prompt-exchange">
            {showUserMsg && (
              <div className="about-page__msg about-page__msg--user">
                <div className="about-page__msg-label">You</div>
                <div className="about-page__msg-bubble about-page__msg-bubble--user">
                  <p>
                    {userText}
                    {isTypingUser && <span className="about-page__typing-cursor" />}
                  </p>
                </div>
              </div>
            )}

            {showAiMsg && (
              <div className="about-page__msg about-page__msg--ai">
                <div className="about-page__msg-label">Ryan AI</div>
                <div className="about-page__msg-bubble about-page__msg-bubble--ai">
                  <p>
                    {aiText}
                    {isTypingAi && <span className="about-page__typing-cursor" />}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Topic chips — appear one by one */}
          {visibleChips > 0 && (
            <div className="about-page__chips">
              {topics.slice(0, visibleChips).map((topic) => (
                <button
                  key={topic.id}
                  className={`about-page__chip${topic.id === activeId ? ' about-page__chip--active' : ''}${exploredIds.has(topic.id) && topic.id !== activeId ? ' about-page__chip--explored' : ''}`}
                  onClick={() => handleTopicClick(topic.id)}
                  disabled={introPhase !== 'ready' || isErasing}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          )}

          {/* Session awareness */}
          {sessionNote && (
            <p className="about-page__session-note">{sessionNote}</p>
          )}

          {/* Content display — only after a chip is selected */}
          {activeTopic && (
            <div
              className={`about-page__content-area${isErasing ? ' about-page__content-area--erasing' : ' about-page__content-area--visible'}`}
              ref={contentRef}
            >
              <h2 className="about-page__content-title">{activeTopic.title}</h2>
              <div className="about-page__content-body">
                {activeTopic.content}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </article>
  );
};

export default AboutPage;
