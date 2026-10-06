import React from 'react';
import { Link } from 'react-router-dom';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { RESUME, ResumeBullet, ResumeEntry } from '../data/resume';
import { usePageMeta } from '../hooks/usePageMeta';

const CONTACT = {
  firstName: 'Ryan',
  lastName: 'DeBoer',
  email: SITE.email,
  city: 'Granger, IN',
  title: RESUME.title,
  portfolioUrl: SITE.portfolioUrl,
  linkedinUrl: SITE.linkedinUrl,
};

const BulletCopy: React.FC<{ bullet: ResumeBullet }> = ({ bullet }) => {
  const index = bullet.emphasis ? bullet.text.indexOf(bullet.emphasis) : -1;
  if (!bullet.emphasis || index < 0) return <>{bullet.text}</>;
  return <>{bullet.text.slice(0, index)}<strong>{bullet.emphasis}</strong>{bullet.text.slice(index + bullet.emphasis.length)}</>;
};

const Entry: React.FC<{ entry: ResumeEntry }> = ({ entry }) => (
  <div className="resume-page__job">
    <h3><strong>{entry.name}</strong> · {entry.title}{entry.location && <span className="resume-page__location"> · {entry.location}</span>}</h3>
    <p className="resume-page__date">{entry.dates}</p>
    {entry.summary && <p>{entry.summary}</p>}
    <ul>{entry.bullets.map(bullet => <li key={bullet.text}><BulletCopy bullet={bullet} /></li>)}</ul>
    {entry.href && <p className="resume-page__project-link"><Link to={entry.href}>{entry.name} case study →</Link></p>}
  </div>
);

const ResumePage: React.FC = () => {
  usePageMeta({
    title: 'Résumé — Ryan DeBoer, Product Designer',
    description: 'Product designer connecting product design, design systems, and implementation across ecommerce, dealer platforms, and independent products.',
    canonical: `${SITE.portfolioUrl}/resume/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'profile',
  });

  const handleDownloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD', 'VERSION:3.0', `N:${CONTACT.lastName};${CONTACT.firstName};;;`,
      `FN:${CONTACT.firstName} ${CONTACT.lastName}`, `TITLE:${CONTACT.title}`,
      `EMAIL;TYPE=INTERNET,PREF:${CONTACT.email}`, `URL:${CONTACT.portfolioUrl}`,
      `X-SOCIALPROFILE;TYPE=linkedin:${CONTACT.linkedinUrl}`, `ADR;TYPE=HOME:;;;${CONTACT.city};;;;`, 'END:VCARD',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ryan_DeBoer.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="resume-page">
      <nav className="resume-page__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="resume-page__nav-logo">Ryan DeBoer</Link>
        <div className="resume-page__nav-actions">
          <a className="btn btn--primary btn--md resume-page__download-btn" href={RESUME.downloadHref} download={RESUME.downloadFilename}>Download résumé <span className="resume-page__download-format">PDF</span></a>
          <button className="btn btn--secondary btn--md resume-page__vcard-btn" onClick={handleDownloadVCard}>Save contact</button>
          <Link to={getHomeHref()} className="resume-page__nav-back">&larr; Back to Portfolio</Link>
        </div>
      </nav>

      <div className="resume-page__canvas">
        <article className="resume-page__paper" aria-labelledby="resume-name">
          <header className="resume-page__header">
            <h1 id="resume-name" className="resume-page__name">Ryan DeBoer</h1>
            <p className="resume-page__role">{CONTACT.title}</p>
            <div className="resume-page__contact">
              <span>Portfolio: <a href={CONTACT.portfolioUrl}>{CONTACT.portfolioUrl.replace(/^https?:\/\//, '')}</a> | Pass: #showWork</span>
              <span>{CONTACT.city} · US Remote · Eastern Time · <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
              <a href={CONTACT.linkedinUrl}>{CONTACT.linkedinUrl.replace(/^https?:\/\//, '')}</a>
            </div>
          </header>

          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Summary</h2>
            <p>{RESUME.summary}</p>
          </section>

          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Skills</h2>
            {RESUME.skills.map(skill => <p key={skill.label}><strong>{skill.label}:</strong> {skill.text}</p>)}
          </section>

          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Experience</h2>
            {RESUME.experience.map(entry => <Entry key={`${entry.name}-${entry.title}`} entry={entry} />)}
          </section>

          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Projects</h2>
            {RESUME.projects.map(entry => <Entry key={entry.name} entry={entry} />)}
          </section>

          <section className="resume-page__section resume-page__education">
            <h2 className="resume-page__section-title">Education</h2>
            {RESUME.education.map(line => <p key={line}>{line}</p>)}
          </section>
          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Selected work &amp; recommendations</h2>
            <ul className="resume-page__work-links">
              <li><Link to="/work/wheelrack/">WheelRack</Link></li>
              <li><Link to="/work/tire-categories/">Tire categories</Link></li>
              <li><Link to="/#systems">Systems overview</Link></li>
            </ul>
            <p className="resume-page__note">Employer-work case studies use the portfolio password above.</p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default ResumePage;
