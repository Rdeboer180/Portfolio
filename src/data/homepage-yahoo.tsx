import React from 'react';
import type { TargetedHomepageContent } from './homepage-sleeper';

const yahooContent: TargetedHomepageContent = {
  meta: {
    slug: 'homepage_yahoo',
    company: 'Yahoo Sports',
  },

  hero: {
    eyebrow: 'Senior Web Designer by title but I\u2019m also a',
    roles: ['Design Strategist', 'Product Designer', 'UX Engineer'],
    headline: '',
    body: (
      <>
        I design and build high-fidelity product experiences with a systems-first approach&mdash;combining UX, front-end coding, and design systems to turn complex ideas into scalable, production-ready solutions. <span className="about__highlight">As a lifelong fantasy football fanatic who&rsquo;s spent over a decade running leagues and living inside sports platforms every Sunday&mdash;I&rsquo;m ready to bring that game-day intensity to Yahoo Sports&rsquo; product team.</span>
      </>
    ),
  },

  about: {
    title: 'Put Me in Coach, I\u2019m Ready to Build',
    titleImage: '/images/sleeper/gremlins_logo.png',
    paragraphs: [
      (
        <>
          <span className="about__highlight">Part designer, part front-end thinker, part systems builder</span>&mdash;I do my best work where craft, strategy, and implementation meet. For the last 16 years, what&rsquo;s set me apart hasn&rsquo;t been just visual taste&mdash;it&rsquo;s been the ability to <span className="about__highlight">define the real problem, work within real constraints, and understand how the final product actually gets made.</span> Every great play starts with preparation, and that&rsquo;s how I approach every product problem.
        </>
      ),
      'Fantasy football isn\u2019t a casual hobby for me\u2014it\u2019s a lifestyle. I\u2019ve run a dynasty league for over a decade, and I designed custom logos and brand identities for every single team. My own squad, the Grandville Gremlins, has become a full family tradition\u2014logo on mugs, baby onesies, t-shirts, sweatshirts, anything that might bring superstitious Sunday luck. Growing up a DeBoer means growing up a Gremlins fan. We also run March Madness brackets and my family\u2019s annual Pigskin Pick\u2019em challenge. Sports platforms aren\u2019t seasonal for us\u2014they\u2019re year-round.',
      'That\u2019s why a role at Yahoo Sports feels like a first-round pick. I don\u2019t just understand sports fans\u2014I am one. I know what it feels like to check scores at halftime, trash-talk in league chat, and obsess over waiver wire moves at 3am. Combine that instinct with 16 years of designing scalable UI systems, building design systems from the ground up, and shipping production-ready front-end code\u2014and you get someone who can contribute to Yahoo Sports\u2019 design team from day one.',
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
      { value: '10+', label: 'Years of fantasy football leagues' },
      { value: '50+', label: 'Design system components built' },
    ],
  },

  whyCompany: {
    badgeLabel: 'Why Yahoo Sports',
    title: 'Why I\u2019m the Right Draft Pick',
    subtitle: 'This isn\u2019t just another application\u2014it\u2019s a position I\u2019ve been training for my entire career.',
    intro: 'Here\u2019s the game film that shows why I\u2019m ready to contribute from day one.',
    points: [
      {
        title: 'I Already Know the Playbook',
        body: 'I\u2019ve been a fantasy football fanatic for over a decade\u2014running dynasty leagues, hosting brackets, and designing team brands from scratch. I don\u2019t need onboarding to understand sports fans. I am one.',
      },
      {
        title: 'Design Systems Are My Position',
        body: 'At Tire Rack, I built and maintained scalable component libraries and design systems in Figma serving millions of users across multiple retail brands. Building systems that scale across a massive product surface\u2014that\u2019s exactly what Yahoo Sports demands.',
      },
      {
        title: 'I Close the Gap Between Design and Code',
        body: 'I don\u2019t just hand off designs and hope for the best. With deep SCSS/CSS and front-end skills, I ensure what I design is what ships. That means fewer redlines, faster iteration, and better design-to-code parity across platforms.',
      },
      {
        title: 'Built for Scale',
        body: 'Yahoo Sports serves hundreds of millions of fans. I\u2019ve spent my career designing for high-traffic, enterprise-scale products\u2014building responsive experiences and component systems that hold up under real-world usage at Tire Rack\u2019s scale.',
      },
      {
        title: 'Built to Mentor and Elevate',
        body: 'I\u2019ve spent 5+ years leading growth programs and setting standards for design quality, documentation, and collaboration\u2014helping teammates level up is one of the most rewarding parts of my work.',
      },
      {
        title: 'Passion That Goes Beyond the Clock',
        body: 'The Grandville Gremlins aren\u2019t just a fantasy team\u2014they\u2019re a family tradition. I\u2019ve put that logo on mugs, onesies, sweatshirts, and anything that might bring superstitious Sunday luck. When sports platforms are the thing that brings my family and friends together every week, you know I\u2019m going to bring everything I have to the work.',
      },
    ],
  },

  skills: {
    title: 'The Roster of What I Bring',
    subtitle: 'Every championship team needs depth across positions. Here\u2019s my starting lineup.',
    intro: 'Scalable design systems, cross-platform thinking, collaboration, and end-to-end ownership. These are exactly the plays I run.',
    categories: [
      {
        title: 'Product Design & UX',
        skills: ['End-to-End Design Ownership', 'High-Fidelity Prototyping', 'Cross-Platform & Responsive Design', 'Systems Thinking & Scalable UI', 'A/B Testing & Data-Informed Decisions'],
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
    title: 'Scouting Report',
    intro: 'Questions a hiring team might ask before making the pick\u2014answered up front.',
    items: [
      {
        question: 'Why Yahoo Sports?',
        answer: (
          <>
            <p>Because I want to design for a product that connects fans to the sports they love\u2014and I know firsthand what that connection feels like. I\u2019ve spent over a decade running fantasy football leagues, designing custom team logos for every squad, and building the Grandville Gremlins into a full family brand. March Madness brackets, Pigskin Pick\u2019em, Sunday check-ins\u2014sports platforms are woven into my life year-round.</p>
            <p>Yahoo Sports has the reach and legacy to shape how millions of fans experience sports. That\u2019s the kind of canvas I want to design on.</p>
          </>
        ),
      },
      {
        question: 'How do you approach design systems at scale?',
        answer: 'I treat design systems like infrastructure, not decoration. At Tire Rack, I built component libraries and token systems in Figma that powered production UI across multiple retail brands. I documented patterns, governed usage, and worked hand-in-hand with engineering to ensure what we designed was what shipped. I\u2019d bring that same rigor to Yahoo Sports\u2019 design system.',
      },
      {
        question: 'Do you code or just design?',
        answer: 'Both. I write production front-end code (HTML, SCSS/CSS) and have deep experience with CMS component development. At Tire Rack, I owned the AEM template layer end-to-end\u2014building and maintaining component templates, writing the styles that powered them, and documenting patterns so the broader team could ship consistently. That technical fluency means I can speak engineering\u2019s language and design solutions that are buildable from the start.',
      },
      {
        question: 'Can you design for high-traffic, large-scale products?',
        answer: 'That\u2019s where I\u2019ve spent my career. At Tire Rack, I designed and built UI systems within a complex AEM architecture serving millions of users across multiple retail brands. I understand the constraints of enterprise-scale products\u2014performance, accessibility, consistency, and maintainability all have to work together.',
      },
      {
        question: 'How do you handle mentorship and collaboration?',
        answer: 'Collaboration and mentorship aren\u2019t side quests for me\u2014they\u2019re core to how I work. I\u2019ve led ideation sessions, provided feedback to designers at all levels, and built documentation that helps teams ship consistently without bottlenecking through me. My reviews consistently highlight my ability to build cross-functional relationships and create community across design, UX, analytics, and engineering teams.',
      },
      {
        question: 'What drives you outside of design?',
        answer: (
          <>
            <p>People first. I married my high school sweetheart Stephanie&mdash;we&rsquo;ve now spent more than half our lives together&mdash;and our two kids are the center of everything. Weekends usually mean the park, the zoo, or wherever the next national park road trip takes us.</p>
            <p>Outside of family, a lot of what I do for fun still involves building things. I manage my Type 1 diabetes using a custom-coded branch of the Loop app&mdash;a closed-loop insulin delivery system I&rsquo;ve configured and maintained myself. It&rsquo;s equal parts health management and engineering hobby.</p>
            <p>And of course, football Sundays are sacred. The Grandville Gremlins dynasty league keeps a tight group of high school and college friends connected year-round&mdash;from draft day through the championship, March Madness brackets, and our family&rsquo;s annual Pigskin Pick&rsquo;em. I designed every team&rsquo;s logo and put the Gremlins brand on everything from coffee mugs to onesies. Sports are the thread that connects my family and friends, and that&rsquo;s exactly why I want to help build the platforms that make those moments possible.</p>
          </>
        ),
      },
    ],
  },

  footer: {
    eyebrow: 'Ready to make the pick?',
    tagline: 'Go Gremlins',
  },
};

export default yahooContent;
