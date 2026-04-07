import React from 'react';
import type { TargetedHomepageContent } from './homepage-sleeper';

const insuletContent: TargetedHomepageContent = {
  meta: {
    slug: 'homepage_insulet',
    company: 'Insulet',
  },

  hero: {
    eyebrow: 'Senior Web Designer by title.',
    roles: ['Design Strategist', 'Front-End Developer', 'Design System Engineer'],
    headline: '',
    body: (
      <>
        Job titles evolve, but the work doesn&rsquo;t. For 16+ years, I&rsquo;ve worked at the intersection of UX, front-end, and design systems&mdash;crafting experiences that don&rsquo;t just look right, but hold up in production. I do my best work where high standards, real collaboration, and thoughtful execution all matter at the same time. My strength is connecting those pieces and turning complexity into something teams can ship and scale. <span className="about__highlight">I&rsquo;m ready to bring 16 years of technical web craft to a brand whose product I&rsquo;ve depended on for over a decade.</span>
      </>
    ),
  },

  about: {
    title: 'Built for This Kind of Work',
    paragraphs: [
      (
        <>
          <span className="about__highlight">Part designer, part front-end thinker, part systems builder</span>&mdash;I do my best work where craft, strategy, and implementation meet. For the last 16 years, what&rsquo;s set me apart hasn&rsquo;t been just visual taste&mdash;it&rsquo;s been the ability to <span className="about__highlight">define the real problem, work within real constraints, and understand how the final product actually gets made.</span>
        </>
      ),
      'Early in my career, I was hired for design instinct, visual craft, and strategic thinking. But I knew that if I wanted to build the kind of work I admired, I needed deeper technical fluency. So I closed that gap the same way I approach everything else: reps, curiosity, experimentation, and a lot of time spent learning by doing. Over time, that turned me into the kind of designer who can spot what feels off, understand why, and help fix it at the system level.',
      'I\u2019ve lived with Type 1 Diabetes for over 20 years. For more than a decade, the Omnipod has been part of how I manage it\u2014alongside Dexcom CGM technology. Insulet\u2019s mission isn\u2019t abstract to me. I\u2019ve experienced what it means when a medical product works well, and what it means when the digital experience around it falls short. I want to help close that gap.',
      'My career has been rooted in technical digital execution\u2014not just design. At Tire Rack, I worked inside a large-scale AEM (Adobe Experience Manager) CMS environment, managing content updates, building reusable components, and shipping campaigns across web and email channels in a complex, multi-stakeholder organization. I worked closely with marketing, analytics, SEO, and engineering teams to keep digital channels accurate, performant, and on-brand.',
      'I\u2019m comfortable moving between design tools and code. I write HTML and CSS daily, I understand email service platform workflows, and I have hands-on experience with metadata, structured content, and digital governance. I bring both creative capability and operational discipline\u2014which is exactly what the HCP Digital Marketing role at Insulet requires.',
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
      { value: '10+', label: 'Years as an Omnipod user' },
      { value: '16+', label: 'Years in digital design & development' },
      { value: '5+', label: 'Years in enterprise CMS environments' },
    ],
  },

  whyCompany: {
    badgeLabel: 'Why Insulet',
    title: 'Where My Skills and My Story Meet',
    subtitle: 'I\u2019ve been managing T1D with Omnipod for over a decade. I know this product\u2014and I want to help build the digital experience around it.',
    intro: 'Here\u2019s where my background maps directly to what the HCP Digital Marketing team needs.',
    points: [
      {
        title: 'I\u2019ve Used the Product for Over a Decade',
        body: 'The Omnipod is part of how I manage my Type 1 Diabetes every day. I understand what it means when a medical brand earns trust\u2014and when its digital experience reinforces or undermines that trust. I\u2019m not learning the mission from a brief. I\u2019ve been living it.',
      },
      {
        title: 'Enterprise CMS Experience',
        body: 'I spent years working inside Adobe Experience Manager (AEM)\u2014one of the most complex CMS platforms in use at enterprise scale. I managed content updates, built component templates, and coordinated with marketing and engineering teams to keep web pages accurate, compliant, and on-brand.',
      },
      {
        title: 'HTML & Email Execution',
        body: 'I write production HTML and CSS daily. I understand email template structure, rendering constraints, and the discipline required to ship flawless inbox experiences. I\u2019ve built and maintained reusable templates in environments where accuracy and compliance are non-negotiable.',
      },
      {
        title: 'Cross-Functional by Default',
        body: 'At Tire Rack I worked across marketing, SEO, analytics, UX, and engineering teams simultaneously. I know how to act as a liaison between strategy, creative, and technical stakeholders\u2014keeping projects moving and channels performing without losing alignment.',
      },
      {
        title: 'Design Skills That Support Execution',
        body: 'Most digital marketers can manage tools. Fewer can also create and refine creative assets. My background in Figma, Photoshop, and Illustrator means I can support design needs directly\u2014reducing agency dependency and accelerating execution.',
      },
      {
        title: 'Regulated Industry Mindset',
        body: 'I understand the discipline required to ship digital content in regulated environments. I\u2019ve worked within structured approval workflows, maintained version control, and ensured brand and compliance standards are met across every digital touchpoint.',
      },
    ],
  },

  skills: {
    title: 'What I Bring to the Role',
    subtitle: 'Technical execution, creative capability, and the operational discipline to ship compliant digital content across channels.',
    intro: 'Web, email, CMS, design, analytics\u2014I work across the full digital execution stack.',
    categories: [
      {
        title: 'Web & CMS Execution',
        skills: ['Adobe Experience Manager (AEM)', 'Web Content Management', 'HTML5 & CSS / SCSS', 'Component-Based Page Building', 'SEO & Metadata Management'],
      },
      {
        title: 'Email Marketing',
        skills: ['Email Template Development', 'Campaign Build & QA', 'Dynamic Content & Segmentation', 'Inbox Rendering Standards', 'CAN-SPAM & Compliance Awareness'],
      },
      {
        title: 'Design & Creative',
        skills: ['Figma (High-Fidelity Design)', 'Adobe Photoshop & Illustrator', 'Brand & Visual Systems', 'Design-to-Code Parity', 'Asset Creation & Management'],
      },
      {
        title: 'Collaboration & Operations',
        skills: ['Cross-Functional Stakeholder Management', 'Content Calendar Coordination', 'Project & Timeline Management', 'Digital Governance & Version Control', 'Regulatory Workflow Navigation'],
      },
      {
        title: 'Analytics & Performance',
        skills: ['Campaign Performance Reporting', 'Analytics Platform Familiarity (GA4)', 'A/B Testing Support', 'Link Tracking & UTM Management', 'Data-Informed Optimization'],
      },
    ],
  },

  faq: {
    title: 'Questions Worth Answering',
    intro: 'What a hiring team at Insulet might want to know\u2014answered directly.',
    items: [
      {
        question: 'Why Insulet?',
        answer: (
          <>
            <p>Because I&rsquo;ve been an Omnipod user for over a decade. Insulet&rsquo;s mission isn&rsquo;t something I&rsquo;m learning from a job description\u2014it&rsquo;s something I live every day. Managing Type 1 Diabetes for 20+ years has given me a firsthand understanding of what it means when a medical brand builds digital experiences that work, and when they don&rsquo;t.</p>
            <p>I want to bring my technical and creative skills to a brand I genuinely believe in. The Associate Manager, HCP Digital Marketing role sits exactly at the intersection of execution, collaboration, and healthcare communication\u2014and that&rsquo;s where I do my best work.</p>
          </>
        ),
      },
      {
        question: 'Your background is in design. Is this a pivot?',
        answer: (
          <>
            <p>Partially\u2014but less of a leap than it might appear. My day-to-day has always included digital marketing execution: building components in AEM, shipping content updates, coordinating with marketing teams, managing web channel accuracy. The design layer is what I&rsquo;m known for, but the operational and technical execution has always been part of the work.</p>
            <p>What I&rsquo;m shifting is the emphasis\u2014from design-led to execution-led. I&rsquo;m motivated to do that because of the company, the mission, and the fit of the role.</p>
          </>
        ),
      },
      {
        question: 'Have you worked in regulated industries?',
        answer: 'Yes. At Tire Rack, I operated inside structured approval workflows, brand compliance standards, and multi-stakeholder review processes. I understand the discipline required to ship digital content when accuracy, brand consistency, and compliance are non-negotiable. Healthcare adds additional rigor\u2014and that\u2019s something I take seriously, especially given my personal stake in the space.',
      },
      {
        question: 'What\u2019s your experience with email marketing platforms?',
        answer: 'My deepest experience is in HTML email development\u2014building and maintaining templates that render consistently across clients, with dynamic content and reusable structure. I\u2019ve worked within CMS and marketing automation environments, though Salesforce Marketing Cloud specifically would be an area of growth for me. I pick up platforms quickly, and I have the foundational skills to ramp fast.',
      },
      {
        question: 'How do you handle competing priorities across multiple stakeholders?',
        answer: 'That\u2019s been a constant in my career. At Tire Rack I balanced work across marketing, SEO, UX, analytics, and engineering teams simultaneously. I default to clear documentation, proactive communication, and keeping alignment visible across functions. I&rsquo;m comfortable as a liaison between strategy, creative, and technical teams\u2014that cross-functional role is where I naturally operate.',
      },
      {
        question: 'What drives you outside of work?',
        answer: (
          <>
            <p>People first. I married my high school sweetheart Stephanie\u2014we&rsquo;ve now spent more than half our lives together\u2014and our two kids are the center of everything. Weekends usually mean the park, the zoo, or wherever the next road trip takes us.</p>
            <p>Outside of family, diabetes management is genuinely one of my deepest personal interests. I maintain a custom-coded branch of the Loop app\u2014an open-source closed-loop insulin delivery system that integrates my Dexcom CGM with my Omnipod. I read medical and metabolic research, follow endocrinology podcasts, and stay close to the science behind the tools I depend on. I\u2019m not just a professional who wants to work in healthcare\u2014I\u2019m a patient who wants to improve it.</p>
          </>
        ),
      },
    ],
  },

  footer: {
    eyebrow: 'Get in touch',
    tagline: 'T1D for 20+ years \u00b7 Omnipod user for 10+ \u00b7 Digital builder for 16',
  },
};

export default insuletContent;
