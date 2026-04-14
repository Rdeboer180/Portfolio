import React from 'react';
import '../styles/styles.scss';

interface CapabilityGroup {
  title: string;
  description: string;
  capabilities: string[];
}

const CapabilitiesUX: React.FC = () => {
  const groups: CapabilityGroup[] = [
    {
      title: 'Product Systems',
      description: 'Build scalable, maintainable design language that engineering wants to implement',
      capabilities: [
        'Design Systems & Tokens—Establish shared visual language across teams',
        'Component Architecture—Define components that account for real-world states and edge cases',
        'System-Driven UX—Solve problems at the system level, not the screen level',
      ],
    },
    {
      title: 'UX + Engineering Bridge',
      description: 'Close the gap between ambitious design and buildable systems',
      capabilities: [
        'Front-End Aware Design—Design within real CSS/HTML constraints; collaborate during implementation',
        'High-Fidelity Prototyping—Validate concepts before building; explore rapidly with code and tools',
        'Design-to-Code Alignment—Own the translation; ensure design intent survives implementation',
      ],
    },
    {
      title: 'Strategic Problem Solving',
      description: 'Navigate ambiguity and translate across disciplines',
      capabilities: [
        'Ambiguity Navigation—Take vague product challenges and break them into solvable design problems',
        'Constraint-Based Design—Design for real-world limitations: performance, accessibility, technical debt',
        'Cross-Functional Leadership—Translate between product, design, and engineering without losing nuance',
      ],
    },
    {
      title: 'Rapid Exploration (AI-Native)',
      description: 'Accelerate ideation and validation using modern tools',
      capabilities: [
        'AI-Accelerated Ideation—Use Claude and Cursor to expand concept exploration',
        'Iterative Validation—Test ideas quickly; prioritize what matters',
        'Human Judgment First—AI augments exploration; human judgment drives decisions',
      ],
    },
  ];

  return (
    <section className="capabilities-section">
      <div className="capabilities-section__container">
        <h2 className="capabilities-section__heading">What I Actually Do</h2>

        <div className="capabilities-section__groups">
          {groups.map((group, idx) => (
            <div key={idx} className="capabilities-section__group">
              <h3 className="capabilities-section__group-title">{group.title}</h3>
              <p className="capabilities-section__group-description">{group.description}</p>
              <ul className="capabilities-section__list">
                {group.capabilities.map((cap, capIdx) => (
                  <li key={capIdx}>
                    <strong>{cap.split('—')[0]}—</strong>
                    {cap.split('—')[1]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="capabilities-section__tools">
          <h3 className="capabilities-section__tools-heading">Core Tools</h3>
          <p className="capabilities-section__tools-text">
            Figma (variables, components, design systems), HTML/CSS, React, Storybook, Adobe Experience Manager (AEM), Claude, Cursor, Figma Make
          </p>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesUX;
