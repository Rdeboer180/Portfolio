import React from 'react';

/**
 * All Sleeper-specific text content in one place.
 * To create a new targeted homepage, duplicate this file (e.g. homepage-google.tsx)
 * and update the text. The HomepageTargeted component reads from whichever config you pass it.
 */

export interface TargetedHomepageContent {
  meta: {
    slug: string;           // URL slug, e.g. "homepage_sleeper"
    company: string;        // Company name
  };
  hero: {
    eyebrow: string;
    roles: string[];        // Typing animation roles
    headline: string;
    body: string | React.ReactNode;
  };
  about: {
    title: string;
    titleImage?: string;  // Optional image/gif displayed next to the H2
    paragraphs: (string | React.ReactNode)[];
    stats: { value: string; label: string }[];
  };
  whyCompany: {
    badgeLabel: string;
    title: string;
    subtitle: string;
    intro: string;
    points: { title: string; body: string }[];
  };
  skills: {
    title: string;
    subtitle: string;
    intro: string;
    categories: { title: string; skills: string[] }[];
  };
  faq: {
    title: string;
    intro: string;
    items: { question: string; answer: string | React.ReactNode }[];
  };
  footer: {
    eyebrow: string;
    tagline: string;
  };
}

const sleeperContent: TargetedHomepageContent = {
  meta: {
    slug: 'homepage_sleeper',
    company: 'Sleeper',
  },

  hero: {
    eyebrow: 'Senior Web Designer by title but I\u2019m also a',
    roles: ['Design Strategist', 'Product Designer', 'UX Engineer'],
    headline: '',
    body: (
      <>
        I design and build high-fidelity product experiences with a systems-first approach&mdash;combining UX, front-end coding, and design systems to turn complex ideas into scalable, production-ready solutions. <span className="about__highlight">I&rsquo;ve been a Sleeper user since its first season&mdash;now I&rsquo;m ready to bring that same game-day intensity to Sleeper&rsquo;s product team.</span>
      </>
    ),
  },

  about: {
    title: 'Put me in coach, im ready to Build',
    titleImage: '/images/sleeper/gremlins_logo.png',
    paragraphs: [
      (
        <>
          <span className="about__highlight">Part designer, part front-end thinker, part systems builder</span>&mdash;I do my best work where craft, strategy, and implementation meet. For the last 16 years, what&rsquo;s set me apart hasn&rsquo;t been just visual taste&mdash;it&rsquo;s been the ability to <span className="about__highlight">define the real problem, work within real constraints, and understand how the final product actually gets made.</span> Every great play starts with preparation, and that&rsquo;s how I approach every product problem.
        </>
      ),
      'I didn\u2019t just stumble into Sleeper\u2014I\u2019ve been on the platform since its very first season. I run a dynasty fantasy football league where I designed custom logos for every single team. My own squad, the Grandville Gremlins, has become a full family brand\u2014logo on mugs, baby onesies, t-shirts, sweatshirts, you name it. Growing up a DeBoer means you\u2019re growing up a Gremlins fan. Football Sundays are sacred in our house, and Sleeper is the command center that keeps our tight group of high school and college friends connected from draft day through the championship. We also host our March Madness brackets and my family\u2019s annual Pigskin Pick\u2019em challenge on the platform\u2014Sleeper isn\u2019t just for one season, it\u2019s year-round for us.',
      'That\u2019s why this role feels like a first-round pick. I don\u2019t just understand the product\u2014I live in it. I know what it feels like to check scores at halftime, trash-talk in league chat, and obsess over waiver wire moves at 3am. Combine that instinct with 16 years of designing scalable UI systems, building design systems from the ground up, and shipping production-ready front-end code\u2014and you get someone who can contribute to Sleeper\u2019s design team from day one, across iOS, Android, Web, and Tablet.',
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
      { value: 'Day 1', label: 'Sleeper user since launch' },
      { value: '50+', label: 'Design system components built' },
    ],
  },

  whyCompany: {
    badgeLabel: 'Why Sleeper',
    title: 'Why I\u2019m the Right Draft Pick',
    subtitle: 'This isn\u2019t just another application\u2014it\u2019s a position I\u2019ve been training for since Sleeper\u2019s opening drive.',
    intro: 'Here\u2019s the game film that shows why I\u2019m ready to contribute from day one.',
    points: [
      {
        title: 'I Already Know the Playbook',
        body: 'I\u2019ve been a Sleeper power user since launch\u2014running a dynasty league, hosting March Madness brackets, and running my family\u2019s annual Pigskin Pick\u2019em challenge on the platform. I designed every team\u2019s brand in our league. I don\u2019t need onboarding to understand your users. I am one.',
      },
      {
        title: 'Design Systems Are My Position',
        body: 'At Tire Rack, I built and maintained scalable component libraries and design systems in Figma serving millions of users. Sleeper\u2019s job description calls for "scalable systems"\u2014that\u2019s literally what I do every day.',
      },
      {
        title: 'I Close the Gap Between Design and Code',
        body: 'I don\u2019t just hand off designs and hope for the best. With deep SCSS/CSS and front-end skills, I ensure what I design is what ships. That means fewer redlines, faster iteration, and better design-to-code parity across platforms.',
      },
      {
        title: 'Cross-Platform Vision',
        body: 'Sleeper lives on iOS, Android, Web, and Tablet. I\u2019ve designed responsive, multi-platform experiences throughout my career and understand the constraints and opportunities each surface brings.',
      },
      {
        title: 'Built to Mentor and Elevate',
        body: 'The posting mentions mentorship and feedback for junior designers. I\u2019ve spent 5+ years leading growth programs and setting standards for design quality, documentation, and collaboration\u2014helping teammates level up is one of the most rewarding parts of my work.',
      },
      {
        title: 'Passion That Goes Beyond the Clock',
        body: 'The Grandville Gremlins aren\u2019t just a team\u2014they\u2019re a family tradition. I\u2019ve put that logo on mugs, onesies, sweatshirts, and anything that might bring superstitious Sunday luck. When your product is something I build my weekends around\u2014from dynasty football to March Madness to our family Pick\u2019em\u2014you know I\u2019m going to bring everything I have to the work.',
      },
    ],
  },

  skills: {
    title: 'The Roster of What I Bring',
    subtitle: 'Every championship team needs depth across positions. Here\u2019s my starting lineup.',
    intro: 'Sleeper\u2019s job description asks for design systems expertise, cross-platform thinking, mentorship, and end-to-end ownership. These are exactly the plays I run.',
    categories: [
      {
        title: 'Product Design & UX',
        skills: ['End-to-End Design Ownership', 'High-Fidelity Prototyping', 'Cross-Platform Design (iOS, Android, Web, Tablet)', 'Systems Thinking & Scalable UI', 'A/B Testing & Data-Informed Decisions'],
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
        question: 'Why Sleeper specifically?',
        answer: (
          <>
            <p>Because I don&rsquo;t just want to design for a sports platform&mdash;I want to design for the one I actually use. I&rsquo;ve been on Sleeper since its first season, running a dynasty fantasy football league where I designed every team&rsquo;s logo. My squad&mdash;the Grandville Gremlins&mdash;has its own branded merchandise: mugs, baby onesies, t-shirts, sweatshirts. Growing up a DeBoer means growing up a Gremlins fan. We also run our March Madness brackets and my family&rsquo;s annual Pigskin Pick&rsquo;em on Sleeper&mdash;it&rsquo;s not a seasonal app for us, it&rsquo;s year-round.</p>
            <p>When you live inside a product this deeply, you don&rsquo;t need user research to understand the pain points and moments of delight. You feel them firsthand.</p>
          </>
        ),
      },
      {
        question: 'Can you design across iOS, Android, Web, and Tablet?',
        answer: 'Absolutely. I\u2019ve designed responsive, multi-platform experiences throughout my career\u2014from enterprise AEM sites serving millions of users to custom WordPress builds. I understand platform-specific constraints, responsive behavior, and how to maintain design consistency across surfaces while respecting each platform\u2019s native patterns.',
      },
      {
        question: 'How do you approach design systems at scale?',
        answer: 'I treat design systems like infrastructure, not decoration. At Tire Rack, I built component libraries and token systems in Figma that powered production UI across multiple retail brands. I documented patterns, governed usage, and worked hand-in-hand with engineering to ensure what we designed was what shipped. I\u2019d bring that same rigor to Sleeper\u2019s design system.',
      },
      {
        question: 'Do you code or just design?',
        answer: 'Both. I write production front-end code (HTML, SCSS/CSS) and have deep experience with CMS component development. At Tire Rack, I owned the AEM template layer end-to-end\u2014building and maintaining component templates, writing the styles that powered them, and documenting patterns so the broader team could ship consistently. That technical fluency means I can speak engineering\u2019s language and design solutions that are buildable from the start.',
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
            <p>And of course, football Sundays are sacred. The Grandville Gremlins dynasty on Sleeper keeps a tight group of high school and college friends connected year-round&mdash;from draft day through the championship, March Madness brackets, and our family&rsquo;s annual Pigskin Pick&rsquo;em. I designed every team&rsquo;s logo and put the Gremlins brand on everything from coffee mugs to onesies. When your platform is the thing that brings my family and friends together every week, you know I&rsquo;m going to bring everything I have to the work.</p>
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

export default sleeperContent;
