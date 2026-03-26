import React, { useState, useEffect, useRef, useCallback } from 'react';
import SectionBadge from './SectionBadge';

const ProcessIcon = () => (
  <svg viewBox="0 0 1106 1139" fill="currentColor" stroke="none">
    {/* Top-right rounded square */}
    <path d="M1008.71,81.34h-130.16c-53.83,0-97.62,43.79-97.62,97.62v130.16c0,53.83,43.79,97.62,97.62,97.62h130.16c53.83,0,97.61-43.79,97.61-97.62v-130.16c0-53.83-43.78-97.62-97.61-97.62Z" />
    {/* Bottom-left rounded square */}
    <path d="M0,959.9c0,53.83,43.79,97.62,97.62,97.62h130.16c53.83,0,97.62-43.79,97.62-97.62v-130.16c0-53.83-43.79-97.61-97.62-97.61H97.62c-53.83,0-97.62,43.78-97.62,97.61v130.16Z" />
    {/* Top-left cycling arrow */}
    <path d="M48.81,601.97c0,26.95,21.86,48.81,48.81,48.81s48.81-21.86,48.81-48.81v-325.39c0-44.87,36.48-81.35,81.35-81.35h305.18l-14.3,14.3c-19.06,19.06-19.06,49.95,0,69.02,19.06,19.06,49.94,19.06,69.02,0l97.61-97.62c18.72-18.71,19.17-49.86,0-69.02l-97.61-97.62c-19.07-19.06-49.95-19.06-69.02,0-19.07,19.06-19.06,49.95,0,69.02l14.3,14.3H227.77c-98.7,0-178.96,80.27-178.96,178.97v325.38Z" opacity="0.65" />
    {/* Bottom-right cycling arrow */}
    <path d="M1057.42,862.29v-325.39c0-26.95-21.86-48.81-48.81-48.81s-48.81,21.86-48.81,48.81v325.39c0,44.86-36.48,81.35-81.35,81.35h-305.18l14.31-14.31c19.06-19.06,19.06-49.95,0-69.02-19.07-19.07-49.95-19.06-69.03,0l-97.62,97.62c-18.71,18.71-19.16,49.86,0,69.02l97.62,97.62c19.07,19.06,49.94,19.06,69.03,0,19.06-19.07,19.06-49.95,0-69.02l-14.31-14.31h305.18c98.7,0,178.97-80.26,178.97-178.95Z" opacity="0.65" />
  </svg>
);

const steps = [
  {
    label: 'Understand & Align',
    phase: 'Discovery',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    annotations: ['Stakeholder interviews', 'Business goals', 'User research'],
    body: 'I ask the right questions before a single pixel moves. I map business goals to user research, surface the real problem early, and align stakeholders across product, engineering, and brand so everyone\u2019s building the same thing.',
  },
  {
    label: 'Design With Intent',
    phase: 'Design',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
      </svg>
    ),
    annotations: ['Design tokens', 'Component specs', 'Hi-fi prototypes'],
    body: 'Every decision is documented and defensible. From high-fidelity prototypes and annotated UI behavior specs to design tokens and component libraries \u2014 I design so engineers can build confidently and teams can extend the work without me in the room.',
  },
  {
    label: 'Build for the Long Game',
    phase: 'Build',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    annotations: ['SCSS/BEM', 'AEM templates', 'Scalable systems'],
    body: 'With 10+ years of hands-on code experience, I understand how design decisions live in production. I build sustainable components inside complex CMS architectures like AEM — owning the template layer, writing the styles, and documenting patterns so the broader team can ship consistently. I translate brand identity into scalable web systems and deliver work that holds up long after launch.',
  },
  {
    label: 'Validate, Optimize & Drive Results',
    phase: 'Validate',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    annotations: ['A/B testing', 'SEO analysis', 'Conversion tracking'],
    body: 'I design for outcomes, not deliverables. A/B testing, usability reviews, SEO-informed information architecture, and post-launch analysis aren\u2019t afterthoughts \u2014 they\u2019re built into how I work, with every release feeding directly back into the next iteration to protect conversion and drive measurable impact.',
  },
  {
    label: 'Putting in the reps',
    phase: 'Grow',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    annotations: ['AI workflows', 'Certifications', 'Emerging tools'],
    body: 'I treat my craft the way an athlete treats performance \u2014 deliberately. That means ongoing certifications, continuous refinement of soft skills like facilitation and storytelling, and staying ahead of the tools redefining the field. I was an early adopter of AI-augmented workflows and I actively integrate emerging tools to work faster, communicate more clearly, and deliver at a higher level.',
  },
];

const CYCLE_DURATION = 8000;
const CURSOR_TRAVEL_MS = 600;

const HowIWork: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [userClicked, setUserClicked] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorClicking, setCursorClicking] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());
  const sectionRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getNoteCenter = useCallback((index: number) => {
    const note = noteRefs.current[index];
    const board = boardRef.current;
    if (!note || !board) return { x: 0, y: 0 };
    const boardRect = board.getBoundingClientRect();
    const noteRect = note.getBoundingClientRect();
    return {
      x: noteRect.left - boardRect.left + noteRect.width / 2,
      y: noteRect.top - boardRect.top + noteRect.height / 2,
    };
  }, []);

  const handleUserClick = (index: number) => {
    setUserClicked(true);
    setActiveIndex(index);
    setProgress(0);
    startRef.current = Date.now();
  };

  // Observe section visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Set initial cursor position
  useEffect(() => {
    const pos = getNoteCenter(0);
    if (pos.x !== 0) setCursorPos(pos);
  }, [getNoteCenter]);

  // Canvas auto-cycle
  useEffect(() => {
    if (!isInView) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }

    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / CYCLE_DURATION, 1);
      setProgress(pct);

      if (!userClicked) {
        const timeLeft = CYCLE_DURATION - elapsed;
        const nextIndex = (activeIndex + 1) % steps.length;

        if (timeLeft <= CURSOR_TRAVEL_MS + 200 && timeLeft > 200) {
          const target = getNoteCenter(nextIndex);
          if (target.x !== 0) setCursorPos(target);
        }

        if (timeLeft <= 300 && timeLeft > 100) {
          setCursorClicking(true);
        } else {
          setCursorClicking(false);
        }
      }

      if (pct >= 1) {
        setActiveIndex((prev) => (prev + 1) % steps.length);
        setProgress(0);
        startRef.current = Date.now();

        if (!userClicked) {
          const newIndex = (activeIndex + 1) % steps.length;
          const pos = getNoteCenter(newIndex);
          if (pos.x !== 0) setCursorPos(pos);
        }
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, userClicked, isInView, getNoteCenter]);

  return (
    <section id="how-i-work" className="how-i-work" ref={sectionRef}>
      <div className="how-i-work__header">
        <SectionBadge icon={<ProcessIcon />} label="How I Work" />
        <h2 className="how-i-work__title">My Design &amp; Development Process</h2>
        <p className="how-i-work__intro">My process isn't rigid&mdash;it adapts to the problem. But the goal is always the same: align early, design with intent, and ship work that holds up in production.</p>
      </div>

      <div className="how-i-work__container">
        <div className="how-i-work__layout">
          {/* Left — FigJam-style canvas */}
          <div className="how-i-work__canvas">
            <div className="how-i-work__toolbar">
              <span className="how-i-work__toolbar-dot how-i-work__toolbar-dot--red" />
              <span className="how-i-work__toolbar-dot how-i-work__toolbar-dot--yellow" />
              <span className="how-i-work__toolbar-dot how-i-work__toolbar-dot--green" />
              <span className="how-i-work__toolbar-label">process-map.fig</span>
            </div>

            <div className="how-i-work__board" ref={boardRef}>
              <div className="how-i-work__board-dots" />

              {/* SVG connectors */}
              <svg className="how-i-work__connectors how-i-work__connectors--visible" viewBox="0 0 520 400" fill="none" preserveAspectRatio="xMidYMid meet">
                <path d="M145 75 C180 75, 195 45, 230 45"
                  className={`how-i-work__path ${activeIndex > 0 ? 'how-i-work__path--complete' : ''} ${activeIndex === 0 ? 'how-i-work__path--active' : ''}`}
                  strokeDasharray="5 4" />
                <polygon points="228,40 238,45 228,50" className={`how-i-work__arrow-head ${activeIndex > 0 ? 'how-i-work__arrow-head--complete' : ''}`} />

                <path d="M340 70 C370 70, 400 100, 400 135"
                  className={`how-i-work__path ${activeIndex > 1 ? 'how-i-work__path--complete' : ''} ${activeIndex === 1 ? 'how-i-work__path--active' : ''}`}
                  strokeDasharray="5 4" />
                <polygon points="395,133 400,143 405,133" className={`how-i-work__arrow-head ${activeIndex > 1 ? 'how-i-work__arrow-head--complete' : ''}`} />

                <path d="M345 185 C310 195, 260 210, 220 220"
                  className={`how-i-work__path ${activeIndex > 2 ? 'how-i-work__path--complete' : ''} ${activeIndex === 2 ? 'how-i-work__path--active' : ''}`}
                  strokeDasharray="5 4" />
                <polygon points="222,215 212,220 222,225" className={`how-i-work__arrow-head ${activeIndex > 2 ? 'how-i-work__arrow-head--complete' : ''}`} />

                <path d="M155 270 C140 300, 200 340, 280 325"
                  className={`how-i-work__path ${activeIndex > 3 ? 'how-i-work__path--complete' : ''} ${activeIndex === 3 ? 'how-i-work__path--active' : ''}`}
                  strokeDasharray="5 4" />
                <polygon points="278,320 288,325 278,330" className={`how-i-work__arrow-head ${activeIndex > 3 ? 'how-i-work__arrow-head--complete' : ''}`} />

                <path d="M390 310 C440 280, 480 180, 460 100 C445 40, 380 10, 145 40"
                  className="how-i-work__path how-i-work__path--loop" strokeDasharray="4 6" />
                <polygon points="147,35 137,40 147,45" className="how-i-work__arrow-head how-i-work__arrow-head--loop" />
              </svg>

              {/* Sticky notes */}
              {steps.map((step, i) => (
                <div
                  key={step.phase}
                  ref={(el) => { noteRefs.current[i] = el; }}
                  className={`how-i-work__note how-i-work__note--pos-${i + 1} ${i === activeIndex ? 'how-i-work__note--active' : ''} ${i < activeIndex ? 'how-i-work__note--complete' : ''}`}
                  onClick={() => handleUserClick(i)}
                >
                  <div className="how-i-work__note-icon">{step.icon}</div>
                  <span className="how-i-work__note-label">{step.phase}</span>
                  <div className="how-i-work__note-tags">
                    {step.annotations.map((t) => <span key={t}>{t}</span>)}
                  </div>
                  {i === activeIndex && <div className="how-i-work__note-handles" />}
                </div>
              ))}

              {/* Decorative elements */}
              <div className="how-i-work__deco how-i-work__deco--lightbulb">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" /><path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
                </svg>
              </div>
              <div className="how-i-work__deco how-i-work__deco--star">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                </svg>
              </div>
              <div className="how-i-work__deco how-i-work__deco--grid">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8">
                  {[0,8,16,24].map(x => [0,8,16,24].map(y => (
                    <rect key={`${x}-${y}`} x={x+1} y={y+1} width="6" height="6" rx="1" />
                  )))}
                </svg>
              </div>
              <div className="how-i-work__deco how-i-work__deco--user">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {/* Animated cursor — hidden when user takes over */}
              {!userClicked && (
                <div
                  className={`how-i-work__cursor ${cursorClicking ? 'how-i-work__cursor--clicking' : ''}`}
                  style={{
                    transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
                  }}
                >
                  <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                    <path d="M1 1L1 13L4.5 9.5L8 17L10.5 15.8L7 8.5L12 7.5L1 1Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
                  </svg>
                  <span className="how-i-work__cursor-name">Ryan D.</span>
                  {cursorClicking && <span className="how-i-work__cursor-ripple" />}
                </div>
              )}

            </div>
          </div>

          {/* Right — tabbed steps */}
          <div className="how-i-work__steps">
            {steps.map((step, i) => (
              <button
                key={step.label}
                className={`how-i-work__step ${i === activeIndex ? 'how-i-work__step--active' : ''}`}
                onClick={() => handleUserClick(i)}
              >
                <div className="how-i-work__step-indicator">
                  <div
                    className="how-i-work__step-progress"
                    style={{ height: i === activeIndex ? `${progress * 100}%` : i < activeIndex ? '100%' : '0%' }}
                  />
                </div>
                <div className="how-i-work__step-content">
                  <h3 className="how-i-work__step-label">{step.label}</h3>
                  <div className={`how-i-work__step-body ${i === activeIndex ? 'how-i-work__step-body--visible' : ''}`}>
                    <span>{steps[i].body}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
