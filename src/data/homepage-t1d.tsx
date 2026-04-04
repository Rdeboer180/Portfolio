import React from 'react';
import type { TargetedHomepageContent } from './homepage-sleeper';

const t1dContent: TargetedHomepageContent = {
  meta: {
    slug: 'homepage_t1d',
    company: 'Dexcom',
  },

  hero: {
    eyebrow: 'Senior Web Designer by title but I\u2019m also a',
    roles: ['Visual Product Designer', 'Design Systems Architect', 'UX Engineer'],
    headline: '',
    body: (
      <>
        I design and build high-fidelity product experiences with a systems-first approach&mdash;combining UX, front-end coding, and design systems to turn complex ideas into scalable, production-ready solutions. <span className="about__highlight">No single piece of technology has been more influential in my life and wellbeing than Dexcom&mdash;I&rsquo;m looking to shift 16 years of design craft toward a product I trust, use daily, and want to help elevate.</span>
      </>
    ),
  },

  about: {
    title: 'This One Is Personal',
    paragraphs: [
      (
        <>
          <span className="about__highlight">Part designer, part front-end thinker, part systems builder</span>&mdash;I do my best work where craft, strategy, and implementation meet. For the last 16 years, what&rsquo;s set me apart hasn&rsquo;t been just visual taste&mdash;it&rsquo;s been the ability to <span className="about__highlight">define the real problem, work within real constraints, and understand how the final product actually gets made.</span>
        </>
      ),
      'I\u2019ve lived with Type 1 Diabetes for over 20 years, and for the last 10 of those Dexcom has been part of my daily life\u2014worn on my body, checked on my phone, factored into every decision I make about my health. But it goes beyond just wearing the sensor. I spend a significant amount of my personal time diving into medical and metabolic literature, watching lectures, and listening to podcasts to deepen my understanding of the disease and sharpen my own treatment. I also maintain a custom-coded branch of the Loop app\u2014an open-source closed-loop insulin delivery system that integrates directly with my Dexcom CGM. Managing T1D isn\u2019t just something I do\u2014it\u2019s a discipline I\u2019m deeply invested in.',
      'That\u2019s why this isn\u2019t just a job application\u2014it\u2019s a career shift I\u2019ve been thinking about for a long time. I\u2019ve spent 16 years building scalable UI systems, design systems, and production-ready front-end code. Now I want to point all of that toward a brand and product I genuinely trust and want to help elevate. No piece of technology has had more impact on my daily life than Dexcom, and I want to bring my best work to the team behind it.',
      'At Tire Rack, I built and maintained component libraries and design systems in Figma that powered UI across multiple retail brands. I owned the front-end template layer end-to-end\u2014writing the SCSS, building CMS components, and documenting patterns so the broader team could ship consistently. What I designed is what shipped. I\u2019m ready to bring that same discipline to a product where the stakes are personal.',
      (
        <>
          <span className="about__highlight">AI is changing how quickly ideas can be explored, designed, and shipped&mdash;but without strategy behind the work and the prompt, the product won&rsquo;t stand out.</span> I&rsquo;ve spent time getting ahead of that curve, actively using LLM workflows to explore faster and push ideas further. But I don&rsquo;t see that as a long-term edge&mdash;it&rsquo;s quickly becoming the expectation.
        </>
      ),
      'The real separation will come from designers who can think beyond the output\u2014who know how to guide the tools, pressure test what they produce, and push the work further than expected. That\u2019s where I do my best work: bringing clear thinking, high standards, and uncommon care to the final product.',
      'That\u2019s a big part of why I feel so well matched for where the industry is now\u2014bringing together design taste, systems thinking, technical understanding, and a genuine love for making things better than they need to be.',
    ],
    stats: [
      { value: '20+', label: 'Years living with Type 1 Diabetes' },
      { value: '10+', label: 'Years as a Dexcom user' },
      { value: '16+', label: 'Years designing professionally' },
      { value: '50+', label: 'Design system components built' },
    ],
  },

  whyCompany: {
    badgeLabel: 'Why Dexcom',
    title: 'Where My Work and My Life Converge',
    subtitle: 'This isn\u2019t just another application\u2014it\u2019s a deliberate shift toward a product I\u2019ve trusted with my health for over a decade.',
    intro: 'Here\u2019s where my experience aligns with what Dexcom\u2019s Global Product Design team needs.',
    points: [
      {
        title: 'More Than a User\u2014an Advocate',
        body: 'I\u2019ve worn a Dexcom CGM for over 10 years and I spend my personal time studying the metabolic science behind the data it shows me. I understand the micro-interactions, the trust signals, and the moments where UI clarity impacts real decisions\u2014because I live them every day. That kind of product intuition can\u2019t be onboarded.',
      },
      {
        title: 'Visual Craft Is the Work',
        body: 'Typography, spacing, hierarchy, component consistency\u2014these aren\u2019t finishing touches, they\u2019re the system. Dexcom\u2019s 23+ international design awards reflect a team that takes visual quality seriously. That\u2019s the standard I want to contribute to.',
      },
      {
        title: 'Design Systems at Scale',
        body: 'At Tire Rack, I built component libraries and token systems in Figma that powered production UI across multiple retail brands. I documented patterns, governed usage, and worked hand-in-hand with engineering to maintain consistency. I\u2019d bring that same infrastructure-first approach to Dexcom\u2019s design system.',
      },
      {
        title: 'Design-to-Code Accountability',
        body: 'I write production front-end code and have spent years ensuring design fidelity through implementation. Fewer redlines, fewer surprises, better outcomes. When the GPD team needs confidence that what\u2019s designed is what ships\u2014that\u2019s where I operate.',
      },
      {
        title: 'Edge Cases Aren\u2019t Afterthoughts',
        body: 'In products people rely on for health decisions, the edge case is often the most critical case. I\u2019m trained to design for real-world constraints, failure states, and accessibility\u2014not just the happy path.',
      },
      {
        title: 'Design Diplomacy',
        body: 'Dexcom\u2019s posting asks for a design diplomat\u2014someone who socializes ideas, gains alignment, and finds solutions collaboratively. That matches how I\u2019ve worked for years: building relationships across design, engineering, UX, and analytics, and creating documentation that helps teams ship without bottlenecks.',
      },
    ],
  },

  skills: {
    title: 'What I Bring',
    subtitle: 'Visual craft, systems discipline, and the front-end fluency to ensure it all holds in production.',
    intro: 'High-fidelity UI, scalable design systems, cross-platform awareness, and the collaborative instinct to elevate a team.',
    categories: [
      {
        title: 'Visual Product Design',
        skills: ['High-Fidelity UI & Visual Craft', 'Typography & Spacing Systems', 'Information Hierarchy & Clarity', 'Responsive & Multi-Surface Design', 'End-to-End Design Ownership'],
      },
      {
        title: 'Design Systems',
        skills: ['Component Library Architecture', 'Design Token Management', 'Figma Variables & Styles', 'Documentation & Governance', 'Atomic Design Methodology'],
      },
      {
        title: 'Collaboration & Quality',
        skills: ['Engineering Partnership & Handoff', 'Edge Case & Error State Design', 'Cross-Functional Facilitation', 'Stakeholder Alignment & Diplomacy', 'Mentoring & Design Reviews'],
      },
      {
        title: 'Front-End Fluency',
        skills: ['SCSS/CSS & BEM Architecture', 'HTML5 & Responsive Design', 'Design-to-Code Parity', 'CMS Component Development', 'Git Workflow'],
      },
      {
        title: 'Craft & Standards',
        skills: ['Accessibility-First Design (WCAG)', 'Performance-Conscious Design', 'AI-Augmented Design Workflows', 'Brand Identity & Visual Systems', 'Platform-Aware UI Patterns'],
      },
    ],
  },

  faq: {
    title: 'Questions Worth Answering',
    intro: 'What a hiring team at Dexcom might want to know\u2014answered directly.',
    items: [
      {
        question: 'Why Dexcom?',
        answer: (
          <>
            <p>Because this isn&rsquo;t a casual interest&mdash;it&rsquo;s personal. I&rsquo;ve worn a Dexcom CGM for over a decade, and I spend a significant amount of my free time studying the metabolic science behind the data it shows me. I read the research, follow the podcasts, and actively work to deepen my understanding of T1D management. No piece of technology has had more impact on my daily life.</p>
            <p>I want to shift my career toward a brand and product I genuinely trust. Dexcom is broadening its vision beyond diabetes into broader health&mdash;G7, Stelo, and whatever comes next. That ambition, combined with a GPD team that&rsquo;s earned 23+ international design awards, is exactly where I want to put my work.</p>
          </>
        ),
      },
      {
        question: 'Your background is web-focused. Can you design for native mobile?',
        answer: (
          <>
            <p>I want to be straightforward: my production experience has been in responsive web, CMS platforms, and design systems&mdash;not native iOS or Android apps. I haven&rsquo;t shipped a native mobile product.</p>
            <p>That said, the core skills transfer directly: visual design, systems thinking, component architecture, typography, spacing, hierarchy, and design-to-code collaboration. I&rsquo;m familiar with Material Design and iOS HIG conventions, and I understand platform-specific constraints. Native mobile design would be a growth area&mdash;and one I&rsquo;m motivated to invest in, especially for a product I already use on my phone every day.</p>
          </>
        ),
      },
      {
        question: 'What does "visual product design" mean to you?',
        answer: 'It means the details are the design. Typography, spacing, color, hierarchy, component consistency&mdash;these aren\u2019t finishing touches, they\u2019re the system. In a product like Dexcom\u2019s, where someone glances at a screen and makes a health decision based on what they see, visual precision is functional precision. That\u2019s the standard I hold myself to.',
      },
      {
        question: 'How do you approach design systems?',
        answer: 'I treat them like infrastructure. At Tire Rack, I built component libraries and token systems in Figma that powered UI across multiple retail brands. I documented patterns, governed usage, and worked with engineering to ensure parity between design and code. I\u2019ve been both a systems contributor and a systems user\u2014I know what makes a design system actually get adopted.',
      },
      {
        question: 'How do you work with engineering?',
        answer: 'Closely. I write production front-end code, so I understand implementation constraints firsthand. But more importantly, I invest in the relationship\u2014building shared language, documenting decisions, and staying involved through implementation to make sure what ships matches what was designed. I\u2019m not a designer who hands off and walks away.',
      },
      {
        question: 'What drives you outside of work?',
        answer: (
          <>
            <p>People first. I married my high school sweetheart Stephanie&mdash;we&rsquo;ve now spent more than half our lives together&mdash;and our two kids are the center of everything. Weekends usually mean the park, the zoo, or wherever the next national park road trip takes us.</p>
            <p>Outside of family, diabetes management is genuinely one of my deepest interests. I maintain a custom-coded branch of the Loop app&mdash;an open-source closed-loop insulin delivery system that integrates with my Dexcom CGM. I read medical and metabolic research, follow endocrinology podcasts, and stay close to the science behind the numbers on my screen. It&rsquo;s equal parts health management, engineering hobby, and personal mission. The line between what I care about professionally and personally has always been blurry&mdash;Dexcom sits right at that intersection.</p>
          </>
        ),
      },
    ],
  },

  footer: {
    eyebrow: 'Let\u2019s talk about improving the products people depend on',
    tagline: 'T1D for 20+ years \u00b7 Dexcom user for 10+ \u00b7 Designer for 16',
  },
};

export default t1dContent;
