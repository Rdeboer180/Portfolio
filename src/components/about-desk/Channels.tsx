// "In other people's words" as the homepage's Slack, unfolded into the page
// (Words 01, Ryan's pick, 1 Nov): each strength is a channel named after it,
// and the person who saw it left the message, the phrase that proves it
// marked as the homepage marks it. "View thread" opens the whole
// recommendation in the slide-out (DeskNotes, thread:<name>). An artifact
// that stands in for a person is a pinned message.
//
// The first time a channel scrolls in, its sender is typing for a moment,
// then the message lands: once per channel, never on a loop, and straight to
// the message with reduced motion. The messages are in the page from the
// start (only hidden to the eye while the dots run), so a screen reader
// reads them whenever it gets there.
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { strengthRows, StrengthRow } from '../../data/about';
import { initials, testimonials } from '../Testimonials';
import { useOpenNote } from './noteOpener';

const slug = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, '-');
const TYPING_MS = 650;

const PinIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 1.8l3.7 3.7-2 .6-2.4 2.4.4 3-1.3 1.3-2.6-2.6-3.6 3.6-.7-.7 3.6-3.6L3 6.9l1.3-1.3 3 .4 2.4-2.4z" /></svg>
);

const Channel: React.FC<{ row: StrengthRow }> = ({ row }) => {
  const open = useOpenNote();
  const ref = useRef<HTMLElement>(null);
  const people = row.vouchers.flatMap((v) => (v.kind === 'person' ? [v] : []));
  const first = people[0] ? testimonials.find((t) => t.name === people[0].name) : undefined;
  // waiting: scrolled into view, the sender typing; arrived: the message is down
  const [phase, setPhase] = useState<'before' | 'typing' | 'arrived'>('before');
  useEffect(() => {
    const el = ref.current;
    if (!el || !people.length) { setPhase('arrived'); return undefined; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setPhase('arrived'); return undefined; }
    let timer = 0;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setPhase('typing');
      timer = window.setTimeout(() => setPhase('arrived'), TYPING_MS);
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer); };
    // the channel's people never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article ref={ref} className={`channel is-${phase}`} aria-labelledby={`channel-${row.channel}`}>
      <header className="channel__head">
        <h3 id={`channel-${row.channel}`} className="channel__name"><span aria-hidden="true">#</span> {row.channel}</h3>
        <p className="channel__topic">{row.phrases.join(' · ')}</p>
      </header>
      <div className="channel__body">
        {first && (
          <div className="channel__typing" aria-hidden="true">
            <span className="channel__avatar">{initials(first.name)}</span>
            <span className="channel__dots"><i /><i /><i /></span>
            <span className="channel__typing-text">{first.name.split(' ')[0]} is typing…</span>
          </div>
        )}
        {row.vouchers.map((v) => {
          if (v.kind === 'artifact') {
            return (
              <div key={v.to} className="channel__pinned">
                <span className="channel__pin"><PinIcon />Pinned</span>
                <Link to={v.to}>{v.label}</Link>
                <span className="channel__path">{v.to}</span>
              </div>
            );
          }
          const t = testimonials.find((x) => x.name === v.name);
          const id = `thread-${slug(v.name)}`;
          return (
            <div key={v.name} className="channel__message">
              <span className="channel__avatar" aria-hidden="true">{initials(v.name)}</span>
              <div>
                <p className="channel__sender"><b>{v.name}</b> <span>{v.role}{t ? ` · ${t.year}` : ''}</span></p>
                <p className="channel__text">“…<mark>{v.quote}</mark>…”</p>
                {t && (
                  <button type="button" id={`t-${id}`} className="channel__thread" onClick={() => open(`thread:${v.name}`, id)}>
                    View thread <span aria-hidden="true">→</span><span className="sr-only">: {v.name}’s recommendation in full</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

/** the strengths as channels; replaces the old list under "In other people's words" */
export const Channels: React.FC = () => (
  <div className="channels">
    {strengthRows.map((row) => <Channel key={row.channel} row={row} />)}
  </div>
);
