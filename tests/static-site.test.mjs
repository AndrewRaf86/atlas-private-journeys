import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('../', import.meta.url);
const routes = ['', 'lima-airport-transfer', 'private-guide-lima', 'lima-bachelor-party',
  'brazil-private-journeys', 'brazil-bachelor-party', 'privacy-policy', 'terms-of-service', 'cancellation-policy'];
const read = (file) => fs.readFileSync(new URL(file, root), 'utf8');
const text = (html) => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')
  .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const pages = routes.map(route => ({ route, html: read(route ? `${route}/index.html` : 'index.html') }));

test('all production routes keep unique metadata, canonical URLs and one h1', () => {
  const titles = new Set(), descriptions = new Set();
  for (const { route, html } of pages) {
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = html.match(/<meta name="description" content="([^"]*)"/s)?.[1];
    assert(title && !titles.has(title), route + ' unique title'); titles.add(title);
    assert(description && !descriptions.has(description), route + ' unique description'); descriptions.add(description);
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    assert.equal(canonical, 'https://www.atlasjourneys.world/' + route);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, route + ' h1');
    assert(!/noindex|\.vercel\.app|VERIFIED_GOOGLE|lorem ipsum|\bTODO\b/i.test(html), route + ' placeholder/robots');
  }
});

test('local links, fragments, images, styles and scripts resolve', () => {
  for (const { route, html } of pages) {
    for (const [, raw] of html.matchAll(/(?:src|href)="([^" ]+)"/g)) {
      const url = new URL(raw.replace(/&amp;/g, '&'), 'https://www.atlasjourneys.world/' + route);
      if (url.origin !== 'https://www.atlasjourneys.world' || url.pathname.startsWith('/_vercel/')) continue;
      let file = new URL('.' + url.pathname, root);
      assert(fs.existsSync(file), `${route}: missing ${url.pathname}`);
      if (fs.statSync(file).isDirectory()) file = new URL('index.html', file.href.endsWith('/') ? file : file.href + '/');
      assert(fs.existsSync(file), `${route}: missing index ${url.pathname}`);
      if (url.hash && path.extname(file.pathname) === '.html') {
        const target = fs.readFileSync(file, 'utf8');
        assert(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: missing ${url.hash}`);
      }
    }
  }
});

test('structured data parses and every FAQ schema answer matches visible text', () => {
  for (const { route, html } of pages) {
    for (const [, data] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const schema = JSON.parse(data);
      for (const entity of schema['@graph'] || [schema]) {
        if (entity['@type'] !== 'FAQPage') continue;
        const visible = new Map([...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)]
          .map(([, q, a]) => [text(q), text(a)]));
        for (const question of entity.mainEntity) {
          assert.equal(visible.get(question.name), question.acceptedAnswer.text, `${route}: FAQ ${question.name}`);
        }
      }
    }
  }
});

test('contact links preserve the approved number and all pages use the shared tracker', () => {
  for (const { route, html } of pages) {
    for (const [, number] of html.matchAll(/https:\/\/wa.me\/(\d+)/g)) assert.equal(number, '51942299829');
    assert(html.includes('/assets/atlas-grid.js'), route + ' shared script');
    assert(html.includes('/_vercel/insights/script.js'), route + ' analytics script');
  }
});

test('crawler files retain production URLs and core sitemap routes', () => {
  const robots = read('robots.txt'), sitemap = read('sitemap.xml'), llms = read('llms.txt');
  assert.match(robots, /User-agent: OAI-SearchBot\s+Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/www.atlasjourneys.world\/sitemap.xml/);
  for (const route of routes) assert(sitemap.includes(`<loc>https://www.atlasjourneys.world/${route}</loc>`));
  assert(!/\.vercel\.app/.test(llms + sitemap));
});
