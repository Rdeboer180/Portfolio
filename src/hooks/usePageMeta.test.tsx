/* Document metadata requires direct head inspection. */
/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render } from '@testing-library/react';
import { PageMeta, usePageMeta } from './usePageMeta';
import { AUTHOR, PERSON_ID, SEARCH_META } from '../data/seo';

const origin = 'https://www.rdeboerdesigns.com';
const home = { ...SEARCH_META.home, canonical: `${origin}/` };
const note: PageMeta = {
  title: 'AEM authoring | Ryan DeBoer',
  canonical: `${origin}/notes/aem-meeting-authors-where-they-work/`,
  jsonLd: { '@context': 'https://schema.org', '@type': 'BlogPosting', author: AUTHOR },
};
const schema = () => Array.from(document.head.querySelectorAll('script[type="application/ld+json"]'))
  .map(script => JSON.parse(script.textContent || '{}'));

function Metadata({ meta, enabled = true }: { meta: PageMeta; enabled?: boolean }) {
  usePageMeta(meta, undefined, enabled);
  return null;
}

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  document.head.querySelectorAll('script[type="application/ld+json"], meta, link[rel="canonical"]').forEach(el => el.remove());
});

test('hydration replaces prerendered metadata and keeps one shared author', () => {
  const oldPage = document.createElement('script');
  oldPage.type = 'application/ld+json';
  oldPage.setAttribute('data-page-jsonld', '');
  oldPage.textContent = JSON.stringify({ '@type': 'WebPage', name: 'Old title' });
  document.head.appendChild(oldPage);
  render(<Metadata meta={home} />);

  expect(document.title).toBe(SEARCH_META.home.title);
  expect(schema()).toHaveLength(2);
  expect(schema().find(item => item['@type'] === 'Person')['@id']).toBe(PERSON_ID);
  expect(schema().find(item => item['@type'] === 'WebPage').name).toBe(SEARCH_META.home.title);
});

test('a mounted background route cannot overwrite the note in the address bar', () => {
  window.history.replaceState(null, '', '/notes/aem-meeting-authors-where-they-work/');
  const view = render(<><Metadata meta={note} /><Metadata meta={home} /></>);
  view.rerender(<><Metadata meta={note} /><Metadata meta={{ ...home, title: 'Background updated' }} /></>);

  expect(document.title).toBe(note.title);
  expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', note.canonical);
  expect(schema().map(item => item['@type'])).toEqual(['Person', 'BlogPosting']);
  expect(schema()[1].author['@id']).toBe(PERSON_ID);
});

test('returning home replaces article schema and removes stale social metadata', () => {
  window.history.replaceState(null, '', '/notes/aem-meeting-authors-where-they-work');
  const view = render(<Metadata meta={{ ...note, ogImage: `${origin}/note.jpg`, ogType: 'article' }} />);
  window.history.replaceState(null, '', '/');
  view.rerender(<Metadata meta={home} />);

  expect(schema().map(item => item['@type'])).toEqual(['Person', 'WebPage']);
  expect(document.title).toBe(home.title);
  expect(document.head.querySelector('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  expect(document.head.querySelector('meta[property="og:image"]')).toBeNull();
});

test('closing nested case-study detail does not remove the parent page schema', () => {
  const view = render(<><Metadata meta={home} /><Metadata meta={home} enabled={false} /></>);
  view.rerender(<Metadata meta={home} />);
  expect(schema().map(item => item['@type'])).toEqual(['Person', 'WebPage']);
});
