import React from 'react';
import type { TargetedHomepageContent } from './homepage-sleeper';

const dynastyNerdsContent: TargetedHomepageContent = {
  meta: {
    slug: 'homepage_dynastynerds',
    company: 'DynastyNerds',
  },

  hero: {
    eyebrow: 'Senior Web Designer by title.',
    roles: ['Design Strategist', 'Product Designer', 'UX Engineer'],
    headline: '',
    body: (
      <>
        Job titles evolve, but the work doesn&rsquo;t. For 16+ years, I&rsquo;ve worked at the intersection of UX, front-end, and design systems&mdash;crafting experiences that don&rsquo;t just look right, but hold up in production. I do my best work where high standards, real collaboration, and thoughtful execution all matter at the same time. My strength is connecting those pieces and turning complexity into something teams can ship and scale. <span className="about__highlight">A NerdHerd member since day one, I&rsquo;m ready to help the #1 dynasty platform look as good as it plays.</span>
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
      'Early in my career, I was hired for design instinct, visual craft, and strategic thinking. But I knew that if I wanted to build the kind of work I admired, I needed deeper technical fluency. So I closed that gap the same way I approach everything else: reps, curiosity, experimentation, and a lot of time spent learning by doing. Over time, that turned me into the kind of designer who can spot what feels off, understand why, and help fix it at the system level.',
      'Fantasy football isn\u2019t a casual hobby for me\u2014it\u2019s a lifestyle. I\u2019ve run a dynasty league for over a decade, and I designed custom logos and brand identities for every single team. My own squad, the Grandville Gremlins, has become a full family tradition\u2014logo on mugs, baby onesies, t-shirts, sweatshirts, anything that might bring superstitious Sunday luck. Growing up a DeBoer means growing up a Gremlins fan. We also run March Madness brackets and my family\u2019s annual Pigskin Pick\u2019em challenge. Sports platforms aren\u2019t seasonal for us\u2014they\u2019re year-round.',
      'I\u2019ve been following DynastyNerds since 2018 and became a NerdHerd member on day one. Garrett, Rich, and Matt have been a constant in my week\u2014whether it\u2019s the commute, the gym, or just a mental reset from the daily grind. That kind of loyalty doesn\u2019t happen by accident. It comes from genuine passion for the content, trust in the voices behind it, and a community that actually gives a damn. I want to point my craft toward an organization I\u2019m already invested in.',
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
      { value: '10+', label: 'Years of dynasty fantasy football' },
      { value: '50+', label: 'Design system components built' },
    ],
  },

  whyCompany: {
    badgeLabel: 'Why DynastyNerds',
    title: 'Why I\u2019m the Right Draft Pick',
    subtitle: 'This isn\u2019t a cold application\u2014it\u2019s a deliberate move toward a brand and community I\u2019ve been part of for years.',
    intro: 'Here\u2019s the game film that shows why I\u2019m ready to contribute from day one.',
    points: [
      {
        title: 'A Member, Not Just a Fan',
        body: 'I\u2019ve been following DynastyNerds since 2018 and joined NerdHerd the moment it launched. Garrett, Rich, and Matt have been part of my weekly routine for years\u2014an escape from daily stress and a community I genuinely value. I\u2019m not applying because it\u2019s a fantasy company. I\u2019m applying because it\u2019s this one.',
      },
      {
        title: 'I Already Know the Playbook',
        body: 'I\u2019ve spent over a decade running dynasty leagues, hosting family brackets, and designing team brands from scratch. I know how dynasty players think, what they need from a platform, and where friction costs trust. I don\u2019t need onboarding to understand the audience. I am the audience.',
      },
      {
        title: 'Design Systems Are My Position',
        body: 'At Tire Rack, I built and maintained scalable component libraries and design systems in Figma serving millions of users across multiple retail brands. Bringing that same infrastructure thinking to DynastyNerds\u2014where the product needs to grow alongside the community\u2014is exactly the kind of challenge I want to take on.',
      },
      {
        title: 'I Close the Gap Between Design and Code',
        body: 'I don\u2019t just hand off designs and hope for the best. With deep SCSS/CSS and front-end skills, I ensure what I design is what ships. That means fewer redlines, faster iteration, and better design-to-code parity across the product.',
      },
      {
        title: 'Passion That Goes Beyond the Clock',
        body: 'The Grandville Gremlins aren\u2019t just a fantasy team\u2014they\u2019re a family tradition. Logo on mugs, onesies, sweatshirts, anything that might bring superstitious Sunday luck. When a platform brings your family and friends together every week, you bring everything you have to the work behind it.',
      },
      {
        title: 'Built to Elevate What\u2019s Already Working',
        body: 'The Nerd Score, film room, trade calculator, mock draft app\u2014DynastyNerds has built a serious product suite for a serious audience. My job wouldn\u2019t be to reinvent it. It\u2019d be to make the experience as polished and scalable as the content and data behind it.',
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
        question: 'Why DynastyNerds?',
        answer: (
          <>
            <p>Because I\u2019ve been here since the beginning. I\u2019ve followed the podcast since 2018 and joined NerdHerd on day one. Garrett, Rich, and Matt have been a consistent part of my week for years\u2014a genuine escape from daily stressors and one of the communities I actually look forward to being part of. That kind of loyalty isn\u2019t manufactured.</p>
            <p>I want to shift my craft toward an organization I\u2019m already passionate about elevating. DynastyNerds has built real trust with a real audience. I want to help make the product experience as strong as the content behind it.</p>
          </>
        ),
      },
      {
        question: 'How do you approach design systems at scale?',
        answer: 'I treat design systems like infrastructure, not decoration. At Tire Rack, I built component libraries and token systems in Figma that powered production UI across multiple retail brands. I documented patterns, governed usage, and worked hand-in-hand with engineering to ensure what we designed was what shipped. I\u2019d bring that same rigor to DynastyNerds\u2014building the kind of scalable foundation that lets the product grow alongside the community.',
      },
      {
        question: 'Do you code or just design?',
        answer: 'Both. I write production front-end code (HTML, SCSS/CSS) and have deep experience with CMS component development. At Tire Rack, I owned the AEM template layer end-to-end\u2014building and maintaining component templates, writing the styles that powered them, and documenting patterns so the broader team could ship consistently. That technical fluency means I can speak engineering\u2019s language and design solutions that are buildable from the start.',
      },
      {
        question: 'Can you design for a growing, community-driven product?',
        answer: 'That\u2019s exactly the kind of work I\u2019m drawn to. Community-driven products live or die on trust\u2014and trust is built through consistency, clarity, and an experience that respects the user\u2019s time. I\u2019ve spent my career designing scalable UI systems that hold up as products grow. I understand the constraints of a fast-moving team and know how to prioritize what actually moves the needle.',
      },
      {
        question: 'Do you have any concerns about the role?',
        answer: (
          <>
            <p>Just one: Rich promising an aggressive live date for a new feature on the podcast before anyone on the product side has been consulted.</p>
            <p>I&rsquo;ve been a NerdHerd member long enough to know that when Rich gets excited about something, a timeline gets floated&mdash;and somewhere a developer loses a weekend. I&rsquo;m fully prepared for this. I&rsquo;ve already cleared my calendar for the next several Sundays just in case.</p>
            <p>(Long-time listener. I know exactly what I&rsquo;m signing up for.)</p>
          </>
        ),
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
            <p>Outside of family, a lot of what I do for fun still involves building things. I manage my Type 1 diabetes using a custom-coded branch of the Loop app&mdash;a closed-loop insulin delivery system I\u2019ve configured and maintained myself. It\u2019s equal parts health management and engineering hobby.</p>
            <p>And of course, football Sundays are sacred. The Grandville Gremlins dynasty league keeps a tight group of high school and college friends connected year-round\u2014from draft day through the championship, March Madness brackets, and our family\u2019s annual Pigskin Pick\u2019em. I designed every team\u2019s logo and put the Gremlins brand on everything from coffee mugs to onesies. DynastyNerds has been the soundtrack to all of it since 2018. That\u2019s why I want to help build it.</p>
          </>
        ),
      },
    ],
  },

  footer: {
    eyebrow: 'Ready to make the pick?',
    tagline: 'NerdHerd since day one \u00b7 Go Gremlins',
  },
};

export default dynastyNerdsContent;
