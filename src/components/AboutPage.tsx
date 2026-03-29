import React, { useState, useRef, useEffect, useCallback } from 'react';
import Footer from './Footer';
import { getHomeHref } from '../utils/homeSession';
import '../styles/styles.scss';

// ============================================
// Q&A data — answers support JSX
// ============================================
interface QAItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

const qaItems: QAItem[] = [
  {
    id: 1,
    question: "What's your background in design and development?",
    answer: (
      <>
        <p>I'm a Front-End Developer and UX Engineer with 16+ years of professional experience — and a design obsession that started well before that. I built my foundation intentionally: focused every high school elective on visual communication, interned at a local broadcast station, took early college courses while still in high school, and entered <strong>Kendall College of Art and Design's</strong> advanced track, where I majored in Graphic Design and minored in Web Animation.</p>
        <p>Summers in college meant real client work — Notre Dame, the South Bend Tribune, a fitness startup — before moving into product design full-time. That path led to 10+ years at <strong>Tire Rack</strong>, where my role grew well beyond design into UX strategy, design systems, A/B testing, and hands-on front-end development. I became the lead on our team for building and maintaining AEM component templates and their styles — owning the pattern documentation that let the rest of the team ship consistently.</p>
      </>
    ),
  },
  {
    id: 2,
    question: "How are you working with AI — and why are you more prepared for it than most?",
    answer: (
      <>
        <p>I was an early adopter of AI-augmented design and development workflows. Right now that means getting the most out of tools like <strong>Claude</strong>, <strong>Figma Make</strong>, and AI-assisted code generation — not as a replacement for skill, but as a multiplier for speed and consistency.</p>
        <p>The real value isn't in prompting. It's in <strong>knowing how to build the guardrails before you start</strong>, review what comes out, and refine it against brand standards, accessibility guidelines, and the actual framework your site runs on. Most designers can't do that. I can — because I understand both sides of the handoff.</p>
      </>
    ),
  },
  {
    id: 3,
    question: "What actually sets you apart as a hire?",
    answer: (
      <>
        <p>I came in fresh out of college into a design role that leaned on my strengths but quickly exposed the gaps. Conversations around HTML tables, CSS variables, and flexbox felt like a different language. I wasn't at the level of the people around me yet.</p>
        <p>So I closed that gap the only way I knew how — <strong>by putting in the reps</strong>. Conferences, certifications, side projects, asking questions (and then asking more), and constantly refining. That process built something most designers don't have: the instinct to recognize when something is off, and the technical depth to actually fix it.</p>
        <p>I'm as comfortable in the codebase as I am in the design file. I build design systems from the ground up, ship production-quality SCSS/BEM, and work directly with React developers to deliver scalable, token-based component libraries. At Tire Rack, I took the lead on building and maintaining our entire AEM template architecture — writing the component styles, defining the patterns, and documenting everything so the team could extend the system without me in the room.</p>
      </>
    ),
  },
  {
    id: 4,
    question: "How do you work — process, communication, remote vs. in-person?",
    answer: (
      <>
        <p>I'm methodical but not rigid. Every project starts with <strong>understanding the real problem</strong> — stakeholder interviews, business goals, user research — before a single pixel moves. I document decisions so engineers can build confidently and teams can extend the work without me in the room.</p>
        <p>Communication-wise, I default to transparency. I'd rather surface a risk early than deliver a surprise late. I thrive in cross-functional teams where design, engineering, and product are in the same conversation — whether that's in-person or async over Figma comments and Slack threads.</p>
        <p>On the remote question — I'll be direct: <strong>remote work has been a dream come true</strong>. I'm a team-first designer and I will put in everything to build unity, camaraderie, and the tools to keep a team aligned strategically and systematically. But there is no more important team to me than my family. Getting to spend an extra hour or two a day with my newborn and two-year-old — seeing them during water cooler breaks, eating lunch together, getting them up for daycare — that's a core value, not a convenience. I keep work and home life separate and I will always show up and show up professionally, but family comes first. I want my next employer to share that sentiment.</p>
      </>
    ),
  },
  {
    id: 5,
    question: "Who are you outside of design?",
    answer: (
      <>
        <p>I'm a dad, a husband, and someone who takes his craft seriously without taking himself too seriously. When I'm not designing or writing code, I'm probably working on a side project, watching game film on design trends, or coaching my kids' sports teams.</p>
        <p>I treat my career the way an athlete treats performance — <strong>deliberately</strong>. That means ongoing learning, refining how I communicate, and staying curious about what's next. The same intensity I bring to a design system, I bring to everything else.</p>
      </>
    ),
  },
  {
    id: 6,
    question: "What's the project you're most proud of and why?",
    answer: (
      <>
        <p>The <strong>Tire Rack design system</strong>. Not because it was the flashiest — but because it was the hardest. I built it from the ground up inside a complex AEM architecture serving millions of users, earned buy-in from engineering leads who were skeptical at first, and shipped a scalable token-based system with Figma Token Studio that's still in production.</p>
        <p>It proved that a designer who understands code can close the gap between "what we designed" and "what actually shipped" — and that's the kind of impact I want to keep having.</p>
      </>
    ),
  },
  {
    id: 7,
    question: "What does your ideal team or role look like?",
    answer: (
      <>
        <p>I do my best work on teams that value <strong>craft, clarity, and ownership</strong>. I want to be in the room where decisions are made — not just handed a ticket. I'm looking for a role where I can bridge design and engineering, contribute to systems-level thinking, and help a team ship work that actually holds up in production.</p>
        <p>Ideally, that's a senior or lead IC role on a product team that's building something real — not just shipping pixels, but solving problems that matter to the business and the user.</p>
      </>
    ),
  },
  {
    id: 8,
    question: "How do you handle feedback and critique?",
    answer: (
      <>
        <p>Directly. I learned early that the best designers are the ones who <strong>seek critique, not avoid it</strong>. If something isn't working, I want to know — and I want to know why, so I can fix the root cause and not just the symptom.</p>
        <p>I also give feedback the same way: honest, specific, and framed around the goal — never personal. Good critique makes the work better. I actively build that culture on every team I join.</p>
      </>
    ),
  },
];

// ============================================
// Types for conversation entries
// ============================================
type HistoryEntry =
  | { type: 'user'; content: React.ReactNode }
  | { type: 'ai'; content: React.ReactNode }
  | { type: 'options'; excludeIds: number[] }; // Renumbered remaining questions

// ============================================
// Component
// ============================================
const AboutPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [exploredIds, setExploredIds] = useState<Set<number>>(new Set());
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  // Tracks whether we're waiting for "1 = yes" vs a question number
  const [awaitingMoreConfirm, setAwaitingMoreConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRowRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);

  // Scroll input into view + focus after each update (skip initial mount)
  useEffect(() => {
    if (!isStreaming && hasInteracted.current) {
      setTimeout(() => {
        inputRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [history, isStreaming]);

  // Get remaining questions (not yet explored)
  const getRemainingQuestions = useCallback((excluded: Set<number>) => {
    return qaItems.filter(q => !excluded.has(q.id));
  }, []);

  const handleSubmit = useCallback((value: string) => {
    hasInteracted.current = true;
    const trimmed = value.trim().toLowerCase();
    if (isStreaming) return;

    // Reset
    if (trimmed === 'r') {
      setHistory([]);
      setExploredIds(new Set());
      setAwaitingMoreConfirm(false);
      setInputValue('');
      return;
    }

    // STATE: Waiting for Enter to show more questions
    if (awaitingMoreConfirm) {
      const remaining = getRemainingQuestions(exploredIds);
      if (remaining.length === 0) {
        setHistory(prev => [
          ...prev,
          { type: 'ai', content: <p>You've explored everything I've got! Type <strong>R</strong> to start over, or head back to the <a href={getHomeHref()}>homepage</a>.</p> },
        ]);
      } else {
        setHistory(prev => [
          ...prev,
          { type: 'options', excludeIds: Array.from(exploredIds) },
        ]);
      }
      setAwaitingMoreConfirm(false);
      setInputValue('');
      return;
    }

    if (!trimmed) return;

    const num = parseInt(trimmed, 10);

    // STATE: Picking from the initial or re-shown question list
    // Map the displayed number to the actual QA item
    const remaining = getRemainingQuestions(exploredIds);
    if (num >= 1 && num <= remaining.length) {
      const qa = remaining[num - 1];
      const newExplored = new Set(exploredIds);
      newExplored.add(qa.id);
      setExploredIds(newExplored);
      setIsStreaming(true);

      setHistory(prev => [
        ...prev,
        { type: 'user', content: <>{num}. {qa.question}</> },
      ]);
      setInputValue('');

      setTimeout(() => {
        const moreRemaining = getRemainingQuestions(newExplored);
        const newEntries: HistoryEntry[] = [
          { type: 'ai', content: qa.answer },
        ];

        if (moreRemaining.length === 0) {
          newEntries.push({
            type: 'ai',
            content: <p>That's everything I've got. You've explored all 8 topics! Type <strong>R</strong> to start over, or head back to the <a href={getHomeHref()}>homepage</a>.</p>,
          });
        }

        setHistory(prev => [...prev, ...newEntries]);
        const hasMore = moreRemaining.length > 0;
        setAwaitingMoreConfirm(hasMore);
        if (hasMore) {
          setInputValue('');
        }
        setIsStreaming(false);
      }, 500);

      return;
    }

    // Invalid number
    setHistory(prev => [
      ...prev,
      { type: 'user', content: trimmed },
      { type: 'ai', content: <p>Hmm, that's not on the list. Try a number from the options above, or type <strong>R</strong> to start over.</p> },
    ]);
    setInputValue('');
  }, [isStreaming, awaitingMoreConfirm, exploredIds, getRemainingQuestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(inputValue);
    }
  };

  // Render a question options block (renumbered, excluding explored)
  const renderOptions = (excludeIds: number[]) => {
    const excluded = new Set(excludeIds);
    const remaining = qaItems.filter(q => !excluded.has(q.id));
    return (
      <div className="about-page__msg about-page__msg--ai">
        <div className="about-page__msg-label">Claude</div>
        <div className="about-page__msg-bubble about-page__msg-bubble--ai">
          <p>Here's what's left — what do you want to know?</p>
          <div className="about-page__options">
            {remaining.map((item, i) => (
              <button
                key={item.id}
                className="about-page__option"
                onClick={() => handleSubmit(String(i + 1))}
                disabled={isStreaming}
              >
                <span className="about-page__option-num">{i + 1}</span>
                <span className="about-page__option-text">{item.question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Get current placeholder text
  const getPlaceholder = () => {
    if (awaitingMoreConfirm) return 'Want to know more? Press Enter ↵';
    return 'Type a number and press Enter ↵';
  };

  return (
    <article className="about-page">
      {/* Fixed nav */}
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
            Outside of work, I'm wired like an athlete. I've run the same dynasty fantasy football league for over a decade&mdash;not just for the competition, but for the systems behind it. Studying patterns, refining strategy, and building a playbook based on what the data actually shows. That mindset carries directly into how I work.
          </p>
          <p className="about-page__hero-body">
            I approach design the same way: grounded in fundamentals, shaped by real-world constraints, and constantly refined through iteration. Over time, that's evolved into systems thinking&mdash;understanding not just what to design, but how it holds up in production, scales across teams, and adapts over time.
          </p>
          <p className="about-page__hero-body">
            What excites me about where things are now is the speed. AI has changed how quickly ideas can be built and tested&mdash;but it hasn't replaced the need for direction. If anything, it's made it more important. I see it as a multiplier: a way to explore more, test faster, and refine better&mdash;as long as you know what you're aiming for.
          </p>
          <p className="about-page__hero-body">
            I do my best work on teams that value high standards, real collaboration, and an environment where thoughtful work can move quickly and actually make it into production.
          </p>
        </div>
      </div>

      {/* Chat-style prompt section */}
      <div className="about-page__chat">
        <div className="about-page__chat-container">
          <span className="about-page__chat-tag">Interactive Component</span>

          {/* Conversation thread */}
          <div className="about-page__chat-thread">

            {/* Seed — user prompt */}
            <div className="about-page__msg about-page__msg--user">
              <div className="about-page__msg-label">You</div>
              <div className="about-page__msg-bubble about-page__msg-bubble--user">
                <p>Referencing my site structure and all my case studies as well as the uploaded personal details (that i have given access to) — build me a repo to tell potential employers who Ryan is, what drives him, and what actually sets him apart in a rapidly evolving design landscape.</p>
              </div>
            </div>

            {/* Seed — AI response with initial questions */}
            <div className="about-page__msg about-page__msg--ai">
              <div className="about-page__msg-label">Claude</div>
              <div className="about-page__msg-bubble about-page__msg-bubble--ai">
                <p>On it. I've scanned all files across your case studies, process docs, wireframes, design systems, and personal writing.</p>
                <p>I've built a full profile.</p>
                <p>Here's what I can tell them. What do you want to know?</p>

                <div className="about-page__options">
                  {qaItems.map((item, i) => (
                    <button
                      key={item.id}
                      className="about-page__option"
                      onClick={() => handleSubmit(String(i + 1))}
                      disabled={isStreaming || history.length > 0}
                    >
                      <span className="about-page__option-num">{i + 1}</span>
                      <span className="about-page__option-text">{item.question}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic conversation history */}
            {history.map((entry, i) => {
              if (entry.type === 'user') {
                return (
                  <div key={i} className="about-page__msg about-page__msg--user">
                    <div className="about-page__msg-label">You</div>
                    <div className="about-page__msg-bubble about-page__msg-bubble--user">
                      <p>{entry.content}</p>
                    </div>
                  </div>
                );
              }
              if (entry.type === 'ai') {
                return (
                  <div key={i} className="about-page__msg about-page__msg--ai">
                    <div className="about-page__msg-label">Claude</div>
                    <div className="about-page__msg-bubble about-page__msg-bubble--ai">
                      {entry.content}
                    </div>
                  </div>
                );
              }
              if (entry.type === 'options') {
                return <React.Fragment key={i}>{renderOptions(entry.excludeIds)}</React.Fragment>;
              }
              return null;
            })}

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="about-page__msg about-page__msg--ai">
                <div className="about-page__msg-label">Claude</div>
                <div className="about-page__msg-bubble about-page__msg-bubble--ai">
                  <div className="about-page__thinking">
                    <span className="about-page__thinking-dot" />
                    <span className="about-page__thinking-dot" />
                    <span className="about-page__thinking-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input field — sticky at bottom */}
          <div className="about-page__chat-input-row" ref={inputRowRef}>
            <span className="about-page__chat-arrow">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              className="about-page__chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              disabled={isStreaming}
              aria-label="Type a question number"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <Footer />
    </article>
  );
};

export default AboutPage;
