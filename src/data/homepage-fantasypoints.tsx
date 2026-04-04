import React from 'react';
import type { TargetedHomepageContent } from './homepage-sleeper';

const fantasypointsContent: TargetedHomepageContent = {
  meta: {
    slug: 'homepage_fantasypoints',
    company: 'FantasyPoints',
  },

  hero: {
    eyebrow: 'Senior Web Designer by title but I\u2019m also a',
    roles: ['Product Designer', 'UX Engineer', 'Design Systems Lead'],
    headline: '',
    body: (
      <>
        I design and build high-fidelity product experiences with a systems-first approach&mdash;combining UX, front-end coding, and design systems to turn complex ideas into scalable, production-ready solutions. <span className="about__highlight">I&rsquo;m designing better fantasy experiences&mdash;for the platforms I&rsquo;ve trusted for years.</span>
      </>
    ),
  },

  about: {
    title: 'A Subscriber First, a Designer Always',
    paragraphs: [
      (
        <>
          <span className="about__highlight">Part designer, part front-end thinker, part systems builder</span>&mdash;I do my best work where craft, strategy, and implementation meet. For the last 16 years, what&rsquo;s set me apart hasn&rsquo;t been just visual taste&mdash;it&rsquo;s been the ability to <span className="about__highlight">define the real problem, work within real constraints, and understand how the final product actually gets made.</span>
        </>
      ),
      'I\u2019ve been following fantasy football content since college, and John Hansen was one of the first voices I trusted in the space. When FantasyPoints launched, I became a subscriber right away\u2014and I\u2019ve stayed one.',
      'That kind of long-term trust doesn\u2019t happen by accident. It comes from clarity, consistency, and a product experience that supports the depth of the content behind it. That\u2019s the kind of work I care about\u2014and the kind of product I want to help build.',
      (
        <>
          <span className="about__highlight">AI is changing how quickly ideas can be explored, designed, and shipped&mdash;but without strategy behind the work and the prompt, the product won&rsquo;t stand out.</span> I&rsquo;ve spent time getting ahead of that curve, actively using LLM workflows to explore faster and push ideas further. But I don&rsquo;t see that as a long-term edge&mdash;it&rsquo;s quickly becoming the expectation.
        </>
      ),
      'The real separation will come from designers who can think beyond the output\u2014who know how to guide the tools, pressure test what they produce, and push the work further than expected. That\u2019s where I do my best work: bringing clear thinking, high standards, and uncommon care to the final product.',
      'That\u2019s a big part of why I feel so well matched for where the industry is now\u2014bringing together design taste, systems thinking, technical understanding, and a genuine love for making things better than they need to be.',
    ],
    stats: [
      { value: '16+', label: 'Years designing professionally' },
      { value: '500+', label: 'Projects shipped to production' },
      { value: '50+', label: 'Design system components built' },
      { value: 'Day 1', label: 'FantasyPoints subscriber' },
    ],
  },

  whyCompany: {
    badgeLabel: 'Why FantasyPoints',
    title: 'Why I\u2019m Reaching Out',
    subtitle: 'I\u2019m a Senior Web Designer and UX Engineer with 16+ years of experience working at the intersection of UI/UX, front-end development, and design systems.',
    intro: 'Here\u2019s where my strengths align with what FantasyPoints needs.',
    points: [
      {
        title: 'Designing Clarity from Complexity',
        body: 'Fantasy football products live or die on how quickly users can find, trust, and act on information. I specialize in simplifying complex data into intuitive, scannable UI\u2014the kind of thoughtful design that makes a measurable difference.',
      },
      {
        title: 'Scalable Component Systems',
        body: 'At Tire Rack, I built and maintained scalable component libraries and design systems in Figma serving millions of users across multiple retail brands. I\u2019d bring that same infrastructure-first approach to FantasyPoints\u2019 product.',
      },
      {
        title: 'Bridging Design and Engineering',
        body: 'I don\u2019t just hand off designs and hope for the best. I\u2019ve spent years working closely with engineering teams\u2014helping define how data is structured, surfaced, and experienced on the front end. That collaboration is where I do my best work.',
      },
      {
        title: 'Navigation and Discoverability',
        body: 'A content-rich product like FantasyPoints needs intuitive wayfinding. I\u2019d focus on improving how users navigate across tools, rankings, analysis, and content\u2014reducing friction between insight and action.',
      },
      {
        title: 'Elevating the Storytelling Layer',
        body: 'Rankings and analysis are only as good as how they\u2019re consumed. I\u2019d focus on how insights are presented\u2014the visual hierarchy, the information density, the moments where design helps the content land.',
      },
      {
        title: 'Rapid, Consistent Iteration',
        body: 'Reusable design systems mean faster iteration without sacrificing quality. I\u2019d build the patterns and components that let the team ship confidently and consistently as the product grows.',
      },
    ],
  },

  skills: {
    title: 'What I Bring to the Table',
    subtitle: 'The full stack of product design, systems thinking, and front-end execution.',
    intro: 'Scalable design systems, data-driven UI, cross-functional collaboration, and end-to-end ownership.',
    categories: [
      {
        title: 'Product Design & UX',
        skills: ['End-to-End Design Ownership', 'High-Fidelity Prototyping', 'Data-Dense UI & Information Design', 'Systems Thinking & Scalable UI', 'A/B Testing & Data-Informed Decisions'],
      },
      {
        title: 'Design Systems',
        skills: ['Component Library Architecture', 'Design Token Management', 'Figma Variables & Styles', 'Documentation & Governance', 'Atomic Design Methodology'],
      },
      {
        title: 'Collaboration & Leadership',
        skills: ['Engineering Partnership & Handoff', 'Mentoring Junior Designers', 'Cross-Functional Facilitation', 'Stakeholder Alignment', 'Ideation Session Leadership'],
      },
      {
        title: 'Front-End Fluency',
        skills: ['SCSS/CSS & BEM Architecture', 'HTML5 & Responsive Design', 'Design-to-Code Parity', 'CMS Component Development', 'Git Workflow'],
      },
      {
        title: 'Innovation & Craft',
        skills: ['AI-Augmented Design Workflows', 'Accessibility-First Design (WCAG)', 'SEO-Informed UI Patterns', 'Brand Identity & Visual Systems', 'Performance-Conscious Design'],
      },
    ],
  },

  faq: {
    title: 'Questions You Might Have',
    intro: 'Straight answers to the things a hiring team would want to know.',
    items: [
      {
        question: 'Why FantasyPoints?',
        answer: (
          <>
            <p>Because I&rsquo;m already a subscriber. I&rsquo;ve been following fantasy football content since college, and John Hansen was one of the first voices I trusted. When FantasyPoints launched, I signed up right away&mdash;and I&rsquo;ve stayed.</p>
            <p>I want to design for a product I genuinely believe in. FantasyPoints has the content depth and credibility&mdash;I want to help make the product experience match that standard.</p>
          </>
        ),
      },
      {
        question: 'How do you approach design systems at scale?',
        answer: 'I treat design systems like infrastructure, not decoration. At Tire Rack, I built component libraries and token systems in Figma that powered production UI across multiple retail brands. I documented patterns, governed usage, and worked hand-in-hand with engineering to ensure what we designed was what shipped. I\u2019d bring that same rigor to FantasyPoints.',
      },
      {
        question: 'Do you code or just design?',
        answer: 'Both. I write production front-end code (HTML, SCSS/CSS) and have deep experience with CMS component development. At Tire Rack, I owned the AEM template layer end-to-end\u2014building and maintaining component templates, writing the styles that powered them, and documenting patterns so the broader team could ship consistently. That technical fluency means I can speak engineering\u2019s language and design solutions that are buildable from the start.',
      },
      {
        question: 'You don\u2019t have a backend background\u2014is that a problem?',
        answer: 'Not for the work I\u2019d be doing. My strength is on the product and UI side\u2014designing how data is surfaced and experienced, not how it\u2019s stored or piped. That said, I\u2019ve spent years collaborating closely with backend engineers, helping define data structures and API contracts from the front-end perspective. I know how to ask the right questions and design within real technical constraints.',
      },
      {
        question: 'How do you handle mentorship and collaboration?',
        answer: 'Collaboration and mentorship aren\u2019t side quests for me\u2014they\u2019re core to how I work. I\u2019ve led ideation sessions, provided feedback to designers at all levels, and built documentation that helps teams ship consistently without bottlenecking through me. My reviews consistently highlight my ability to build cross-functional relationships across design, UX, analytics, and engineering teams.',
      },
      {
        question: 'What drives you outside of design?',
        answer: (
          <>
            <p>People first. I married my high school sweetheart Stephanie&mdash;we&rsquo;ve now spent more than half our lives together&mdash;and our two kids are the center of everything. Weekends usually mean the park, the zoo, or wherever the next national park road trip takes us.</p>
            <p>Outside of family, a lot of what I do for fun still involves building things. I manage my Type 1 diabetes using a custom-coded branch of the Loop app&mdash;a closed-loop insulin delivery system I&rsquo;ve configured and maintained myself. It&rsquo;s equal parts health management and engineering hobby.</p>
            <p>And of course, football Sundays are sacred. I run a dynasty fantasy football league that keeps a tight group of high school and college friends connected year-round. I&rsquo;m a FantasyPoints subscriber, a March Madness bracket obsessive, and the guy running my family&rsquo;s annual Pigskin Pick&rsquo;em. Sports content platforms aren&rsquo;t just something I use&mdash;they&rsquo;re part of how I stay connected to the people I care about.</p>
          </>
        ),
      },
    ],
  },

  footer: {
    eyebrow: 'Let\u2019s talk about what I can build for FantasyPoints',
    tagline: 'Subscriber since day one',
  },
};

export default fantasypointsContent;
